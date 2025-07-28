import * as THREE from 'three';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';

// NOVO: Versão atualizada do programa.
const APP_VERSION = 'v1.0.8 - modern style improvements'; // Atualizado para refletir o novo estilo

// --- 1. CONFIGURAÇÕES CENTRALIZADAS (ESTILO MODERNO) ---
const CONFIG = {
    backgroundColor: 0x0F111A, // Azul muito escuro, quase preto para um fundo moderno
    nodeColors: [
        0x334466, // Azul petróleo suave (Base)
        0x556688, // Azul médio
        0x7788AA, // Azul acinzentado claro
        0x99AABB, // Azul acinzentado muito claro
        0xF9A825, // Amarelo/Laranja vibrante para destaque ou profundidade (se usar mais de 4 níveis)
        0x4CAF50  // Verde suave para outro nível (se usar mais de 5 níveis)
    ],
    linkColor: 0x81D4FA, // Azul claro, vibrante e moderno
    dragHandleColor: 0xFFFFFF, // Branco puro para sutilidade
    textColor: 0xFFFFFF, // Branco puro para contraste máximo
    font: {
        size: 16, // Um pouco maior para melhor legibilidade
    },
    padding: { x: 20, y: 10 }, // Aumentar um pouco o padding interno do nó
    borderRadius: 12, // Cantos mais arredondados para um toque mais suave
    dragHandleRadius: 6, // Um pouco menor e mais discreto
    zoom: {
        speed: 0.2, // Velocidade do zoom para roda do mouse e pinch (ajustável)
        min: 0.05,  // Permite mais zoom out (mais afastado)
        max: 8,     // Permite mais zoom in (mais aproximado)
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

        // NOVO: Variáveis para diferenciar tap de drag em touch
        this.initialTouchCoords = new THREE.Vector2(); // Armazena a posição inicial do toque
        this.isConsideredClick = true; // Flag para determinar se a sequência de toque foi um clique
        this.tapThreshold = 5; // Limiar de movimento em pixels para considerar um drag ao invés de um click/tap

        // Sidebar elements (assumindo que existam no seu HTML)
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

        // LISTENER DE CLIQUE NO NÓ (MANTIDO PARA DESKTOP, MAS TAPS MOBILE SÃO TRATADOS EM _onTouchEnd)
        this.renderer.domElement.addEventListener('click', this._onNodeClick.bind(this));


        // Listener do botão de fechar da sidebar
        if (this.sidebarCloseButton) {
            this.sidebarCloseButton.addEventListener('click', this.closeSidebar.bind(this));
        }
    }

    _createVersionInfo() {
        const versionElement = document.createElement('div');
        versionElement.textContent = `Mind Map ${APP_VERSION}`;

        Object.assign(versionElement.style, {
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            color: 'rgba(255, 255, 255, 0.5)', // Cor branca suave para o texto da versão
            backgroundColor: 'rgba(15, 17, 26, 0.5)', // Cor do fundo do botão para combinar com o background da cena
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
            textMesh.position.z = 0.1; // Levemente à frente do retângulo

            textMesh.sync(() => {
                const bounds = textMesh.textRenderInfo.bounds;
                // Fallback se bounds não estiverem disponíveis imediatamente
                const textWidth = bounds ? bounds.x[1] - bounds.x[0] : d3Node.data.name.length * (CONFIG.font.size * 0.6);
                const textHeight = bounds ? bounds.y[1] - bounds.y[0] : CONFIG.font.size * 1.2;

                const rectWidth = textWidth + CONFIG.padding.x * 2;
                const rectHeight = textHeight + CONFIG.padding.y * 2;

                const rectGeo = createRoundedRectGeometry(rectWidth, rectHeight, CONFIG.borderRadius);
                const rectMat = new THREE.MeshBasicMaterial({ color: nodeColor });
                const rectMesh = new THREE.Mesh(rectGeo, rectMat);
                rectMesh.position.x = rectWidth / 2; // Centraliza o retângulo para que o texto comece no padding.x
                nodeGroup.add(rectMesh);

                // Borda para destaque (opcional, mais sutil agora)
                const borderGeo = createRoundedRectGeometry(rectWidth + 4, rectHeight + 4, CONFIG.borderRadius);
                const borderMat = new THREE.MeshBasicMaterial({
                    color: nodeColor, // Usar a mesma cor do nó para uma borda sutil
                    transparent: true,
                    opacity: 0.2 // Aumentar um pouco a opacidade para ser mais perceptível
                });
                const borderMesh = new THREE.Mesh(borderGeo, borderMat);
                borderMesh.position.x = rectWidth / 2;
                borderMesh.position.z = -0.05; // Levemente para trás do retângulo principal
                nodeGroup.add(borderMesh);

                textMesh.position.x = CONFIG.padding.x; // Posição do texto alinhada com o padding

                nodeGroup.add(textMesh);
                nodeGroup.userData.nodeWidth = rectWidth;

                // Drag Handle
                const handleGeo = new THREE.CircleGeometry(CONFIG.dragHandleRadius, 32);
                const handleMat = new THREE.MeshBasicMaterial({ color: CONFIG.dragHandleColor, transparent: true, opacity: 0.6 });
                const handleMesh = new THREE.Mesh(handleGeo, handleMat);
                handleMesh.position.set(rectWidth, 0, 0.2); // Posição à direita do nó
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

        // Ponto de início: direita do nó fonte
        const start = new THREE.Vector3(
            sourceNodeGroup.position.x + sourceNodeGroup.userData.nodeWidth,
            sourceNodeGroup.position.y,
            0
        );
        // Ponto de término: esquerda do nó destino
        const end = targetNodeGroup.position;

        // Pontos de controle para uma curva suave (Bezier)
        const controlPoint1 = new THREE.Vector3((start.x + end.x) / 2, start.y, 0);
        const controlPoint2 = new THREE.Vector3((start.x + end.x) / 2, end.y, 0);

        const curve = new THREE.CubicBezierCurve3(start, controlPoint1, controlPoint2, end);
        const points = curve.getPoints(50); // Mais pontos para uma curva mais suave
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: CONFIG.linkColor,
            linewidth: 3, // Aumenta a espessura da linha
            transparent: true,
            opacity: 0.4 // Reduz a opacidade para um visual mais suave
        });

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
        // Limpa a cena antes de redesenhar
        while (this.mainGroup.children.length) {
            this.mainGroup.remove(this.mainGroup.children[0]);
        }
        this.nodeMap.clear();
        this.linkObjects = [];
        this.dragHandles = [];

        const root = hierarchy(this.data);
        const d3Nodes = root.descendants();
        const d3Links = root.links();

        // Calcular a largura máxima do texto para espaçamento horizontal
        const maxTextLength = d3Nodes.reduce((max, n) => Math.max(max, n.data.name.length), 0);
        // Ajustar espaçamento baseado no tamanho da fonte e padding configurados
        const horizontalNodeSpacing = CONFIG.padding.x * 2 + CONFIG.font.size * maxTextLength * 0.6; // Estimativa de largura do texto
        const verticalNodeSpacing = CONFIG.padding.y * 2 + CONFIG.font.size * 1.5; // Estimativa de altura da linha

        // Ajuste do espaçamento entre os nós
        const horizontalSpacing = horizontalNodeSpacing + 80; // Adiciona um valor fixo para espaço extra
        const verticalSpacing = verticalNodeSpacing + 30; // Adiciona um valor fixo para espaço extra

        const treeLayout = tree().nodeSize([verticalSpacing, horizontalSpacing]);
        treeLayout(root);

        const nodePromises = d3Nodes.map(d3Node => this._createNodeMesh(d3Node));
        const nodeGroups = await Promise.all(nodePromises);

        nodeGroups.forEach(nodeGroup => {
            const d3Node = nodeGroup.userData.d3Node;
            // Posição ajustada: d3.tree retorna y para profundidade e x para ordem.
            // Invertemos para layout horizontal e centralizamos os nós verticalmente.
            nodeGroup.position.set(d3Node.y, -d3Node.x, 0);
            this.mainGroup.add(nodeGroup);
            this.nodeMap.set(d3Node, nodeGroup);
        });

        d3Links.forEach(link => this._createLinkMesh(link));

        // Centralizar o mapa mental na cena
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

        // 1. Posição do mouse em NDC (Normalized Device Coordinates)
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

        // 7. Calcular o deslocamento (pan) necessário para manter o ponto sob o mouse fixo
        const panDelta = new THREE.Vector3().subVectors(worldPosBeforeZoom, worldPosAfterZoom);

        // 8. Aplicar o deslocamento à posição da câmera
        this.camera.position.add(panDelta);
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

                const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Plano XY em Z=0
                const intersectionPoint = new THREE.Vector3();
                this.raycaster.ray.intersectPlane(plane, intersectionPoint);

                // Calcula o offset do ponto de clique em relação ao centro do nó
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

        this.isConsideredClick = true; // Assume que é um clique/tap inicialmente

        if (event.touches.length === 1) {
            this.initialTouchCoords.set(event.touches[0].clientX, event.touches[0].clientY); // Guarda a posição inicial do toque para detecção de tap

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
            this.isConsideredClick = false; // Dois dedos significa que não é um clique

            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            // Calcula a distância inicial entre os dois toques
            this.initialPinchDistance = Math.sqrt(
                Math.pow(touch1.clientX - touch2.clientX, 2) +
                Math.pow(touch1.clientY - touch2.clientY, 2)
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

        // NOVO: Verifica se houve movimento significativo para desativar a detecção de "click"
        if (this.isConsideredClick && event.touches.length === 1) {
            const currentX = event.touches[0].clientX;
            const currentY = event.touches[0].clientY;
            const deltaX = currentX - this.initialTouchCoords.x;
            const deltaY = currentY - this.initialTouchCoords.y;
            const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (moveDistance > this.tapThreshold) {
                this.isConsideredClick = false; // Moveu demais, não é um clique/tap
            }
        }

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
            this.isConsideredClick = false; // Pinching is never a click

            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            // Calcula a distância atual entre os dois toques
            const currentPinchDistance = Math.sqrt(
                Math.pow(touch1.clientX - touch2.clientX, 2) +
                Math.pow(touch1.clientY - touch2.clientY, 2)
            );

            // Calcula o novo zoom com base na proporção da distância de pinça e o zoom inicial
            let newZoom = this.initialPinchZoom * (currentPinchDistance / this.initialPinchDistance);

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
        // NOVO: Se foi considerado um clique/tap (sem movimento significativo ou multi-touch)
        if (this.isConsideredClick) {
            // Reutiliza as coordenadas do toque inicial ou as últimas coordenadas do mouse
            // para o raycaster. Para taps, a posição inicial é a mais precisa.
            // Para garantir que o raycaster use a posição correta do touch,
            // podemos recalcular a partir da posição do `touchend` se necessário,
            // mas `this.mouse` já deve estar atualizado do `_onTouchStart`.
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

        // Redefine todos os estados de interação de toque
        this.isDraggingNode = false;
        this.isPanning = false;
        this._isPinching = false;
        this.isConsideredClick = true; // Reseta para a próxima interação
    }

    // Mantido para clicks de mouse em desktop (e não afetará o touch)
    _onNodeClick(event) {
        // Se estiver arrastando um nó ou pan, não processa o clique para evitar ações acidentais.
        // event.button !== 0 filtra cliques que não sejam com o botão esquerdo.
        // event.touches && event.touches.length > 1 é uma verificação que é redundante aqui se
        // este listener é para o evento 'click' do navegador (que não tem 'touches').
        if (this.isDraggingNode || this.isPanning || this._isPinching || event.button !== 0) {
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
        // A câmera é movida diretamente pelos eventos, sem necessidade de update de controles externos.
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
    // Por padrão, o container é o body. Se você tiver um container específico (ex: <div id="mindmap-container">), mude aqui.
    new MindMapViewer(document.body, mindMapData);
});