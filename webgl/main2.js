import * as THREE from 'three';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';

// NOVO: Versão atualizada do programa.
const APP_VERSION = 'v1.0.9 - image style adaptation'; // Atualizado para refletir o novo estilo

// --- 1. CONFIGURAÇÕES CENTRALIZADAS (ESTILO DA IMAGEM) ---
const CONFIG = {
    backgroundColor: 0xF0F0F0, // Fundo cinza muito claro, quase branco
    nodeColors: [
        0xC5E1F6, // Azul pastel claro (similar ao "Quick & Easy")
        0xCCE9CC, // Verde pastel claro (similar ao "Input")
        0xFAC8C8, // Rosa pastel claro (similar ao "Output")
        0xD4EEF8, // Outro azul claro (similar ao "Collaboration")
        0xFFECB3, // Amarelo pastel (para sub-níveis)
        0xE0E0E0 // Cinza claro (para sub-sub-níveis)
    ],
    linkColor: 0x909090, // Cinza médio para linhas de conexão
    dragHandleColor: 0x909090, // Cinza para o handle
    textColor: 0x333333, // Cinza escuro para texto, para bom contraste
    font: {
        size: 16, // Um pouco maior para melhor legibilidade
    },
    padding: { x: 20, y: 10 }, // Aumentar um pouco o padding interno do nó
    borderRadius: 12, // Cantos bem arredondados para um toque mais suave
    dragHandleRadius: 6, // Um pouco menor e mais discreto
    zoom: {
        speed: 0.2, // Velocidade do zoom para roda do mouse e pinch (ajustável)
        min: 0.05, // Permite mais zoom out (mais afastado)
        max: 8, // Permite mais zoom in (mais aproximado)
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
            color: 'rgba(51, 51, 51, 0.5)', // Cor cinza suave para o texto da versão
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fundo translúcido para combinar
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
            // A ancoragem inicial é 'left', será ajustada em drawMindMap para ramos à esquerda
            textMesh.anchorX = 'left';
            textMesh.anchorY = 'middle';
            textMesh.position.z = 0.1; // Levemente à frente do retângulo

            textMesh.sync(() => {
                const bounds = textMesh.textRenderInfo.bounds;
                const textWidth = bounds ? bounds.x[1] - bounds.x[0] : d3Node.data.name.length * (CONFIG.font.size * 0.6);
                const textHeight = bounds ? bounds.y[1] - bounds.y[0] : CONFIG.font.size * 1.2;

                const rectWidth = textWidth + CONFIG.padding.x * 2;
                const rectHeight = textHeight + CONFIG.padding.y * 2;

                const rectGeo = createRoundedRectGeometry(rectWidth, rectHeight, CONFIG.borderRadius);
                const rectMat = new THREE.MeshBasicMaterial({ color: nodeColor });
                const rectMesh = new THREE.Mesh(rectGeo, rectMat);
                // Centraliza o retângulo em relação à origem do grupo
                rectMesh.position.x = 0;
                rectMesh.position.y = 0;
                nodeGroup.add(rectMesh);

                // A posição do texto será ajustada em drawMindMap
                textMesh.position.x = -rectWidth / 2 + CONFIG.padding.x;
                textMesh.position.y = 0; // Já está anchorY: 'middle'

                nodeGroup.add(textMesh);
                nodeGroup.userData.nodeWidth = rectWidth;
                nodeGroup.userData.nodeHeight = rectHeight; // Guardar altura também

                // Drag Handle (discreto, como na imagem). Posição será ajustada em drawMindMap
                const handleGeo = new THREE.CircleGeometry(CONFIG.dragHandleRadius, 32);
                const handleMat = new THREE.MeshBasicMaterial({ color: CONFIG.dragHandleColor, transparent: true, opacity: 0.6 });
                const handleMesh = new THREE.Mesh(handleGeo, handleMat);
                handleMesh.position.set(rectWidth / 2, 0, 0.2); // Posição padrão (direita)
                handleMesh.userData = { isDragHandle: true, nodeGroup };

                nodeGroup.add(handleMesh);
                this.dragHandles.push(handleMesh);

                resolve(nodeGroup);
            });
        });
    }

    _createLinkMesh(linkData, isLeftBranch) {
        const sourceNodeGroup = this.nodeMap.get(linkData.source);
        const targetNodeGroup = this.nodeMap.get(linkData.target);

        if (!sourceNodeGroup || !targetNodeGroup) return;

        let sourceX, targetX;
        // Ajusta as posições X de origem e destino com base na direção do ramo
        if (isLeftBranch) {
            sourceX = sourceNodeGroup.position.x - sourceNodeGroup.userData.nodeWidth / 2; // Borda esquerda do nó pai
            targetX = targetNodeGroup.position.x + targetNodeGroup.userData.nodeWidth / 2; // Borda direita do nó filho
        } else {
            sourceX = sourceNodeGroup.position.x + sourceNodeGroup.userData.nodeWidth / 2; // Borda direita do nó pai
            targetX = targetNodeGroup.position.x - targetNodeGroup.userData.nodeWidth / 2; // Borda esquerda do nó filho
        }

        const sourceY = sourceNodeGroup.position.y; // Centro Y do nó pai
        const targetY = targetNodeGroup.position.y; // Centro Y do nó filho

        const start = new THREE.Vector3(sourceX, sourceY, 0);
        const end = new THREE.Vector3(targetX, targetY, 0);

        const horizontalElbowOffset = 60; // Mantém a linha estendida horizontalmente

        const points = [
            start,
            new THREE.Vector3(sourceX + (isLeftBranch ? -horizontalElbowOffset : horizontalElbowOffset), sourceY, 0), // Extensão horizontal
            new THREE.Vector3(sourceX + (isLeftBranch ? -horizontalElbowOffset : horizontalElbowOffset), targetY, 0), // Virada vertical
            end
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: CONFIG.linkColor,
            linewidth: 2,
            transparent: true,
            opacity: 1
        });

        const lineObject = new THREE.Line(geometry, material);
        lineObject.userData = { linkData, isLeftBranch }; // Armazena a direção do ramo
        this.linkObjects.push(lineObject);
        this.mainGroup.add(lineObject);
    }

    updateLinks() {
        for (const linkObject of this.linkObjects) {
            const { linkData, isLeftBranch } = linkObject.userData;
            const sourceNodeGroup = this.nodeMap.get(linkData.source);
            const targetNodeGroup = this.nodeMap.get(linkData.target);

            if (sourceNodeGroup && targetNodeGroup) {
                let sourceX, targetX;
                if (isLeftBranch) {
                    sourceX = sourceNodeGroup.position.x - sourceNodeGroup.userData.nodeWidth / 2;
                    targetX = targetNodeGroup.position.x + targetNodeGroup.userData.nodeWidth / 2;
                } else {
                    sourceX = sourceNodeGroup.position.x + sourceNodeGroup.userData.nodeWidth / 2;
                    targetX = targetNodeGroup.position.x - targetNodeGroup.userData.nodeWidth / 2;
                }

                const sourceY = sourceNodeGroup.position.y;
                const targetY = targetNodeGroup.position.y;

                const start = new THREE.Vector3(sourceX, sourceY, 0);
                const end = new THREE.Vector3(targetX, targetY, 0);

                const horizontalElbowOffset = 60;

                const points = [
                    start,
                    new THREE.Vector3(sourceX + (isLeftBranch ? -horizontalElbowOffset : horizontalElbowOffset), sourceY, 0),
                    new THREE.Vector3(sourceX + (isLeftBranch ? -horizontalElbowOffset : horizontalElbowOffset), targetY, 0),
                    end
                ];

                linkObject.geometry.setFromPoints(points);
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
        const estimatedTextWidth = CONFIG.font.size * maxTextLength * 0.6;

        const estimatedNodeWidth = estimatedTextWidth + CONFIG.padding.x * 2;
        const estimatedNodeHeight = CONFIG.font.size * 1.2 + CONFIG.padding.y * 2;

        const horizontalSpacing = estimatedNodeWidth + 180;
        const verticalSpacing = estimatedNodeHeight + 60;

        // Para um layout horizontal, o D3.js usa [vertical_space, horizontal_space]
        const treeLayout = tree().nodeSize([verticalSpacing, horizontalSpacing]);
        treeLayout(root);

        const nodePromises = d3Nodes.map(d3Node => this._createNodeMesh(d3Node));
        const nodeGroups = await Promise.all(nodePromises);

        // Separa os filhos diretos do nó raiz
        const children = root.children;
        const leftChildren = [];
        const rightChildren = [];

        // Distribui os filhos alternadamente para esquerda e direita
        // A lógica pode ser mais complexa se você tiver requisitos específicos de balanceamento
        for (let i = 0; i < children.length; i++) {
            if (i % 2 === 0) { // Alterna entre direita e esquerda
                rightChildren.push(children[i]);
            } else {
                leftChildren.push(children[i]);
            }
        }

        // Primeiro, posicione o nó raiz
        const rootNodeGroup = nodeGroups.find(ng => ng.userData.d3Node === root);
        if (rootNodeGroup) {
            rootNodeGroup.position.set(0, 0, 0); // Raiz no centro
            this.mainGroup.add(rootNodeGroup);
            this.nodeMap.set(root, rootNodeGroup);
        }

        // Itera sobre todos os nós e ajusta a posição
        nodeGroups.forEach(nodeGroup => {
            const d3Node = nodeGroup.userData.d3Node;

            if (d3Node === root) {
                // O nó raiz já foi posicionado
                return;
            }

            // Descobre se o nó pertence a um ramo da esquerda ou da direita
            let isLeftBranch = false;
            let current = d3Node;
            while (current.parent && current.parent !== root) {
                current = current.parent;
            }
            if (leftChildren.includes(current)) {
                isLeftBranch = true;
            }

            // `d3Node.y` é a profundidade (horizontal no layout padrão do d3.tree), `d3Node.x` é a ordem (vertical)
            let posX = d3Node.y;
            let posY = -d3Node.x; // Y negativo para que o layout se expanda para cima e para baixo do nó raiz

            const textMesh = nodeGroup.children.find(child => child instanceof Text);
            const handleMesh = nodeGroup.children.find(child => child.userData.isDragHandle);

            if (isLeftBranch) {
                // Para os ramos da esquerda, inverta a direção X
                posX = -d3Node.y;
                // E também ajuste a posição do texto e do handle dentro do nó para ficar à direita
                if (textMesh && handleMesh) {
                    textMesh.anchorX = 'right';
                    textMesh.position.x = nodeGroup.userData.nodeWidth / 2 - CONFIG.padding.x;
                    // Posiciona o handle na borda esquerda
                    handleMesh.position.set(-nodeGroup.userData.nodeWidth / 2, 0, 0.2);
                }
            } else {
                // Para os ramos da direita, mantém a lógica atual (texto à esquerda, handle à direita)
                if (textMesh && handleMesh) {
                    textMesh.anchorX = 'left';
                    textMesh.position.x = -nodeGroup.userData.nodeWidth / 2 + CONFIG.padding.x;
                    handleMesh.position.set(nodeGroup.userData.nodeWidth / 2, 0, 0.2);
                }
            }
            nodeGroup.position.set(posX, posY, 0);
            this.mainGroup.add(nodeGroup);
            this.nodeMap.set(d3Node, nodeGroup);
        });

        // Cria as links, passando a direção do ramo para ajustar a curvatura
        d3Links.forEach(link => {
            let isLeftBranch = false;
            let current = link.target;
            while (current.parent && current.parent !== root) {
                current = current.parent;
            }
            if (leftChildren.includes(current)) {
                isLeftBranch = true;
            }
            this._createLinkMesh(link, isLeftBranch);
        });

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
            this.camera.position.y += deltaY * panSpeed;

            this.lastPointerPosition.set(event.clientX, event.clientY);
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
    "name": "Nova Auditoria e Controle Interno",
    "explanation": "Mapa mental atualizado com nova estrutura para testar o layout bidirecional.",
    "children": [
        {
            "name": "Grupo A",
            "explanation": "Este é o primeiro grupo, que irá para a direita.",
            "children": [
                { "name": "Sub-A1", "explanation": "Detalhe de Sub-A1." },
                {
                    "name": "Sub-A2", "explanation": "Detalhe de Sub-A2.",
                    "children": [
                        { "name": "Sub-A2.1", "explanation": "Mais detalhes." }
                    ]
                }
            ]
        },
        {
            "name": "Grupo B",
            "explanation": "Este é o segundo grupo, que irá para a esquerda.",
            "children": [
                { "name": "Sub-B1", "explanation": "Detalhe de Sub-B1." },
                { "name": "Sub-B2", "explanation": "Detalhe de Sub-B2." }
            ]
        },
        {
            "name": "Grupo C",
            "explanation": "Este é o terceiro grupo, que irá para a direita novamente.",
            "children": [
                { "name": "Sub-C1", "explanation": "Detalhe de Sub-C1." }
            ]
        },
        {
            "name": "Grupo D",
            "explanation": "Este é o quarto grupo, que irá para a esquerda novamente.",
            "children": [
                { "name": "Sub-D1", "explanation": "Detalhe de Sub-D1." }
            ]
        },
        {
            "name": "Grupo E",
            "explanation": "Um último grupo para garantir a alternância.",
            "children": [
                { "name": "Sub-E1", "explanation": "Detalhe de Sub-E1." },
                { "name": "Sub-E2", "explanation": "Detalhe de Sub-E2." }
            ]
        }
    ]
};


// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Por padrão, o container é o body. Se você tiver um container específico (ex: <div id="mindmap-container">), mude aqui.
    new MindMapViewer(document.body, mindMapData);
});