todosOsDados.push({
    tituloPrincipal: "Testes - análise estática de código fonte (SonarQube)",
    conceitos: [
        {
            id: 1,
            titulo: "Análise Estática de Código Fonte (SonarQube)",
            teoria: `
                <p><strong>Análise estática de código fonte</strong> é uma técnica de verificação de código sem executá-lo, focada em identificar vulnerabilidades, bugs, code smells e débitos técnicos. O SonarQube é uma ferramenta que automatiza essa análise, avaliando métricas como:</p>
                <ul>
                    <li><strong>Cobertura de testes</strong>: percentual de código exercido por testes.</li>
                    <li><strong>Duplicação de código</strong>: trechos idênticos ou similares.</li>
                    <li><strong>Complexidade ciclomática</strong>: número de caminhos independentes no código.</li>
                    <li><strong>Violções de boas práticas</strong>: como uso de hardcode ou métodos muito longos.</li>
                </ul>
                <p><strong>Nuance Cebraspe</strong>: A análise estática não substitui testes dinâmicos (que exigem execução), mas os complementa. Outra pegadinha comum é confundir code smells (indicadores de má qualidade) com bugs (erros reais).</p>`,
            analogiaPokemon: `O SonarQube é como um Professor Carvalho que inspeciona seus Pokémon (código) antes da batalha (execução). Ele aponta falhas no treinamento (code smells), como um Pikachu com ataques repetitivos (duplicação de código) ou um Charizard com movimentos complexos demais (alta complexidade ciclomática), mas não prevê como eles se sairão em combate (testes dinâmicos).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O SonarQube é uma ferramenta de análise dinâmica de código que executa testes unitários para identificar bugs críticos, como null pointer exceptions, sendo suficiente para garantir a qualidade do software sem a necessidade de outras formas de teste."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva está errada por três motivos: 1) Troca de conceitos: O SonarQube faz análise estática (sem execução), não dinâmica. 2) Generalização indevida: A ferramenta identifica potenciais bugs, mas não os confirma sem testes dinâmicos. 3) Falsa suficiência: Nenhuma ferramenta é suficiente sozinha; testes manuais e dinâmicos são complementares. Pegadinha: Usar 'SonarQube' (correto) no enunciado e 'Sonarqube' (errado) no item para distrair o candidato."
            }
        },
        {
            id: 2,
            titulo: "Tipos de Violações no SonarQube",
            teoria: `
                <p>O SonarQube classifica violações em:</p>
                <ul>
                    <li><strong>Blocker/Critical</strong>: Erros graves (ex.: memory leaks) que devem ser corrigidos imediatamente.</li>
                    <li><strong>Major/Minor</strong>: Problemas que impactam a mantenabilidade (ex.: métodos longos).</li>
                    <li><strong>Info</strong>: Sugestões de melhoria (ex.: comentários não padronizados).</li>
                </ul>
                <p><strong>Nuance Cebraspe</strong>: A banca pode tentar confundir a prioridade das violações (ex.: classificar um bug crítico como 'Major') ou associar incorretamente exemplos a categorias.</p>`,
            analogiaPokemon: `As violações são como os tipos de Pokémon: Blocker: Um Dragonite fora de controle (risco iminente). Major: Um Snorlax bloqueando o caminho (atrapalha, mas não é fatal). Info: Um Pidgey voando baixo (observação sem urgência).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No SonarQube, violações do tipo 'Major' referem-se exclusivamente a erros de sintaxe, enquanto 'Blocker' indica falhas de segurança, como injeção de SQL."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao: 1) Restringir indevidamente: 'Major' inclui outros problemas (ex.: complexidade alta), não apenas sintaxe. 2) Generalizar: 'Blocker' pode ser qualquer erro grave (ex.: stack overflow), não só falhas de segurança. Pegadinha: Usar exemplos reais (SQL injection é crítico) para mascarar a generalização incorreta."
            }
        },
        {
            id: 3,
            titulo: "Integração do SonarQube em Pipelines (CI/CD)",
            teoria: `
                <p>O SonarQube é integrado a pipelines de CI/CD (ex.: Jenkins, GitLab CI) para análise automática a cada commit. Principais benefícios:</p>
                <ul>
                    <li><strong>Fail Fast</strong>: Bloqueia a entrega se encontrar violações 'Blocker'.</li>
                    <li><strong>Métricas históricas</strong>: Rastreia a evolução da qualidade do código.</li>
                </ul>
                <p><strong>Nuance Cebraspe</strong>: A banca pode sugerir que a análise estática é feita após a implantação (errado) ou que todas as violações bloqueiam a pipeline (só as configuradas).</p>`,
            analogiaPokemon: `A integração é como um check-up no Centro Pokémon: Cada novo Pokémon (código) é avaliado automaticamente antes de entrar no time (produção). Se um Pokémon estiver envenenado (Blocker), é barrado até ser curado (corrigido).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A integração do SonarQube em pipelines de CI/CD permite a análise estática apenas após a implantação em produção, garantindo que todas as violações, inclusive as 'Info', interrompam o fluxo de entrega."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Erros na assertiva: 1) Timing incorreto: A análise ocorre antes da implantação (durante o CI). 2) Falsa garantia: Apenas violações configuradas (geralmente 'Blocker/Critical') interrompem o fluxo. Pegadinha: Trocar a ordem temporal ('após implantação') e incluir 'Info' como bloqueadora."
            }
        }
    ]
});