todosOsDados.push({
    tituloPrincipal: "Engenharia de requisitos - gerenciamento de requisitos",
    conceitos: [
        {
            id: 1,
            titulo: "Rastreabilidade de Requisitos",
            teoria: `
                <p><strong>Rastreabilidade</strong> é a capacidade de relacionar requisitos a suas origens (como stakeholders ou documentos) e a outros artefatos do projeto (como código, testes ou designs). Divide-se em:</p>
                <ul>
                    <li><strong>Rastreabilidade vertical</strong>: liga requisitos a objetivos de negócio ou regras superiores.</li>
                    <li><strong>Rastreabilidade horizontal</strong>: conecta requisitos entre si (ex.: dependências, conflitos).</li>
                </ul>
                <p><strong>Ponto crucial</strong>: Diferenciar "backward traceability" (requisito → origem) de "forward traceability" (requisito → implementação).</p>`,
            analogiaPokemon: `Imagine que os requisitos são Pokémons evoluídos (ex.: Bulbasaur → Ivysaur → Venusaur). A rastreabilidade é a Pokédex que mostra quem veio de quem e como cada evolução afeta o time (projeto). Sem ela, você pode acabar com um Venusaur sem saber que ele precisa de Sol para atacar (requisito não atendido).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A rastreabilidade horizontal é utilizada exclusivamente para vincular requisitos a seus stakeholders, enquanto a vertical relaciona requisitos a testes de sistema, garantindo cobertura total."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva inverte os conceitos: Horizontal é entre requisitos (ex.: dependências), não com stakeholders. Vertical liga requisitos a níveis superiores (negócio) ou inferiores (código), não só a testes. Pegadinha: Usar 'exclusivamente' e 'garantir cobertura total' são generalizações falsas. Rastreabilidade auxilia na cobertura, mas não a garante sozinha."
            }
        },
        {
            id: 2,
            titulo: "Priorização de Requisitos",
            teoria: `<p><strong>Priorização</strong> define a ordem de implementação dos requisitos com base em critérios como:</p>
                <ul>
                    <li><strong>Valor para o negócio</strong> (ROI, alinhamento estratégico)</li>
                    <li><strong>Riscos</strong> (técnicos, legais)</li>
                    <li><strong>Dependências</strong> (requisitos bloqueadores)</li>
                </ul>
                <p><strong>Armadilha</strong>: Confundir técnicas como MoSCoW (Must, Should, Could, Won't) com Kano (básico, desempenho, delighter). MoSCoW é binário; Kano avalia satisfação.</p>`,
            analogiaPokemon: `Priorizar é como montar seu time para a Liga Pokémon: Must (Charizard - essencial), Should (Blastoise - complementar), Could (HMs opcionais), Won't (Magikarp inicial - inútil no curto prazo). Kano seria classificar ataques: básicos (Tackle), de desempenho (Hydro Pump) e delighters (Megaevolução).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A técnica de Kano classifica requisitos em Must, Should, Could e Won't, sendo ideal para projetos ágeis por sua simplicidade binária."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Erro 1: Kano não usa categorias MoSCoW; ele classifica em básicos, desempenho e delighters. Erro 2: Kano é complexo (analisa satisfação x funcionalidade), não 'binário'. Maldade: Trocar os nomes das técnicas e atribuir características falsas (simplicidade binária)."
            }
        },
        {
            id: 3,
            titulo: "Validação de Requisitos",
            teoria: `<p><strong>Validação</strong> verifica se os requisitos atendem às necessidades reais do cliente e do negócio. Inclui:</p>
                <ul>
                    <li><strong>Técnicas formais</strong>: Inspeções, prototipagem, listas de verificação</li>
                    <li><strong>Critérios-chave</strong>: Completeza, consistência, testabilidade e ausência de ambiguidade</li>
                </ul>
                <p><strong>Ponto crucial</strong>: Distinguir validação ('fizemos a coisa certa?') de verificação ('fizemos a coisa direito?'). Validação foca no valor para o stakeholder; verificação, na conformidade com especificações.</p>`,
            analogiaPokemon: `Validação é como o Professor Carvalho avaliando seu Pokédex: Completeza (capturou todos?), Consistência (Pikachu não pode ser do tipo Fogo), Testabilidade (provar que Mewtwo level 70 vence Blastoise level 50). Sem validação, seu time pode ter um Snorlax no lugar do Dragonite necessário.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A validação de requisitos é realizada exclusivamente após a implementação do sistema, utilizando testes de aceitação para confirmar se os requisitos foram atendidos conforme documentados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Erro 1: Validação ocorre durante todo o ciclo de vida, não só pós-implementação (ex.: protótipos validam requisitos cedo). Erro 2: Testes de aceitação são parte da validação, mas não os únicos métodos (inspeções e workshops também são usados). Pegadinha: Usar 'exclusivamente' e limitar o escopo da validação a testes."
            }
        },
        {
            id: 4,
            titulo: "Gerência de Mudança de Requisitos",
            teoria: `<p><strong>Processo sistemático</strong> para lidar com alterações em requisitos, envolvendo:</p>
                <ul>
                    <li><strong>Identificação</strong>: Detecção formal da mudança (origem, impacto)</li>
                    <li><strong>Análise</strong>: Avaliação de custo-benefício e riscos</li>
                    <li><strong>Controle</strong>: Aprovação/rejeição via comitê de mudança (CCB - Change Control Board)</li>
                </ul>
                <p><strong>Armadilha</strong>: Confundir 'controle de versão' (rastreamento técnico) com 'gerência de mudança' (decisão estratégica). Versão é sobre 'como', mudança é sobre 'porquê'.</p>`,
            analogiaPokemon: `É como o sistema de evoluções alternativas de Eevee: Identificação (saber que uma Pedra Água existe), Análise (decidir se Vaporeon é melhor que Jolteon), Controle (líder do ginásio/CCB pode vetar se desequilibrar o jogo).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O controle de versão de requisitos, realizado por ferramentas como Git, substitui a necessidade de um processo formal de gerência de mudança, pois garante o histórico completo de todas as alterações."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Erro fatal: Controle de versão (Git) registra 'o que' mudou, mas não decide 'se' deve mudar (função do CCB). Generalização: Histórico técnico ≠ análise estratégica de impacto nos custos/prazos. Maldade: Usar ferramenta popular (Git) como isca para confundir registro técnico com decisão gerencial."
            }
        }
    ]
});