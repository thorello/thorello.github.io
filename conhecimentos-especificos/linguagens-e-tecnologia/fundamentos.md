### **Classe:** B

### **Conteúdo:** Fundamentos: Lógica de Programação

-----

### **1. Lógica de Programação**

> #### **TEORIA-ALVO**
>
> A Lógica de Programação é a organização e estruturação de um conjunto coerente de instruções, com o objetivo de solucionar um problema específico ou atingir um determinado resultado. É a base para a especificação de algoritmos.
>
>   * **Algoritmo:** Uma sequência finita, ordenada e não ambígua de passos ou instruções que, quando executada, leva à solução de um problema. Um algoritmo deve possuir: entrada, processamento e saída.
>   * **Variáveis e Constantes:**
>       * **Variável:** Um espaço alocado na memória do computador, identificado por um nome, destinado a armazenar um valor que pode ser alterado durante a execução do algoritmo.
>       * **Constante:** Um valor fixo, que não pode ser alterado após sua definição inicial.
>   * **Tipos de Dados Primitivos:** Definem a natureza dos valores que uma variável pode armazenar e as operações que podem ser realizadas sobre eles.
>       * **Inteiro:** Números inteiros, positivos ou negativos, sem parte fracionária (e.g., `-10`, `0`, `150`).
>       * **Real (Ponto Flutuante):** Números que podem conter partes fracionárias (e.g., `-3.14`, `99.0`, `0.001`).
>       * **Caractere (Literal):** Um único símbolo, letra ou número, geralmente delimitado por aspas simples (e.g., `'A'`, `'%'`, `'7'`). Uma sequência de caracteres forma uma cadeia ou *string*.
>       * **Lógico (Booleano):** Representa um de dois valores possíveis: **Verdadeiro** ou **Falso**. É o tipo de dado fundamental para a tomada de decisões.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Algoritmo vs. Programa:** A banca pode tratar os termos como sinônimos. **INCORRETO**. O **algoritmo** é a descrição da lógica, abstrata e independente de linguagem. O **programa** é a implementação concreta desse algoritmo em uma linguagem de programação específica (e.g., Java, Python, C).
> >   * **Declaração vs. Atribuição:** A **declaração** define o nome e o tipo de uma variável (e.g., `declare x: inteiro`). A **atribuição** armazena um valor nessa variável (e.g., `x <- 42`). É comum a banca confundir os conceitos ou apresentar trechos de código onde uma variável é utilizada sem ter sido previamente declarada.
> >   * **Tipagem:** A banca pode explorar a incompatibilidade entre tipos de dados. Por exemplo, tentar atribuir um valor do tipo Real a uma variável do tipo Inteiro sem a devida conversão (truncamento) é uma operação que pode gerar erro ou perda de informação.

-----

### **Classe:** B

### **Conteúdo:** Operadores

-----

### **2. Operadores**

> #### **TEORIA-ALVO**
>
> Operadores são símbolos que representam uma computação, como uma operação aritmética ou uma comparação lógica, e atuam sobre um ou mais operandos (variáveis ou valores).
>
>   * **Operadores Aritméticos:** Realizam cálculos matemáticos.
>       * `+` (Adição), `-` (Subtração), `*` (Multiplicação), `/` (Divisão).
>       * `%` ou `mod` (Módulo): Retorna o resto da divisão inteira.
>   * **Operadores Relacionais:** Comparam dois operandos e retornam um valor lógico (Verdadeiro ou Falso).
>       * `==` (Igual a), `!=` ou `<>` (Diferente de).
>       * `>` (Maior que), `<` (Menor que), `>=` (Maior ou igual a), `<=` (Menor ou igual a).
>   * **Operadores Lógicos (Booleanos):** Combinam expressões lógicas para formar expressões mais complexas.
>       * `E` (`&&`): Retorna Verdadeiro somente se ambos os operandos forem verdadeiros.
>       * `OU` (`||`): Retorna Verdadeiro se pelo menos um dos operandos for verdadeiro.
>       * `NÃO` (`!`): Inverte o valor lógico do operando.
>   * **Precedência de Operadores:** A ordem em que as operações são executadas em uma expressão complexa. Regra geral: 1º Parênteses; 2º Operadores aritméticos (multiplicação/divisão antes de adição/subtração); 3º Operadores relacionais; 4º Operadores lógicos.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Atribuição (`<-` ou `=`) vs. Comparação de Igualdade (`==`):** Esta é a fonte de erro mais clássica. A banca apresentará uma estrutura condicional utilizando o operador de atribuição em vez do de comparação, como em `SE (x = 5)`. Em muitas linguagens, isso é um erro de sintaxe ou de lógica. O correto para a comparação é `SE (x == 5)`.
> >   * **Precedência e Avaliação de Expressões:** A banca fornecerá uma expressão como `5 + 3 * 2 > 10 E NÃO (5 < 3)` e solicitará a avaliação do resultado lógico final. É mandatório conhecer a ordem de precedência para resolver a questão corretamente.
> >   * **Avaliação de Curto-Circuito (*Short-Circuit*):** Em uma expressão `A E B`, se `A` for Falso, o resultado da expressão inteira já é Falso, e a parte `B` não precisa ser avaliada. Similarmente, em `A OU B`, se `A` for Verdadeiro, o resultado já é Verdadeiro, e `B` não é avaliado. A banca pode criar cenários onde a avaliação de `B` teria um efeito colateral (e.g., incrementar uma variável), testando se o candidato sabe que esse efeito não ocorrerá devido ao curto-circuito.

-----

### **Classe:** B

### **Conteúdo:** Estruturas de Controle de Seleção

-----

### **3. Estruturas de Controle de Seleção**

> #### **TEORIA-ALVO**
>
> Estruturas de seleção, ou condicionais, permitem que um algoritmo execute diferentes blocos de instruções com base na avaliação de uma condição lógica (Verdadeiro ou Falso).
>
>   * **Seleção Simples (`SE-ENTÃO`):** Executa um bloco de código somente se uma determinada condição for verdadeira.
>
>     ```pseudocode
>     SE (condição) ENTÃO
>         // Bloco de código a ser executado
>     FIM_SE
>     ```
>
>   * **Seleção Composta (`SE-ENTÃO-SENÃO`):** Executa um bloco de código se a condição for verdadeira, e um bloco de código alternativo se a condição for falsa.
>
>     ```pseudocode
>     SE (condição) ENTÃO
>         // Bloco para condição verdadeira
>     SENÃO
>         // Bloco para condição falsa
>     FIM_SE
>     ```
>
>   * **Seleção Aninhada e Encadeada:** É a prática de colocar uma estrutura `SE` dentro de outra, permitindo a verificação de múltiplas condições de forma hierárquica.
>
>   * **Seleção de Múltipla Escolha (`ESCOLHA-CASO`):** Compara o valor de uma variável com uma lista de valores constantes e executa o bloco de código correspondente ao primeiro valor coincidente.
>
>     ```pseudocode
>     ESCOLHA (variável)
>         CASO valor1:
>             // Bloco de código para valor1
>         CASO valor2:
>             // Bloco de código para valor2
>         CASO CONTRÁRIO:
>             // Bloco padrão (default)
>     FIM_ESCOLHA
>     ```

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Lógica Booleana em Condições:** As condições testadas pela banca raramente são simples. Elas envolverão múltiplas comparações combinadas com operadores lógicos `E`, `OU` e `NÃO`, exigindo uma avaliação cuidadosa da expressão booleana completa.
> >   * **Aninhamento e o "Dangling Else":** Em estruturas aninhadas (`SE` dentro de `SE`), a banca pode criar ambiguidades sobre a qual `SE` um determinado `SENÃO` pertence. A regra padrão é que um `SENÃO` sempre se associa ao `SE` mais próximo e ainda não fechado.
> >   * **`ESCOLHA-CASO` vs. `SE` Encadeado:** A estrutura `ESCOLHA-CASO` (ou `switch`) é geralmente mais eficiente e legível para comparar uma única variável contra múltiplos valores constantes. A banca pode apresentar um problema que é ideal para `ESCOLHA-CASO` e perguntar sobre sua implementação com múltiplos `SE-SENÃO`, ou vice-versa. É importante saber que `ESCOLHA-CASO` não opera sobre faixas de valores (e.g., `idade > 18`), apenas valores discretos.

-----

### **Classe:** B

### **Conteúdo:** Estruturas de Controle de Repetição e Desvio

-----

### **4. Estruturas de Controle de Repetição e Desvio**

> #### **TEORIA-ALVO**
>
> Estruturas de repetição (laços ou *loops*) permitem que um bloco de instruções seja executado repetidamente enquanto uma condição for satisfeita ou por um número predeterminado de vezes.
>
>   * **Repetição com Teste no Início (`ENQUANTO`):** A condição é testada antes de cada execução do bloco. Se a condição for inicialmente falsa, o bloco nunca é executado.
>     ```pseudocode
>     ENQUANTO (condição) FAÇA
>         // Bloco de código
>     FIM_ENQUANTO
>     ```
>   * **Repetição com Teste no Final (`REPITA-ATÉ`):** O bloco de código é executado primeiro e a condição é testada no final. Garante que o bloco seja executado **pelo menos uma vez**.
>     ```pseudocode
>     REPITA
>         // Bloco de código
>     ATÉ (condição)
>     ```
>   * **Repetição com Variável de Controle (`PARA`):** Utilizada quando o número de repetições é conhecido. Uma variável de controle é inicializada, incrementada (ou decrementada) e testada a cada iteração.
>     ```pseudocode
>     PARA contador DE inicio ATÉ fim PASSO p FAÇA
>         // Bloco de código
>     FIM_PARA
>     ```
>   * **Comandos de Desvio (Salto):** Alteram o fluxo de controle normal dentro de um laço.
>       * `interrompa` (`break`): Termina a execução do laço mais interno imediatamente.
>       * `continue` (`continue`): Interrompe a iteração atual e salta para o início da próxima iteração do laço.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **`ENQUANTO` vs. `REPITA-ATÉ`:** A distinção fundamental é que o laço `REPITA-ATÉ` (equivalente ao `do-while`) **sempre executa seu corpo ao menos uma vez**, pois o teste condicional é feito no final. A banca criará cenários onde a condição de um laço é falsa desde o início e perguntará sobre o comportamento do código.
> >   * **Laços Infinitos:** A banca pode apresentar um trecho de código onde a variável de controle do laço nunca é atualizada, ou a condição de parada nunca é atingida. O candidato deve ser capaz de identificar que o código resultará em um laço infinito.
> >   * **`interrompa` (`break`) vs. `continue`:** A confusão entre estes dois comandos é um alvo frequente. **`break`** sai completamente do laço. **`continue`** apenas finaliza a iteração atual e passa para a próxima. A banca apresentará um laço e pedirá o resultado final da execução, que dependerá do entendimento preciso desses comandos.
