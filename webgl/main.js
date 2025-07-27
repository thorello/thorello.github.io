import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { hierarchy, tree } from 'd3-hierarchy';

// --- 1. CONFIGURAÇÃO BÁSICA (sem alterações) ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1f1f1f);

const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / -2,
    1, 1000
);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const mainGroup = new THREE.Group();
scene.add(mainGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
};

// --- 2. VARIÁVEIS PARA INTERAÇÃO (NOVO) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;
let d3Data = {}; // Para armazenar os dados do D3 (nós e links)

// --- 3. FUNÇÕES DE CRIAÇÃO E ATUALIZAÇÃO ---

// A função createTextTexture não muda
function createTextTexture(message, fontSize, fontFace) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontSize}px ${fontFace}`;
    const textMetrics = context.measureText(message);
    const canvasWidth = textMetrics.width + 4;
    const canvasHeight = fontSize * 1.5;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.font = `${fontSize}px ${fontFace}`;
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(message, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
}

function createNode(nodeData) {
    const nodeGroup = new THREE.Group();
    const textTexture = createTextTexture(nodeData.data.name, 20, 'Roboto');
    const textWidth = textTexture.image.width;
    const textHeight = textTexture.image.height;

    // Adicionamos um nome ao retângulo para facilitar a identificação no raycast
    const rectGeo = new THREE.PlaneGeometry(textWidth + 36, textHeight + 10);
    const rectMat = new THREE.MeshBasicMaterial({ color: 0x4e5166 });
    const rectMesh = new THREE.Mesh(rectGeo, rectMat);
    rectMesh.name = "node_background"; // Identificador

    const textGeo = new THREE.PlaneGeometry(textWidth, textHeight);
    const textMat = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.z = 0.1;

    nodeGroup.add(rectMesh);
    nodeGroup.add(textMesh);
    nodeGroup.position.set(nodeData.y, -nodeData.x, 0);

    // Guardando a referência dos dados do D3 no objeto do Three.js
    nodeGroup.userData.d3Node = nodeData;
    nodeData.threeObject = nodeGroup; // E vice-versa

    mainGroup.add(nodeGroup);
    return nodeGroup;
}

// ATUALIZADO: A função createLink agora retorna o objeto da linha
function createLink(linkData) {
    const curveObject = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0x4e5166, linewidth: 2 })
    );

    // Guardando os dados do link no objeto do Three.js
    curveObject.userData.d3Link = linkData;
    mainGroup.add(curveObject);

    // Atualiza a geometria da linha
    updateLinkGeometry(curveObject);
    return curveObject;
}

// NOVO: Função para atualizar a geometria de uma linha específica
function updateLinkGeometry(linkObject) {
    const linkData = linkObject.userData.d3Link;
    const start = linkData.source.threeObject.position;
    const end = linkData.target.threeObject.position;

    const controlPoint1 = new THREE.Vector3((start.x + end.x) / 2, start.y, 0);
    const controlPoint2 = new THREE.Vector3((start.x + end.x) / 2, end.y, 0);

    const curve = new THREE.CubicBezierCurve3(start, controlPoint1, controlPoint2, end);
    const points = curve.getPoints(50);

    linkObject.geometry.setFromPoints(points);
    linkObject.geometry.verticesNeedUpdate = true;
}

// --- 4. LÓGICA DE EVENTOS DO MOUSE (NOVO) ---

function onPointerDown(event) {
    // Se já estiver arrastando algo, ignore
    if (selectedObject) return;

    // Converte a posição do mouse para coordenadas normalizadas (-1 a +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(mainGroup.children, true);

    if (intersects.length > 0) {
        // Pega o primeiro objeto intersectado
        let firstIntersected = intersects[0].object;

        // Verifica se clicamos no fundo de um nó e pega o grupo (o nó inteiro)
        if (firstIntersected.name === "node_background") {
            selectedObject = firstIntersected.parent;

            // Desabilita os controles da câmera para não competir com o drag
            controls.enabled = false;
        }
    }
}

function onPointerMove(event) {
    if (selectedObject) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Cria um plano invisível no Z=0 para calcular a posição do mouse no mundo
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);

        // Atualiza a posição do nó
        selectedObject.position.copy(intersectPoint);

        // Atualiza todos os links conectados a este nó
        d3Data.links.forEach(link => {
            if (link.userData.d3Link.source === selectedObject.userData.d3Node ||
                link.userData.d3Link.target === selectedObject.userData.d3Node) {
                updateLinkGeometry(link);
            }
        });
    }
}

function onPointerUp() {
    // Solta o objeto e reabilita os controles da câmera
    selectedObject = null;
    controls.enabled = true;
}

// Adicionando os listeners de eventos
window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);


// --- 5. LÓGICA PRINCIPAL DE RENDERIZAÇÃO ---
function drawMindMap() {
    while (mainGroup.children.length > 0) {
        mainGroup.remove(mainGroup.children[0]);
    }

    const mindMapData = {
        name: "Elastic Stack (ELK)",
        children: [
            { name: "Visão Geral", children: [{ name: "Definição" }, { name: "Casos de Uso" }] },
            { name: "Elasticsearch", children: [{ name: "Índice Invertido" }, { name: "Arquitetura" }] },
            { name: "Logstash" },
            { name: "Kibana e Dashboards" }
        ]
    };

    const root = hierarchy(mindMapData);
    const treeLayout = tree().nodeSize([120, 350]);
    treeLayout(root);

    // Armazenando os nós e links para referência futura
    const nodes = root.descendants();
    const links = root.links();

    // Criamos os nós PRIMEIRO para que os links possam obter suas posições
    const threeNodes = nodes.map(node => createNode(node));
    const threeLinks = links.map(link => createLink(link));

    d3Data = { nodes: threeNodes, links: threeLinks };

    const box = new THREE.Box3().setFromObject(mainGroup);
    const center = box.getCenter(new THREE.Vector3());
    mainGroup.position.sub(center);
}

// --- 6. LOOP DE ANIMAÇÃO ---
function animate() {
    requestAnimationFrame(animate);
    // Não precisamos mais do `controls.update()` aqui, a menos que
    // queiramos efeitos como "damping" (amortecimento)
    renderer.render(scene, camera);
}

document.fonts.ready.then(() => {
    drawMindMap();
    animate();
});