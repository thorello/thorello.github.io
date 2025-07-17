todosOsDados.push({
    tituloPrincipal: "Estruturas de dados - métodos de ordenação, pesquisa e hashing, estrutura de arquivos",
    conceitos: [
        {
            id: 1,
            titulo: "Métodos de Ordenação",
            teoria: `
                <p><strong>Métodos de ordenação</strong> são algoritmos usados para organizar dados em uma sequência específica, geralmente em ordem crescente ou decrescente. Existem vários tipos de algoritmos de ordenação, cada um com suas peculiaridades. Alguns dos mais conhecidos incluem Bubble Sort, que funciona trocando elementos adjacentes; Quick Sort, que utiliza a técnica de divisão e conquista; e Merge Sort, que combina sublistas ordenadas para formar uma lista final organizada. A escolha do método de ordenação ideal pode depender de fatores como complexidade temporal e espacial, estabilidade e facilidade de implementação.</p>
            `,
            analogiaPokemon: `Imagine um treinador Pokémon organizando suas pokébolas em ordem de número. Ele pode usar diferentes estratégias, assim como os métodos de ordenação. Digamos que ele use o método Bubble Sort: ele passa de pokébola em pokébola, comparando os números, e trocando as posições até que todas estejam na ordem certa, como uma sequência crescente de Pikachus energizados.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O algoritmo Quick Sort sempre oferece melhor desempenho do que o Bubble Sort, independentemente do tipo de dados de entrada."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Embora o Quick Sort geralmente tenha um desempenho melhor que o Bubble Sort em média (O(n log n) contra O(n²)), existem casos específicos nos quais o Quick Sort pode piorar, como em listas já ordenadas quando o pivô é mal escolhido, levando à complexidade O(n²). Por outro lado, o Bubble Sort é consistentemente O(n²) mas pode se tornar O(n) com a otimização de parada antecipada em dados quase ordenados."
            }
        },
        {
            id: 2,
            titulo: "Métodos de Pesquisa",
            teoria: `
                <p><strong>Métodos de pesquisa</strong> são algoritmos usados para localizar um item em uma estrutura de dados. Os mais comuns são a busca linear e a busca binária. A busca linear percorre a lista de maneira sequencial até encontrar o elemento desejado O(n). Já a busca binária é mais eficiente, O(log n), mas requer que os dados estejam ordenados, dividindo a lista em dois a cada passo, eliminando metade das possibilidades de cada vez. Aspectos como a necessidade de ordenação prévia e a eficiência em diferentes cenários são fundamentais no entendimento desses métodos.</p>
            `,
            analogiaPokemon: `Considere um treinador tentando encontrar um Pikachu em uma lista de Pokémon organizados. Usando busca linear, ele verifica um a um, como se procurasse cada Pokémon nas moitas, enquanto com a busca binária ele começa pelo meio e rapidamente descarta metade das moitas, fazendo um uso mais estratégico do que o poder Divisor de Raios do Zapdos.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A busca binária é sempre mais eficiente que a busca linear, mesmo quando a lista de entrada está desordenada."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A busca binária requer que a lista esteja previamente ordenada para funcionar corretamente. Sem essa ordenação, ela não pode ser aplicada de maneira eficaz. Em listas desordenadas, a busca linear pode ser a única opção prática, já que percorrer sequencialmente os elementos é necessário."
            }
        },
        {
            id: 3,
            titulo: "Hashing",
            teoria: `
                <p><strong>Hashing</strong> é uma técnica utilizada para mapear dados de tamanho variável em dados de tamanho fixo, geralmente através de funções hash, facilitando buscas rápidas em tabelas hash. As funções hash convertem uma entrada (ou chave) em um índice de uma tabela onde os dados associados à chave são armazenados. Este método é fundamental para operações eficientes de inserção, busca e exclusão, com complexidade média de O(1). Conflitos (ou colisões) ocorrem quando diferentes entradas mapeiam para o mesmo índice, sendo normalmente resolvidas por métodos como encadeamento separado ou endereçamento aberto.</p>
            `,
            analogiaPokemon: `Pense em um PC Pokémon onde cada Pokémon tem um "ID especial" gerado por uma máquina de hash, que os coloca em caixas específicas. Se dois Pikachus receberam o mesmo ID (uma colisão), eles vão para a mesma caixa, mas são bem organizados lá dentro, assim como um Charmander e um Squirtle que compartilham a mesma caixa mas têm suas coordenadas únicas.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em tabelas hash, uma função hash eficiente elimina a possibilidade de colisões."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "É impossível eliminar colisões completamente com funções hash, pois elas mapeiam um conjunto potencialmente infinito de entradas para um número finito de índices. A eficiência de uma função hash é medida por seu desempenho em distribuir uniformemente as entradas entre os índices, mas colisões ainda são possíveis e devem ser gerenciadas adequadamente."
            }
        },
        {
            id: 4,
            titulo: "Estrutura de Arquivos",
            teoria: `
                <p><strong>Estrutura de arquivos</strong> refere-se à organização e gerenciamento de dados em armazenamento secundário, como discos rígidos e SSDs. Os dados são geralmente armazenados em unidades estruturais menores chamadas blocos. Existem diferentes métodos de alocação de arquivos, como a alocação contínua, onde os blocos de um arquivo são armazenados de forma sequencial, e a alocação encadeada, onde cada bloco aponta para o próximo. Outras estruturas, como árvores B e árvores B+, são utilizadas para permitir acesso e atualização eficiente dos dados.</p>
            `,
            analogiaPokemon: `Imagine o sistema de armazenamento no PC Pokémon: ao capturar cada novo Pokémon, o sistema precisa decidir onde guardá-lo. Usando alocação contínua, seria como agrupar todos os Pikachu juntos em sequência. Com alocação encadeada, cada Pikachu deixaria dicas para o próximo, como se formassem uma fila de atividades em um centro Pokémon.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A alocação encadeada é superior à alocação contínua em todas as situações, pois elimina a fragmentação externa."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Apesar de a alocação encadeada eliminar a fragmentação externa, ela introduz fragmentação interna e pode resultar em desempenho de leitura mais lento, pois acessar um arquivo requer ler múltiplos blocos não contíguos. Além disso, a alocação contínua, embora sujeita à fragmentação externa, oferece vantagens em termos de performance, especialmente para arquivos que não mudam de tamanho."
            }
        },
        {
            id: 5,
            titulo: "Estruturas de Dados",
            teoria: `
                <p><strong>Estruturas de dados</strong> são formas de organizar e armazenar dados de maneira eficiente para facilitar seu acesso e modificação. As principais estruturas incluem arrays, listas, pilhas, filas, árvores e grafos. Cada estrutura é adequada para aplicações específicas, dependendo das operações mais frequentes que precisam ser realizadas. Arrays oferecem acesso rápido por índice, listas permitem crescimento dinâmico, pilhas e filas são usadas para controle de fluxo e processamento em ordem específica, enquanto árvores e grafos são essenciais para representar hierarquias e redes complexas.</p>
            `,
            analogiaPokemon: `Visualize a mochila de um treinador Pokémon. Os arrays seriam compartimentos fixos onde ele pode acessar rapidamente uma pokébola específica. As listas seriam como um bolso expansível que pode crescer à medida que captura Pokémon. As pilhas seriam como uma pilha de discos de batalha, onde ele só pega ou guarda o disco do topo. Nas filas, ele coloca Pokémon em ordem de batalha; o primeiro que entra é o primeiro a lutar. Árvore seria como uma árvore genealógica de evolução dos Pokémon, e um grafo seria um mapa das rotas por onde o treinador viaja entre cidades.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Pilhas, listas e arrays são tipos de estruturas de dados lineares que permitem inserção e remoção apenas em uma extremidade."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A afirmação faz uma generalização indevida. Enquanto pilhas são estruturas de dados lineares que realmente permitem operações apenas em uma extremidade (LIFO - Last In, First Out), listas e arrays não têm essa restrição. Em listas, podemos realizar inserções e remoções em qualquer posição se for uma lista duplamente ligada. Arrays, por sua vez, possuem índices que oferecem acesso direto a qualquer posição."
            }
        }
    ]
});