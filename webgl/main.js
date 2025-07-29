// main.js
import * as THREE from 'three';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';
import { exportMindMapToPDF } from './pdfExport.js'; // Importa a função de exportação

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('action-menu-container');
    const toggleButton = document.getElementById('menu-toggle-button');

    // Abre/fecha o menu ao clicar no botão de toggle
    toggleButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique feche o menu imediatamente
        menuContainer.classList.toggle('open');
    });

    // Fecha o menu se clicar em qualquer lugar fora dele
    document.addEventListener('click', (event) => {
        if (!menuContainer.contains(event.target)) {
            menuContainer.classList.remove('open');
        }
    });

    // O resto do seu script (main.js) continua aqui
});

// NOVO: Versão do programa atualizada com correções de exportação e novo tema.
const APP_VERSION = 'v2.0.0';

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
        characterWidth: 0.5, // ESTIMATIVA: Largura média de um caractere em relação ao font size (ajuste conforme necessário)
    },
    padding: { x: 30, y: 10 }, // Aumenta ligeiramente o preenchimento interno do nó
    borderRadius: 6, // Cantos mais arredondados para um toque suave
    dragHandleRadius: 6, // Um pouco menor e mais discreto
    zoom: {
        speed: 0.2, // Velocidade de zoom para roda do mouse e pinça (ajustável)
        min: 0.05,  // Permite mais zoom out (mais longe)
        max: 8,     // Permite mais zoom in (mais perto)
    },
    horizontalNodePadding: 0, // Base padding between nodes horizontally
    verticalNodeSpacing: 80, // Vertical spacing between parent and child nodes
    depth1HorizontalOffset: 80, // Offset fixo para nós na profundidade 1
    // NOVAS PROPRIEDADES PARA TAMANHO FIXO DO NÓ
    FIXED_NODE_CHARACTER_LIMIT: 35,
    FIXED_NODE_HEIGHT_MULTIPLIER: 2.5, // Multiplicador para altura com base no font size (ajuste para 1 ou 2 linhas de texto)
};

// Calcule a largura e altura fixas do nó com base nas configurações
CONFIG.FIXED_NODE_WIDTH = (CONFIG.font.size * CONFIG.font.characterWidth * CONFIG.FIXED_NODE_CHARACTER_LIMIT) + (CONFIG.padding.x * 2);
CONFIG.FIXED_NODE_HEIGHT = (CONFIG.font.size * CONFIG.FIXED_NODE_HEIGHT_MULTIPLIER) + (CONFIG.padding.y * 2);


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

        // Adiciona a propriedade para armazenar a instância do nó raiz D3
        this.d3RootNode = null;

        // --- Variáveis de Estado para Controle de Câmera Personalizado ---
        this.isPanning = false;
        this.lastPointerPosition = new THREE.Vector2();

        // Variáveis para controle de toque (pinch-to-zoom)
        this._isPinching = false;
        this.initialPinchDistance = 0;
        this.initialPinchZoom = 1;
        this.pinchCenterWorld = new THREE.Vector3();

        // Variáveis para diferenciar toque/clique de arrastar
        this.initialPointerCoords = new THREE.Vector2(); // Unificado para mouse e toque
        this.isConsideredClick = true;
        this.tapThreshold = 5; // Limiar de movimento para cancelar um "clique"

        // Elementos da sidebar
        this.sidebar = document.getElementById('sidebar');
        this.sidebarTitle = document.getElementById('sidebar-title');
        this.sidebarContent = document.getElementById('sidebar-content');
        this.sidebarCloseButton = document.getElementById('sidebar-close');
        this.isSidebarOpen = false;

        this._initScene();
        this._initEventListeners();
        this._createVersionInfo();

        // O drawMindMap agora popula this.d3RootNode
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

        if (this.sidebarCloseButton) {
            this.sidebarCloseButton.addEventListener('click', this.closeSidebar.bind(this));
        }

        const exportPdfButton = document.getElementById('export-pdf-button');
        if (exportPdfButton) {
            // Chama a função exportMindMapToPDF do módulo separado
            exportPdfButton.addEventListener('click', () => {
                exportMindMapToPDF(this.nodeMap, this.linkObjects, CONFIG, this.mainGroup.position);
            });
        }

        // Event listener para o botão de exportar JSON
        const exportJsonButton = document.getElementById('export-json-button');
        if (exportJsonButton) {
            exportJsonButton.addEventListener('click', () => {
                this.exportMindMapToJson();
            });
        }

        // NOVO: Event listener para o input de upload de JSON
        const jsonUploadInput = document.getElementById('jsonUpload');
        if (jsonUploadInput) {
            jsonUploadInput.addEventListener('change', (event) => {
                this.handleJsonUpload(event);
            });
        }

        // NOVO: Event listener para o botão "Criar Markdown"
        const createMarkdownButton = document.getElementById('create-markdown-button');
        if (createMarkdownButton) {
            createMarkdownButton.addEventListener('click', () => {
                this.exportJsonToMarkdownPage();
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

            // NOVO: Define a cor do nó e do texto com base se é o nó raiz
            const isRootNode = d3Node.depth === 0;
            const rootNodeColor = 0x3498db; // Cor do botão Exportar PDF
            const rootTextColor = 0xFFFFFF; // Branco para o texto do nó raiz

            const nodeColor = isRootNode ? rootNodeColor : CONFIG.nodeColors.length > 0 ? CONFIG.nodeColors.length > d3Node.depth ? CONFIG.nodeColors.slice().reverse()[d3Node.depth] : CONFIG.nodeColors.slice().reverse()[0] : 0xFFFFFF;
            const textColor = isRootNode ? rootTextColor : CONFIG.textColor;

            const textMesh = new Text();
            textMesh.text = d3Node.data.name;
            textMesh.fontSize = CONFIG.font.size;
            textMesh.color = textColor; // Usa a cor do texto definida acima
            textMesh.position.z = 0.1;
            textMesh.anchorX = 'center'; // MODIFICADO PARA CENTRALIZAR
            textMesh.anchorY = 'middle';
            // Adiciona quebra de linha para o texto se ele for maior que 35 caracteres
            textMesh.maxWidth = CONFIG.FIXED_NODE_WIDTH - (CONFIG.padding.x * 2);


            textMesh.name = 'nodeTextMesh'

            textMesh.sync(() => {
                const rectWidth = CONFIG.FIXED_NODE_WIDTH;
                const rectHeight = CONFIG.FIXED_NODE_HEIGHT;

                const rectGeo = createRoundedRectGeometry(rectWidth, rectHeight, CONFIG.borderRadius);
                const rectMat = new THREE.MeshBasicMaterial({ color: nodeColor }); // Usa a cor do nó definida acima

                const rectMesh = new THREE.Mesh(rectGeo, rectMat);
                rectMesh.name = 'nodeRectMesh';
                nodeGroup.add(rectMesh);

                // NOVO: Adiciona a borda (wireframe) APENAS se NÃO for o nó raiz
                if (!isRootNode) {
                    const edges = new THREE.EdgesGeometry(rectGeo);
                    const lineMat = new THREE.LineBasicMaterial({ color: 0xCCCCCC, linewidth: 2 });
                    const wireframe = new THREE.LineSegments(edges, lineMat);
                    nodeGroup.add(wireframe);
                }

                textMesh.position.x = 0; // Garante que a posição X seja zero após centralizar

                nodeGroup.add(textMesh);
                nodeGroup.userData.nodeWidth = rectWidth;
                nodeGroup.userData.nodeHeight = rectHeight;

                if (direction !== 0) {
                    const handleGeo = new THREE.CircleGeometry(CONFIG.dragHandleRadius, 32);
                    const handleMat = new THREE.MeshBasicMaterial({ color: CONFIG.dragHandleColor, transparent: true, opacity: 0.6 });
                    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
                    handleMesh.position.set((rectWidth / 2) * direction, 0, 0.2);
                    handleMesh.userData = { isDragHandle: true, nodeGroup };
                    this.dragHandles.push(handleMesh);
                    nodeGroup.add(handleMesh);
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
        // Remove todos os objetos existentes do mainGroup
        while (this.mainGroup.children.length > 0) {
            const object = this.mainGroup.children[0];
            // Dispose de geometrias, materiais e texturas para evitar vazamentos de memória
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            // Dispose dos filhos se for um grupo
            if (object.children) {
                // Percorre os filhos para dispor de seus recursos também
                object.children.forEach(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            }
            this.mainGroup.remove(object);
        }
        this.nodeMap.clear();
        this.linkObjects = [];
        this.dragHandles = [];

        // Armazena a instância do nó raiz D3
        this.d3RootNode = hierarchy(this.data);
        const d3Links = this.d3RootNode.links();
        const d3Nodes = this.d3RootNode.descendants();

        const originalChildren = this.d3RootNode.children || [];
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
                    // Garante que o userData é aplicado ao objeto d3Node da lista principal
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
                    // Garante que o userData é aplicado ao objeto d3Node da lista principal
                    const originalNodeInD3Nodes = d3Nodes.find(n => n.data === node.data && n.depth === node.depth);
                    if (originalNodeInD3Nodes) {
                        originalNodeInD3Nodes.userData = originalNodeInD3Nodes.userData || {};
                        Object.assign(originalNodeInD3Nodes.userData, node.userData);
                    }
                });
            }

            this.d3RootNode.children = originalChildren;
        }
        this.d3RootNode.userData = { ...this.d3RootNode.userData, assignedDirection: 0, d3X: 0, d3Y: 0 };


        const nodeCreationPromises = d3Nodes.map(d3Node => {
            const direction = d3Node.userData.assignedDirection;
            return this._createNodeMesh(d3Node, direction);
        });
        await Promise.all(nodeCreationPromises);

        // A lógica de maxNodeWidths não é mais estritamente necessária para o posicionamento,
        // já que a largura é fixa. No entanto, se houver outras partes do código que a utilizem
        // para algo além do posicionamento horizontal, pode ser mantida ou adaptada.
        // Para este problema, podemos simplificar a parte de `maxNodeWidths`
        // e usar diretamente `CONFIG.FIXED_NODE_WIDTH`.

        d3Nodes.forEach(d3Node => {
            const nodeGroup = this.nodeMap.get(d3Node);
            if (!nodeGroup) return;

            const direction = nodeGroup.userData.direction;
            const nodeWidth = CONFIG.FIXED_NODE_WIDTH; // Usar a largura fixa

            let finalNodeX = 0;
            let finalNodeY = 0;

            if (d3Node.depth === 0) {
                finalNodeX = 0;
                finalNodeY = 0;
            } else {
                finalNodeY = d3Node.userData.d3X; // d3.tree uses x for vertical and y for horizontal

                let previousDepthX = 0;
                let previousNodeWidthForSpacing = 0; // Usará a largura fixa para o espaçamento

                if (d3Node.parent) {
                    const parentNodeGroup = this.nodeMap.get(d3Node.parent);
                    if (parentNodeGroup) {
                        previousDepthX = parentNodeGroup.position.x;
                    }
                    // Usar a largura fixa do nó pai para cálculo de espaçamento
                    previousNodeWidthForSpacing = CONFIG.FIXED_NODE_WIDTH;
                }

                // Lógica de cálculo de espaçamento condicional à profundidade
                if (d3Node.depth === 1) {
                    // Para profundidade 1, use um offset fixo em relação à raiz
                    const rootNodeGroup = this.nodeMap.get(this.d3RootNode); // Usa this.d3RootNode
                    const rootWidth = rootNodeGroup ? CONFIG.FIXED_NODE_WIDTH : 0; // Usar largura fixa da raiz

                    // Conecte-se à borda da raiz e adicione um offset fixo e metade da largura do nó atual.
                    finalNodeX = (rootWidth / 2) * direction + CONFIG.depth1HorizontalOffset * direction + (nodeWidth / 2) * direction;

                } else if (d3Node.depth >= 2) {
                    // Para profundidade 2 ou mais, use a lógica de espaçamento dinâmico
                    if (d3Node.parent) {
                        const parentNode = d3Node.parent;
                        const parentGroup = this.nodeMap.get(parentNode);
                        if (parentGroup) {
                            const parentWidth = CONFIG.FIXED_NODE_WIDTH; // Usar largura fixa do pai
                            const parentDir = parentGroup.userData.direction;

                            let connectionPointX = parentGroup.position.x;
                            if (parentDir !== 0) {
                                connectionPointX += (parentWidth / 2) * parentDir;
                            } else {
                                connectionPointX += (parentWidth / 2) * direction;
                            }

                            let spacingNeeded = (nodeWidth / 2) + (previousNodeWidthForSpacing / 2) + CONFIG.horizontalNodePadding; // Adicionado padding horizontal
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

        // Chame a função para focar a câmera no nó principal após o mapa ser desenhado
        this._focusCameraOnNode(this.nodeMap.get(this.d3RootNode));

        this.camera.updateProjectionMatrix();
    }

    /**
     * Foca a câmera em um nó específico.
     * @param {THREE.Group} nodeGroup O grupo THREE.js que representa o nó.
     */
    _focusCameraOnNode(nodeGroup) {
        if (!nodeGroup) {
            console.warn("Nó para focar a câmera não encontrado. Verifique se o nó principal foi mapeado corretamente.");
            return;
        }

        // Obtém a posição do nó no sistema de coordenadas globais do Three.js.
        // Como o mainGroup já foi centralizado, esta posição já representa o centro global do nó.
        const targetPosition = new THREE.Vector3();
        nodeGroup.getWorldPosition(targetPosition);

        // Define a posição da câmera diretamente para a posição global (x e y) do nó.
        // Isso fará com que o centro do viewport da câmera (o centro da tela)
        // se alinhe com o centro do nó.
        this.camera.position.x = targetPosition.x;
        this.camera.position.y = targetPosition.y;
        this.camera.position.z = 150; // Mantém a distância original da câmera

        // Você também pode ajustar o zoom para que o nó principal fique bem visível
        // Um valor de zoom de 1.0 geralmente é um bom ponto de partida para o nó principal
        this.camera.zoom = 1.0;
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

        this.isConsideredClick = true; // Assume que é um clique no início
        this.initialPointerCoords.set(event.clientX, event.clientY);

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

        // Se estivermos arrastando com o mouse ou pan, verificamos se o movimento excede o limite de clique
        if (this.isConsideredClick && (this.isDraggingNode || this.isPanning)) {
            const moveDistance = Math.hypot(
                event.clientX - this.initialPointerCoords.x,
                event.clientY - this.initialPointerCoords.y
            );
            if (moveDistance > this.tapThreshold) {
                this.isConsideredClick = false; // Cancela o "clique" se houver arrasto
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
        } else if (this.isPanning) {
            const deltaX = event.clientX - this.lastPointerPosition.x;
            const deltaY = event.clientY - this.lastPointerPosition.y;
            const panSpeed = 1 / this.camera.zoom;
            this.camera.position.x -= deltaX * panSpeed;
            this.camera.position.y += deltaY * panSpeed;
            this.lastPointerPosition.set(event.clientX, event.clientY);
        }
    }

    _onMouseUp(event) {
        if (this.isConsideredClick) { // Só dispara o clique se não houve arrasto
            // Reutiliza a lógica de detecção de nó clicado do _onNodeClick original
            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.mainGroup.children, true);
            let clickedNode = null;
            for (const intersect of intersects) {
                let currentObject = intersect.object;
                while (currentObject) {
                    if (currentObject.userData.isDragHandle) {
                        clickedNode = null; // Não é um clique de nó se for no handle
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
        this.selectedNode = null;
        this.isDraggingNode = false;
        this.isPanning = false;
        this.isConsideredClick = true; // Reseta para o próximo evento
    }

    _onTouchStart(event) {
        if (this.isSidebarOpen) return;
        event.preventDefault();
        this.isConsideredClick = true;
        this.initialPointerCoords.set(event.touches[0].clientX, event.touches[0].clientY);

        if (event.touches.length === 1) {
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
        } /** If there are two touches, handle pinch-to-zoom */ else if (event.touches.length === 2) {
            this.isDraggingNode = false;
            this.isPanning = false;
            this._isPinching = true;
            this.isConsideredClick = false; // Múltiplos toques não são cliques simples
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

        // Se estivermos arrastando com um único toque, verificamos se o movimento excede o limite de clique
        if (this.isConsideredClick && event.touches.length === 1) {
            const moveDistance = Math.hypot(
                event.touches[0].clientX - this.initialPointerCoords.x,
                event.touches[0].clientY - this.initialPointerCoords.y
            );
            if (moveDistance > this.tapThreshold) {
                this.isConsideredClick = false; // Cancela o "clique" se houver arrasto
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
        if (this.isConsideredClick) { // Só considera como clique se não houve arrasto/pinch
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
        this.isConsideredClick = true; // Reseta para o próximo evento
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

    // Função para exportar os dados do mapa mental para JSON
    exportMindMapToJson() {
        // Tenta obter os dados do localStorage
        const storedData = localStorage.getItem('mindMapData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const jsonString = JSON.stringify(parsedData, null, 2); // Formata com 2 espaços de indentação

                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'mindmap_data.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url); // Limpa o URL do objeto
            } catch (error) {
                console.error('Erro ao parsear ou exportar JSON:', error);
                alert('Ocorreu um erro ao exportar o JSON. Verifique o console para mais detalhes.');
            }
        } else {
            alert('Nenhum dado do mapa mental encontrado para exportar.');
        }
    }

    // NOVO: Função para lidar com o upload de arquivo JSON
    handleJsonUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonContent = JSON.parse(e.target.result);

                // --- NOVO: Mostra o JSON importado no console para depuração ---
                console.log("JSON importado:", jsonContent);

                // Validar a estrutura do JSON se necessário (ex: verificar se tem 'name' e 'children')
                if (!jsonContent || typeof jsonContent.name !== 'string') {
                    alert("O arquivo JSON não parece ser um mapa mental válido. Ele deve ter uma propriedade 'name' no nível raiz.");
                    return;
                }

                // Atualizar os dados do mapa mental e redesenhar
                this.data = jsonContent;
                localStorage.setItem('mindMapData', JSON.stringify(jsonContent)); // Salva no localStorage para consistência
                this.drawMindMap(); // Redesenha o mapa com os novos dados
                alert("Mapa mental carregado com sucesso a partir do arquivo JSON!");
            } catch (error) {
                console.error('Erro ao ler ou parsear o arquivo JSON:', error);
                alert('Erro ao carregar o arquivo JSON. Certifique-se de que é um JSON válido.');
            }
            // Limpa o valor do input file para permitir o upload do mesmo arquivo novamente
            event.target.value = '';
        };
        reader.onerror = (e) => {
            console.error("Erro ao ler o arquivo:", e);
            alert("Erro ao ler o arquivo. Por favor, tente novamente.");
        };
        reader.readAsText(file);
    }

    // NOVO: Função para exportar JSON para a página de Markdown
    exportJsonToMarkdownPage() {
        const storedData = localStorage.getItem('mindMapData');
        if (storedData) {
            try {
                // Armazena os dados no sessionStorage para serem acessíveis pela json2md.html
                sessionStorage.setItem('markdownData', storedData);
                window.location.href = 'json2md.html'; // Redireciona para a página de Markdown
            } catch (error) {
                console.error('Erro ao preparar dados para Markdown:', error);
                alert('Ocorreu um erro ao preparar os dados para exportação Markdown.');
            }
        } else {
            alert('Nenhum dado do mapa mental encontrado para criar Markdown.');
        }
    }


    // --- LOOP DE ANIMAÇÃO ---
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}


// --- INICIALIZAÇÃO (MODIFICADA) ---
document.addEventListener('DOMContentLoaded', () => {
    const mindmapContainer = document.getElementById('mindmap-container');
    if (!mindmapContainer) {
        console.error("Container do mapa mental não encontrado. Por favor, garanta que um elemento com id 'mindmap-container' exista no seu HTML.");
        return;
    }

    // Tenta carregar os dados do localStorage primeiro
    const storedData = localStorage.getItem('mindMapData');

    if (storedData) {
        // Se encontrou dados, usa-os
        console.log("Dados do mapa mental encontrados no localStorage. Carregando...");
        try {
            const data = JSON.parse(storedData);
            // Salva os dados no localStorage novamente se eles vieram de lá
            // para manter a consistência para futuras exportações ou recarregamentos.
            // Isso evita que, se o usuário fechar e reabrir, ele perca os dados.
            localStorage.setItem('mindMapData', JSON.stringify(data));
            new MindMapViewer(mindmapContainer, data);
        } catch (error) {
            console.error('Falha ao parsear os dados do mapa mental do localStorage:', error);
            mindmapContainer.innerHTML = '<p style="color: red;">Erro ao carregar dados da página anterior. Carregando mapa padrão.</p>';
            loadDefaultMindMap(); // Carrega o mapa padrão como fallback
        }
    } else {
        // Se não encontrou dados, carrega o arquivo padrão
        console.log("Nenhum dado no localStorage. Carregando mapa mental padrão de 'mindmap.json'.");
        loadDefaultMindMap();
    }

    // Função para carregar o mapa mental padrão
    function loadDefaultMindMap() {
        fetch('mindmap.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Ao carregar o mapa padrão, também o salva no localStorage para futuras exportações
                localStorage.setItem('mindMapData', JSON.stringify(data));
                new MindMapViewer(mindmapContainer, data);
            })
            .catch(error => {
                console.error('Erro ao carregar os dados do mapa mental padrão:', error);
                mindmapContainer.innerHTML = '<p style="color: red;">Erro ao carregar o mapa mental. Por favor, tente novamente mais tarde.</p>';
            });
    }
});