todosOsDados.push({
    tituloPrincipal: "Testes - testes automatizados e manuais",
    conceitos: [
        {
            id: 1,
            titulo: "Testes Automatizados vs. Testes Manuais",
            teoria: `
                <p><strong>Testes automatizados</strong> são executados por scripts/tools sem intervenção humana, focando em repetibilidade, velocidade e cobertura de cenários previsíveis (ex: regressão). <strong>Testes manuais</strong> dependem de um tester para execução, sendo essenciais para explorar cenários imprevisíveis (ex: usabilidade, UX).</p>
                <ul>
                    <li><strong>Diferença crítica</strong>: Automatizados são programáveis; manuais são adaptativos.</li>
                    <li><strong>Armadilha comum</strong>: Assumir que automatizados substituem totalmente os manuais (erro! São complementares).</li>
                    <li><strong>Nuance</strong>: Testes exploratórios (subclasse dos manuais) não possuem scripts pré-definidos.</li>
                </ul>`,
            analogiaPokemon: `Testes automatizados são como um Porygon (programado para ações precisas e repetíveis), enquanto testes manuais são um Machamp (usa "Multiattack" para adaptar-se a situações imprevistas). Ambos são necessários para vencer a Liga Pokémon (projeto de software)!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Os testes automatizados são superiores aos manuais em todos os aspectos, incluindo a capacidade de identificar falhas de usabilidade e comportamentos inesperados do sistema, uma vez que eliminam a subjetividade humana e garantem 100% de cobertura de requisitos."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao generalizar a superioridade dos testes automatizados. Pegadinhas: 1) Usabilidade: Testes manuais são insubstituíveis para avaliar UX/UI (humanos percebem frustrações que scripts ignoram). 2) Comportamentos inesperados: Testes exploratórios (manuais) são projetados para isso. 3) 100% de cobertura: Impossível, mesmo com automação (ex: edge cases não previstos)."
            }
        },
        {
            id: 2,
            titulo: "Pirâmide de Testes (Unitário, Integração, Sistema)",
            teoria: `<p>A <strong>pirâmide de testes</strong> prioriza testes unitários (base), depois integração (meio) e por fim sistema/UI (topo).</p>
                <ul>
                    <li><strong>Hierarquia</strong>: Unitários são mais rápidos e baratos; sistemas são lentos e caros.</li>
                    <li><strong>Exceção</strong>: Sistemas legados podem inverter a pirâmide (mais testes de UI por falta de unidades testáveis).</li>
                    <li><strong>Erro comum</strong>: Confundir testes de integração com sistemas (integração verifica comunicação entre módulos; sistemas validam fluxos completos).</li>
                </ul>`,
            analogiaPokemon: `A pirâmide é como evoluir um Magikarp: 1) Unitários = Magikarp (básico, mas essencial para evoluir). 2) Integração = Gyarados (poderoso, mas depende do Magikarp). 3) Sistema = Mega Gyarados (pico de poder, mas consome mais recursos). Pular etapas causa falhas!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Na pirâmide de testes, os testes de sistema devem ser a base da estratégia, pois validam o produto final de forma mais abrangente, enquanto os unitários são opcionais para projetos ágeis."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva inverte a pirâmide e despreza unitários. Maldades: 1) Base da estratégia: Deveriam ser os unitários (mais estáveis e menos custosos). 2) Opcionais em ágeis: Unitários são críticos em ágil (feedback rápido). 3) Abrangência ≠ Eficiência: Testes de sistema são importantes, mas não substituem a base."
            }
        },
        {
            id: 3,
            titulo: "Mocks e Stubs em Testes Automatizados",
            teoria: `<p><strong>Mock</strong>: Simula comportamento de dependências com verificações internas (ex: validar se um método foi chamado). <strong>Stub</strong>: Fornece respostas pré-definidas sem verificação (ex: retornar um JSON fake).</p>
                <ul>
                    <li><strong>Troca de conceitos</strong>: mock ≠ stub.</li>
                    <li><strong>Uso indevido</strong>: Mocks para substituir todas as dependências (pode mascarar bugs reais).</li>
                </ul>`,
            analogiaPokemon: `Stub = Ditto transformado em Pikachu: só parece um Pikachu (resposta fixa). Mock = Zorua (ilude com habilidades falsas, mas registra se atacou).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Stubs e mocks são intercambiáveis em testes automatizados, pois ambos substituem dependências externas, sendo a única diferença o fato de stubs serem mais simples de implementar."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Erros graves: 1) Intercambiáveis: Não! Mocks verificam interações; stubs só fornecem dados. 2) Única diferença: Mocks têm expectativas (ex: quantas vezes um método foi chamado). Dica: Cebraspe adora confundir 'simular' (stub) com 'verificar' (mock)."
            }
        }
    ]
});