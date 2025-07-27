import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { hierarchy, tree } from 'd3-hierarchy';
import createText from 'three-bmfont-text';
import loadBMFont from 'load-bmfont';

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

// --- 2. VARIÁVEIS PARA INTERAÇÃO (sem alterações) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;
let d3Data = {};

// --- 3. VARIÁVEIS DA FONTE BMFont (sem alterações) ---
let font;
const fontUrl = 'https://unpkg.com/roboto-bmfont/roboto-msdf.fnt';
const textureUrl = 'https://unpkg.com/roboto-bmfont/roboto-msdf.png';
let fontTexture;

// --- 4. FUNÇÕES DE CRIAÇÃO E ATUALIZAÇÃO (sem alterações) ---
function createNode(nodeData) {
    const nodeGroup = new THREE.Group();
    const text = nodeData.data.name;
    const textGeometry = createText({
        text: text,
        font: font,
        align: 'center',
        width: Infinity,
        lineHeight: font.common.lineHeight
    });
    const textMaterial = new THREE.MeshBasicMaterial({
        map: fontTexture,
        transparent: true,
        color: 0xffffff
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.geometry.computeBoundingBox();
    const textWidth = textMesh.geometry.boundingBox.max.x - textMesh.geometry.boundingBox.min.x;
    const textHeight = textMesh.geometry.boundingBox.max.y - textMesh.geometry.boundingBox.min.y;
    textMesh.position.set(-textWidth / 2, -textHeight / 2, 0.1);

    const padding = 18;
    const rectWidth = textWidth + 2 * padding;
    const rectHeight = textHeight + 2 * padding;
    const rectGeo = new THREE.PlaneGeometry(rectWidth, rectHeight);
    const rectMat = new THREE.MeshBasicMaterial({ color: 0x4e5166 });
    const rectMesh = new THREE.Mesh(rectGeo, rectMat);
    rectMesh.name = "node_background";

    nodeGroup.add(rectMesh);
    nodeGroup.add(textMesh);
    nodeGroup.position.set(nodeData.y, -nodeData.x, 0);
    nodeGroup.userData.d3Node = nodeData;
    nodeData.threeObject = nodeGroup;
    mainGroup.add(nodeGroup);
    return nodeGroup;
}

function createLink(linkData) {
    const curveObject = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0x4e5166, linewidth: 2 })
    );
    curveObject.userData.d3Link = linkData;
    mainGroup.add(curveObject);
    updateLinkGeometry(curveObject);
    return curveObject;
}

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

// --- 5. LÓGICA DE EVENTOS DO MOUSE (LÓGICA CORRIGIDA) ---

function onPointerDown(event) {
    if (selectedObject) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(mainGroup.children, true);

    if (intersects.length > 0) {
        // **AQUI ESTAVA O ERRO CORRIGIDO**
        // A linha abaixo estava com um erro de digitação, impedindo a execução do resto do código.
        let firstIntersected = intersects[0].object;

        // Se o clique foi no fundo de um nó...
        if (firstIntersected.name === "node_background") {
            // ...define o nó como o objeto selecionado para arrastar.
            selectedObject = firstIntersected.parent;
            // **E o mais importante: desabilita os controles da câmera.**
            controls.enabled = false;
        }
    }
}

function onPointerMove(event) {
    // Esta função só faz algo se um nó estiver selecionado.
    if (selectedObject) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);
        selectedObject.position.copy(intersectPoint);

        // Atualiza as linhas conectadas ao nó.
        d3Data.links.forEach(link => {
            if (link.userData.d3Link.source === selectedObject.userData.d3Node ||
                link.userData.d3Link.target === selectedObject.userData.d3Node) {
                updateLinkGeometry(link);
            }
        });
    }
    // Se nenhum nó estiver selecionado, os controles da câmera (se estiverem habilitados)
    // farão o trabalho de mover a tela.
}

function onPointerUp() {
    // Ao soltar o clique, limpa a seleção.
    selectedObject = null;
    // **E sempre reabilita os controles da câmera**, para que o arraste da tela volte a funcionar.
    controls.enabled = true;
}

window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);


// --- 6. LÓGICA PRINCIPAL DE RENDERIZAÇÃO (sem alterações) ---
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
    const nodes = root.descendants();
    const links = root.links();
    const threeNodes = nodes.map(node => createNode(node));
    const threeLinks = links.map(link => createLink(link));
    d3Data = { nodes: threeNodes, links: threeLinks };
    const box = new THREE.Box3().setFromObject(mainGroup);
    const center = box.getCenter(new THREE.Vector3());
    mainGroup.position.sub(center);
}

// --- 7. CARREGAMENTO DA FONTE E INICIALIZAÇÃO (sem alterações) ---
loadBMFont(fontUrl, function (err, f) {
    if (err) {
        console.error('Erro ao carregar a fonte BMFont:', err);
        return;
    }
    font = f;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureUrl, function (texture) {
        fontTexture = texture;
        fontTexture.needsUpdate = true;
        drawMindMap();
        animate();
    });
});

// --- 8. LOOP DE ANIMAÇÃO (sem alterações) ---
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}