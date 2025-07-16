todosOsDados.push({
    tituloPrincipal: "Estruturas de dados",
    conceitos: [
        {
            id: 1,
            titulo: "Listas",
            teoria: `
                <p><strong>Listas</strong> são estruturas de dados lineares que armazenam elementos de forma sequencial.
                Em linguagens como Python, listas podem armazenar diferentes tipos de dados simultaneamente e permitem
                a inserção, remoção e acesso aos elementos através de índices. As listas podem ser implementadas como
                arrays (vetores) ou listas ligadas. As listas ligadas têm o benefício de facilidade para adicionar ou
                remover elementos (complexidade O(1) para adições no início), enquanto arrays têm complexidade constante
                O(1) para acesso direto.</p>
                <p>Um ponto crucial que a Cebraspe pode explorar é a diferença de complexidade de operações entre listas
                e outras estruturas lineares.</p>`,
            analogiaPokemon: `Imagine uma fila de treinadores Pokémon esperando para entrar no ginásio. Cada treinador pode
                ser claro como um "item" na lista de espera. Você pode colocar um novo treinador (item) no fim da fila
                (lista), ou reorganizar os treinadores. Entretanto, para encontrar um treinador específico, você precisa
                olhar um por um (se lista ligada) ou consultar diretamente seu nome (se array).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "As listas em Python permitem acesso O(1) a qualquer elemento e, portanto, sempre são mais eficientes do que listas ligadas em todas as operações."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva peca ao generalizar que listas em Python são sempre mais eficientes que listas ligadas. Enquanto o acesso a elementos em listas (arrays) em Python é de fato O(1), operações como inserções ou deleções no início ou meio da lista possuem complexidade O(n), ao contrário das listas ligadas que permitem inserções e remoções eficientes com complexidade O(1) em casos específicos. Assim, a eficiência depende da operação em questão."
            }
        },
        {
            id: 2,
            titulo: "Pilhas",
            teoria: `
                <p><strong>Pilhas</strong> são estruturas de dados lineares que seguem o princípio de LIFO (Last In, First Out),
                ou seja, o último elemento a entrar é o primeiro a sair. São frequentemente usadas em problemas que exigem
                reversão de níveis (como em chamadas recursivas) e na avaliação de expressões aritméticas.</p>
                <p>As operações fundamentais em uma pilha são push (inserir um elemento) e pop (remover o elemento do topo).
                Ponto de atenção em provas da Cebraspe é a comparação entre pilhas e outras estruturas lineares em situações
                práticas de implementação e a análise de suas complexidades.</p>`,
            analogiaPokemon: `Pense em uma mochila onde você empilha Pokébolas. Quando precisa de uma, você pega a que está no
                topo da pilha. Se quiser acessar alguma em um nível mais baixo, precisa primeiro retirar todas as que estão
                acima. A última Pokébola a ser colocada é sempre a primeira a ser retirada.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "As pilhas permitem acesso rápido e eficiente a qualquer elemento armazenado, similar às listas ligadas, o que faz delas a escolha ideal para armazenar dados que exigem busca frequente."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva incorretamente afirma que pilhas permitem acesso rápido a qualquer elemento, o que conflita com seu funcionamento LIFO. Ainda que eficientes para operações de push e pop no topo da pilha, acessar qualquer elemento além do topo não é eficiente (O(n) se for preciso). Portanto, pilhas não são adequadas para operações que requerem busca frequente por elementos não no topo."
            }
        },
        {
            id: 3,
            titulo: "Filas",
            teoria: `
                <p><strong>Filas</strong> são estruturas de dados lineares que operam pelo princípio FIFO (First In, First Out),
                isto é, o primeiro elemento a ser inserido é o primeiro a ser removido. As filas são ideais para sistemas que
                operam em ordem cronológica, como gerenciadores de processos em sistemas operacionais e sistemas de impressão.</p>
                <p>As operações principais são enqueue (inserir um elemento no fim da fila) e dequeue (remover um elemento do início
                da fila). A Cebraspe pode explorar as diferenças entre filas e pilhas, especialmente em casos de uso e eficiência
                em diferentes contextos.</p>`,
            analogiaPokemon: `Imagine um Centro Pokémon onde os Pokémon são curados na ordem em que chegam. O primeiro Pokémon a
                entrar na fila de tratamento é o primeiro a ser atendido. Assim como numa fila de atendimento comum, você seguiria
                a ordem de chegada para garantir que todos sejam vistos no mesmo ritmo em que chegaram.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Filas são mais eficientes que listas para acessar qualquer elemento aleatoriamente, pois implementam o acesso FIFO que facilita o ordenamento direto dos dados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva está errada ao sugerir que filas são mais eficientes para acessar elementos aleatoriamente. A estrutura FIFO das filas permite o acesso apenas ao início ou fim, e não suporte a busca direta ou acesso aleatório a elementos sem remover itens. As listas, ao contrário, permitem acesso de índice a qualquer posição de forma mais direta. Portanto, filas são inadequadas para acesso aleatório."
            }
        },
        {
            id: 4,
            titulo: "Árvores",
            teoria: `
                <p><strong>Árvores</strong> são estruturas de dados hierárquicas compostas por nós, onde cada nó contém um valor
                e referências para seus nós filhos. Apesar de várias árvores específicas existirem (como árvores binárias, AVL,
                B-trees), a propriedade chave é que sempre há um único caminho da raiz a qualquer nó, e não existem ciclos. Árvores
                são fundamentais em algoritmos de pesquisa, como busca binária em árvores de busca binária (BST), onde a complexidade
                pode ser reduzida para O(log n) em árvores balanceadas.</p>
                <p>Cebraspe pode explorar pegadinhas relacionadas à diferença de complexidade entre árvores balanceadas e não balanceadas
                ou confundir elementos de árvores com grafos.</p>`,
            analogiaPokemon: `Pense em uma árvore genealógica de Pokémon, começando com Pikachu no topo, e cada evolução ou pré-evolução
                sendo um nó abaixo, como Raichu e Pichu. Para chegar de um Pokémon base até uma evolução final, você segue um caminho
                definido sem ciclos ou repetição.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em árvores binárias de busca, o tempo de pesquisa para encontrar um elemento específico é sempre O(log n) devido à divisão binária dos dados, garantindo acesso balanceado aos mesmos."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva comete o erro de sugerir que árvores binárias de busca têm sempre tempo de pesquisa O(log n). Isto é verdade apenas para árvores balanceadas. Se a árvore está desbalanceada (por exemplo, cada nó tem apenas um filho), a busca tem tempo O(n). Portanto, o conhecimento sobre o balanceamento da árvore é crucial para evitar essa armadilha."
            }
        }
    ]
});
