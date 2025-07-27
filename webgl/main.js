import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';

// --- 1. CONFIGURAÇÕES CENTRALIZADAS ---
const CONFIG = {
    backgroundColor: 0x1a1a2e,
    nodeColors: [
        0x3f546c, 0x5c6b73, 0x7b888e, 0x2c3b4e,
        0x4a5a6a, 0x6d7a86, 0x2e3a47, 0x54606b
    ],
    linkColor: 0x888888,
    dragHandleColor: 0x8aff8a,
    textColor: 0xeeeeee,
    font: {
        size: 14,
    },
    padding: { x: 18, y: 5 },
    borderRadius: 8,
    dragHandleRadius: 8,
    zoom: {
        speed: 0.75,
        min: 0.1,
        max: 20,
    }
};

/**
 * Geometria para um retângulo com cantos arredondados.
 * @param {number} width - Largura do retângulo.
 * @param {number} height - Altura do retângulo.
 * @param {number} radius - Raio dos cantos.
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
    shape.quadraticCurveTo(x, y + height, x, y + height - radius); // Corrected line
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
        this.isDraggingNode = false; // New state variable

        this._initScene();
        this._initControls();
        this._initEventListeners();

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
        this.camera.position.z = 100;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.mainGroup = new THREE.Group();
        this.scene.add(this.mainGroup);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    _initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false;
        // Re-enable default zoom and pan for OrbitControls to handle touch
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        };
        // Set touch actions for OrbitControls
        this.controls.touches = {
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.DOLLY_PAN // DOLLY for zoom, PAN for pan
        };
    }

    _initEventListeners() {
        window.addEventListener('resize', this._onWindowResize.bind(this));
        this.renderer.domElement.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this._onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this._onMouseUp.bind(this));
        this.renderer.domElement.addEventListener('wheel', this._onMouseWheel.bind(this), { passive: false });

        // --- ADD TOUCH EVENT LISTENERS ---
        this.renderer.domElement.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });
    }

    // --- LÓGICA DE CRIAÇÃO E ATUALIZAÇÃO ---

    /**
     * Cria a malha (mesh) de um nó e retorna uma Promise que resolve quando estiver pronto.
     * @param {object} d3Node - O nó de dados do D3.
     * @returns {Promise<THREE.Group>}
     */
    _createNodeMesh(d3Node) {
        return new Promise(resolve => {
            const nodeGroup = new THREE.Group();
            nodeGroup.userData = { d3Node };

            const nodeColor = CONFIG.nodeColors[d3Node.depth % CONFIG.nodeColors.length];

            const textMesh = new Text();
            textMesh.text = d3Node.data.name;
            textMesh.fontSize = CONFIG.font.size;
            textMesh.color = CONFIG.textColor;
            textMesh.anchorX = 'left';
            textMesh.anchorY = 'middle';
            textMesh.position.z = 0.1;

            textMesh.sync(() => {
                const bounds = textMesh.textRenderInfo.bounds;
                const textWidth = bounds ? bounds.x[1] - bounds.x[0] : d3Node.data.name.length * 8;
                const textHeight = bounds ? bounds.y[1] - bounds.y[0] : 20;

                const rectWidth = textWidth + CONFIG.padding.x * 2;
                const rectHeight = textHeight + CONFIG.padding.y * 2;

                const rectGeo = createRoundedRectGeometry(rectWidth, rectHeight, CONFIG.borderRadius);
                const rectMat = new THREE.MeshBasicMaterial({ color: nodeColor });
                const rectMesh = new THREE.Mesh(rectGeo, rectMat);
                rectMesh.position.x = rectWidth / 2;

                textMesh.position.x = CONFIG.padding.x;

                nodeGroup.add(rectMesh, textMesh);
                nodeGroup.userData.nodeWidth = rectWidth;

                // --- Alça para arrastar (Drag Handle) ---
                const handleGeo = new THREE.CircleGeometry(CONFIG.dragHandleRadius, 32);
                const handleMat = new THREE.MeshBasicMaterial({ color: CONFIG.dragHandleColor, transparent: true, opacity: 0.5 });
                const handleMesh = new THREE.Mesh(handleGeo, handleMat);
                handleMesh.position.set(rectWidth, 0, 0.2); // Alinhado à direita
                handleMesh.userData = { isDragHandle: true, nodeGroup };

                nodeGroup.add(handleMesh);
                this.dragHandles.push(handleMesh);

                resolve(nodeGroup);
            });
        });
    }

    _createLinkMesh(linkData) {
        const sourceNodeGroup = this.nodeMap.get(linkData.source);
        const targetNodeGroup = this.nodeMap.get(linkData.target);

        if (!sourceNodeGroup || !targetNodeGroup) return;

        const start = new THREE.Vector3(
            sourceNodeGroup.position.x + sourceNodeGroup.userData.nodeWidth,
            sourceNodeGroup.position.y,
            0
        );
        const end = targetNodeGroup.position;

        const controlPoint1 = new THREE.Vector3((start.x + end.x) / 2, start.y, 0);
        const controlPoint2 = new THREE.Vector3((start.x + end.x) / 2, end.y, 0);

        const curve = new THREE.CubicBezierCurve3(start, controlPoint1, controlPoint2, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: CONFIG.linkColor, linewidth: 2 });

        const curveObject = new THREE.Line(geometry, material);
        curveObject.userData = { linkData };

        this.linkObjects.push(curveObject);
        this.mainGroup.add(curveObject);
    }

    updateLinks() {
        for (const linkObject of this.linkObjects) {
            const { linkData } = linkObject.userData;
            const sourceNodeGroup = this.nodeMap.get(linkData.source);
            const targetNodeGroup = this.nodeMap.get(linkData.target);

            if (sourceNodeGroup && targetNodeGroup) {
                const start = new THREE.Vector3(
                    sourceNodeGroup.position.x + sourceNodeGroup.userData.nodeWidth,
                    sourceNodeGroup.position.y,
                    0
                );
                const end = targetNodeGroup.position;

                const controlPoint1 = new THREE.Vector3((start.x + end.x) / 2, start.y, 0);
                const controlPoint2 = new THREE.Vector3((start.x + end.x) / 2, end.y, 0);

                const newCurve = new THREE.CubicBezierCurve3(start, controlPoint1, controlPoint2, end);
                linkObject.geometry.setFromPoints(newCurve.getPoints(50));
                linkObject.geometry.attributes.position.needsUpdate = true;
            }
        }
    }

    // --- LÓGICA PRINCIPAL ---

    async drawMindMap() {
        // --- Limpeza da cena ---
        while (this.mainGroup.children.length) {
            this.mainGroup.remove(this.mainGroup.children[0]);
        }
        this.nodeMap.clear();
        this.linkObjects = [];
        this.dragHandles = [];

        // --- Layout com D3 ---
        const root = hierarchy(this.data);
        const d3Nodes = root.descendants();
        const d3Links = root.links();

        const maxDepth = d3Nodes.reduce((max, n) => Math.max(max, n.depth), 0);
        const maxTextLength = d3Nodes.reduce((max, n) => Math.max(max, n.data.name.length), 0);

        const verticalSpacing = 40 + (maxDepth * 15);
        const horizontalSpacing = 150 + (maxTextLength * 7);

        const treeLayout = tree().nodeSize([verticalSpacing, horizontalSpacing]);
        treeLayout(root);

        // --- Criação de Nós (Assíncrona) ---
        const nodePromises = d3Nodes.map(d3Node => this._createNodeMesh(d3Node));
        const nodeGroups = await Promise.all(nodePromises);

        nodeGroups.forEach(nodeGroup => {
            const d3Node = nodeGroup.userData.d3Node;
            nodeGroup.position.set(d3Node.y, -d3Node.x, 0);
            this.mainGroup.add(nodeGroup);
            this.nodeMap.set(d3Node, nodeGroup);
        });

        // --- Criação de Links (Síncrona, após nós estarem prontos) ---
        d3Links.forEach(link => this._createLinkMesh(link));

        // --- Centralização do Mapa ---
        const box = new THREE.Box3().setFromObject(this.mainGroup);
        const center = box.getCenter(new THREE.Vector3());
        this.mainGroup.position.sub(center);
    }

    // --- EVENT HANDLERS ---

    _onWindowResize() {
        this.camera.left = window.innerWidth / -2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = window.innerHeight / -2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _getPointerCoordinates(event) {
        // Handle both mouse and touch events
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        return {
            x: (clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(clientY / this.renderer.domElement.clientHeight) * 2 + 1
        };
    }

    _onMouseDown(event) {
        // Only handle left click for drag handle interaction
        if (event.button !== 0) return;

        this.mouse.copy(this._getPointerCoordinates(event));

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.dragHandles);

        if (intersects.length > 0) {
            const handle = intersects[0].object;
            if (handle.userData.isDragHandle) {
                this.controls.enabled = false; // Disable OrbitControls when dragging a node
                this.selectedNode = handle.userData.nodeGroup;
                this.isDraggingNode = true;

                const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                const intersectionPoint = new THREE.Vector3();
                this.raycaster.ray.intersectPlane(plane, intersectionPoint);

                this.offset.copy(intersectionPoint).sub(this.selectedNode.position);
            }
        } else {
            this.isDraggingNode = false; // Reset if not starting a node drag
        }
    }

    _onMouseMove(event) {
        if (!this.selectedNode || !this.isDraggingNode) return;

        this.mouse.copy(this._getPointerCoordinates(event));

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersectionPoint = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, intersectionPoint);

        this.selectedNode.position.copy(intersectionPoint.sub(this.offset));
        this.updateLinks();
    }

    _onMouseUp() {
        this.controls.enabled = true; // Re-enable OrbitControls after mouse up
        this.selectedNode = null;
        this.isDraggingNode = false;
    }

    _onMouseWheel(event) {
        event.preventDefault();
        event.stopPropagation();

        const mouseNDC = new THREE.Vector2(
            (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
        );

        const mouseWorldBeforeZoom = new THREE.Vector3(mouseNDC.x, mouseNDC.y, 0).unproject(this.camera);

        const zoomDirection = event.deltaY > 0 ? CONFIG.zoom.speed : 1 / CONFIG.zoom.speed;
        const newZoom = THREE.MathUtils.clamp(this.camera.zoom * zoomDirection, CONFIG.zoom.min, CONFIG.zoom.max);

        this.camera.zoom = newZoom;
        this.camera.updateProjectionMatrix();

        const mouseWorldAfterZoom = new THREE.Vector3(mouseNDC.x, mouseNDC.y, 0).unproject(this.camera);

        const panDelta = new THREE.Vector3().subVectors(mouseWorldBeforeZoom, mouseWorldAfterZoom);
        this.camera.position.add(panDelta);

        this.controls.target.add(panDelta);
        this.controls.update();
    }

    // --- NEW TOUCH EVENT HANDLERS ---
    _onTouchStart(event) {
        // If one finger, try to drag node or pan scene
        if (event.touches.length === 1) {
            // Simulate a mouse down for drag handle detection
            this._onMouseDown({
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY,
                button: 0 // Simulate left click
            });
            // If a node was selected, prevent OrbitControls from handling this touch
            if (this.selectedNode) {
                event.preventDefault();
            }
        }
        // If two fingers, OrbitControls will handle zoom/pan by default
        else if (event.touches.length === 2) {
            // Disable custom node dragging if multi-touch gesture is detected
            this.selectedNode = null;
            this.isDraggingNode = false;
            this.controls.enabled = true; // Ensure OrbitControls is enabled for pinch zoom/pan
            event.preventDefault(); // Prevent default browser touch actions (e.g., scrolling)
        }
    }

    _onTouchMove(event) {
        if (event.touches.length === 1 && this.isDraggingNode) {
            // If dragging a node with one finger
            this._onMouseMove({
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY
            });
            event.preventDefault(); // Prevent page scrolling
        } else if (event.touches.length === 2) {
            // Let OrbitControls handle two-finger pan/zoom
            // The controls.update() in animate loop will handle camera movement
            event.preventDefault();
        }
    }

    _onTouchEnd(event) {
        // If a node was being dragged, clear the selection and re-enable controls
        if (this.isDraggingNode) {
            this._onMouseUp();
            event.preventDefault();
        }
        // Ensure OrbitControls is re-enabled if no node was being dragged
        this.controls.enabled = true;
    }


    // --- LOOP DE ANIMAÇÃO ---

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}


// --- DADOS DO MAPA MENTAL ---


const mindMapData = {
    "name": "Elastic Stack (ELK)",
    "children": [
        {
            "name": "Visão Geral",
            "children": [
                {
                    "name": "Definição"
                },
                {
                    "name": "Casos de Uso"
                }
            ]
        },
        {
            "name": "Elasticsearch",
            "children": [
                {
                    "name": "Índice Invertido"
                },
                {
                    "name": "Arquissstetura"
                }
            ]
        },
        {
            "name": "Logstash",
            "children": [
                {
                    "name": "Pipelines e Filtros"
                },
                {
                    "name": "Entradas e Saídas"
                },
                {
                    "name": "Casos de Uso Avançados"
                }
            ]
        },
        {
            "name": "Kibana",
            "children": [
                {
                    "name": "Visualizações"
                },
                {
                    "name": "Descoberta"
                },
                {
                    "name": "Monitoramento"
                },
                {
                    "name": "Canvas"
                }
            ]
        },
        {
            "name": "Beats",
            "children": [
                {
                    "name": "Filebeat"
                },
                {
                    "name": "Metricbeat"
                },
                {
                    "name": "Packetbeat"
                },
                {
                    "name": "Heartbeat"
                }
            ]
        },
        {
            "name": "X-Pack Security",
            "children": [
                {
                    "name": "Autenticação"
                },
                {
                    "name": "Autorização"
                },
                {
                    "name": "Auditoria"
                }
            ]
        },
        {
            "name": "Machine Learning",
            "children": [
                {
                    "name": "Detecção de Anomalias"
                },
                {
                    "name": "Previsões"
                }
            ]
        },
        {
            "name": "APM",
            "children": [
                {
                    "name": "Monitoramento de Serviço"
                },
                {
                    "name": "Rastreamento Distribuído"
                }
            ]
        }
    ]
};



// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    new MindMapViewer(document.body, mindMapData);
});