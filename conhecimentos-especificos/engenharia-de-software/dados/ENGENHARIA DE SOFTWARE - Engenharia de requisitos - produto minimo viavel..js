todosOsDados.push({
    tituloPrincipal: "Produto mínimo viável",
    conceitos: [
        {
            id: 1,
            titulo: "Produto Mínimo Viável (MVP)",
            teoria: `
                <p>O <strong>MVP (Minimum Viable Product)</strong> é uma versão inicial de um produto com funcionalidades essenciais, suficiente para validar hipóteses de mercado com o mínimo de esforço e custo.</p>
                <ul>
                    <li><strong>Foco em valor central</strong>: apenas features indispensáveis para resolver o problema principal.</li>
                    <li><strong>Validação com usuários reais</strong>: coleta de feedback para iterar antes de investir em complexidade.</li>
                    <li><strong>Diferente de protótipo ou POC</strong>: MVP é funcional e entregável, enquanto protótipos são experimentais e POCs validam viabilidade técnica.</li>
                    <li><strong>Riscos comuns</strong>: incluir funcionalidades demais ("feature creep") ou confundir MVP com produto final.</li>
                </ul>`,
            analogiaPokemon: `Imagine que o MVP é como um <strong>Bulbasauro no nível 1</strong>: tem apenas os ataques básicos (<em>Tackle</em> e <em>Growl</em>), mas já pode ser usado em batalhas simples para testar sua eficácia. Não faz sentido evoluí-lo para Venusaur ou adicionar movimentos complexos como <em>Solar Beam</em> antes de validar se ele resolve problemas básicos de combate.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O produto mínimo viável (MVP) deve conter todas as funcionalidades planejadas para a versão final do produto, ainda que em estágio rudimentar, pois sua principal finalidade é demonstrar a capacidade técnica da equipe de desenvolvimento."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao afirmar que o MVP deve incluir <strong>todas as funcionalidades planejadas</strong>. O MVP é justamente o oposto: foca no <strong>mínimo necessário</strong> para validar a proposta de valor com usuários, não em demonstrar capacidade técnica (isso seria uma POC). A 'maldade' está na confusão entre MVP e versão beta, além de ignorar o propósito de validação de mercado."
            }
        },
        {
            id: 2,
            titulo: "Validação de Hipóteses no MVP",
            teoria: `
                <p>A validação de hipóteses no MVP testa se:</p>
                <ol>
                    <li>O problema existe e é relevante para o público-alvo.</li>
                    <li>A solução proposta resolve o problema de forma aceitável.</li>
                </ol>
                <p><strong>Métodos comuns</strong>:</p>
                <ul>
                    <li><strong>Métricas quantitativas</strong>: taxa de conversão, retenção, tempo de uso.</li>
                    <li><strong>Feedback qualitativo</strong>: entrevistas, surveys, observação direta.</li>
                </ul>
                <p><strong>Armadilhas</strong>: ignorar dados contraditórios ou confiar apenas em opiniões de stakeholders.</p>`,
            analogiaPokemon: `É como usar um <strong>Pokédex</strong> para validar se um Pokémon raro (ex: <em>Mew</em>) realmente existe. Você não precisa capturá-lo (produto final), mas sim encontrar evidências (dados de avistamentos, pegadas) que comprovem sua existência (hipótese). Se ninguém relatou vê-lo, talvez seu "MVP" (busca inicial) precise ser repensado.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A validação de hipóteses em um MVP deve priorizar exclusivamente métricas quantitativas, como número de acessos e downloads, pois essas fornecem dados objetivos e imparciais sobre a aceitação do produto."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva peca ao <strong>generalizar</strong> que apenas métricas quantitativas são válidas. Dados qualitativos (ex: <em>por que</em> usuários abandonaram o produto) são essenciais para entender contextos não mensuráveis numericamente. A Cebraspe frequentemente troca 'exclusivamente' por 'prioritariamente' para induzir ao erro."
            }
        },
        {
            id: 3,
            titulo: "Iteração no MVP",
            teoria: `
                <p>Iteração é o processo de refinamento do MVP baseado em feedback, seguindo o ciclo <strong>Construir-Medir-Aprender</strong> (Lean Startup). Principais aspectos:</p>
                <ul>
                    <li><strong>Priorização</strong>: corrigir falhas críticas antes de adicionar novas features.</li>
                    <li><strong>Pivotar</strong>: mudar radicalmente a solução se a hipótese principal for invalidada.</li>
                    <li><strong>Erro comum</strong>: iterar sem direção clara, acumulando features sem validação.</li>
                </ul>`,
            analogiaPokemon: `É similar a treinar um <strong>Magikarp</strong>: inicialmente inútil (<em>Splash</em>), mas com feedbacks de batalhas (dados), você descobre se vale a pena evoluí-lo para Gyarados (pivotar) ou trocá-lo por um Pokémon mais adequado (ex: <em>Lapras</em>). Iterar sem estratégia seria insistir no Magikarp mesmo com derrotas consecutivas.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O processo de iteração do MVP deve ser interrompido tão logo o produto atinja uma taxa de retenção de usuários superior a 50%, pois isso indica que a versão final está pronta para lançamento em larga escala."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva comete dois erros:<br>1) <strong>Critério arbitrário</strong>: 50% de retenção não é universalmente suficiente; depende do contexto (ex: apps de nicho podem exigir mais).<br>2) <strong>Falsa conclusão</strong>: MVP NÃO é a versão final, mas uma etapa contínua de aprendizado. A 'pegadinha' típica da Cebraspe é usar porcentagens como verdades absolutas."
            }
        }
    ]
});