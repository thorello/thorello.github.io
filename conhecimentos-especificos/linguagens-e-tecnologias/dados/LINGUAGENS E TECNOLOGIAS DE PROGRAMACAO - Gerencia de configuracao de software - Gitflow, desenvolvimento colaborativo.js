todosOsDados.push({
    tituloPrincipal: "Gerência de configuração de software",
    conceitos: [
        {
            id: 1,
            titulo: "Gitflow",
            teoria: `
                <p><strong>Gitflow</strong> é uma proposta de fluxo de trabalho com git, criado para lidar com projetos que possuem releases periódicas, sendo, portanto, ideal para projetos com um ciclo de lançamento planejado. Gitflow utiliza duas branches principais: <code>main</code> e <code>develop</code>, além de branches de apoio, que são <code>feature</code>, <code>release</code>, <code>hotfix</code> e <code>support</code>.</p>
                <ul>
                    <li><strong>main</strong>: contém o histórico oficial de lançamentos de produção.</li>
                    <li><strong>develop</strong>: utilizada para integração de recursos; a partir dela são derivadas as branches <code>feature</code>.</li>
                    <li><strong>feature</strong>: são criadas a partir de <code>develop</code>, usadas para desenvolvimento de novas funcionalidades.</li>
                    <li><strong>release</strong>: são criadas a partir de <code>develop</code> quando uma versão está quase finalizada, permitindo o início dos testes.</li>
                    <li><strong>hotfix</strong>: são criadas a partir de <code>main</code> para correção de problemas no ambiente de produção.</li>
                </ul>`,
            analogiaPokemon: `Imagine que o <code>main</code> é o time principal de Pokémons que você usa em batalhas de ginásio; o <code>develop</code> são aqueles Pokémons que estão constantemente treinando; <code>feature</code> são os estágios de evolução que eles passam; <code>release</code> é como preparar seu time para enfrentar a Elite dos Quatro; já o <code>hotfix</code> é como dar uma poção para seu Pokémon no meio de uma batalha importante para recuperar seu potencial.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No Gitflow, as branches <code>hotfix</code> são originadas da branch <code>develop</code> para que problemas urgentes na produção sejam rapidamente corrigidos antes da próxima release oficial."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva está errada porque as branches <code>hotfix</code> não são originadas de <code>develop</code>, mas de <code>main</code>. Isso ocorre porque <code>hotfix</code> serve para corrigir problemas que já estão no ambiente de produção, e não na fase de desenvolvimento. A pegadinha está na confusão proposital entre os objetivos das branches <code>release</code> e <code>hotfix</code>."
            }
        },
        {
            id: 2,
            titulo: "Desenvolvimento Colaborativo",
            teoria: `<p><strong>Desenvolvimento colaborativo</strong> é uma prática em que múltiplos desenvolvedores trabalham em um mesmo projeto de software simultaneamente. Essa abordagem é sustentada por sistemas de controle de versão, como o Git, que permitem que várias pessoas editem, revisem e integrem diferentes partes do código eficientemente. Conceitos como pull requests e code reviews são essenciais neste modelo, promovendo a qualidade do código por meio de revisões entre pares. Além disso, a colaboração é facilitada por plataformas como GitHub e GitLab, que oferecem ferramentas para discussão, documentação e rastreamento de bugs e tarefas.</p>`,
            analogiaPokemon: `Imagine uma equipe de treinadores Pokémons que precisa enfrentar uma série de desafiantes em um torneio. Cada treinador tem seu Pokémon especializado, mas o objetivo é que a equipe trabalhe em conjunto, combinando habilidades e estratégias. O controle de versão é como um diário onde registram todos os treinos e estratégias planejadas para que possam consultá-lo e ajustá-lo conforme necessário.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O desenvolvimento colaborativo, por meio de sistemas como Git, elimina totalmente a possibilidade de conflitos entre alterações feitas por diferentes desenvolvedores, garantindo sempre a integração automática do código."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A premissa está errada porque sistemas como o Git não eliminam a possibilidade de conflitos de merge. Conflitos ocorrem quando alterações incompatíveis são feitas no mesmo trecho de código, e é necessário resolvê-los manualmente. A pegadinha está na afirmação categórica de que conflitos são 'totalmente' eliminados, o que é uma generalização incorreta."
            }
        }
    ]
});