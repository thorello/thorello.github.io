import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';

// NOVO: Defina a versão do programa aqui. Mude este valor a cada atualização.
const APP_VERSION = 'v1.0.2 - mobile pinch zoom fix';

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
        this.lastPinchCenterScreen = new THREE.Vector2(); // Posição do centro do pinch na tela (NDC)
        this._pointerWorldBeforeZoom = new THREE.Vector3(); // Posição do centro do pinch no mundo ANTES do zoom
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
        this._createVersionInfo(); // NOVO: Chama a função para criar o texto da versão.

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

        // --- MUDANÇA: Desabilitamos o zoom padrão ---
        // Isso nos permite implementar nosso próprio comportamento de "zoom no ponteiro".
        this.controls.enableZoom = false; // Desabilita o zoom da roda do mouse do OrbitControls

        this.controls.enablePan = true;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.PAN, // Botão do meio agora faz PAN também
            RIGHT: THREE.MOUSE.PAN
        };
        this.controls.touches = {
            ONE: THREE.TOUCH.PAN,
            // Mantemos TWO: THREE.TOUCH.DOLLY_PAN para que OrbitControls lide com o pinch-to-zoom
            TWO: THREE.TOUCH.DOLLY_PAN
        };
        // Os limites de zoom (min/max) serão aplicados no nosso listener personalizado.
    }

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
        if (this.sidebarCloseButton) { // Adicionado verificação para segurança
            this.sidebarCloseButton.addEventListener('click', this.closeSidebar.bind(this));
        }

        // O listener 'change' continua, mas agora é usado APENAS para corrigir o zoom de pinça (mobile).
        this.controls.addEventListener('change', this._onControlsChange.bind(this));
    }

    // NOVO: Método para criar e exibir o texto da versão.
    _createVersionInfo() {
        const versionElement = document.createElement('div');
        versionElement.textContent = `Mind Map ${APP_VERSION}`;

        // Aplica estilos diretamente via JavaScript
        Object.assign(versionElement.style, {
            position: 'absolute',
            bottom: '10px', // MUDANÇA: Altera 'top' para 'bottom'
            left: '10px',
            color: 'rgba(238, 238, 238, 0.5)', // Usa a cor do texto com opacidade
            backgroundColor: 'rgba(31, 40, 51, 0.5)', // Usa a cor de um nó com opacidade
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: '1000', // Garante que fique acima do canvas
            pointerEvents: 'none' // Impede que o elemento intercepte cliques do mouse
        });

        this.container.appendChild(versionElement);
    }

    // --- LÓGICA DE CRIAÇÃO E ATUALIZAÇÃO ---
    // (O restante do seu código permanece o mesmo)

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

    // --- Função para corrigir a posição da câmera após o zoom DE PINÇA (mobile) ---
    _onControlsChange() {
        // Aplica os limites de zoom também quando o OrbitControls altera a câmera (para pinch)
        this.camera.zoom = Math.max(CONFIG.zoom.min, Math.min(CONFIG.zoom.max, this.camera.zoom));
        this.camera.updateProjectionMatrix();

        if (this._isPinching) {
            // Posição do centro do pinch no mundo com a câmera ATUALIZADA pelo OrbitControls
            const pointerWorldAfterZoom = new THREE.Vector3(
                this.lastPinchCenterScreen.x,
                this.lastPinchCenterScreen.y,
                0
            ).unproject(this.camera);

            // Calcula o delta para pan, comparando o ponto inicial no mundo com sua nova posição
            const panDelta = new THREE.Vector3().subVectors(this._pointerWorldBeforeZoom, pointerWorldAfterZoom);

            // Aplica a correção de pan à câmera e ao target dos controles
            this.camera.position.add(panDelta);
            this.controls.target.add(panDelta);
        }
    }


    // ✅ MÉTODO CORRIGIDO PARA O TOUCH START
    _onTouchStart(event) {
        // Se um dedo: tenta arrastar nó ou iniciar o pan padrão do OrbitControls
        if (event.touches.length === 1) {
            // Simula um mouse down para detecção de manipulador de arrasto
            this._onMouseDown({
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY,
                button: 0 // Simula clique esquerdo
            });

            // Se um nó foi selecionado para arrasto, previne o padrão para que o OrbitControls não interfira.
            // CASO CONTRÁRIO, DEIXE O ORBITCONTROLS LIDAR COM O PAN DE UM DEDO.
            if (this.selectedNode) {
                event.preventDefault();
            }
            this._isPinching = false; // Garante que não estamos em modo pinch
        }
        // Se dois dedos: prepara para zoom e pan (gerenciado pelo OrbitControls)
        else if (event.touches.length === 2) {
            // Desativa o arrasto de nó personalizado se um gesto multi-toque for detectado
            this.selectedNode = null;
            this.isDraggingNode = false;

            this.controls.enabled = true; // Garante que OrbitControls esteja habilitado para lidar com o pinch

            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            // Calcula a distância inicial entre os dedos (útil para lógica, mas OrbitControls faz o zoom)
            this.initialPinchDistance = Math.sqrt(
                (touch1.clientX - touch2.clientX) ** 2 +
                (touch1.clientY - touch2.clientY) ** 2
            );

            // Calcula o centro do pinch na tela (NDC)
            this.lastPinchCenterScreen.set(
                ((touch1.clientX + touch2.clientX) / 2 / this.renderer.domElement.clientWidth) * 2 - 1,
                -((touch1.clientY + touch2.clientY) / 2 / this.renderer.domElement.clientHeight) * 2 + 1
            );

            // Armazena a posição do centro do pinch no mundo ANTES do zoom começar pelo OrbitControls
            // Crie uma cópia da câmera para 'unproject' para que não seja afetado pelas mudanças do OrbitControls ainda.
            const tempCamera = this.camera.clone();
            tempCamera.zoom = this.camera.zoom; // Garante que o clone tem o zoom atual
            tempCamera.position.copy(this.camera.position); // Garante que o clone tem a posição atual
            tempCamera.updateProjectionMatrix(); // Atualiza a matriz de projeção do clone

            this._pointerWorldBeforeZoom = new THREE.Vector3(this.lastPinchCenterScreen.x, this.lastPinchCenterScreen.y, 0).unproject(tempCamera);

            this._isPinching = true; // Sinaliza que o pinch está ativo

            event.preventDefault(); // Evita ações de toque padrão do navegador (ex: rolagem da página)
        }
    }


    _onTouchMove(event) {
        if (event.touches.length === 1 && this.isDraggingNode) {
            this._onMouseMove({
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY
            });
            event.preventDefault();
        } else if (event.touches.length === 2 && this._isPinching) {
            event.preventDefault();

            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            // Atualiza a posição do centro do pinch na tela durante o movimento
            this.lastPinchCenterScreen.set(
                ((touch1.clientX + touch2.clientX) / 2 / this.renderer.domElement.clientWidth) * 2 - 1,
                -((touch1.clientY + touch2.clientY) / 2 / this.renderer.domElement.clientHeight) * 2 + 1
            );
            // O OrbitControls se encarregará de atualizar a câmera e o target, e nossa correção
            // em _onControlsChange ajustará o pan.
        }
    }

    _onTouchEnd(event) {
        if (this.isDraggingNode) {
            this._onMouseUp();
            event.preventDefault();
        }
        this.controls.enabled = true; // Garante que OrbitControls está habilitado novamente para outros gestos
        this.initialPinchDistance = 0;
        this.lastPinchCenterScreen.set(0, 0);
        this._isPinching = false;
    }

    _onNodeClick(event) {
        // Se um nó está sendo arrastado ou o clique não é o botão principal (esquerdo)
        if (this.isDraggingNode || event.button !== 0) {
            return;
        }

        // Se houver múltiplos toques (indicando um gesto de zoom/pan do OrbitControls),
        // não registre como clique de nó.
        // Isso evita que um clique acidental ocorra após um gesto de zoom.
        if (event.touches && event.touches.length > 1) {
            return;
        }

        this.mouse.copy(this._getPointerCoordinates(event));
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.mainGroup.children, true);

        let clickedNode = null;
        for (const intersect of intersects) {
            // Verifica se o objeto intersectado é um nó (ou parte de um nó) e não o handle de arrasto
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
        if (this.sidebar) { // Adicionado verificação para segurança
            this.sidebarTitle.textContent = title;
            this.sidebarContent.textContent = content;
            this.sidebar.classList.add('open');
            this.isSidebarOpen = true;
        }
    }

    closeSidebar() {
        if (this.sidebar) { // Adicionado verificação para segurança
            this.sidebar.classList.remove('open');
            this.isSidebarOpen = false;
        }
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
            "name": "Kibana",
            "explanation": "Kibana é a plataforma de visualização e interface do usuário para o Elastic Stack. Ele permite explorar, visualizar e gerenciar dados armazenados no Elasticsearch.",
            "children": [
                {
                    "name": "Dashboards",
                    "explanation": "Dashboards no Kibana são coleções de visualizações que fornecem uma visão consolidada de seus dados, permitindo monitoramento e análise em tempo real."
                },
                {
                    "name": "Visualizações",
                    "explanation": "O Kibana oferece uma variedade de visualizações, como gráficos de barras, gráficos de linhas, mapas, tabelas e nuvens de tags, para representar seus dados."
                }
            ]
        },
        {
            "name": "Logstash",
            "explanation": "Logstash é uma ferramenta de pipeline de dados de código aberto que coleta dados de várias fontes, transforma-os e os envia para o Elasticsearch ou outras saídas.",
            "children": [
                {
                    "name": "Plugins de Entrada",
                    "explanation": "Logstash suporta vários plugins de entrada, como arquivos, syslog, beats, Kafka, e S3, para coletar dados de diversas fontes."
                },
                {
                    "name": "Plugins de Filtro",
                    "explanation": "Os plugins de filtro do Logstash, como Grok, Mutate, Date, e GeoIP, permitem parsear e transformar dados antes de serem indexados."
                }
            ]
        },
        {
            "name": "Beats",
            "explanation": "Beats são 'shippers' de dados leves e de código aberto que enviam dados de servidores e sistemas para o Logstash ou Elasticsearch.",
            "children": [
                {
                    "name": "Filebeat",
                    "explanation": "Filebeat é um Beat para encaminhamento de logs, que monitora arquivos de log em diretórios específicos e os envia de forma eficiente."
                },
                {
                    "name": "Metricbeat",
                    "explanation": "Metricbeat é um Beat para coleta de métricas, que coleta métricas de sistemas e serviços (CPU, memória, rede, Docker, etc.)."
                },
                {
                    "name": "Packetbeat",
                    "explanation": "Packetbeat é um Beat para análise de rede, que captura dados de pacotes de rede e os decodifica para insights sobre o tráfego da aplicação."
                }
            ]
        },
        {
            "name": "Recursos Adicionais (X-Pack)",
            "explanation": "X-Pack é um conjunto de recursos que estende as capacidades do Elastic Stack, oferecendo funcionalidades de segurança, monitoramento, alertas, relatórios e machine learning.",
            "children": [
                {
                    "name": "Segurança",
                    "explanation": "Recursos de segurança do X-Pack incluem autenticação, autorização baseada em funções, criptografia de comunicação e auditoria."
                },
                {
                    "name": "Machine Learning",
                    "explanation": "Funcionalidades de Machine Learning do X-Pack permitem detectar anomalias em seus dados automaticamente."
                },
                {
                    "name": "Alertas e Monitoramento",
                    "explanation": "O X-Pack oferece ferramentas para monitorar o Elastic Stack e criar alertas baseados em condições nos seus dados."
                }
            ]
        }
    ]
};


// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Por padrão, o container é o body. Se você tiver um container específico, mude aqui.
    new MindMapViewer(document.body, mindMapData);
});