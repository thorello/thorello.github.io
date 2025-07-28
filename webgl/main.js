import * as THREE from 'three';
import { hierarchy, tree } from 'd3-hierarchy';
import { Text } from 'troika-three-text';

// NEW: Updated program version.
const APP_VERSION = 'v1.1.1 - Bilateral text alignment fix'; // Updated to reflect the new style and fix

// --- 1. CENTRALIZED CONFIGURATIONS (MODERN STYLE) ---
const CONFIG = {
    backgroundColor: 0x0F111A, // Very dark blue, almost black for a modern background
    nodeColors: [
        0x334466, // Soft petrol blue (Base)
        0x556688, // Medium blue
        0x7788AA, // Light grayish blue
        0x99AABB, // Very light grayish blue
        0xF9A825, // Vibrant yellow/orange for highlight or depth (if using more than 4 levels)
        0x4CAF50  // Soft green for another level (if using more than 5 levels)
    ],
    linkColor: 0x81D4FA, // Light blue, vibrant and modern
    dragHandleColor: 0xFFFFFF, // Pure white for subtlety
    textColor: 0xFFFFFF, // Pure white for maximum contrast
    font: {
        size: 16, // Slightly larger for better readability
    },
    padding: { x: 20, y: 10 }, // Slightly increase internal node padding
    borderRadius: 12, // More rounded corners for a softer touch
    dragHandleRadius: 6, // Slightly smaller and more discreet
    zoom: {
        speed: 0.2, // Zoom speed for mouse wheel and pinch (adjustable)
        min: 0.05,  // Allows more zoom out (further away)
        max: 8,     // Allows more zoom in (closer)
    }
};

/**
 * Geometry for a rectangle with rounded corners.
 * @param {number} width - Width of the rectangle.
 * @param {number} height - Height of the rectangle.
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

        // --- State ---
        this.nodeMap = new Map();
        this.linkObjects = [];
        this.dragHandles = [];
        this.selectedNode = null;
        this.offset = new THREE.Vector3();
        this.isDraggingNode = false;
        // NEW: Stores the initial intersection point for displacement calculation
        this.initialIntersectionPoint = new THREE.Vector3();

        // --- State Variables for Custom Camera Control ---
        this.isPanning = false; // Indicates if the user is dragging the scene
        this.lastPointerPosition = new THREE.Vector2(); // Last pointer position for pan calculation

        // Variables for touch control (pinch-to-zoom)
        this._isPinching = false;
        this.initialPinchDistance = 0; // Distance between the two touches at the start of pinch
        this.initialPinchZoom = 1; // Camera zoom at the start of pinch
        this.pinchCenterWorld = new THREE.Vector3(); // Pinch center point in world coordinates

        // NEW: Variables to differentiate tap from drag on touch
        this.initialTouchCoords = new THREE.Vector2(); // Stores the initial touch position
        this.isConsideredClick = true; // Flag to determine if the touch sequence was a click
        this.tapThreshold = 5; // Movement threshold in pixels to consider a drag instead of a click/tap

        // Sidebar elements (assuming they exist in your HTML)
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

    // --- INITIALIZATION METHODS ---

    _initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.backgroundColor);

        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2,
            1, 1000
        );
        this.camera.position.z = 150; // Default camera position
        this.camera.zoom = 1; // Initial camera zoom

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
        this.renderer.domElement.addEventListener('wheel', this._onMouseWheel.bind(this), { passive: false }); // Mouse wheel zoom

        // TOUCH EVENTS (FOR PAN AND PINCH ZOOM)
        this.renderer.domElement.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
        this.renderer.domElement.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });

        // NODE CLICK LISTENER (MAINTAINED FOR DESKTOP, BUT MOBILE TAPS ARE HANDLED IN _onTouchEnd)
        this.renderer.domElement.addEventListener('click', this._onNodeClick.bind(this));


        // Sidebar close button listener
        if (this.sidebarCloseButton) {
            this.sidebarCloseButton.addEventListener('click', this.closeSidebar.bind(this));
        }
    }

    _createVersionInfo() {
        // Ensure the version-info div exists in the HTML
        const versionElement = document.getElementById('version-info');
        if (versionElement) {
            versionElement.textContent = `Mind Map ${APP_VERSION}`;
            // No need to set styles here if they are already in CSS
        } else {
            console.warn("Element with id 'version-info' not found. Version info will not be displayed.");
        }
    }


    // --- CREATION AND UPDATE LOGIC ---

    /**
     * NEW: Creates the mesh of a node based on direction (left/right/center).
     * @param {object} d3Node - The D3 data node.
     * @param {number} direction - -1 for left, 1 for right, 0 for the root node.
     * @returns {Promise<THREE.Group>}
     */
    _createNodeMesh(d3Node, direction) {
        return new Promise(resolve => {
            const nodeGroup = new THREE.Group();
            // NEW: Stores the direction and d3 data in the group's userData.
            nodeGroup.userData = { d3Node: d3Node, isNode: true, direction: direction };

            const nodeColor = CONFIG.nodeColors[d3Node.depth % CONFIG.nodeColors.length];
            const textMesh = new Text();
            textMesh.text = d3Node.data.name;
            textMesh.fontSize = CONFIG.font.size;
            textMesh.color = CONFIG.textColor;
            textMesh.position.z = 0.1; // Slightly in front of the rectangle

            // NEW: Sets text alignment based on direction.
            // Left: text aligned to the right. Right: text aligned to the left. Root: text centered.
            textMesh.anchorX = direction === -1 ? 'right' : (direction === 1 ? 'left' : 'center');
            textMesh.anchorY = 'middle';

            textMesh.sync(() => {
                const bounds = textMesh.textRenderInfo.bounds;
                const textWidth = bounds ? bounds.x[1] - bounds.x[0] : d3Node.data.name.length * (CONFIG.font.size * 0.6);
                const textHeight = bounds ? bounds.y[1] - bounds.y[0] : CONFIG.font.size * 1.2;

                const rectWidth = textWidth + CONFIG.padding.x * 2;
                const rectHeight = textHeight + CONFIG.padding.y * 2;

                // The rectangle geometry is now created with its center at (0,0), facilitating positioning.
                const rectGeo = createRoundedRectGeometry(rectWidth, rectHeight, CONFIG.borderRadius);
                const rectMat = new THREE.MeshBasicMaterial({ color: nodeColor });
                const rectMesh = new THREE.Mesh(rectGeo, rectMat);
                nodeGroup.add(rectMesh); // The rectangle stays at the group's origin.

                // NEW: Text position is adjusted within the padding, depending on the direction.
                if (direction === 1) { // Right side: text aligned left, so its left edge is at -rectWidth/2 + padding
                    textMesh.position.x = -rectWidth / 2 + CONFIG.padding.x;
                } else if (direction === -1) { // Left side: text aligned right, so its right edge is at rectWidth/2 - padding
                    textMesh.position.x = rectWidth / 2 - CONFIG.padding.x;
                } else { // Root/Center
                    textMesh.position.x = 0;
                }

                nodeGroup.add(textMesh);
                nodeGroup.userData.nodeWidth = rectWidth; // Total node width.

                // NEW: The Drag Handle is created only for non-root nodes and positioned on the correct side.
                if (direction !== 0) {
                    const handleGeo = new THREE.CircleGeometry(CONFIG.dragHandleRadius, 32);
                    const handleMat = new THREE.MeshBasicMaterial({ color: CONFIG.dragHandleColor, transparent: true, opacity: 0.6 });
                    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
                    // Position on the outer edge of the node.
                    handleMesh.position.set((rectWidth / 2) * direction, 0, 0.2);
                    handleMesh.userData = { isDragHandle: true, nodeGroup };

                    nodeGroup.add(handleMesh);
                    this.dragHandles.push(handleMesh);
                }

                this.nodeMap.set(d3Node, nodeGroup); // Maps the data node to the Three.js object
                resolve(nodeGroup);
            });
        });
    }

    /**
     * NEW: Creates the connection line mesh based on the direction of the nodes.
     * @param {object} linkData - D3 link object.
     */
    _createLinkMesh(linkData) {
        const sourceNodeGroup = this.nodeMap.get(linkData.source);
        const targetNodeGroup = this.nodeMap.get(linkData.target);

        if (!sourceNodeGroup || !targetNodeGroup) return;

        const sourceDir = sourceNodeGroup.userData.direction;
        const targetDir = targetNodeGroup.userData.direction;

        // Start point: edge of the parent node.
        const start = sourceNodeGroup.position.clone();
        if (sourceDir !== 0) { // If parent is not root, connection leaves from outer edge.
            start.x += (sourceNodeGroup.userData.nodeWidth / 2) * sourceDir;
        } else { // If it's the root, connection leaves from the edge corresponding to the child's direction.
            start.x += (sourceNodeGroup.userData.nodeWidth / 2) * targetDir;
        }

        // End point: edge of the child node.
        const end = targetNodeGroup.position.clone();
        end.x -= (targetNodeGroup.userData.nodeWidth / 2) * targetDir; // Connection enters the inner edge.

        // Control points for a smooth curve (Bezier).
        // Adjusts the control point to create an S or C curve
        let controlPoint1 = new THREE.Vector3();
        let controlPoint2 = new THREE.Vector3();

        if (sourceDir === 0 && targetDir !== 0) { // From root to a child (bilateral)
            controlPoint1.set(start.x + (end.x - start.x) / 2, start.y, 0);
            controlPoint2.set(end.x - (end.x - start.x) / 2, end.y, 0);
        } else { // Between nodes on the same side
            controlPoint1.set(start.x + 50 * sourceDir, start.y, 0); // Extends horizontally from parent
            controlPoint2.set(end.x - 50 * targetDir, end.y, 0);  // Extends horizontally from child
        }


        const curve = new THREE.CubicBezierCurve3(start, controlPoint1, controlPoint2, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: CONFIG.linkColor,
            linewidth: 3,
            transparent: true,
            opacity: 0.4
        });

        const curveObject = new THREE.Line(geometry, material);
        curveObject.userData = { linkData };

        this.linkObjects.push(curveObject);
        this.mainGroup.add(curveObject);
    }

    /**
     * NEW: Updates connection lines when a node is dragged.
     */
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

                // Recalculate control points
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
            }
        }
    }

    /**
     * NEW: Moves a node and all its child nodes (subtree).
     * @param {THREE.Group} nodeGroup - The THREE.js group of the node to be moved.
     * @param {THREE.Vector3} deltaPosition - The displacement vector.
     */
    _moveSubtree(nodeGroup, deltaPosition) {
        // Move the parent node
        nodeGroup.position.add(deltaPosition);

        // Recursively move all children
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


    // --- MAIN LOGIC ---

    /**
     * NEW: Completely restructured drawing logic for the bilateral layout.
     */
    async drawMindMap() {
        // Limpeza da cena (código existente)
        while (this.mainGroup.children.length) {
            this.mainGroup.remove(this.mainGroup.children[0]);
        }
        this.nodeMap.clear();
        this.linkObjects = [];
        this.dragHandles = [];

        const root = hierarchy(this.data);
        const d3Links = root.links(); // Links podem ser definidos aqui

        // --- NOVA LÓGICA DE LAYOUT SIMÉTRICO ---

        const originalChildren = root.children || [];
        if (originalChildren.length > 0) {
            const horizontalSpacing = 450;
            const verticalSpacing = 50;
            const treeLayout = tree().nodeSize([verticalSpacing, horizontalSpacing]);

            // 1. Dividir os filhos do nó raiz
            const leftCount = Math.ceil(originalChildren.length / 2);
            const leftChildren = originalChildren.slice(0, leftCount);
            const rightChildren = originalChildren.slice(leftCount);

            // 2. Processar o lado esquerdo
            if (leftChildren.length > 0) {
                root.children = leftChildren; // Define temporariamente os filhos da esquerda
                treeLayout(root); // Executa o layout SÓ para a esquerda
                // Marca a direção em todos os descendentes da esquerda
                root.descendants().forEach(node => {
                    if (node.depth > 0) {
                        node.userData = { ...node.userData, assignedDirection: -1 };
                    }
                });
            }

            // 3. Processar o lado direito
            if (rightChildren.length > 0) {
                root.children = rightChildren; // Define temporariamente os filhos da direita
                treeLayout(root); // Executa o layout SÓ para a direita
                // Marca a direção em todos os descendentes da direita
                root.descendants().forEach(node => {
                    if (node.depth > 0) {
                        node.userData = { ...node.userData, assignedDirection: 1 };
                    }
                });
            }

            // 4. Restaura os filhos e define a direção do nó raiz
            root.children = originalChildren;
        }
        root.userData = { ...root.userData, assignedDirection: 0 };

        // Agora `root.descendants()` contém todos os nós com as coordenadas corretas e simétricas
        const d3Nodes = root.descendants();

        // --- FIM DA NOVA LÓGICA ---

        // Criação dos meshes dos nós (código existente)
        const nodeCreationPromises = d3Nodes.map(d3Node => {
            const direction = d3Node.userData.assignedDirection;
            return this._createNodeMesh(d3Node, direction);
        });
        await Promise.all(nodeCreationPromises);

        // Posicionamento dos nós (código existente, agora funciona corretamente)
        d3Nodes.forEach(d3Node => {
            const nodeGroup = this.nodeMap.get(d3Node);
            if (!nodeGroup) return;

            if (d3Node.depth === 0) {
                nodeGroup.position.set(0, 0, 0);
            } else {
                const direction = nodeGroup.userData.direction;
                // d3Node.y é a "profundidade" horizontal
                // d3Node.x é a posição vertical, agora calculada simetricamente
                const posX = d3Node.y * direction;
                const posY = d3Node.x;

                // Ajuste para alinhar a borda do nó, não o centro
                const nodeWidth = nodeGroup.userData.nodeWidth || 0;
                const finalNodeX = posX + (nodeWidth / 2) * direction;

                nodeGroup.position.set(finalNodeX, posY, 0);
            }
            this.mainGroup.add(nodeGroup);
        });

        // Criação das conexões (código existente)
        d3Links.forEach(link => this._createLinkMesh(link));

        // Centralização do mapa (código existente)
        const box = new THREE.Box3().setFromObject(this.mainGroup);
        const center = box.getCenter(new THREE.Vector3());
        this.mainGroup.position.sub(center);

        this.camera.updateProjectionMatrix();
    }

    // --- EVENT HANDLERS (CUSTOM CONTROLS) ---

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
        event.preventDefault(); // Prevent page scroll

        if (this.isSidebarOpen) {
            return; // If sidebar is open, ignore zoom event
        }

        // 1. Mouse position in NDC (Normalized Device Coordinates)
        this.mouse.copy(this._getPointerCoordinates(event));

        // 2. Convert mouse NDC position to World Coordinates BEFORE zoom
        const worldPosBeforeZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0);
        worldPosBeforeZoom.unproject(this.camera);

        // 3. Calculate the new zoom factor
        const zoomExponent = event.deltaY * -0.01 * CONFIG.zoom.speed;
        let newZoom = this.camera.zoom * Math.pow(2, zoomExponent);

        // 4. Apply zoom limits
        newZoom = Math.max(CONFIG.zoom.min, Math.min(CONFIG.zoom.max, newZoom));

        // 5. Apply the new zoom to the camera
        this.camera.zoom = newZoom;
        this.camera.updateProjectionMatrix();

        // 6. Convert mouse NDC position to World Coordinates AFTER zoom
        const worldPosAfterZoom = new THREE.Vector3(this.mouse.x, this.mouse.y, 0);
        worldPosAfterZoom.unproject(this.camera);

        // 7. Calculate the necessary displacement (pan) to keep the point under the mouse fixed
        const panDelta = new THREE.Vector3().subVectors(worldPosBeforeZoom, worldPosAfterZoom);

        // 8. Apply the displacement to the camera's position
        this.camera.position.add(panDelta);
    }

    _onMouseDown(event) {
        if (this.isSidebarOpen || event.button !== 0) { // Check if it's the left mouse button
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

                const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // XY plane at Z=0
                this.raycaster.ray.intersectPlane(plane, this.initialIntersectionPoint); // Store initial intersection point

                // The offset is now from the initial intersection point to the node's position
                this.offset.copy(this.initialIntersectionPoint).sub(this.selectedNode.position);
                this.isPanning = false; // Deactivate camera pan if dragging a node
            }
        } else {
            // If no handle was clicked, start camera pan
            this.isDraggingNode = false;
            this.isPanning = true;
            this.lastPointerPosition.set(event.clientX, event.clientY); // Store initial pointer position on screen
        }
    }

    _onMouseMove(event) {
        if (this.isSidebarOpen) {
            return;
        }

        if (this.isDraggingNode && this.selectedNode) {
            // Logic to drag the node and its children
            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);

            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const currentIntersectionPoint = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(plane, currentIntersectionPoint);

            // Calculate the delta movement
            const delta = new THREE.Vector3().subVectors(currentIntersectionPoint, this.initialIntersectionPoint);

            // Move the entire subtree by the delta
            this._moveSubtree(this.selectedNode, delta);

            // Update the initial intersection point for the next frame
            this.initialIntersectionPoint.copy(currentIntersectionPoint);

            this.updateLinks();
        } else if (this.isPanning) {
            // Logic for camera pan
            const deltaX = event.clientX - this.lastPointerPosition.x;
            const deltaY = event.clientY - this.lastPointerPosition.y;

            // Pan speed should be scaled by the inverse of the current camera zoom.
            const panSpeed = 1 / this.camera.zoom;

            this.camera.position.x -= deltaX * panSpeed;
            this.camera.position.y += deltaY * panSpeed; // World Y is inverted relative to screen Y

            this.lastPointerPosition.set(event.clientX, event.clientY); // Update last position
        }
    }

    _onMouseUp() {
        this.selectedNode = null;
        this.isDraggingNode = false;
        this.isPanning = false; // End camera pan
    }

    _onTouchStart(event) {
        if (this.isSidebarOpen) {
            return;
        }

        event.preventDefault(); // Prevent default behavior (scroll, etc.)

        this.isConsideredClick = true; // Assume it's a click/tap initially

        if (event.touches.length === 1) {
            this.initialTouchCoords.set(event.touches[0].clientX, event.touches[0].clientY); // Store initial touch position for tap detection

            // Try to drag node (priority) or pan camera
            this.mouse.copy(this._getPointerCoordinates(event));
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.dragHandles);

            if (intersects.length > 0) {
                const handle = intersects[0].object;
                if (handle.userData.isDragHandle) {
                    this.selectedNode = handle.userData.nodeGroup;
                    this.isDraggingNode = true;

                    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                    this.raycaster.ray.intersectPlane(plane, this.initialIntersectionPoint); // Store initial intersection point

                    this.offset.copy(this.initialIntersectionPoint).sub(this.selectedNode.position);
                    this.isPanning = false; // Deactivate pan if dragging node
                }
            } else {
                // If no handle, start camera pan
                this.isDraggingNode = false;
                this.isPanning = true;
                this.lastPointerPosition.set(event.touches[0].clientX, event.touches[0].clientY);
            }
        } else if (event.touches.length === 2) {
            // Start pinch-to-zoom gesture
            this.isDraggingNode = false; // Deactivate node drag
            this.isPanning = false; // Deactivate one-finger pan
            this._isPinching = true;
            this.isConsideredClick = false; // Two fingers means it's not a click

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
        if (this.isSidebarOpen) {
            return;
        }

        event.preventDefault();

        if (this.isConsideredClick && event.touches.length === 1) {
            const moveDistance = Math.hypot(
                event.touches[0].clientX - this.initialTouchCoords.x,
                event.touches[0].clientY - this.initialTouchCoords.y
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
            this.initialIntersectionPoint.copy(currentIntersectionPoint); // Update for next move
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
        if (this.isConsideredClick) {
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
        this.isConsideredClick = true;
    }

    _onNodeClick(event) {
        if (this.isDraggingNode || this.isPanning || this._isPinching || event.button !== 0) {
            return;
        }

        this.mouse.copy(this._getPointerCoordinates(event));
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.mainGroup.children, true);

        let clickedNode = null;
        for (const intersect of intersects) {
            // Traverse up the hierarchy to find the node group, but stop if it's a drag handle.
            let currentObject = intersect.object;
            while (currentObject) {
                if (currentObject.userData.isDragHandle) {
                    clickedNode = null; // Ignore clicks on drag handle
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
            this.openSidebar(d3NodeData.name, d3NodeData.explanation || 'Nenhuma explicação disponível para este tópico.');
        } else if (this.isSidebarOpen) {
            this.closeSidebar();
        }
    }

    // --- SIDEBAR METHODS ---
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

    // --- ANIMATION LOOP ---
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}


// --- MIND MAP DATA ---
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
        }, {
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




    ]
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // By default, the container is the body. If you have a specific container (e.g., <div id="mindmap-container">), change it here.
    const mindmapContainer = document.getElementById('mindmap-container');
    if (mindmapContainer) {
        new MindMapViewer(mindmapContainer, mindMapData);
    } else {
        console.error("Mind map container not found. Please ensure an element with id 'mindmap-container' exists in your HTML.");
    }
});
