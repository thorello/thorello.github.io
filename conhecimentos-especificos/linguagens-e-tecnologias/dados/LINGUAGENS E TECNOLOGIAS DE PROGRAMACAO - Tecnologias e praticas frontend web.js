todosOsDados.push({
    tituloPrincipal: "Tecnologias e práticas frontend web",
    conceitos: [
        {
            id: 1,
            titulo: "HTML5",
            teoria: `
                <p><strong>HTML5</strong> é a quinta versão da linguagem de marcação HTML, usada para estruturar conteúdo na web. Destaca-se por introduzir novos elementos semânticos, como <code><header></code>, <code><footer></code>, e <code><article></code>, que melhoram a acessibilidade do conteúdo para leitores de tela e mecanismos de busca. Além disso, HTML5 traz suporte para áudio e vídeo de forma nativa através das tags <code><audio></code> e <code><video></code>, eliminando a dependência de plugins externos. Também definiu a API de Canvas para gráficos dinâmicos e o armazenamento local com Web Storage, que inclui <code>localStorage</code> e <code>sessionStorage</code>.</p>
            `,
            analogiaPokemon: `Imagine HTML5 como uma evolução de um Pokémon clássico, como o Pikachu se transformando em Raichu. Possui todas as habilidades anteriores, mas agora com novos poderes que permitem interações mais dinâmicas e efetivas.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A introdução de elementos semânticos em HTML5 não impacta a acessibilidade dos sites, pois leitores de tela não distinguem esses novos elementos de marcação como <section>, <article>, ou <aside>."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A introdução de elementos semânticos em HTML5, ao contrário do que foi afirmado, tem um impacto significativo na acessibilidade. Esses elementos ajudam os leitores de tela a entenderem melhor a estrutura e o propósito do conteúdo, fornecendo informações adicionais que podem ser usadas para melhorar a navegação e a compreensão do site por pessoas com deficiência visual."
            }
        },
        {
            id: 2,
            titulo: "CSS3",
            teoria: `
                <p><strong>CSS3</strong> é a terceira evolução da linguagem de folhas de estilo em cascata, que controla a aparência dos elementos em uma página web. Entre as inovações, destacam-se as propriedades para transições e animações, permitindo efeitos visuais dinâmicos sem o uso de JavaScript. CSS3 também introduziu seletores avançados, como atributo e pseudo-classes, permitindo um controle mais sofisticado sobre o estilo dos elementos. O modelo flexbox proporciona um layout mais flexível e responsivo. Adicionalmente, CSS3 adiciona capacidades para gradientes, sombras e fonte web.</p>
            `,
            analogiaPokemon: `
                Pense no CSS3 como o Ditto que aprendeu a se transformar de maneiras ainda mais incríveis, permitindo que os designers mudem a "forma" visual dos sites de maneira fluida e estilizada.
            `,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Os seletores de atributos em CSS3 são capazes de alterar o comportamento do documento HTML, manipulando diretamente o DOM sem a necessidade de JavaScript."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Os seletores de atributos em CSS3 são utilizados para aplicar estilo aos elementos HTML com base em seus atributos, mas não alteram o comportamento ou manipulam diretamente o DOM. Essa tarefa é reservada ao JavaScript, e sua afirmação é uma generalização equivocada de CSS."
            }
        },
        {
            id: 3,
            titulo: "JavaScript",
            teoria: `
                <p><strong>JavaScript</strong> é uma linguagem de programação de alto nível, dinâmica, e interpretada, essencial para a interatividade em páginas web. Permite manipulação de elementos do DOM, validação de formulários em tempo real, e chamadas assíncronas via AJAX. Suporta orientação a objetos e tem um rico ecossistema de bibliotecas e frameworks que facilitam o desenvolvimento.</p>
            `,
            analogiaPokemon: `
                Imagine o JavaScript como o Pikachu do time de programação web: elétrico, adaptável e sempre preparado para fazer o site brilhar com efeitos e funcionalidades interativas.
            `,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em JavaScript, funções anônimas são aquelas declaradas sem nome e podem ser utilizadas exclusivamente como callbacks, não suportando serem atribuídas a variáveis."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Funções anônimas em JavaScript podem ser atribuídas a variáveis e usadas em qualquer contexto, não só como callbacks. Usar funções anônimas em variáveis é uma prática comum, mostrando sua versatilidade além do que foi afirmado."
            }
        },
        {
            id: 4,
            titulo: "AJAX",
            teoria: `
                <p><strong>AJAX</strong> (Asynchronous JavaScript and XML) é uma técnica que permite a atualização de partes de uma página web sem recarregar a página inteira, através de chamadas assíncronas ao servidor. AJAX é altamente eficaz em aplicativos que necessitam de uma experiência de usuário fluida e rápida, permitindo a atualização dinâmica de conteúdos.</p>
            `,
            analogiaPokemon: `
                AJAX é como o Abra que se teletransporta rapidamente, movimentando dados invisíveis aos olhos do usuário, mas sempre eficaz em manter a interação do site ágil e contínua.
            `,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "AJAX permite que dados sejam enviados e recebidos do servidor sem interromper a interação atual do usuário com a página web, mas obrigatoriamente deve utilizar XML como formato de dados, devido à sua especificação original."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Embora o nome AJAX inclua 'XML', isso não limita a técnica ao uso desse formato de dados. JSON é amplamente preferido e usado atualmente, mostrando que AJAX é flexível para trabalhar com diferentes formatos de dados."
            }
        },
        {
            id: 5,
            titulo: "Angular",
            teoria: `
                <p><strong>Angular</strong> é um framework de desenvolvimento frontend baseado em TypeScript, ideal para a construção de Single Page Applications (SPAs). Ele divide aplicações em componentes modulares e encapsula tanto lógica quanto estilo, aproveitando o poder da tipagem estática do TypeScript para adicionar robustez e escalabilidade ao projeto.</p>
            `,
            analogiaPokemon: `
                Pense no Angular como um Charizard mega-evoluído: robusto, multifuncional e capaz de enfrentar desafios complexos com seu vasto conjunto de habilidades e precisão.
            `,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Angular é predominantemente baseado em JavaScript puro, contando com bibliotecas adicionais somente para a manipulação do DOM, enquanto ignora totalmente a tipagem estática."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Angular utiliza TypeScript, que, ao contrário do que foi afirmado, oferece tipagem estática, diferenciando Angular de aplicações JavaScript puras e adicionando robustez ao framework."
            }
        },
        {
            id: 6,
            titulo: "WebSocket",
            teoria: `
                <p><strong>WebSocket</strong> é um protocolo que permite a comunicação bidirecional em tempo real entre um cliente e um servidor, essencial para aplicações que exigem rápidas e contínuas trocas de dados, como chats e jogos online. Ele mantém uma conexão aberta para troca de mensagens de forma contínua e eficiente.</p>
            `,
            analogiaPokemon: `
                Visualize o WebSocket como uma conexão telepática entre dois Alakazams em batalha, onde informações fluem livremente em ambas direções, sem esperar por ordens a cada troca.
            `,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O protocolo WebSocket é inferior ao HTTP nas situações em que a taxa de atualização de dados entre cliente e servidor é contínua, como em um feed de notícias ao vivo."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "O WebSocket é mais eficiente que HTTP em situações de comunicação contínua e bidirecional, fornecendo atualizações de dados em tempo real sem a sobrecarga típica de novas conexões HTTP.”
            }
        },
        {
            id: 7,
            titulo: "Single Page Application (SPA)",
            teoria: `
                <p><strong>Single Page Application (SPA)</strong> é um tipo de aplicativo web que opera dentro de uma única página, atualizando o conteúdo dinamicamente sem recarregar a página do servidor. Tecnologias como AJAX e frameworks como Angular são usados para gerenciar atualizações de conteúdo de maneira eficiente sem quebrar a experiência do usuário.</p>
            `,
            analogiaPokemon: `
                Pense nos SPAs como o Snorlax: ele raramente precisa se mover para mostrar seu poder e eficiência, assim como as SPAs raramente precisam recarregar a página inteira para funcionar de forma eficaz e fluida.
            `,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em aplicações do tipo Single Page Application (SPA), todo o conteúdo do site é carregado de uma vez e não há necessidade de comunicação contínua com o servidor após o carregamento inicial."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "SPA continua se comunicando com o servidor para carregar novos dados e atualizações após o carregamento inicial, usando técnicas como AJAX para manter a interação fluida e dinâmica."
            }
        }
    ]
});