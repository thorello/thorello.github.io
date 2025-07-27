import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';

// --- 1. CONFIGURAÇÕES CENTRALIZADAS ---
const CONFIG = {
    backgroundColor: 0x0b0c10, // Fundo bem escuro
    nodeColors: [
        0x1f2833, // Azul escuro acinzentado (Base)
        0x2e4a5a, // Azul escuro um pouco mais claro
        0x123C4F, // Um tom de azul mais profundo
        0x0A2B3E, // Um azul muito escuro para contraste
        0x334a52,
        0x5c848d,
        0x22333b,
        0x7fc7d9
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
        speed: 0.75, // Velocidade do zoom
        min: 0.1,    // Zoom mínimo
        max: 20,     // Zoom máximo
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

        // Variáveis para controle de toque
        this.initialPinchDistance = 0;
        this.lastPinchCenterScreen = new THREE.Vector2(); // Posição do centro do pinch na tela
        this.lastPinchCenterWorld = new THREE.Vector3(); // Posição do centro do pinch no mundo antes do zoom
        this._isPinching = false;


        // Sidebar elements
        this.sidebar = document.getElementById('sidebar');
        this.sidebarTitle = document.getElementById('sidebar-title');
        this.sidebarContent = document.getElementById('sidebar-content');
        this.sidebarCloseButton = document.getElementById('sidebar-close');
        this.isSidebarOpen = false;


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

    // ✅ MÉTODO ATUALIZADO
    _initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false;

        // --- MUDANÇA: Desabilitamos o zoom padrão ---
        // Isso nos permite implementar nosso próprio comportamento de "zoom no ponteiro".
        this.controls.enableZoom = false;

        this.controls.enablePan = true;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.PAN, // Botão do meio agora faz PAN também
            RIGHT: THREE.MOUSE.PAN
        };
        this.controls.touches = {
            ONE: THREE.TOUCH.PAN,
            // OrbitControls ainda lida com o pinch-to-zoom e pan de dois dedos
            TWO: THREE.TOUCH.DOLLY_PAN
        };
        // Os limites de zoom (min/max) serão aplicados no nosso listener personalizado.
    }

    // ✅ MÉTODO ATUALIZADO
    _initEventListeners() {
        window.addEventListener('resize', this._onWindowResize.bind(this));
        this.renderer.domElement.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this._onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this._onMouseUp.bind(this));

        // --- MUDANÇA: Adicionamos nosso próprio listener para o evento 'wheel' ---
        this.renderer.domElement.addEventListener('wheel', this._onMouseWheel.bind(this), { passive: false });

        // --- LISTENERS DE TOQUE ---
        this.renderer.domElement.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });

        // --- LISTENER DE CLIQUE NO NÓ ---
        this.renderer.domElement.addEventListener('click', this._onNodeClick.bind(this));

        // Listener do botão de fechar da sidebar
        this.sidebarCloseButton.addEventListener('click', this.closeSidebar.bind(this));

        // O listener 'change' continua, mas agora é usado APENAS para corrigir o zoom de pinça (mobile).
        this.controls.addEventListener('change', this._onControlsChange.bind(this));
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

        const verticalSpacing = 40 + (maxDepth * 15);
        const horizontalSpacing = 150 + (maxTextLength * 7);

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
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        return {
            x: (clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(clientY / this.renderer.domElement.clientHeight) * 2 + 1
        };
    }

    // ✅ NOVO MÉTODO
    /**
     * Lida com o evento de scroll do mouse para implementar o zoom no ponteiro.
     * @param {WheelEvent} event
     */
    _onMouseWheel(event) {
        // Impede o comportamento padrão do navegador (ex: rolar a página)
        event.preventDefault();
        event.stopPropagation();

        // 1. Pega a posição do ponteiro em coordenadas normalizadas (-1 a +1)
        const pointerNDC = this._getPointerCoordinates(event);
        const pointerVector = new THREE.Vector3(pointerNDC.x, pointerNDC.y, 0);

        // 2. Projeta a posição do ponteiro para o "mundo" da cena ANTES do zoom.
        // Este é o ponto que queremos que permaneça sob o cursor.
        const worldPosBefore = pointerVector.clone().unproject(this.camera);

        // 3. Calcula o novo nível de zoom.
        // event.deltaY < 0 é scroll para cima (zoom in), > 0 é para baixo (zoom out).
        const zoomFactor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
        const newZoom = this.camera.zoom * zoomFactor;

        // 4. Aplica o zoom, garantindo que ele fique dentro dos limites definidos.
        this.camera.zoom = Math.max(CONFIG.zoom.min, Math.min(CONFIG.zoom.max, newZoom));
        this.camera.updateProjectionMatrix();

        // 5. Projeta a MESMA posição do ponteiro para o "mundo" DEPOIS do zoom.
        const worldPosAfter = pointerVector.clone().unproject(this.camera);

        // 6. Calcula a diferença (delta) entre a posição do ponto antes e depois do zoom.
        // Este vetor representa o quanto a cena "deslizou" para longe do nosso ponto de interesse.
        const panDelta = new THREE.Vector3().subVectors(worldPosBefore, worldPosAfter);

        // 7. Aplica a correção, movendo (pan) a câmera para compensar o deslizamento.
        // Isso efetivamente "puxa" o ponto de volta para debaixo do cursor do mouse.
        this.camera.position.add(panDelta);

        // 8. ATUALIZA O ALVO DOS CONTROLES. Isto é CRUCIAL.
        // Sem isso, o próximo pan que você fizer estará desalinhado.
        this.controls.target.add(panDelta);
    }

    _onMouseDown(event) {
        if (event.button !== 0) return;

        this.mouse.copy(this._getPointerCoordinates(event));

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.dragHandles);

        if (intersects.length > 0) {
            const handle = intersects[0].object;
            if (handle.userData.isDragHandle) {
                this.controls.enabled = false;
                this.selectedNode = handle.userData.nodeGroup;
                this.isDraggingNode = true;

                const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                const intersectionPoint = new THREE.Vector3();
                this.raycaster.ray.intersectPlane(plane, intersectionPoint);

                this.offset.copy(intersectionPoint).sub(this.selectedNode.position);
            }
        } else {
            this.isDraggingNode = false;
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
        this.controls.enabled = true;
        this.selectedNode = null;
        this.isDraggingNode = false;
    }

    // ✅ MÉTODO ATUALIZADO
    // --- Função para corrigir a posição da câmera após o zoom DE PINÇA (mobile) ---
    // ✅ MÉTODO CORRIGIDO
    // --- Função para corrigir a posição da câmera após o zoom DE PINÇA (mobile) ---
    _onControlsChange() {
        if (this._isPinching) {
            const currentPointerNDC = this.lastPinchCenterScreen;

            const pointerWorldAfterZoom = new THREE.Vector3(currentPointerNDC.x, currentPointerNDC.y, 0).unproject(this.camera);

            // Calcula o delta em relação ao ponto original do início da pinça
            const panDelta = new THREE.Vector3().subVectors(this._pointerWorldBeforeZoom, pointerWorldAfterZoom);

            // Aplica a correção de pan
            this.camera.position.add(panDelta);
            this.controls.target.add(panDelta);

            // A linha que atualizava o _pointerWorldBeforeZoom foi removida.
        }
    }


    // ✅ MÉTODO ATUALIZADO
    _onTouchStart(event) {
        // Se um dedo, tenta arrastar nó ou mover a cena
        if (event.touches.length === 1) {
            // Simula um mouse down para detecção de manipulador de arrasto
            this._onMouseDown({
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY,
                button: 0 // Simula clique esquerdo
            });
            // Se um nó foi selecionado, previne que OrbitControls lide com este toque
            if (this.selectedNode) {
                event.preventDefault();
            }
            this._isPinching = false; // Garante que não estamos em modo pinch
        }
        // Se dois dedos, prepara para zoom e pan
        else if (event.touches.length === 2) {
            // Desativa o arrasto de nó personalizado se um gesto multi-toque for detectado
            this.selectedNode = null;
            this.isDraggingNode = false;

            this.controls.enabled = true; // Garante que OrbitControls esteja habilitado para lidar com o pinch

            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            // Calcula a distância inicial entre os dedos
            this.initialPinchDistance = Math.sqrt(
                (touch1.clientX - touch2.clientX) ** 2 +
                (touch1.clientY - touch2.clientY) ** 2
            );

            // Calcula o centro do pinch na tela (NDC)
            this.lastPinchCenterScreen.set(
                ((touch1.clientX + touch2.clientX) / 2 / this.renderer.domElement.clientWidth) * 2 - 1,
                -((touch1.clientY + touch2.clientY) / 2 / this.renderer.domElement.clientHeight) * 2 + 1
            );

            // Armazena a posição do centro do pinch no mundo ANTES do zoom
            this._pointerWorldBeforeZoom = new THREE.Vector3(this.lastPinchCenterScreen.x, this.lastPinchCenterScreen.y, 0).unproject(this.camera);
            this._isPinching = true; // Sinaliza que o pinch está ativo

            event.preventDefault(); // Evita ações de toque padrão do navegador (ex: rolagem)
        }
    }

    _onTouchMove(event) {
        if (event.touches.length === 1 && this.isDraggingNode) {
            this._onMouseMove({
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY
            });
            event.preventDefault();
        } else if (event.touches.length === 2) {
            event.preventDefault();

            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            this.lastPinchCenterScreen.set(
                ((touch1.clientX + touch2.clientX) / 2 / this.renderer.domElement.clientWidth) * 2 - 1,
                -((touch1.clientY + touch2.clientY) / 2 / this.renderer.domElement.clientHeight) * 2 + 1
            );
        }
    }

    _onTouchEnd(event) {
        if (this.isDraggingNode) {
            this._onMouseUp();
            event.preventDefault();
        }
        this.controls.enabled = true;
        this.initialPinchDistance = 0;
        this.lastPinchCenterScreen.set(0, 0);
        this._isPinching = false;
    }

    _onNodeClick(event) {
        if (this.isDraggingNode || event.button !== 0) {
            return;
        }

        this.mouse.copy(this._getPointerCoordinates(event));
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.mainGroup.children, true);

        let clickedNode = null;
        for (const intersect of intersects) {
            if (intersect.object.parent && intersect.object.parent.userData.isNode && !intersect.object.userData.isDragHandle) {
                clickedNode = intersect.object.parent;
                break;
            } else if (intersect.object.userData.isNode && !intersect.object.userData.isDragHandle) {
                clickedNode = intersect.object;
                break;
            }
        }

        if (clickedNode) {
            const d3NodeData = clickedNode.userData.d3Node.data;
            this.openSidebar(d3NodeData.name, d3NodeData.explanation || 'Nenhuma explicação disponível para este tópico.');
        } else {
            this.closeSidebar();
        }
    }

    // --- SIDEBAR METHODS ---
    openSidebar(title, content) {
        this.sidebarTitle.textContent = title;
        this.sidebarContent.textContent = content;
        this.sidebar.classList.add('open');
        this.isSidebarOpen = true;
    }

    closeSidebar() {
        this.sidebar.classList.remove('open');
        this.isSidebarOpen = false;
    }


    // --- LOOP DE ANIMAÇÃO ---
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}


// --- DADOS DO MAPA MENTAL ---
// (Os dados que você forneceu permanecem inalterados aqui)
const mindMapData = {
    "name": "Elastic Stack (ELK)",
    "explanation": "O Elastic Stack, anteriormente conhecido como ELK Stack, é um conjunto de ferramentas de código aberto para ingestão, processamento, armazenamento, busca e análise de dados. Ele é amplamente utilizado para monitoramento de sistemas, análise de logs, segurança e business intelligence.",
    "children": [
        {
            "name": "Visão Geral",
            "explanation": "Esta seção fornece uma visão geral do Elastic Stack, abordando sua definição e os principais casos de uso para os quais ele é empregado.",
            "children": [
                {
                    "name": "Definição",
                    "explanation": "O Elastic Stack é um conjunto de produtos open source da Elastic para ingestão, armazenamento, busca e análise de dados de maneira escalável e em tempo real."
                },
                {
                    "name": "Casos de Uso",
                    "explanation": "Os casos de uso do Elastic Stack incluem análise de logs, monitoramento de infraestrutura, busca empresarial, análise de segurança (SIEM), e business intelligence."
                }
            ]
        },
        {
            "name": "Elasticsearch",
            "explanation": "Elasticsearch é um mecanismo de busca e análise distribuído e de código aberto, construído sobre o Apache Lucene. Ele permite armazenar, buscar e analisar grandes volumes de dados de forma quase em tempo real.",
            "children": [
                {
                    "name": "Índice Invertido",
                    "explanation": "O índice invertido é a estrutura de dados central do Elasticsearch, que permite buscas de texto completo de forma extremamente rápida. Ele mapeia palavras para os documentos nos quais elas aparecem."
                },
                {
                    "name": "Arquitetura",
                    "explanation": "A arquitetura do Elasticsearch é distribuída e escalável, consistindo em nós que podem ser mestres, de dados, de ingestão, ou de machine learning, trabalhando juntos em um cluster."
                }
            ]
        },
        {
            "name": "Logstash",
            "explanation": "Logstash é um pipeline de processamento de dados do lado do servidor de código aberto que ingere dados de uma infinidade de fontes simultaneamente, os transforma e, em seguida, os envia para o seu 'stash' preferido, como o Elasticsearch.",
            "children": [
                {
                    "name": "Pipelines e Filtros",
                    "explanation": "No Logstash, pipelines definem o fluxo de dados, e filtros são usados para processar e transformar os dados conforme eles passam pelo pipeline (e.g., parsing, enriquecimento)."
                },
                {
                    "name": "Entradas e Saídas",
                    "explanation": "Logstash pode coletar dados de diversas 'entradas' (input plugins) como arquivos, redes, ou APIs, e enviá-los para várias 'saídas' (output plugins) como Elasticsearch, Kafka ou S3."
                },
                {
                    "name": "Casos de Uso Avançados",
                    "explanation": "Logstash é usado em cenários avançados para agregação de logs de diferentes fontes, enriquecimento de dados com informações externas e conformidade com padrões de dados."
                }
            ]
        },
        {
            "name": "Kibana",
            "explanation": "Kibana é uma ferramenta de visualização de dados e gerenciamento para o Elasticsearch. Ele oferece a capacidade de criar painéis interativos e visualizar seus dados de várias maneiras.",
            "children": [
                {
                    "name": "Visualizações",
                    "explanation": "Kibana permite criar diversas visualizações a partir dos dados no Elasticsearch, como gráficos de barras, gráficos de linha, mapas de calor e nuvens de palavras."
                },
                {
                    "name": "Descoberta",
                    "explanation": "A funcionalidade de Descoberta do Kibana permite explorar seus dados brutos, aplicar filtros e fazer buscas complexas para encontrar informações específicas."
                },
                {
                    "name": "Monitoramento",
                    "explanation": "O Kibana fornece ferramentas para monitorar a saúde e o desempenho do seu cluster Elasticsearch e de outros componentes do Elastic Stack."
                },
                {
                    "name": "Canvas",
                    "explanation": "Canvas é um recurso do Kibana que permite criar apresentações dinâmicas e baseadas em dados com texto, imagens e dados em tempo real do Elasticsearch."
                }
            ]
        },
        {
            "name": "Beats",
            "explanation": "Beats são coletores de dados leves e de código aberto que enviam dados de milhares de máquinas e sistemas para o Logstash ou Elasticsearch. Existem diferentes tipos de Beats para coletar diferentes tipos de dados (logs, métricas, etc.).",
            "children": [
                {
                    "name": "Filebeat",
                    "explanation": "Filebeat é um Beat leve para encaminhamento e centralização de logs. Ele monitora os diretórios de log especificados, coleta eventos de log e os envia para o Elasticsearch ou Logstash."
                },
                {
                    "name": "Metricbeat",
                    "explanation": "Metricbeat é um Beat que coleta métricas de sistemas e serviços, como CPU, memória, disco e rede, e os envia para o Elastic Stack para monitoramento e análise."
                },
                {
                    "name": "Packetbeat",
                    "explanation": "Packetbeat é um Beat que captura dados de rede e os envia para o Elastic Stack. Ele pode analisar protocolos de aplicação para fornecer insights sobre o tráfego da rede."
                },
                {
                    "name": "Heartbeat",
                    "explanation": "Heartbeat é um Beat para monitoramento de disponibilidade e tempo de atividade. Ele verifica se os serviços estão online periodicamente e relata seu status ao Elastic Stack."
                }
            ]
        },
        {
            "name": "X-Pack Security",
            "explanation": "O X-Pack Security fornece recursos de segurança para o Elastic Stack, incluindo autenticação, autorização baseada em função, criptografia de comunicação e auditoria.",
            "children": [
                {
                    "name": "Autenticação",
                    "explanation": "O recurso de autenticação do X-Pack Security permite configurar diferentes realms para autenticar usuários, como nativo, LDAP, Active Directory, ou SAML."
                },
                {
                    "name": "Autorização",
                    "explanation": "A autorização no X-Pack Security permite definir permissões de acesso baseadas em funções para controlar quais usuários podem acessar quais índices, campos e operações."
                },
                {
                    "name": "Auditoria",
                    "explanation": "A auditoria do X-Pack Security registra eventos de segurança no cluster, como tentativas de login, acessos negados e modificações de privilégios, para fins de conformidade e investigação."
                }
            ]
        },
        {
            "name": "Machine Learning",
            "explanation": "Os recursos de Machine Learning do Elastic Stack permitem a detecção automática de anomalias em dados de séries temporais, como tendências incomuns, picos ou quedas, e a realização de previsões.",
            "children": [
                {
                    "name": "Detecção de Anomalias",
                    "explanation": "A detecção de anomalias com Machine Learning no Elastic Stack identifica padrões incomuns em seus dados, alertando sobre possíveis problemas ou comportamentos inesperados."
                },
                {
                    "name": "Previsões",
                    "explanation": "Os recursos de previsão do Machine Learning permitem projetar tendências futuras com base em dados históricos, ajudando na capacidade de planejamento e na identificação proativa de problemas."
                }
            ]
        },
        {
            "name": "APM",
            "explanation": "O APM (Application Performance Monitoring) no Elastic Stack é uma solução que permite monitorar o desempenho de aplicações, coletando métricas de serviço e rastreamento distribuído para identificar gargalos e erros.",
            "children": [
                {
                    "name": "Monitoramento de Serviço",
                    "explanation": "O monitoramento de serviço com APM coleta dados de desempenho de suas aplicações, como tempo de resposta, taxa de erros e throughput, para visibilidade completa."
                },
                {
                    "name": "Rastreamento Distribuído",
                    "explanation": "O rastreamento distribuído no APM permite visualizar o fluxo de requisições através de múltiplos serviços em uma arquitetura distribuída, facilitando a depuração e otimização."
                }
            ]
        }
    ]
};


// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    new MindMapViewer(document.body, mindMapData);
});