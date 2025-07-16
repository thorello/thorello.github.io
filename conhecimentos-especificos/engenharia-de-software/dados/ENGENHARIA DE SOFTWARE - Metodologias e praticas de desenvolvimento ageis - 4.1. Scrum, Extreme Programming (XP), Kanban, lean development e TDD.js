todosOsDados.push({
    tituloPrincipal: "Metodologias e práticas de desenvolvimento ágeis - 4.1. Scrum, Extreme Programming (XP), Kanban, lean development e TDD",
    conceitos: [
        {
            id: 1,
            titulo: "Scrum",
            teoria: `
                <p><strong>Scrum</strong> é um framework ágil para gerenciamento de projetos complexos, baseado em iterações chamadas <strong>Sprints</strong> (tipicamente 2-4 semanas). Seus pilares são:</p>
                <ul>
                    <li><strong>Transparência</strong> (artefatos visíveis como Product Backlog, Sprint Backlog e Incremento).</li>
                    <li><strong>Inspeção</strong> (reuniões como Daily Scrum, Sprint Review e Retrospective).</li>
                    <li><strong>Adaptação</strong> (ajuste contínuo do processo).</li>
                </ul>
                <p><strong>Papéis essenciais</strong>: Product Owner (prioriza o backlog), Scrum Master (facilita o processo) e Development Team (auto-organizável).</p>
                <p><strong>Pegadinhas Cebraspe</strong>:</p>
                <ul>
                    <li>Scrum NÃO é um método, mas um framework (não prescritivo).</li>
                    <li>O Scrum Master não é um gerente, mas um "servant leader".</li>
                    <li>O Incremento deve ser <strong>potencialmente entregável</strong> ao final de cada Sprint.</li>
                </ul>`,
            analogiaPokemon: `Scrum é como uma equipe Pokémon em uma liga: <strong>Product Owner</strong> é o Treinador (define a estratégia), <strong>Scrum Master</strong> é o Nurse Joy (remove obstáculos), <strong>Development Team</strong> são os Pokémon (auto-organizáveis), e <strong>Sprints</strong> são as batalhas de ginásio (ciclos curtos com objetivos claros).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No Scrum, o Product Owner é responsável por garantir que a equipe de desenvolvimento siga rigorosamente as práticas do framework, enquanto o Scrum Master prioriza os itens do Product Backlog com base no valor de negócio."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva <strong>inverte os papéis</strong> do Product Owner e Scrum Master: o Product Owner prioriza o Backlog (não o Scrum Master), e o Scrum Master atua como facilitador, não como fiscalizador. A maldade está na troca sutil de responsabilidades, típica da Cebraspe."
            }
        },
        {
            id: 2,
            titulo: "Extreme Programming (XP)",
            teoria: `
                <p><strong>XP</strong> é uma metodologia ágil focada em <strong>qualidade técnica</strong> e <strong>feedback rápido</strong>. Principais práticas:</p>
                <ul>
                    <li><strong>Programação em Pares</strong>: Dois desenvolvedores em uma máquina.</li>
                    <li><strong>TDD (Test-Driven Development)</strong>: Escrever testes antes do código.</li>
                    <li><strong>Integração Contínua</strong>: Código integrado várias vezes ao dia.</li>
                    <li><strong>Cliente no Local</strong>: Presença contínua do cliente no time.</li>
                </ul>
                <p><strong>Nuances Cebraspe</strong>:</p>
                <ul>
                    <li>XP é mais prescritivo que Scrum (exige práticas técnicas específicas).</li>
                    <li><strong>Valores fundamentais</strong>: Coragem, Simplicidade, Feedback, Respeito e Comunicação (não confundir com os pilares do Scrum).</li>
                </ul>`,
            analogiaPokemon: `XP é como treinar um Pikachu: <strong>Programação em Pares</strong> = Dois treinadores ensinando Thunderbolt, <strong>TDD</strong> = Treinar com um dummy que só aceita golpes perfeitos, <strong>Cliente no Local</strong> = Professor Oak dando feedback imediato.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O Extreme Programming (XP) preconiza que a fase de testes deve ocorrer apenas após a conclusão de todas as funcionalidades do sistema, garantindo assim uma avaliação mais abrangente do produto final."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "O erro está em ignorar o <strong>TDD</strong> e a <strong>Integração Contínua</strong>, que são centrais no XP. Na XP, os testes são escritos <strong>antes</strong> do código e executados continuamente. A Cebraspe tenta confundir com modelos tradicionais (como Cascata)."
            }
        },
        {
            id: 3,
            titulo: "Kanban",
            teoria: `
                <p><strong>Kanban</strong> é um método ágil de <strong>gestão visual do fluxo de trabalho</strong>, usando um quadro com colunas (ex.: "To Do", "Doing", "Done"). Princípios:</p>
                <ul>
                    <li><strong>Visualizar o trabalho</strong>: Cartões representam tarefas.</li>
                    <li><strong>Limitar WIP (Work in Progress)</strong>: Evita sobrecarga da equipe.</li>
                    <li><strong>Melhorar continuamente</strong> (Kaizen).</li>
                </ul>
                <p><strong>Diferenças para Scrum</strong>:</p>
                <ul>
                    <li>Kanban não tem Sprints ou papéis fixos.</li>
                    <li>Scrum é iterativo; Kanban é contínuo.</li>
                </ul>
                <p><strong>Pegadinha</strong>: Kanban pode ser usado com Scrum (Scrumban).</p>`,
            analogiaPokemon: `Kanban é como organizar a Pokédex: cartões são Pokémon, colunas = "Selvagem", "Em Batalha", "Capturado". <strong>Limite de WIP</strong> = Só batalhar com 3 Pokémon por vez.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No Kanban, assim como no Scrum, é obrigatória a divisão do trabalho em iterações fixas (Sprints) e a realização de cerimônias como Daily Stand-up Meetings."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Kanban <strong>não tem iterações fixas</strong> nem cerimônias obrigatórias. A assertiva tenta equiparar Kanban a Scrum, ignorando que Kanban é <strong>fluxo contínuo</strong>. O conhecimento necessário é a diferença entre frameworks iterativos (Scrum) e de fluxo (Kanban)."
            }
        },
        {
            id: 4,
            titulo: "Lean Development",
            teoria: `
                <p><strong>Lean</strong> vem da manufatura (Toyota) e foca em <strong>eliminar desperdícios</strong> no desenvolvimento de software. Princípios:</p>
                <ul>
                    <li><strong>Eliminar desperdícios</strong>: Ex.: funcionalidades não usadas, burocracia excessiva.</li>
                    <li><strong>Ampliar aprendizado</strong>: Feedback rápido e prototipação.</li>
                    <li><strong>Decidir o mais tarde possível</strong>: Flexibilidade para mudanças.</li>
                    <li><strong>Entregar o mais rápido possível</strong>.</li>
                </ul>
                <p><strong>Cebraspe gosta de</strong>: Confundir Lean com Agile (Lean é um precursor, mas não é sinônimo).</p>`,
            analogiaPokemon: `Lean é como criar um time competitivo: <strong>Eliminar desperdícios</strong> = Não treinar ataques inúteis, <strong>Feedback rápido</strong> = Batalhar contra líderes de ginásio, <strong>Decidir tarde</strong> = Não evoluir um Eevee até saber qual forma é necessária.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O Lean Development defende que todas as decisões de arquitetura do sistema devem ser tomadas no início do projeto, para evitar retrabalho e garantir estabilidade."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Lean prega <strong>decisões tardias</strong> (princípio 3), justamente para adaptar-se a mudanças. A assertiva tenta associar Lean a planejamento rígido (Cascata), uma pegadinha clássica."
            }
        },
        {
            id: 5,
            titulo: "TDD (Test-Driven Development)",
            teoria: `
                <p><strong>TDD</strong> é uma prática de desenvolvimento onde <strong>testes são escritos antes do código</strong>. Ciclo <strong>Red-Green-Refactor</strong>:</p>
                <ul>
                    <li><strong>Red</strong>: Escreve um teste que falha (para uma funcionalidade não existente).</li>
                    <li><strong>Green</strong>: Implementa o mínimo de código para o teste passar.</li>
                    <li><strong>Refactor</strong>: Melhora o código sem quebrar o teste.</li>
                </ul>
                <p><strong>Pontos-chave Cebraspe</strong>:</p>
                <ul>
                    <li>TDD <strong>não é</strong> sobre testar mais, mas sobre <strong>desenhar o código via testes</strong>.</li>
                    <li>Diferente de testes tradicionais (que validam código pronto).</li>
                </ul>`,
            analogiaPokemon: `TDD é como criar um novo Pokémon: <strong>Red</strong> = Definir que ele deve vencer um Charizard (teste impossível), <strong>Green</strong> = Dar a ele um ataque tipo Água (mínimo para vencer), <strong>Refactor</strong> = Melhorar o ataque para ser eficaz contra outros tipos.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No TDD, os testes são elaborados após a implementação do código-fonte, com o objetivo de documentar as funcionalidades já desenvolvidas e facilitar a manutenção futura."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva descreve <strong>testes tradicionais</strong>, não TDD. O cerne do TDD é que os testes <strong>guiem</strong> o desenvolvimento, não documentem. A Cebraspe explora a confusão entre TDD e testes de regressão."
            }
        }
    ]
});