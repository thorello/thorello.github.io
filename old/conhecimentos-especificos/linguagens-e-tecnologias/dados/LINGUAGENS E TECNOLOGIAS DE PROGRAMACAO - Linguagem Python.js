todosOsDados.push({
    tituloPrincipal: "Linguagem Python",
    conceitos: [
        {
            id: 1,
            titulo: "Sintaxe da Linguagem Python",
            teoria: `
                <p>A sintaxe do Python é reconhecida por sua simplicidade e legibilidade, priorizando a identação como parte fundamental da estrutura do código. Ao contrário de outras linguagens que utilizam chaves para definir blocos de código, Python utiliza a indentação rigorosa para este propósito. Isso significa que a falta de um espaço ou indentação correta pode alterar o significado do código ou causar erros de execução. Além disso, Python é dinâmicamente tipado e case sensitive, ou seja, distingue entre maiúsculas e minúsculas nos identificadores. A sintaxe clara e direta é uma das razões para Python ser amplamente adotado na educação e desenvolvimento de software.</p>`,
            analogiaPokemon: `Imagine que a sintaxe do Python é como a região de Pallet Town. Tudo é organizado e claro, as rotas são diretas, mas qualquer desvio pode te levar para a grama alta onde Pokémons selvagens aparecem inesperadamente - da mesma forma, uma indentação incorreta pode levar a erros.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em Python, blocos de código são definidos por chaves, e a linguagem é insensível a maiúsculas e minúsculas, facilitando a programação."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A afirmação está incorreta porque, em Python, os blocos de código são definidos pela indentação e não por chaves. Além disso, Python é sensível a maiúsculas e minúsculas, o que significa que 'Variable', 'variable' e 'VARIABLE' seriam vistos como identificadores completamente distintos."
            }
        },
        {
            id: 2,
            titulo: "Variáveis e Tipos de Dados em Python",
            teoria: `
                <p>Em Python, uma variável é basicamente um nome para um valor armazenado na memória do computador. Python é uma linguagem de tipagem dinâmica, o que significa que uma variável pode ser atribuída a valores de diferentes tipos durante a execução do programa. Os tipos de dados básicos em Python incluem inteiros (int), ponto flutuante (float), strings (str), e booleanos (bool). Uma característica interessante é que Python permite a comparação e até mesmo operações entre tipos diferentes, mas isso pode levar a exceções se não cuidado adequadamente. Variáveis também são case-sensitive, portanto 'idade' e 'Idade' são variáveis diferentes.</p>`,
            analogiaPokemon: `Pense nas variáveis como as Pokébolas onde você guarda seus Pokémon. Cada Pokébola (variável) pode conter um Pokémon de um tipo diferente (tipo de dados). E diferente das Pokébolas tradicionais, essas podem mudar o Pokémon que guardam a qualquer momento!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em Python, uma vez que uma variável é atribuída a um tipo de dado específico, como um inteiro, não é possível mudar seu tipo de dado, e a linguagem não diferencia entre variáveis diferenciadas por letras maiúsculas e minúsculas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A afirmação está errada porque em Python é possível mudar o tipo de dado de uma variável durante a execução do programa devido à sua tipagem dinâmica. Além disso, Python é sensível a maiúsculas e minúsculas."
            }
        },
        {
            id: 3,
            titulo: "Estruturas de Controle de Fluxo em Python",
            teoria: `
                <p>As estruturas de controle de fluxo em Python, como em outras linguagens de programação, são usadas para direcionar a sequência de execução do código. As principais estruturas incluem: condicionais (if, elif, else), laços de repetição (for, while) e controle de fluxo com break, continue e pass. O Python se destaca por sua sintaxe clara nessas estruturas, utilizando dois pontos (:) e indentação para definir os blocos de código. A linguagem é cuidadosa com a indentação, o que significa que erros podem ocorrer facilmente se não forem mantidos níveis consistentes de espaço em branco.</p>`,
            analogiaPokemon: `Controlar o fluxo em Python é como comandar seu time Pokémon em uma batalha. Você diz ao Pikachu quando atacar (condicional), ou quantas vezes usar uma habilidade (laço de repetição), e quando recuar para a Pokébola (break).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em Python, o uso de break dentro de um loop for ou while provoca a saída do loop, mas não afeta a execução de códigos que estão fora deste loop."
            },
            analise: {
                gabarito: "CERTO",
                explicacao: "A afirmação está correta. O break é utilizado dentro de loops para interromper a execução do loop imediatamente, porém não afeta a execução dos códigos subsequentes fora da estrutura do loop."
            }
        },
        {
            id: 4,
            titulo: "Estruturas de Dados em Python",
            teoria: `
                <p>Python oferece diversas estruturas de dados integradas que facilitam o armazenamento e manipulação de conjuntos de dados. As principais são listas (list), tuplas (tuple), conjuntos (set) e dicionários (dict). Listas e tuplas são sequências ordenadas de elementos, mas listas são mutáveis, enquanto tuplas são imutáveis. Conjuntos são coleções não ordenadas de elementos únicos, ideais para operações de conjunto como união e interseção. Já os dicionários são coleções de pares chave-valor, permitindo o acesso rápido a elementos através de suas chaves. A escolha entre essas estruturas depende das necessidades específicas de manipulação de dados de cada aplicação.</p>`,
            analogiaPokemon: `Imagine as estruturas de dados como diferentes tipos de Pokébolas: Listas são como Pokébolas normais, sempre prontas para mudar seu conteúdo de Pokémons. Tuplas são as Pokébolas Master, uma vez que pegam o Pokémon, nunca mudam de treinador. Conjuntos são Pokébolas que garantem apenas Pokémons únicos em seu inventário, e dicionários são como a Pokédex: uma referência rápida e eficiente para informações sobre cada Pokémon pelo seu nome.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Dicionários em Python permitem que múltiplos valores sejam associados à mesma chave, similar às listas, e sua busca por elementos é sequencial, tornando operações de pesquisa mais lentas em grandes conjuntos de dados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A afirmação está errada porque em dicionários, cada chave é única, e não podem haver múltiplos valores associados à mesma chave sem sobrescrever o valor anterior. Além disso, a busca em dicionários não é sequencial; eles usam uma tabela hash."
            }
        },
        {
            id: 5,
            titulo: "Funções em Python",
            teoria: `
                <p>Funções em Python são blocos de código reutilizáveis que executam uma tarefa específica. Podem receber parâmetros como entrada, processar esses dados e retornar resultados. As funções são definidas usando a palavra-chave def, seguida pelo nome da função e parênteses, que podem conter parâmetros. Python também suporta funções anônimas, chamadas de lambdas, que são úteis para expressões curtas. Um ponto crucial é a possibilidade de retorno múltiplo: uma função pode retornar mais de um valor como uma tupla. Além disso, Python permite funções aninhadas, funções como objetos de primeira classe, e funções decoradoras, que são utilizadas para modificar o comportamento de outras funções.</p>`,
            analogiaPokemon: `Pense nas funções como treinadores Pokémon, enviados para executar batalhas (tarefas). Eles recebem seus Pokémon (parâmetros), fazem o melhor uso deles em combate (processamento) e trazem os resultados da batalha de volta (valores de retorno).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Uma função em Python não pode alterar variáveis definidas fora de seu escopo, pois somente as variáveis locais são influenciadas, e funções aninhadas não são permitidas no Python."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A afirmação é errada porque uma função pode sim alterar variáveis fora de seu escopo se elas forem mutáveis, como listas ou dicionários, ou se a variável for declarada global. Além disso, Python permite o uso de funções aninhadas."
            }
        },
        {
            id: 6,
            titulo: "Manipulação de Arquivos em Python",
            teoria: `
                <p>A manipulação de arquivos em Python é feita utilizando funções integradas que permitem abrir, ler, gravar e fechar arquivos. A função open() é usada para abrir um arquivo, retornando um objeto arquivo. É possível abrir arquivos em diferentes modos, como leitura ('r'), escrita ('w'), anexação ('a'), e modos de leitura/escrita binária ('rb', 'wb'). Após a manipulação, é essencial fechar o arquivo usando o método close(), embora o uso do gerenciador de contexto with seja recomendado, pois automaticamente fecha o arquivo ao sair do bloco de código. Erros comuns incluem esquecer de fechar arquivos ou não tratar exceções durante operações de leitura e escrita.</p>`,
            analogiaPokemon: `Trabalhar com arquivos em Python é como treinar com manuais de treinador Pokémon: você abre o manual (abre o arquivo), lê ou faz anotações (lê ou escreve dados), e o guarda cuidadosamente quando termina (fecha o arquivo).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Ao abrir um arquivo com o modo de escrita ('w') em Python, o conteúdo atual será preservado, permitindo que novos dados sejam acrescentados ao final do arquivo."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A afirmação está errada, pois abrir um arquivo em modo de escrita ('w') limpa o conteúdo existente do arquivo antes de gravar qualquer novo dado. Se o objetivo é acrescentar dados sem apagar o conteúdo existente, o modo correto é o de anexação ('a')."
            }
        }
    ]
});
