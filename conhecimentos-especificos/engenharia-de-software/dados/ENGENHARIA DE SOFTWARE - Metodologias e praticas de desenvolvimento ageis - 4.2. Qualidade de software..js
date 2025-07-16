todosOsDados.push({
    tituloPrincipal: "Metodologias e práticas de desenvolvimento ágeis - 4.2. Qualidade de software",
    conceitos: [
        {
            id: 1,
            titulo: "Qualidade de Software (ISO/IEC 25010)",
            teoria: `
                <p>A ISO/IEC 25010 define qualidade de software como um conjunto de características e subcaracterísticas divididas em <strong>Qualidade em Uso</strong> (eficácia, eficiência, satisfação, ausência de riscos, contexto de cobertura) e <strong>Qualidade do Produto</strong> (funcionalidade, desempenho, compatibilidade, usabilidade, confiabilidade, segurança, manutenibilidade, portabilidade).</p>
                <ul>
                    <li><strong>Confiabilidade</strong>: Tempo entre falhas (disponibilidade).</li>
                    <li><strong>Segurança</strong>: Proteção contra acessos não autorizados.</li>
                    <li><strong>Manutenibilidade</strong>: Facilidade de corrigir/modificar vs. <strong>Portabilidade</strong>: Adaptação a novos ambientes.</li>
                    <li>Usabilidade inclui interface gráfica, aprendizado e acessibilidade.</li>
                </ul>`,
            analogiaPokemon: `Pikachu (software) precisa ter: Funcionalidade (Thunderbolt sempre funciona), Confiabilidade (não desmaiar como Magikarp), Segurança (imune a hacks de PP infinito), Portabilidade (evoluir para Raichu sem bugs).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Segundo a ISO/IEC 25010, a característica 'confiabilidade' engloba a capacidade de o software proteger dados contra acessos não autorizados, garantindo integridade e confidencialidade, mesmo em cenários de falhas operacionais."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva troca conceitos: 'confiabilidade' trata de disponibilidade/tolerância a falhas, enquanto 'segurança' protege contra acessos maliciosos (confidencialidade)."
            }
        },
        {
            id: 2,
            titulo: "Testes Ágeis (TDD vs. BDD)",
            teoria: `
                <p><strong>TDD (Test-Driven Development)</strong>: Ciclos Red-Green-Refactor; testes unitários escritos antes do código. Foco em funcionalidades técnicas.</p>
                <p><strong>BDD (Behavior-Driven Development)</strong>: Usa linguagem natural (ex: Gherkin - Given/When/Then) para descrever comportamentos do usuário. Envolve stakeholders não técnicos.</p>
                <ul>
                    <li>TDD não elimina testes de integração.</li>
                    <li>BDD não é apenas "TDD com palavras bonitas"; usa ferramentas como Cucumber.</li>
                </ul>`,
            analogiaPokemon: `TDD: Treinador testa Thunderbolt antes da batalha (teste unitário). BDD: Descreve cenário "Dado Pikachu vs. Geodude, quando usa Thunderbolt, então Geodude deve ser derrotado".`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O BDD substitui completamente o TDD em metodologias ágeis, pois utiliza linguagem técnica mais precisa para descrever testes de unidade, garantindo maior aderência aos requisitos do desenvolvedor."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "BDD não substitui TDD (são complementares) e usa linguagem não técnica (comportamentos). BDD não foca em testes de unidade."
            }
        },
        {
            id: 3,
            titulo: "Métricas de Código (Complexidade Ciclomática)",
            teoria: `
                <p><strong>Complexidade Ciclomática (CC)</strong>: Mede caminhos independentes no código (decisões + 1).</p>
                <ul>
                    <li>CC > 10 indica código complexo e propenso a falhas.</li>
                    <li>Usada para priorizar testes (mais caminhos = mais casos de teste).</li>
                    <li>Não mede desempenho, mas <strong>maintainability</strong>.</li>
                    <li>Não equivale a "número de linhas de código".</li>
                </ul>`,
            analogiaPokemon: `Time com 6 Pokémons (CC=1) vs. time com 20 Pokémons e regras condicionais de troca (CC alto). Mais regras ("if/else") = mais combinações para testar!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A complexidade ciclomática é uma métrica que quantifica o tempo de execução de um módulo de software, sendo diretamente proporcional ao número de linhas de código e inversamente proporcional à quantidade de testes unitários necessários."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "CC não mede tempo de execução, mas caminhos lógicos. É diretamente proporcional à quantidade de testes necessários (mais caminhos = mais testes)."
            }
        },
        {
            id: 4,
            titulo: "Refactoring (Princípios de Martin Fowler)",
            teoria: `
                <p><strong>Refactoring</strong>: Reestruturar código sem alterar comportamento externo. Objetivos:</p>
                <ul>
                    <li>Melhorar legibilidade (nomes claros, métodos curtos).</li>
                    <li>Reduzir dívida técnica.</li>
                    <li>"Bad smells": Código duplicado, métodos longos, classes gigantes.</li>
                    <li>Técnicas: Extract Method, Replace Temp with Query.</li>
                </ul>
                <p><strong>Não adiciona funcionalidades novas</strong>.</p>`,
            analogiaPokemon: `Reorganizar mochila sem perder itens: juntar Pokébolas repetidas (eliminar duplicação), renomear "Poção Azul" para "Super Poção" (legibilidade).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O refactoring é uma prática ágil que consiste na reescrita completa do código-fonte para adicionar novas funcionalidades, garantindo que o software atenda a requisitos não previstos inicialmente."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Refactoring não adiciona funcionalidades nem é 'reescrita completa'. Melhora código existente sem alterar comportamento externo."
            }
        }
    ]
});