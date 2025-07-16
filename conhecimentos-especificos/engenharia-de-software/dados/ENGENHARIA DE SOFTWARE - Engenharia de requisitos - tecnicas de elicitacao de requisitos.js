todosOsDados.push({
    tituloPrincipal: "Engenharia de requisitos - técnicas de elicitação de requisitos",
    conceitos: [
        {
            id: 1,
            titulo: "Entrevista",
            teoria: `
                <p>A entrevista é uma técnica de elicitação de requisitos que envolve interações diretas entre o analista e os stakeholders, com o objetivo de extrair informações detalhadas sobre necessidades, expectativas e restrições do sistema. Pode ser <strong>estruturada</strong> (roteiro fixo), <strong>semi-estruturada</strong> (roteiro flexível) ou <strong>não estruturada</strong> (conversa aberta).</p>
                <ul>
                    <li><strong>Vantagens</strong>: profundidade de informações, clarificação imediata de dúvidas.</li>
                    <li><strong>Desvantagens</strong>: tempo-intensiva, viés do entrevistador, dependência da disponibilidade dos stakeholders.</li>
                    <li><strong>Armadilha Cebraspe</strong>: confundir "não estruturada" com "desorganizada" (a não estruturada ainda tem objetivos claros, mas sem roteiro fixo).</li>
                </ul>`,
            analogiaPokemon: `É como a Nurse Joy entrevistar um Treinador após uma batalha para entender o que deu errado. Se for <strong>estruturada</strong>, ela segue um checklist fixo ("Seu Pokémon desmaiou? Usou poções?"). Se for <strong>semi-estruturada</strong>, ela adapta as perguntas conforme as respostas ("Por que não usou um tipo água contra o rival de fogo?").`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A entrevista não estruturada, por não possuir um roteiro pré-definido, é considerada uma técnica menos eficaz que as demais para elicitação de requisitos, pois não permite a obtenção de informações consistentes e pode resultar em dados irrelevantes."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva generaliza indevidamente a eficácia da entrevista não estruturada. Embora ela não tenha roteiro fixo, ainda é guiada por objetivos claros e pode revelar requisitos não previstos inicialmente ('requisitos emergentes'). A Cebraspe costuma induzir ao erro associando 'não estruturado' a 'ineficaz', mas a técnica é válida em contextos exploratórios ou com stakeholders criativos."
            }
        },
        {
            id: 2,
            titulo: "Brainstorming",
            teoria: `
                <p>Brainstorming é uma técnica de elicitação que visa gerar ideias criativas e soluções inovadoras por meio de sessões colaborativas com múltiplos stakeholders.</p>
                <ul>
                    <li><strong>Regras básicas</strong>: não criticar ideias, quantidade sobre qualidade, encorajar combinações/melhorias.</li>
                    <li><strong>Vantagens</strong>: diversidade de perspectivas, identificação de requisitos não óbvios.</li>
                    <li><strong>Desvantagens</strong>: dominância de participantes, dispersão de foco.</li>
                    <li><strong>Nuance Cebraspe</strong>: diferenciar brainstorming de <strong>workshop</strong> (este último é mais estruturado e inclui atividades práticas).</li>
                </ul>`,
            analogiaPokemon: `É como um treinador reunir seu time de Pokémon para planejar estratégias contra um ginásio. Pikachu sugere ataques elétricos, Charizard propõe voar para evitar terreno, e Bulbasaur lembra do poder dos ataques de grama. Ninguém critica as ideias inicialmente – o objetivo é gerar opções!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O brainstorming, por ser uma técnica baseada em liberdade ideativa, dispensa a figura de um facilitador, uma vez que a ausência de críticas garante automaticamente a produtividade da sessão."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva comete um erro grave ao sugerir que o brainstorming não requer facilitador. Na prática, o facilitador é essencial para: 1) Garantir adesão às regras (ex.: evitar críticas prematuras), 2) Direcionar o foco para o problema central, e 3) Documentar as ideias geradas. A Cebraspe explora a falsa sensação de 'autossuficiência' da técnica."
            }
        },
        {
            id: 3,
            titulo: "Observação",
            teoria: `
                <p>A observação é uma técnica de elicitação onde o analista coleta requisitos diretamente do ambiente de trabalho do usuário, sem interferência. Pode ser:</p>
                <ul>
                    <li><strong>Participante</strong>: analista se envolve nas atividades</li>
                    <li><strong>Não participante</strong>: analista apenas observa</li>
                    <li><strong>Passiva</strong>: registro de eventos naturais</li>
                </ul>
                <p><strong>Pontos críticos</strong>:</p>
                <ul>
                    <li>Captura requisitos implícitos (não verbalizados)</li>
                    <li>Risco de efeito Hawthorne (usuários mudam comportamento por saberem que estão sendo observados)</li>
                    <li>Diferenciação sutil: observação ≠ shadowing (este último é contínuo e focado em processos específicos)</li>
                </ul>`,
            analogiaPokemon: `É como o Professor Carvalho observando treinadores iniciantes para melhorar as Pokébolas. Na versão participante, ele ajuda a capturar Pokémon. Na não participante, apenas anota erros comuns. Já o efeito Hawthorne seria os treinadores tentarem impressioná-lo usando apenas Pokémons raros.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A observação passiva é a técnica mais eficaz para elicitar requisitos de sistemas complexos, pois elimina completamente o viés do observador e garante a obtenção de dados 100% fiéis ao comportamento real dos usuários."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva contém três armadilhas: 1) Generalização ('mais eficaz' - depende do contexto), 2) Impossibilidade de eliminar totalmente o viés (a própria escolha do que observar introduz viés), e 3) Falsa ideia de fidelidade absoluta (até a presença física do observador pode alterar comportamentos). A Cebraspe costuma testar o entendimento sobre as limitações inerentes às técnicas qualitativas."
            }
        },
        {
            id: 4,
            titulo: "Prototipagem",
            teoria: `
                <p>A prototipagem é uma técnica iterativa que utiliza modelos tangíveis (de baixa ou alta fidelidade) para elicitar requisitos.</p>
                <p><strong>Aspectos críticos</strong>:</p>
                <ul>
                    <li><strong>Baixa fidelidade</strong>: esboços/wireframes (rápidos, focados em fluxos)</li>
                    <li><strong>Alta fidelidade</strong>: simulam funcionalidades (mais caros, mas validam UX)</li>
                    <li><strong>Riscos</strong>:
                        <ul>
                            <li>Stakeholders confundirem protótipo com produto final</li>
                            <li>Viés de 'ancoragem' (fixação nas primeiras versões)</li>
                        </ul>
                    </li>
                    <li><strong>Diferenciação Cebraspe</strong>: prototipagem ≠ prova de conceito (PoC foca em viabilidade técnica, não em requisitos)</li>
                </ul>`,
            analogiaPokemon: `É como desenvolver uma nova Pokébola. Primeiro faz-se um protótipo de papel (baixa fidelidade) para testar o tamanho. Depois, um modelo eletrônico (alta fidelidade) que simula a captura. O risco? O Professor Carvalho achar que o protótipo já está pronto para produção em massa!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Na prototipagem evolucionária, o protótipo inicial é descartado após a validação dos requisitos, enquanto na prototipagem descartável, o protótipo evolui continuamente até se tornar o sistema final."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva inverte os conceitos propositalmente: <strong>Descartável</strong>: protótipo é eliminado após validação; <strong>Evolucionária</strong>: protótipo é refinado até virar produto final. A Cebraspe explora a confusão entre os tipos de prototipagem, comum em candidatos apressados. O conhecimento necessário era: 1) Diferença conceitual entre as abordagens, e 2) Entender que a evolucionária agrega valor ao produto final."
            }
        },
        {
            id: 5,
            titulo: "Workshop de Requisitos (JAD)",
            teoria: `
                <p>Joint Application Development (JAD) é uma técnica estruturada que reúne stakeholders-chave em sessões colaborativas intensivas para elicitação e validação de requisitos.</p>
                <p><strong>Elementos essenciais</strong>:</p>
                <ul>
                    <li><strong>Papéis</strong>: facilitador, especialista de negócio, analista, scribe</li>
                    <li><strong>Diferenciais</strong>:
                        <ul>
                            <li>Sessões concentradas (2-5 dias)</li>
                            <li>Uso de técnicas complementares (brainstorming, prototipagem)</li>
                            <li>Documentação em tempo real</li>
                        </ul>
                    </li>
                    <li><strong>Armadilha Cebraspe</strong>: confundir JAD com reuniões convencionais (JAD exige preparação rigorosa e meta clara)</li>
                </ul>`,
            analogiaPokemon: `É como a Liga Pokémon organizar um torneio relâmpago para decidir novas regras de batalha. Líderes de ginásio, juízes e treinadores debatem em sessões intensivas, com um mediador (como o Professor Carvalho) garantindo foco. No final, as regras são documentadas na Pokédex oficial!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Workshops JAD são recomendados para projetos com escopo mal definido, pois a ausência de preparação prévia estimula a criatividade dos participantes e reduz o tempo gasto com documentação formal."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra em três pontos típicos da Cebraspe: 1) <strong>Preparação</strong>: JAD exige definição clara de objetivos e participantes antes das sessões; 2) <strong>Escopo</strong>: justamente projetos com escopo mal definido precisam de estrutura (não de 'improviso criativo'); e 3) <strong>Documentação</strong>: um dos pilares do JAD é a produção formal de artefatos. A pegadinha está em associar 'criatividade' com 'falta de estrutura', quando na verdade o JAD balanceia ambos."
            }
        }
    ]
});