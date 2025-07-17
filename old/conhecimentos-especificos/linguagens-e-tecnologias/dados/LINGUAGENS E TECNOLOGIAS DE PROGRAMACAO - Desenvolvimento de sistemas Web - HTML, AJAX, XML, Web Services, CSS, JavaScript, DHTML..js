todosOsDados.push({
    tituloPrincipal: "Desenvolvimento de sistemas Web",
    conceitos: [
        {
            id: 1,
            titulo: "HTML",
            teoria: `
                <p><strong>HTML (HyperText Markup Language)</strong> é a linguagem padrão para construção de páginas Web. Ele é composto por uma série de elementos que são usados para estruturar e formatar o conteúdo de uma página, como textos, imagens, e links. A Cebraspe frequentemente explora o uso correto e a semântica dos elementos HTML, como a diferença entre <code><div></code> e <code><span></code>, ou entre diferentes níveis de cabeçalhos (<code><h1></code> a <code><h6></code>), e questões sobre a depreciação de elementos. Uma nuance recorrente é a forma como tags semânticas, como <code><article></code>, <code><section></code>, <code><header></code>, são aplicadas em substituição a <code><div></code>.</p>`,
            analogiaPokemon: `Assim como Pikachu é a face do mundo Pokémon, representando fundamentalmente o universo e suas regras, o HTML é a base que dá rosto às páginas web, dando estrutura ao conteúdo que será visualizado.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Os elementos HTML <header> e <div> têm a mesma finalidade estrutural, podendo ser usados de forma intercambiável na marcação semântica de documentos web."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A principal diferença entre <header> e <div> é a finalidade semântica. O <header> é utilizado para definir uma seção introdutória ou um conjunto de links de navegação, enquanto o <div> não tem significado semântico específico, sendo usado geralmente para agrupar elementos para fins de estilos ou scripts. A utilização de <header> auxilia no SEO e acessibilidade, indicando estrutura e propósito no código, algo que não ocorre com <div>. A pegadinha está na generalização indevida de que ambos são intercambiáveis para finalidades semânticas, o que não é correto."
            }
        },
        {
            id: 2,
            titulo: "AJAX",
            teoria: `
                <p><strong>AJAX (Asynchronous JavaScript and XML)</strong> é uma técnica de desenvolvimento web que permite a atualização de partes de uma página web de forma assíncrona, sem a necessidade de recarregar a página inteira. É um componente-chave em aplicações de página única (Single Page Applications - SPAs). Cebraspe pode abordar detalhes como a diferença entre síncrono e assíncrono, bem como as tecnologias subjacentes, como XMLHttpRequest e Fetch API. Além disso, é comum aparecerem perguntas sobre a eficiência do uso de JSON em lugar de XML devido a sua menor verbosidade e melhor integração com JavaScript.</p>`,
            analogiaPokemon: `Pense no AJAX como o treinador que realiza comandos sem precisar retornar ao Centro Pokémon toda vez; ele pode mudar a estratégia em tempo real sem interromper a batalha.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A utilização de AJAX em aplicações web elimina completamente a necessidade de comunicação síncrona entre o cliente e o servidor."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Embora o AJAX forneça uma maneira eficiente de realizar comunicações assíncronas para atualizar partes de uma página, não elimina a possibilidade ou a necessidade de comunicação síncrona em outros contextos. Existem situações em que operações síncronas são preferíveis ou necessárias, como em operações críticas que devem ser completadas sequencialmente antes de prosseguir. A pegadinha aqui está na palavra 'completamente', sugerindo uma exclusividade que não constitui a realidade prática no desenvolvimento web."
            }
        },
        {
            id: 3,
            titulo: "XML",
            teoria: `<p><strong>XML (eXtensible Markup Language)</strong> é uma formatação de dados que permite a definição de uma estrutura para documentos de maneira legível por humanos e máquinas. É amplamente utilizado na troca de dados na web e em várias aplicações corporativas. A Cebraspe pode explorar a sintaxe rigorosa do XML, como o fechamento obrigatório de tags e a distinção entre elementos e atributos. Outros pontos recorrentes em questões incluem a comparação com JSON, especialmente em relação à simplicidade e ao tamanho dos dados que cada formato gera.</p>`,
            analogiaPokemon: `Assim como a Pokédex organiza as informações de todos os Pokémon, facilitando a pesquisa e consulta, o XML estrutura os dados, tornando-os claros e organizados tanto para humanos quanto para aplicativos.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No uso de XML em web services, os atributos são preferíveis aos elementos devido à sua facilidade de leitura e ao armazenamento mais eficiente dos dados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A afirmação está incorreta pois o uso de atributos no XML não é uma questão de eficiência ou de facilidade de leitura. Pelo contrário, a escolha entre usar elementos ou atributos depende do tipo e estrutura dos dados. A convenção geralmente prefere elementos para representar dados, pois são mais versáteis na representação de dados complexos, enquanto atributos são mais adequados para dados que possuem naturezas elementares ou metadados. A pegadinha na questão está na generalização de que atributos são sempre preferíveis, sem considerar nuances do tipo de dados ou caso de uso."
            }
        },
        {
            id: 4,
            titulo: "Web Services",
            teoria: `<p><strong>Web Services</strong> são aplicações que permitem a comunicação entre diferentes sistemas pela web, usando protocolos padronizados como HTTP/HTTPS. Eles são fundamentais para a interoperabilidade no desenvolvimento web, com padrões principais como SOAP (Simple Object Access Protocol) e REST (Representational State Transfer). As análises da Cebraspe podem se concentrar nos diferenciais entre esses dois, como o uso de XML em SOAP e a versatilidade e leveza do JSON com REST.</p>`,
            analogiaPokemon: `Imagine os Web Services como o sistema de troca Pokémon: eles permitem que treinadores de diferentes partes do mundo compartilhem e recebam dados(Pokémon) através de um protocolo padrão de comunicação.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "RESTful web services são sempre a melhor escolha em relação aos serviços SOAP devido à simplicidade e desempenho."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A afirmação faz uma generalização indevida. Embora REST ofereça simplicidade e seja, em muitos casos, mais leve e rápido que SOAP, SOAP tem suas vantagens, principalmente em cenários onde é necessário suporte a transações complexas, segurança avançada, ou quando se está trabalhando com sistemas legados que já adotam o protocolo. A questão é sutilmente enganosa ao desconsiderar esses contextos específicos onde SOAP poderia ser mais adequado."
            }
        },
        {
            id: 5,
            titulo: "CSS",
            teoria: `<p><strong>CSS (Cascading Style Sheets)</strong> é uma linguagem de estilo utilizada para descrever a apresentação de um documento escrito em HTML ou XML. Ele é usado para controlar o layout de várias páginas ao mesmo tempo, promovendo flexibilidade e controle no design. A Cebraspe frequentemente explora conceitos como especificidade de seletores, herança, e o modelo de caixa (box model), além de técnicas mais avançadas como CSS Grid e Flexbox.</p>`,
            analogiaPokemon: `Pense no CSS como as roupas e acessórios dos Pokémon: enquanto o HTML forma o corpo e aparência básica do Pokémon, o CSS adiciona estilo e personalidade, tornando cada Pokémon único e distinto visualmente.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A ordem dos seletores CSS em uma folha de estilo não afeta o resultado do estilo aplicado ao documento, pois as regras de herança determinam exclusivamente a aplicação final."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A ordem dos seletores em uma folha de estilos é crítica devido ao conceito de cascata em CSS, onde a última regra aplicada, se com especificidade igual, é a que prevalece. A declaração afirma incorretamente que só as regras de herança determinam o estilo final, ignorando completamente a importância da cascata e da ordem de declaração das regras, que são conceitos fundamentais no CSS."
            }
        },
        {
            id: 6,
            titulo: "JavaScript",
            teoria: `<p><strong>JavaScript</strong> é uma linguagem de programação leve e interpretada, amplamente usada para criar conteúdo web dinâmico e interativo. É indispensável no desenvolvimento full-stack, sendo lado cliente em navegadores e lado servidor com Node.js. Questões frequentes da Cebraspe envolvem closures, contextos de execução (this), e manipulação do DOM. Outro ponto relevante é o uso moderno de ES6 e a diferença entre var, let, e const.</p>`,
            analogiaPokemon: `Considere o JavaScript como o ataque de um Pokémon: ele faz com que o cenário estático (HTML e CSS) ganhe vida e interatividade, permitindo que seus poderes sejam utilizados em plena ação.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em JavaScript, a palavra-chave let declara variáveis que, diferentemente das criadas com var, não podem ser reatribuídas ao longo do tempo."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A palavra-chave let em JavaScript permite declarar variáveis que são limitadas ao escopo do bloco em que foram definidas, permitindo reatribuição. A confusão na assertiva parece surgir em comparação com a palavra-chave const, que cria variáveis imutáveis quanto à referência, mas não impede mudanças nas propriedades de objetos. A pegadinha está na falsa noção de imutabilidade com let."
            }
        }
    ]
});
