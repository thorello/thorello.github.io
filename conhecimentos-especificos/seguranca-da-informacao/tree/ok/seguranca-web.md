# Classe: A
# Conteúdo: Segurança Web: Fundamentos e OWASP

## 1. Fundamentos de Segurança Web e OWASP

> **TEORIA-ALVO**
>
> **Segurança de Aplicações Web** é a disciplina da segurança da informação focada em proteger websites, aplicações web e APIs contra ataques cibernéticos. O objetivo é garantir os princípios fundamentais da segurança da informação no contexto das aplicações.
>
> * **Princípios Fundamentais Aplicados à Web:**
>     * **Confidencialidade:** Proteção de dados sensíveis (e.g., dados de usuários, informações de cartão de crédito) contra acesso não autorizado.
>     * **Integridade:** Garantia de que os dados e a lógica da aplicação não sejam modificados de forma indevida por atacantes.
>     * **Disponibilidade:** Assegurar que a aplicação e seus serviços estejam operacionais e acessíveis para usuários legítimos.
>     * **Autenticidade:** Provar a identidade de usuários e do próprio servidor.
> * **OWASP (Open Web Application Security Project):**
>     * **Definição:** Uma fundação sem fins lucrativos e uma comunidade global que trabalha para melhorar a segurança de software. A OWASP produz documentação, ferramentas, vídeos e fóruns de forma gratuita e aberta.
>     * **OWASP Top 10:** O projeto mais conhecido da OWASP. Trata-se de um documento de conscientização, atualizado periodicamente, que elenca os 10 riscos de segurança mais críticos para aplicações web. Seu propósito é educar desenvolvedores, arquitetos, gestores e profissionais de segurança sobre as ameaças mais prevalentes e fornecer orientações para mitigá-las. A lista é compilada a partir de dados de diversas organizações e especialistas em segurança.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **OWASP Top 10 como Norma:** A banca pode afirmar que o OWASP Top 10 é um padrão de conformidade obrigatório ou uma certificação. **ERRADO**. O OWASP Top 10 é um **documento de conscientização** e uma lista de riscos, servindo como um guia de boas práticas, mas não é uma norma mandatória como a ISO/IEC 27001 ou o PCI DSS.
> > * **Natureza da Lista:** É incorreto tratar a lista como exaustiva ou estática. Ela representa os riscos mais **críticos e comuns** em um determinado período e é atualizada para refletir a evolução das ameaças e tecnologias.
> > * **Princípios em Ação:** A banca frequentemente descreve um ataque e pergunta qual princípio da segurança da informação foi violado. Exemplo: um ataque de SQL Injection que expõe dados de clientes viola a **confidencialidade**. Se o mesmo ataque altera dados, viola a **integridade**. Um ataque de negação de serviço viola a **disponibilidade**.

---
# Classe: A
# Conteúdo: Análise de Vulnerabilidades (Riscos Críticos OWASP)

## 2. Análise de Vulnerabilidades (Riscos Críticos OWASP)

> **TEORIA-ALVO**
>
> A análise de vulnerabilidades em aplicações web frequentemente se baseia nos riscos identificados pelo OWASP Top 10. Os conceitos a seguir são perenes, ainda que a numeração e o agrupamento se alterem entre as edições da lista.
>
> * **Injeção (Injection):**
>     * **Descrição:** Ocorre quando dados não confiáveis são enviados a um interpretador como parte de um comando. O tipo mais prevalente é a **Injeção de SQL (SQLi)**, onde a entrada do usuário manipula consultas a um banco de dados.
>     * **Impacto:** Exposição, alteração ou exclusão de dados; negação de serviço; execução remota de comandos.
> * **Quebra de Autenticação (*Broken Authentication*):**
>     * **Descrição:** Falhas na implementação das funções de login e gerenciamento de sessão, como permitir senhas fracas, não proteger contra ataques de força bruta, ou gerenciamento inseguro de tokens de sessão.
>     * **Impacto:** Roubo de contas, sequestro de sessão, escalada de privilégios.
> * **Cross-Site Scripting (XSS):**
>     * **Descrição:** Uma falha de injeção no lado do cliente, na qual um atacante injeta scripts maliciosos (geralmente JavaScript) em uma página, que são então executados no navegador de uma vítima.
>     * **Impacto:** Roubo de cookies de sessão, redirecionamento para sites maliciosos, modificação do conteúdo da página.
> * **Quebra de Controle de Acesso (*Broken Access Control*):**
>     * **Descrição:** Falha em garantir que usuários autenticados possam acessar apenas os dados e funcionalidades para os quais estão explicitamente autorizados. Um exemplo clássico é a **Referência Insegura e Direta a Objeto (IDOR)**, onde um atacante manipula um parâmetro (e.g., um ID na URL) para acessar dados de outro usuário.
>     * **Impacto:** Visualização ou modificação não autorizada de dados, acesso a funcionalidades restritas.
> * **Falsificação de Requisição Entre Sites (CSRF - *Cross-Site Request Forgery*):**
>     * **Descrição:** Um ataque que força o navegador de um usuário autenticado a enviar uma requisição HTTP forjada e indesejada para uma aplicação na qual o usuário está logado. A aplicação executa a ação por confiar na requisição vinda do navegador da vítima.
>     * **Impacto:** Realização de ações não autorizadas em nome da vítima, como alterar sua senha ou e-mail, realizar compras ou transferir fundos.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Identificação da Vulnerabilidade:** O formato mais comum de questão é a descrição de um cenário de ataque, solicitando que o candidato identifique a vulnerabilidade correspondente (e.g., SQL Injection, XSS, CSRF).
> > * **XSS vs. CSRF:** A confusão entre estes dois é um clássico. **XSS** explora a confiança do usuário no site para **executar um script** em seu navegador. **CSRF** explora a confiança do site no navegador do usuário para **forçar o envio de uma requisição**.
> > * **IDOR (Referência Insegura a Objeto):** A causa raiz do IDOR не é a exposição de um ID, mas a **ausência de uma verificação de autorização** no servidor. A aplicação falha em verificar se o usuário logado tem permissão para acessar o objeto correspondente àquele ID.

---
# Classe: A
# Conteúdo: Técnicas de Proteção

## 3. Técnicas de Proteção e Mitigação

> **TEORIA-ALVO**
>
> A proteção de aplicações web requer uma abordagem de defesa em profundidade (*defense-in-depth*), combinando múltiplas camadas de controles de segurança ao longo do ciclo de vida de desenvolvimento de software (SDLC).
>
> * **Validação de Entrada (*Input Validation*):**
>     * **Descrição:** Processo de verificar e filtrar todos os dados provenientes de fontes não confiáveis antes de serem processados pela aplicação.
>     * **Abordagem Recomendada:** **Lista Branca (*Whitelisting*)**, que consiste em permitir apenas um conjunto de caracteres, formatos ou valores conhecidos e seguros, rejeitando todo o resto. É superior à **Lista Negra (*Blacklisting*)**, que tenta proibir entradas maliciosas conhecidas e é facilmente contornável.
> * **Codificação de Saída (*Output Encoding*):**
>     * **Descrição:** Técnica de codificar dados antes de serem inseridos dinamicamente em uma página de saída, para garantir que sejam tratados como texto pelo navegador, e não como código executável.
>     * **Aplicação:** É a principal defesa contra **Cross-Site Scripting (XSS)**. A codificação deve ser sensível ao contexto (e.g., codificação para HTML, para atributos HTML, para JavaScript).
> * **Queries Parametrizadas (*Parameterized Queries*):**
>     * **Descrição:** Também conhecidas como *Prepared Statements*, são uma forma de construir consultas a banco de dados onde a instrução SQL é enviada separadamente dos parâmetros (dados).
>     * **Aplicação:** É a principal e mais eficaz defesa contra **SQL Injection**, pois garante a separação entre código e dados.
> * **Controles Adicionais:**
>     * **Tokens Anti-CSRF:** Mecanismo para mitigar ataques de CSRF, onde um token único e imprevisível é embutido em formulários e validado pelo servidor a cada requisição que modifica o estado.
>     * **Cabeçalhos de Segurança HTTP:** Diretivas enviadas pelo servidor que instruem o navegador a adotar comportamentos mais seguros. Exemplos:
>         * **`Content-Security-Policy` (CSP):** Controla as fontes de onde os recursos (scripts, imagens) podem ser carregados, mitigando XSS.
>         * **`HTTP Strict-Transport-Security` (HSTS):** Força o navegador a se comunicar com o servidor exclusivamente via HTTPS.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Mapeamento Defesa-Ataque:** A banca vai testar o conhecimento sobre qual técnica de proteção é a principal mitigação para uma determinada vulnerabilidade. É mandatório associar:
> >     * **Queries Parametrizadas -> SQL Injection**
> >     * **Codificação de Saída -> XSS**
> >     * **Tokens Anti-CSRF -> CSRF**
> > * **Whitelisting vs. Blacklisting:** A banca pode apresentar o *blacklisting* como uma técnica robusta. **ERRADO**. A abordagem de *whitelisting* (permitir apenas o que é conhecido como bom) é inerentemente mais segura e a prática recomendada.
> > * **Defesa no Cliente vs. no Servidor:** Controles de segurança implementados apenas no lado do cliente (e.g., validação de formulário via JavaScript) são facilmente contornáveis por um atacante e não são suficientes. A validação e os controles de segurança **devem sempre ser reimplementados e garantidos no lado do servidor**.