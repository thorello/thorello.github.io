// dados1.js
todosOsDados.push({
    tituloPrincipal: "ENGENHARIA DE SOFTWARE - Engenharia de requisitos - técnicas de elicitação de requisitos",
    conceitos: [
        {
            id: 1,
            titulo: "Entrevistas (Interviews)",
            teoria: `
                <p>Entrevistas são uma das técnicas de elicitação de requisitos mais tradicionais, consistindo em um diálogo direto com os stakeholders para coletar informações. Dividem-se em três tipos principais:</p>
                <ul>
                    <li><strong>Estruturadas:</strong> seguem um roteiro fixo de perguntas fechadas, facilitando a análise comparativa, mas com baixa flexibilidade.</li>
                    <li><strong>Não Estruturadas:</strong> são abertas e exploratórias, ideais para domínios pouco conhecidos, mas difíceis de replicar e analisar.</li>
                    <li><strong>Semi-estruturadas:</strong> combinam um roteiro de tópicos-chave com a flexibilidade para aprofundar pontos de interesse que surgem durante a conversa.</li>
                </ul>
                <p>O ponto nevrálgico explorado pela Cebraspe é a adequação do tipo de entrevista ao contexto: a banca frequentemente inverte as características ou indica o uso de um tipo em um cenário onde outro seria mais apropriado.</p>`,
            analogiaPokemon: `Conduzir uma elicitação de requisitos é como preencher a Pokédex. Uma <strong>entrevista estruturada</strong> é como usar a função da Pokédex que apenas lista os dados básicos de um Pokémon (tipo, altura, peso) – as perguntas são sempre as mesmas. Uma <strong>entrevista não estruturada</strong> é como ter uma longa conversa com o Professor Carvalho, onde você pode divagar e descobrir histórias e fatos inesperados sobre a ecologia Pokémon. Já a <strong>entrevista semi-estruturada</strong> é como desafiar um Líder de Ginásio: você tem o objetivo claro (a batalha, o requisito principal), mas a forma como a conversa/batalha se desenrola permite descobrir táticas e informações novas (requisitos secundários).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Analista de Sistemas/TJ-DFT/2025 - Adaptada)",
                texto: "No processo de elicitação de requisitos, as entrevistas estruturadas são particularmente eficazes para a exploração inicial de problemas complexos e mal definidos, uma vez que sua natureza aberta e flexível permite que o analista se adapte dinamicamente ao fluxo da conversa para descobrir requisitos latentes."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva comete um erro clássico ao inverter os conceitos. São as entrevistas <strong>não estruturadas</strong> (ou, em menor grau, as semi-estruturadas) que possuem a natureza aberta e flexível, sendo ideais para a exploração de domínios complexos ou mal compreendidos. As entrevistas <strong>estruturadas</strong>, por sua vez, são rígidas, baseadas em um script predefinido, e se prestam melhor à validação de informações já conhecidas ou à coleta de dados quantitativos de um grande número de pessoas de forma padronizada. A maldade da banca consistiu em atribuir as características de uma técnica (não estruturada) a outra (estruturada), induzindo o candidato ao erro por meio de uma descrição conceitualmente incorreta."
            }
        },
        {
            id: 2,
            titulo: "Questionários (Questionnaires)",
            teoria: `<p>Questionários consistem em um conjunto de perguntas escritas, entregues a um grande número de pessoas para obter informações sobre um domínio. São particularmente úteis para alcançar um público geograficamente disperso e para coletar dados quantitativos de forma rápida e barata.</p><p>A Cebraspe costuma focar em suas desvantagens: a taxa de retorno pode ser baixa, não há como garantir que a pessoa certa respondeu, e, principalmente, a técnica é inadequada para aprofundamento. Perguntas abertas podem ser incluídas, mas raramente fornecem a riqueza de detalhes de uma entrevista, pois impedem o <em>follow-up</em> (perguntas de esclarecimento) em tempo real. A banca pode afirmar que questionários são ideais para descobrir requisitos complexos, o que é uma falácia.</p>`,
            analogiaPokemon: `Aplicar um <strong>questionário</strong> é como usar a função "Mass Outbreak Report" do Pokédex para todos os treinadores da região de Paldea. Você pode perguntar "Você viu um Eevee hoje? (Sim/Não)" ou "Avalie de 1 a 5 a dificuldade de capturar um Tinkaton". Você obtém dados massivos e quantificáveis rapidamente. No entanto, você não descobre <em>a história emocionante</em> de como um treinador encontrou um Eevee shiny, nem <em>as estratégias específicas</em> que outro usou para finalmente capturar o Tinkaton. Essa profundidade qualitativa só seria obtida em uma conversa direta.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Analista Judiciário/TRF 1ª Região/2024 - Adaptada)",
                texto: "Ao conduzir a elicitação de requisitos para um sistema corporativo de grande escala, com usuários em diversas unidades da federação, a aplicação de questionários é a técnica mais eficiente, pois combina o amplo alcance geográfico com a capacidade de capturar requisitos detalhados e nuances do processo de trabalho que superam, em profundidade, as informações obtidas por meio de entrevistas individuais."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "O item inicia com uma premissa correta: questionários são eficientes para um público geograficamente disperso. Contudo, a assertiva se torna incorreta ao afirmar que a técnica permite capturar \"nuances\" e \"requisitos detalhados\" com uma profundidade superior à das entrevistas. Esta é a \"pegadinha\" central. A principal limitação dos questionários é justamente a sua superficialidade e a incapacidade de aprofundar respostas. Entrevistas, especialmente as semi-estruturadas e não estruturadas, são a ferramenta por excelência para a investigação profunda e a captura de detalhes contextuais e qualitativos. O examinador misturou a principal vantagem de uma técnica (alcance do questionário) com a principal vantagem de outra (profundidade da entrevista) para criar uma afirmação incorreta."
            }
        },
        {
            id: 3,
            titulo: "Observação (Shadowing)",
            teoria: `<p>A observação, ou <em>shadowing</em>, é uma técnica em que o analista de requisitos acompanha e observa os stakeholders executando suas tarefas no ambiente de trabalho real. Seu poder reside em revelar a diferença entre o processo prescrito (o que as pessoas dizem ou o que os manuais descrevem) e o processo real (o que as pessoas de fato fazem, incluindo atalhos, improvisações e \"workarounds\").</p><p>A Cebraspe costuma explorar a principal limitação desta técnica: ela é excelente para entender o sistema atual (\"As-Is\"), mas é inerentemente ruim para elicitar requisitos sobre funcionalidades inexistentes ou para definir o sistema futuro (\"To-Be\"). É difícil observar alguém executando uma tarefa que o novo sistema irá automatizar ou criar.</p>`,
            analogiaPokemon: `A <strong>observação</strong> é como seguir um treinador Pokémon durante sua jornada diária, sem interferir. Você o observa no Centro Pokémon e nota que, embora o manual diga para curar todos os Pokémon de uma vez, ele sempre cura seu Charizard por último (um detalhe do processo real). Você o vê na grama alta e percebe que ele usa Repels de uma maneira específica para otimizar a busca por um Pokémon raro (um \"workaround\"). Você está descobrindo como as coisas <em>são feitas</em>, não como o Professor Carvalho <em>gostaria</em> que um novo dispositivo (o sistema futuro) funcionasse.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Analista de TI/STJ/2024 - Adaptada)",
                texto: "Ao levantar requisitos para um novo sistema de controle de processos judiciais, um analista optou pela técnica de observação. Essa escolha é plenamente justificada, pois tal técnica é a mais indicada para descobrir tanto os fluxos de trabalho atuais quanto as necessidades futuras de automação e as funcionalidades inovadoras desejadas pelos magistrados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao generalizar a aplicação da técnica de observação como ideal para todos os tipos de requisitos. A observação é, de fato, excelente para mapear e compreender os fluxos de trabalho atuais (\"as-is\"). O erro da questão, e a maldade da banca, está em afirmar que ela é igualmente indicada para descobrir \"necessidades futuras de automação e as funcionalidades inovadoras\". Para esse fim, outras técnicas como entrevistas, brainstorming ou prototipação são muito mais eficazes, pois permitem discutir cenários hipotéticos e explorar ideias que não fazem parte da realidade observável. A observação olha para o presente e o passado; ela não consegue, por si só, projetar o futuro."
            }
        },
        {
            id: 4,
            titulo: "Brainstorming",
            teoria: `<p>Brainstorming é uma técnica de elicitação em grupo que visa gerar um grande volume de ideias sobre um tópico em um ambiente livre de críticas. O ponto nevrálgico, e o favorito da Cebraspe para criar \"pegadinhas\", é a regra fundamental: <strong>suspensão de julgamento</strong>. Durante a fase de geração de ideias, nenhuma crítica, debate ou avaliação é permitida. O foco é exclusivamente na <strong>quantidade</strong>, não na qualidade inicial das ideias. A análise, o refinamento e a filtragem ocorrem apenas em uma etapa posterior. A banca frequentemente elabora itens que afirmam, incorretamente, que as ideias são debatidas e selecionadas durante a própria sessão de brainstorming.</p>`,
            analogiaPokemon: `Uma sessão de <strong>brainstorming</strong> é como pedir a uma equipe de treinadores para listar todos os possíveis ataques que um novo Pokémon poderia aprender. A regra é clara: qualquer ideia é válida. Um diz \"Lança-Chamas!\", outro sugere \"Jato de Tinta Roxo!\", um terceiro grita \"Dança da Chuva de Pudim!\". O papel do facilitador (como um Professor Pokémon) é anotar tudo, sem deixar que ninguém diga \"Isso é ridículo!\" ou \"Pudim não é um ataque!\". O objetivo é ter uma lista enorme de possibilidades. Só depois, em outro momento, a equipe irá analisar a lista e decidir quais ataques fazem sentido para o tipo e a biologia do Pokémon.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Analista Legislativo/Câmara dos Deputados/2024 - Adaptada)",
                texto: "Durante a fase de elicitação de requisitos, a técnica de brainstorming se destaca por sua abordagem estruturada de debate, na qual os participantes apresentam suas ideias e as submetem imediatamente à crítica construtiva do grupo, a fim de refinar e validar cada requisito antes de seu registro formal, garantindo-se assim a qualidade em detrimento da quantidade."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva descreve o processo de brainstorming de forma diametralmente oposta ao seu princípio fundamental. O cerne do brainstorming é a geração irrestrita de ideias em um ambiente onde o julgamento e a crítica são temporariamente suspensos. O objetivo é maximizar a quantidade de ideias, partindo do pressuposto de que isso aumentará a probabilidade de surgirem soluções inovadoras. A etapa de crítica, debate e refinamento, descrita na questão, ocorre somente *após* o término da sessão de geração de ideias. A maldade da banca foi apresentar uma inversão completa da regra mais importante da técnica, transformando um processo de divergência (gerar muitas ideias) em um de convergência (filtrar e selecionar)."
            }
        },
        {
            id: 5,
            titulo: "JAD (Joint Application Development)",
            teoria: `<p>JAD (Desenvolvimento Conjunto de Aplicações) é uma técnica de elicitação realizada por meio de workshops altamente estruturados e mediados. O seu diferencial é reunir em um mesmo ambiente todos os stakeholders-chave (clientes, usuários finais, gestores, analistas e desenvolvedores) para uma sessão intensiva e colaborativa. O objetivo é acelerar a definição de requisitos e gerar consenso.</p><p>A Cebraspe costuma focar nos seguintes pontos para \"pegadinhas\": 1) A <strong>formalidade e estrutura</strong> do JAD, que possui papéis bem definidos (Sponsor, Facilitador, Scribes, etc.), em contraste com reuniões informais; 2) O <strong>propósito</strong>, que é a elicitação e o consenso de requisitos, e não apenas a geração de ideias (como no brainstorming); 3) A <strong>composição do grupo</strong>, que obrigatoriamente inclui a área de negócio/usuários.</p>`,
            analogiaPokemon: `Uma sessão <strong>JAD</strong> é como uma cúpula de emergência convocada pelo Professor Carvalho para projetar uma nova Pokédex. Ele não entrevista cada um separadamente. Em vez disso, ele coloca na mesma sala: o Presidente da Silph Co. (o <em>Sponsor</em>), a Enfermeira Joy (representando os <em>usuários</em> de Centros Pokémon), um Líder de Ginásio como o Brock (representando <em>usuários</em> avançados), um programador da Devon Corp. (o <em>desenvolvedor</em>) e um Alakazam usando seu poder psíquico para registrar tudo (o <em>Scribe</em>). A sessão é intensa e mediada pelo Professor (o <em>Facilitador</em>), garantindo que, ao final, todos saiam com um projeto de Pokédex acordado e bem definido.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Especialista em Regulação/ANATEL/2025 - Adaptada)",
                texto: "A metodologia JAD consiste em uma série de reuniões informais, de caráter predominantemente técnico, nas quais a equipe de desenvolvimento, de forma isolada, delibera sobre os requisitos do sistema. A participação de usuários finais, embora possível, é considerada opcional, para não prejudicar a agilidade das decisões de projeto."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva descaracteriza completamente a técnica JAD em seus pontos fundamentais. Primeiro, as sessões JAD são <strong>altamente formais e estruturadas</strong>, não informais. Segundo, seu caráter não é \"predominantemente técnico\" nem realizado de forma \"isolada\" pela equipe de desenvolvimento. O \"J\" de JAD significa \"Joint\" (Conjunto), e a premissa central da técnica é justamente a <strong>colaboração intensiva e obrigatória</strong> entre a equipe de TI e os stakeholders do negócio (usuários, gestores). A maldade do examinador foi tripla: negar a formalidade da sessão, isolar a equipe de TI e, o erro mais grave, tratar a participação do usuário como opcional, quando ela é a própria razão de ser da técnica."
            }
        },
        {
            id: 6,
            titulo: "Prototipação (Prototyping)",
            teoria: `<p>A prototipação consiste em construir uma versão preliminar e tangível do sistema, que pode variar de um simples esboço em papel (baixa fidelidade) a uma maquete interativa (alta fidelidade). O seu objetivo central, no contexto da elicitação, é <strong>clarificar, validar e descobrir requisitos</strong> ao permitir que os stakeholders \"usem\" o sistema antes de ele ser de fato construído.</p><p>A Cebraspe costuma explorar a finalidade do protótipo: o candidato deve saber que o foco principal é a <strong>validação com o usuário</strong> e a elicitação de requisitos de interface e usabilidade. Um erro comum induzido pela banca é afirmar que o objetivo primário do protótipo é testar a arquitetura ou criar a base de código do sistema final (o que pode acontecer em protótipos evolutivos, mas não é sua razão de ser na elicitação).</p>`,
            analogiaPokemon: `A <strong>prototipação</strong> é como a Silph Co. criar um modelo de argila da nova \"Ultra Ball\" antes de iniciar a produção em massa. Eles entregam o modelo de argila para treinadores experientes. Um treinador pode dizer: \"É difícil de segurar, precisa de um relevo aqui\" (requisito de usabilidade). Outro pode notar: \"O botão de ativação é muito sensível, vai abrir na mochila\" (requisito funcional). Com base nesse feedback, a Silph Co. ajusta o molde. O protótipo de argila não serve para testar a \"tecnologia de captura avançada\" (a arquitetura interna), mas sim para garantir que o design e a interação com o produto (a interface) estejam corretos antes do investimento principal.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Analista de Controle Externo/TCU/2025 - Adaptada)",
                texto: "A utilização de protótipos no levantamento de requisitos tem como foco principal a validação de aspectos não funcionais, como a arquitetura de software e o desempenho do banco de dados. O protótipo, nesse contexto, serve como uma prova de conceito técnica para a equipe de desenvolvimento, sendo a interação com o usuário final uma fase secundária e posterior."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva inverte a prioridade e o foco da prototipação como técnica de elicitação. O objetivo primário de um protótipo nesse contexto é justamente a <strong>interação com o usuário final</strong> para validar e elicitar requisitos, especialmente os funcionais e de interface. A validação de aspectos técnicos como arquitetura e desempenho, embora possa ser um benefício secundário ou o foco de outro tipo de protótipo (técnico), não é a principal razão para se usar a prototipação na fase de levantamento de requisitos com stakeholders. A maldade da banca foi deslocar o propósito da técnica do eixo \"usuário-sistema\" para o eixo \"desenvolvedor-tecnologia\", descaracterizando seu papel fundamental na comunicação e no entendimento das necessidades do cliente."
            }
        },
        {
            id: 7,
            titulo: "Análise de Documentos (Document Analysis)",
            teoria: `<p>A análise de documentos é a técnica de elicitação que envolve o estudo da documentação existente relacionada ao negócio ou ao sistema. Isso inclui manuais, formulários, relatórios, políticas organizacionais, legislações, e documentação de sistemas legados. É útil para o analista se familiarizar com o domínio e a terminologia.</p><p>O ponto nevrálgico, frequentemente explorado pela Cebraspe, reside em suas limitações: a documentação pode estar <strong>desatualizada, incompleta ou, crucialmente, pode não refletir como os processos realmente funcionam na prática</strong>. A banca costuma apresentar essa técnica como uma fonte de informação completa e fidedigna, ignorando a comum discrepância entre o processo documentado e o processo real.</p>`,
            analogiaPokemon: `Realizar uma <strong>análise de documentos</strong> é como tentar entender a região de Kanto apenas lendo a primeira edição do Guia do Treinador. O guia é um bom começo: ele mostra os 151 Pokémon originais, os mapas das cidades e as regras da Liga Pokémon (requisitos documentados). No entanto, esse guia não menciona a descoberta posterior dos tipos Aço e Sombrio, nem a existência dos Ovos Pokémon ou das Ilhas Sevii (informações desatualizadas ou incompletas). Além disso, o guia não descreve as estratégias secretas que os treinadores veteranos usam e que não estão em nenhum manual (o processo real vs. o documentado).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Analista de Planejamento/MPOG/2024 - Adaptada)",
                texto: "A análise de documentos organizacionais, como planos de negócio e manuais de procedimento, é considerada uma fonte primária e totalmente confiável para a elicitação de requisitos, garantindo, por si só, um levantamento completo e preciso, visto que tais documentos invariavelmente representam o estado atual e real das operações da empresa."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva comete uma generalização indevida e perigosa ao classificar a análise de documentos como \"totalmente confiável\" e \"suficiente por si só\". A principal armadilha desta técnica, e o que a questão ignora, é que a documentação formal frequentemente está defasada em relação à prática operacional. Processos evoluem, atalhos são criados e regras são informalmente alteradas, mas os manuais nem sempre são atualizados para refletir essa realidade. Portanto, embora útil, a análise de documentos deve ser complementada por outras técnicas (como observação e entrevistas) para validar as informações e capturar o processo \"as-is\" real. A maldade do examinador foi usar advérbios de modo absolutos (\"totalmente\", \"invariavelmente\") para conferir um grau de certeza e completude que a técnica não possui."
            }
        },
        {
            id: 8,
            titulo: "Etnografia (Ethnography)",
            teoria: `<p>A etnografia é uma técnica de observação qualitativa e imersiva de longa duração. O analista passa um tempo considerável (dias, semanas ou meses) no ambiente do stakeholder, agindo como um \"antropólogo\" para entender a cultura do trabalho, as interações sociais, as crenças e os valores que moldam a execução das tarefas. O objetivo é descobrir requisitos implícitos e latentes, que não são verbalizados em entrevistas nem evidentes em observações de curto prazo. A Cebraspe costuma criar assertivas que confundem etnografia com a observação simples (<em>shadowing</em>), descrevendo-a como uma técnica rápida e focada apenas na sequência de tarefas, ignorando seu pilar central: a análise do contexto social e cultural.</p>`,
            analogiaPokemon: `Se a <em>Observação</em> é passar uma tarde vendo um treinador batalhar, a <strong>Etnografia</strong> é se matricular na mesma academia de treinadores, viver no mesmo dormitório e viajar com ele por toda a região de Johto. Você não apenas vê <em>como</em> ele treina seu Typhlosion (as tarefas), mas entende <em>por que</em> ele usa certas estratégias (a cultura do seu clã de origem), percebe como a rivalidade com outro treinador afeta suas decisões (a dinâmica social) e descobre rituais de boa sorte que ele faz antes de cada batalha de ginásio (requisitos culturais implícitos). É uma imersão completa para um entendimento profundo.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Ciência de Dados/Polícia Federal/2025 - Adaptada)",
                texto: "A técnica de etnografia é um método de elicitação de requisitos ágil e de curta duração, sinônimo de observação direta (shadowing), que consiste em acompanhar um usuário durante algumas horas para mapear de forma rápida e superficial as tarefas executadas em seu posto de trabalho."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva comete um erro crasso ao igualar etnografia e observação, e ao caracterizar a primeira como \"rápida\" e \"superficial\". Estes conceitos são distintos. A observação (<em>shadowing</em>) pode ser de curta duração e foca no \"o quê\" e no \"como\" de uma tarefa. A etnografia, por outro lado, é fundamentalmente uma técnica de <strong>longa duração, imersiva e profunda</strong>, que busca entender o \"porquê\" das ações dentro de seu contexto social e cultural. A maldade da banca foi esvaziar o significado da etnografia, reduzindo-a à sua técnica correlata mais simples para induzir o candidato que tem apenas um conhecimento superficial dos termos a concordar com a sinonímia incorreta."
            }
        },
        {
            id: 9,
            titulo: "Storytelling (Contação de Histórias)",
            teoria: `<p>Storytelling é uma técnica de elicitação que incentiva os stakeholders a contarem histórias sobre suas experiências de trabalho. Em vez de responder a perguntas diretas sobre requisitos, o usuário narra eventos passados, desafios, sucessos e frustrações. O poder da técnica está em sua capacidade de revelar contexto, regras de negócio implícitas, sequências de eventos e a dimensão emocional e cultural do trabalho, que são difíceis de capturar com outras técnicas.</p><p>O ponto de confusão explorado pela Cebraspe é a distinção entre a <em>técnica</em> de Storytelling e os <em>artefatos</em> que podem derivar dela, como Histórias de Usuário (User Stories) ou Casos de Uso. Storytelling é o ato informal de coletar a narrativa; Histórias de Usuário e Casos de Uso são formas estruturadas de documentar os requisitos extraídos dessas narrativas.</p>`,
            analogiaPokemon: `Usar <strong>Storytelling</strong> na elicitação é como pedir ao pescador na rota 12 para contar a história de \"como ele pescou aquele Magikarp gigante\". Ele não listará especificações (\"Requisito: a vara precisa suportar 50kg\"). Ele contará uma narrativa: \"Era uma manhã de neblina, a maré estava estranha, usei uma isca especial que meu avô me ensinou...\". Dessa história, um engenheiro da Silph Co. pode extrair requisitos para uma nova Super Vara de Pescar: \"precisa funcionar em condições de neblina\", \"deve ter um compartimento para iscas especiais\", \"necessita de um mecanismo de trava de alta resistência\". A história é a fonte; a especificação da vara é o requisito documentado.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Analista de Sistemas/Serpro/2025 - Adaptada)",
                texto: "A técnica de Storytelling é um método formal de documentação de requisitos, no qual o analista de sistemas redige Histórias de Usuário (User Stories) seguindo o formato padrão \"Como um <papel>, eu quero <funcionalidade>, para que <benefício>\", que servem como base para o planejamento das iterações em metodologias ágeis."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva comete um erro de definição fundamental ao confundir a técnica de elicitação (Storytelling) com o artefato de documentação (História de Usuário). Storytelling é o processo informal e conversacional de <em>coletar</em> as narrativas do usuário. A História de Usuário (User Story) é um formato estruturado e conciso para <em>registrar</em> um requisito extraído dessas ou de outras conversas. Enquanto o Storytelling é exploratório e rico em contexto, a História de Usuário é uma formalização sucinta de uma necessidade. A maldade do examinador foi descrever o artefato (User Story) e atribuir essa descrição à técnica de coleta (Storytelling), misturando dois conceitos distintos, ainda que relacionados, do universo ágil e da engenharia de requisitos."
            }
        }
    ]
});