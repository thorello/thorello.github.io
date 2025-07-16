todosOsDados.push({
    tituloPrincipal: "Gerenciamento de processos de negócio - business process modeling and notation (BPMN)",
    conceitos: [
        {
            id: 1,
            titulo: "Visão Geral e Elementos Essenciais do BPMN",
            teoria: `
                <p>BPMN (Business Process Model and Notation) é uma notação gráfica padronizada (ISO 19510) para modelagem de processos de negócio. Seu núcleo consiste em <strong>Flow Objects</strong> (Eventos, Atividades, Gateways), <strong>Connecting Objects</strong> (Fluxos de Sequência, Mensagens, Associações), <strong>Swimlanes</strong> (Pools e Lanes) e <strong>Artifacts</strong> (Objetos de Dados, Anotações).</p>
                <ul>
                    <li>Eventos são círculos (início, intermediário, fim)</li>
                    <li>Atividades são retângulos com cantos arredondados</li>
                    <li>Gateways são losangos que controlam divergências/convergências</li>
                    <li>Fluxo de Sequência (seta contínua) vs Fluxo de Mensagem (seta tracejada)</li>
                </ul>`,
            analogiaPokemon: `Modelar um processo no BPMN é como organizar uma batalha Pokémon: Swimlanes são os treinadores (Pools) e seus Pokémon (Lanes); Atividades são os ataques; Gateways são decisões táticas; Eventos marcam o início/fim da batalha.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "No BPMN 2.0, fluxos de sequência e fluxos de mensagem são representados, respectivamente, por linhas contínuas e tracejadas, sendo ambos utilizados para conectar atividades dentro da mesma pool, desde que estejam em lanes diferentes."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Fluxos de mensagem não podem conectar elementos dentro da mesma pool. Eles são exclusivos para comunicação entre pools distintas. Dentro de uma pool, mesmo entre lanes diferentes, só se usa fluxo de sequência."
            }
        },
        {
            id: 2,
            titulo: "Tipos de Gateways em BPMN",
            teoria: `
                <p>Gateways em BPMN são elementos de controle que direcionam o fluxo do processo:</p>
                <ul>
                    <li><strong>Exclusivo (XOR)</strong>: Decisão baseada em condições mutuamente exclusivas</li>
                    <li><strong>Paralelo (AND)</strong>: Divisão ou união de fluxos sem condições</li>
                    <li><strong>Inclusivo (OR)</strong>: Ativa múltiplos caminhos com base em condições não excludentes</li>
                    <li><strong>Complexo</strong>: Para regras de negócio não cobertas pelos demais</li>
                </ul>
                <p>O gateway baseado em eventos (subclasse do XOR) só pode ser usado após atividades assíncronas.</p>`,
            analogiaPokemon: `Gateways são como estratégias de um treinador: XOR é escolher entre ataques específicos, AND é atacar com múltiplos Pokémon simultaneamente, OR é usar combinações flexíveis de ataques.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "Em BPMN 2.0, gateways baseados em eventos são utilizados para modelar decisões que dependem de ocorrências assíncronas, podendo ser aplicados tanto após tarefas humanas quanto após serviços automatizados, desde que haja expectativa de um evento externo disparado imediatamente após a conclusão da atividade precedente."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Gateways baseados em eventos só são válidos após atividades que gerem eventos de espera, nunca após tarefas síncronas. Além disso, o evento externo não precisa ocorrer imediatamente."
            }
        },
        {
            id: 3,
            titulo: "Eventos em BPMN",
            teoria: `
                <p>Eventos em BPMN são ocorrências que afetam o fluxo do processo:</p>
                <ul>
                    <li><strong>Por Posição</strong>: Início (borda fina), Intermediário (borda dupla), Fim (borda grossa)</li>
                    <li><strong>Por Tipo</strong>: Mensagem, Temporizador, Condição, Link, Cancelamento</li>
                    <li>Eventos de início não podem ter fluxo de sequência entrando</li>
                    <li>Eventos de fim não podem ter fluxo saindo</li>
                </ul>`,
            analogiaPokemon: `Eventos são como ocorrências em uma jornada Pokémon: início é receber o Pokédex, intermediário é chuva durante batalha, fim é derrotar a Elite Four.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "Eventos de início em BPMN podem ser acionados por múltiplos gatilhos, como mensagens, temporizadores ou condições, e admitem fluxos de sequência entrantes quando associados a subprocessos em loop, desde que configurados como eventos não interrompedores."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Eventos de início nunca aceitam fluxos de sequência entrantes, mesmo em subprocessos em loop. A categoria 'não interrompedor' aplica-se apenas a eventos intermediários anexados a atividades."
            }
        },
        {
            id: 4,
            titulo: "Swimlanes (Pools e Lanes) em BPMN",
            teoria: `
                <p>Swimlanes organizam responsabilidades em processos BPMN:</p>
                <ul>
                    <li><strong>Pools</strong>: Representam participantes independentes (empresas, sistemas)</li>
                    <li><strong>Lanes</strong>: Subdivisões de um pool (departamentos, papéis)</li>
                    <li>Comunicação entre pools SÓ via fluxos de mensagem</li>
                    <li>Fluxos de sequência NÃO cruzam pools (só lanes)</li>
                </ul>`,
            analogiaPokemon: `Pools são times rivais (Ash vs Team Rocket), lanes são Pokémon específicos dentro de cada time, fluxos de mensagem são ataques entre times.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "Em BPMN 2.0, pools devem sempre ser detalhados com lanes explícitas, e fluxos de sequência podem conectar atividades de diferentes pools quando estes representarem unidades organizacionais da mesma empresa, desde que documentado no diagrama."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Pools podem ser black boxes (sem lanes visíveis). Fluxos de sequência NUNCA conectam pools diferentes - mesmo dentro da mesma empresa. A comunicação deve ser via fluxos de mensagem."
            }
        },
        {
            id: 5,
            titulo: "Subprocessos e Atividades Compostas em BPMN",
            teoria: `
                <p>Subprocessos em BPMN são atividades que podem ser detalhadas em outro nível:</p>
                <ul>
                    <li><strong>Expandido</strong>: Mostrado com "+" (visualização interna)</li>
                    <li><strong>Colapsado</strong>: Representado como uma única atividade</li>
                    <li><strong>Tipos Especiais</strong>: Em Loop, Ad Hoc, Transação</li>
                    <li>Sempre têm eventos de início e fim</li>
                    <li>Podem ser interrompidos por eventos de cancelamento</li>
                </ul>`,
            analogiaPokemon: `Subprocesso Expandido é batalha mostrando cada ataque, Colapsado é "Batalha de Ginásio" como caixa preta, Em Loop é tentar capturar Pokémon até conseguir.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "Subprocessos em BPMN 2.0 são obrigatoriamente iniciados por um único evento do tipo mensagem e podem conter gateways paralelos internamente, mas não permitem a inclusão de outros subprocessos aninhados, exceto quando marcados como transações."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Subprocessos podem ter vários tipos de eventos iniciais, permitem subprocessos aninhados em qualquer caso, e gateways paralelos são totalmente permitidos internamente."
            }
        }
    ]
});