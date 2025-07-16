todosOsDados.push({
    tituloPrincipal: "Engenharia de usabilidade - design de interface e de experiência do usuário",
    conceitos: [
        {
            id: 1,
            titulo: "Heurísticas de Nielsen",
            teoria: `<p>As <strong>10 heurísticas de Nielsen</strong> são princípios fundamentais para avaliação de usabilidade:</p>
                <ul>
                    <li><strong>Visibilidade do status</strong>: Feedback imediato sobre o estado do sistema</li>
                    <li><strong>Correspondência com o mundo real</strong>: Linguagem familiar ao usuário</li>
                    <li><strong>Controle e liberdade</strong>: Opções claras para desfazer ações</li>
                    <li><strong>Consistência e padrões</strong>: Manter convenções de interface</li>
                    <li><strong>Prevenção de erros</strong>: Evitar situações propensas a erros</li>
                    <li><strong>Reconhecimento em vez de recordação</strong>: Minimizar a carga de memória</li>
                    <li><strong>Flexibilidade e eficiência</strong>: Atalhos para usuários experientes</li>
                    <li><strong>Estética e design minimalista</strong>: Só informações relevantes</li>
                    <li><strong>Ajude usuários a reconhecer, diagnosticar e recuperar-se de erros</strong></li>
                    <li><strong>Ajuda e documentação</strong>: Acessível e contextual</li>
                </ul>`,
            analogiaPokemon: `Um PC Pokémon que não mostra o progresso ao transferir um Pikachu (falha na visibilidade do status) ou que exige decorar combos de botões para evoluir (falha em reconhecimento vs recordação) viola as heurísticas.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - TRE-PB/2023 - Adaptada)",
                texto: "A heurística 'satisfação do usuário' de Nielsen prevê que interfaces devem minimizar a carga cognitiva através de feedbacks imediatos, como mensagens de confirmação após ações críticas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva inventa uma heurística inexistente. Os feedbacks imediatos pertencem à 'visibilidade do status', enquanto 'satisfação do usuário' é um objetivo geral, não uma heurística específica."
            }
        },
        {
            id: 2,
            titulo: "Lei de Fitts",
            teoria: `<p>Fórmula que modela o tempo para atingir um alvo na interface:</p>
                <p><code>T = a + b log₂(D/W + 1)</code></p>
                <ul>
                    <li><strong>T</strong>: Tempo de movimento</li>
                    <li><strong>D</strong>: Distância ao alvo</li>
                    <li><strong>W</strong>: Largura do alvo</li>
                </ul>
                <p>Princípios práticos:</p>
                <ul>
                    <li>Botões maiores são mais fáceis/fáceis de clicar</li>
                    <li>Elementos frequentes devem ficar próximos</li>
                    <li>Cantos da tela são alvos "infinitos" (o cursor para ali)</li>
                </ul>`,
            analogiaPokemon: `Um botão de "Batalha" gigante no centro da tela segue a Lei de Fitts melhor que um botão minúsculo no canto - como uma Pokéball grande versus uma miniaturizada.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - SERPRO/2024 - Adaptada)",
                texto: "Reduzir o tamanho de um botão pela metade sempre dobrará o tempo para clicá-lo, conforme a Lei de Fitts."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A relação é logarítmica, não linear. A fórmula inclui um logaritmo e constantes (a, b) que tornam a proporção mais complexa que uma simples dobra."
            }
        },
        {
            id: 3,
            titulo: "Testes de Usabilidade",
            teoria: `<p><strong>Métodos principais:</strong></p>
                <ul>
                    <li><strong>Moderado</strong>: Facilitador presente durante o teste</li>
                    <li><strong>Não-moderado</strong>: Usuário realiza tarefas remotamente</li>
                    <li><strong>Tarefas exploratórias</strong>: Liberdade para explorar a interface</li>
                    <li><strong>Tarefas direcionadas</strong>: Roteiro específico de ações</li>
                </ul>
                <p><strong>Métricas-chave:</strong></p>
                <ul>
                    <li>Taxa de conclusão de tarefas</li>
                    <li>Tempo médio por tarefa</li>
                    <li>Número/gravidade de erros</li>
                    <li>Satisfação subjetiva (ex.: escala SUS)</li>
                </ul>`,
            analogiaPokemon: `Testar a usabilidade de um app de batalha Pokémon seria como observar treinadores tentando encontrar o ataque "Investida": se 80% desistem após 1 minuto, há falha de design.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - TCU/2025 - Adaptada)",
                texto: "Testes A/B e testes de usabilidade são equivalentes, pois ambos avaliam interfaces com usuários reais e métricas como tempo de tarefa."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Testes A/B comparam duas versões para métricas de performance (ex.: cliques), enquanto testes de usabilidade identificam problemas de interação. São complementares, mas não equivalentes."
            }
        },
        {
            id: 4,
            titulo: "Princípios de Gestalt",
            teoria: `<p><strong>Princípios aplicados a UX/UI:</strong></p>
                <ul>
                    <li><strong>Proximidade</strong>: Elementos próximos são percebidos como relacionados</li>
                    <li><strong>Semelhança</strong>: Itens com mesma forma/cor são agrupados</li>
                    <li><strong>Fechamento</strong>: A mente completa formas incompletas</li>
                    <li><strong>Continuidade</strong>: Os olhos seguem padrões fluidos</li>
                    <li><strong>Região comum</strong>: Elementos na mesma área são agrupados</li>
                </ul>
                <p><em>Observação</em>: "Simetria" não é um princípio clássico de Gestalt.</p>`,
            analogiaPokemon: `A Pokédex agrupa evoluções por proximidade e usa cores similares para Pokémons do mesmo tipo (Semelhança). Um ícone de Pokéball cortado seria "fechado" mentalmente.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - STJ/2024 - Adaptada)",
                texto: "O princípio da simetria de Gestalt explica por que menus centrados melhoram a usabilidade em interfaces móveis."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Simetria" não é um princípio de Gestalt. O alinhamento central pode melhorar a estética, mas o agrupamento perceptivo seria explicado por "proximidade" ou "região comum"."
            }
        },
        {
            id: 5,
            titulo: "Diretrizes WCAG (Acessibilidade)",
            teoria: `<p><strong>Princípios POUR:</strong></p>
                <ul>
                    <li><strong>Perceptível</strong>: Info apresentada de modo acessível (ex.: alt-text)</li>
                    <li><strong>Operável</strong>: Navegação via múltiplos métodos (teclado, voz, etc.)</li>
                    <li><strong>Compreensível</strong>: Conteúdo e operação previsíveis</li>
                    <li><strong>Robusto</strong>: Compatível com tecnologias assistivas</li>
                </ul>
                <p><strong>Níveis de conformidade:</strong></p>
                <ul>
                    <li><strong>A</strong>: Mínimo (ex.: texto alternativo básico)</li>
                    <li><strong>AA</strong>: Recomendado (contraste 4.5:1 para texto)</li>
                    <li><strong>AAA</strong>: Ótimo (contraste 7:1, linguagem simplificada)</li>
                </ul>`,
            analogiaPokemon: `Um jogo que exige gestos precisos no touchscreen falha no "operável" para usuários com mobilidade reduzida. Legendas em batalhas sonoras atendem ao "perceptível".`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - MPU/2025 - Adaptada)",
                texto: "Para WCAG 2.1 AA, basta contraste 3:1 para textos comuns e 4.5:1 para pequenos, além de alt-text em todas as imagens, inclusive decorativas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Dois erros: (1) Textos comuns exigem 4.5:1 (3:1 é para componentes UI), e (2) imagens puramente decorativas devem ter alt vazio (alt=""), não descritivo."
            }
        }
    ]
});