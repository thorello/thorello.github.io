todosOsDados.push({
    tituloPrincipal: "Gerenciamento de processos de negócio - desenho e melhoria de processos",
    conceitos: [
        {
            id: 1,
            titulo: "BPM (Business Process Management)",
            teoria: `
                <p><strong>BPM</strong> é uma abordagem sistemática para modelar, analisar, medir, melhorar e automatizar processos de negócio, visando alinhar estratégias organizacionais com necessidades dos clientes.</p>
                <ul>
                    <li><strong>Ciclo PDCA</strong> (Plan-Do-Check-Act) é central na melhoria contínua.</li>
                    <li><strong>BPMN</strong> (Business Process Model and Notation) é o padrão para modelagem.</li>
                    <li><strong>Diferença entre BPM e Workflow</strong>: BPM é holístico (estratégico), enquanto workflow é operacional (execução de tarefas).</li>
                </ul>`,
            analogiaPokemon: `BPM é como treinar um Metagross: você mapeia suas habilidades (modelagem), testa em batalhas (análise), ajusta EVs/IVs (melhoria) e automatiza com movimentos como Bullet Punch (otimização).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "O BPM utiliza exclusivamente a notação BPMN para modelagem de processos e é sinônimo de workflow, pois ambos focam na execução passo a passo de tarefas operacionais."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "BPMN é o padrão mais comum, mas não exclusivo (ex: UML, EPC). Além disso, BPM ≠ Workflow. Workflow é um subconjunto operacional, enquanto BPM inclui estratégia, métricas e governança."
            }
        },
        {
            id: 2,
            titulo: "Modelagem de Processos com BPMN",
            teoria: `<p><strong>BPMN</strong> é a notação padrão para modelagem de processos, com elementos-chave como atividades (tasks/subprocessos), eventos, gateways e fluxos.</p>
                <ul>
                    <li><strong>Gateway Exclusivo (XOR)</strong>: apenas um caminho é executado.</li>
                    <li><strong>Gateway Paralelo (AND)</strong>: todos os caminhos são ativados.</li>
                    <li><strong>Gateway Inclusivo (OR)</strong>: múltiplos caminhos válidos podem ser executados.</li>
                </ul>`,
            analogiaPokemon: `Modelar com BPMN é como montar uma equipe Pokémon: Tasks são ataques individuais, Gateways são decisões do treinador, e Eventos são condições de batalha.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "Em BPMN, um gateway paralelo (AND) permite que apenas um dos caminhos disponíveis seja executado, de forma similar a um gateway exclusivo (XOR), porém com avaliação de condições em paralelo."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Gateways paralelos (AND) ativam todos os caminhos, sem condições. Já o XOR avalia condições, mas só ativa um caminho válido. A assertiva iguala erroneamente os dois conceitos."
            }
        },
        {
            id: 3,
            titulo: "Melhoria de Processos (Redesenho vs. Melhoria Contínua)",
            teoria: `<p><strong>Redesenho (BPR)</strong>: Mudança radical, com foco em resultados drásticos e quebra de paradigmas.</p>
                <p><strong>Melhoria Contínua (Kaizen)</strong>: Ajustes incrementais e pequenas otimizações frequentes.</p>
                <ul>
                    <li>BPR exige alto investimento e risco.</li>
                    <li>Kaizen é gradual e menos disruptivo.</li>
                </ul>`,
            analogiaPokemon: `BPR é como evoluir um Magikarp para Gyarados (transformação radical). Kaizen é como treinar um Pikachu com vitaminas (pequenos boosts cumulativos).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "O redesenho de processos (BPR) e a melhoria contínua (Kaizen) são abordagens intercambiáveis, pois ambas visam a eficiência operacional por meio de ajustes incrementais e baixo impacto organizacional."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "BPR é radical (não incremental) e tem alto impacto organizacional, enquanto Kaizen é o oposto. A assertiva comete um erro grave ao igualar os dois métodos."
            }
        },
        {
            id: 4,
            titulo: "Indicadores de Desempenho de Processos (KPIs)",
            teoria: `<p><strong>KPIs</strong> medem a eficácia e eficiência de processos. Principais tipos:</p>
                <ul>
                    <li><strong>Eficiência</strong>: Relação entre recursos utilizados e resultados (ex: tempo médio de atendimento).</li>
                    <li><strong>Eficácia</strong>: Grau de alcance dos objetivos (ex: taxa de satisfação do cliente).</li>
                    <li><strong>Efetividade</strong>: Combinação de eficiência + eficácia (impacto real).</li>
                </ul>`,
            analogiaPokemon: `Eficiência: Alakazam usando "Psychic" com 100% de precisão. Eficácia: Escolher "Psychic" contra um Machamp. Efetividade: Derrotar o Machamp em 1 turno com crítico.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "Indicadores de eficiência, como a taxa de entrega no prazo, avaliam primordialmente se os objetivos estratégicos do processo estão sendo alcançados, caracterizando-se como métricas de eficácia."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Taxa de entrega no prazo mede eficiência (uso otimizado de tempo), não eficácia. A assertiva troca propositalmente esses conceitos, típico em questões da CEBRASPE."
            }
        }
    ]
});