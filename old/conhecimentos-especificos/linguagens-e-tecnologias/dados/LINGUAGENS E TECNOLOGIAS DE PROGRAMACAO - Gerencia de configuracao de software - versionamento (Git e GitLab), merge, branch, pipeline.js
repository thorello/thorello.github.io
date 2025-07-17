todosOsDados.push({
    tituloPrincipal: "Gerência de configuração de software - versionamento (Git e GitLab), merge, branch, pipeline",
    conceitos: [
        {
            id: 1,
            titulo: "Versionamento (Git e GitLab)",
            teoria: `
                <p><strong>Git</strong> é um sistema de controle de versão distribuído, amplamente utilizado por equipes de desenvolvimento para gerenciar o histórico de alterações no código-fonte. Git permite que desenvolvedores criem "commits" que representam um estado completo do projeto em um dado momento. <strong>GitLab</strong>, por outro lado, é uma plataforma baseada na web que oferece repositórios Git, integração contínua, e outras ferramentas de DevOps em um único pacote.</p>
                <p>Diferentes comandos em Git, como <code>commit</code>, <code>push</code>, <code>pull</code>, <code>fetch</code> e <code>clone</code>, são fundamentais para manipulação de repositórios. Comandos como <code>branch</code> e <code>merge</code> facilitam o processo de desenvolvimento colaborativo, permitindo múltiplas linhas de desenvolvimento e a integração destas linhas de forma eficiente.</p>`,
            analogiaPokemon: `Imagine que cada commit no Git é como capturar um Pokémon específico em uma Pokébola. Cada captura documenta o estado exato do Pokémon (versão do código) naquele momento. Usar GitLab é como ter um PokéCentro, onde você pode armazenar, gerenciar e revelar todos os seus Pokémon capturados (commits) para sua equipe de treinadores (desenvolvedores).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Um dos princípios fundamentais do Git é que ele é um sistema de controle de versão centralizado em sua essência, permitindo gerenciamento de versões apenas de maneira sequencial e linear, sem o suporte a operações não-lineares como forks ou merges."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Esta assertiva está errada. Git é, na verdade, um sistema de controle de versão distribuído, não centralizado. Além disso, um dos seus pontos fortes é justamente o suporte a operações não-lineares, como branchs, forks e merges, permitindo um fluxo de trabalho altamente colaborativo. A intenção desta pegadinha é confundir o examinando ao contrapor características do Git, um sistema distribuído, com sistemas centralizados de controle de versão."
            }
        },
        {
            id: 2,
            titulo: "Merge",
            teoria: `<p>A operação de <strong>merge</strong> no Git é utilizada para combinar mudanças de diferentes branches em um único histórico. Existem diferentes estratégias de merge, como o merge direto, fast-forward, e o merge com rebase, cada uma com suas particularidades e aplicação ideal.</p>
                    <p>De maneira sutil, o merge pode introduzir conflitos, que ocorrem quando um mesmo trecho de código é alterado em branches diferentes. Resolvem-se conflitos através de uma intervenção manual para garantir que o resultado final do merge esteja de acordo com o esperado.</p>`,
            analogiaPokemon: `Realizar um merge é como unir dois Pokémon de tipos diferentes para uma batalha em dupla. Às vezes, as habilidades combinam perfeitamente (fast-forward), mas outras vezes, é necessário ajustar a estratégia manualmente quando os dois atacam ao mesmo tempo no mesmo alvo (conflitos de merge).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Durante uma operação de merge no Git, caso um conflito ocorra, o Git resolve automaticamente o conflito por meio da estratégia de merge default 'recursive', que sempre escolhe a versão mais antiga do código."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva está incorreta. Quando um conflito de merge ocorre, o Git não resolve automaticamente; ao invés disso, ele marca o conflito no arquivo e requer uma resolução manual por parte do desenvolvedor. A assertiva incorretamente pressupõe que o Git escolha a versão mais antiga, quando na realidade, o comportamento certo é deixar ao desenvolvedor a decisão de resolver o conflito. A maldade aqui está em confundir a função básica do merge no Git com uma solução automática para conflitos."
            }
        },
        {
            id: 3,
            titulo: "Branch",
            teoria: `<p><strong>Branching</strong> no Git é um recurso que permite criar ramificações separadas no repositório para desenvolver funcionalidades isoladamente, realizar experimentos ou corrigir bugs sem afetar a branch principal. Branches principais como <code>master</code> ou <code>main</code> são usadas para acolher a versão estável do projeto, enquanto branches temporárias como <code>feature</code> ou <code>bugfix</code> permitem desenvolvimento paralelo.</p>
                    <p>Criar uma branch é um processo leve no Git, pois cada branch é, na verdade, um ponteiro para um commit específico. O uso de branches promove a experimentação e a colaboração, essenciais para equipes de desenvolvimento ágeis.</p>`,
            analogiaPokemon: `Pense em uma branch como um treinador Pokémon decidindo seguir uma rota alternativa, capturando novos Pokémon e treinando-os sem interferir na jornada do treinador principal, que mantém sua rota segura e estável. Posteriormente, o treinador pode trazer as experiências e Pokémon capturados para a rota principal.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A criação de uma branch no Git automaticamente copia todos os arquivos da branch original para uma nova localização no disco, resultando em consumo adicional de espaço de armazenamento."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Esta assertiva está errada. A criação de uma branch no Git não gera uma cópia física de todos os arquivos no disco. Branches no Git são, na verdade, mais leves porque são apenas ponteiros para commits específicos dentro da árvore de commit. Esta pegadinha tenta induzir o candidato a pensar que o Git opera de maneira semelhante a sistemas de controle de versão mais tradicionais, onde o branching pode ser mais custoso em termos de espaço e tempo."
            }
        },
        {
            id: 4,
            titulo: "Pipeline",
            teoria: `<p>Em um contexto de DevOps e CI/CD (Integração Contínua/Entrega Contínua), um <strong>pipeline</strong> representa uma série automatizada de etapas que movem uma aplicação de um estado de desenvolvimento para produção. Em GitLab, um pipeline pode incluir testes automatizados, build do código, deploy, entre outras ações, garantindo a qualidade e estabilidade da aplicação durante o desenvolvimento e após a implementação das mudanças.</p>
                    <p>Pipelines são definidos em arquivos de configuração, e sua execução pode ser disparada a partir de eventos como pushes de código, merges ou criação de branches.</p>`,
            analogiaPokemon: `Considere um pipeline como um conjunto de treinadores Pokémon, cada um com uma tarefa específica em uma sequência. O primeiro realiza a cura dos Pokémon (teste), o segundo os treina (build), e o último os leva para a batalha final (deploy). Assim, cada treinador garante que os Pokémon estão prontos e em sua melhor forma para chegarem à Liga Pokémon.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No contexto de pipelines em GitLab, é possível definir múltiplos pipelines concorrentes para uma mesma branch, desde que cada pipeline tenha uma configuração diferente, refletindo um fluxo de processos distinto."
            },
            analise: {
                gabarito: "CERTO",
                explicacao: "A assertiva está correta. Em GitLab, é possível ter múltiplos pipelines concorrendo para a mesma branch, cada um configurado diferentemente através de variáveis de ambiente ou regras específicas no arquivo de configuração do pipeline. Essa capacidade permite flexibilidade nos processos de CI/CD para observar diferentes cenários e garantir que o código se comporta de maneira confiável em diferentes condições. A pegadinha aqui está na ambiguidade com a definição de concorrência e multiprocessamento, que não são intuitivamente aparentes para examinadores desavisados."
            }
        }
    ]
});