// pdfExport.js
import * as THREE from 'three';
// jsPDF já deve estar disponível globalmente se carregado via CDN no HTML
// Se estiver usando um bundler, você instalaria e importaria:
// import { jsPDF } from 'jspdf'; 

/**
 * Exporta o mapa mental atual para um arquivo PDF.
 * @param {Map<any, THREE.Group>} nodeMap - Mapa de nós d3 para objetos THREE.Group.
 * @param {Array<THREE.Line>} linkObjects - Array de objetos THREE.Line que representam as conexões.
 * @param {object} CONFIG - O objeto de configuração com cores e tamanhos.
 * @param {THREE.Vector3} mainGroupPosition - A posição atual do mainGroup para calcular offsets.
 */
export function exportMindMapToPDF(nodeMap, linkObjects, CONFIG, mainGroupPosition) {
    console.log("Iniciando exportação para PDF...");

    // Garante que jspdf está disponível
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        console.error("jsPDF não está carregado. Por favor, inclua a biblioteca jsPDF no seu HTML.");
        return;
    }
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
    });

    const tempBox = new THREE.Box3();
    nodeMap.forEach(nodeGroup => {
        tempBox.expandByObject(nodeGroup);
    });

    const size = new THREE.Vector3();
    tempBox.getSize(size);

    if (size.x === 0 || size.y === 0) {
        console.error("Não é possível exportar um mapa vazio.");
        return;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    const scaleX = (pageWidth - margin * 2) / size.x;
    const scaleY = (pageHeight - margin * 2) / size.y;
    const scale = Math.min(scaleX, scaleY);

    const pdfCenterX = pageWidth / 2;
    const pdfCenterY = pageHeight / 2;

    const contentCenterX = tempBox.getCenter(new THREE.Vector3()).x;
    const contentCenterY = tempBox.getCenter(new THREE.Vector3()).y;

    const transform = (point) => {
        const worldPointX = point.x + mainGroupPosition.x;
        const worldPointY = point.y + mainGroupPosition.y;

        const transformedX = (worldPointX - contentCenterX) * scale + pdfCenterX;
        const transformedY = (-worldPointY + contentCenterY) * scale + pdfCenterY;

        return { x: transformedX, y: transformedY };
    };

    doc.setLineWidth(0.5);

    // --- INÍCIO DA ALTERAÇÃO PARA CORES MAIS SUAVES NAS LINHAS DE LINK ---
    const originalLinkColor = new THREE.Color(CONFIG.linkColor);
    const hsl = { h: 0, s: 0, l: 0 }; // Objeto para armazenar os valores HSL
    originalLinkColor.getHSL(hsl); // Pega os valores HSL da cor original

    // Ajusta saturação e luminosidade para uma aparência mais suave
    // Reduz a saturação em 40% (multiplica por 0.6)
    const softerSaturation = Math.max(0, hsl.s * 0.6);
    // Aumenta a luminosidade em 10% (adiciona 0.1), garantindo que não ultrapasse 1
    const softerLightness = Math.min(1, hsl.l + 0.1);

    const softerLinkColor = new THREE.Color();
    softerLinkColor.setHSL(hsl.h, softerSaturation, softerLightness); // Cria a nova cor suave

    const softerLinkColorHex = '#' + softerLinkColor.getHexString();
    doc.setDrawColor(softerLinkColorHex); // Aplica a cor suave para as linhas
    // --- FIM DA ALTERAÇÃO ---

    linkObjects.forEach(linkObject => {
        const curve = linkObject.userData.curve;
        const start = transform(curve.v0);
        const cp1 = transform(curve.v1);
        const cp2 = transform(curve.v2);
        const end = transform(curve.v3);

        doc.path([
            { op: 'm', c: [start.x, start.y] },
            { op: 'c', c: [cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y] }
        ]).stroke();
    });

    nodeMap.forEach(nodeGroup => {
        const nodePos = transform(nodeGroup.position);

        const rectMesh = nodeGroup.children.find(c => c.type === 'Mesh' && c.geometry.type === 'ShapeGeometry');
        const textMesh = nodeGroup.children.find(c => c.name === 'nodeTextMesh');

        if (!rectMesh) return;

        const rectWidth = nodeGroup.userData.nodeWidth * scale;
        const rectHeight = nodeGroup.userData.nodeHeight * scale;
        const borderRadius = CONFIG.borderRadius * scale;

        const rectX = nodePos.x - rectWidth / 2;
        const rectY = nodePos.y - rectHeight / 2;

        const nodeColorHex = '#' + rectMesh.material.color.getHexString();
        doc.setFillColor(nodeColorHex);
        doc.setLineWidth(0.3);
        doc.setDrawColor("#CCCCCC");
        doc.roundedRect(rectX, rectY, rectWidth, rectHeight, borderRadius, borderRadius, 'FD');

        const fontSize = CONFIG.font.size * scale;

        let currentColorHex = '#' + new THREE.Color(CONFIG.textColor).getHexString();
        // Verifica se é o nó central (assumindo depth === 0 para o nó raiz D3)
        if (nodeGroup.userData?.d3Node?.depth === 0) {
            currentColorHex = '#FFFFFF'; // Define a cor do texto como branco para o nó central
        }
        doc.setTextColor(currentColorHex);

        doc.setFontSize(fontSize);
        doc.setFont("helvetica");

        const textX = nodePos.x; // Centro horizontal do nó
        const textY = nodePos.y; // Centro vertical do nó

        const textContent =
            (textMesh && textMesh.text) ||
            (nodeGroup.userData?.d3Node?.data?.name) ||
            'No text available';

        doc.text(textContent, textX, textY, {
            align: 'center',
            baseline: 'middle'
        });
    });

    doc.save('mapa-mental.pdf');
    console.log("Exportação para PDF concluída. ✨");
}