// script.js (Versão final com todas as funcionalidades)

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DA PÁGINA ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarNav = document.getElementById('sidebar-nav');
    // Agora temos 2 títulos para gerenciar
    const mainTitleDesktop = document.getElementById('main-title-desktop');
    const mainTitleMobile = document.getElementById('main-title-mobile');
    const conceptsContainer = document.getElementById('concepts-container');
    const pageNav = document.getElementById('page-nav');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');

    // --- VARIÁVEIS DE ESTADO ---
    let flatConcepts = [];
    let currentConceptIndex = -1;

    // --- FUNÇÕES DE CONTROLE ---

    // Atualiza o estado dos botões de navegação (ativo/desativado)
    const updateNavButtons = () => {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (!prevBtn || !nextBtn) return;

        prevBtn.disabled = currentConceptIndex === 0;
        nextBtn.disabled = currentConceptIndex === flatConcepts.length - 1;
    };

    // Define qual módulo (menu e grupo de conteúdo) está visível
    const switchTopicView = (topicIndex) => {
        // Atualiza ambos os títulos
        const titleText = todosOsDados[topicIndex].tituloPrincipal;
        mainTitleDesktop.textContent = titleText;
        mainTitleMobile.textContent = titleText;

        document.querySelectorAll('.menu-section').forEach((section, index) => {
            const contentGroup = document.getElementById(`content-group-${index}`);
            section.classList.toggle('collapsed', index !== topicIndex);
            contentGroup.classList.toggle('hidden', index !== topicIndex);
            section.querySelector('.caret').textContent = (index === topicIndex) ? '▼' : '►';
        });
    };

    // Define o card ativo, o link destacado e atualiza os botões
    const setActiveCard = (conceptIndex) => {
        if (conceptIndex < 0 || conceptIndex >= flatConcepts.length) return;

        currentConceptIndex = conceptIndex;
        const activeConcept = flatConcepts[conceptIndex];

        // Garante que o módulo correto está visível
        switchTopicView(activeConcept.topicIndex);

        // Mostra o card correto
        document.querySelectorAll('.concept-card').forEach(card => card.classList.add('hidden'));
        document.getElementById(activeConcept.cardId).classList.remove('hidden');

        // Atualiza o link ativo
        sidebarNav.querySelectorAll('a').forEach(a => a.classList.remove('active-link'));
        activeConcept.linkElement.classList.add('active-link');

        updateNavButtons();

        // Rola a página suavemente, exceto na carga inicial
        if (document.body.dataset.initialLoad !== "true") {
            document.getElementById(activeConcept.cardId).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // --- GERAÇÃO DA PÁGINA ---

    // 1. Gera o HTML e preenche a lista mestra `flatConcepts`
    todosOsDados.forEach((dadosEstudo, topicIdx) => {
        const menuSection = document.createElement('li');
        menuSection.className = 'menu-section';
        menuSection.id = `menu-section-${topicIdx}`;
        menuSection.dataset.index = topicIdx;

        const title = document.createElement('h2');
        title.className = 'menu-title';
        title.innerHTML = `${dadosEstudo.tituloPrincipal} <span class="caret">▼</span>`;
        menuSection.appendChild(title);

        const linksList = document.createElement('ul');
        linksList.className = 'menu-links';
        menuSection.appendChild(linksList);
        sidebarNav.appendChild(menuSection);

        const contentGroup = document.createElement('div');
        contentGroup.className = 'content-group hidden';
        contentGroup.id = `content-group-${topicIdx}`;
        conceptsContainer.appendChild(contentGroup);

        dadosEstudo.conceitos.forEach(conceito => {
            const uniqueId = `dados${topicIdx}-conceito${conceito.id}`;
            const navItem = document.createElement('li');
            const linkElement = document.createElement('a');
            linkElement.href = `#${uniqueId}`;
            linkElement.textContent = conceito.titulo;
            navItem.appendChild(linkElement);
            linksList.appendChild(navItem);

            // Adiciona à nossa lista mestra
            flatConcepts.push({
                cardId: uniqueId,
                linkElement: linkElement,
                topicIndex: topicIdx
            });

            const article = document.createElement('article');
            article.id = uniqueId;
            article.className = 'concept-card hidden'; // Começam escondidos
            const gabaritoClass = `gabarito-${conceito.analise.gabarito.toLowerCase()}`;
            article.innerHTML = `
                <h3>${conceito.titulo}</h3>
                <h4>TEORIA-ALVO</h4>
                ${conceito.teoria}
                <h4>ANALOGIA POKÉMON</h4>
                <p>${conceito.analogiaPokemon}</p>
                <h4>ASSERTIVA DE PROVA</h4>
                <blockquote>${conceito.assertiva.fonte}<br>${conceito.assertiva.texto}</blockquote>
                <button class="toggle-answer-btn">Mostrar Análise</button>
                <div class="analysis-block ${gabaritoClass}">
                    <h4>GABARITO: ${conceito.analise.gabarito}</h4>
                    <h4>Análise do Examinador</h4>
                    <p>${conceito.analise.explicacao}</p>
                </div>
            `;
            contentGroup.appendChild(article);
        });
    });

    // 2. Cria os botões de navegação
    pageNav.innerHTML = `
        <button id="prev-btn" title="Conteúdo Anterior">←</button>
        <button id="next-btn" title="Próximo Conteúdo">→</button>
    `;

    // --- LÓGICA DE EVENTOS ---

    // Clique no botão de menu "hamburger"
    menuToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-hidden');
        // Alterna o ícone do botão
        if (sidebar.classList.contains('sidebar-hidden')) {
            menuToggleBtn.textContent = '☰'; // Ícone de menu
        } else {
            menuToggleBtn.textContent = '✕'; // Ícone de fechar
        }
    });

    // Cliques na barra lateral
    sidebarNav.addEventListener('click', (event) => {
        document.body.dataset.initialLoad = "false";

        const title = event.target.closest('.menu-title');
        if (title) { // Se clicou no título de um módulo, ativa o primeiro item
            const topicIdx = parseInt(title.parentElement.dataset.index, 10);
            const firstConceptOfTopic = flatConcepts.findIndex(c => c.topicIndex === topicIdx);
            setActiveCard(firstConceptOfTopic);
            return;
        }

        const link = event.target.closest('a');
        if (link) { // Se clicou em um link de conceito
            event.preventDefault();
            const conceptIdx = flatConcepts.findIndex(c => c.linkElement === link);
            setActiveCard(conceptIdx);

            // Fecha o menu automaticamente em telas pequenas após clicar em um link
            if (window.innerWidth <= 900 && !sidebar.classList.contains('sidebar-hidden')) {
                sidebar.classList.add('sidebar-hidden');
                menuToggleBtn.textContent = '☰';
            }
        }
    });

    // Cliques nos botões de navegação Próximo/Anterior
    pageNav.addEventListener('click', (event) => {
        document.body.dataset.initialLoad = "false";
        if (event.target.id === 'next-btn') {
            setActiveCard(currentConceptIndex + 1);
        } else if (event.target.id === 'prev-btn') {
            setActiveCard(currentConceptIndex - 1);
        }
    });

    // Lógica para o botão "Mostrar Análise"
    conceptsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('toggle-answer-btn')) {
            const analysisBlock = event.target.nextElementSibling;
            if (analysisBlock) {
                const isVisible = analysisBlock.classList.toggle('visible');
                event.target.textContent = isVisible ? 'Ocultar Análise' : 'Mostrar Análise';
            }
        }
    });

    // --- ESTADO INICIAL ---
    if (flatConcepts.length > 0) {
        document.body.dataset.initialLoad = "true";
        setActiveCard(0);
        // Garante que o menu comece fechado em telas pequenas
        if (window.innerWidth <= 900) {
            sidebar.classList.add('sidebar-hidden');
        }
    }
});