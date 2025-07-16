todosOsDados.push({
    tituloPrincipal: "CI/CD (GitLab CI)" ,
    conceitos: [
        {
            id: 1,
            titulo: "CI/CD no GitLab CI",
            teoria: `
                <p><strong>CI/CD</strong> representa a prática de integração contínua (CI) e entrega/implantação contínua (CD), um processo básico na moderna engenharia de software, especialmente no ambiente DevOps. Dentro do GitLab CI, CI/CD envolve o uso de pipelines automatizados que permitem que alterações de código sejam construídas, testadas e implantadas de forma eficaz. A integração contínua refere-se à prática de automatizar e frequentemente integrar pequenas alterações de código em um repositório centralizado, facilitando a detecção de bugs. A entrega contínua foca em automatizar a entrega de builds aprovadas para ambientes de teste ou produção. Um ponto nevrálgico é diferenciar integração contínua (CI) de entrega contínua (CD) e implantação contínua, sendo a última menos utilizada em provas da Cebraspe. Importante também entender o arquivo <code>.gitlab-ci.yml</code>, que configura o pipeline no GitLab CI, contendo estágios como build, test e deploy.</p>`,
            analogiaPokemon: `Imagine que Pikachu está treinando para um campeonato. A integração contínua (CI) é como Pikachu recebendo treinos diários para melhorar suas habilidades, enquanto a entrega contínua (CD) é como ele participando de batalhas simuladas para testar sua capacidade em tempo real.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No GitLab CI, a prática de integração contínua (CI) necessariamente inclui a implementação automática de código em produção após a conclusão dos testes bem-sucedidos."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva está incorreta porque a integração contínua (CI) se refere à prática de automatizar e frequentemente integrar alterações de código, mas não inclui necessariamente a implementação do código em produção. A implementação automática em produção é uma característica da implantação contínua, que é distinta de CI e CD. Esta é uma pegadinha clássica que confunde os conceitos de CI e implantação contínua onde o candidato precisa entender claramente as diferenças entre integração, entrega e implantação."
            }
        },
        {
            id: 2,
            titulo: "Gerência de Configuração no Contexto CI/CD",
            teoria: `<p>Na engenharia de software, a <strong>gerência de configuração</strong> é a disciplina que abrange o controle de mudanças, rastreamento de versões e auditoria de configurações de software para garantir consistência e controle ao longo do ciclo de vida de desenvolvimento. Em um ambiente CI/CD, a gerência de configuração assegura que as alterações de código são aprovadas antes de serem integradas, garantindo rastreabilidade e reprodutibilidade. Um ponto nevrálgico é a diferença entre controle de versão e controle de configuração: enquanto o controle de versão lida com a gerência de versões de código, o controle de configuração vai além, abordando a documentação, as build artifacts e a configuração do ambiente.</p>`,
            analogiaPokemon: `Pense na gerência de configuração como o trabalho de um Professor Oak, que documenta e rastreia cada Pokémon, suas localizações e quem os treinadores trocam entre si. Assim como as configurações, todas essas informações precisam ser precisas e atualizadas para que tenhamos clareza sobre o crescimento e as mudanças de cada Pokémon.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A gerência de configuração em CI/CD limita-se ao controle de versões de código-fonte, ignorando a necessidade de gerenciar configurações de ambiente e documentação."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva está errada, pois a gerência de configuração em CI/CD abrange mais do que o controle de versões de código-fonte: ela inclui também o gerenciamento de configurações de ambiente e documentação. Uma pegadinha comum é restringir a definição de gerência de configuração apenas ao controle de versão, o que negligencia seus outros componentes críticos no ambiente de desenvolvimento de software."
            }
        },
        {
            id: 3,
            titulo: "Pipelines no GitLab CI",
            teoria: `<p>Os <strong>pipelines no GitLab CI</strong> são conjuntos de tarefas definidas no arquivo <code>.gitlab-ci.yml</code>, que automatizam o processo de integração e entrega contínua. Esses pipelines podem ter múltiplos estágios, como build, test, e deploy, e cada estágio pode conter múltiplos trabalhos que são executados em sequência ou em paralelo. Um conceito crucial é entender que um pipeline só avança para o próximo estágio se o estágio atual for executado com sucesso. A Cebraspe pode explorar permissões e condições de execução dos jobs dentro de um pipeline, buscando pegadinhas quanto à configuração incorreta desses estágios e seus impactos.</p>`,
            analogiaPokemon: `Imagine que os estágios de um pipeline sejam como uma série de ginásios Pokémon. Pikachu só avança para o próximo ginásio se ganhar a batalha no ginásio atual. Cada ginásio precisa ser vencido antes que a Liga Pokémon, que seria a produção, possa ser desafiada.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Um pipeline no GitLab CI sempre executa todos os estágios independentemente do sucesso ou falha dos estágios anteriores, garantindo que todos os aspectos do código sejam testados antes da entrega em produção."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva está incorreta porque um pipeline no GitLab CI normalmente cessa a execução após o falha de um estágio, não permitindo que os estágios seguintes sejam executados. Somente com configurações específicas, como o uso de <code>when: always</code>, poderíamos continuar a execução após uma falha. Essa questão testa o entendimento sobre a execução condicional dentro dos pipelines e o funcionamento básico das dependências internas de um pipeline no GitLab CI."
            }
        }
    ]
});
