todosOsDados.push({
    tituloPrincipal: "Engenharia de usabilidade - métodos para avaliação de usabilidade",
    conceitos: [
        {
            id: 1,
            titulo: "Avaliação Heurística (Nielsen)",
            teoria: `
                <p>A <strong>Avaliação Heurística</strong> é um método de inspeção baseado em um conjunto de princípios (heurísticas) para identificar problemas de usabilidade em interfaces. As 10 heurísticas de Nielsen incluem:</p>
                <ol>
                    <li><strong>Visibilidade do status do sistema</strong> (feedback claro).</li>
                    <li><strong>Correspondência entre o sistema e o mundo real</strong> (linguagem familiar).</li>
                    <li><strong>Controle e liberdade do usuário</strong> (saídas de emergência).</li>
                    <li><strong>Consistência e padrões</strong> (uniformidade).</li>
                    <li><strong>Prevenção de erros</strong> (evitar falhas).</li>
                    <li><strong>Reconhecimento em vez de lembrança</strong> (minimizar carga cognitiva).</li>
                    <li><strong>Flexibilidade e eficiência de uso</strong> (atalhos para experientes).</li>
                    <li><strong>Estética e design minimalista</strong> (evitar irrelevâncias).</li>
                    <li><strong>Ajude os usuários a reconhecer, diagnosticar e recuperar-se de erros</strong> (mensagens claras).</li>
                    <li><strong>Ajuda e documentação</strong> (suporte acessível).</li>
                </ol>
                <p><strong>Nuance Cebraspe</strong>: A banca pode confundir "reconhecimento" (interface clara) com "lembrança" (memorização), ou sugerir que heurísticas são substituíveis por testes com usuários (são complementares).</p>`,
            analogiaPokemon: `Um avaliador heurístico é como um <strong>Professor Carvalho</strong> examinando um Pokédex: ele verifica se a interface mostra claramente o status do Pokémon (HP, tipo), usa termos como "Água" em vez de códigos técnicos, e tem um botão de "Voltar" se o treinador errar. Se o Pokédex exigir decorar combinações de teclas para avançar, falha na heurística 6!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Banco Central/2024 - Adaptada)",
                texto: "A Avaliação Heurística, conforme proposta por Nielsen, é um método que substitui a necessidade de testes com usuários reais, pois suas 10 heurísticas cobrem todos os possíveis problemas de usabilidade em qualquer sistema interativo."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao afirmar que heurísticas <strong>substituem</strong> testes com usuários. Elas são <strong>complementares</strong>: heurísticas identificam problemas potenciais (via especialistas), enquanto testes com usuários revelam falhas reais de interação. A maldade está na generalização ('todos os possíveis problemas') e na troca do conceito de complementaridade por substituição."
            }
        },
        {
            id: 2,
            titulo: "Teste de Usabilidade (Laboratório)",
            teoria: `
                <p>Testes de usabilidade em laboratório envolvem usuários reais realizando tarefas específicas em um ambiente controlado, enquanto observadores registram dificuldades, tempo e satisfação. <strong>Pontos críticos</strong>:</p>
                <ul>
                    <li><strong>Tarefas representativas</strong>: Devem refletir cenários reais de uso.</li>
                    <li><strong>Perfil dos usuários</strong>: Recrutamento deve matchar o público-alvo.</li>
                    <li><strong>Métricas</strong>: Tempo de tarefa, taxa de erro, satisfação (escalas como SUS).</li>
                    <li><strong>Moderação</strong>: Evitar viés do facilitador (ex: dar dicas).</li>
                </ul>
                <p><strong>Nuance Cebraspe</strong>: A banca pode trocar métricas (ex: dizer que 'número de cliques' é sempre a melhor medida) ou sugerir que laboratório é obrigatório (há métodos remotos).</p>`,
            analogiaPokemon: `É como um <strong>Ginásio Pokémon</strong> controlado: os treinadores (usuários) devem derrotar líderes (tarefas) com seu time, enquanto Oak (moderador) observa se eles usam ataques eficientes (fluxo ideal). Se um treinador fica perdido tentando encontrar a Poção na mochila, há um problema de usabilidade!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - SERPRO/2023 - Adaptada)",
                texto: "Em testes de usabilidade em laboratório, a métrica mais relevante para avaliar a eficácia de um sistema é o número de cliques realizados pelo usuário, pois quanto menos cliques, mais eficiente é a interface."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A pegadinha está na <strong>generalização</strong> sobre 'número de cliques'. Embora eficiência seja importante, outras métricas como <strong>taxa de conclusão da tarefa</strong> ou <strong>satisfação</strong> podem ser mais críticas. Ex: um sistema com poucos cliques mas que causa erro frequente é pior que um com cliques extras porém seguro."
            }
        },
        {
            id: 3,
            titulo: "Prototipação de Baixa Fidelidade",
            teoria: `
                <p>Prototipação de baixa fidelidade (ex: sketches, papel) é usada nas fases iniciais para validar conceitos rapidamente, sem investir em desenvolvimento. <strong>Características</strong>:</p>
                <ul>
                    <li><strong>Foco em fluxo e estrutura</strong>, não em cores ou detalhes visuais.</li>
                    <li><strong>Iterativo</strong>: Permite ajustes baratos antes de codificar.</li>
                    <li><strong>Vantagens</strong>: Colaboração fácil, feedback rápido, baixo custo.</li>
                </ul>
                <p><strong>Nuance Cebraspe</strong>: A banca pode confundir com protótipos de alta fidelidade (ex: dizer que wireframes são 'inúteis' por não terem interação real), ou negligenciar seu papel na <strong>redução de riscos</strong>.</p>`,
            analogiaPokemon: `É como rascunhar um <strong>novo mapa de região Pokémon</strong> em um guardanapo: você testa se as cidades (telas) estão conectadas logicamente antes de programar o jogo. Se os jogadores ficarem presos entre Viridian e Pewter sem um caminho claro, o sketch falhou!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - TCU/2025 - Adaptada)",
                texto: "Prototipação de baixa fidelidade, como wireframes em papel, é desnecessária em projetos ágeis, pois atrasa a entrega de funcionalidades prontas para teste com usuários reais."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva <strong>subestima o valor</strong> dos protótipos simples. Em métodos ágeis, eles são <strong>essenciais</strong> para evitar retrabalho caro. A maldade é associar 'baixa fidelidade' a 'atraso', quando na verdade ela <strong>acelera</strong> a validação de ideias."
            }
        }
    ]
});