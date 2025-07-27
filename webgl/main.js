import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { hierarchy, tree } from 'd3-hierarchy';

// --- 1. CONFIGURAÇÃO BÁSICA ---
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

// --- CONTROLES DE CÂMERA ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false; // Desabilita a rotação 3D
controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,   // Arrastar com o botão esquerdo
    MIDDLE: THREE.MOUSE.DOLLY, // Zoom com o scroll
    RIGHT: THREE.MOUSE.PAN    // Arrastar com o botão direito
};

// --- FUNÇÕES DE CRIAÇÃO (HELPERS) ---
function createTextTexture(message, fontSize, fontFace) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontSize}px ${fontFace}`;
    const textMetrics = context.measureText(message);

    // Medidas com uma pequena folga
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

    const rectGeo = new THREE.PlaneGeometry(textWidth + 36, textHeight + 10);
    const rectMat = new THREE.MeshBasicMaterial({ color: 0x4e5166 });
    const rectMesh = new THREE.Mesh(rectGeo, rectMat);

    const textGeo = new THREE.PlaneGeometry(textWidth, textHeight);
    const textMat = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.z = 0.1;

    nodeGroup.add(rectMesh);
    nodeGroup.add(textMesh);
    nodeGroup.position.set(nodeData.y, -nodeData.x, 0);

    mainGroup.add(nodeGroup);
}

function createLink(linkData) {
    const start = new THREE.Vector3(linkData.source.y, -linkData.source.x, 0);
    const end = new THREE.Vector3(linkData.target.y, -linkData.target.x, 0);

    const controlPoint1 = new THREE.Vector3((start.x + end.x) / 2, start.y, 0);
    const controlPoint2 = new THREE.Vector3((start.x + end.x) / 2, end.y, 0);

    const curve = new THREE.CubicBezierCurve3(start, controlPoint1, controlPoint2, end);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x4e5166, linewidth: 2 });

    const curveObject = new THREE.Line(geometry, material);
    mainGroup.add(curveObject);
}


// --- LÓGICA PRINCIPAL DE RENDERIZAÇÃO ---
function drawMindMap() {
    // Limpa o grupo principal para redesenhar, se necessário
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

    const nodes = root.descendants();
    const links = root.links();

    links.forEach(createLink);
    nodes.forEach(createNode);

    const box = new THREE.Box3().setFromObject(mainGroup);
    const center = box.getCenter(new THREE.Vector3());
    mainGroup.position.sub(center);
}

// --- LOOP DE ANIMAÇÃO ---
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Necessário para os controles da câmera
    renderer.render(scene, camera);
}

// Espera as fontes estarem prontas e então desenha o mapa
document.fonts.ready.then(() => {
    drawMindMap();
    animate();
});