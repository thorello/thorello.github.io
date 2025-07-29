// jsonImport.js

/**
 * Handles the upload of a JSON file and imports the mind map data.
 * @param {Event} event The change event from the file input.
 * @param {function(object): void} callback A callback function to be called with the imported data.
 */
export function importMindMapFromJson(event, callback) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonContent = JSON.parse(e.target.result);

            console.log("JSON importado:", jsonContent);

            // Validate the JSON structure if necessary (e.g., check for 'name' property)
            if (!jsonContent || typeof jsonContent.name !== 'string') {
                alert("O arquivo JSON não parece ser um mapa mental válido. Ele deve ter uma propriedade 'name' no nível raiz.");
                return;
            }

            // Save to localStorage for consistency
            localStorage.setItem('mindMapData', JSON.stringify(jsonContent));

            // Call the provided callback with the imported data
            callback(jsonContent);
            alert("Mapa mental carregado com sucesso a partir do arquivo JSON!");

        } catch (error) {
            console.error('Erro ao ler ou parsear o arquivo JSON:', error);
            alert('Erro ao carregar o arquivo JSON. Certifique-se de que é um JSON válido.');
        }
        // Clear the file input value to allow uploading the same file again
        event.target.value = '';
    };
    reader.onerror = (e) => {
        console.error("Erro ao ler o arquivo:", e);
        alert("Erro ao ler o arquivo. Por favor, tente novamente.");
    };
    reader.readAsText(file);
}