todosOsDados.push({
    tituloPrincipal: "Testes - conceitos básicos e aplicações",
    conceitos: [
        {
            id: 1,
            titulo: "Teste de Caixa Preta vs. Teste de Caixa Branca",
            teoria: `
                <p><strong>Teste de Caixa Preta</strong>: Avalia a funcionalidade do software sem conhecimento interno da estrutura do código. Foca em entradas e saídas, baseado em requisitos e especificações.</p>
                <p><strong>Teste de Caixa Branca</strong>: Examina a estrutura interna do código (lógica, fluxos, condições). Requer conhecimento do código-fonte.</p>
                <p><strong>Nuance Cebraspe</strong>: A banca costuma confundir os dois conceitos em questões, especialmente em cenários onde o teste de caixa preta é aplicado com parcial conhecimento do código (ex: testes de integração).</p>`,
            analogiaPokemon: `Caixa Preta: Como capturar um Pokémon sem saber seus stats ou habilidades, apenas observando seu comportamento em batalha. Caixa Branca: Como um criador de Pokémon que analisa os IVs, EVs e movimentos para otimizar a equipe.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O teste de caixa preta é utilizado para verificar a cobertura de código, pois permite analisar diretamente a estrutura lógica do programa, garantindo que todas as linhas sejam executadas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva troca os conceitos de caixa preta e branca. Cobertura de código é exclusiva de caixa branca, que analisa a estrutura interna. Caixa preta não acessa o código, apenas valida funcionalidades externas."
            }
        },
        {
            id: 2,
            titulo: "Testes de Regressão",
            teoria: `
                <p><strong>Definição</strong>: Testes executados após modificações no software para garantir que alterações não introduziram novos defeitos em funcionalidades existentes.</p>
                <p><strong>Aplicação</strong>: Comum em ciclos de desenvolvimento iterativos (ex: Agile). Pode ser automatizado para eficiência.</p>
                <p><strong>Nuance Cebraspe</strong>: A banca pode associar incorretamente testes de regressão apenas a correções de bugs (ignorando melhorias e novas funcionalidades).</p>`,
            analogiaPokemon: `Após evoluir seu Pikachu para Raichu, você testa se ele ainda conhece o movimento "Thunderbolt" (funcionalidade existente) e se a nova habilidade "Surge Surfer" funciona (nova funcionalidade).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Testes de regressão devem ser realizados apenas quando um defeito é corrigido, pois sua finalidade é exclusivamente validar se a correção não afetou outras partes do sistema."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Limita os testes de regressão a correções de bugs, ignorando seu uso em atualizações, novas features ou mudanças de ambiente. A regressão é parte contínua da manutenção do software."
            }
        },
        {
            id: 3,
            titulo: "Testes de Unidade vs. Testes de Integração",
            teoria: `
                <p><strong>Teste de Unidade</strong>: Avalia componentes individuais (funções, classes) de forma isolada, usando mocks/stubs para dependências externas.</p>
                <p><strong>Teste de Integração</strong>: Verifica a interação entre componentes/modulos/sistemas, expondo falhas em interfaces e fluxos.</p>
                <p><strong>Nuance Cebraspe</strong>: A banca pode confundir os escopos (ex: chamar teste de API de 'unidade' por testar 'uma função') ou sugerir que testes de integração dispensam mocks.</p>`,
            analogiaPokemon: `Unidade: Testar se o movimento "Flamethrower" do Charmander causa dano esperado em um alvo dummy. Integração: Verificar se Charmander, ao ser trocado por Squirtle em batalha, mantém os status corretos e o oponente reage conforme as regras.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Testes de unidade são suficientes para garantir a qualidade de um sistema complexo, pois validam cada função isoladamente, eliminando a necessidade de testes de integração."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Ignora que testes de unidade não cobrem interações entre componentes (ex: chamadas entre APIs, compartilhamento de estados). Cada nível da pirâmide de testes tem objetivos complementares."
            }
        },
        {
            id: 4,
            titulo: "TDD (Test-Driven Development)",
            teoria: `
                <p><strong>Definição</strong>: Metodologia onde os testes são escritos antes do código de produção, seguindo o ciclo: 1) Escrever teste falho, 2) Implementar código mínimo para passar no teste, 3) Refatorar.</p>
                <p><strong>Benefícios</strong>: Código mais testável, design simplificado e cobertura de testes natural.</p>
                <p><strong>Nuance Cebraspe</strong>: A banca pode confundir TDD com 'testar primeiro ocasionalmente' ou sugerir que dispensa documentação.</p>`,
            analogiaPokemon: `Antes de capturar um novo Pokémon, você define exatamente quais movimentos e stats ele deve ter (teste). Só então sai para caçá-lo (implementação), ajustando sua estratégia até atender aos requisitos.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No TDD, os testes são criados após a implementação do código, servindo principalmente para documentar o comportamento já existente do sistema."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Inverte a ordem fundamental do TDD (testes antes do código) e reduz seu propósito à documentação. O TDD é um processo disciplinado onde os testes guiam o design."
            }
        },
        {
            id: 5,
            titulo: "Testes de Carga e Performance",
            teoria: `
                <p><strong>Teste de Carga</strong>: Verifica o comportamento do sistema sob condições específicas de uso (ex: N usuários simultâneos).</p>
                <p><strong>Teste de Performance</strong>: Avalia atributos como tempo de resposta, throughput e estabilidade.</p>
                <p><strong>Nuance Cebraspe</strong>: A banca pode tratar como sinônimos ou omitir que testes de carga são um subtipo de performance.</p>`,
            analogiaPokemon: `Testar como seu servidor de batalhas Pokémon lida com 10.000 treinadores online (carga) e se as batalhas mantém <2s de latência (performance).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Testes de carga e performance são intercambiáveis, pois ambos avaliam exclusivamente o tempo de resposta do sistema sob condições normais de operação."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Iguala os dois tipos de teste e restringe escopo (performance inclui mais que tempo de resposta, e carga testa condições extremas). Performance é genérico (múltiplas métricas) enquanto carga foca em cenários específicos."
            }
        }
    ]
});