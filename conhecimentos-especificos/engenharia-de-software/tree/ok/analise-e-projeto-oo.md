# Classe: B
# Conteúdo: Análise e Projeto OO: Conceitos fundamentais

## 1. Conceitos Fundamentais

> **TEORIA-ALVO**
>
> O Paradigma de Orientação a Objetos (POO) é um modelo de análise, projeto e programação de software baseado na composição e interação entre diversas unidades de software denominadas objetos. Os conceitos basilares são:
>
> * **Classe:** Um modelo ou molde (*blueprint*) que define os atributos (dados) e métodos (comportamentos) comuns a um certo tipo de objeto. É uma entidade abstrata, que não ocupa espaço em memória por si só.
> * **Objeto:** Uma instância concreta de uma classe. Enquanto a classe `Carro` define que carros têm cor e podem acelerar, um objeto específico seria `meuCarro`, com a cor "vermelha" e capaz de executar a ação de acelerar. Objetos possuem estado, comportamento e identidade.
> * **Atributo:** Uma característica ou dado que define o estado de um objeto. Corresponde às variáveis de um objeto. No exemplo da classe `Carro`, `cor` e `velocidadeAtual` são atributos.
> * **Método:** Uma ação ou comportamento que um objeto pode executar. Corresponde às funções ou procedimentos de um objeto. Métodos geralmente operam sobre os atributos do próprio objeto. Na classe `Carro`, `acelerar()` e `frear()` são métodos.
> * **Instanciação:** O processo de criar um objeto a partir de uma classe.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Classe vs. Objeto:** A distinção é o ponto mais explorado. A banca frequentemente inverte os conceitos. Itens podem afirmar que "um objeto serve como modelo para a criação de classes". **ERRADO**. A classe é o modelo; o objeto é a instância.
> > * **Estado vs. Comportamento:** A banca pode confundir as responsabilidades. "O estado de um objeto é determinado por seus métodos". **ERRADO**. O **estado** é determinado pelos valores de seus **atributos**. O **comportamento** é definido por seus **métodos**.
> > * **Abstração vs. Concretude:** É fundamental entender que a Classe é uma entidade do campo da abstração, enquanto o Objeto é uma entidade concreta, existente em memória durante a execução do programa.

---
# Classe: B
# Conteúdo: Abstração

## 2. Abstração

> **TEORIA-ALVO**
>
> A abstração é o pilar da orientação a objetos que consiste em focar nos aspectos essenciais de uma entidade, ignorando detalhes irrelevantes ou acidentais para um determinado contexto. É o processo de simplificação da complexidade do mundo real ao modelar classes e objetos, concentrando-se no "o que" um objeto faz, em vez de "como" ele faz.
>
> * **Propósito:** Gerenciar a complexidade ao destacar as características relevantes de um objeto e suprimir as que não são importantes para o problema em questão.
> * **Exemplo:** Ao modelar uma classe `Pessoa` para um sistema de folha de pagamento, atributos como `nome`, `cpf` e `salario` são essenciais. Detalhes como `cor_dos_olhos` ou `time_de_futebol`, embora existam na pessoa real, são abstraídos por serem irrelevantes para o contexto do sistema.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Abstração vs. Encapsulamento:** Estes conceitos são frequentemente confundidos. A **Abstração** é um processo mental e de design, focado em **simplificar e modelar** ao omitir detalhes. O **Encapsulamento** é um mecanismo de implementação, focado em **proteger e ocultar** os detalhes internos de um objeto já modelado. A abstração resolve um problema no domínio do design; o encapsulamento, no domínio da implementação.
> > * **Nível de Detalhe:** A banca pode afirmar que uma boa abstração é aquela que captura o máximo de detalhes de uma entidade do mundo real. **ERRADO**. A eficácia da abstração reside justamente na sua capacidade de **omitir seletivamente** os detalhes, mantendo apenas o que é pertinente ao escopo do problema.
> > * **Abstração como Conceito e não Implementação:** A abstração é um princípio. Em linguagens de programação, ela é materializada por meio de classes, classes abstratas e interfaces, que são ferramentas para implementar o conceito.

---
# Classe: B
# Conteúdo: Encapsulamento

## 3. Encapsulamento

> **TEORIA-ALVO**
>
> O encapsulamento é o mecanismo de agrupar dados (atributos) e os métodos que os manipulam em uma única unidade, a classe. Adicionalmente, restringe o acesso direto ao estado do objeto, um princípio conhecido como **ocultação de informação** (*information hiding*). O acesso aos dados deve ser feito por meio de uma interface pública de métodos (e.g., `getters` e `setters`).
>
> * **Modificadores de Acesso:** São as ferramentas que implementam o encapsulamento.
>     * `public`: Acesso irrestrito.
>     * `private`: Acesso restrito à própria classe.
>     * `protected`: Acesso restrito à própria classe e a suas subclasses.
> * **Benefícios:**
>     * **Proteção de Dados:** Impede modificações inconsistentes no estado do objeto.
>     * **Redução da Complexidade:** Oculta detalhes de implementação, expondo apenas o necessário.
>     * **Facilidade de Manutenção:** A implementação interna de uma classe pode ser alterada sem impactar o código que a utiliza, desde que a interface pública permaneça a mesma.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Encapsulamento vs. Ocultação de Informação:** Embora relacionados, não são sinônimos. **Encapsulamento** é o ato de "colocar em uma cápsula" (agrupar dados e métodos). **Ocultação de Informação** é o princípio de esconder os detalhes internos. O encapsulamento é o mecanismo que torna a ocultação de informação possível. A banca pode usar os termos de forma intercambiável, mas uma questão mais técnica pode explorar essa nuance.
> > * **Objetivo Final:** A banca pode sugerir que o objetivo do encapsulamento é dificultar o acesso aos dados. **INCORRETO**. O objetivo não é dificultar, mas sim **controlar** o acesso, garantindo a integridade do estado do objeto.
> > * **`Getters` e `Setters`:** A simples presença de métodos `get` e `set` públicos para todos os atributos não garante um bom encapsulamento, pois pode expor a implementação e violar o princípio da ocultação de informação. Um bom encapsulamento expõe comportamento, e não apenas dados.

---
# Classe: B
# Conteúdo: Herança

## 4. Herança

> **TEORIA-ALVO**
>
> A herança é um mecanismo que permite que uma classe (denominada subclasse ou classe derivada) adquira os atributos e métodos de outra classe (superclasse ou classe base). A herança representa um relacionamento do tipo **"é um"** (*is a*).
>
> * **Propósito:** Promover o reuso de código e estabelecer uma hierarquia de classificação entre as classes.
> * **Tipos:**
>     * **Herança Simples:** Uma subclasse herda de apenas uma superclasse (padrão em linguagens como Java e C#).
>     * **Herança Múltipla:** Uma subclasse herda de múltiplas superclasses (suportada em C++, Python). Pode gerar o "problema do diamante" (ambiguidade na herança de métodos com mesma assinatura de superclasses distintas).
> * **Exemplo:** A classe `Cachorro` e a classe `Gato` podem herdar da classe `Animal`. Ambas reutilizam os atributos (`peso`, `idade`) e métodos (`comer()`) de `Animal`, além de poderem ter seus próprios comportamentos específicos, como `latir()` e `miar()`.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Herança vs. Composição ("é um" vs. "tem um"):** Esta é a pegadinha mais crítica sobre o tema. **Herança** ("é um"): um `Gerente` *é um* `Funcionario`. **Composição** ("tem um"): um `Carro` *tem um* `Motor`. A banca apresentará um cenário de composição (relação "tem um") e afirmará que a herança é a modelagem correta. **ERRADO**. A máxima "prefira composição sobre herança" é um princípio de design fundamental, pois a composição leva a um acoplamento mais fraco e a sistemas mais flexíveis.
> > * **Herança Múltipla e Interfaces:** A banca pode questionar como linguagens como Java lidam com a ausência de herança múltipla de classes. A resposta é através de **Interfaces**. Uma classe Java pode `implementar` múltiplas interfaces, herdando assim múltiplos *tipos* e assinaturas de métodos, mas não a implementação.
> > * **Quebra de Encapsulamento:** A herança pode quebrar o encapsulamento, pois a subclasse pode ter acesso a membros `protected` da superclasse, criando um acoplamento forte entre elas. Uma alteração na superclasse pode forçar alterações em todas as subclasses.

---
# Classe: B
# Conteúdo: Polimorfismo

## 5. Polimorfismo

> **TEORIA-ALVO**
>
> Polimorfismo (do grego, "muitas formas") é a capacidade de uma variável, função ou objeto de assumir múltiplas formas. Em POO, refere-se à capacidade de um objeto responder a uma mesma mensagem (chamada de método) de maneiras diferentes, dependendo de sua classe.
>
> * **Tipos de Polimorfismo:**
>     * **Sobrescrita (`Overriding`):** Ocorre quando uma subclasse fornece uma implementação específica para um método que já é definido em sua superclasse. A assinatura do método (nome e parâmetros) deve ser idêntica. Este é o **polimorfismo de tempo de execução** (ou *late binding*).
>         * Exemplo: A superclasse `Animal` tem um método `fazerSom()`. As subclasses `Cachorro` e `Gato` sobrescrevem este método para emitir "Au au" e "Miau", respectivamente. Uma variável do tipo `Animal` pode referenciar um objeto `Cachorro` ou `Gato` e, ao chamar `fazerSom()`, o som correto será emitido em tempo de execução.
>     * **Sobrecarga (`Overloading`):** Ocorre quando múltiplos métodos com o mesmo nome, mas com assinaturas diferentes (número, tipo ou ordem dos parâmetros), coexistem na mesma classe. Este é o **polimorfismo de tempo de compilação** (ou *early binding*).

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Sobrescrita (`Overriding`) vs. Sobrecarga (`Overloading`):** Esta é a questão mais frequente e clássica sobre polimorfismo. A banca vai trocar os conceitos. Lembre-se:
> >     * **Sobrescrita:** Mesma assinatura, classes diferentes (relação de herança).
> >     * **Sobrecarga:** Mesmo nome, assinaturas diferentes, mesma classe.
> > * **Ligação Tardia (*`Late Binding`*):** O polimorfismo de sobrescrita depende fundamentalmente do mecanismo de ligação tardia, pelo qual a decisão de qual implementação do método será executada é adiada para o tempo de execução, baseada no tipo real do objeto, e não no tipo da variável de referência.
> > * **Interfaces:** Interfaces são um mecanismo poderoso para alcançar polimorfismo. Uma função que recebe um parâmetro do tipo de uma interface pode operar sobre objetos de quaisquer classes que implementem essa interface, sem conhecer seus tipos concretos.

---
# Classe: B
# Conteúdo: Análise e Modelagem

## 6. Análise e Modelagem (UML)

> **TEORIA-ALVO**
>
> **Análise Orientada a Objetos (AOO)** foca em compreender e modelar o domínio do problema, identificando classes, seus atributos e relacionamentos. Responde "o que" o sistema deve fazer. **Projeto Orientado a Objetos (POO)** foca em definir a solução, especificando a arquitetura de software e como as classes serão implementadas para atender aos requisitos. Responde "como" o sistema fará. A **`UML` (Unified Modeling Language)** é a linguagem de modelagem padrão para este processo.
>
> * **Principais Diagramas `UML`:**
>     * **Estruturais (Visão Estática):**
>         * **Diagrama de Classes:** O principal diagrama da `UML`. Descreve a estrutura do sistema em termos de classes, atributos, métodos e os relacionamentos entre elas.
>         * **Diagrama de Objetos:** Um "instantâneo" do sistema em um determinado momento, mostrando objetos e seus valores.
>     * **Comportamentais (Visão Dinâmica):**
>         * **Diagrama de Casos de Uso:** Descreve a funcionalidade do sistema a partir da perspectiva de um ator externo.
>         * **Diagrama de Sequência:** Mostra a interação entre objetos ordenada no tempo (ênfase na ordem das mensagens).
>         * **Diagrama de Atividades:** Modela o fluxo de trabalho (*workflow*) de processos, similar a um fluxograma.
> * **Relacionamentos em Diagramas de Classes:**
>     * **Associação:** Relação estrutural entre classes.
>     * **Agregação:** Uma forma de associação "tem-um", onde o ciclo de vida da parte é independente do todo (losango vazado). Ex: Uma `Universidade` tem `Departamentos`.
>     * **Composição:** Uma forma forte de agregação "parte-de", onde o ciclo de vida da parte depende do todo (losango preenchido). Ex: Uma `NotaFiscal` é composta por `ItensDeNota`.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Propósito dos Diagramas:** A banca frequentemente troca a finalidade dos diagramas. Ex: "O Diagrama de Sequência descreve a estrutura estática do sistema". **ERRADO**. Ele descreve o comportamento dinâmico. "O Diagrama de Casos de Uso detalha a lógica interna de uma funcionalidade". **ERRADO**. Ele descreve a funcionalidade da perspectiva do usuário, sem detalhar a implementação.
> > * **Agregação vs. Composição:** A distinção sutil é alvo certo. **Agregação** (losango vazado) = independência de ciclo de vida. **Composição** (losango preenchido) = dependência de ciclo de vida (o todo é "dono" da parte). A banca apresentará um cenário e pedirá a classificação correta.
> > * **`UML` é Notação, não Metodologia:** A `UML` é uma linguagem para modelar, não um processo ou metodologia (como RUP ou Scrum). A banca pode afirmar que a `UML` prescreve um processo de desenvolvimento. **ERRADO**.

---
# Classe: B
# Conteúdo: Padrões de Projeto

## 7. Padrões de Projeto

> **TEORIA-ALVO**
>
> Padrões de Projeto (*Design Patterns*) são soluções gerais e reutilizáveis para problemas que ocorrem com frequência no projeto de software orientado a objetos. Não são códigos prontos, mas sim templates que descrevem como resolver um problema. A catalogação mais famosa é a do "Gang of Four" (GoF).
>
> * **Categorias GoF:**
>     * **Criacionais:** Lidam com a criação de objetos, tornando o sistema independente de como seus objetos são criados.
>         * **Singleton:** Garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global a ela.
>         * **Factory Method:** Define uma interface para criar um objeto, mas deixa as subclasses decidirem qual classe instanciar.
>         * **Abstract Factory:** Fornece uma interface para criar famílias de objetos relacionados ou dependentes sem especificar suas classes concretas.
>     * **Estruturais:** Lidam com a composição de classes e objetos para formar estruturas maiores e mais flexíveis.
>         * **Adapter:** Converte a interface de uma classe em outra interface que os clientes esperam, permitindo que classes com interfaces incompatíveis trabalhem juntas.
>         * **Decorator:** Anexa responsabilidades adicionais a um objeto dinamicamente.
>         * **Facade:** Fornece uma interface unificada e simplificada para um conjunto de interfaces em um subsistema.
>     * **Comportamentais:** Focam na comunicação e na distribuição de responsabilidades entre os objetos.
>         * **Strategy:** Define uma família de algoritmos, encapsula cada um deles e os torna intercambiáveis.
>         * **Observer:** Define uma dependência um-para-muitos, de modo que, quando um objeto muda de estado, todos os seus dependentes são notificados e atualizados automaticamente.
>         * **Template Method:** Define o esqueleto de um algoritmo em uma operação, adiando alguns passos para as subclasses.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Intenção do Padrão:** O foco das questões é quase sempre na **intenção** (no problema que o padrão resolve), não na sua implementação. A banca descreverá um problema de design e pedirá para identificar o padrão GoF correspondente, ou dará o nome de um padrão e uma descrição incorreta de sua finalidade.
> > * **Categorização:** Saber a qual categoria (Criacional, Estrutural, Comportamental) um padrão pertence é fundamental e frequentemente cobrado. Ex: "O padrão Singleton é um padrão estrutural". **ERRADO**. É criacional.
> > * **Confusão entre Padrões Similares:** A banca explora a confusão entre padrões com propósitos parecidos.
> >     * **Factory Method vs. Abstract Factory:** Factory Method cria um objeto; Abstract Factory cria uma *família* de objetos relacionados.
> >     * **Decorator vs. Adapter:** Decorator *adiciona* comportamento a um objeto sem mudar sua interface. Adapter *muda* a interface de um objeto para que ele se encaixe em outro sistema.