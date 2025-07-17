
### **Classe:** B
### **Conteúdo:** Sistemas Web: HTML (HyperText Markup Language)

---

### **1. HTML (HyperText Markup Language)**

> #### **TEORIA-ALVO**
> O HTML é a linguagem de **marcação** padrão utilizada para criar e estruturar páginas e aplicações web. Não se trata de uma linguagem de programação, pois não possui lógica condicional, laços ou outras estruturas computacionais. Sua função é descrever a estrutura semântica do conteúdo.
>
> * **Estrutura Básica (HTML5):** Um documento HTML5 é formado por elementos essenciais:
>     * `<!DOCTYPE html>`: Define que o documento é um HTML5.
>     * `<html>`: O elemento raiz da página.
>     * `<head>`: Contém metadados sobre o documento, como o título (`<title>`), links para folhas de estilo (`<link>`) e scripts (`<script>`). O conteúdo do `<head>` não é visível na página.
>     * `<body>`: Contém todo o conteúdo visível da página web, como textos, imagens, links e parágrafos.
> * **Elementos Semânticos (HTML5):** Fornecem significado e contexto ao conteúdo, melhorando a acessibilidade e a indexação por motores de busca.
>     * `<header>`: Cabeçalho da página ou de uma seção.
>     * `<nav>`: Define um conjunto de links de navegação.
>     * `<main>`: O conteúdo principal e único do documento.
>     * `<article>`: Um conteúdo autossuficiente e independente (e.g., um post de blog, uma notícia).
>     * `<section>`: Um agrupamento temático de conteúdo.
>     * `<aside>`: Conteúdo lateral ou complementar ao conteúdo principal.
>     * `<footer>`: Rodapé da página ou de uma seção.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **HTML como Linguagem de Programação:** A banca frequentemente afirmará que HTML é uma linguagem de programação. **ERRADO**. HTML é uma linguagem de **marcação**, utilizada para **estrutura e semântica**, não para implementar algoritmos.
> > * **Tags Semânticas vs. `<div>` e `<span>`:** A banca pode questionar o uso de tags semânticas. O uso de `<div>` (elemento de bloco genérico) e `<span>` (elemento de linha genérico) é válido, mas as tags semânticas do HTML5 (`<article>`, `<nav>`, etc.) devem ser preferidas quando o conteúdo tiver um significado estrutural claro. Afirmar que `<div id="header">` é semanticamente equivalente a `<header>` é **INCORRETO**.
> > * **Estrutura do Documento:** A banca pode apresentar um trecho de código com elementos posicionados em locais inválidos, como uma tag `<p>` dentro da seção `<head>`, ou a tag `<title>` dentro de `<body>`. É crucial conhecer a hierarquia e o propósito de `<head>` (metadados) e `<body>` (conteúdo).

---

### **Classe:** B
### **Conteúdo:** CSS (Cascading Style Sheets)

---

### **2. CSS (Cascading Style Sheets)**

> #### **TEORIA-ALVO**
> O CSS é uma linguagem de folha de **estilo** utilizada para descrever a apresentação e a formatação de um documento escrito em uma linguagem de marcação como o HTML. Ele separa o conteúdo (HTML) da apresentação (CSS).
>
> * **Regra CSS:** Composta por um **seletor** e um bloco de **declaração**. O seletor aponta para o elemento HTML a ser estilizado, e o bloco de declaração contém uma ou mais declarações (propriedade e valor) separadas por ponto e vírgula.
> * **Seletores:** Mecanismos para selecionar elementos HTML. Principais tipos:
>     * **Tipo/Elemento:** `p` (seleciona todas as tags `<p>`)
>     * **Classe:** `.minha-classe` (seleciona todos os elementos com `class="minha-classe"`)
>     * **ID:** `#meu-id` (seleciona o único elemento com `id="meu-id"`)
> * **Cascata, Especificidade e Herança:**
>     * **Cascata:** A ordem das regras CSS importa. Se duas regras tiverem a mesma especificidade, a última a ser declarada vence.
>     * **Especificidade:** Um cálculo que determina qual regra prevalece quando múltiplos seletores se aplicam a um mesmo elemento. A ordem de "força" é: ID > Classe > Tipo.
>     * **Herança:** Alguns valores de propriedades CSS aplicados a um elemento pai são herdados pelos seus elementos filhos.
> * **Box Model:** Modelo que descreve como os elementos são renderizados. Cada elemento é uma caixa retangular composta por quatro áreas: **Conteúdo**, **Padding** (preenchimento interno), **Border** (borda) e **Margin** (margem externa).

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Especificidade:** Este é o conceito mais cobrado. A banca fornecerá um trecho de HTML e CSS com regras conflitantes e perguntará qual estilo será aplicado. É essencial saber que um seletor de ID (`#id`) é mais específico (mais forte) que um seletor de classe (`.classe`), que por sua vez é mais específico que um seletor de tipo (`p`). O estilo *inline* (`style="..."`) é ainda mais específico.
> > * **Box Model:** A banca explorará a confusão entre `padding` e `margin`. **Padding** é o espaçamento **interno** da caixa, entre o conteúdo e a borda. **Margin** é o espaçamento **externo**, entre a borda do elemento e os elementos vizinhos.
> > * **CSS altera o HTML:** Uma afirmação de que o CSS pode alterar o conteúdo textual de um elemento HTML está, em regra, **ERRADA**. O CSS lida com a apresentação. A exceção é o uso de pseudo-elementos como `::before` e `::after` com a propriedade `content`, mas o foco do CSS é o estilo.

---

### **Classe:** B
### **Conteúdo:** JavaScript

---

### **3. JavaScript**

> #### **TEORIA-ALVO**
> JavaScript (JS) é uma linguagem de **programação** de alto nível, dinâmica, interpretada (ou com compilação JIT - *Just-in-Time*) e multiparadigma. No contexto de sistemas web, é a principal linguagem executada no lado do cliente (navegador) para criar páginas interativas.
>
> * **Função Principal:** Manipular o **DOM (Document Object Model)**. O DOM é uma representação em árvore da estrutura de um documento HTML, e o JavaScript permite acessar, modificar, adicionar ou remover elementos e atributos dessa árvore dinamicamente.
> * **Eventos (*Events*):** JavaScript permite responder a interações do usuário, como cliques (`onclick`), movimentos do mouse (`onmouseover`), pressionamento de teclas (`onkeydown`), etc. Esse modelo orientado a eventos é a base da interatividade na web.
> * **Linguagem de Programação Completa:** Diferentemente de HTML e CSS, JavaScript possui todas as características de uma linguagem de programação, como variáveis, tipos de dados, operadores, estruturas de controle (condicionais e laços), funções e objetos.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **JavaScript vs. Java:** A banca pode afirmar que JavaScript é uma versão de Java para a web ou que são tecnologias relacionadas. **ERRADO**. São duas linguagens distintas, com propósitos e características diferentes, apesar da similaridade no nome.
> > * **JavaScript manipula o quê?:** O principal alvo da manipulação do JavaScript no navegador é o **DOM**. A banca pode afirmar que o JavaScript manipula diretamente o arquivo HTML no servidor. **ERRADO**. O JavaScript opera na representação do documento carregada na memória do navegador.
> > * **Linguagem Compilada vs. Interpretada:** Tradicionalmente, JavaScript é classificada como uma linguagem **interpretada**, pois o navegador lê e executa o código fonte linha a linha. Contudo, motores de JavaScript modernos (como o V8 do Google Chrome) utilizam compilação **Just-In-Time (JIT)** para otimizar a performance, compilando partes do código para código de máquina durante a execução. A banca pode testar essa nuance.

---

### **Classe:** B
### **Conteúdo:** AJAX e XML

---

### **4. AJAX e XML**

> #### **TEORIA-ALVO**
> **AJAX (Asynchronous JavaScript and XML):**
> * **Definição:** Não é uma linguagem, mas uma **técnica** de desenvolvimento web para criar aplicações mais rápidas e interativas. Utiliza um conjunto de tecnologias existentes para permitir que uma página web se comunique com um servidor em **segundo plano (assincronamente)**, sem a necessidade de recarregar a página inteira.
> * **Tecnologias Envolvidas:** HTML/CSS (apresentação), DOM (manipulação da página), JavaScript (orquestração), e o objeto `XMLHttpRequest` ou a `Fetch API` (para a comunicação com o servidor).
>
> **XML (eXtensible Markup Language):**
> * **Definição:** É uma linguagem de **marcação** projetada como um formato de dados para **armazenar e transportar** informações de forma legível tanto para humanos quanto para máquinas.
> * **Características:** Diferente do HTML, o XML não possui tags pré-definidas; o autor do documento define suas próprias tags para descrever a estrutura dos dados. Um documento XML deve ser **bem-formado** (seguir regras de sintaxe, como fechar todas as tags abertas) e pode ser **válido** (se estiver em conformidade com um esquema, como um DTD ou XSD).

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **AJAX é uma Linguagem?:** A banca frequentemente classifica AJAX como uma linguagem de programação. **ERRADO**. AJAX é uma **técnica** ou uma abordagem que combina várias tecnologias.
> > * **O "X" em AJAX:** Embora a sigla signifique "Asynchronous JavaScript and **XML**", o formato de dados mais utilizado com AJAX atualmente é o **JSON (JavaScript Object Notation)**, por ser mais leve e mais fácil de manipular em JavaScript. Afirmar que AJAX requer o uso de XML está **ERRADO**.
> > * **XML vs. HTML:** O ponto central da distinção é o **propósito**. **HTML** é para **apresentar** dados ao usuário (semântica de apresentação). **XML** é para **descrever e transportar** dados de forma estruturada.
> > * **Comunicação Assíncrona:** A principal vantagem do AJAX é ser **assíncrono**, o que significa que o navegador não trava e o usuário pode continuar interagindo com a página enquanto os dados são buscados do servidor em segundo plano.

---

### **Classe:** B
### **Conteúdo:** Web Services

---

### **5. Web Services**

> #### **TEORIA-ALVO**
> Web Services são mecanismos de comunicação que permitem a interoperabilidade entre diferentes aplicações através da rede, utilizando padrões web. Eles permitem que sistemas heterogêneos (escritos em linguagens diferentes, rodando em plataformas distintas) troquem informações.
>
> * **SOAP (Simple Object Access Protocol):**
>     * É um **protocolo** com um conjunto de regras rígidas e padronizadas pelo W3C.
>     * Utiliza **XML** como formato de mensagem, com uma estrutura específica (Envelope SOAP).
>     * Utiliza **WSDL (Web Services Description Language)** para descrever formalmente a interface do serviço (operações, tipos de dados, etc.).
>     * É independente do protocolo de transporte, mas comumente utiliza HTTP.
> * **REST (Representational State Transfer):**
>     * É um **estilo arquitetural**, não um protocolo, baseado em um conjunto de princípios e restrições para a criação de sistemas distribuídos.
>     * Utiliza os verbos do protocolo HTTP (`GET`, `POST`, `PUT`, `DELETE`) para manipular **recursos**, que são identificados por URIs.
>     * É *stateless* (sem estado): cada requisição do cliente deve conter toda a informação necessária para ser entendida pelo servidor.
>     * O formato de dados é flexível, sendo **JSON** o mais utilizado.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **SOAP vs. REST:** A comparação entre os dois é o tópico mais frequente. **SOAP** é um protocolo estrito, baseado em XML e com descrição formal (WSDL). **REST** é um estilo arquitetural flexível, baseado nos princípios do HTTP e comumente utilizando JSON.
> > * **Stateless (Sem Estado):** O princípio de que o servidor não armazena o estado da sessão do cliente é uma restrição fundamental da arquitetura REST e frequentemente cobrado.
> > * **WSDL:** A banca associará o uso de WSDL para descrição de serviços ao REST. **ERRADO**. WSDL é a linguagem de descrição padrão do mundo **SOAP**. Para REST, a descrição é opcional e comumente feita com a especificação OpenAPI (antigo Swagger).

---

### **Classe:** C
### **Conteúdo:** DHTML

---

### **6. DHTML (Dynamic HTML)**

> #### **TEORIA-ALVO**
> DHTML não é uma linguagem ou tecnologia distinta, mas sim um **termo guarda-chuva** (ou jargão de marketing) popularizado no final dos anos 1990 para descrever a prática de criar páginas web interativas e dinâmicas no lado do cliente.
>
> * **Componentes:** O DHTML é, na prática, a utilização combinada das seguintes tecnologias:
>     1.  **HTML:** Para a estrutura do conteúdo.
>     2.  **CSS:** Para o estilo e o posicionamento dos elementos.
>     3.  **JavaScript:** Como a linguagem de script para manipular o DOM, responder a eventos e alterar dinamicamente tanto o conteúdo (HTML) quanto o estilo (CSS) da página após ela ter sido carregada.
> * **Objetivo:** Criar experiências de usuário mais ricas, com animações, menus interativos e atualizações de conteúdo sem a necessidade de recarregar a página (um precursor conceitual do AJAX).

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **DHTML como uma Tecnologia Separada:** A principal pegadinha é apresentar o DHTML como uma linguagem ou um padrão formal, distinto do HTML ou do JavaScript. **ERRADO**. DHTML é simplesmente o **efeito** obtido pela combinação sinérgica de HTML, CSS e JavaScript.
> > * **Relevância Atual:** O termo DHTML é considerado **obsoleto** no jargão técnico moderno. As técnicas que ele descrevia são hoje parte integrante e padrão do desenvolvimento front-end, e o termo foi largamente suplantado por conceitos mais específicos como "Desenvolvimento Front-End Moderno", "Aplicações de Página Única (SPA)" e o uso de frameworks JavaScript. A banca pode cobrar o DHTML para testar o conhecimento histórico da evolução da web.
