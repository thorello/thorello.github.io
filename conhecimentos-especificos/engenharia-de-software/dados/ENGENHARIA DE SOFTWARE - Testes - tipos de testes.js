todosOsDados.push({
    tituloPrincipal: "Testes - tipos de testes",
    conceitos: [
        {
            id: 1,
            titulo: "Testes Unitários",
            teoria: `
                <p><strong>Testes unitários</strong> avaliam unidades individuais de código (métodos, funções ou classes) de forma isolada, utilizando <em>mocks</em> ou <em>stubs</em> para simular dependências externas.</p>
                <ul>
                    <li><strong>Granularidade fina</strong>: foco em uma única funcionalidade</li>
                    <li><strong>Velocidade</strong>: executados rapidamente (milissegundos por teste)</li>
                    <li><strong>Independência</strong>: não dependem de recursos externos</li>
                    <li><strong>Cobertura</strong>: idealmente cobrem caminhos lógicos (if-else, exceções)</li>
                </ul>
                <p><strong>Pegadinha comum</strong>: Confundir com testes de integração.</p>`,
            analogiaPokemon: "Treinar um Pikachu para usar Thunderbolt em laboratório controlado, sem outros Pokémon ou chuva (dependências externas).",
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Testes unitários são caracterizados por validarem a integração entre módulos de um sistema, como a comunicação entre uma API e um banco de dados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva descreve testes de integração, não unitários. Testes unitários validam unidades isoladas, enquanto testes de integração avaliam interações entre componentes."
            }
        },
        {
            id: 2,
            titulo: "Testes de Integração",
            teoria: `
                <p><strong>Testes de integração</strong> verificam a interação entre componentes ou sistemas, expondo falhas em interfaces e fluxos de dados.</p>
                <ul>
                    <li><strong>Escopo</strong>: combina duas ou mais unidades testadas isoladamente</li>
                    <li><strong>Dependências</strong>: requerem ambientes parcialmente configurados</li>
                    <li><strong>Tipos</strong>:
                        <ul>
                            <li><strong>Vertical</strong>: testa camadas de uma mesma funcionalidade</li>
                            <li><strong>Horizontal</strong>: testa serviços paralelos</li>
                        </ul>
                    </li>
                </ul>
                <p><strong>Pegadinha comum</strong>: Afirmar que dispensam totalmente o uso de mocks.</p>`,
            analogiaPokemon: "Testar o combo de ataques do Charizard (Flamethrower) e Blastoise (Hydro Pump) em ginásio - foco na interação, não nos ataques individuais.",
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Testes de integração dispensam o uso de mocks ou stubs, pois avaliam exclusivamente o comportamento de componentes em ambiente de produção real."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao generalizar que mocks nunca são usados. Em testes de integração, ainda podem ser necessários para isolar componentes não testados."
            }
        },
        {
            id: 3,
            titulo: "Testes de Sistema",
            teoria: `
                <p><strong>Testes de sistema</strong> avaliam o software completo em ambiente que simula o real, verificando requisitos funcionais e não-funcionais.</p>
                <ul>
                    <li><strong>Escopo end-to-end</strong>: cobre fluxos completos do usuário</li>
                    <li><strong>Requisitos não-funcionais</strong>: desempenho, segurança, usabilidade</li>
                    <li><strong>Ambiente</strong>: o mais próximo possível do production</li>
                </ul>
                <p><strong>Pegadinha comum</strong>: Confundir com testes de aceitação (que envolvem o cliente).</p>`,
            analogiaPokemon: "Batalha oficial da Liga Pokémon, onde seu time completo é testado em condições reais (arena, juiz, regras).",
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Testes de sistema são equivalentes a testes de aceitação, pois ambos exigem a participação do usuário final para validar requisitos."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Testes de sistema são conduzidos pela equipe técnica, enquanto testes de aceitação envolvem o cliente. A equivalência proposta é falsa."
            }
        },
        {
            id: 4,
            titulo: "Testes de Regressão",
            teoria: `
                <p><strong>Testes de regressão</strong> verificam se novas alterações não introduziram defeitos em funcionalidades validadas.</p>
                <ul>
                    <li><strong>Objetivo</strong>: garantir que modificações não quebraram o existente</li>
                    <li><strong>Gatilhos</strong>: mudanças no código, atualizações, correções</li>
                    <li><strong>Estratégias</strong>:
                        <ul>
                            <li>Completa: retesta toda a suite</li>
                            <li>Seletiva: foca áreas impactadas</li>
                        </ul>
                    </li>
                    <li><strong>Automatização</strong>: crítica para projetos grandes</li>
                </ul>
                <p><strong>Pegadinha comum</strong>: Limitar apenas a novas funcionalidades.</p>`,
            analogiaPokemon: "Verificar se o novo movimento aprendido não fez o Pokémon esquecer ataques já dominados.",
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Testes de regressão devem ser realizados apenas quando novas funcionalidades são adicionadas ao sistema, pois seu principal propósito é validar as novidades implementadas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Testes de regressão são essenciais também em correções de bugs, atualizações e qualquer mudança que possa impactar funcionalidades existentes."
            }
        },
        {
            id: 5,
            titulo: "Testes de Aceitação",
            teoria: `
                <p><strong>Testes de aceitação</strong> validam se o sistema atende aos requisitos de negócio e necessidades do usuário final.</p>
                <ul>
                    <li><strong>Envolvimento do cliente</strong>: participação ativa do usuário/cliente</li>
                    <li><strong>Níveis</strong>:
                        <ul>
                            <li>Aceitação do usuário (UAT): fluxos reais</li>
                            <li>Aceitação contratual: conformidade com especificações</li>
                        </ul>
                    </li>
                    <li><strong>Critério de aprovação</strong>: baseado em critérios de negócio</li>
                </ul>
                <p><strong>Pegadinha comum</strong>: Atribuir exclusivamente à equipe de desenvolvimento.</p>`,
            analogiaPokemon: "Professor Carvalho testando se um Pokémon atende aos requisitos para o Torneio da Liga (nível mínimo, tipos permitidos etc.).",
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Testes de aceitação são de responsabilidade exclusiva da equipe de desenvolvimento, pois apenas eles possuem conhecimento técnico para validar se o sistema atende aos requisitos."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao ignorar o papel central do cliente. Testes de aceitação têm natureza business-oriented e envolvem stakeholders não-técnicos."
            }
        }
    ]
});