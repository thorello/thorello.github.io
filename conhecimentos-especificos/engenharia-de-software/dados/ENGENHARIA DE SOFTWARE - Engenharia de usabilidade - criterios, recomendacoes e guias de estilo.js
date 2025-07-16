todosOsDados.push({
    tituloPrincipal: "Engenharia de usabilidade - critérios, recomendações e guias de estilo",
    conceitos: [
        {
            id: 1,
            titulo: "Critérios de Usabilidade (Nielsen)",
            teoria: `
                <p>Os <strong>10 Heurísticos de Nielsen</strong> são princípios fundamentais para avaliação de usabilidade:</p>
                <ol>
                    <li><strong>Visibilidade do Status do Sistema</strong>: O usuário deve sempre saber o estado atual do sistema.</li>
                    <li><strong>Correspondência entre o Sistema e o Mundo Real</strong>: Use linguagem familiar ao usuário.</li>
                    <li><strong>Controle e Liberdade do Usuário</strong>: Opções claras para "desfazer" ou "sair".</li>
                    <li><strong>Consistência e Padrões</strong>: Mantenha convenções universais.</li>
                    <li><strong>Prevenção de Erros</strong>: Evite situações propícias a erros.</li>
                    <li><strong>Reconhecimento em vez de Memorização</strong>: Reduza a carga cognitiva.</li>
                    <li><strong>Flexibilidade e Eficiência de Uso</strong>: Atalhos para usuários experientes.</li>
                    <li><strong>Estética e Design Minimalista</strong>: Evite informação irrelevante.</li>
                    <li><strong>Recuperação de Erros</strong>: Mensagens claras e soluções sugeridas.</li>
                    <li><strong>Ajuda e Documentação</strong>: Ofereça ajuda contextualizada.</li>
                </ol>
                <p><strong>Nuance Cebraspe</strong>: Costuma confundir "Reconhecimento" (heurística 6) com "Memorização".</p>`,
            analogiaPokemon: `Uma Pokédex bem projetada segue os heurísticos: mostra HP em tempo real (visibilidade), pergunta "Tem certeza?" antes de fugir (prevenção de erros) e mantém botões consistentes.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Segundo Nielsen, a heurística de 'Memorização' prioriza a redução da necessidade de o usuário lembrar informações, substituindo-a por opções visíveis e acessíveis. Portanto, interfaces devem evitar totalmente o uso de atalhos de teclado, pois esses exigem memorização prévia."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao trocar 'Reconhecimento' por 'Memorização' (termo inexistente) e generalizar que atalhos devem ser evitados (na verdade, são incentivados pela heurística 7 - Flexibilidade). Pegadinha clássica: uso de termo falso e distorção de conceitos."
            }
        },
        {
            id: 2,
            titulo: "Guias de Estilo (Style Guides)",
            teoria: `
                <p><strong>Guias de Estilo</strong> padronizam decisões de design para garantir consistência:</p>
                <ul>
                    <li><strong>Elementos Visuais</strong>: Cores, tipografia, espaçamento.</li>
                    <li><strong>Componentes de UI</strong>: Botões, formulários, ícones.</li>
                    <li><strong>Regras de Interação</strong>: Uso de modais, tooltips.</li>
                    <li><strong>Voz e Tom</strong>: Linguagem (formal, técnica).</li>
                </ul>
                <p><strong>Nuance Cebraspe</strong>: Pode sugerir que guias são apenas visuais (errado: incluem interação e conteúdo).</p>`,
            analogiaPokemon: `O Manual do Ginásio Pokémon é um guia de estilo: uniformes com cores temáticas (ex.: Vermelho para Pewter), Pokébolas com mecanismo padronizado e frases como "Desafio aceito!".`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Guias de estilo são documentos essenciais para garantir a usabilidade, pois estabelecem padrões exclusivamente visuais, como cores e tipografia, sem abordar aspectos de interação ou conteúdo textual."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Erro ao limitar guias a aspectos visuais (ignorando interação e texto). A palavra-chave 'exclusivamente' é a pegadinha, já que guias são holísticos."
            }
        },
        {
            id: 3,
            titulo: "Leis de UX aplicadas à Usabilidade",
            teoria: `
                <p>Princípios psicológicos aplicados ao design:</p>
                <ul>
                    <li><strong>Lei de Fitts</strong>: Alvos grandes/próximos são mais rápidos de alcançar.</li>
                    <li><strong>Lei de Hick</strong>: Mais opções = maior tempo de decisão.</li>
                    <li><strong>Efeito Zeigarnik</strong>: Tarefas incompletas são mais memoráveis.</li>
                    <li><strong>Lei de Miller</strong>: Limite de 7±2 itens na memória de curto prazo.</li>
                </ul>
                <p><strong>Nuance Cebraspe</strong>: Pode trocar leis (ex.: atribuir Lei de Fitts à redução de opções).</p>`,
            analogiaPokemon: `Lei de Fitts: Snorlax bloqueando o caminho é fácil de acertar (alvo grande). Lei de Hick: Escolher entre 150 Pokémon no laboratório é mais lento que entre 3.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A Lei de Hick prevê que a velocidade de interação com um sistema é diretamente proporcional ao tamanho físico dos elementos de interface, como botões e ícones."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva descreve a Lei de Fitts (tamanho/proximidade), não a de Hick (número de opções). Pegadinha: troca sutil entre leis com nomes similares."
            }
        },
        {
            id: 4,
            titulo: "Testes de Usabilidade (Métodos)",
            teoria: `
                <p>Métodos de avaliação:</p>
                <ul>
                    <li><strong>Teste Moderado (Lab)</strong>: Facilitador guia o usuário (dados qualitativos).</li>
                    <li><strong>Teste Não Moderado (Remoto)</strong>: Usuário realiza tarefas sozinho (dados quantitativos).</li>
                    <li><strong>Think Aloud</strong>: Usuário verbaliza pensamentos.</li>
                    <li><strong>A/B Testing</strong>: Compara versões de interface.</li>
                </ul>
                <p><strong>Nuance Cebraspe</strong>: Pode confundir "moderado" (presencial) com "não moderado" (remoto).</p>`,
            analogiaPokemon: `Teste Moderado: Treinador observa Pokémon em batalha. A/B Testing: Comparar Pokébola vs. Great Ball para capturar Pikachu.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Testes de usabilidade não moderados são sempre mais eficazes que os moderados, pois eliminam viéses do facilitador e garantem resultados 100% objetivos."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Generalização indevida ('sempre mais eficazes'). Testes moderados são melhores para detalhes qualitativos. Pegadinha: ignorar que métodos têm objetivos distintos."
            }
        },
        {
            id: 5,
            titulo: "Acessibilidade x Usabilidade",
            teoria: `
                <ul>
                    <li><strong>Acessibilidade</strong>: Design inclusivo para deficiências (ex.: leitores de tela).</li>
                    <li><strong>Usabilidade</strong>: Facilidade de uso para todos.</li>
                </ul>
                <p><strong>Diferença-chave</strong>: Acessibilidade é um subconjunto da usabilidade, mas não são sinônimos.</p>`,
            analogiaPokemon: `Acessibilidade: Braille Pokédex para treinadores cegos. Usabilidade: Pokédex com ícones intuitivos para todos.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Acessibilidade e usabilidade são conceitos intercambiáveis, pois ambos visam garantir que sistemas sejam eficientes e eficazes para qualquer usuário, independentemente de suas limitações físicas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Erro ao afirmar que são 'intercambiáveis'. Acessibilidade foca em limitações específicas; usabilidade é geral. Pegadinha: uso de termos parecidos para induzir ao equívoco."
            }
        }
    ]
});