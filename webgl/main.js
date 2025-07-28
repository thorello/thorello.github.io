import * as THREE from 'three';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';

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
    }
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
            exportButton.addEventListener('click', this.exportToPDF.bind(this));
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
                const textWidth = bounds ? bounds.x[1] - bounds.x[0] : d3Node.data.name.length * (CONFIG.font.size * 0.6);
                const textHeight = bounds ? bounds.y[1] - bounds.y[0] : CONFIG.font.size * 1.2;

                const rectWidth = textWidth + CONFIG.padding.x * 2;
                const rectHeight = textHeight + CONFIG.padding.y * 2;

                const rectGeo = createRoundedRectGeometry(rectWidth, rectHeight, CONFIG.borderRadius);
                const rectMat = new THREE.MeshBasicMaterial({ color: nodeColor });
                // Adiciona uma borda sutil aos nós para melhor definição no tema claro
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
            linewidth: 2, // Linha um pouco mais fina
            transparent: true,
            opacity: 0.8 // Um pouco mais opaco para o tema claro
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

        const originalChildren = root.children || [];
        if (originalChildren.length > 0) {
            const horizontalSpacing = 450;
            const verticalSpacing = 50;
            const treeLayout = tree().nodeSize([verticalSpacing, horizontalSpacing]);

            const leftCount = Math.ceil(originalChildren.length / 2);
            const leftChildren = originalChildren.slice(0, leftCount);
            const rightChildren = originalChildren.slice(leftCount);

            if (leftChildren.length > 0) {
                root.children = leftChildren;
                treeLayout(root);
                root.descendants().forEach(node => {
                    if (node.depth > 0) node.userData = { ...node.userData, assignedDirection: -1 };
                });
            }

            if (rightChildren.length > 0) {
                root.children = rightChildren;
                treeLayout(root);
                root.descendants().forEach(node => {
                    if (node.depth > 0) node.userData = { ...node.userData, assignedDirection: 1 };
                });
            }

            root.children = originalChildren;
        }
        root.userData = { ...root.userData, assignedDirection: 0 };

        const d3Nodes = root.descendants();

        const nodeCreationPromises = d3Nodes.map(d3Node => {
            const direction = d3Node.userData.assignedDirection;
            return this._createNodeMesh(d3Node, direction);
        });
        await Promise.all(nodeCreationPromises);

        d3Nodes.forEach(d3Node => {
            const nodeGroup = this.nodeMap.get(d3Node);
            if (!nodeGroup) return;

            if (d3Node.depth === 0) {
                nodeGroup.position.set(0, 0, 0);
            } else {
                const direction = nodeGroup.userData.direction;
                const posX = d3Node.y * direction;
                const posY = d3Node.x;
                const nodeWidth = nodeGroup.userData.nodeWidth || 0;
                const finalNodeX = posX + (nodeWidth / 2) * direction;
                nodeGroup.position.set(finalNodeX, posY, 0);
            }
            this.mainGroup.add(nodeGroup);
        });

        d3Links.forEach(link => this._createLinkMesh(link));

        const box = new THREE.Box3().setFromObject(this.mainGroup);
        const center = box.getCenter(new THREE.Vector3());
        this.mainGroup.position.sub(center);

        this.camera.updateProjectionMatrix();
    }

    // --- MÉTODO DE EXPORTAÇÃO CORRIGIDO ---

    // --- MÉTODO DE EXPORTAÇÃO CORRIGIDO ---

    exportToPDF() {
        console.log("Iniciando exportação para PDF...");

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'a4'
        });

        const box = new THREE.Box3().setFromObject(this.mainGroup);
        const size = new THREE.Vector3();
        box.getSize(size);

        if (size.x === 0 || size.y === 0) {
            console.error("Não é possível exportar um mapa vazio.");
            return;
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;

        const scaleX = (pageWidth - margin * 2) / size.x;
        const scaleY = (pageHeight - margin * 2) / size.y;
        const scale = Math.min(scaleX, scaleY);

        const pdfCenterX = pageWidth / 2;
        const pdfCenterY = pageHeight / 2;

        const transform = (point) => {
            const worldPoint = point.clone().add(this.mainGroup.position);
            return {
                x: (worldPoint.x * scale) + pdfCenterX,
                y: (-worldPoint.y * scale) + pdfCenterY
            };
        };

        // Desenha as conexões
        doc.setLineWidth(0.5);
        const linkColorHex = '#' + new THREE.Color(CONFIG.linkColor).getHexString();
        doc.setDrawColor(linkColorHex);

        this.linkObjects.forEach(linkObject => {
            const curve = linkObject.userData.curve;
            const start = transform(curve.v0);
            const cp1 = transform(curve.v1);
            const cp2 = transform(curve.v2);
            const end = transform(curve.v3);

            doc.path([
                { op: 'm', c: [start.x, start.y] },
                { op: 'c', c: [cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y] }
            ]).stroke();
        });

        // Desenha os nós com texto
        this.nodeMap.forEach(nodeGroup => {
            const nodePos = transform(nodeGroup.position);

            const rectMesh = nodeGroup.children.find(c => c.type === 'Mesh' && c.geometry.type === 'ShapeGeometry');
            const textMesh = nodeGroup.children.find(c => c.isTroikaText || (c.material && c.material.isShaderMaterial));

            if (!rectMesh) return;

            const rectWidth = nodeGroup.userData.nodeWidth * scale;
            const rectHeight = nodeGroup.userData.nodeHeight * scale;
            const borderRadius = CONFIG.borderRadius * scale;

            const rectX = nodePos.x - rectWidth / 2;
            const rectY = nodePos.y - rectHeight / 2;

            const nodeColorHex = '#' + rectMesh.material.color.getHexString();
            doc.setFillColor(nodeColorHex);
            doc.setLineWidth(0.3);
            doc.setDrawColor("#CCCCCC");
            doc.roundedRect(rectX, rectY, rectWidth, rectHeight, borderRadius, borderRadius, 'FD');

            // Texto
            const textColorHex = '#' + new THREE.Color(CONFIG.textColor).getHexString();
            const fontSize = CONFIG.font.size * scale;

            doc.setTextColor(textColorHex);
            doc.setFontSize(fontSize);
            doc.setFont("helvetica");

            let textAlign = 'center';
            let textX = nodePos.x;
            const paddingX = CONFIG.padding.x * scale;

            if (nodeGroup.userData.direction === 1) {
                textAlign = 'left';
                textX = rectX + paddingX;
            } else if (nodeGroup.userData.direction === -1) {
                textAlign = 'right';
                textX = rectX + rectWidth - paddingX;
            }

            // Garante que o texto seja obtido mesmo se textMesh falhar
            const textContent =
                (textMesh && textMesh.text) ||
                (nodeGroup.userData?.d3Node?.data?.name) ||
                'Sem texto';

            doc.text(textContent, textX, nodePos.y, {
                align: textAlign,
                baseline: 'middle'
            });
        });

        doc.save('mapa-mental.pdf');
        console.log("Exportação para PDF concluída. ✨");
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
                { "name": "Foco CEBRASPE (Pontos de Atenção)", "explanation": "Diferenças cruciais entre os tipos de auditoria que são frequentemente exploradas em questões.", "children": [{ "name": "Distinção dos Objetivos", "explanation": "Associações mandatórias: Financeira → Fidedignidade Contábil; Conformidade → Legalidade/Normas; Operacional → Desempenho e os '4 Es'. A banca pode confundir esses focos." }, { "name": "Conhecimento dos '4 Es'", "explanation": "É fundamental conhecer o significado de cada 'E' da Auditoria Operacional (Economia, Eficiência, Eficácia, Efetividade), pois são conceitos distintos e frequentemente cobrados." }] }
            ]
        },
        {
            "name": "3. O Processo de Auditoria",
            "explanation": "Descreve as fases fundamentais do trabalho de auditoria (Planejamento, Execução, Relatório) e os principais instrumentos e documentos gerados, como papéis de trabalho e achados.",
            "children": [
                { "name": "Fases da Auditoria", "explanation": "O trabalho de auditoria é estruturado em três fases sequenciais e interdependentes.", "children": [{ "name": "1. Planejamento", "explanation": "Fase crítica que define escopo, objetivos, materialidade e abordagem. Envolve conhecer a entidade e avaliar riscos e controles para definir os procedimentos." }, { "name": "2. Execução", "explanation": "Fase de aplicação dos procedimentos definidos no planejamento, com coleta de evidências através de testes de controle e procedimentos substantivos." }, { "name": "3. Relatório", "explanation": "Fase de comunicação dos resultados, conclusões e recomendações da auditoria para as partes interessadas, sendo o produto final do trabalho." }] },
                { "name": "Instrumentos da Auditoria", "explanation": "Conjunto de documentos e ferramentas que formalizam e evidenciam o trabalho do auditor.", "children": [{ "name": "Papéis de Trabalho", "explanation": "Conjunto de documentos e registros que constituem a evidência do trabalho realizado, suportando as conclusões do relatório." }, { "name": "Achado de Auditoria", "explanation": "Resultado da comparação entre a 'situação encontrada' (condição) e o 'critério' (o que deveria ser). Um achado completo possui os '4 Cs'.", "children": [{ "name": "Os '4 Cs' do Achado", "explanation": "Condição (o que é), Critério (o que deveria ser), Causa (razão da divergência) e Consequência/Efeito (impacto ou risco)." }] }, { "name": "Matriz de Achados", "explanation": "Instrumento usado no planejamento para consolidar os achados, suas causas, efeitos e as propostas de recomendação." }, { "name": "Relatório de Auditoria", "explanation": "Produto final e principal instrumento de comunicação dos resultados da auditoria." }] },
                { "name": "Foco CEBRASPE (Pontos de Atenção)", "explanation": "Aspectos do processo de auditoria que são alvos frequentes de questões de concurso.", "children": [{ "name": "Importância do Planejamento", "explanation": "O planejamento é a fase mais crítica, não a execução. Um planejamento inadequado, não baseado em riscos, compromete todo o trabalho." }, { "name": "Atributos do Achado ('4 Cs')", "explanation": "A banca frequentemente testa o conhecimento sobre os '4 Cs', questionando a validade ou completude de um achado que não apresente todos os quatro atributos." }, { "name": "Evidência de Auditoria", "explanation": "As conclusões devem ser baseadas em evidência 'suficiente e apropriada'. Suficiência refere-se à QUANTIDADE de evidência; Apropriação refere-se à QUALIDADE (relevância e fidedignidade)." }] }
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
