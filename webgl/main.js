// main.js
import * as THREE from 'three';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';
import { exportMindMapToPDF } from './pdfExport.js'; // Importa a função de exportação

// NOVO: Versão do programa atualizada com correções de exportação e novo tema.
const APP_VERSION = 'v1.2.1 - PDF Export Fix & Light Theme';

// --- 1. CONFIGURAÇÕES CENTRALIZADAS (TEMA CLARO) ---
const CONFIG = {
    backgroundColor: 0xF4F4F5, // Fundo cinza muito claro
    nodeColors: [
        0xFFFFFF, // Branco
        0xFFFFFF, // Branco
        0xFFFFFF, // Branco
        0xFFFFFF, // Branco
        0xFFFFFF, // Branco
        0xFFFFFF  // Branco
    ],
    linkColor: 0x4B5563, // Cinza escuro para as conexões
    dragHandleColor: 0x111827, // Preto para o manipulador de arrastar
    textColor: 0x111827, // Preto para o texto
    font: {
        size: 16, // Um pouco maior para melhor legibilidade
    },
    padding: { x: 20, y: 10 }, // Aumenta ligeiramente o preenchimento interno do nó
    borderRadius: 12, // Cantos mais arredondados para um toque suave
    dragHandleRadius: 6, // Um pouco menor e mais discreto
    zoom: {
        speed: 0.2, // Velocidade de zoom para roda do mouse e pinça (ajustável)
        min: 0.05,  // Permite mais zoom out (mais longe)
        max: 8,     // Permite mais zoom in (mais perto)
    },
    horizontalNodePadding: 70, // Base padding between nodes horizontally
    verticalNodeSpacing: 50, // Vertical spacing between parent and child nodes
    depth1HorizontalOffset: 80 // Offset fixo para nós na profundidade 1
};

/**
 * Geometria para um retângulo com cantos arredondados.
 * @param {number} width - Largura do retângulo.
 * @param {number} height - Altura do retângulo.
 * @param {number} radius - Raio do canto.
 * @returns {THREE.ShapeGeometry}
 */
function createRoundedRectGeometry(width, height, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2, y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    return new THREE.ShapeGeometry(shape);
}

class MindMapViewer {
    constructor(container, data) {
        this.container = container;
        this.data = data;

        // --- Estado ---
        this.nodeMap = new Map();
        this.linkObjects = [];
        this.dragHandles = [];
        this.selectedNode = null;
        this.offset = new THREE.Vector3();
        this.isDraggingNode = false;
        this.initialIntersectionPoint = new THREE.Vector3();

        // --- Variáveis de Estado para Controle de Câmera Personalizado ---
        this.isPanning = false;
        this.lastPointerPosition = new THREE.Vector2();

        // Variáveis para controle de toque (pinch-to-zoom)
        this._isPinching = false;
        this.initialPinchDistance = 0;
        this.initialPinchZoom = 1;
        this.pinchCenterWorld = new THREE.Vector3();

        // Variáveis para diferenciar toque de arrastar no touch
        this.initialTouchCoords = new THREE.Vector2();
        this.isConsideredClick = true;
        this.tapThreshold = 5;

        // Elementos da sidebar
        this.sidebar = document.getElementById('sidebar');
        this.sidebarTitle = document.getElementById('sidebar-title');
        this.sidebarContent = document.getElementById('sidebar-content');
        this.sidebarCloseButton = document.getElementById('sidebar-close');
        this.isSidebarOpen = false;

        this._initScene();
        this._initEventListeners();
        this._createVersionInfo();

        this.drawMindMap();
        this.animate();
    }

    // --- MÉTODOS DE INICIALIZAÇÃO ---

    _initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.backgroundColor);

        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2,
            1, 1000
        );
        this.camera.position.z = 150;
        this.camera.zoom = 1;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.mainGroup = new THREE.Group();
        this.scene.add(this.mainGroup);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    _initEventListeners() {
        window.addEventListener('resize', this._onWindowResize.bind(this));
        // EVENTOS DE MOUSE
        this.renderer.domElement.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this._onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this._onMouseUp.bind(this));
        this.renderer.domElement.addEventListener('wheel', this._onMouseWheel.bind(this), { passive: false });

        // EVENTOS DE TOQUE
        this.renderer.domElement.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });

        this.renderer.domElement.addEventListener('click', this._onNodeClick.bind(this));

        if (this.sidebarCloseButton) {
            this.sidebarCloseButton.addEventListener('click', this.closeSidebar.bind(this));
        }

        const exportButton = document.getElementById('export-pdf-button');
        if (exportButton) {
            // Chama a função exportMindMapToPDF do módulo separado
            exportButton.addEventListener('click', () => {
                exportMindMapToPDF(this.nodeMap, this.linkObjects, CONFIG, this.mainGroup.position);
            });
        }
    }

    _createVersionInfo() {
        const versionElement = document.getElementById('version-info');
        if (versionElement) {
            versionElement.textContent = `Mind Map ${APP_VERSION}`;
        } else {
            console.warn("Elemento com id 'version-info' não encontrado.");
        }
    }

    // --- LÓGICA DE CRIAÇÃO E ATUALIZAÇÃO ---

    _createNodeMesh(d3Node, direction) {
        return new Promise(resolve => {
            const nodeGroup = new THREE.Group();
            nodeGroup.userData = { d3Node: d3Node, isNode: true, direction: direction };

            const nodeColor = CONFIG.nodeColors[d3Node.depth % CONFIG.nodeColors.length];
            const textMesh = new Text();
            textMesh.text = d3Node.data.name;
            textMesh.fontSize = CONFIG.font.size;
            textMesh.color = CONFIG.textColor;
            textMesh.position.z = 0.1;
            textMesh.anchorX = direction === -1 ? 'right' : (direction === 1 ? 'left' : 'center');
            textMesh.anchorY = 'middle';

            textMesh.name = 'nodeTextMesh'

            textMesh.sync(() => {
                const bounds = textMesh.textRenderInfo.bounds;
                const textWidth = bounds ? bounds.x[1] - bounds.x[0] : d3Node.data.name.length * (CONFIG.font.size * 0.5);
                const textHeight = bounds ? bounds.y[1] - bounds.y[0] : CONFIG.font.size * 1.2;

                const rectWidth = textWidth + CONFIG.padding.x * 2;
                const rectHeight = textHeight + CONFIG.padding.y * 2;

                const rectGeo = createRoundedRectGeometry(rectWidth, rectHeight, CONFIG.borderRadius);
                const rectMat = new THREE.MeshBasicMaterial({ color: nodeColor });
                const edges = new THREE.EdgesGeometry(rectGeo);
                const lineMat = new THREE.LineBasicMaterial({ color: 0xCCCCCC, linewidth: 2 });
                const wireframe = new THREE.LineSegments(edges, lineMat);

                const rectMesh = new THREE.Mesh(rectGeo, rectMat);
                rectMesh.name = 'nodeRectMesh';
                nodeGroup.add(rectMesh);
                nodeGroup.add(wireframe);

                if (direction === 1) {
                    textMesh.position.x = -rectWidth / 2 + CONFIG.padding.x;
                } else if (direction === -1) {
                    textMesh.position.x = rectWidth / 2 - CONFIG.padding.x;
                } else {
                    textMesh.position.x = 0;
                }

                nodeGroup.add(textMesh);
                nodeGroup.userData.nodeWidth = rectWidth;
                nodeGroup.userData.nodeHeight = rectHeight;

                if (direction !== 0) {
                    const handleGeo = new THREE.CircleGeometry(CONFIG.dragHandleRadius, 32);
                    const handleMat = new THREE.MeshBasicMaterial({ color: CONFIG.dragHandleColor, transparent: true, opacity: 0.6 });
                    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
                    handleMesh.position.set((rectWidth / 2) * direction, 0, 0.2);
                    handleMesh.userData = { isDragHandle: true, nodeGroup };
                    nodeGroup.add(handleMesh);
                    this.dragHandles.push(handleMesh);
                }

                this.nodeMap.set(d3Node, nodeGroup);
                resolve(nodeGroup);
            });
        });
    }

    _createLinkMesh(linkData) {
        const sourceNodeGroup = this.nodeMap.get(linkData.source);
        const targetNodeGroup = this.nodeMap.get(linkData.target);
        if (!sourceNodeGroup || !targetNodeGroup) return;

        const sourceDir = sourceNodeGroup.userData.direction;
        const targetDir = targetNodeGroup.userData.direction;

        const start = sourceNodeGroup.position.clone();
        if (sourceDir !== 0) {
            start.x += (sourceNodeGroup.userData.nodeWidth / 2) * sourceDir;
        } else {
            start.x += (sourceNodeGroup.userData.nodeWidth / 2) * targetDir;
        }

        const end = targetNodeGroup.position.clone();
        end.x -= (targetNodeGroup.userData.nodeWidth / 2) * targetDir;

        let controlPoint1 = new THREE.Vector3();
        let controlPoint2 = new THREE.Vector3();

        if (sourceDir === 0 && targetDir !== 0) {
            controlPoint1.set(start.x + (end.x - start.x) / 2, start.y, 0);
            controlPoint2.set(end.x - (end.x - start.x) / 2, end.y, 0);
        } else {
            controlPoint1.set(start.x + 50 * sourceDir, start.y, 0);
            controlPoint2.set(end.x - 50 * targetDir, end.y, 0);
        }

        const curve = new THREE.CubicBezierCurve3(start, controlPoint1, controlPoint2, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: CONFIG.linkColor,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });

        const curveObject = new THREE.Line(geometry, material);
        curveObject.userData = { linkData, curve };
        this.linkObjects.push(curveObject);
        this.mainGroup.add(curveObject);
    }

    updateLinks() {
        for (const linkObject of this.linkObjects) {
            const { linkData } = linkObject.userData;
            const sourceNodeGroup = this.nodeMap.get(linkData.source);
            const targetNodeGroup = this.nodeMap.get(linkData.target);

            if (sourceNodeGroup && targetNodeGroup) {
                const sourceDir = sourceNodeGroup.userData.direction;
                const targetDir = targetNodeGroup.userData.direction;

                const start = sourceNodeGroup.position.clone();
                if (sourceDir !== 0) {
                    start.x += (sourceNodeGroup.userData.nodeWidth / 2) * sourceDir;
                } else {
                    start.x += (sourceNodeGroup.userData.nodeWidth / 2) * targetDir;
                }

                const end = targetNodeGroup.position.clone();
                end.x -= (targetNodeGroup.userData.nodeWidth / 2) * targetDir;

                let controlPoint1 = new THREE.Vector3();
                let controlPoint2 = new THREE.Vector3();

                if (sourceDir === 0 && targetDir !== 0) {
                    controlPoint1.set(start.x + (end.x - start.x) / 2, start.y, 0);
                    controlPoint2.set(end.x - (end.x - start.x) / 2, end.y, 0);
                } else {
                    controlPoint1.set(start.x + 50 * sourceDir, start.y, 0);
                    controlPoint2.set(end.x - 50 * targetDir, end.y, 0);
                }

                const newCurve = new THREE.CubicBezierCurve3(start, controlPoint1, controlPoint2, end);
                linkObject.geometry.setFromPoints(newCurve.getPoints(50));
                linkObject.geometry.attributes.position.needsUpdate = true;
                linkObject.userData.curve = newCurve;
            }
        }
    }

    _moveSubtree(nodeGroup, deltaPosition) {
        nodeGroup.position.add(deltaPosition);
        const d3Node = nodeGroup.userData.d3Node;
        if (d3Node && d3Node.children) {
            d3Node.children.forEach(childD3Node => {
                const childNodeGroup = this.nodeMap.get(childD3Node);
                if (childNodeGroup) {
                    this._moveSubtree(childNodeGroup, deltaPosition);
                }
            });
        }
    }

    // --- LÓGICA PRINCIPAL ---

    async drawMindMap() {
        while (this.mainGroup.children.length) {
            this.mainGroup.remove(this.mainGroup.children[0]);
        }
        this.nodeMap.clear();
        this.linkObjects = [];
        this.dragHandles = [];

        const root = hierarchy(this.data);
        const d3Links = root.links();
        const d3Nodes = root.descendants();

        const originalChildren = root.children || [];
        if (originalChildren.length > 0) {
            const leftCount = Math.ceil(originalChildren.length / 2);
            const leftChildren = originalChildren.slice(0, leftCount);
            const rightChildren = originalChildren.slice(leftCount);

            if (leftChildren.length > 0) {
                const leftRoot = hierarchy(this.data);
                leftRoot.children = leftChildren;
                const treeLayoutLeft = tree().nodeSize([CONFIG.verticalNodeSpacing, 1]); // Use fixed vertical spacing
                treeLayoutLeft(leftRoot);

                leftRoot.descendants().forEach(node => {
                    if (node.depth > 0) {
                        node.userData = node.userData || {};
                        Object.assign(node.userData, { assignedDirection: -1, d3X: node.x, d3Y: node.y });
                    } else { // Nó raiz
                        node.userData = node.userData || {};
                        Object.assign(node.userData, { assignedDirection: 0, d3X: 0, d3Y: 0 });
                    }
                    const originalNodeInD3Nodes = d3Nodes.find(n => n.data === node.data && n.depth === node.depth);
                    if (originalNodeInD3Nodes) {
                        originalNodeInD3Nodes.userData = originalNodeInD3Nodes.userData || {};
                        Object.assign(originalNodeInD3Nodes.userData, node.userData);
                    }
                });
            }

            if (rightChildren.length > 0) {
                const rightRoot = hierarchy(this.data);
                rightRoot.children = rightChildren;
                const treeLayoutRight = tree().nodeSize([CONFIG.verticalNodeSpacing, 1]); // Use fixed vertical spacing
                treeLayoutRight(rightRoot);

                rightRoot.descendants().forEach(node => {
                    if (node.depth > 0) {
                        node.userData = node.userData || {};
                        Object.assign(node.userData, { assignedDirection: 1, d3X: node.x, d3Y: node.y });
                    } else { // Nó raiz (já foi processado na esquerda ou é o único)
                        node.userData = node.userData || {};
                        Object.assign(node.userData, { assignedDirection: 0, d3X: 0, d3Y: 0 });
                    }
                    const originalNodeInD3Nodes = d3Nodes.find(n => n.data === node.data && n.depth === node.depth);
                    if (originalNodeInD3Nodes) {
                        originalNodeInD3Nodes.userData = originalNodeInD3Nodes.userData || {};
                        Object.assign(originalNodeInD3Nodes.userData, node.userData);
                    }
                });
            }

            root.children = originalChildren;
        }
        root.userData = { ...root.userData, assignedDirection: 0, d3X: 0, d3Y: 0 };


        const nodeCreationPromises = d3Nodes.map(d3Node => {
            const direction = d3Node.userData.assignedDirection;
            return this._createNodeMesh(d3Node, direction);
        });
        await Promise.all(nodeCreationPromises);

        const maxNodeWidths = {}; // { depth: { -1: maxWidthLeft, 1: maxWidthRight } }

        d3Nodes.forEach(d3Node => {
            const depth = d3Node.depth;
            const direction = d3Node.userData.assignedDirection;

            if (depth > 0) {
                if (!maxNodeWidths[depth]) {
                    maxNodeWidths[depth] = { [-1]: 0, [1]: 0 };
                }
                const nodeGroup = this.nodeMap.get(d3Node);
                if (nodeGroup && nodeGroup.userData.nodeWidth) {
                    if (direction === -1) {
                        maxNodeWidths[depth][-1] = Math.max(maxNodeWidths[depth][-1], nodeGroup.userData.nodeWidth);
                    } else if (direction === 1) {
                        maxNodeWidths[depth][1] = Math.max(maxNodeWidths[depth][1], nodeGroup.userData.nodeWidth);
                    }
                }
            }
        });

        d3Nodes.forEach(d3Node => {
            const nodeGroup = this.nodeMap.get(d3Node);
            if (!nodeGroup) return;

            const direction = nodeGroup.userData.direction;
            const nodeWidth = nodeGroup.userData.nodeWidth || 0;

            let finalNodeX = 0;
            let finalNodeY = 0;

            if (d3Node.depth === 0) {
                finalNodeX = 0;
                finalNodeY = 0;
            } else {
                finalNodeY = d3Node.userData.d3X; // d3.tree uses x for vertical and y for horizontal

                let previousDepthX = 0;
                let previousDepthMaxWidth = 0;

                if (d3Node.parent) {
                    const parentNodeGroup = this.nodeMap.get(d3Node.parent);
                    if (parentNodeGroup) {
                        previousDepthX = parentNodeGroup.position.x;
                    }
                    if (maxNodeWidths[d3Node.depth - 1]) {
                        previousDepthMaxWidth = maxNodeWidths[d3Node.depth - 1][direction] || 0;
                    }
                }

                // Lógica de cálculo de espaçamento condicional à profundidade
                if (d3Node.depth === 1) {
                    // Para profundidade 1, use um offset fixo em relação à raiz
                    const rootNodeGroup = this.nodeMap.get(root);
                    const rootWidth = rootNodeGroup ? rootNodeGroup.userData.nodeWidth : 0;

                    // Conecte-se à borda da raiz e adicione um offset fixo e metade da largura do nó atual.
                    finalNodeX = (rootWidth / 2) * direction + CONFIG.depth1HorizontalOffset * direction + (nodeWidth / 2) * direction;

                } else if (d3Node.depth >= 2) {
                    // Para profundidade 2 ou mais, use a lógica de espaçamento dinâmico
                    if (d3Node.parent) {
                        const parentNode = d3Node.parent;
                        const parentGroup = this.nodeMap.get(parentNode);
                        if (parentGroup) {
                            const parentWidth = parentGroup.userData.nodeWidth || 0;
                            const parentDir = parentGroup.userData.direction;

                            let connectionPointX = parentGroup.position.x;
                            if (parentDir !== 0) {
                                connectionPointX += (parentWidth / 2) * parentDir;
                            } else {
                                connectionPointX += (parentWidth / 2) * direction;
                            }

                            let spacingNeeded = (nodeWidth / 2) + (previousDepthMaxWidth / 2) - CONFIG.horizontalNodePadding;
                            finalNodeX = connectionPointX + (spacingNeeded * direction);
                        }
                    }
                }
            }
            nodeGroup.position.set(finalNodeX, finalNodeY, 0);
            this.mainGroup.add(nodeGroup);
        });

        d3Links.forEach(link => this._createLinkMesh(link));

        const box = new THREE.Box3().setFromObject(this.mainGroup);
        const center = box.getCenter(new THREE.Vector3());
        this.mainGroup.position.sub(center);

        this.camera.updateProjectionMatrix();
    }
    // --- MANIPULADORES DE EVENTOS ---

    _onWindowResize() {
        this.camera.left = window.innerWidth / -2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = window.innerHeight / -2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _getPointerCoordinates(event) {
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        return {
            x: (clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(clientY / this.renderer.domElement.clientHeight) * 2 + 1
        };
    }

    _onMouseWheel(event) {
        event.preventDefault();
        if (this.isSidebarOpen) return;

        this.mouse.copy(this._getPointerCoordinates(event));
        const worldPosBeforeZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);
        const zoomExponent = event.deltaY * -0.01 * CONFIG.zoom.speed;
        let newZoom = this.camera.zoom * Math.pow(2, zoomExponent);
        newZoom = Math.max(CONFIG.zoom.min, Math.min(CONFIG.zoom.max, newZoom));
        this.camera.zoom = newZoom;
        this.camera.updateProjectionMatrix();
        const worldPosAfterZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);
        const panDelta = new THREE.Vector3().subVectors(worldPosBeforeZoom, worldPosAfterZoom);
        this.camera.position.add(panDelta);
    }

    _onMouseDown(event) {
        if (this.isSidebarOpen || event.button !== 0) return;

        this.mouse.copy(this._getPointerCoordinates(event));
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.dragHandles);

        if (intersects.length > 0) {
            const handle = intersects[0].object;
            if (handle.userData.isDragHandle) {
                this.selectedNode = handle.userData.nodeGroup;
                this.isDraggingNode = true;
                const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                this.raycaster.ray.intersectPlane(plane, this.initialIntersectionPoint);
                this.offset.copy(this.initialIntersectionPoint).sub(this.selectedNode.position);
                this.isPanning = false;
            }
        } else {
            this.isDraggingNode = false;
            this.isPanning = true;
            this.lastPointerPosition.set(event.clientX, event.clientY);
        }
    }

    _onMouseMove(event) {
        if (this.isSidebarOpen) return;

        if (this.isDraggingNode && this.selectedNode) {
            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const currentIntersectionPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(plane, currentIntersectionPoint);
            const delta = new THREE.Vector3().subVectors(currentIntersectionPoint, this.initialIntersectionPoint);
            this._moveSubtree(this.selectedNode, delta);
            this.initialIntersectionPoint.copy(currentIntersectionPoint);
            this.updateLinks();
        } else if (this.isPanning) {
            const deltaX = event.clientX - this.lastPointerPosition.x;
            const deltaY = event.clientY - this.lastPointerPosition.y;
            const panSpeed = 1 / this.camera.zoom;
            this.camera.position.x -= deltaX * panSpeed;
            this.camera.position.y += deltaY * panSpeed;
            this.lastPointerPosition.set(event.clientX, event.clientY);
        }
    }

    _onMouseUp() {
        this.selectedNode = null;
        this.isDraggingNode = false;
        this.isPanning = false;
    }

    _onTouchStart(event) {
        if (this.isSidebarOpen) return;
        event.preventDefault();
        this.isConsideredClick = true;

        if (event.touches.length === 1) {
            this.initialTouchCoords.set(event.touches[0].clientX, event.touches[0].clientY);
            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.dragHandles);
            if (intersects.length > 0) {
                const handle = intersects[0].object;
                if (handle.userData.isDragHandle) {
                    this.selectedNode = handle.userData.nodeGroup;
                    this.isDraggingNode = true;
                    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                    this.raycaster.ray.intersectPlane(plane, this.initialIntersectionPoint);
                    this.offset.copy(this.initialIntersectionPoint).sub(this.selectedNode.position);
                    this.isPanning = false;
                }
            } else {
                this.isDraggingNode = false;
                this.isPanning = true;
                this.lastPointerPosition.set(event.touches[0].clientX, event.touches[0].clientY);
            }
        } else if (event.touches.length === 2) {
            this.isDraggingNode = false;
            this.isPanning = false;
            this._isPinching = true;
            this.isConsideredClick = false;
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            this.initialPinchDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            this.initialPinchZoom = this.camera.zoom;
            this.mouse.set(
                ((touch1.clientX + touch2.clientX) / 2 / this.renderer.domElement.clientWidth) * 2 - 1,
                -((touch1.clientY + touch2.clientY) / 2 / this.renderer.domElement.clientHeight) * 2 + 1
            );
            this.pinchCenterWorld.set(this.mouse.x, this.mouse.y, 0).unproject(this.camera);
        }
    }

    _onTouchMove(event) {
        if (this.isSidebarOpen) return;
        event.preventDefault();

        if (this.isConsideredClick && event.touches.length === 1) {
            const moveDistance = Math.hypot(
                event.touches[0].clientX - this.initialTouchCoords.x,
                event.touches[0].clientY - this.initialTouchCoords.y
            );
            if (moveDistance > this.tapThreshold) {
                this.isConsideredClick = false;
            }
        }

        if (this.isDraggingNode && this.selectedNode) {
            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const currentIntersectionPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(plane, currentIntersectionPoint);
            const delta = new THREE.Vector3().subVectors(currentIntersectionPoint, this.initialIntersectionPoint);
            this._moveSubtree(this.selectedNode, delta);
            this.initialIntersectionPoint.copy(currentIntersectionPoint);
            this.updateLinks();
        } else if (this.isPanning && event.touches.length === 1) {
            const deltaX = event.touches[0].clientX - this.lastPointerPosition.x;
            const deltaY = event.touches[0].clientY - this.lastPointerPosition.y;
            const panSpeed = 1 / this.camera.zoom;
            this.camera.position.x -= deltaX * panSpeed;
            this.camera.position.y += deltaY * panSpeed;
            this.lastPointerPosition.set(event.touches[0].clientX, event.touches[0].clientY);
        } else if (this._isPinching && event.touches.length === 2) {
            this.isConsideredClick = false;
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentPinchDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            let newZoom = this.initialPinchZoom * (currentPinchDistance / this.initialPinchDistance);
            newZoom = Math.max(CONFIG.zoom.min, Math.min(CONFIG.zoom.max, newZoom));
            this.camera.zoom = newZoom;
            this.camera.updateProjectionMatrix();
            this.mouse.set(
                ((touch1.clientX + touch2.clientX) / 2 / this.renderer.domElement.clientWidth) * 2 - 1,
                -((touch1.clientY + touch2.clientY) / 2 / this.renderer.domElement.clientHeight) * 2 + 1
            );
            const currentPinchCenterWorld = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);
            const panDelta = new THREE.Vector3().subVectors(this.pinchCenterWorld, currentPinchCenterWorld);
            this.camera.position.add(panDelta);
        }
    }

    _onTouchEnd(event) {
        if (this.isConsideredClick) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.mainGroup.children, true);
            let clickedNode = null;
            for (const intersect of intersects) {
                let parent = intersect.object.parent;
                while (parent) {
                    if (parent.userData.isNode) {
                        clickedNode = parent;
                        break;
                    }
                    parent = parent.parent;
                }
                if (clickedNode) break;
            }
            if (clickedNode && !clickedNode.userData.isDragHandle) {
                const d3NodeData = clickedNode.userData.d3Node.data;
                this.openSidebar(d3NodeData.name, d3NodeData.explanation || 'Nenhuma explicação disponível.');
            } else if (this.isSidebarOpen) {
                this.closeSidebar();
            }
        }
        this.isDraggingNode = false;
        this.isPanning = false;
        this._isPinching = false;
        this.isConsideredClick = true;
    }

    _onNodeClick(event) {
        if (this.isDraggingNode || this.isPanning || this._isPinching || event.button !== 0) return;
        this.mouse.copy(this._getPointerCoordinates(event));
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.mainGroup.children, true);
        let clickedNode = null;
        for (const intersect of intersects) {
            let currentObject = intersect.object;
            while (currentObject) {
                if (currentObject.userData.isDragHandle) {
                    clickedNode = null;
                    break;
                }
                if (currentObject.userData.isNode) {
                    clickedNode = currentObject;
                    break;
                }
                currentObject = currentObject.parent;
            }
            if (clickedNode) break;
        }
        if (clickedNode) {
            const d3NodeData = clickedNode.userData.d3Node.data;
            this.openSidebar(d3NodeData.name, d3NodeData.explanation || 'Nenhuma explicação disponível.');
        } else if (this.isSidebarOpen) {
            this.closeSidebar();
        }
    }

    // --- MÉTODOS DA SIDEBAR ---
    openSidebar(title, content) {
        if (this.sidebar) {
            this.sidebarTitle.textContent = title;
            this.sidebarContent.textContent = content;
            this.sidebar.classList.add('open');
            this.isSidebarOpen = true;
        }
    }

    closeSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.remove('open');
            this.isSidebarOpen = false;
        }
    }

    // --- LOOP DE ANIMAÇÃO ---
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}


// --- DADOS DO MAPA MENTAL ---
const mindMapData = {
    "name": "Auditoria e Controle Interno",
    "explanation": "Uma visão geral sobre os conceitos fundamentais de auditoria, sua relação com o controle interno, os diferentes tipos de auditoria e as fases do processo de auditoria, com foco em pontos de atenção para concursos.",
    "children": [
        {
            "name": "1. Auditoria e Controle Interno",
            "explanation": "Define os conceitos de Auditoria e Controle Interno, detalha o framework COSO e explora a relação crucial entre essas duas áreas, destacando o papel da Auditoria Interna como a Terceira Linha de Defesa.",
            "children": [
                { "name": "Conceito de Auditoria", "explanation": "Processo sistemático, independente e documentado para obter evidência objetiva e avaliá-la. Em TI, foca em garantir a confidencialidade, integridade e disponibilidade dos sistemas." },
                { "name": "Controle Interno (COSO)", "explanation": "Processo conduzido pela governança e administração para proporcionar segurança razoável quanto à realização dos objetivos de operações, divulgação e conformidade.", "children": [{ "name": "Componentes do COSO", "explanation": "O framework COSO estabelece cinco componentes integrados: 1. Ambiente de Controle, 2. Avaliação de Riscos, 3. Atividades de Controle, 4. Informação e Comunicação, 5. Atividades de Monitoramento." }] },
                { "name": "Relação Auditoria e Controle Interno", "explanation": "A Auditoria Interna avalia a eficácia dos processos de governança, gerenciamento de riscos e controles internos, funcionando como a Terceira Linha de Defesa na estrutura de governança.", "children": [{ "name": "Auditoria Interna", "explanation": "Atividade independente e objetiva de avaliação e consultoria, desenhada para adicionar valor e melhorar as operações de uma organização." }, { "name": "Terceira Linha de Defesa", "explanation": "A Auditoria Interna fornece uma avaliação independente à alta administração sobre a eficácia da primeira (gestão operacional) e segunda (supervisão de riscos) linhas de defesa." }] },
                { "name": "Foco CEBRASPE (Pontos de Atenção)", "explanation": "Principais 'pegadinhas' e pontos de atenção cobrados pela banca CEBRASPE sobre a relação entre Auditoria e Controle Interno.", "children": [{ "name": "Auditoria Interna vs. Controle Interno", "explanation": "ERRO COMUM: Afirmar que a Auditoria Interna é parte do controle interno. CORRETO: A Auditoria Interna AVALIA o controle interno, mas é um componente da GOVERNANÇA para manter sua independência." }, { "name": "Segurança Razoável vs. Absoluta", "explanation": "O controle interno proporciona segurança 'razoável', não absoluta. Limitações inerentes como erro humano, conluio e decisões gerenciais impedem a eliminação total dos riscos." }, { "name": "Posicionamento da Auditoria Interna", "explanation": "A independência é crítica. A Auditoria Interna deve se reportar funcionalmente ao mais alto nível da organização (Conselho de Administração, Comitê de Auditoria) para garantir autonomia." }] }
            ]
        },
        {
            "name": "2. Tipos de Auditoria",
            "explanation": "Classificação das auditorias governamentais (segundo ISSAI e TCU) em três tipos principais de acordo com seus objetivos: Financeira, de Conformidade e Operacional.",
            "children": [
                { "name": "Auditoria Financeira", "explanation": "Objetivo: Expressar opinião sobre a fidedignidade e correção das demonstrações financeiras. Foco na conformidade com o arcabouço de relatório financeiro aplicável. Exemplo em TI: verificar se ativos de hardware/software estão corretamente registrados." },
                { "name": "Auditoria de Conformidade (Regularidade)", "explanation": "Objetivo: Expressar opinião se as atividades e transações estão em conformidade com leis e normas. Foco na legalidade, legitimidade e regularidade. Exemplo em TI: verificar conformidade com a Lei nº 14.133/2021 ou LGPD." },
                { "name": "Auditoria Operacional (Desempenho)", "explanation": "Objetivo: Examinar a economicidade, eficiência, eficácia e efetividade ('4 Es') das operações. Foco na avaliação do desempenho da gestão e identificação de melhorias. Exemplo em TI: avaliar se um novo sistema atinge seus objetivos de forma eficiente.", "children": [{ "name": "Os '4 Es'", "explanation": "Economia (minimizar custo dos insumos), Eficiência (relação produto/insumo), Eficácia (grau de alcance dos objetivos) e Efetividade (impacto final na sociedade)." }] },
                { "name": "Foco CEBRASPE (Pontos de Atenção)", "explanation": "Diferenças cruciais entre os tipos de auditoria que são frequentemente exploradas em questões.", "children": [{ "name": "Distinção dos Objetivos", "explanation": "Associações mandatórias: Financeira → Fidedignidade Contábil; Conformidade → Legalidade/Normas; Operacional → Desempenho e os '4 Es'. A banca pode confundir esses focos." }, { "name": "Conhecimento dos '4 Es'", "explanation": "É fundamental conhecer o significado de cada 'E' da Auditoria Operacional (Economia, Eficiência, Eficácia, Efetividade), pois são conceitos distintos e frequentemente cobrados." }, { "name": "Auditoria de Gestão vs. Operacional", "explanation": "Embora relacionadas, a auditoria de gestão pode ter um escopo mais amplo, avaliando a gestão de forma geral, enquanto a operacional foca em processos e operações específicas para otimização." }] }
            ]
        },
        {
            "name": "3. O Processo de Auditoria",
            "explanation": "Descreve as fases fundamentais do trabalho de auditoria (Planejamento, Execução, Relatório) e os principais instrumentos e documentos gerados, como papéis de trabalho e achados.",
            "children": [
                { "name": "Fases da Auditoria", "explanation": "O trabalho de auditoria é estruturado em três fases sequenciais e interdependentes.", "children": [{ "name": "1. Planejamento", "explanation": "Fase crítica que define escopo, objetivos, materialidade e abordagem. Envolve conhecer a entidade e avaliar riscos e controles para definir os procedimentos." }, { "name": "2. Execução", "explanation": "Fase de aplicação dos procedimentos definidos no planejamento, com coleta de evidências através de testes de controle e procedimentos substantivos." }, { "name": "3. Relatório", "explanation": "Fase de comunicação dos resultados, conclusões e recomendações da auditoria para as partes interessadas, sendo o produto final do trabalho." }] },
                { "name": "Instrumentos da Auditoria", "explanation": "Conjunto de documentos e ferramentas que formalizam e evidenciam o trabalho do auditor.", "children": [{ "name": "Papéis de Trabalho", "explanation": "Conjunto de documentos e registros que constituem a evidência do trabalho realizado, suportando as conclusões do relatório." }, { "name": "Achado de Auditoria", "explanation": "Resultado da comparação entre a 'situação encontrada' (condição) e o 'critério' (o que deveria ser). Um achado completo possui os '4 Cs'.", "children": [{ "name": "Os '4 Cs' do Achado", "explanation": "Condição (o que é), Critério (o que deveria ser), Causa (razão da divergência) e Consequência/Efeito (impacto ou risco)." }] }, { "name": "Matriz de Achados", "explanation": "Instrumento usado no planejamento para consolidar os achados, suas causas, efeitos e as propostas de recomendação." }, { "name": "Relatório de Auditoria", "explanation": "Produto final e principal instrumento de comunicação dos resultados da auditoria." }, { "name": "Carta de Recomendações", "explanation": "Documento anexo ao relatório, detalhando as ações corretivas propostas para os achados." }] },
                { "name": "Foco CEBRASPE (Pontos de Atenção)", "explanation": "Aspectos do processo de auditoria que são alvos frequentes de questões de concurso.", "children": [{ "name": "Importância do Planejamento", "explanation": "O planejamento é a fase mais crítica, não a execução. Um planejamento inadequado, não baseado em riscos, compromete todo o trabalho." }, { "name": "Atributos do Achado ('4 Cs')", "explanation": "A banca frequentemente testa o conhecimento sobre os '4 Cs', questionando a validade ou completude de um achado que não apresente todos os quatro atributos." }, { "name": "Evidência de Auditoria", "explanation": "As conclusões devem ser baseadas em evidência 'suficiente e apropriada'. Suficiência refere-se à QUANTIDADE de evidência; Apropriação refere-se à QUALIDADE (relevância e fidedignidade)." }, { "name": "Materialidade e Risco", "explanation": "A materialidade é o limiar para identificação de distorções relevantes. O risco de auditoria é a chance de uma opinião inadequada, incluindo risco inerente, de controle e de detecção." }] }
            ]
        },
        {
            "name": "4. Ética Profissional e Normas de Auditoria",
            "explanation": "Aborda os princípios éticos que regem a conduta do auditor e as principais normas nacionais e internacionais aplicáveis, com foco na independência e ceticismo profissional.",
            "children": [
                { "name": "Princípios Éticos Fundamentais", "explanation": "Conjunto de valores que guiam a conduta do auditor, assegurando a confiabilidade de seu trabalho.", "children": [{ "name": "Independência", "explanation": "Qualidade essencial do auditor, garantindo sua imparcialidade e objetividade, livre de influências que comprometam seu julgamento." }, { "name": "Integridade", "explanation": "Ser honesto e justo em todas as relações profissionais e de negócios." }, { "name": "Objetividade", "explanation": "Não permitir que preconceitos ou conflitos de interesse anulem julgamentos profissionais ou de negócios." }, { "name": "Competência e Zelo Profissional", "explanation": "Manter o conhecimento e a habilidade profissional no nível exigido e agir com diligência e de acordo com as normas técnicas e profissionais aplicáveis." }, { "name": "Confidencialidade", "explanation": "Respeitar a confidencialidade das informações obtidas como resultado de relacionamentos profissionais e de negócios." }] },
                { "name": "Normas de Auditoria", "explanation": "Regras e diretrizes que padronizam a prática da auditoria, garantindo qualidade e comparabilidade.", "children": [{ "name": "ISSAIs (Normas INTOSAI)", "explanation": "International Standards of Supreme Audit Institutions - normas globais para auditoria do setor público, adotadas por diversas Entidades Fiscalizadoras Superiores (EFSs) como o TCU." }, { "name": "NBC TAs (Normas Brasileiras)", "explanation": "Normas Brasileiras de Contabilidade Aplicadas à Auditoria, emitidas pelo Conselho Federal de Contabilidade (CFC)." }] },
                { "name": "Ceticismo Profissional", "explanation": "Atitude que inclui uma mente questionadora e uma avaliação crítica das evidências de auditoria. O auditor não assume que a administração é desonesta, nem que é inquestionavelmente honesta." },
                { "name": "Foco CEBRASPE (Pontos de Atenção)", "explanation": "Questões sobre a ética do auditor e a aplicação das normas são recorrentes.", "children": [{ "name": "Distinção entre Independência e Objetividade", "explanation": "A independência (de fato e aparente) é um pré-requisito para a objetividade. A banca pode tentar confundir os conceitos." }, { "name": "Exigências de Normas (ISSAI vs. NBC TA)", "explanation": "Conhecer as fontes das normas e suas aplicações específicas (setor público vs. geral). A CEBRASPE frequentemente aborda as ISSAIs no contexto de auditoria governamental." }] }
            ]
        },
        {
            "name": "5. Tecnologia na Auditoria",
            "explanation": "Explora o impacto das tecnologias da informação na auditoria, incluindo ferramentas de auditoria assistida por computador (CAATs), segurança da informação e auditoria de sistemas.",
            "children": [
                { "name": "Auditoria de Sistemas de Informação", "explanation": "Processo de coleta e avaliação de evidências para determinar se um sistema de informação salvaguarda ativos, mantém a integridade dos dados e atinge os objetivos da organização de forma eficaz." },
                { "name": "Ferramentas de Auditoria Assistida por Computador (CAATs)", "explanation": "Softwares e técnicas utilizadas pelo auditor para analisar dados e automatizar procedimentos de auditoria.", "children": [{ "name": "Software de Análise de Dados", "explanation": "Ex: ACL, IDEA, Excel avançado. Utilizados para testar amostras, identificar padrões, realizar cálculos e verificar a integridade de grandes volumes de dados." }, { "name": "Software de Auditoria Genérico", "explanation": "Ferramentas que podem ser adaptadas para diversas auditorias, como softwares de mapeamento de processos ou de gestão de riscos." }] },
                { "name": "Segurança da Informação e Auditoria", "explanation": "A auditoria verifica se os controles de segurança da informação (confidencialidade, integridade, disponibilidade) estão eficazes.", "children": [{ "name": "Controles de Acesso", "explanation": "Avaliação de mecanismos para garantir que apenas usuários autorizados acessem informações e sistemas." }, { "name": "Backup e Recuperação de Dados", "explanation": "Verificação da existência e eficácia de rotinas de backup e planos de recuperação de desastres." }, { "name": "Continuidade de Negócios", "explanation": "Avaliação da capacidade da organização de manter suas operações críticas em caso de interrupção." }] },
                { "name": "Auditoria de Bancos de Dados", "explanation": "Foco na integridade, segurança e desempenho de sistemas de gerenciamento de bancos de dados (SGBDs)." },
                { "name": "Foco CEBRASPE (Pontos de Atenção)", "explanation": "A crescente relevância da TI em concursos de auditoria.", "children": [{ "name": "Conhecimento de Ferramentas (CAATs)", "explanation": "Saber o que são as CAATs e seus usos gerais. A banca pode descrever uma situação e perguntar qual ferramenta seria mais apropriada." }, { "name": "Princípios de Segurança da Informação", "explanation": "A relação entre os princípios de confidencialidade, integridade e disponibilidade e os controles de segurança de TI." }, { "name": "Auditoria em Ambientes Cloud/Big Data", "explanation": "Desafios específicos da auditoria em novas tecnologias, como a necessidade de auditorar provedores de serviços em nuvem e a análise de grandes volumes de dados." }] }
            ]
        },
        {
            "name": "6. Gerenciamento de Riscos na Auditoria",
            "explanation": "Detalha a importância do gerenciamento de riscos no processo de auditoria, desde a identificação e avaliação até a resposta a riscos, utilizando frameworks como o COSO ERM.",
            "children": [
                { "name": "Conceito de Risco de Auditoria", "explanation": "O risco de o auditor expressar uma opinião de auditoria inadequada quando as demonstrações financeiras contêm distorção relevante." },
                { "name": "Componentes do Risco de Auditoria", "explanation": "Decomposição do risco de auditoria em seus elementos constituintes.", "children": [{ "name": "Risco Inerente", "explanation": "Suscetibilidade de uma afirmação a uma distorção que possa ser relevante, individualmente ou em conjunto com outras distorções, antes da consideração de quaisquer controles internos." }, { "name": "Risco de Controle", "explanation": "Risco de que uma distorção que possa ocorrer em uma afirmação e que possa ser relevante, individualmente ou em conjunto com outras distorções, não seja prevenida, detectada ou corrigida tempestivamente por controles internos da entidade." }, { "name": "Risco de Detecção", "explanation": "Risco de que os procedimentos executados pelo auditor para reduzir o risco de auditoria a um nível aceitavelmente baixo não detectem uma distorção que exista e que possa ser relevante." }] },
                { "name": "Frameworks de Gerenciamento de Riscos", "explanation": "Modelos reconhecidos para identificar, avaliar e gerenciar riscos.", "children": [{ "name": "COSO ERM (Enterprise Risk Management)", "explanation": "Estrutura abrangente que auxilia as organizações a gerenciar riscos e oportunidades de forma integrada para alcançar os objetivos estratégicos." }, { "name": "ISO 31000", "explanation": "Norma internacional que fornece princípios e diretrizes para o gerenciamento de riscos." }] },
                { "name": "Resposta aos Riscos Avaliados", "explanation": "Desenvolvimento e implementação de procedimentos de auditoria em resposta aos riscos identificados e avaliados.", "children": [{ "name": "Testes de Controle", "explanation": "Procedimentos para avaliar a eficácia dos controles internos na prevenção ou detecção e correção de distorções." }, { "name": "Procedimentos Substantivos", "explanation": "Testes realizados para detectar distorções relevantes nas demonstrações financeiras." }] },
                { "name": "Foco CEBRASPE (Pontos de Atenção)", "explanation": "A centralidade do risco na abordagem da CEBRASPE em auditoria.", "children": [{ "name": "Fórmula do Risco de Auditoria", "explanation": "Entender que Risco de Auditoria = Risco Inerente x Risco de Controle x Risco de Detecção. E que o risco de detecção é o único que o auditor pode controlar diretamente." }, { "name": "Relação Risco x Materialidade", "explanation": "Quanto maior o risco avaliado, menor a materialidade aceitável, e vice-versa. Ambos influenciam a extensão dos procedimentos de auditoria." }, { "name": "Gestão de Riscos vs. Auditoria de Riscos", "explanation": "A gestão de riscos é responsabilidade da administração; a auditoria de riscos avalia a eficácia dessa gestão." }] }
            ]
        }
    ]
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    const mindmapContainer = document.getElementById('mindmap-container');
    if (mindmapContainer) {
        new MindMapViewer(mindmapContainer, mindMapData);
    } else {
        console.error("Container do mapa mental não encontrado. Por favor, garanta que um elemento com id 'mindmap-container' exista no seu HTML.");
    }
});