# Classe: B

# Conteúdo: Python: Sintaxe, Variáveis e Tipos de Dados

## 1\. Sintaxe, Variáveis e Tipos de Dados

> **TEORIA-ALVO**
>
> Python é uma linguagem de programação de alto nível, interpretada, multiparadigma e com uma sintaxe que prioriza a legibilidade.
>
>   * **Sintaxe Fundamental:**
>       * **Indentação Significativa:** Python utiliza a indentação (espaços em branco no início da linha) para definir blocos de código, como o corpo de funções, laços e estruturas condicionais. Não utiliza chaves `{}` ou palavras-chave como `begin`/`end` para essa finalidade.
>       * **Comentários:** Iniciam com o caractere `#`.
>   * **Variáveis:**
>       * **Criação:** Uma variável é criada no momento em que recebe seu primeiro valor. Não há um comando de declaração explícito.
>       * **Tipagem Dinâmica:** O tipo de uma variável é determinado em tempo de execução e pode mudar durante a vida da variável. Uma variável que armazena um inteiro pode, posteriormente, receber uma string.
>       * **Tipagem Forte:** Python não realiza coerção (conversão) implícita entre tipos incompatíveis. A operação `'a' + 1` resulta em um `TypeError`.
>   * **Tipos de Dados Primitivos:**
>       * **`int`:** Números inteiros de precisão arbitrária.
>       * **`float`:** Números de ponto flutuante (reais).
>       * **`bool`:** Valores lógicos, `True` ou `False`.
>       * **`str`:** Sequências de caracteres Unicode, imutáveis.
>       * **`NoneType`:** Um tipo especial que possui um único valor, `None`, usado para representar a ausência de valor.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Indentação:** Este é o ponto mais crítico e exclusivo da sintaxe Python. A banca apresentará trechos de código com indentação inconsistente ou incorreta, o que constitui um `IndentationError`. A lógica do programa pode ser drasticamente alterada por um nível de indentação equivocado.
> >   * **Tipagem Dinâmica vs. Forte:** A banca pode confundir os conceitos. Python é **dinâmico** porque o tipo é associado ao valor, não à variável. É **forte** porque proíbe operações entre tipos incompatíveis sem conversão explícita. A banca pode afirmar que, por ser dinâmico, Python realiza conversões automáticas como em `3 + "3"` resultando em `"33"`. **ERRADO**. Isso geraria um `TypeError`.
> >   * **Valor de `None`:** `None` não é o mesmo que `False`, `0` ou uma string vazia `""`. Em um contexto booleano, `None` é avaliado como falso, mas a comparação `None == False` resulta em `False`.

-----

# Classe: B

# Conteúdo: Estruturas de Dados Nativas

## 2\. Estruturas de Dados Nativas

> **TEORIA-ALVO**
>
> Python oferece um conjunto rico de estruturas de dados (*data structures*) nativas e de alto nível, que são fundamentais para a linguagem.
>
>   * **Listas (`list`):**
>       * **Definição:** Uma coleção **ordenada** e **mutável** de elementos. Permite elementos duplicados e de tipos diferentes.
>       * **Sintaxe:** `[item1, item2, ...]`
>   * **Tuplas (`tuple`):**
>       * **Definição:** Uma coleção **ordenada** e **imutável** de elementos.
>       * **Sintaxe:** `(item1, item2, ...)`
>   * **Dicionários (`dict`):**
>       * **Definição:** Uma coleção de pares **chave-valor**. Em versões de Python a partir da 3.7, a ordem de inserção é preservada. As chaves devem ser únicas e de um tipo imutável.
>       * **Sintaxe:** `{'chave1': valor1, 'chave2': valor2, ...}`
>   * **Conjuntos (`set`):**
>       * **Definição:** Uma coleção **não ordenada** de elementos **únicos** e imutáveis.
>       * **Sintaxe:** `{item1, item2, ...}` (Nota: `{}` cria um dicionário vazio; um conjunto vazio é criado com `set()`).

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Mutabilidade: `list` vs. `tuple`:** Esta é a principal distinção e a fonte mais comum de questões. Uma **lista** pode ter seus elementos alterados, adicionados ou removidos após a criação. Uma **tupla** é imutável; qualquer tentativa de alterar um de seus elementos resultará em um `TypeError`. A banca fornecerá um código que tenta modificar uma tupla e o candidato deve identificar o erro.
> >   * **Unicidade de Elementos:** **Conjuntos** não permitem elementos duplicados. **Dicionários** não permitem chaves duplicadas. A banca pode apresentar a criação de um `set` como `s = {1, 2, 2, 3}` e perguntar o valor de `s`. A resposta correta é `{1, 2, 3}`.
> >   * **Chaves de Dicionário:** As chaves de um dicionário devem ser de um tipo **imutável** (e.g., `int`, `float`, `str`, `tuple`). A banca pode tentar usar uma lista como chave de dicionário, o que geraria um `TypeError: unhashable type: 'list'`.
> >   * **Ordenação:** Listas e Tuplas são sequências ordenadas, e seus elementos são acessados por um índice numérico. Dicionários (modernamente) e Conjuntos não são acessados por índice numérico, mas por chave (dicionário) ou pela verificação de pertencimento (conjunto).

-----

# Classe: B

# Conteúdo: Controle de Fluxo

## 3\. Controle de Fluxo

> **TEORIA-ALVO**
>
> As estruturas de controle de fluxo direcionam a ordem em que as instruções de um programa são executadas.
>
>   * **Estruturas Condicionais:** Permitem a execução seletiva de código.
>       * **`if`:** Executa um bloco de código se uma condição for `True`.
>       * **`elif`:** Permite a verificação de múltiplas condições de forma encadeada. É uma contração de "else if".
>       * **`else`:** Executa um bloco de código se nenhuma das condições anteriores (`if` ou `elif`) for `True`.
>   * **Estruturas de Repetição (Laços):**
>       * **`for`:** Itera sobre os itens de qualquer objeto iterável (e.g., `list`, `tuple`, `dict`, `str`). É um laço do tipo "for-each".
>         ```python
>         for item in minha_lista:
>             print(item)
>         ```
>       * **`while`:** Executa um bloco de código repetidamente enquanto uma condição permanecer `True`.
>   * **Comandos de Desvio:**
>       * **`break`:** Interrompe e sai imediatamente do laço (`for` ou `while`) mais interno.
>       * **`continue`:** Interrompe a iteração atual e salta para o topo do laço para iniciar a próxima iteração.
>       * **`pass`:** É uma instrução nula. Não faz nada e é usada como um *placeholder* onde a sintaxe exige uma instrução.
>       * **Cláusula `else` em Laços:** Python permite uma cláusula `else` opcional no final de laços `for` e `while`. O bloco `else` é executado **se e somente se** o laço for concluído normalmente (i.e., não for interrompido por um `break`).

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **A Cláusula `else` em Laços:** Esta é uma característica peculiar do Python e um excelente alvo para questões. A banca apresentará um laço com uma cláusula `else` e um `break` condicional. O candidato precisa saber que o bloco `else` **não será executado** se o `break` for acionado.
> >   * **Iteração sobre Dicionários:** Por padrão, um laço `for` sobre um dicionário itera sobre suas **chaves**. Para iterar sobre os valores ou os pares chave-valor, deve-se usar os métodos `.values()` ou `.items()`, respectivamente.
> >   * **`pass` vs. `continue`:** A banca pode confundir os propósitos. `pass` é um marcador de posição que não faz nada. `continue` afeta ativamente o fluxo de um laço, pulando para a próxima iteração.

-----

# Classe: B

# Conteúdo: Funções

## 4\. Funções

> **TEORIA-ALVO**
>
> Funções são blocos de código reutilizáveis que realizam uma tarefa específica. São definidas com a palavra-chave `def`.
>
>   * **Definição e Retorno:**
>       * `def nome_da_funcao(parametro1, parametro2):`
>       * A instrução `return` é usada para sair de uma função e opcionalmente retornar um valor. Uma função que não possui uma instrução `return` explícita retorna `None` por padrão.
>   * **Argumentos:**
>       * **Posicionais:** Passados na ordem em que foram definidos.
>       * **Nomeados (*Keyword*):** Passados na forma `nome=valor`, independentemente da ordem.
>       * **Valores Padrão:** Um parâmetro pode ter um valor padrão, tornando-o opcional na chamada da função. `def func(a, b=10): ...`
>   * **Escopo de Variáveis (Regra LEGB):** A ordem de busca de uma variável é:
>     1.  **L (Local):** Dentro da função atual.
>     2.  **E (Enclosing):** No escopo de quaisquer funções aninhadas (envolventes).
>     3.  **G (Global):** No escopo principal do módulo.
>     4.  **B (Built-in):** Nos nomes pré-definidos do Python.
>     <!-- end list -->
>       * Para **modificar** uma variável global de dentro de uma função, é necessário usar a palavra-chave `global nome_da_variavel`.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Argumentos Padrão Mutáveis:** Esta é uma pegadinha clássica. Se um argumento padrão for um tipo mutável (como uma `list` ou `dict`), ele é criado **uma única vez** quando a função é definida, e não a cada chamada. Isso pode levar a resultados inesperados, pois modificações no argumento padrão em uma chamada afetarão as chamadas subsequentes.
> >   * **Escopo e a Palavra-chave `global`:** A banca fornecerá um trecho de código com variáveis de mesmo nome em escopos diferentes. Se uma função atribui um valor a uma variável (e.g., `x = 10`), ela cria uma **nova variável local `x`** por padrão. Para modificar a variável `x` global, a instrução `global x` é obrigatória.
> >   * **Retorno Implícito de `None`:** A banca pode apresentar uma função sem `return` e perguntar o valor de uma variável que recebe o resultado da chamada dessa função. A resposta correta é `None`.

-----

# Classe: C

# Conteúdo: Manipulação de Arquivos

## 5\. Manipulação de Arquivos

> **TEORIA-ALVO**
>
> Python oferece funcionalidades nativas e diretas para a manipulação de arquivos em disco. A abordagem recomendada é o uso do gerenciador de contexto `with`.
>
>   * **Abertura de Arquivos:**
>       * A função `open(caminho_do_arquivo, modo)` é utilizada para abrir um arquivo e retornar um objeto de arquivo.
>       * **Modos de Abertura Principais:**
>           * `'r'`: Leitura (padrão). Gera um erro se o arquivo não existir.
>           * `'w'`: Escrita. **Cria um novo arquivo ou sobrescreve** o conteúdo de um arquivo existente.
>           * `'a'`: Apêndice (*append*). Adiciona conteúdo ao **final** de um arquivo existente, sem apagar o conteúdo anterior. Cria o arquivo se ele não existir.
>           * `'b'`: Modo binário (e.g., `'rb'`, `'wb'`).
>   * **Gerenciador de Contexto (`with`):** É a forma idiomática e mais segura de trabalhar com arquivos, pois garante que o arquivo seja fechado automaticamente ao final do bloco, mesmo que ocorram exceções.
>     ```python
>     with open('dados.txt', 'r') as arquivo:
>         conteudo = arquivo.read()
>     # O arquivo já está fechado aqui
>     ```
>   * **Métodos de Leitura e Escrita:**
>       * `arquivo.read()`: Lê o conteúdo inteiro do arquivo.
>       * `arquivo.readline()`: Lê uma única linha do arquivo.
>       * `arquivo.readlines()`: Lê todas as linhas do arquivo e as retorna como uma lista de strings.
>       * `arquivo.write(string)`: Escreve uma string no arquivo.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Modos `'w'` vs. `'a'`:** A principal confusão a ser explorada. A banca descreverá um cenário em que se deseja adicionar informações a um log existente. O modo correto é `'a'` (*append*). Se o modo `'w'` (*write*) for usado, todo o conteúdo anterior do log será **apagado**.
> >   * **Fechamento Automático com `with`:** A banca pode apresentar um código que não utiliza a declaração `with` e não chama `arquivo.close()` explicitamente. Isso é uma má prática, pois pode deixar o arquivo aberto, consumindo recursos ou levando a um comportamento inconsistente. O uso do `with` é a forma correta de garantir o fechamento.
> >   * **Leitura e o Cursor:** Métodos como `read()` e `readline()` movem um cursor interno no arquivo. Após ler o arquivo inteiro com `read()`, uma chamada subsequente a `read()` no mesmo objeto de arquivo retornará uma string vazia, pois o cursor já está no final.