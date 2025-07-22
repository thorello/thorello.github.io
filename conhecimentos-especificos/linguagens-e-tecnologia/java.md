### Olá, futuro(a) aprovado(a)! Vamos construir seu conhecimento sobre o ecossistema Java EE para você não travar na prova do Cebraspe.

Pense no desenvolvimento de uma aplicação web corporativa como a **construção e operação de um shopping center gigante** 🛍️. A plataforma Java EE (agora Jakarta EE) é a planta, as normas técnicas e os serviços que o shopping oferece para que as lojas possam funcionar.

---

### ### JEE e Servidores de Aplicação: A Estrutura do Shopping

* **Java SE vs. Java EE:**
    * **Java SE (Standard Edition):** É o **kit básico de construção**, com tijolos, cimento e ferramentas (a linguagem Java, suas bibliotecas principais).
    * **Java EE (Enterprise Edition):** É a **planta completa do shopping**, com todas as especificações para construir lojas, praça de alimentação, cinema, e com serviços centralizados como segurança e ar-condicionado. É um **superconjunto** que usa o Java SE como base.

* **Servidor de Aplicação vs. Servlet Container:** Essa é a pegadinha clássica!
    * **Servlet Container (A Galeria de Lojas 🏬):** É um "mini-shopping" que só tem o básico para as lojas da fachada funcionarem (sites). Ele sabe como receber clientes (requisições HTTP) e mostrar as vitrines (JSPs). Ex: **Apache Tomcat**.
    * **Servidor de Aplicação (O Shopping Completo 🛍️):** É o shopping center completo. Além das lojas da fachada, ele tem o "back-office" com o setor financeiro (transações), a logística (mensageria) e as regras de negócio complexas (EJBs). Ex: **WildFly (JBoss)**.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * A banca vai afirmar que o **Apache Tomcat** é um servidor de aplicação JEE completo. **ERRADO!** O Tomcat é um **Servlet Container** (uma galeria), ele não tem suporte a EJBs (o back-office complexo).
> > * **JEE é um superconjunto do Java SE**, ele não o substitui.

---

### ### Servlets e JSP: A Loja e a Vitrine

São as tecnologias para construir a "frente de loja" no mundo Java.

* **Servlet (O Vendedor / Gerente da Loja 👨‍💼):**
    É a **lógica** por trás do balcão. Ele recebe o pedido do cliente (requisição HTTP), processa, busca o produto no estoque e prepara a resposta. É puro código Java.
    * **Ciclo de Vida:** O gerente (`init`) é contratado uma vez. A cada cliente que chega (`service`), ele atende. No fim do dia, ele fecha a loja (`destroy`).

* **JSP (A Vitrine Decorada ✨):**
    É a **vitrine** da loja. É um arquivo HTML com "espaços mágicos" onde o vendedor pode colocar os produtos dinamicamente.
    * **Como funciona?** Na primeira vez que um cliente olha para a vitrine, o JSP é **compilado** e transformado em um Servlet (vendedor) super rápido nos bastidores. Ele não é interpretado a cada visita.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * **JSP não é interpretado.** A banca vai dizer que ele é lento porque é interpretado a cada requisição. **ERRADO!** Ele é **compilado** em um Servlet.
> > * **Separação de Papéis:** **Servlet = Lógica (Controller)**. **JSP = Apresentação (View)**. Misturar muita lógica de negócio na vitrine (JSP) é uma péssima prática.

---

### ### Framework Spring: A Franquia de Lojas de Sucesso

O Spring é como um **modelo de franquia de sucesso (tipo McDonald's)** que te ajuda a montar sua loja de forma muito mais rápida e eficiente.

* **Injeção de Dependência (DI):** **O conceito mais importante!** É a "mágica" da franquia. Em vez de você, dono da loja, ter que construir seu próprio forno, a franqueadora (o Contêiner Spring) **injeta** um forno padrão e já configurado na sua cozinha. Isso gera um **baixo acoplamento** (sua cozinha não depende de uma marca específica de forno).

* **Spring MVC:** O modelo de franquia para as lojas da fachada, com um gerente geral na porta (`DispatcherServlet`) que direciona os clientes para os vendedores certos.
* **Spring Boot:** É a **franquia "loja em uma caixa"**. Ele te entrega a loja quase pronta, com tudo pré-configurado. Você só precisa se preocupar em fazer o seu sanduíche (a sua regra de negócio). Favorece **convenção sobre configuração**.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * A principal vantagem da **Injeção de Dependência** é o **baixo acoplamento**, o que torna o sistema mais fácil de testar e manter.
> > * **Spring não é parte da especificação JEE.** Ele é um framework concorrente/alternativo que se tornou o padrão de mercado.

---

### ### Web Services (SOAP e REST): O Delivery do Shopping

São as duas formas de o "restaurante" (um serviço) conversar com o "aplicativo de delivery" (outro serviço).

| Característica | SOAP (O Pedido Formal 📜) | REST (O Pedido Informal 📱) |
| :--- | :--- | :--- |
| **Tipo** | **Protocolo** (regras rígidas) | **Estilo Arquitetural** (um guia de boas práticas) |
| **Formato** | Apenas **XML** (um documento formal) | Flexível (geralmente **JSON**, um bilhete rápido) |
| **Estado** | Pode ser complexo | **Stateless** (cada pedido é independente) |
| **Manual** | **WSDL** (um manual de instruções detalhado) | OpenAPI (Swagger) (opcional, um cardápio) |

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * A banca vai trocar tudo! **SOAP = Protocolo, XML, WSDL**. **REST = Estilo, JSON, Stateless**.
> > * **Stateless** é a chave do REST: o restaurante não precisa se lembrar do seu pedido anterior para entender o seu pedido atual.

---

### ### Acesso a Dados: O Estoque do Shopping

Como as lojas acessam o grande estoque central (o banco de dados).

* **JDBC (O Carregador de Caixas 📦):** É a ferramenta de baixo nível. Você precisa dar ordens detalhadas: "Vá ao corredor 5, prateleira 3, pegue a caixa azul...".
    * **`Statement` vs. `PreparedStatement`:** `Statement` é como gritar a ordem no meio do estoque, vulnerável a "injeção de SQL" (alguém mal-intencionado gritar uma ordem falsa junto). `PreparedStatement` é como entregar um formulário pré-formatado, muito mais seguro.

* **JPA e Hibernate (O Gerente de Estoque Inteligente 🧠):**
    * **JPA:** A **especificação**, as regras para ser um bom gerente de estoque.
    * **Hibernate:** A **implementação**, o gerente de estoque mais famoso que segue as regras da JPA.
    * Em vez de pedir "a caixa azul", você pede ao gerente: "Me traga o objeto 'Tênis Nike nº 42'". O gerente (Hibernate/ORM) se vira para encontrar a caixa certa no estoque.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * Use sempre **`PreparedStatement`** para evitar **SQL Injection**. A banca vai dizer que `Statement` é seguro. **ERRADO!**
> > * **JPA é a regra, Hibernate é o jogador.** Hibernate implementa a especificação JPA.

---

### ### Build e Ferramentas: A Construção do Shopping

* **Maven (O Mestre de Obras Moderno):** Uma ferramenta que gerencia a construção do shopping. Ele segue a filosofia de **convenção sobre configuração** (já sabe onde ficam a fundação, as paredes, etc.) e o mais importante: ele gerencia a **lista de materiais (`pom.xml`)** e vai buscar os tijolos e o cimento (as dependências) automaticamente no fornecedor.
* **Ant (O Mestre de Obras Antigo):** Você precisa escrever um roteiro (`build.xml`) detalhando cada passo da construção, e você mesmo tem que ir comprar os materiais.
* **JUnit:** O **inspetor de qualidade** que executa testes automatizados para garantir que cada tijolo está perfeito.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * **Maven vs. Ant:** A grande diferença é o **gerenciamento automático de dependências** do Maven.

### ### Mapa Mental: A Arquitetura Clássica de uma Aplicação Web Java

```mermaid
%%{init: {"theme": "tokyo-midnight", "themeVariables": { "fontFamily": "lexend"}}}%%
graph TD
    A["🌐<br>Navegador do Cliente"]
    
    subgraph "Servidor de Aplicação / Servlet Container"
        B["<b>Camada Web</b><br>🛍️ JSP (Vitrine)<br>👨‍💼 Servlet (Vendedor)<br>🛂 Spring MVC (Gerente)"]
        C["<b>Camada de Negócio</b><br>🧠 Lógica de Negócio<br>(Spring Beans, EJBs)"]
        D["<b>Camada de Dados (Persistência)</b><br>📦 DAO (Padrão)<br>🧠 Hibernate (Gerente de Estoque)<br>🚚 JDBC (Carregador)"]
    end
    
    E["🗃️<br>Banco de Dados"]

    A -- Requisição HTTP --> B
    B -- Chama a Lógica --> C
    C -- Pede os Dados --> D
    D -- Acessa o Estoque --> E
````


### **Classe:** B
### **Conteúdo:** Programação JEE e Servidores de Aplicação

---

### **1. Programação JEE e Servidores de Aplicação**

> #### **TEORIA-ALVO**
> Java Platform, Enterprise Edition (Java EE), atualmente Jakarta EE, é um conjunto de especificações que estende o Java SE (Standard Edition) com APIs para o desenvolvimento de aplicações corporativas robustas, escaláveis e multicamadas.
>
> * **Arquitetura JEE:** Baseada em componentes distribuídos em contêineres. Um contêiner JEE provê serviços padronizados ao componente, como ciclo de vida, segurança, transações e injeção de dependência.
>     * **Web Container:** Responsável por gerenciar a execução de componentes da camada web, como Servlets e JSPs.
>     * **EJB Container:** Responsável por gerenciar a execução de componentes da camada de negócio, os Enterprise JavaBeans (EJBs).
> * **Servidor de Aplicação (Application Server):** É uma implementação completa da especificação JEE, fornecendo tanto o Web Container quanto o EJB Container, além de outros serviços como JMS (Java Message Service) e JTA (Java Transaction API).
>     * Exemplos: WildFly (JBoss), GlassFish, OpenLiberty, WebSphere.
> * **Servidor Web / Servlet Container:** Implementa apenas uma parte da especificação JEE, notadamente as APIs de Servlet e JSP. Não oferece suporte nativo a EJBs ou JMS.
>     * Exemplos: Apache Tomcat, Jetty.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **JEE vs. Java SE:** A banca pode afirmar que JEE é um substituto para o Java SE. **ERRADO**. JEE é um **superconjunto** de especificações que **depende** do Java SE como base.
> > * **Servidor de Aplicação vs. Servlet Container:** Esta é a distinção mais crítica. A banca afirmará que o Apache Tomcat é um servidor de aplicação JEE completo. **ERRADO**. Tomcat é um **Servlet Container**, ele não implementa as especificações de EJB ou JMS, sendo, portanto, um container web, e não um servidor de aplicação full-profile.
> > * **Jakarta EE:** A banca pode usar a nomenclatura antiga (Java EE) ou a nova (Jakarta EE), após a transferência do projeto para a Eclipse Foundation. É preciso reconhecer ambos os termos como equivalentes em essência.

---

### **Classe:** B
### **Conteúdo:** JSP/Servlets

---

### **2. Servlets e JavaServer Pages (JSP)**

> #### **TEORIA-ALVO**
> Servlets e JSPs são os pilares da camada de apresentação (web tier) da especificação JEE, responsáveis por receber requisições HTTP e gerar respostas dinâmicas.
>
> * **Servlet:** É uma classe Java que estende `javax.servlet.http.HttpServlet` e é capaz de processar requisições HTTP. É a tecnologia central para a lógica de controle da camada web.
>     * **Ciclo de Vida:** Gerenciado pelo Web Container.
>         1.  **`init()`:** Chamado uma única vez quando o servlet é carregado pela primeira vez.
>         2.  **`service()`:** Chamado para cada requisição HTTP. Este método delega para `doGet()`, `doPost()`, etc., com base no método HTTP da requisição.
>         3.  **`destroy()`:** Chamado uma única vez quando o servlet é descarregado.
> * **JavaServer Pages (JSP):** É uma tecnologia que permite misturar HTML/XML com código Java (ou tags especiais) para facilitar a criação de conteúdo web dinâmico. JSPs são focados na camada de visão (View).
>     * **Tradução e Compilação:** Na primeira requisição, um JSP é traduzido para um arquivo de código-fonte de um Servlet e, em seguida, compilado e carregado pelo container.
>     * **Elementos:** Incluem *scriptlets* (`<% ... %>`), expressões (`<%= ... %>`), EL (Expression Language - `${...}`) e a JSTL (JSP Standard Tag Library) para evitar código Java bruto nas páginas.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **JSP é Interpretado?:** Uma pegadinha comum é afirmar que JSPs são arquivos de script interpretados a cada requisição. **ERRADO**. JSPs são **compilados** em Servlets Java, o que garante melhor desempenho.
> > * **Papel de cada Tecnologia:** A banca pode inverter os papéis. **Servlets** são ideais para a lógica de controle (Controller). **JSPs** são ideais para a apresentação (View). Colocar lógica de negócio complexa em um JSP é uma má prática.
> > * **Ciclo de Vida do Servlet:** A distinção entre `init()` (chamado uma vez) e `service()` (chamado a cada requisição) é fundamental e frequentemente testada.
> > * **JSTL e EL vs. Scriptlets:** A Expression Language (`${...}`) e a JSTL (e.g., `<c:if>`, `<c:forEach>`) são as formas modernas e recomendadas de se trabalhar com lógica em JSPs, em detrimento dos *scriptlets* (`<% ... %>`), que são considerados uma má prática por misturar excessivamente código Java e marcação.

---

### **Classe:** B
### **Conteúdo:** Framework Spring

---

### **3. Framework Spring**

> #### **TEORIA-ALVO**
> O Spring é o framework de aplicação mais proeminente no ecossistema Java, fornecendo uma infraestrutura abrangente para o desenvolvimento de aplicações corporativas.
>
> * **Core Container e Injeção de Dependência (DI):** O princípio fundamental do Spring é a **Inversão de Controle (IoC)**, implementada através da **Injeção de Dependência (DI)**. Em vez de um objeto criar suas próprias dependências, o contêiner Spring as "injeta" no objeto, promovendo baixo acoplamento.
> * **Spring MVC:** Um módulo para a construção de aplicações web, baseado no padrão *Model-View-Controller*. Seu componente central é o `DispatcherServlet`, que atua como um *Front Controller*, recebendo todas as requisições e as despachando para os controladores apropriados.
> * **Spring Boot:** Um projeto do ecossistema Spring que visa simplificar drasticamente o processo de configuração e publicação de novas aplicações Spring. Ele favorece **convenção sobre configuração**, oferece autoconfiguração e servidores web embarcados (como Tomcat ou Jetty).
> * **Outros Módulos:** O ecossistema inclui Spring Data (para acesso a dados), Spring Security (para autenticação e autorização), Spring AOP (para programação orientada a aspectos), entre outros.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Inversão de Controle (IoC) / Injeção de Dependência (DI):** Este é o conceito mais importante. A banca pode pedir para definir ou identificar o padrão. DI é o padrão de projeto que implementa o princípio da IoC. A principal vantagem é o **baixo acoplamento** entre os componentes.
> > * **Spring vs. JEE:** Historicamente, o Spring surgiu como uma alternativa mais leve e flexível ao EJB 2.x. Atualmente, Spring e Jakarta EE podem ser vistos como concorrentes ou complementares. É incorreto afirmar que Spring é parte da especificação JEE. **ERRADO**. Spring é um framework de terceiros.
> > * **Spring Boot e a Autoconfiguração:** O principal diferencial do Spring Boot é sua capacidade de autoconfigurar a aplicação com base nas dependências presentes no classpath. A banca pode afirmar que o Spring Boot elimina a necessidade de qualquer configuração. **INCORRETO**. Ele elimina a configuração repetitiva (*boilerplate*), mas configurações específicas ainda são necessárias e podem ser feitas.

---

### **Classe:** B
### **Conteúdo:** Web Services (SOAP e REST)

---

### **4. Web Services (SOAP e REST)**

> #### **TEORIA-ALVO**
> Web services são sistemas de software projetados para suportar a interação interoperável máquina-a-máquina sobre uma rede. Os dois principais modelos são SOAP e REST.
>
> * **SOAP (Simple Object Access Protocol):**
>     * É um **protocolo** padronizado pelo W3C, com uma especificação rígida.
>     * Baseia-se em **XML** para a formatação das mensagens, que são estruturadas em um envelope SOAP (Envelope, Header, Body, Fault).
>     * Utiliza **WSDL (Web Services Description Language)** para descrever a interface do serviço.
>     * Pode operar sobre diversos protocolos de transporte, embora o HTTP seja o mais comum.
>     * APIs Java relacionadas: JAX-WS.
> * **REST (Representational State Transfer):**
>     * É um **estilo arquitetural**, não um protocolo.
>     * Baseia-se em um conjunto de princípios e restrições, como cliente-servidor, **stateless** (sem estado), cacheável e interface uniforme.
>     * Utiliza os métodos padrão do protocolo HTTP (`GET`, `POST`, `PUT`, `DELETE`) para manipular **recursos**, que são identificados por URIs.
>     * O formato dos dados é flexível, sendo **JSON (JavaScript Object Notation)** o mais comum.
>     * APIs Java relacionadas: JAX-RS.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **SOAP vs. REST:** Esta é a principal fonte de questões. A banca vai trocar as características.
> >     * **Protocolo vs. Estilo:** SOAP é um protocolo; REST é um estilo arquitetural.
> >     * **Estado:** REST é, por princípio, *stateless* (cada requisição contém toda a informação necessária). SOAP pode ser stateful com o uso de extensões (WS-\*).
> >     * **Formato de Dados:** SOAP é estritamente XML. REST é flexível (JSON é o mais comum).
> >     * **Descrição:** SOAP usa WSDL. REST pode usar especificações como OpenAPI (Swagger) para descrição, mas não é mandatório.
> > * **Stateless (Sem Estado):** O princípio de que o servidor não armazena nenhum estado do cliente entre as requisições é um pilar do REST e frequentemente cobrado.

---

### **Classe:** B
### **Conteúdo:** JDBC, Padrões JEE e Tecnologias de Persistência

---

### **5. Acesso a Dados (JDBC, Hibernate) e Padrões**

> #### **TEORIA-ALVO**
> A persistência de dados em Java é realizada por meio de um conjunto de APIs e padrões.
>
> * **JDBC (Java Database Connectivity):** É a API de baixo nível para interação com bancos de dados relacionais.
>     * **Componentes:** `Driver` (implementação específica do banco), `Connection` (sessão com o banco), `Statement` (executa uma instrução SQL), `PreparedStatement` (versão pré-compilada e mais segura), `ResultSet` (representa o resultado de uma consulta).
> * **JPA e Hibernate:**
>     * **JPA (Java Persistence API), agora Jakarta Persistence:** É uma **especificação** JEE que define um padrão para Mapeamento Objeto-Relacional (ORM).
>     * **Hibernate:** É a **implementação** mais popular e de fato da especificação JPA. O ORM abstrai o acesso ao banco de dados, permitindo ao desenvolvedor manipular objetos Java que são automaticamente persistidos em tabelas relacionais.
> * **Padrão DAO (Data Access Object):** Um padrão de projeto que encapsula toda a lógica de acesso a dados, isolando a lógica de negócio dos detalhes de persistência. Uma classe DAO oferece métodos como `salvar()`, `buscarPorId()`, `listarTodos()`, etc.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **`Statement` vs. `PreparedStatement`:** A diferença mais crítica, e alvo certo de questões, é a segurança. `PreparedStatement` previne **SQL Injection**, enquanto `Statement` é vulnerável a este tipo de ataque.
> > * **JPA vs. Hibernate:** JPA é a **especificação** (as regras, as interfaces). Hibernate é a **implementação** (o código que faz o trabalho). A banca pode afirmar que são tecnologias concorrentes. **ERRADO**. Hibernate implementa a JPA.
> > * **ORM vs. JDBC:** Um ORM como o Hibernate utiliza JDBC por baixo dos panos para se comunicar com o banco de dados. ORM é uma camada de abstração sobre o JDBC.

---

### **Classe:** B/C
### **Conteúdo:** Build, Teste e Ferramentas

---

### **6. Build, Teste e Ferramentas (Maven, Ant, JUnit, Eclipse)**

> #### **TEORIA-ALVO**
> O ecossistema Java é suportado por um vasto conjunto de ferramentas para automação de build, testes e desenvolvimento.
>
> * **Ferramentas de Build:**
>     * **Maven:** Ferramenta de automação de build e gerenciamento de dependências. É declarativo e baseado em **convenção sobre configuração**. O arquivo central é o `pom.xml`, que descreve o projeto, suas dependências e os plugins a serem usados. Gerencia o download de dependências transitivas.
>     * **Ant:** Ferramenta de build mais antiga. É procedural e baseada em XML (`build.xml`). Não possui gerenciamento de dependências nativo (requer o uso de uma ferramenta adicional como o Ivy).
> * **Testes de Unidade:**
>     * **JUnit:** O framework padrão para testes de unidade em Java. Permite a criação de casos de teste automatizados através de anotações (`@Test`, `@BeforeEach`, `@AfterEach`) e métodos de asserção (`assertEquals`, `assertTrue`, etc.).
> * **IDEs (Ambientes de Desenvolvimento Integrado):**
>     * **Eclipse:** Um IDE popular e de código aberto, conhecido por sua arquitetura extensível baseada em plugins.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Maven vs. Ant:** A principal diferença é o **gerenciamento de dependências** e a abordagem. **Maven** é declarativo (diz "o que" fazer) e gerencia dependências automaticamente. **Ant** é procedural (diz "como" fazer) e não tem gerenciamento de dependências nativo.
> > * **JUnit: Ciclo de Vida do Teste:** A ordem de execução das anotações é frequentemente cobrada. `@BeforeAll` e `@AfterAll` rodam uma vez por classe. `@BeforeEach` e `@AfterEach` rodam antes e depois de **cada** método de teste (`@Test`).
> > * **Convenção sobre Configuração:** Este é um princípio chave do Maven (e do Spring Boot). Significa que a ferramenta assume padrões (e.g., código-fonte está em `src/main/java`), reduzindo a necessidade de configuração explícita.

---

### **Classe:** C
### **Conteúdo:** Tecnologias Legadas ou Específicas (EJB, Struts2, JNDI)

---

### **7. Tecnologias Legadas ou Específicas**

> #### **TEORIA-ALVO**
> Diversas tecnologias, embora menos prevalentes em novos projetos, são importantes do ponto de vista histórico ou para a manutenção de sistemas legados.
>
> * **EJB (Enterprise JavaBeans):** Um modelo de componentes gerenciados para a camada de negócio. As versões modernas (EJB3+) são baseadas em POJOs e anotações, simplificando o desenvolvimento.
>     * **Tipos:** *Session Beans* (Stateless, Stateful, Singleton) para lógica de negócio; *Message-Driven Beans* (MDBs) para processamento assíncrono.
> * **Struts2:** Um framework MVC (Model-View-Controller) para aplicações web, sucessor do Struts 1. Foi muito popular, mas hoje é amplamente substituído por frameworks como o Spring MVC.
> * **JavaBeans:** Classes Java que seguem convenções simples (construtor padrão, getters/setters, `Serializable`). São usados como DTOs (Data Transfer Objects) ou para representar o modelo em frameworks MVC.
> * **JNDI (Java Naming and Directory Interface):** Uma API padrão para acessar serviços de nomes e diretórios. Em JEE, é usada para obter referências a recursos gerenciados, como um `DataSource` para conexão com o banco ou um EJB remoto, de forma desacoplada do código.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **EJB vs. JavaBeans:** São conceitos distintos. **JavaBeans** são componentes simples, não gerenciados. **EJBs** são componentes de negócio gerenciados por um container, com serviços como transação e segurança.
> > * **JNDI como Recurso:** JNDI não é o recurso em si, mas a **API para localizar** o recurso. É um serviço de "lista telefônica" para os componentes da aplicação.
> > * **Relevância Atual:** A banca pode cobrar essas tecnologias para avaliar o conhecimento da evolução da plataforma Java. É importante reconhecer Struts e EJB 2.x como tecnologias mais antigas e entender por que alternativas como Spring e EJB 3.x se tornaram populares (simplificação, menor acoplamento, facilidade de teste).
