todosOsDados.push({
    tituloPrincipal: "ENGENHARIA DE SOFTWARE - Engenharia de requisitos - histórias de usuário",
    conceitos: [
        {
            id: 1,
            titulo: "Histórias de Usuário (User Stories)",
            teoria: `
                <p><strong>Histórias de usuário</strong> são descrições concisas de funcionalidades desejadas em um sistema, escritas sob a perspectiva do usuário final. Seguem o formato: <strong>"Como [papel], eu quero [ação] para que [benefício]."</strong> Características essenciais:</p>
                <ul>
                    <li><strong>INVEST</strong> (Independent, Negotiable, Valuable, Estimable, Small, Testable)</li>
                    <li>Critérios de aceitação claros (condições para validação)</li>
                    <li>Focam em <strong>valor entregue</strong>, não em detalhes técnicos</li>
                    <li>Diferem de <strong>casos de uso</strong> (mais detalhados e formais)</li>
                </ul>
                <p><strong>Pegadinhas Cebraspe:</strong></p>
                <ol>
                    <li>Confundir "histórias" com "casos de uso" (o primeiro é informal, o último é estruturado)</li>
                    <li>Assumir que histórias NÃO podem ser alteradas (são negociáveis)</li>
                    <li>Ignorar critérios de aceitação (são obrigatórios)</li>
                </ol>`,
            analogiaPokemon: `Uma história de usuário é como um treinador pedir ao Professor Carvalho: "Como Treinador, eu quero uma Pokébola para capturar Pikachu e fortalecer meu time." O critério de aceitação seria "Pikachu capturado com sucesso". Se o pedido fosse "Como Treinador, eu quero um algoritmo de captura baseado em IA", já seria um requisito técnico (não uma história).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Histórias de usuário são documentos imutáveis que descrevem requisitos técnicos detalhados de um sistema, sendo escritas exclusivamente pela equipe de desenvolvimento para garantir precisão na implementação."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra em 4 pontos: 1) Histórias são negociáveis (não imutáveis); 2) Focam em valor para o usuário, não em detalhes técnicos; 3) São escritas com o usuário/cliente, não apenas pelo time de dev; 4) A precisão vem dos critérios de aceitação, não da descrição técnica. A maldade foi misturar conceitos de histórias com especificações formais."
            }
        },
        {
            id: 2,
            titulo: "Critérios de Aceitação em Histórias de Usuário",
            teoria: `<p><strong>Critérios de aceitação (CA)</strong> são condições obrigatórias que uma história de usuário deve satisfazer para ser considerada "pronta". Características-chave:</p>
                <ul>
                    <li>São <strong>testáveis</strong> (ex.: "O sistema deve validar CPF com 11 dígitos")</li>
                    <li>Definidos <strong>antes</strong> do desenvolvimento (evitam ambiguidades)</li>
                    <li>Diferem de <strong>definição de pronto</strong> (que inclui aspectos técnicos como código revisado)</li>
                    <li>Podem ser escritos como <strong>cenários</strong> (Given-When-Then)</li>
                </ul>
                <p><strong>Pegadinhas Cebraspe:</strong></p>
                <ol>
                    <li>Confundir CA com tasks (tarefas técnicas)</li>
                    <li>Assumir que CA são opcionais</li>
                    <li>Ignorar que CA devem ser mensuráveis (ex.: "rápido" vs. "tempo de resposta < 2s")</li>
                </ol>`,
            analogiaPokemon: `Um critério de aceitação é como as regras de um ginásio Pokémon: "Para vencer, o treinador deve derrotar o líder Brock usando apenas Pokémon do tipo Água." Se o critério fosse "Derrotar Brock de forma eficiente", seria inválido (não testável).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Critérios de aceitação são elaborados após a implementação da funcionalidade, servindo como checklist para validação interna pela equipe de QA, sem necessidade de participação do usuário."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva contém 3 erros graves: 1) CA devem ser definidos antes do desenvolvimento (não depois); 2) Envolvem o usuário/cliente na validação (não apenas QA); 3) Não são apenas 'checklists' – são contratos de valor entregue. A pegadinha foi inverter a ordem do processo e excluir o usuário."
            }
        },
        {
            id: 3,
            titulo: "INVEST em Histórias de Usuário",
            teoria: `<p>O acrônimo <strong>INVEST</strong> define atributos de qualidade para histórias de usuário:</p>
                <ul>
                    <li><strong>Independentes</strong>: Não devem depender de outras histórias para serem implementadas</li>
                    <li><strong>Negociáveis</strong>: Detalhes podem ser ajustados (exceto o valor central)</li>
                    <li><strong>Valiosas</strong>: Devem entregar benefício tangível ao usuário</li>
                    <li><strong>Estimáveis</strong>: A equipe deve conseguir prever esforço</li>
                    <li><strong>Pequenas (Small)</strong>: Deve ser possível implementar em um sprint</li>
                    <li><strong>Testáveis</strong>: Precisam ter critérios de aceitação claros</li>
                </ul>
                <p><strong>Armadilhas Cebraspe:</strong></p>
                <ol>
                    <li>Confundir "Negociável" com "Incompleto" (o valor principal é fixo)</li>
                    <li>Assumir que "Pequenas" significa "triviais" (podem ser complexas, mas viáveis em um sprint)</li>
                    <li>Ignorar que "Independentes" pode exigir refatoração do backlog</li>
                </ol>`,
            analogiaPokemon: `Uma história que segue INVEST é como capturar um Pokémon lendário: Independente (não precisa derrotar a Equipe Rocket antes); Negociável (pode usar Master Ball ou batalhar); Valiosa (Mewtwo fortalece o time); Estimável (sabe-se que requer nível 70+); Pequena (uma missão, não toda a liga); Testável ("Mewtwo está no time" é verificável).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Histórias de usuário que não podem ser concluídas em um sprint devem ser divididas em tasks técnicas, mantendo-se como um único item no backlog para preservar seu valor negociável."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra em 2 pontos críticos: 1) Violação do 'Small': Histórias inviáveis em um sprint devem ser divididas em outras histórias (não em tasks); 2) Tasks não preservam valor negociável – são detalhes de implementação. A pegadinha foi sugerir que tasks resolvem o problema do tamanho, ignorando o princípio de 'Independentes'."
            }
        }
    ]
});