todosOsDados.push({
    tituloPrincipal: "ENGENHARIA DE SOFTWARE - Engenharia de requisitos - especificação de requisitos",
    conceitos: [
        {
            id: 1,
            titulo: "Requisitos Funcionais vs. Não Funcionais",
            teoria: `
                <p><strong>Requisitos Funcionais</strong> descrevem <strong>o que o sistema deve fazer</strong>, incluindo funcionalidades, comportamentos e interações (ex.: "O sistema deve calcular o IMC do usuário").</p>
                <p><strong>Requisitos Não Funcionais</strong> definem <strong>como o sistema deve ser</strong>, abrangendo atributos de qualidade, restrições e critérios de desempenho (ex.: "O sistema deve responder em menos de 2 segundos").</p>
                <p><strong>Nuance Cebraspe</strong>: Confundir "não funcionais" com "restrições de negócio" (ex.: "O sistema deve ser compatível com legislação X" é uma restrição, não um requisito não funcional).</p>`,
            analogiaPokemon: `Pikachu usando <strong>Choque do Trovão</strong> (funcional: ação específica) vs. Pikachu com <strong>Velocidade Estadão 252</strong> (não funcional: atributo de desempenho).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "Requisitos não funcionais, como 'O sistema deve armazenar dados de usuários criptografados', descrevem explicitamente as funcionalidades que o sistema deve executar, sendo, portanto, uma subclasse dos requisitos funcionais."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva <strong>troca conceitos</strong>: criptografia é um requisito <strong>não funcional</strong> (segurança), não funcional. A maldade está em usar 'executar' para induzir a erro, pois requisitos não funcionais <strong>não descrevem funcionalidades</strong>, mas <strong>atributos</strong>."
            }
        },
        {
            id: 2,
            titulo: "Técnicas de Elicitação de Requisitos",
            teoria: `<p>Técnicas comuns:</p>
                <ul>
                    <li><strong>Entrevistas</strong>: Diretas com stakeholders (alto detalhamento, mas custoso).</li>
                    <li><strong>Brainstorming</strong>: Ideias colaborativas (rápido, mas pode gerar ruído).</li>
                    <li><strong>Prototipagem</strong>: Modelos tangíveis para validação (eficaz para feedback, mas exige recursos).</li>
                </ul>
                <p><strong>Pegadinha Cebraspe</strong>: "Observação" é uma técnica passiva (analisa comportamento real), enquanto "Questionário" é ativa (coleta direta). Não são intercambiáveis!</p>`,
            analogiaPokemon: `Entrevista = Batalha com Oak (diálogo direto). Brainstorming = Reunião dos líderes de Ginásio (várias ideias). Prototipagem = Usar um Ditto para simular um Pokémon (modelo rápido).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "A técnica de observação, por ser ativa e envolver interação direta com os usuários, é a mais indicada para elicitar requisitos em projetos com escopo amplo e prazos curtos, substituindo vantajosamente questionários."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva <strong>inverte características</strong>: observação é <strong>passiva</strong> (não requer interação). A pegadinha está em associar 'ativa' e 'prazos curtos' (observação é lenta). Questionários são melhores para escopos amplos."
            }
        },
        {
            id: 3,
            titulo: "Validação vs. Verificação de Requisitos",
            teoria: `<ul>
                    <li><strong>Verificação</strong>: "O sistema está sendo construído corretamente?" (análise técnica, revisões, checklists).</li>
                    <li><strong>Validação</strong>: "O sistema correto está sendo construído?" (confirmação com stakeholders, testes de aceitação).</li>
                </ul>
                <p><strong>Diferença sutil</strong>: Verificação é interna (equipe); validação é externa (cliente). Cebraspe adora cobrar essa distinção!</p>`,
            analogiaPokemon: `Verificação = Nurse Joy checando os PCs do Centro Pokémon (conformidade). Validação = Ash testando seu Pikachu em uma batalha real (adequação ao objetivo).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "A validação de requisitos ocorre durante todo o ciclo de vida do software, sendo realizada exclusivamente pela equipe de desenvolvimento por meio de técnicas como inspeção e walkthrough."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva <strong>mistura conceitos</strong>: validação é com stakeholders, não só com a equipe. 'Inspeção/walkthrough' são técnicas de <strong>verificação</strong>. A maldade está em 'exclusivamente' e 'ciclo de vida' (validação tem fases específicas, como testes de aceitação)."
            }
        }
    ]
});