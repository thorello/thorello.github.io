import * as THREE from 'three';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';
import { exportMindMapToPDF } from './pdfExport.js';
import { exportMindMapToJson } from './jsonExport.js';
import { importMindMapFromJson } from './jsonImport.js';
import './menuHandler.js';
import { promptBase } from './prompts.js';

// --- Importa o tema desejado ---
import { darkTheme, lightTheme } from './theme.js';

const APP_VERSION = 'v2.0.0';

// Use o tema importado como sua configuração
const CONFIG = lightTheme;

CONFIG.FIXED_NODE_WIDTH = (CONFIG.font.size * CONFIG.font.characterWidth * CONFIG.FIXED_NODE_CHARACTER_LIMIT) + (CONFIG.padding.x * 2);
CONFIG.FIXED_NODE_HEIGHT = (CONFIG.font.size * CONFIG.FIXED_NODE_HEIGHT_MULTIPLIER) + (CONFIG.padding.y * 2);

/**
 * Creates rounded rectangle geometry.
 * @param {number} width - Rectangle width.
 * @param {number} height - Rectangle height.
 * @param {number} radius - Corner radius.
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
        this.aiNewMapButton = document.getElementById('ai-new-map-button-popUp');
        this.addChildrenWithAIButton = document.getElementById('add-children-with-ai-button');
        this.deleteNodeButton = document.getElementById('delete-node-button');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.focusNextNodeButton = document.getElementById('focus-next-node-button');
        this.focusPreviousNodeButton = document.getElementById('focus-previous-node-button');
        this.copyAIPromptButton = document.getElementById('copy-ai-prompt-button');
        this.pasteJsonFromClipboardButton = document.getElementById('paste-json-from-clipboard-button');

        // --- State Variables ---
        this.nodeMap = new Map();
        this.linkObjects = [];
        this.dragHandles = [];
        this.selectedNode = null;
        this.offset = new THREE.Vector3();
        this.isDraggingNode = false;
        this.initialIntersectionPoint = new THREE.Vector3();
        this.d3RootNode = null;
        this.currentSelectedD3Node = null;
        this.focusedNodeIndex = 0;
        this.highlightedNode = null;
        this.highlightedLine = null;

        // --- Camera Control State ---
        this.isPanning = false;
        this.lastPointerPosition = new THREE.Vector2();
        this._isPinching = false;
        this.initialPinchDistance = 0;
        this.initialPinchZoom = 1;
        this.pinchCenterWorld = new THREE.Vector3();
        this.initialPointerCoords = new THREE.Vector2();
        this.isConsideredClick = true;
        this.tapThreshold = 5;

        // --- PopUp Elements ---
        this.popUp = document.getElementById('popUp');
        this.popUpCloseButton = document.getElementById('popUp-close');
        this.isPopUpOpen = false;

        // --- JSON Paste PopUp Elements ---
        this.jsonPastePopUp = document.getElementById('json-paste-popUp');
        this.jsonPastePopUpCloseButton = document.getElementById('json-paste-popUp-close');
        this.jsonPasteTextarea = document.getElementById('json-paste-textarea');
        this.jsonPasteImportButton = document.getElementById('json-paste-import-button');
        this.isJsonPastePopUpOpen = false;

        // --- NEW Prompt Generator PopUp Elements ---
        this.promptGeneratorPopUp = document.getElementById('prompt-generator-popUp');
        this.promptGeneratorPopUpCloseButton = document.getElementById('prompt-generator-popUp-close');
        this.promptInputTextarea = document.getElementById('prompt-input-textarea');
        this.copyPromptButton = document.getElementById('copy-prompt-button');
        this.isPromptGeneratorPopUpOpen = false;

        // --- Sidebar Editing Elements ---
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

        // --- New Bottom Info Element ---
        this.nodeInfoFooter = document.getElementById('node-info-footer');

        this._initScene();
        this._initEventListeners();
        this._createVersionInfo();

        this.animate();
    }

    // --- Initialization Methods ---
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
        // Mouse Events
        this.renderer.domElement.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this._onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this._onMouseUp.bind(this));
        this.renderer.domElement.addEventListener('wheel', this._onMouseWheel.bind(this), { passive: false });

        // Touch Events
        this.renderer.domElement.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });

        if (this.popUpCloseButton) {
            this.popUpCloseButton.addEventListener('click', this.closePopUp.bind(this));
        }

        if (this.focusNextNodeButton) {
            this.focusNextNodeButton.addEventListener('click', this.focusNextNode.bind(this));
        }

        if (this.focusPreviousNodeButton) {
            this.focusPreviousNodeButton.addEventListener('click', this.focusPreviousNode.bind(this));
        }

        // JSON Paste PopUp Event Listeners
        if (this.jsonPastePopUpCloseButton) {
            this.jsonPastePopUpCloseButton.addEventListener('click', this.closeJsonPastePopUp.bind(this));
        }

        if (this.jsonPasteImportButton) {
            this.jsonPasteImportButton.addEventListener('click', this.importJsonFromPaste.bind(this));
        }

        const pasteJsonButton = document.getElementById('paste-json-button');
        if (pasteJsonButton) {
            pasteJsonButton.addEventListener('click', () => {
                this.openJsonPastePopUp();
            });
        }

        // NEW Prompt Generator PopUp Event Listeners
        if (this.promptGeneratorPopUpCloseButton) {
            this.promptGeneratorPopUpCloseButton.addEventListener('click', this.closePromptGeneratorPopUp.bind(this));
        }

        if (this.copyPromptButton) {
            this.copyPromptButton.addEventListener('click', this.copyGeneratedPrompt.bind(this));
        }

        const generatePromptButton = document.getElementById('generate-prompt-button');
        if (generatePromptButton) {
            generatePromptButton.addEventListener('click', () => {
                this.openPromptGeneratorPopUp();
            });
        }


        if (this.addNodeButton) {
            this.addNodeButton.addEventListener('click', this.addChildNode.bind(this));
        }

        // Novo: Event Listener para o botão 'Adicionar nodes com IA'
        if (this.addChildrenWithAIButton) {
            this.addChildrenWithAIButton.addEventListener('click', this.addChildrenWithAI.bind(this));
        }

        // Novo: Event Listener para o botão 'Copiar Prompt para IA'
        if (this.copyAIPromptButton) {
            this.copyAIPromptButton.addEventListener('click', this.copyAIPrompt.bind(this));
        }

        // Novo: Event Listener para o botão 'Colar JSON e Criar Nós'
        if (this.pasteJsonFromClipboardButton) {
            this.pasteJsonFromClipboardButton.addEventListener('click', this.pasteJsonAndCreateChildren.bind(this));
        }

        // Novo: Event Listener para o botão 'Novo Mapa Mental com IA'
        if (this.aiNewMapButton) {
            this.aiNewMapButton.addEventListener('click', () => {
                window.location.href = 'api.html';
            });
        }

        // Event Listener para o botão 'Excluir Nó'
        if (this.deleteNodeButton) {
            this.deleteNodeButton.addEventListener('click', this.deleteSelectedNode.bind(this));
        }


        // --- New Edit Event Listeners ---
        this.editTitleBtn.addEventListener('click', () => this.toggleEditMode('title', true));
        this.saveTitleBtn.addEventListener('click', () => this.saveNodeChanges('title'));
        this.cancelTitleBtn.addEventListener('click', () => this.toggleEditMode('title', false));

        this.editContentBtn.addEventListener('click', () => this.toggleEditMode('content', true));
        this.saveContentBtn.addEventListener('click', () => this.saveNodeChanges('content'));
        this.cancelContentBtn.addEventListener('click', () => this.toggleEditMode('content', false));

        const exportPdfButton = document.getElementById('export-pdf-button');
        if (exportPdfButton) {
            exportPdfButton.addEventListener('click', () => {
                exportMindMapToPDF(this.nodeMap, this.linkObjects, CONFIG, this.mainGroup.position);
            });
        }

        const exportJsonButton = document.getElementById('export-json-button');
        if (exportJsonButton) {
            exportJsonButton.addEventListener('click', () => {
                exportMindMapToJson();
            });
        }

        const jsonUploadInput = document.getElementById('jsonUpload');
        if (jsonUploadInput) {
            jsonUploadInput.addEventListener('change', (event) => {
                importMindMapFromJson(event, (importedData) => {
                    this.data = importedData;
                    this.drawMindMap();
                });
            });
        }

        const createMarkdownButton = document.getElementById('create-markdown-button');
        if (createMarkdownButton) {
            createMarkdownButton.addEventListener('click', () => {
                this.exportJsonToMarkdownPage();
            });
        }

        const recalculateMapButton = document.getElementById('recalculate-map-button');
        if (recalculateMapButton) {
            recalculateMapButton.addEventListener('click', () => {
                this.recalculateMap();
            });
        }

        // Modified: "Novo Mapa" button now loads new_mindmap.json
        const newMapButton = document.getElementById('new-map-button');
        if (newMapButton) {
            newMapButton.addEventListener('click', () => {
                localStorage.removeItem('mindMapData');
                this._loadMindMapFromFile('new_mindmap.json');
            });
        }

        // NEW: "Manual" button to load mindmap.json
        const loadManualMapButton = document.getElementById('load-manual-map-button');
        if (loadManualMapButton) {
            loadManualMapButton.addEventListener('click', () => {
                localStorage.removeItem('mindMapData');
                this._loadMindMapFromFile('mindmap.json');
            });
        }
    }

    _createVersionInfo() {
        const versionElement = document.getElementById('version-info');
        if (versionElement) {
            versionElement.textContent = `Mind Map ${APP_VERSION}`;
        } else {
            console.warn("Element with id 'version-info' not found.");
        }
    }

    generateAndAssignIds(data) {
        function assignIdRecursively(node, parentId = null) {
            if (!node.children) {
                return;
            }
            node.children.forEach((child, index) => {
                const newId = parentId ? `${parentId}.${index + 1}` : (index + 1).toString();
                child.id = newId;
                assignIdRecursively(child, newId);
            });
        }
        assignIdRecursively(data);
        return data;
    }

    /**
     * Creates rounded rectangle geometry.
     * @param {number} width - Rectangle width.
     * @param {number} height - Rectangle height.
     * @param {number} radius - Corner radius.
     * @returns {THREE.ShapeGeometry}
     */
    createRoundedRectGeometry(width, height, radius) {
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

    /**
     * Cria a malha (mesh) para um nó do mapa mental, incluindo o retângulo, o texto e, opcionalmente, o manipulador de arrastar.
     * @param {object} d3Node - O objeto de nó da hierarquia D3.
     * @param {number} direction - A direção do nó (-1 para esquerda, 1 para direita, 0 para o nó raiz).
     * @returns {Promise<THREE.Group>}
     */
    _createNodeMesh(d3Node, direction) {
        return new Promise(resolve => {
            const nodeGroup = new THREE.Group();
            nodeGroup.userData = { d3Node: d3Node, isNode: true, direction: direction };

            const isRootNode = d3Node.depth === 0;

            const nodeColor = isRootNode ? CONFIG.rootNodeColor : CONFIG.nodeColors.length > 0 ? CONFIG.nodeColors.slice().reverse()[d3Node.depth] : 0xFFFFFF;
            const textColor = isRootNode ? CONFIG.rootTextColor : CONFIG.textColor;
            const idColor = isRootNode ? CONFIG.rootTextColor : 0x888888;

            // 1. Cria a malha de texto para o nome do nó (a partir do código original)
            const textMesh = new Text();
            textMesh.text = d3Node.data.name;
            textMesh.fontSize = CONFIG.font.size;
            textMesh.color = textColor;
            textMesh.position.z = 0.1;
            textMesh.anchorX = 'center';
            textMesh.anchorY = 'middle';
            textMesh.maxWidth = CONFIG.FIXED_NODE_WIDTH - (CONFIG.padding.x * 2);
            textMesh.name = 'nodeTextMesh';

            textMesh.sync(() => {
                // 2. Cria a malha de texto para o ID
                const idTextMesh = new Text();
                idTextMesh.text = d3Node.data.id !== undefined ? d3Node.data.id : '';
                idTextMesh.fontSize = CONFIG.font.size * 0.7;
                idTextMesh.color = idColor;
                idTextMesh.position.z = 0.1;
                idTextMesh.anchorX = 'left';
                idTextMesh.anchorY = 'top';
                idTextMesh.name = 'nodeIdMesh';

                idTextMesh.sync(() => {
                    const rectWidth = CONFIG.FIXED_NODE_WIDTH;
                    const rectHeight = CONFIG.FIXED_NODE_HEIGHT;

                    const rectGeo = createRoundedRectGeometry(rectWidth, rectHeight, CONFIG.borderRadius);
                    const rectMat = new THREE.MeshBasicMaterial({ color: nodeColor });

                    const rectMesh = new THREE.Mesh(rectGeo, rectMat);
                    rectMesh.name = 'nodeRectMesh';
                    nodeGroup.add(rectMesh);

                    if (!isRootNode) {
                        const edges = new THREE.EdgesGeometry(rectGeo);
                        const lineMat = new THREE.LineBasicMaterial({ color: CONFIG.wireframeColor, linewidth: 2 });
                        const wireframe = new THREE.LineSegments(edges, lineMat);
                        wireframe.name = 'nodeWireframe';
                        nodeGroup.add(wireframe);
                    }

                    // 3. Posiciona o texto do nome e o texto do ID
                    textMesh.position.x = 0;
                    idTextMesh.position.x = -rectWidth / 2 + CONFIG.padding.x / 2;
                    idTextMesh.position.y = rectHeight / 2 - CONFIG.padding.y / 2;

                    nodeGroup.add(textMesh);
                    nodeGroup.add(idTextMesh);
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

    _findD3NodeByData(targetData) {
        let foundNode = null;
        this.d3RootNode.each(d3Node => {
            if (d3Node.data === targetData) {
                foundNode = d3Node;
                return false;
            }
        });
        return foundNode;
    }

    // --- Main Logic ---
    async drawMindMap() {
        while (this.mainGroup.children.length > 0) {
            const object = this.mainGroup.children[0];
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            if (object.children) {
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

        if (this.data) {
            this.data = this.generateAndAssignIds(this.data);
        }

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
                const treeLayoutLeft = tree().nodeSize([CONFIG.verticalNodeSpacing, 1]);
                treeLayoutLeft(leftRoot);

                leftRoot.descendants().forEach(node => {
                    if (node.depth > 0) {
                        node.userData = node.userData || {};
                        Object.assign(node.userData, { assignedDirection: -1, d3X: node.x, d3Y: node.y });
                    } else {
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
                const treeLayoutRight = tree().nodeSize([CONFIG.verticalNodeSpacing, 1]);
                treeLayoutRight(rightRoot);

                rightRoot.descendants().forEach(node => {
                    if (node.depth > 0) {
                        node.userData = node.userData || {};
                        Object.assign(node.userData, { assignedDirection: 1, d3X: node.x, d3Y: node.y });
                    } else {
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

            if (d3Node.data.persistedX !== undefined && d3Node.data.persistedY !== undefined) {
                nodeGroup.position.set(d3Node.data.persistedX, d3Node.data.persistedY, 0);
            } else {
                const direction = nodeGroup.userData.direction;
                const nodeWidth = CONFIG.FIXED_NODE_WIDTH;

                let finalNodeX = 0;
                let finalNodeY = 0;

                if (d3Node.depth === 0) {
                    finalNodeX = 0;
                    finalNodeY = 0;
                } else {
                    finalNodeY = d3Node.userData.d3X;

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
                    d3Node.data.persistedX = finalNodeX;
                    d3Node.data.persistedY = finalNodeY;
                }
                nodeGroup.position.set(finalNodeX, finalNodeY, 0);
            }
            this.mainGroup.add(nodeGroup);
        });

        d3Links.forEach(link => this._createLinkMesh(link));

        const box = new THREE.Box3().setFromObject(this.mainGroup);
        const center = box.getCenter(new THREE.Vector3());
        this.mainGroup.position.sub(center);

        this.camera.updateProjectionMatrix();

        localStorage.setItem('mindMapData', JSON.stringify(this.data));

        const rootNodeGroup = this.nodeMap.get(this.d3RootNode);
        if (rootNodeGroup) {
            this._focusCameraOnNode(rootNodeGroup);
        }
    }

    /**
     * Foca a câmera no próximo nó da sequência, ordenando por ID.
     */
    /**
     * Foca a câmera no próximo nó da sequência, ordenando por ID.
     * A sequência começa a partir do nó que está atualmente destacado (highlighted).
     */
    // Substitua o método focusNextNode() existente por este novo
    focusNextNode() {
        if (!this.d3RootNode) {
            console.warn("Nenhum mapa mental para focar.");
            return;
        }

        const allNodes = Array.from(this.nodeMap.keys());
        allNodes.sort((a, b) => {
            const idA = a.data.id || '0';
            const idB = b.data.id || '0';
            const partsA = idA.split('.').map(Number);
            const partsB = idB.split('.').map(Number);

            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                const valA = partsA[i] || 0;
                const valB = partsB[i] || 0;
                if (valA !== valB) {
                    return valA - valB;
                }
            }
            return 0;
        });

        this.focusedNodeIndex = (this.focusedNodeIndex + 1) % allNodes.length;
        const nextD3Node = allNodes[this.focusedNodeIndex];
        const nextNodeGroup = this.nodeMap.get(nextD3Node);

        if (nextNodeGroup) {
            // Remove o destaque do nó anterior, se existir
            if (this.highlightedNode) {
                const isRootNode = this.highlightedNode.userData.d3Node.depth === 0;
                const originalColor = isRootNode ? CONFIG.rootNodeColor : CONFIG.wireframeColor;
                const lineMesh = this.highlightedNode.children.find(child => child.name === 'nodeWireframe');
                if (lineMesh) {
                    lineMesh.material.color.set(originalColor);
                }
            }

            this._focusCameraOnNode(nextNodeGroup);

            // Atualiza o nó destacado e a linha para o novo nó
            this.currentSelectedD3Node = nextD3Node;
            this.highlightedNode = nextNodeGroup;
            const lineMesh = nextNodeGroup.children.find(child => child.name === 'nodeWireframe');
            if (lineMesh) {
                lineMesh.material.color.set(CONFIG.highlightColor);
                this.highlightedLine = lineMesh;
            }

            // Atualiza o rodapé com a nova informação do nó
            const nodeId = nextD3Node.data.id || '';
            const nodeName = nextD3Node.data.name || '';
            this.nodeInfoFooter.textContent = `ID: ${nodeId} | Nome: ${nodeName}`;
            this.nodeInfoFooter.classList.add('visible');

            // Note: A chamada this.openPopUp() foi removida daqui.
            // O pop-up só será aberto com um clique/toque manual.
        }
    }

    /**
     * Foca a câmera no nó anterior da sequência, ordenando por ID.
     */
    focusPreviousNode() {
        if (!this.d3RootNode) {
            console.warn("Nenhum mapa mental para focar.");
            return;
        }

        const allNodes = Array.from(this.nodeMap.keys());
        allNodes.sort((a, b) => {
            const idA = a.data.id || '0';
            const idB = b.data.id || '0';
            const partsA = idA.split('.').map(Number);
            const partsB = idB.split('.').map(Number);

            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                const valA = partsA[i] || 0;
                const valB = partsB[i] || 0;
                if (valA !== valB) {
                    return valA - valB;
                }
            }
            return 0;
        });

        this.focusedNodeIndex = (this.focusedNodeIndex - 1 + allNodes.length) % allNodes.length;
        const previousD3Node = allNodes[this.focusedNodeIndex];
        const previousNodeGroup = this.nodeMap.get(previousD3Node);

        if (previousNodeGroup) {
            // Remove o destaque do nó anterior, se existir
            if (this.highlightedNode) {
                const isRootNode = this.highlightedNode.userData.d3Node.depth === 0;
                const originalColor = isRootNode ? CONFIG.rootNodeColor : CONFIG.wireframeColor;
                const lineMesh = this.highlightedNode.children.find(child => child.name === 'nodeWireframe');
                if (lineMesh) {
                    lineMesh.material.color.set(originalColor);
                }
            }

            this._focusCameraOnNode(previousNodeGroup);

            // Atualiza o nó destacado e a linha para o novo nó
            this.currentSelectedD3Node = previousD3Node;
            this.highlightedNode = previousNodeGroup;
            const lineMesh = previousNodeGroup.children.find(child => child.name === 'nodeWireframe');
            if (lineMesh) {
                lineMesh.material.color.set(CONFIG.highlightColor);
                this.highlightedLine = lineMesh;
            }

            // Atualiza o rodapé com a nova informação do nó
            const nodeId = previousD3Node.data.id || '';
            const nodeName = previousD3Node.data.name || '';
            this.nodeInfoFooter.textContent = `ID: ${nodeId} | Nome: ${nodeName}`;
            this.nodeInfoFooter.classList.add('visible');
        }
    }

    /**
     * Focuses the camera on a specific node.
     * @param {THREE.Group} nodeGroup - The THREE.js group representing the node.
     */
    _focusCameraOnNode(nodeGroup) {
        if (!nodeGroup) {
            console.warn("Node to focus camera on not found.");
            return;
        }

        const targetPosition = new THREE.Vector3();
        nodeGroup.getWorldPosition(targetPosition);

        this.camera.position.x = targetPosition.x;
        this.camera.position.y = targetPosition.y;
        this.camera.position.z = 250;

        // Se você mudou para zoom ortográfico, o 'camera.zoom' deve ser 1
        // mas a posição pode ser ajustada para centralizar o nó.
        this.camera.zoom = 1;
        this.camera.updateProjectionMatrix();
    }

    // --- Event Handlers ---
    _onWindowResize() {
        this.camera.left = -window.innerWidth / 2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = -window.innerHeight / 2;
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
        if (this.isPopUpOpen || this.isJsonPastePopUpOpen || this.isPromptGeneratorPopUpOpen) return;

        this.mouse.copy(this._getPointerCoordinates(event));
        const worldPosBeforeZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);

        // Lógica alterada para inverter a direção do zoom. Removido o '-'.
        const zoomFactor = Math.pow(0.9, event.deltaY * 0.01 * CONFIG.zoom.speed);

        let newZoom = this.camera.zoom * zoomFactor;
        newZoom = Math.max(CONFIG.zoom.min, Math.min(CONFIG.zoom.max, newZoom));
        this.camera.zoom = newZoom;

        this.camera.updateProjectionMatrix();

        const worldPosAfterZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);
        const panDelta = new THREE.Vector3().subVectors(worldPosBeforeZoom, worldPosAfterZoom);
        this.camera.position.add(panDelta);
    }

    _onMouseDown(event) {
        if (this.isPopUpOpen || this.isJsonPastePopUpOpen || this.isPromptGeneratorPopUpOpen) return;

        this.isConsideredClick = true;
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
        if (this.isPopUpOpen || this.isJsonPastePopUpOpen || this.isPromptGeneratorPopUpOpen) return;

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
            const currentZoom = (this.camera.right - this.camera.left) / window.innerWidth;
            const panSpeed = currentZoom;
            this.camera.position.x -= deltaX * panSpeed;
            this.camera.position.y += deltaY * panSpeed;
            this.lastPointerPosition.set(event.clientX, event.clientY);
        }
    }

    _onMouseUp(event) {
        if (this.isPopUpOpen || this.isJsonPastePopUpOpen || this.isPromptGeneratorPopUpOpen) return;

        if (this.isConsideredClick && !this.isDraggingNode) {
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

            // Limpar o destaque do nó anterior, se houver
            if (this.highlightedNode) {
                const isRootNode = this.highlightedNode.userData.d3Node.depth === 0;
                const originalColor = isRootNode ? CONFIG.rootNodeColor : CONFIG.wireframeColor;
                const lineMesh = this.highlightedNode.children.find(child => child.name === 'nodeWireframe');
                if (lineMesh) {
                    lineMesh.material.color.set(originalColor);
                }
                this.highlightedNode = null;
                this.highlightedLine = null;
            }

            if (clickedNode) {
                const d3Node = clickedNode.userData.d3Node;
                this.currentSelectedD3Node = d3Node;

                // --- NOVA LÓGICA: Sincroniza o índice do nó focado com o nó clicado ---
                const allNodes = Array.from(this.nodeMap.keys());
                allNodes.sort((a, b) => {
                    const idA = a.data.id || '0';
                    const idB = b.data.id || '0';
                    const partsA = idA.split('.').map(Number);
                    const partsB = idB.split('.').map(Number);

                    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                        const valA = partsA[i] || 0;
                        const valB = partsB[i] || 0;
                        if (valA !== valB) {
                            return valA - valB;
                        }
                    }
                    return 0;
                });
                const clickedIndex = allNodes.findIndex(node => node === d3Node);
                if (clickedIndex !== -1) {
                    this.focusedNodeIndex = clickedIndex;
                }
                // --- FIM DA NOVA LÓGICA ---

                // Destacar o nó
                const lineMesh = clickedNode.children.find(child => child.name === 'nodeWireframe');
                if (lineMesh) {
                    lineMesh.material.color.set(CONFIG.highlightColor);
                    this.highlightedNode = clickedNode;
                    this.highlightedLine = lineMesh;
                }

                // Exibir o texto no rodapé
                const nodeId = d3Node.data.id || '';
                const nodeName = d3Node.data.name || '';
                this.nodeInfoFooter.textContent = `ID: ${nodeId} | Nome: ${nodeName}`;
                this.nodeInfoFooter.classList.add('visible');

                this.openPopUp(nodeName, d3Node.data.definition || 'Nenhuma explicação disponível.');
            } else {
                // Esconder o rodapé se não houver nó clicado
                this.nodeInfoFooter.classList.remove('visible');
            }
        }

        if (this.isDraggingNode && this.selectedNode) {
            const d3Node = this.selectedNode.userData.d3Node;
            if (d3Node) {
                d3Node.data.persistedX = this.selectedNode.position.x;
                d3Node.data.persistedY = this.selectedNode.position.y;
                localStorage.setItem('mindMapData', JSON.stringify(this.data));
            }
        }
        this.selectedNode = null;
        this.isDraggingNode = false;
        this.isPanning = false;
        this.isConsideredClick = true;
    }

    _onTouchStart(event) {
        event.preventDefault();
        if (this.isPopUpOpen || this.isJsonPastePopUpOpen || this.isPromptGeneratorPopUpOpen) return;

        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
            this.tapTimeout = null;
        }

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
            this.isConsideredClick = false;
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            this.initialPinchDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            this.initialPinchZoom = this.camera.zoom;
        }
    }

    _onTouchMove(event) {
        event.preventDefault();
        if (this.isPopUpOpen || this.isJsonPastePopUpOpen || this.isPromptGeneratorPopUpOpen) return;

        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
            this.tapTimeout = null;
        }

        // Pinch-to-zoom com dois dedos
        if (event.touches.length === 2) {
            this.isConsideredClick = false;
            this._isPinching = true;
            this.isPanning = false; // Desativa o pan de um dedo enquanto estiver pinçando

            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentPinchDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

            // Calcula a posição do centro do pinch na tela
            const pinchCenterScreenX = (touch1.clientX + touch2.clientX) / 2;
            const pinchCenterScreenY = (touch1.clientY + touch2.clientY) / 2;

            // Mapeia o ponto central do pinch para coordenadas WebGL antes do zoom
            this.mouse.set(
                (pinchCenterScreenX / window.innerWidth) * 2 - 1,
                -((pinchCenterScreenY / window.innerHeight) * 2 - 1)
            );
            const worldPosBeforeZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);

            // Calcula o novo fator de zoom com base na distância da pinça
            const zoomFactor = this.initialPinchDistance / currentPinchDistance;
            let newZoom = this.initialPinchZoom * zoomFactor;

            // Limita o zoom para evitar valores extremos
            newZoom = Math.max(CONFIG.zoom.min, Math.min(CONFIG.zoom.max, newZoom));

            // Aplica o novo zoom na câmera
            this.camera.zoom = newZoom;
            this.camera.updateProjectionMatrix();

            // Mapeia o mesmo ponto central do pinch para coordenadas WebGL depois do zoom
            const worldPosAfterZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);

            // Calcula o delta de pan e move a câmera para manter o ponto central do pinch fixo
            const panDelta = worldPosAfterZoom.sub(worldPosBeforeZoom);
            this.camera.position.sub(panDelta);

        }
        // Pan com um dedo
        else if (this.isPanning && event.touches.length === 1) {
            this.isConsideredClick = false;

            const deltaX = event.touches[0].clientX - this.lastPointerPosition.x;
            const deltaY = event.touches[0].clientY - this.lastPointerPosition.y;

            // O panSpeed é ajustado com base no zoom atual da câmera
            const panSpeed = (this.camera.right - this.camera.left) / window.innerWidth;

            this.camera.position.x -= deltaX * panSpeed;
            this.camera.position.y += deltaY * panSpeed;

            this.lastPointerPosition.set(event.touches[0].clientX, event.touches[0].clientY);
        }
        // Lógica para arrastar o nó
        else if (this.isDraggingNode && this.selectedNode) {
            this.isConsideredClick = false;

            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const currentIntersectionPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(plane, currentIntersectionPoint);
            const delta = new THREE.Vector3().subVectors(currentIntersectionPoint, this.initialIntersectionPoint);
            this._moveSubtree(this.selectedNode, delta);
            this.initialIntersectionPoint.copy(currentIntersectionPoint);
            this.updateLinks();
        }
    }

    _onTouchEnd(event) {
        if (this.isPopUpOpen || this.isJsonPastePopUpOpen || this.isPromptGeneratorPopUpOpen) return;

        if (event.touches.length > 0) {
            return;
        }

        if (this._isPinching) {
            this.isDraggingNode = false;
            this.isPanning = false;
            this._isPinching = false;
            this.isConsideredClick = true;
            return;
        }

        if (this.isConsideredClick) {
            this.tapTimeout = setTimeout(() => {
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

                // Limpar o destaque do nó anterior, se houver
                if (this.highlightedNode) {
                    const isRootNode = this.highlightedNode.userData.d3Node.depth === 0;
                    const originalColor = isRootNode ? CONFIG.rootNodeColor : CONFIG.wireframeColor;
                    const lineMesh = this.highlightedNode.children.find(child => child.name === 'nodeWireframe');
                    if (lineMesh) {
                        lineMesh.material.color.set(originalColor);
                    }
                    this.highlightedNode = null;
                    this.highlightedLine = null;
                }

                if (clickedNode && !clickedNode.userData.isDragHandle) {
                    const d3Node = clickedNode.userData.d3Node;
                    this.currentSelectedD3Node = d3Node;

                    // --- NOVA LÓGICA PARA MOBILE: Sincroniza o índice do nó focado com o nó tocado ---
                    const allNodes = Array.from(this.nodeMap.keys());
                    allNodes.sort((a, b) => {
                        const idA = a.data.id || '0';
                        const idB = b.data.id || '0';
                        const partsA = idA.split('.').map(Number);
                        const partsB = idB.split('.').map(Number);

                        for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                            const valA = partsA[i] || 0;
                            const valB = partsB[i] || 0;
                            if (valA !== valB) {
                                return valA - valB;
                            }
                        }
                        return 0;
                    });
                    const clickedIndex = allNodes.findIndex(node => node === d3Node);
                    if (clickedIndex !== -1) {
                        this.focusedNodeIndex = clickedIndex;
                    }
                    // --- FIM DA NOVA LÓGICA ---

                    // Destacar o nó
                    const lineMesh = clickedNode.children.find(child => child.name === 'nodeWireframe');
                    if (lineMesh) {
                        lineMesh.material.color.set(CONFIG.highlightColor);
                        this.highlightedNode = clickedNode;
                        this.highlightedLine = lineMesh;
                    }

                    // Exibir o texto no rodapé
                    const nodeId = d3Node.data.id || '';
                    const nodeName = d3Node.data.name || '';
                    this.nodeInfoFooter.textContent = `ID: ${nodeId} | Nome: ${nodeName}`;
                    this.nodeInfoFooter.classList.add('visible');

                    this.openPopUp(d3Node.data.name, d3Node.data.definition || 'Nenhuma explicação disponível.');
                } else {
                    this.nodeInfoFooter.classList.remove('visible');
                }
                this.tapTimeout = null;
            }, 200);
        }

        if (this.isDraggingNode && this.selectedNode) {
            const d3Node = this.selectedNode.userData.d3Node;
            if (d3Node) {
                d3Node.data.persistedX = this.selectedNode.position.x;
                d3Node.data.persistedY = this.selectedNode.position.y;
                localStorage.setItem('mindMapData', JSON.stringify(this.data));
            }
        }
        this.isDraggingNode = false;
        this.isPanning = false;
        this.isConsideredClick = true;
    }


    // --- Sidebar and Editing Methods ---
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

        if (this.currentSelectedD3Node) {
            if (this.currentSelectedD3Node.depth === 0) {
                if (this.aiNewMapButton) this.aiNewMapButton.style.display = 'block';
                if (this.addChildrenWithAIButton) this.addChildrenWithAIButton.style.display = 'block';
                if (this.copyAIPromptButton) this.copyAIPromptButton.style.display = 'none';
                if (this.pasteJsonFromClipboardButton) this.pasteJsonFromClipboardButton.style.display = 'none';
                if (this.deleteNodeButton) this.deleteNodeButton.style.display = 'none';
            } else {
                if (this.aiNewMapButton) this.aiNewMapButton.style.display = 'none';
                if (this.addChildrenWithAIButton) this.addChildrenWithAIButton.style.display = 'block';
                if (this.copyAIPromptButton) this.copyAIPromptButton.style.display = 'block';
                if (this.pasteJsonFromClipboardButton) this.pasteJsonFromClipboardButton.style.display = 'block';
                if (this.deleteNodeButton) this.deleteNodeButton.style.display = 'block';
            }
        } else {
            if (this.aiNewMapButton) this.aiNewMapButton.style.display = 'none';
            if (this.addChildrenWithAIButton) this.addChildrenWithAIButton.style.display = 'none';
            if (this.copyAIPromptButton) this.copyAIPromptButton.style.display = 'none';
            if (this.pasteJsonFromClipboardButton) this.pasteJsonFromClipboardButton.style.display = 'none';
            if (this.deleteNodeButton) this.deleteNodeButton.style.display = 'none';
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
        if (this.aiNewMapButton) {
            this.aiNewMapButton.style.display = 'none';
        }
        if (this.addChildrenWithAIButton) {
            this.addChildrenWithAIButton.style.display = 'none';
        }
        if (this.copyAIPromptButton) {
            this.copyAIPromptButton.style.display = 'none';
        }
        if (this.pasteJsonFromClipboardButton) {
            this.pasteJsonFromClipboardButton.style.display = 'none';
        }
        if (this.deleteNodeButton) {
            this.deleteNodeButton.style.display = 'none';
        }
        // A lógica de limpar o highlight e o rodapé foi movida para _onMouseUp() e deleteSelectedNode().
    }

    // JSON Paste PopUp Methods
    openJsonPastePopUp() {
        if (!this.jsonPastePopUp) return;
        this.jsonPastePopUp.classList.add('open');
        this.isJsonPastePopUpOpen = true;
        this.jsonPasteTextarea.value = '';
    }

    closeJsonPastePopUp() {
        if (!this.jsonPastePopUp) return;
        this.jsonPastePopUp.classList.remove('open');
        this.isJsonPastePopUpOpen = false;
    }

    importJsonFromPaste() {
        const jsonText = this.jsonPasteTextarea.value.trim();
        if (!jsonText) {
            alert('Por favor, cole o conteúdo JSON na área de texto.');
            return;
        }

        try {
            const parsedData = JSON.parse(jsonText);
            this.data = parsedData;
            this.drawMindMap();
            this.closeJsonPastePopUp();
            alert('Mapa mental importado com sucesso!');
        } catch (error) {
            console.error('Erro ao analisar JSON colado:', error);
            alert('Erro: O texto colado não é um JSON válido. Por favor, verifique o formato.');
        }
    }

    // NEW: Prompt Generator PopUp Methods
    openPromptGeneratorPopUp() {
        if (!this.promptGeneratorPopUp) return;
        this.promptGeneratorPopUp.classList.add('open');
        this.isPromptGeneratorPopUpOpen = true;
        this.promptInputTextarea.value = '';
    }

    closePromptGeneratorPopUp() {
        if (!this.promptGeneratorPopUp) return;
        this.promptGeneratorPopUp.classList.remove('open');
        this.isPromptGeneratorPopUpOpen = false;
    }

    async copyGeneratedPrompt() {
        const userText = this.promptInputTextarea.value.trim();
        const fullPrompt = promptBase + ' Content: ' + userText;

        try {
            await navigator.clipboard.writeText(fullPrompt);
            alert('Prompt copiado para a área de transferência!');
            this.closePromptGeneratorPopUp();
        } catch (err) {
            console.error('Falha ao copiar o prompt: ', err);
            alert('Erro ao copiar o prompt. Por favor, copie manualmente.');
        }
    }

    async copyAIPrompt() {
        if (!this.currentSelectedD3Node) {
            alert('Por favor, selecione um nó para gerar o prompt.');
            return;
        }

        const selectedD3NodeToProcess = this.currentSelectedD3Node;
        const nodeContent = {
            name: selectedD3NodeToProcess.data.name,
            definition: selectedD3NodeToProcess.data.definition || '',
        };

        const geminiPrompt = `Dada a seguinte informação de um nó de mapa mental:
Nome: "${nodeContent.name}"
Definição: "${nodeContent.definition}"

Por favor, gere um array JSON de até 5 nós filhos relacionados a este conteúdo. Cada nó filho deve ter um "name" (título curto) e uma "definition" (breve explicação). O idioma deve ser português.
A estrutura deve ser estritamente:
[
    { "name": "Nome do Nó Filho 1", "definition": "Breve explicação do nó filho 1." },
    { "name": "Nome do Nó Filho 2", "definition": "Breve explicação do nó filho 2." }
]
Garanta que a resposta seja APENAS o array JSON, sem nenhum texto extra ou formatação de markdown (como \`\`\`json).`;

        try {
            await navigator.clipboard.writeText(geminiPrompt);
            alert('Prompt copiado para a área de transferência!');
        } catch (err) {
            console.error('Falha ao copiar o prompt: ', err);
            alert('Erro ao copiar o prompt. Por favor, copie manualmente.');
        }
    }

    async pasteJsonAndCreateChildren() {
        if (!this.currentSelectedD3Node) {
            alert('Por favor, selecione um nó para adicionar os filhos.');
            return;
        }

        const selectedD3NodeToProcess = this.currentSelectedD3Node;

        try {
            const clipboardText = await navigator.clipboard.readText();
            if (!clipboardText) {
                alert('A área de transferência está vazia ou o conteúdo não é texto.');
                return;
            }

            let parsedJson;
            try {
                parsedJson = JSON.parse(clipboardText);
            } catch (parseError) {
                console.warn("Falha ao parsear JSON diretamente, tentando extrair entre chaves/colchetes.", parseError);
                let resultText = clipboardText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
                const firstChar = resultText.indexOf('{');
                const firstArrayChar = resultText.indexOf('[');
                let startIndex = -1;
                let endIndex = -1;

                if (firstArrayChar !== -1 && (firstChar === -1 || firstArrayChar < firstChar)) {
                    startIndex = firstArrayChar;
                    endIndex = resultText.lastIndexOf(']');
                } else if (firstChar !== -1) {
                    startIndex = firstChar;
                    endIndex = resultText.lastIndexOf('}');
                }

                if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                    resultText = resultText.substring(startIndex, endIndex + 1);
                    parsedJson = JSON.parse(resultText);
                } else {
                    throw new Error('Não foi possível extrair um JSON válido da área de transferência.');
                }
            }

            if (!Array.isArray(parsedJson)) {
                throw new Error('O conteúdo colado não é um array JSON válido.');
            }

            if (!selectedD3NodeToProcess.data.children) {
                selectedD3NodeToProcess.data.children = [];
            }

            parsedJson.forEach(newChild => {
                if (newChild.name && newChild.definition) {
                    selectedD3NodeToProcess.data.children.push({
                        name: newChild.name,
                        definition: newChild.definition,
                        children: []
                    });
                } else {
                    console.warn('Objeto JSON inválido encontrado, pulando:', newChild);
                }
            });

            if (parsedJson.length === 0) {
                alert('A área de transferência contém um JSON válido, mas nenhum nó foi criado.');
                return;
            }

            await this.recalculateMap();
            alert('Nós adicionados com sucesso a partir da área de transferência!');
            this.closePopUp();

        } catch (error) {
            console.error('Erro ao colar e criar nós:', error);
            alert(`Ocorreu um erro ao colar o conteúdo da área de transferência: ${error.message}.`);
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

        await this.drawMindMap();

        let nodeGroupToFocus = null;
        for (const [d3Node, nodeGroup] of this.nodeMap.entries()) {
            if (d3Node.data === nodeDataToFocus) {
                nodeGroupToFocus = nodeGroup;
                break;
            }
        }

        if (nodeGroupToFocus) {
            this._focusCameraOnNode(nodeGroupToFocus);
        }

        this.toggleEditMode(field, false);
    }

    async addChildNode() {
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

        await this.recalculateMap();

        let newD3ChildNode = null;
        this.d3RootNode.each(d3Node => {
            if (d3Node.data === newChildData) {
                newD3ChildNode = d3Node;
            }
        });

        if (newD3ChildNode) {
            const newNodeGroup = this.nodeMap.get(newD3ChildNode);
            if (newNodeGroup) {
                this._focusCameraOnNode(newNodeGroup);
                this.currentSelectedD3Node = newD3ChildNode;
                this.openPopUp(newD3ChildNode.data.name, newD3ChildNode.data.definition || 'Nenhuma explicação disponível.');
            }
        }

        setTimeout(() => {
            this.closePopUp();
        }, 100);
    }

    /**
     * Exibe ou oculta o overlay de carregamento.
     * @param {boolean} show - True para mostrar, false para ocultar.
     */
    showLoadingOverlay(show) {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Adiciona nós filhos ao nó selecionado usando a API Gemini.
     */
    async addChildrenWithAI() {
        if (!this.currentSelectedD3Node || this.currentSelectedD3Node.depth === 0) {
            alert('Por favor, selecione um nó (não o nó principal) para adicionar filhos com IA.');
            return;
        }

        const selectedD3NodeToProcess = this.currentSelectedD3Node;
        const nodeContent = {
            name: selectedD3NodeToProcess.data.name,
            definition: selectedD3NodeToProcess.data.definition || '',
        };

        this.closePopUp();
        this.showLoadingOverlay(true);

        const API_KEY = localStorage.getItem('geminiApiKey');
        if (!API_KEY) {
            this.showLoadingOverlay(false);
            alert('Por favor, insira sua chave de API do Google AI Studio na página de criação de novo mapa com IA (acessível pelo nó principal ou menu superior).');
            return;
        }

        const geminiPrompt = `Dada a seguinte informação de um nó de mapa mental:
        Nome: "${nodeContent.name}"
        Definição: "${nodeContent.definition}"

        Por favor, gere um array JSON de até 5 nós filhos relacionados a este conteúdo. Cada nó filho deve ter um "name" (título curto) e uma "definition" (breve explicação). O idioma deve ser português.
        A estrutura deve ser estritamente:
        [
            { "name": "Nome do Nó Filho 1", "definition": "Breve explicação do nó filho 1." },
            { "name": "Nome do Nó Filho 2", "definition": "Breve explicação do nó filho 2." }
        ]
        Garanta que a resposta seja APENAS o array JSON, sem nenhum texto extra ou formatação de markdown (como \`\`\`json).`;

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: geminiPrompt }] }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro na API do Gemini: ${errorData.error.message || response.statusText}`);
            }

            const data = await response.json();
            let resultText = data.candidates[0].content.parts[0].text;

            let parsedJson;
            try {
                resultText = resultText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
                parsedJson = JSON.parse(resultText);
            } catch (parseError) {
                console.warn("Falha ao parsear JSON diretamente, tentando extrair entre chaves/colchetes.", parseError);
                const firstChar = resultText.indexOf('{');
                const firstArrayChar = resultText.indexOf('[');
                let startIndex = -1;
                let endIndex = -1;

                if (firstArrayChar !== -1 && (firstChar === -1 || firstArrayChar < firstChar)) {
                    startIndex = firstArrayChar;
                    endIndex = resultText.lastIndexOf(']');
                } else if (firstChar !== -1) {
                    startIndex = firstChar;
                    endIndex = resultText.lastIndexOf('}');
                }

                if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                    resultText = resultText.substring(startIndex, endIndex + 1);
                    parsedJson = JSON.parse(resultText);
                } else {
                    throw new Error('Não foi possível extrair um JSON válido da resposta da IA.');
                }
            }

            if (!Array.isArray(parsedJson)) {
                throw new Error('A resposta da IA não é um array JSON válido de nós filhos.');
            }

            if (!selectedD3NodeToProcess.data.children) {
                selectedD3NodeToProcess.data.children = [];
            }
            parsedJson.forEach(newChild => {
                if (newChild.name && newChild.definition) {
                    selectedD3NodeToProcess.data.children.push({
                        name: newChild.name,
                        definition: newChild.definition,
                        children: []
                    });
                }
            });

            await this.recalculateMap();
            alert('Novos nós adicionados com sucesso pela IA!');

        } catch (error) {
            console.error('Erro ao adicionar nós com IA:', error);
            alert(`Ocorreu um erro ao gerar novos nós com IA: ${error.message}.`);
        } finally {
            this.showLoadingOverlay(false);
        }
    }


    exportJsonToMarkdownPage() {
        const storedData = localStorage.getItem('mindMapData');
        if (storedData) {
            try {
                sessionStorage.setItem('markdownData', storedData);
                window.location.href = 'json2md.html';
            } catch (error) {
                console.error('Error preparing data for Markdown:', error);
                alert('An error occurred while preparing data for Markdown export.');
            }
        } else {
            alert('No mind map data found to create Markdown.');
        }
    }

    /**
     * Recalculates the mind map positions using the D3 algorithm,
     * clearing any previously persisted manual positions.
     */
    async recalculateMap() {
        this.d3RootNode.each(d3Node => {
            if (d3Node.data.persistedX !== undefined) {
                delete d3Node.data.persistedX;
            }
            if (d3Node.data.persistedY !== undefined) {
                delete d3Node.data.persistedY;
            }
        });
        await this.drawMindMap();
    }

    /**
     * Deleta o nó selecionado e todos os seus filhos do mapa mental.
     */
    async deleteSelectedNode() {
        if (!this.currentSelectedD3Node) {
            alert('Por favor, selecione um nó para excluir.');
            return;
        }

        if (this.currentSelectedD3Node.depth === 0) {
            alert('Não é possível excluir o nó raiz do mapa mental.');
            return;
        }

        const confirmDelete = confirm(`Tem certeza que deseja excluir o nó "${this.currentSelectedD3Node.data.name}" e todos os seus filhos?`);
        if (!confirmDelete) {
            return;
        }

        const d3NodeToDelete = this.currentSelectedD3Node;
        const parentD3Node = d3NodeToDelete.parent;

        if (parentD3Node && parentD3Node.data.children) {
            parentD3Node.data.children = parentD3Node.data.children.filter(
                child => child !== d3NodeToDelete.data
            );

            if (parentD3Node.data.children.length === 0) {
                delete parentD3Node.data.children;
            }
        }

        this.closePopUp();
        // O highlight e o rodapé serão limpos na próxima vez que o usuário interagir, mas
        // é uma boa prática limpá-los agora que o nó não existe mais.
        if (this.highlightedNode) {
            this.highlightedLine.material.color.set(CONFIG.wireframeColor);
            this.highlightedNode = null;
            this.highlightedLine = null;
        }
        this.nodeInfoFooter.classList.remove('visible');

        await this.recalculateMap();
        alert('Nó e seus filhos excluídos com sucesso.');
    }

    /**
     * Loads mind map data from a specified JSON file.
     * @param {string} filename - The name of the JSON file to load.
     */
    _loadMindMapFromFile(filename) {
        fetch(filename)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                this.data = data;
                localStorage.setItem('mindMapData', JSON.stringify(this.data));
                this.drawMindMap();
                this.closePopUp();
            })
            .catch(error => {
                console.error(`Error loading mind map data from ${filename}:`, error);
                this.container.innerHTML = `<p style="color: red;">Error loading mind map from ${filename}.</p>`;
            });
    }

    // --- Animation Loop ---
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const mindmapContainer = document.getElementById('mindmap-container');
    if (!mindmapContainer) {
        console.error("Mind map container not found.");
        return;
    }

    const storedData = localStorage.getItem('mindMapData');
    const viewer = new MindMapViewer(mindmapContainer, {});

    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            viewer.data = data;
            viewer.drawMindMap();
        } catch (error) {
            console.error('Failed to parse mind map data from localStorage:', error);
            viewer._loadMindMapFromFile('mindmap.json');
        }
    } else {
        viewer._loadMindMapFromFile('mindmap.json');
    }
});