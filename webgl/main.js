import * as THREE from 'three';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';
import { exportMindMapToPDF } from './pdfExport.js'; // Already imported
import { exportMindMapToJson } from './jsonExport.js'; // NEW: Import export function
import { importMindMapFromJson } from './jsonImport.js'; // NEW: Import import function
import './menuHandler.js';

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
        0xFFFFFF  // Branco
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
        min: 0.05,  // Permite mais zoom out (mais longe)
        max: 8,     // Permite mais zoom in (mais perto)
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
        this.addNodeButton = document.getElementById('add-node-button');
        this.aiNewMapButtonContainer = document.getElementById('ai-new-map-button-container');

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
        // NOVO: Armazena o nó D3 que está atualmente selecionado (para a popUp)
        this.currentSelectedD3Node = null;

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

        // --- Elementos da popUp ---
        this.popUp = document.getElementById('popUp');
        this.popUpCloseButton = document.getElementById('popUp-close');
        this.isPopUpOpen = false;

        // --- NOVOS ELEMENTOS DA SIDEBAR PARA EDIÇÃO ---
        this.titleSection = document.getElementById('title-section');
        this.popUpTitle = document.getElementById('popUp-title');
        this.popUpTitleInput = document.getElementById('popUp-title-input');
        this.editTitleBtn = document.getElementById('edit-title-btn');
        this.saveTitleBtn = document.getElementById('save-title-btn');
        this.cancelTitleBtn = document.getElementById('cancel-title-btn');

        this.contentSection = document.getElementById('content-section');
        this.popUpContent = document.getElementById('popUp-content');
        this.popUpContentInput = document.getElementById('popUp-content-input');
        this.editContentBtn = document.getElementById('edit-content-btn');
        this.saveContentBtn = document.getElementById('save-content-btn');
        this.cancelContentBtn = document.getElementById('cancel-content-btn');

        this.addNodeButton = document.getElementById('add-node-button');


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

        if (this.popUpCloseButton) {
            this.popUpCloseButton.addEventListener('click', this.closePopUp.bind(this));
        }

        if (this.addNodeButton) {
            this.addNodeButton.addEventListener('click', this.addChildNode.bind(this));
        }

        // --- NOVOS EVENT LISTENERS PARA EDIÇÃO ---
        this.editTitleBtn.addEventListener('click', () => this.toggleEditMode('title', true));
        this.saveTitleBtn.addEventListener('click', () => this.saveNodeChanges('title'));
        this.cancelTitleBtn.addEventListener('click', () => this.toggleEditMode('title', false));

        this.editContentBtn.addEventListener('click', () => this.toggleEditMode('content', true));
        this.saveContentBtn.addEventListener('click', () => this.saveNodeChanges('content'));
        this.cancelContentBtn.addEventListener('click', () => this.toggleEditMode('content', false));


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
                // Chama a função de exportação do novo módulo
                exportMindMapToJson();
            });
        }

        // NOVO: Event listener para o input de upload de JSON
        const jsonUploadInput = document.getElementById('jsonUpload');
        if (jsonUploadInput) {
            jsonUploadInput.addEventListener('change', (event) => {
                // Chama a função de importação do novo módulo, passando o contexto 'this' e o evento
                importMindMapFromJson(event, (importedData) => {
                    this.data = importedData;
                    this.drawMindMap();
                });
            });
        }

        // NOVO: Event listener para o botão "Criar Markdown"
        const createMarkdownButton = document.getElementById('create-markdown-button');
        if (createMarkdownButton) {
            createMarkdownButton.addEventListener('click', () => {
                this.exportJsonToMarkdownPage();
            });
        }

        // NEW: Event listener for the "Recalculate Map" button
        const recalculateMapButton = document.getElementById('recalculate-map-button');
        if (recalculateMapButton) {
            recalculateMapButton.addEventListener('click', () => {
                this.recalculateMap();
            });
        }

        // NEW: Event listener for the "New Map" button
        const newMapButton = document.getElementById('new-map-button');
        if (newMapButton) {
            newMapButton.addEventListener('click', () => {
                // Clear the current mind map data from localStorage
                localStorage.removeItem('mindMapData');
                // Reload the default mind map
                this._loadDefaultMindMapData();
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

    // NOVO: Método auxiliar para encontrar um d3Node correspondente aos dados de um nó
    _findD3NodeByData(targetData) {
        let foundNode = null;
        this.d3RootNode.each(d3Node => {
            if (d3Node.data === targetData) {
                foundNode = d3Node;
                return false; // Para a iteração
            }
        });
        return foundNode;
    }

    // --- LÓGICA PRINCIPAL ---

    // Inside your MindMapViewer class

    async drawMindMap() {
        // ... (existing code to clear and set up nodes and links) ...

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

        // Aplicar o layout D3 para nós sem posições persistidas ou como fallback
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

        d3Nodes.forEach(d3Node => {
            const nodeGroup = this.nodeMap.get(d3Node);
            if (!nodeGroup) return;

            // NOVO: Usar posições persistidas se existirem
            if (d3Node.data.persistedX !== undefined && d3Node.data.persistedY !== undefined) {
                nodeGroup.position.set(d3Node.data.persistedX, d3Node.data.persistedY, 0);
            } else {
                // Lógica de posicionamento existente do D3
                const direction = nodeGroup.userData.direction;
                const nodeWidth = CONFIG.FIXED_NODE_WIDTH;

                let finalNodeX = 0;
                let finalNodeY = 0;

                if (d3Node.depth === 0) {
                    finalNodeX = 0;
                    finalNodeY = 0;
                } else {
                    finalNodeY = d3Node.userData.d3X; // O D3 X é o Y no seu sistema Three.js

                    let previousNodeWidthForSpacing = CONFIG.FIXED_NODE_WIDTH;

                    if (d3Node.depth === 1) {
                        const rootNodeGroup = this.nodeMap.get(this.d3RootNode);
                        const rootWidth = rootNodeGroup ? CONFIG.FIXED_NODE_WIDTH : 0;
                        finalNodeX = (rootWidth / 2) * direction + CONFIG.depth1HorizontalOffset * direction + (nodeWidth / 2) * direction;
                    } else if (d3Node.depth >= 2 && d3Node.parent) {
                        const parentGroup = this.nodeMap.get(d3Node.parent);
                        if (parentGroup) {
                            const parentWidth = CONFIG.FIXED_NODE_WIDTH;
                            const parentDir = parentGroup.userData.direction;
                            let connectionPointX = parentGroup.position.x;
                            if (parentDir !== 0) {
                                connectionPointX += (parentWidth / 2) * parentDir;
                            } else {
                                connectionPointX += (parentWidth / 2) * direction;
                            }
                            let spacingNeeded = (nodeWidth / 2) + (previousNodeWidthForSpacing / 2) + CONFIG.horizontalNodePadding;
                            finalNodeX = connectionPointX + (spacingNeeded * direction);
                        }
                    }
                    // Salvar a posição inicial calculada pelo D3 se ainda não houver uma persistida
                    d3Node.data.persistedX = finalNodeX;
                    d3Node.data.persistedY = finalNodeY;
                }
                nodeGroup.position.set(finalNodeX, finalNodeY, 0);
            }
            this.mainGroup.add(nodeGroup);
        });

        d3Links.forEach(link => this._createLinkMesh(link));

        // Calculate the bounding box and center the group.
        const box = new THREE.Box3().setFromObject(this.mainGroup);
        const center = box.getCenter(new THREE.Vector3());
        this.mainGroup.position.sub(center);

        this.camera.updateProjectionMatrix();

        // Salvar os dados após o draw, garantindo que as posições calculadas
        // (ou as persistidas) estejam no localStorage.
        localStorage.setItem('mindMapData', JSON.stringify(this.data));

        // NEW: Focus on the root node after everything is drawn and centered
        const rootNodeGroup = this.nodeMap.get(this.d3RootNode);
        if (rootNodeGroup) {
            this._focusCameraOnNode(rootNodeGroup);
        }
    }

    /**
     * Foca a câmera em um nó específico.
     * @param {THREE.Group} nodeGroup O grupo THREE.js que representa o nó.
     */
    _focusCameraOnNode(nodeGroup) {
        if (!nodeGroup) {
            console.warn("Nó para focar a câmera não encontrado.");
            return;
        }

        const targetPosition = new THREE.Vector3();
        nodeGroup.getWorldPosition(targetPosition);

        this.camera.position.x = targetPosition.x;
        this.camera.position.y = targetPosition.y;
        this.camera.position.z = 250; // Mantenha a câmera a uma distância padrão do plano XY

        // Ajusta o zoom para focar no nó, com um valor que o deixe bem visível.
        // Um zoom de 1.5 a 2.0 geralmente é bom para focar em um nó.
        this.camera.zoom = 1; // Ajuste conforme a preferência
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
        if (this.isPopUpOpen) return;

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
        if (this.isPopUpOpen || event.button !== 0) return;

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
        if (this.isPopUpOpen) return;

        if (this.isConsideredClick && (this.isDraggingNode || this.isPanning)) {
            const moveDistance = Math.hypot(
                event.clientX - this.initialPointerCoords.x,
                event.clientY - this.initialPointerCoords.y
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
        if (this.isConsideredClick) {
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
                const d3Node = clickedNode.userData.d3Node;
                this.currentSelectedD3Node = d3Node;
                this.openPopUp(d3Node.data.name, d3Node.data.definition || 'Nenhuma explicação disponível.');
            } else if (this.isPopUpOpen) {
                if (!this.popUp.contains(event.target)) {
                    this.closePopUp();
                }
            }
        }
        if (this.isDraggingNode && this.selectedNode) { // Salvar a posição do nó arrastado
            const d3Node = this.selectedNode.userData.d3Node;
            if (d3Node) {
                d3Node.data.persistedX = this.selectedNode.position.x;
                d3Node.data.persistedY = this.selectedNode.position.y;
                localStorage.setItem('mindMapData', JSON.stringify(this.data)); // Salva os dados atualizados
            }
        }
        this.selectedNode = null;
        this.isDraggingNode = false;
        this.isPanning = false;
        this.isConsideredClick = true;
    }

    _onTouchStart(event) {
        if (this.isPopUpOpen) return;
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
        } else if (event.touches.length === 2) {
            this.isDraggingNode = false;
            this.isPanning = false;
            this._isPinching = true;
            this.isConsideredClick = false; // Prevent click on pinch
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
        if (this.isPopUpOpen) return;
        event.preventDefault();

        if (this.isConsideredClick && event.touches.length === 1) {
            const moveDistance = Math.hypot(
                event.touches[0].clientX - this.initialPointerCoords.x,
                event.touches[0].clientY - this.initialPointerCoords.y
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
        // If it was a pinch gesture, ensure no click event is processed.
        // The `isConsideredClick` flag is set to false during `_onTouchMove` if movement exceeds threshold or if it's a pinch.
        if (this.isConsideredClick && !this._isPinching) { // Only process click if it was considered a click AND not a pinch
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
                const d3Node = clickedNode.userData.d3Node;
                this.currentSelectedD3Node = d3Node;
                this.openPopUp(d3Node.data.name, d3Node.data.definition || 'Nenhuma explicação disponível.');
            } else if (this.isPopUpOpen) {
                this.closePopUp();
            }
        }
        if (this.isDraggingNode && this.selectedNode) { // Salvar a posição do nó arrastado
            const d3Node = this.selectedNode.userData.d3Node;
            if (d3Node) {
                d3Node.data.persistedX = this.selectedNode.position.x;
                d3Node.data.persistedY = this.selectedNode.position.y;
                localStorage.setItem('mindMapData', JSON.stringify(this.data)); // Salva os dados atualizados
            }
        }
        this.isDraggingNode = false;
        this.isPanning = false;
        this._isPinching = false;
        this.isConsideredClick = true; // Reset for the next interaction
    }

    // --- MÉTODOS DA SIDEBAR E EDIÇÃO ---

    openPopUp(title, content) {
        if (!this.popUp) return;

        this.popUpTitle.textContent = title;
        this.popUpContent.textContent = content;

        this.toggleEditMode('title', false);
        this.toggleEditMode('content', false);

        this.popUp.classList.add('open');
        this.isPopUpOpen = true;

        if (this.addNodeButton) {
            this.addNodeButton.style.display = 'block';
        }

        // NEW: Conditionally show/hide 'Novo Mapa Mental com IA' button
        if (this.aiNewMapButtonContainer) {
            if (this.currentSelectedD3Node && this.currentSelectedD3Node.depth === 0) {
                this.aiNewMapButtonContainer.style.display = 'block';
            } else {
                this.aiNewMapButtonContainer.style.display = 'none';
            }
        }
    }

    closePopUp() {
        if (!this.popUp) return;

        this.popUp.classList.remove('open');
        this.isPopUpOpen = false;
        this.currentSelectedD3Node = null;

        if (this.addNodeButton) {
            this.addNodeButton.style.display = 'none';
        }
    }

    toggleEditMode(field, isEditing) {
        const section = field === 'title' ? this.titleSection : this.contentSection;
        const displayView = section.querySelector('.display-view');
        const editView = section.querySelector('.edit-view');

        if (isEditing) {
            const input = editView.querySelector('input, textarea');
            const currentText = (field === 'title' ? this.popUpTitle : this.popUpContent).textContent;

            if (field === 'content' && currentText === 'Nenhuma explicação disponível.') {
                input.value = '';
            } else {
                input.value = currentText;
            }

            displayView.style.display = 'none';
            editView.style.display = 'block';
            input.focus();
        } else {
            displayView.style.display = 'block';
            editView.style.display = 'none';
        }
    }

    async saveNodeChanges(field) {
        if (!this.currentSelectedD3Node) return;

        // Guarda a referência ao objeto de dados do nó antes de qualquer alteração.
        const nodeDataToFocus = this.currentSelectedD3Node.data;

        const input = field === 'title' ? this.popUpTitleInput : this.popUpContentInput;
        const newValue = input.value.trim();

        if (field === 'title') {
            if (newValue === '') {
                alert('O nome do nó não pode ser vazio.');
                return;
            }
            nodeDataToFocus.name = newValue;
            this.popUpTitle.textContent = newValue;
        } else {
            nodeDataToFocus.definition = newValue;
            this.popUpContent.textContent = newValue || 'Nenhuma explicação disponível.';
        }

        // Espera o mapa ser completamente redesenhado
        await this.drawMindMap(); // <<< AQUI O MAPA É REDESENHADO

        // Após redesenhar, encontra o novo grupo de nós correspondente aos dados atualizados
        let nodeGroupToFocus = null;
        for (const [d3Node, nodeGroup] of this.nodeMap.entries()) {
            if (d3Node.data === nodeDataToFocus) {
                nodeGroupToFocus = nodeGroup;
                break;
            }
        }

        // Se encontrou, foca a câmera nele
        if (nodeGroupToFocus) {
            this._focusCameraOnNode(nodeGroupToFocus); // <<< E O FOCO É AJUSTADO
        }

        // Retorna ao modo de visualização
        this.toggleEditMode(field, false);
    }


    async addChildNode() { // Tornar a função assíncrona
        if (!this.currentSelectedD3Node) {
            alert('Por favor, selecione um nó para adicionar um filho.');
            return;
        }

        const newChildName = prompt('Digite o nome do novo nó filho:');
        if (newChildName === null || newChildName.trim() === '') {
            return;
        }

        const newChildData = {
            name: newChildName,
            definition: 'Nova explicação para ' + newChildName,
            children: []
        };

        if (!this.currentSelectedD3Node.data.children) {
            this.currentSelectedD3Node.data.children = [];
        }
        this.currentSelectedD3Node.data.children.push(newChildData);

        // Aguarde o mapa ser redesenhado e as posições recalculadas
        await this.recalculateMap();

        // Encontre o nó D3 correspondente aos dados do novo nó na nova hierarquia
        let newD3ChildNode = null;
        this.d3RootNode.each(d3Node => {
            if (d3Node.data === newChildData) {
                newD3ChildNode = d3Node;
            }
        });

        // Se encontrou o nó D3, encontre o grupo Three.js correspondente e foque
        if (newD3ChildNode) {
            const newNodeGroup = this.nodeMap.get(newD3ChildNode);
            if (newNodeGroup) {
                this._focusCameraOnNode(newNodeGroup);
                // Opcional: Selecionar o novo nó e abrir a popUp para ele
                this.currentSelectedD3Node = newD3ChildNode;
                this.openPopUp(newD3ChildNode.data.name, newD3ChildNode.data.definition || 'Nenhuma explicação disponível.');
            }
        }

        // Add a small delay and then close the popUp.
        // This gives the browser a moment to finish processing the event queue,
        // preventing the _onMouseUp/_onTouchEnd from re-opening it.
        setTimeout(() => {
            this.closePopUp();
        }, 100); // You can adjust this delay if needed
    }

    exportJsonToMarkdownPage() {
        const storedData = localStorage.getItem('mindMapData');
        if (storedData) {
            try {
                sessionStorage.setItem('markdownData', storedData);
                window.location.href = 'json2md.html';
            } catch (error) {
                console.error('Erro ao preparar dados para Markdown:', error);
                alert('Ocorreu um erro ao preparar os dados para exportação Markdown.');
            }
        } else {
            alert('Nenhum dado do mapa mental encontrado para criar Markdown.');
        }
    }

    /**
     * Recalculates the mind map positions using the D3 algorithm,
     * clearing any previously persisted manual positions.
     */
    async recalculateMap() { // Adicione 'async' aqui
        // Clear persisted positions from all nodes in the data
        this.d3RootNode.each(d3Node => {
            if (d3Node.data.persistedX !== undefined) {
                delete d3Node.data.persistedX;
            }
            if (d3Node.data.persistedY !== undefined) {
                delete d3Node.data.persistedY;
            }
        });
        // Redraw the map, which will now use the D3 algorithm for positioning
        await this.drawMindMap(); // Adicione 'await' aqui
    }

    /**
     * Loads the default mind map data from mindmap.json.
     * This function is now a method of the class.
     */
    _loadDefaultMindMapData() {
        fetch('mindmap.json')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                this.data = data; // Update the instance's data
                localStorage.setItem('mindMapData', JSON.stringify(this.data)); // Save to localStorage
                this.drawMindMap(); // Redraw the map with new data
                this.closePopUp(); // Optionally close popUp when loading new map
            })
            .catch(error => {
                console.error('Erro ao carregar os dados do mapa mental padrão:', error);
                this.container.innerHTML = '<p style="color: red;">Erro ao carregar o mapa mental.</p>';
            });
    }

    // --- LOOP DE ANIMAÇÃO ---
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}


// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    const mindmapContainer = document.getElementById('mindmap-container');
    if (!mindmapContainer) {
        console.error("Container do mapa mental não encontrado.");
        return;
    }

    const storedData = localStorage.getItem('mindMapData');

    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            // Pass the initial data to the MindMapViewer constructor
            new MindMapViewer(mindmapContainer, data);
        } catch (error) {
            console.error('Falha ao parsear os dados do mapa mental do localStorage:', error);
            // If parsing fails, load default
            const viewer = new MindMapViewer(mindmapContainer, {}); // Initialize with empty data for now
            viewer._loadDefaultMindMapData();
        }
    } else {
        // If no stored data, load default
        const viewer = new MindMapViewer(mindmapContainer, {}); // Initialize with empty data for now
        viewer._loadDefaultMindMapData();
    }
});