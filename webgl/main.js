import * as THREE from 'three';
// Removido: import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';

// NOVO: Versão atualizada do programa.
const APP_VERSION = 'v1.0.7 - custom camera controls'; // Atualizado para refletir os novos controles

// --- 1. CONFIGURAÇÕES CENTRALIZADAS ---
const CONFIG = {
    backgroundColor: 0x161823, // Fundo bem escuro
    nodeColors: [
        0x3B3486, // Roxo azulado escuro (Base)
        0x4E3486, // Roxo azulado um pouco mais claro
        0x5F4B8B, // Um tom de roxo mais profundo
        0x6C5B7B, // Um roxo muito escuro para contraste
        0x355C7D,
        0x6C5B7B,
        0xC06C84,
        0xF67280
    ],
    linkColor: 0x45a299, // Teal para as linhas
    dragHandleColor: 0x66fcf1, // Teal/ciano brilhante para o manipulador de arrasto
    textColor: 0xEEEEEE, // Cor de texto clara para alto contraste nos retângulos escuros
    font: {
        size: 14,
    },
    padding: { x: 18, y: 5 },
    borderRadius: 8,
    dragHandleRadius: 8,
    zoom: {
        speed: 0.2, // Velocidade do zoom para roda do mouse e pinch (ajustável)
        min: 0.1,    // Zoom mínimo (mais afastado)
        max: 5,     // Zoom máximo (mais aproximado)
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

        // --- Variáveis de Estado para Controle de Câmera Customizado ---
        this.isPanning = false; // Indica se o usuário está arrastando a cena
        this.lastPointerPosition = new THREE.Vector2(); // Última posição do ponteiro para cálculo do pan

        // Variáveis para controle de toque (pinch-to-zoom)
        this._isPinching = false;
        this.initialPinchDistance = 0; // Distância entre os dois toques no início do pinch
        this.initialPinchZoom = 1; // Zoom da câmera no início do pinch
        this.pinchCenterWorld = new THREE.Vector3(); // Ponto central do pinch no mundo

        // Sidebar elements
        this.sidebar = document.getElementById('sidebar');
        this.sidebarTitle = document.getElementById('sidebar-title');
        this.sidebarContent = document.getElementById('sidebar-content');
        this.sidebarCloseButton = document.getElementById('sidebar-close');
        this.isSidebarOpen = false;

        this._initScene();
        // Removido: this._initControls(); // Não usamos mais OrbitControls
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
        this.camera.position.z = 150; // Posição padrão da câmera
        this.camera.zoom = 1; // Zoom inicial da câmera

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.mainGroup = new THREE.Group();
        this.scene.add(this.mainGroup);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    // Removido: _initControls() - Completamente substituído por controle customizado

    _initEventListeners() {
        window.addEventListener('resize', this._onWindowResize.bind(this));
        // MOUSE EVENTS
        this.renderer.domElement.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this._onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this._onMouseUp.bind(this));
        this.renderer.domElement.addEventListener('wheel', this._onMouseWheel.bind(this), { passive: false }); // Zoom da roda do mouse

        // TOUCH EVENTS (PARA PAN E ZOOM DE PINÇA)
        this.renderer.domElement.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });

        // LISTENER DE CLIQUE NO NÓ
        this.renderer.domElement.addEventListener('click', this._onNodeClick.bind(this));

        // Listener do botão de fechar da sidebar
        if (this.sidebarCloseButton) {
            this.sidebarCloseButton.addEventListener('click', this.closeSidebar.bind(this));
        }

        // Removido: Não há mais um listener 'change' do OrbitControls
    }

    _createVersionInfo() {
        const versionElement = document.createElement('div');
        versionElement.textContent = `Mind Map ${APP_VERSION}`;

        Object.assign(versionElement.style, {
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            color: 'rgba(238, 238, 238, 0.5)',
            backgroundColor: 'rgba(31, 40, 51, 0.5)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: '1000',
            pointerEvents: 'none'
        });

        this.container.appendChild(versionElement);
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
            nodeGroup.userData = { d3Node: d3Node, isNode: true };

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

                // Borda para destaque (opcional)
                const borderGeo = createRoundedRectGeometry(rectWidth + 4, rectHeight + 4, CONFIG.borderRadius);
                const borderMat = new THREE.MeshBasicMaterial({
                    color: 0x00FFFF,
                    transparent: true,
                    opacity: 0.15
                });
                const borderMesh = new THREE.Mesh(borderGeo, borderMat);
                borderMesh.position.x = rectWidth / 2;
                borderMesh.position.z = -0.05;
                nodeGroup.add(borderMesh);

                textMesh.position.x = CONFIG.padding.x;

                nodeGroup.add(rectMesh, textMesh);
                nodeGroup.userData.nodeWidth = rectWidth;

                const handleGeo = new THREE.CircleGeometry(CONFIG.dragHandleRadius, 32);
                const handleMat = new THREE.MeshBasicMaterial({ color: CONFIG.dragHandleColor, transparent: true, opacity: 0.5 });
                const handleMesh = new THREE.Mesh(handleGeo, handleMat);
                handleMesh.position.set(rectWidth, 0, 0.2);
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
        const material = new THREE.LineBasicMaterial({ color: CONFIG.linkColor, linewidth: 2, transparent: true, opacity: 0.5 });

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
        while (this.mainGroup.children.length) {
            this.mainGroup.remove(this.mainGroup.children[0]);
        }
        this.nodeMap.clear();
        this.linkObjects = [];
        this.dragHandles = [];

        const root = hierarchy(this.data);
        const d3Nodes = root.descendants();
        const d3Links = root.links();

        const maxDepth = d3Nodes.reduce((max, n) => Math.max(max, n.depth), 0);
        const maxTextLength = d3Nodes.reduce((max, n) => Math.max(max, n.data.name.length), 0);

        const verticalSpacing = 0 + (maxDepth * 15);
        const horizontalSpacing = 100 + (maxTextLength * 7);

        const treeLayout = tree().nodeSize([verticalSpacing, horizontalSpacing]);
        treeLayout(root);

        const nodePromises = d3Nodes.map(d3Node => this._createNodeMesh(d3Node));
        const nodeGroups = await Promise.all(nodePromises);

        nodeGroups.forEach(nodeGroup => {
            const d3Node = nodeGroup.userData.d3Node;
            nodeGroup.position.set(d3Node.y, -d3Node.x, 0);
            this.mainGroup.add(nodeGroup);
            this.nodeMap.set(d3Node, nodeGroup);
        });

        d3Links.forEach(link => this._createLinkMesh(link));

        const box = new THREE.Box3().setFromObject(this.mainGroup);
        const center = box.getCenter(new THREE.Vector3());
        this.mainGroup.position.sub(center);
    }

    // --- EVENT HANDLERS (CONTROLES CUSTOMIZADOS) ---

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
        event.preventDefault(); // Impede o scroll da página

        if (this.isSidebarOpen) {
            return; // Se a sidebar estiver aberta, ignore o evento de zoom
        }

        // 1. Posição do mouse em NDC
        this.mouse.copy(this._getPointerCoordinates(event));

        // 2. Converter a posição do mouse NDC para Coordenadas do Mundo ANTES do zoom
        const worldPosBeforeZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0);
        worldPosBeforeZoom.unproject(this.camera);

        // 3. Calcular o novo fator de zoom
        const zoomExponent = event.deltaY * -0.01 * CONFIG.zoom.speed;
        let newZoom = this.camera.zoom * Math.pow(2, zoomExponent);

        // 4. Aplicar os limites de zoom
        newZoom = Math.max(CONFIG.zoom.min, Math.min(CONFIG.zoom.max, newZoom));

        // 5. Aplicar o novo zoom à câmera
        this.camera.zoom = newZoom;
        this.camera.updateProjectionMatrix();

        // 6. Converter a posição do mouse NDC para Coordenadas do Mundo DEPOIS do zoom
        const worldPosAfterZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0);
        worldPosAfterZoom.unproject(this.camera);

        // 7. Calcular o deslocamento (pan) necessário
        const panDelta = new THREE.Vector3().subVectors(worldPosBeforeZoom, worldPosAfterZoom);

        // 8. Aplicar o deslocamento à posição da câmera
        this.camera.position.add(panDelta);

        // Não há controls.target para atualizar, pois removemos OrbitControls
    }

    _onMouseDown(event) {
        if (this.isSidebarOpen || event.button !== 0) { // Verifica se é o botão esquerdo do mouse
            return;
        }

        this.mouse.copy(this._getPointerCoordinates(event));
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.dragHandles);

        if (intersects.length > 0) {
            const handle = intersects[0].object;
            if (handle.userData.isDragHandle) {
                this.selectedNode = handle.userData.nodeGroup;
                this.isDraggingNode = true;

                const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                const intersectionPoint = new THREE.Vector3();
                this.raycaster.ray.intersectPlane(plane, intersectionPoint);

                this.offset.copy(intersectionPoint).sub(this.selectedNode.position);
                this.isPanning = false; // Desativa pan da câmera se estiver arrastando um nó
            }
        } else {
            // Se nenhum handle foi clicado, inicie o pan da câmera
            this.isDraggingNode = false;
            this.isPanning = true;
            this.lastPointerPosition.set(event.clientX, event.clientY); // Guarda a posição inicial do ponteiro na tela
        }
    }

    _onMouseMove(event) {
        if (this.isSidebarOpen) {
            return;
        }

        if (this.isDraggingNode && this.selectedNode) {
            // Lógica para arrastar o nó
            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);

            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const intersectionPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(plane, intersectionPoint);

            this.selectedNode.position.copy(intersectionPoint).sub(this.offset);
            this.updateLinks();
        } else if (this.isPanning) {
            // Lógica para pan da câmera
            const deltaX = event.clientX - this.lastPointerPosition.x;
            const deltaY = event.clientY - this.lastPointerPosition.y;

            // A velocidade do pan deve ser escalada pelo inverso do zoom atual da câmera.
            // Isso garante que um mesmo movimento do mouse na tela corresponda ao mesmo
            // deslocamento visual, independentemente do nível de zoom.
            const panSpeed = 1 / this.camera.zoom;

            this.camera.position.x -= deltaX * panSpeed;
            this.camera.position.y += deltaY * panSpeed; // Y do mundo é invertido em relação ao Y da tela

            this.lastPointerPosition.set(event.clientX, event.clientY); // Atualiza a última posição
        }
    }

    _onMouseUp() {
        this.selectedNode = null;
        this.isDraggingNode = false;
        this.isPanning = false; // Finaliza o pan da câmera
    }

    _onTouchStart(event) {
        if (this.isSidebarOpen) {
            return;
        }

        event.preventDefault(); // Previne o comportamento padrão (scroll, etc.)

        if (event.touches.length === 1) {
            // Tenta arrastar nó (prioridade) ou pan da câmera
            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.dragHandles);

            if (intersects.length > 0) {
                const handle = intersects[0].object;
                if (handle.userData.isDragHandle) {
                    this.selectedNode = handle.userData.nodeGroup;
                    this.isDraggingNode = true;

                    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                    const intersectionPoint = new THREE.Vector3();
                    this.raycaster.ray.intersectPlane(plane, intersectionPoint);

                    this.offset.copy(intersectionPoint).sub(this.selectedNode.position);
                    this.isPanning = false; // Desativa pan se estiver arrastando nó
                }
            } else {
                // Se nenhum handle, inicia o pan da câmera
                this.isDraggingNode = false;
                this.isPanning = true;
                this.lastPointerPosition.set(event.touches[0].clientX, event.touches[0].clientY);
            }
        } else if (event.touches.length === 2) {
            // Inicia o gesto de zoom de pinça
            this.isDraggingNode = false; // Desativa arrasto de nó
            this.isPanning = false; // Desativa pan de um dedo
            this._isPinching = true;

            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            // Calcula a distância inicial entre os dois toques
            this.initialPinchDistance = touch1.clientX - touch2.clientX;
            this.initialPinchDistance = Math.sqrt(
                this.initialPinchDistance * this.initialPinchDistance +
                (touch1.clientY - touch2.clientY) * (touch1.clientY - touch2.clientY)
            );

            this.initialPinchZoom = this.camera.zoom; // Guarda o zoom atual para o cálculo relativo

            // Calcula o centro do pinch em NDC para manter o zoom centrado
            this.mouse.set(
                ((touch1.clientX + touch2.clientX) / 2 / this.renderer.domElement.clientWidth) * 2 - 1,
                -((touch1.clientY + touch2.clientY) / 2 / this.renderer.domElement.clientHeight) * 2 + 1
            );
            // Converte o centro do pinch em NDC para coordenadas do mundo para a referência
            this.pinchCenterWorld.set(this.mouse.x, this.mouse.y, 0).unproject(this.camera);
        }
    }

    _onTouchMove(event) {
        if (this.isSidebarOpen) {
            return;
        }

        event.preventDefault(); // Previne o comportamento padrão (scroll, etc.)

        if (this.isDraggingNode && this.selectedNode) {
            // Move o nó se estiver arrastando com um dedo
            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);

            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const intersectionPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(plane, intersectionPoint);

            this.selectedNode.position.copy(intersectionPoint).sub(this.offset);
            this.updateLinks();
        } else if (this.isPanning && event.touches.length === 1) {
            // Pan da câmera com um dedo
            const deltaX = event.touches[0].clientX - this.lastPointerPosition.x;
            const deltaY = event.touches[0].clientY - this.lastPointerPosition.y;

            const panSpeed = 1 / this.camera.zoom;

            this.camera.position.x -= deltaX * panSpeed;
            this.camera.position.y += deltaY * panSpeed;

            this.lastPointerPosition.set(event.touches[0].clientX, event.touches[0].clientY);
        } else if (this._isPinching && event.touches.length === 2) {
            // Zoom de pinça com dois dedos
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            // Calcula a distância atual entre os dois toques
            const currentPinchDistance = touch1.clientX - touch2.clientX;
            const dist = Math.sqrt(
                currentPinchDistance * currentPinchDistance +
                (touch1.clientY - touch2.clientY) * (touch1.clientY - touch2.clientY)
            );

            // Calcula o novo zoom com base na proporção da distância de pinça e o zoom inicial
            let newZoom = this.initialPinchZoom * (dist / this.initialPinchDistance);

            // Aplica os limites de zoom
            newZoom = Math.max(CONFIG.zoom.min, Math.min(CONFIG.zoom.max, newZoom));

            // Aplica o novo zoom à câmera
            this.camera.zoom = newZoom;
            this.camera.updateProjectionMatrix();

            // Ajusta a posição da câmera para manter o centro do pinch fixo
            // 1. Obtenha a posição atual do centro do pinch na tela NDC
            this.mouse.set(
                ((touch1.clientX + touch2.clientX) / 2 / this.renderer.domElement.clientWidth) * 2 - 1,
                -((touch1.clientY + touch2.clientY) / 2 / this.renderer.domElement.clientHeight) * 2 + 1
            );

            // 2. Converta o centro do pinch atual em NDC para o mundo (depois do zoom)
            const currentPinchCenterWorld = new THREE.Vector3(this.mouse.x, this.mouse.y, 0);
            currentPinchCenterWorld.unproject(this.camera);

            // 3. Calcule o deslocamento necessário para manter o pinchCenterWorld fixo
            const panDelta = new THREE.Vector3().subVectors(this.pinchCenterWorld, currentPinchCenterWorld);

            this.camera.position.add(panDelta);
        }
    }

    _onTouchEnd(event) {
        // Redefine todos os estados de interação de toque
        this.isDraggingNode = false;
        this.isPanning = false;
        this._isPinching = false;
    }

    _onNodeClick(event) {
        // Se estiver arrastando um nó ou pan, não processa o clique para evitar ações acidentais.
        // O event.button !== 0 filtra cliques que não sejam com o botão esquerdo.
        // event.touches && event.touches.length > 1 filtra toques com múltiplos dedos.
        if (this.isDraggingNode || this.isPanning || this._isPinching || event.button !== 0 || (event.touches && event.touches.length > 1)) {
            return;
        }

        this.mouse.copy(this._getPointerCoordinates(event));
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.mainGroup.children, true);

        let clickedNode = null;
        for (const intersect of intersects) {
            // Prioriza o grupo do nó (o pai) se for um elemento do nó e não o drag handle
            if (intersect.object.parent && intersect.object.parent.userData.isNode && !intersect.object.userData.isDragHandle) {
                clickedNode = intersect.object.parent;
                break;
            } else if (intersect.object.userData.isNode && !intersect.object.userData.isDragHandle) {
                // Caso o próprio objeto seja o nó (ex: o mesh do retângulo)
                clickedNode = intersect.object;
                break;
            }
        }

        if (clickedNode) {
            const d3NodeData = clickedNode.userData.d3Node.data;
            this.openSidebar(d3NodeData.name, d3NodeData.explanation || 'Nenhuma explicação disponível para este tópico.');
        } else {
            // Se o clique for fora de um nó e a sidebar estiver aberta, fecha-a.
            if (this.isSidebarOpen) {
                this.closeSidebar();
            }
        }
    }

    // --- SIDEBAR METHODS ---
    openSidebar(title, content) {
        if (this.sidebar) {
            this.sidebarTitle.textContent = title;
            this.sidebarContent.textContent = content;
            this.sidebar.classList.add('open');
            this.isSidebarOpen = true;
            // A lógica de controle de câmera customizada já verifica this.isSidebarOpen
            // para desativar as interações quando a sidebar está aberta.
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
        // Não há OrbitControls para atualizar aqui. A câmera é movida diretamente pelos eventos.
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
                {
                    "name": "Conceito de Auditoria",
                    "explanation": "Processo sistemático, independente e documentado para obter evidência objetiva e avaliá-la. Em TI, foca em garantir a confidencialidade, integridade e disponibilidade dos sistemas."
                },
                {
                    "name": "Controle Interno (COSO)",
                    "explanation": "Processo conduzido pela governança e administração para proporcionar segurança razoável quanto à realização dos objetivos de operações, divulgação e conformidade.",
                    "children": [
                        {
                            "name": "Componentes do COSO",
                            "explanation": "O framework COSO estabelece cinco componentes integrados: 1. Ambiente de Controle, 2. Avaliação de Riscos, 3. Atividades de Controle, 4. Informação e Comunicação, 5. Atividades de Monitoramento."
                        }
                    ]
                },
                {
                    "name": "Relação Auditoria e Controle Interno",
                    "explanation": "A Auditoria Interna avalia a eficácia dos processos de governança, gerenciamento de riscos e controles internos, funcionando como a Terceira Linha de Defesa na estrutura de governança.",
                    "children": [
                        {
                            "name": "Auditoria Interna",
                            "explanation": "Atividade independente e objetiva de avaliação e consultoria, desenhada para adicionar valor e melhorar as operações de uma organização."
                        },
                        {
                            "name": "Terceira Linha de Defesa",
                            "explanation": "A Auditoria Interna fornece uma avaliação independente à alta administração sobre a eficácia da primeira (gestão operacional) e segunda (supervisão de riscos) linhas de defesa."
                        }
                    ]
                },
                {
                    "name": "Foco CEBRASPE (Pontos de Atenção)",
                    "explanation": "Principais 'pegadinhas' e pontos de atenção cobrados pela banca CEBRASPE sobre a relação entre Auditoria e Controle Interno.",
                    "children": [
                        {
                            "name": "Auditoria Interna vs. Controle Interno",
                            "explanation": "ERRO COMUM: Afirmar que a Auditoria Interna é parte do controle interno. CORRETO: A Auditoria Interna AVALIA o controle interno, mas é um componente da GOVERNANÇA para manter sua independência."
                        },
                        {
                            "name": "Segurança Razoável vs. Absoluta",
                            "explanation": "O controle interno proporciona segurança 'razoável', não absoluta. Limitações inerentes como erro humano, conluio e decisões gerenciais impedem a eliminação total dos riscos."
                        },
                        {
                            "name": "Posicionamento da Auditoria Interna",
                            "explanation": "A independência é crítica. A Auditoria Interna deve se reportar funcionalmente ao mais alto nível da organização (Conselho de Administração, Comitê de Auditoria) para garantir autonomia."
                        }
                    ]
                }
            ]
        },
        {
            "name": "2. Tipos de Auditoria",
            "explanation": "Classificação das auditorias governamentais (segundo ISSAI e TCU) em três tipos principais de acordo com seus objetivos: Financeira, de Conformidade e Operacional.",
            "children": [
                {
                    "name": "Auditoria Financeira",
                    "explanation": "Objetivo: Expressar opinião sobre a fidedignidade e correção das demonstrações financeiras. Foco na conformidade com o arcabouço de relatório financeiro aplicável. Exemplo em TI: verificar se ativos de hardware/software estão corretamente registrados."
                },
                {
                    "name": "Auditoria de Conformidade (Regularidade)",
                    "explanation": "Objetivo: Expressar opinião se as atividades e transações estão em conformidade com leis e normas. Foco na legalidade, legitimidade e regularidade. Exemplo em TI: verificar conformidade com a Lei nº 14.133/2021 ou LGPD."
                },
                {
                    "name": "Auditoria Operacional (Desempenho)",
                    "explanation": "Objetivo: Examinar a economicidade, eficiência, eficácia e efetividade ('4 Es') das operações. Foco na avaliação do desempenho da gestão e identificação de melhorias. Exemplo em TI: avaliar se um novo sistema atinge seus objetivos de forma eficiente.",
                    "children": [
                        {
                            "name": "Os '4 Es'",
                            "explanation": "Economia (minimizar custo dos insumos), Eficiência (relação produto/insumo), Eficácia (grau de alcance dos objetivos) e Efetividade (impacto final na sociedade)."
                        }
                    ]
                },
                {
                    "name": "Foco CEBRASPE (Pontos de Atenção)",
                    "explanation": "Diferenças cruciais entre os tipos de auditoria que são frequentemente exploradas em questões.",
                    "children": [
                        {
                            "name": "Distinção dos Objetivos",
                            "explanation": "Associações mandatórias: Financeira → Fidedignidade Contábil; Conformidade → Legalidade/Normas; Operacional → Desempenho e os '4 Es'. A banca pode confundir esses focos."
                        },
                        {
                            "name": "Conhecimento dos '4 Es'",
                            "explanation": "É fundamental conhecer o significado de cada 'E' da Auditoria Operacional (Economia, Eficiência, Eficácia, Efetividade), pois são conceitos distintos e frequentemente cobrados."
                        }
                    ]
                }
            ]
        },
        {
            "name": "3. O Processo de Auditoria",
            "explanation": "Descreve as fases fundamentais do trabalho de auditoria (Planejamento, Execução, Relatório) e os principais instrumentos e documentos gerados, como papéis de trabalho e achados.",
            "children": [
                {
                    "name": "Fases da Auditoria",
                    "explanation": "O trabalho de auditoria é estruturado em três fases sequenciais e interdependentes.",
                    "children": [
                        {
                            "name": "1. Planejamento",
                            "explanation": "Fase crítica que define escopo, objetivos, materialidade e abordagem. Envolve conhecer a entidade e avaliar riscos e controles para definir os procedimentos."
                        },
                        {
                            "name": "2. Execução",
                            "explanation": "Fase de aplicação dos procedimentos definidos no planejamento, com coleta de evidências através de testes de controle e procedimentos substantivos."
                        },
                        {
                            "name": "3. Relatório",
                            "explanation": "Fase de comunicação dos resultados, conclusões e recomendações da auditoria para as partes interessadas, sendo o produto final do trabalho."
                        }
                    ]
                },
                {
                    "name": "Instrumentos da Auditoria",
                    "explanation": "Conjunto de documentos e ferramentas que formalizam e evidenciam o trabalho do auditor.",
                    "children": [
                        {
                            "name": "Papéis de Trabalho",
                            "explanation": "Conjunto de documentos e registros que constituem a evidência do trabalho realizado, suportando as conclusões do relatório."
                        },
                        {
                            "name": "Achado de Auditoria",
                            "explanation": "Resultado da comparação entre a 'situação encontrada' (condição) e o 'critério' (o que deveria ser). Um achado completo possui os '4 Cs'.",
                            "children": [
                                {
                                    "name": "Os '4 Cs' do Achado",
                                    "explanation": "Condição (o que é), Critério (o que deveria ser), Causa (razão da divergência) e Consequência/Efeito (impacto ou risco)."
                                }
                            ]
                        },
                        {
                            "name": "Matriz de Achados",
                            "explanation": "Instrumento usado no planejamento para consolidar os achados, suas causas, efeitos e as propostas de recomendação."
                        },
                        {
                            "name": "Relatório de Auditoria",
                            "explanation": "Produto final e principal instrumento de comunicação dos resultados da auditoria."
                        }
                    ]
                },
                {
                    "name": "Foco CEBRASPE (Pontos de Atenção)",
                    "explanation": "Aspectos do processo de auditoria que são alvos frequentes de questões de concurso.",
                    "children": [
                        {
                            "name": "Importância do Planejamento",
                            "explanation": "O planejamento é a fase mais crítica, não a execução. Um planejamento inadequado, não baseado em riscos, compromete todo o trabalho."
                        },
                        {
                            "name": "Atributos do Achado ('4 Cs')",
                            "explanation": "A banca frequentemente testa o conhecimento sobre os '4 Cs', questionando a validade ou completude de um achado que não apresente todos os quatro atributos."
                        },
                        {
                            "name": "Evidência de Auditoria",
                            "explanation": "As conclusões devem ser baseadas em evidência 'suficiente e apropriada'. Suficiência refere-se à QUANTIDADE de evidência; Apropriação refere-se à QUALIDADE (relevância e fidedignidade)."
                        }
                    ]
                }
            ]
        }
    ]
}


// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Por padrão, o container é o body. Se você tiver um container específico, mude aqui.
    new MindMapViewer(document.body, mindMapData);
});