todosOsDados.push({
    tituloPrincipal: "Gerenciamento de processos de negócio - modelagem de processos",
    conceitos: [
        {
            id: 1,
            titulo: "Conceito de Processo de Negócio e BPM",
            teoria: `
                <p>Um <strong>processo de negócio</strong> é uma sequência estruturada e inter-relacionada de atividades, com início e fim definidos, que transforma insumos (inputs) em resultados (outputs) de valor para um cliente (interno ou externo). Crucialmente, um processo transcende fronteiras funcionais (departamentos).</p><p>A Cebraspe frequentemente o contrasta com:</p><ul><li><strong>Projeto</strong>, que é um esforço temporário para criar um produto ou serviço único;</li><li><strong>Função</strong>, que representa uma unidade organizacional com responsabilidades contínuas (ex: departamento de RH).</li></ul><p>O <strong>Gerenciamento de Processos de Negócio (BPM - <em>Business Process Management</em>)</strong> não é uma ferramenta ou um projeto pontual, mas uma <strong>disciplina gerencial holística</strong> que trata processos como ativos estratégicos. Seu objetivo é a melhoria contínua, alinhando os processos à estratégia organizacional por meio de um ciclo de vida (design, modelagem, execução, monitoramento e otimização). A banca costuma explorar a confusão entre BPM como disciplina e a simples modelagem de processos (que é apenas uma das fases do BPM).</p>`,
            analogiaPokemon: `A jornada de um treinador para se tornar campeão da Liga Pokémon é um <strong>processo de negócio</strong>. Há um início (receber o Pokémon inicial), uma sequência de atividades (coletar insígnias, treinar), e um fim com resultado de valor (o título de campeão). Capturar um Pokémon lendário como o Zapdos é um <strong>projeto</strong>: tem objetivo único, é temporário e termina com a captura. O trabalho contínuo da Enfermeira Joy no Centro Pokémon é uma <strong>função</strong>: ela executa uma atividade especializada (curar Pokémon) de forma contínua, sem um fim predefinido.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - MPU/2025 - Adaptada)",
                texto: "O Gerenciamento de Processos de Negócio (BPM) consiste em uma iniciativa tecnológica focada na automação de fluxos de trabalho, cujo principal objetivo é a documentação precisa e detalhada dos processos existentes (modelo AS-IS), sendo a modelagem, portanto, a fase final e mais crítica do seu ciclo de vida."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva contém três erros clássicos explorados pela banca. Primeiro, reduz o BPM a uma \"iniciativa tecnológica\", quando, na verdade, é uma disciplina de gestão que envolve governança, cultura, pessoas e, secundariamente, tecnologia. Segundo, afirma que seu principal objetivo é a documentação \"AS-IS\", o que é incorreto; a documentação do estado atual é apenas o ponto de partida para a análise, melhoria e transformação (modelo TO-BE). Terceiro, posiciona a modelagem como a fase \"final e mais crítica\", o que desconsidera as etapas subsequentes e fundamentais do ciclo BPM, como execução, monitoramento e otimização, que garantem a melhoria contínua. O candidato precisaria compreender o BPM como uma disciplina gerencial cíclica e holística para identificar as simplificações incorretas na questão."
            }
        },
        {
            id: 2,
            titulo: "BPMN - Elementos Essenciais (Eventos, Atividades, Gateways)",
            teoria: `
                <p>A notação BPMN (Business Process Model and Notation) possui três categorias de elementos de fluxo: <strong>Eventos</strong>, <strong>Atividades</strong> e <strong>Gateways</strong>.</p>
                <ul>
                    <li><strong>Eventos</strong>: Indicam algo que acontece. São círculos. <strong>Evento de Início</strong> (círculo com linha fina) marca o começo do processo. <strong>Evento de Fim</strong> (círculo com linha grossa) marca o término de um caminho. <strong>Evento Intermediário</strong> (círculo com linha dupla) ocorre durante o processo.</li>
                    <li><strong>Atividades</strong>: Representam o trabalho a ser feito. São retângulos de cantos arredondados. Uma <strong>Tarefa</strong> é uma atividade atômica. Um <strong>Subprocesso</strong> é uma atividade composta, que pode ser expandida (marcado com um \"+\" quando colapsado).</li>
                    <li><strong>Gateways</strong>: Controlam a divergência e convergência do fluxo. São losangos. A Cebraspe adora testar a diferença entre eles:
                        <ul>
                            <li><strong>Exclusivo (XOR)</strong>: Apenas UM caminho de saída é seguido.</li>
                            <li><strong>Paralelo (AND)</strong>: TODOS os caminhos de saída são ativados simultaneamente. Na convergência, aguarda TODOS os caminhos de entrada.</li>
                            <li><strong>Inclusivo (OR)</strong>: UM OU MAIS caminhos de saída são ativados. Na convergência, aguarda apenas os caminhos que foram efetivamente ativados. Este é um ponto frequente de pegadinhas.</li>
                        </ul>
                    </li>
                </ul>`,
            analogiaPokemon: `<strong>Eventos</strong>: O Professor Carvalho oferecendo um Pokémon inicial é um <strong>Evento de Início</strong>. Encontrar um Snorlax bloqueando a estrada é um <strong>Evento Intermediário</strong>. <strong>Atividades</strong>: Usar o ataque \"Tackle\" é uma <strong>Tarefa</strong>. A sequência de \"batalhar e vencer um ginásio\" é um <strong>Subprocesso</strong>. <strong>Gateways</strong>: Ao fim de uma batalha, o treinador enfrenta um <strong>Gateway Exclusivo</strong>: ou captura ou derrota o Pokémon. Para preparar sua mochila, ele enfrenta um <strong>Gateway Inclusivo</strong>: pode pegar Pokébolas, Poções ou ambos.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - STJ/2024 - Adaptada)",
                texto: "Em um fluxo modelado com BPMN 2.0, um gateway do tipo inclusivo, utilizado para divergir o fluxo, ativa todos os caminhos de saída cujas condições associadas são satisfeitas. Na sua função de convergência, para sincronizar o fluxo, ele deve aguardar a conclusão de todos os caminhos de entrada que se conectam a ele, independentemente de terem sido ativados ou não na etapa de divergência, comportamento idêntico ao do gateway paralelo."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A maldade da questão está na parte final, ao descrever o comportamento de convergência (sincronização) do gateway inclusivo e compará-lo ao do gateway paralelo. Um gateway inclusivo de convergência é mais inteligente que o paralelo: ele possui \"memória\" do estado do processo e aguarda apenas os tokens (instâncias de fluxo) dos caminhos que foram efetivamente ativados no gateway inclusivo de divergência correspondente. A assertiva erra ao afirmar que ele aguarda a conclusão de todos os caminhos de entrada, mesmo os não ativados, e que seu comportamento é \"idêntico\" ao do gateway paralelo. O gateway paralelo, sim, aguarda a chegada de um token de cada um dos seus fluxos de entrada para poder liberar um único fluxo de saída."
            }
        },
        {
            id: 3,
            titulo: "BPMN - Piscinas (Pools) e Raias (Lanes)",
            teoria: `
                <p><strong>Piscinas (Pools)</strong> e <strong>Raias (Lanes)</strong> são artefatos do BPMN utilizados para organizar e categorizar atividades. A distinção entre eles é um ponto nevrálgico em provas.</p>
                <ul>
                    <li><strong>Piscina (Pool)</strong>: Representa um <strong>participante</strong> do processo de negócio (ex: uma empresa, um cliente). A comunicação <strong>entre piscinas</strong> ocorre exclusivamente por meio de <strong>Fluxo de Mensagem</strong> (linha tracejada). A regra de ouro é: <strong>Fluxo de Sequência</strong> (linha contínua) <strong>NÃO PODE</strong> cruzar a fronteira de uma piscina.</li>
                    <li><strong>Raia (Lane)</strong>: É uma <strong>subdivisão dentro de uma piscina</strong> para categorizar atividades por papéis ou funções (ex: \"Atendente\", \"Gerente\"). O <strong>Fluxo de Sequência PODE e DEVE cruzar as fronteiras das raias</strong> livremente.</li>
                </ul>`,
            analogiaPokemon: `Imagine uma troca de Pokémon entre Ash e Misty. Cada treinador é uma <strong>Piscina</strong>. Quando Ash propõe a troca, isso é um <strong>Fluxo de Mensagem</strong> entre as piscinas. Dentro da piscina \"Ash\", podemos ter <strong>Raias</strong>: a raia \"Ash\" (decide) e a raia \"Pikachu\" (age). O comando de Ash para Pikachu é um <strong>Fluxo de Sequência</strong> cruzando as raias.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - PF/2026 - Adaptada)",
                texto: "Na modelagem de processos com BPMN, piscinas e raias servem para agrupar atividades por responsabilidade. A transferência de controle entre uma atividade alocada na raia \"Analista de Compras\" e outra na raia \"Gerente Financeiro\", ambas pertencentes à mesma piscina \"Empresa X\", deve ser representada por um fluxo de mensagem, indicando a mudança de responsabilidade. Adicionalmente, um fluxo de sequência é o artefato correto para conectar uma tarefa na piscina \"Fornecedor\" a uma tarefa na piscina \"Empresa X\", estabelecendo a ordem cronológica entre elas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva comete uma dupla inversão de conceitos. O primeiro erro está em afirmar que a comunicação entre raias da mesma piscina se dá por fluxo de mensagem. O correto é o fluxo de sequência. O segundo erro é afirmar que um fluxo de sequência pode conectar piscinas diferentes. Esta é uma violação fundamental das regras de BPMN; a comunicação entre piscinas distintas deve ser feita, obrigatoriamente, por meio de fluxo de mensagem."
            }
        },
        {
            id: 4,
            titulo: "Níveis de Modelagem de Processos",
            teoria: `
                <p>A modelagem de processos ocorre em diferentes níveis de abstração. A Cebraspe costuma trocar suas características.</p>
                <ul>
                    <li><strong>Nível Descritivo (Estratégico)</strong>: Foco em <strong>o quê</strong> o processo faz. É um modelo de alto nível e simplificado para comunicação com stakeholders do negócio.</li>
                    <li><strong>Nível Analítico (Tático/Operacional)</strong>: Foco em <strong>como</strong> o processo funciona, com mais detalhes. Adiciona regras, recursos e fluxos de exceção para análise e melhoria por analistas.</li>
                    <li><strong>Nível Executável (Técnico)</strong>: Foco na <strong>automação</strong>. É um modelo tecnicamente completo para ser importado e executado por uma ferramenta de BPMS, destinado a desenvolvedores.</li>
                </ul>`,
            analogiaPokemon: `<strong>Nível Descritivo</strong>: Um mapa geral de Kanto, mostrando cidades e o objetivo final (Liga Pokémon). <strong>Nível Analítico</strong>: O mesmo mapa, com detalhes sobre os tipos de Pokémon em cada ginásio e localização dos Centros Pokémon (para análise). <strong>Nível Executável</strong>: Um programa de Pokédex que, em batalha, executa o processo de análise de fraquezas e sugere o melhor ataque.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - TCE/RJ/2025 - Adaptada)",
                texto: "No contexto do gerenciamento de processos de negócio, a modelagem de processos em nível analítico visa a criação de um diagrama de alto nível para fins de comunicação com a alta gestão, utilizando um conjunto mínimo de elementos notacionais. Por outro lado, a modelagem em nível descritivo é aquela que incorpora detalhes técnicos, como especificações de integração com sistemas e tratamento de exceções, com o propósito de viabilizar a automação do processo em um BPMS."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A questão promove uma inversão direta dos conceitos. O nível descritivo, e não o analítico, é o que se destina à comunicação com a alta gestão com diagramas de alto nível. A segunda parte da assertiva descreve características do nível executável, mas as atribui incorretamente ao nível descritivo."
            }
        },
        {
            id: 5,
            titulo: "Ciclo de Vida BPM",
            teoria: `
                <p>O BPM é implementado por meio de um ciclo de vida iterativo para melhoria contínua. As fases são:</p>
                <ol>
                    <li><strong>Desenho (Design)</strong>: Entendimento, descoberta e planejamento estratégico do processo.</li>
                    <li><strong>Modelagem (Modeling)</strong>: Representação gráfica do processo (AS-IS e TO-BE) usando BPMN.</li>
                    <li><strong>Execução (Execution)</strong>: Implantação do processo redesenhado, seja por automação ou novos procedimentos.</li>
                    <li><strong>Monitoramento (Monitoring)</strong>: Coleta e medição de dados e KPIs do processo em execução.</li>
                    <li><strong>Otimização (Optimization)</strong>: Análise dos dados monitorados para identificar melhorias, reiniciando o ciclo. É o motor da melhoria contínua.</li>
                </ol>`,
            analogiaPokemon: `1. <strong>Desenho</strong>: O treinador planeja vencer um ginásio. 2. <strong>Modelagem</strong>: Ele desenha o fluxo da batalha. 3. <strong>Execução</strong>: Ele põe o plano em prática na batalha. 4. <strong>Monitoramento</strong>: Ele monitora o HP e PP durante a luta. 5. <strong>Otimização</strong>: Ele percebe que um ataque não é eficaz e muda de estratégia, aprendendo para a próxima vez.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - BACEN/2026 - Adaptada)",
                texto: "O ciclo de vida de BPM tem como fases sequenciais e obrigatórias: modelagem, na qual os processos são descobertos e documentados no modelo AS-IS; desenho, na qual o modelo TO-BE é criado; e, por fim, monitoramento, que consiste na implantação automatizada do processo por meio de um BPMS. A fase de otimização é considerada opcional, sendo aplicada apenas em processos de alta criticidade."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva desorganiza e redefine as fases. Primeiro, inverte Desenho e Modelagem. Segundo, confunde Monitoramento com Execução. Terceiro, e o erro mais grave, classifica a Otimização como \"opcional\". A otimização é a essência do BPM e da melhoria contínua, sendo uma fase fundamental do ciclo."
            }
        },
        {
            id: 6,
            titulo: "Modelos AS-IS, TO-BE e SHOULD-BE",
            teoria: `
                <p>Diferentes modelos representam o processo em diferentes estágios:</p>
                <ul>
                    <li><strong>Modelo AS-IS (\"como é\")</strong>: É o diagnóstico, a fotografia do processo <strong>em seu estado atual</strong>, com todas as suas ineficiências e problemas. Não deve ser idealizado.</li>
                    <li><strong>Modelo TO-BE (\"como será\")</strong>: É o projeto do processo <strong>em seu estado futuro e otimizado</strong>, que será efetivamente implementado de forma pragmática, considerando as restrições da organização.</li>
                    <li><strong>Modelo SHOULD-BE (\"como deveria ser\")</strong>: É a visão do processo em seu estado <strong>ideal, de referência</strong>, baseado em <em>benchmarking</em>, sem as restrições atuais. Serve como um \"norte\" para o TO-BE. A pegadinha é tratar TO-BE e SHOULD-BE como sinônimos.</li>
                </ul>`,
            analogiaPokemon: `<strong>AS-IS</strong>: Sua equipe Pokémon atual (Charmander nível 5). <strong>TO-BE</strong>: Seu plano prático para vencer o próximo ginásio (treinar o Charmander até o nível 13). <strong>SHOULD-BE</strong>: O time ideal de um Mestre Pokémon (Charizard, Blastoise, etc. no nível 100), a visão perfeita.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - SEFAZ/DF/2025 - Adaptada)",
                texto: "Na primeira etapa do mapeamento de um processo de negócio, elabora-se o modelo AS-IS, que representa o fluxo de trabalho futuro e otimizado, considerando as melhores práticas de mercado. Em seguida, com base nesse modelo ideal, desenvolve-se o modelo TO-BE, que documenta o processo como ele ocorre atualmente na organização, para fins de diagnóstico de problemas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva promove uma inversão completa dos conceitos. O modelo AS-IS documenta o processo atual para diagnóstico, não o futuro. A descrição fornecida para o AS-IS na questão se encaixa, na verdade, na definição de TO-BE (ou SHOULD-BE). Em seguida, a questão afirma que o TO-BE documenta o processo atual, trocando sua definição com a do AS-IS."
            }
        },
        {
            id: 7,
            titulo: "BPMN - Tipos de Tarefas",
            teoria: `
                <p>BPMN permite especificar como uma tarefa é realizada por meio de marcadores. A distinção crucial é:</p>
                <ul>
                    <li><strong>Tarefa de Usuário (User Task)</strong>: Ícone de pessoa. Trabalho realizado por um <strong>humano com o auxílio de um sistema de software</strong> (ex: preencher um formulário).</li>
                    <li><strong>Tarefa de Serviço (Service Task)</strong>: Ícone de engrenagens. Tarefa totalmente <strong>automatizada</strong> por um sistema (ex: consulta via API).</li>
                    <li><strong>Tarefa de Script (Script Task)</strong>: Ícone de pergaminho. Tarefa automatizada executada pelo próprio <strong>motor de processos (BPMS)</strong>.</li>
                    <li><strong>Tarefa Manual (Manual Task)</strong>: Ícone de mão. Trabalho realizado por um <strong>humano sem o auxílio de qualquer sistema</strong> (ex: arquivar documento físico).</li>
                </ul>
                <p><em>Ponto nevrálgico</em>: A confusão entre <strong>Usuário</strong> (humano + sistema) e <strong>Manual</strong> (apenas humano).</p>`,
            analogiaPokemon: `<strong>Tarefa de Usuário</strong>: O treinador usando a tela do videogame para selecionar um ataque. <strong>Tarefa de Serviço</strong>: O sistema do jogo executando a evolução de um Pokémon automaticamente. <strong>Tarefa de Script</strong>: O motor do jogo calculando os pontos de EXP após a batalha. <strong>Tarefa Manual</strong>: O treinador polindo suas insígnias.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - TRE/UNIFICADO/2025 - Adaptada)",
                texto: "Ao modelar um processo de \"aprovação de crédito\" em BPMN, a atividade na qual um analista insere os dados do cliente em um sistema financeiro para análise deve ser representada por uma Tarefa Manual (Manual Task), pois a digitação dos dados é uma ação manual. Subsequentemente, a atividade na qual o próprio sistema, sem intervenção humana, consulta o score de crédito do cliente em um serviço externo (API) deve ser classificada como uma Tarefa de Usuário (User Task)."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva inverte os conceitos. A atividade de \"inserir dados em um sistema\" é o exemplo canônico de uma Tarefa de Usuário. A pegadinha usou o termo \"ação manual\" para confundir. Já a consulta automatizada a um serviço externo é a definição exata de uma Tarefa de Serviço, e não de Usuário. O conhecimento exigido é a clara distinção entre as tarefas que envolvem humano+sistema (Usuário), apenas sistema (Serviço) e apenas humano (Manual)."
            }
        },
        {
            id: 8,
            titulo: "BPMN - Subprocessos (Embutido vs. Reutilizável)",
            teoria: `
                <p>Existem dois tipos de subprocessos com propósitos fundamentalmente diferentes:</p>
                <ul>
                    <li><strong>Subprocesso Embutido (Embedded Sub-process)</strong>: Tem <strong>escopo local</strong>, existindo apenas dentro do processo pai. Não pode ser reutilizado. Seu objetivo é a <strong>organização e simplificação hierárquica</strong> do diagrama. Possui borda fina padrão.</li>
                    <li><strong>Atividade de Chamada (Call Activity / Reutilizável)</strong>: Representa uma chamada a um <strong>processo globalmente definido</strong> e independente. Seu objetivo é a <strong>reutilização e a padronização</strong>. É identificado por uma <strong>borda mais grossa</strong>.</li>
                </ul>
                <p>A diferença crucial: <em>Embutido é local e para organização; Reutilizável é global e para reuso.</em></p>`,
            analogiaPokemon: `<strong>Subprocesso Embutido</strong>: O \"processo de resolver o quebra-cabeça das pedras\" dentro da \"Victory Road\". Só existe e faz sentido ali. <strong>Atividade de Chamada (Reutilizável)</strong>: O processo \"Curar a equipe no Centro Pokémon\". É um processo global, padrão e reutilizável, invocado em várias cidades.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - ANAC/2026 - Adaptada)",
                texto: "Na modelagem BPMN, para promover a reutilização de um conjunto de atividades comuns a diversos processos de negócio de uma organização, deve-se empregar um subprocesso embutido (embedded), que é caracterizado por uma borda fina e é definido localmente no processo que o invoca. Em contrapartida, a atividade de chamada (call activity), identificada por sua borda grossa, serve exclusivamente para a simplificação visual de um diagrama complexo, agrupando atividades que não possuem utilidade fora do processo pai."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva realiza uma troca completa das definições. O subprocesso para reutilização é a Atividade de Chamada (borda grossa, global). A assertiva atribui essa função ao subprocesso embutido. De forma complementar, ela descreve a Atividade de Chamada com as características do subprocesso embutido (simplificação visual, local), invertendo 100% dos conceitos."
            }
        },
        {
            id: 9,
            titulo: "BPMN - Eventos Intermediários de Borda (Boundary Events)",
            teoria: `
                <p>É um evento anexado à <strong>fronteira de uma atividade</strong> para lidar com um evento (exceção) que ocorre <strong>enquanto</strong> a atividade está em execução. Existem dois tipos:</p>
                <ul>
                    <li><strong>Interruptivo (Linha Contínua)</strong>: Padrão. Quando o evento é disparado, a atividade anexa é <strong>imediatamente terminada (interrompida)</strong>, e o fluxo é desviado.</li>
                    <li><strong>Não Interruptivo (Linha Tracejada)</strong>: Quando o evento é disparado, a atividade principal <strong>continua sua execução normalmente</strong>, e um novo fluxo paralelo é iniciado a partir do evento.</li>
                </ul>
                <p>A pegadinha clássica é confundir o comportamento ou a representação visual de cada um.</p>`,
            analogiaPokemon: `<strong>Evento Interruptivo</strong>: Na atividade \"Capturar um Chansey\", o evento de borda \"Tempo do Safári Acabou\" interrompe a captura e te expulsa. <strong>Evento Não Interruptivo</strong>: Na atividade \"Treinar por 1 hora\", o evento de borda \"Receber dica do Professor\" dispara um fluxo para você anotar a dica, mas o treino continua sem parar.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - POLÍCIA FEDERAL/PERITO/2027 - Adaptada)",
                texto: "No BPMN 2.0, para modelar uma situação em que uma atividade pode ser cancelada por uma solicitação externa enquanto está em andamento, utiliza-se um evento intermediário de borda do tipo não interruptivo, representado por um círculo de linha tracejada. Ao ser acionado, esse evento gera um fluxo paralelo para tratar o cancelamento, mas permite que a atividade original continue sua execução até o fim, a fim de garantir a consistência do processo."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A maldade da questão está em descrever um cenário de interrupção (\"cancelamento\") e associá-lo ao comportamento e à notação do evento não interruptivo. Para modelar um cancelamento, o correto seria usar um evento de borda interruptivo (linha contínua). A assertiva erra ao dizer que se usaria um evento não interruptivo (linha tracejada) e descreve o comportamento de forma contraditória, pois o cancelamento não permitiria que a atividade continuasse."
            }
        },
        {
            id: 10,
            titulo: "BPMN - Gateways Avançados (Complexo e Baseado em Eventos)",
            teoria: `
                <p>Gateways para situações específicas:</p>
                <ul>
                    <li><strong>Gateway Complexo (Complex Gateway)</strong>: Ícone de <strong>asterisco (*)</strong>. Usado para lógicas de decisão e sincronização <strong>muito complexas</strong> para os outros gateways. A lógica é definida textualmente.</li>
                    <li><strong>Gateway Baseado em Eventos (Event-Based Gateway)</strong>: Ícone de círculo duplo com estrela. A decisão é determinada pela <strong>ocorrência de um evento</strong>, não pela avaliação de dados. É sempre seguido por eventos intermediários. O fluxo segue pelo caminho do <strong>primeiro evento que ocorrer</strong>, modelando uma \"corrida\" entre eventos.</li>
                </ul>`,
            analogiaPokemon: `<strong>Gateway Complexo</strong>: Para entrar na caverna do Mewtwo, a regra é: \"ter 3 Pokémon > nível 80 OU ter 2 lendários, MAS NÃO PODE ter Master Ball\". Essa lógica customizada exige um Gateway Complexo. <strong>Gateway Baseado em Eventos</strong>: Você espera. O que acontece primeiro? (A) Um Tauros aparece. (B) Começa a chover. (C) Seu rival aparece. O primeiro evento define seu próximo passo.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - TCU/AUDITOR/2027 - Adaptada)",
                texto: "Para modelar um ponto de decisão em um processo em que o fluxo deve aguardar por um de vários eventos distintos — como a chegada de uma resposta do cliente ou a expiração de um prazo —, e seguir o caminho correspondente ao primeiro evento que ocorrer, deve-se utilizar um gateway complexo. Esse tipo de gateway é sempre seguido por tarefas de usuário ou de serviço que são ativadas com base na ocorrência do evento."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A questão descreve perfeitamente o cenário de uso de um Gateway Baseado em Eventos, mas atribui essa função ao Gateway Complexo. Além disso, a assertiva erra ao afirmar que o gateway seria seguido por \"tarefas de usuário ou de serviço\". O Gateway Baseado em Eventos deve ser obrigatoriamente seguido por eventos intermediários (ou tarefas de recebimento), que são os elementos capazes de \"escutar\" os eventos. A maldade foi descrever o cenário de um elemento e nomear outro."
            }
        }
    ]
});