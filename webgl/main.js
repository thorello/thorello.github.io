import * as THREE from 'three';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';
import { exportMindMapToPDF } from './pdfExport.js';
import { exportMindMapToJson } from './jsonExport.js';
import { importMindMapFromJson } from './jsonImport.js';
import './menuHandler.js';

const APP_VERSION = 'v2.0.0';

// --- 1. Centralized Configuration (Light Theme) ---
const CONFIG = {
    backgroundColor: 0xF4F4F5,
    nodeColors: [
        0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF
    ],
    linkColor: 0x4B5563,
    dragHandleColor: 0x111827,
    textColor: 0x111827,
    font: {
        size: 16,
        characterWidth: 0.5,
    },
    padding: { x: 30, y: 10 },
    borderRadius: 6,
    dragHandleRadius: 6,
    zoom: {
        speed: 0.2,
        min: 0.05,
        max: 8,
    },
    horizontalNodePadding: 0,
    verticalNodeSpacing: 80,
    depth1HorizontalOffset: 80,
    FIXED_NODE_CHARACTER_LIMIT: 35,
    FIXED_NODE_HEIGHT_MULTIPLIER: 2.5,
};

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
        this.aiNewMapButtonContainer = document.getElementById('ai-new-map-button-container');

        // --- State Variables ---
        this.nodeMap = new Map();
        this.linkObjects = [];
        this.dragHandles = [];
        this.selectedNode = null;
        this.offset = new THREE.Vector3();
        this.isDraggingNode = false;
        this.initialIntersectionPoint = new THREE.Vector3();
        this.d3RootNode = null;
        this.currentSelectedD3Node = null; // For popUp

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

        this.addNodeButton = document.getElementById('add-node-button');

        this._initScene();
        this._initEventListeners();
        this._createVersionInfo();

        this.drawMindMap();
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

        if (this.addNodeButton) {
            this.addNodeButton.addEventListener('click', this.addChildNode.bind(this));
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

        const newMapButton = document.getElementById('new-map-button');
        if (newMapButton) {
            newMapButton.addEventListener('click', () => {
                localStorage.removeItem('mindMapData');
                this._loadDefaultMindMapData();
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

    // --- Node and Link Creation/Update Logic ---
    _createNodeMesh(d3Node, direction) {
        return new Promise(resolve => {
            const nodeGroup = new THREE.Group();
            nodeGroup.userData = { d3Node: d3Node, isNode: true, direction: direction };

            const isRootNode = d3Node.depth === 0;
            const rootNodeColor = 0x3498db;
            const rootTextColor = 0xFFFFFF;

            const nodeColor = isRootNode ? rootNodeColor : CONFIG.nodeColors.length > 0 ? CONFIG.nodeColors.slice().reverse()[d3Node.depth] : 0xFFFFFF;
            const textColor = isRootNode ? rootTextColor : CONFIG.textColor;

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
                const rectWidth = CONFIG.FIXED_NODE_WIDTH;
                const rectHeight = CONFIG.FIXED_NODE_HEIGHT;

                const rectGeo = createRoundedRectGeometry(rectWidth, rectHeight, CONFIG.borderRadius);
                const rectMat = new THREE.MeshBasicMaterial({ color: nodeColor });

                const rectMesh = new THREE.Mesh(rectGeo, rectMat);
                rectMesh.name = 'nodeRectMesh';
                nodeGroup.add(rectMesh);

                if (!isRootNode) {
                    const edges = new THREE.EdgesGeometry(rectGeo);
                    const lineMat = new THREE.LineBasicMaterial({ color: 0xCCCCCC, linewidth: 2 });
                    const wireframe = new THREE.LineSegments(edges, lineMat);
                    nodeGroup.add(wireframe);
                }

                textMesh.position.x = 0;

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

        this.camera.zoom = 1;
        this.camera.updateProjectionMatrix();
    }

    // --- Event Handlers ---
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
            if (clickedNode) {
                const d3Node = clickedNode.userData.d3Node;
                this.currentSelectedD3Node = d3Node;
                this.openPopUp(d3Node.data.name, d3Node.data.definition || 'Nenhuma explicação disponível.');
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
        if (this.isConsideredClick && !this._isPinching) {
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
        this.isDraggingNode = false;
        this.isPanning = false;
        this._isPinching = false;
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
     * Loads the default mind map data from mindmap.json.
     */
    _loadDefaultMindMapData() {
        fetch('mindmap.json')
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
                console.error('Error loading default mind map data:', error);
                this.container.innerHTML = '<p style="color: red;">Error loading mind map.</p>';
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

    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            new MindMapViewer(mindmapContainer, data);
        } catch (error) {
            console.error('Failed to parse mind map data from localStorage:', error);
            const viewer = new MindMapViewer(mindmapContainer, {});
            viewer._loadDefaultMindMapData();
        }
    } else {
        const viewer = new MindMapViewer(mindmapContainer, {});
        viewer._loadDefaultMindMapData();
    }
});