// jsonExport.js

/**
 * Exports the current mind map data to a JSON file.
 * The data is retrieved from localStorage.
 */
export function exportMindMapToJson() {
    const storedData = localStorage.getItem('mindMapData');
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            const jsonString = JSON.stringify(parsedData, null, 2); // Formats with 2 spaces indentation

            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'mindmap_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Cleans up the object URL
            alert('Mapa mental exportado para mindmap_data.json!');
        } catch (error) {
            console.error('Erro ao parsear ou exportar JSON:', error);
            alert('Ocorreu um erro ao exportar o JSON. Verifique o console para mais detalhes.');
        }
    } else {
        alert('Nenhum dado do mapa mental encontrado para exportar.');
    }
}