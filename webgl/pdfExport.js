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
    const linkColorHex = '#' + new THREE.Color(CONFIG.linkColor).getHexString();
    doc.setDrawColor(linkColorHex);

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

        const textColorHex = '#' + new THREE.Color(CONFIG.textColor).getHexString();
        const fontSize = CONFIG.font.size * scale;

        doc.setTextColor(textColorHex);
        doc.setFontSize(fontSize);
        doc.setFont("helvetica");

        let textAlign = 'center';
        let textX = nodePos.x;
        const paddingX = CONFIG.padding.x * scale;

        if (nodeGroup.userData.direction === 1) {
            textAlign = 'left';
            textX = rectX + paddingX;
        } else if (nodeGroup.userData.direction === -1) {
            textAlign = 'right';
            textX = rectX + rectWidth - paddingX;
        }

        const textContent =
            (textMesh && textMesh.text) ||
            (nodeGroup.userData?.d3Node?.data?.name) ||
            'No text available';

        doc.text(textContent, textX, nodePos.y, {
            align: textAlign,
            baseline: 'middle'
        });
    });

    doc.save('mapa-mental.pdf');
    console.log("Exportação para PDF concluída. ✨");
}