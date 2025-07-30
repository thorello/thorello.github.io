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

        // Fecha o menu se clicar em qualquer lugar fora dele (para mouse)
        document.addEventListener('click', (event) => {
            if (!menuContainer.contains(event.target)) {
                menuContainer.classList.remove('open');
            }
        });

        // Fecha o menu se tocar em qualquer lugar fora dele (para touch)
        // Usar { passive: true } para otimização em eventos de toque, já que não estamos chamando preventDefault()
        document.addEventListener('touchstart', (event) => {
            if (!menuContainer.contains(event.target)) {
                menuContainer.classList.remove('open');
            }
        }, { passive: true });

        // --- Nova lógica para fechar o menu ao clicar em um item ---
        // Seleciona todos os botões e rótulos dentro do #menu-content
        const menuItems = menuContainer.querySelectorAll('#menu-content button, #menu-content label');

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuContainer.classList.remove('open');
            });
        });

    } else {
        console.warn("Menu elements (action-menu-container or menu-toggle-button) not found. Menu functionality may be limited.");
    }
});