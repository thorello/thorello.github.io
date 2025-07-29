// menuHandler.js

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('action-menu-container');
    const toggleButton = document.getElementById('menu-toggle-button');

    if (menuContainer && toggleButton) {
        // Abre/fecha o menu ao clicar no botão de toggle
        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Impede que o clique feche o menu imediatamente
            menuContainer.classList.toggle('open');
        });

        // Fecha o menu se clicar em qualquer lugar fora dele
        document.addEventListener('click', (event) => {
            if (!menuContainer.contains(event.target)) {
                menuContainer.classList.remove('open');
            }
        });
    } else {
        console.warn("Menu elements (action-menu-container or menu-toggle-button) not found. Menu functionality may be limited.");
    }
});