# Classe: A
# Conteúdo: Ameaças a Aplicações: Injection (Injeção)

## 1. Injection (Injeção)

> **TEORIA-ALVO**
>
> A falha de Injeção ocorre quando dados não confiáveis, provenientes de uma fonte externa (geralmente a entrada do usuário), são enviados a um interpretador como parte de um comando ou consulta. O interpretador executa o comando com os dados maliciosos, tratando-os como parte da instrução, o que leva a um comportamento não intencional.
>
> * **SQL Injection:** É o tipo mais comum de injeção. Ocorre quando a entrada do usuário é concatenada diretamente em uma consulta SQL. Um atacante pode inserir metacaracteres SQL (e.g., `'`, `;`, `--`) para manipular a consulta original.
>     * **Exemplo de Código Vulnerável:**
>       `consulta = "SELECT * FROM usuarios WHERE nome = '" + nome_usuario + "';" `
>     * **Exemplo de Ataque:** Se o atacante inserir ` ' OR '1'='1 ` no campo `nome_usuario`, a consulta resultante se torna `SELECT * FROM usuarios WHERE nome = '' OR '1'='1';`, o que retorna todos os usuários da tabela.
> * **Outros Tipos de Injeção:** Incluem injeção de comandos de SO (*OS Command Injection*), injeção de LDAP (*LDAP Injection*) e injeção de XPath. O princípio é sempre o mesmo: a mistura de dados não confiáveis com código de comando.
> * **Contramedidas:**
>     * **Queries Parametrizadas (*Prepared Statements*):** A defesa primária e mais eficaz. A consulta é definida com marcadores de posição (*placeholders*), e os dados do usuário são passados como parâmetros, garantindo que sejam tratados exclusivamente como dados, e não como parte do comando SQL.
>     * **Validação de Entrada (*Input Validation*):** Rejeitar entradas que não correspondam ao formato esperado (e.g., usando *whitelisting*).
>     * **Princípio do Menor Privilégio:** Configurar a conta do banco de dados usada pela aplicação com o mínimo de permissões necessárias.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Causa Raiz:** A causa fundamental da falha de injeção é a **mistura de código e dados** e a **confiança implícita** em dados provenientes do usuário. A aplicação falha em separar adequadamente a instrução (código) dos dados a serem processados.
> > * **Prevenção: Parametrização vs. "Escapar" Caracteres:** A banca pode afirmar que a principal defesa contra SQL Injection é "escapar" ou filtrar caracteres especiais (como aspas simples). **INCORRETO**. Embora seja uma camada de defesa, a prática recomendada e mais segura são as **queries parametrizadas**, que garantem a separação entre código e dados no nível do driver do banco de dados.
> > * **Impacto:** O impacto de uma falha de injeção não se limita à exposição de dados. Pode levar à modificação ou exclusão de dados, negação de serviço ou, em casos graves de injeção de comandos de SO, ao comprometimento total do servidor.

---
# Classe: A
# Conteúdo: Cross-Site Scripting (XSS)

## 2. Cross-Site Scripting (XSS)

> **TEORIA-ALVO**
>
> O Cross-Site Scripting (XSS) é uma vulnerabilidade de injeção do lado do cliente, na qual um atacante insere scripts maliciosos (geralmente JavaScript) em páginas web que são, subsequentemente, visualizadas por outros usuários. O script malicioso é executado no contexto do site vulnerável, no navegador da vítima.
>
> * **Objetivo do Ataque:** O atacante explora a confiança que o usuário tem no site vulnerável para roubar informações da vítima (e.g., cookies de sessão), redirecioná-la para sites maliciosos, ou realizar ações em nome dela.
> * **Tipos de XSS:**
>     1.  **XSS Armazenado (Stored ou Persistente):** O script malicioso é permanentemente armazenado no servidor de destino (e.g., em um comentário de blog, em um campo de perfil de usuário). Ele é servido a todos os usuários que visualizarem a página infectada. É o tipo mais danoso.
>     2.  **XSS Refletido (Reflected ou Não Persistente):** O script malicioso é injetado como parte da requisição HTTP (e.g., em um parâmetro de URL) e é "refletido" de volta pelo servidor na resposta. O ataque requer que a vítima clique em um link malicioso criado pelo atacante.
>     3.  **XSS Baseado em DOM:** A vulnerabilidade reside exclusivamente no código do lado do cliente (JavaScript), que manipula o DOM de forma insegura com dados de uma fonte não confiável (e.g., a URL), sem que os dados jamais sejam enviados ao servidor.
> * **Contramedidas:**
>     * **Output Encoding:** A defesa principal. Consiste em codificar os dados provenientes do usuário de acordo com o contexto em que serão exibidos na página HTML (e.g., converter `<` para `&lt;`), para que o navegador os trate como texto, e não como código executável.
>     * **Content Security Policy (CSP):** Um cabeçalho HTTP que permite ao administrador do site especificar quais fontes de conteúdo (scripts, estilos, etc.) são permitidas, mitigando o risco de execução de scripts de origens não confiáveis.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Local da Execução:** O ponto mais importante a ser entendido é que o script XSS é executado no **navegador da vítima**, não no servidor da aplicação.
> > * **XSS vs. CSRF:** Esta é uma confusão clássica. **XSS** explora a **confiança que o usuário tem no site** para executar scripts maliciosos em seu navegador. **CSRF** (visto a seguir) explora a **confiança que o site tem no navegador** do usuário autenticado para forçá-lo a fazer requisições indesejadas.
> > * **Validação de Entrada vs. Codificação de Saída:** A validação de entrada ajuda a prevenir XSS, mas a defesa fundamental e mais robusta é a **codificação de saída (output encoding)**, pois ela garante que os dados sejam tratados de forma segura no contexto exato em que serão renderizados.

---
# Classe: A
# Conteúdo: Quebra de Autenticação e Gerenciamento de Sessão

## 3. Quebra de Autenticação e Gerenciamento de Sessão

> **TEORIA-ALVO**
>
> Esta categoria de vulnerabilidade abrange falhas relacionadas à forma como a identidade do usuário é confirmada e como seu estado de autenticação (sessão) é gerenciado ao longo do tempo.
>
> * **Quebra de Autenticação:**
>     * **Causas:** Permissão de senhas fracas ou previsíveis; armazenamento de senhas em texto claro ou com algoritmos de *hash* fracos (e.g., MD5, SHA1); falta de proteção contra ataques de força bruta ou *credential stuffing*; processos de recuperação de conta inseguros.
>     * **Contramedidas:** Exigir políticas de senha fortes; implementar mecanismos de bloqueio de conta após múltiplas falhas de login; armazenar senhas utilizando funções de *hash* lentas e com *salt* (e.g., **bcrypt**, Argon2); implementar Autenticação Multifator (MFA).
> * **Gerenciamento de Sessão Inseguro:**
>     * **Causas:** Exposição de identificadores de sessão (Session IDs) na URL; IDs de sessão previsíveis; falta de invalidação da sessão no *logout*; *timeouts* de sessão excessivamente longos; falha em regenerar o ID da sessão após um login bem-sucedido (vulnerabilidade a *Session Fixation*).
>     * **Contramedidas:** Gerar IDs de sessão longos, aleatórios e imprevisíveis; transmitir IDs de sessão apenas em *cookies* seguros (com as *flags* `HttpOnly` e `Secure`); invalidar a sessão no servidor durante o *logout*; implementar *timeouts* de inatividade; regenerar o ID da sessão após a autenticação.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Armazenamento de Senhas:** A banca pode afirmar que o uso de MD5 ou SHA1 para armazenar senhas é uma prática segura. **ERRADO**. Estes são algoritmos de *hash* rápidos e inadequados para senhas. Algoritmos modernos como **bcrypt**, scrypt ou Argon2 são projetados para serem computacionalmente caros, dificultando ataques de força bruta.
> > * **Fixação de Sessão (*Session Fixation*):** A banca pode descrever este ataque. Ele ocorre quando um atacante consegue definir (fixar) o ID de sessão de uma vítima *antes* que ela se autentique. Quando a vítima faz o login, ela passa a usar o ID de sessão conhecido pelo atacante, que pode então sequestrar a sessão. A contramedida primária é **regenerar o ID de sessão imediatamente após uma autenticação bem-sucedida**.
> > * **Flag `HttpOnly` em Cookies:** Esta *flag* instrui o navegador a não permitir que o *cookie* de sessão seja acessado por scripts do lado do cliente (JavaScript). É uma mitigação importante contra o roubo de sessão via ataques XSS.

---
# Classe: A
# Conteúdo: CSRF e Referência Insegura a Objeto

## 4. CSRF e Referência Insegura a Objeto

> **TEORIA-ALVO**
>
> **CSRF (Cross-Site Request Forgery - Falsificação de Requisição Entre Sites):**
> * **Definição:** Um ataque que força o navegador de um usuário autenticado a enviar uma requisição forjada e indesejada para uma aplicação web. A aplicação vulnerável executa a ação maliciosa (e.g., transferir fundos, alterar uma senha) porque ela confia que a requisição, vinda de um navegador autenticado, foi feita intencionalmente pelo usuário.
> * **Mecanismo:** O atacante cria uma página web ou e-mail malicioso que contém o código (e.g., um formulário ou uma tag `<img>`) que dispara a requisição para o site alvo quando a vítima o acessa.
> * **Contramedida Principal:** **Token Anti-CSRF (Padrão *Synchronizer Token*):** A aplicação gera um token único e imprevisível para cada sessão de usuário e o embute em todas as requisições que modificam o estado. O servidor valida a presença e a correção desse token antes de processar a requisição.
>
> **Referência Insegura e Direta a Objeto (IDOR - Insecure Direct Object Reference):**
> * **Definição:** Uma falha de controle de acesso que ocorre quando uma aplicação expõe uma referência direta a um objeto interno (e.g., uma chave primária do banco de dados, um nome de arquivo) em um parâmetro, e não verifica se o usuário autenticado tem autorização para acessar aquele objeto específico.
> * **Mecanismo:** Um atacante manipula o valor do parâmetro para acessar dados de outros usuários. Exemplo: alterar a URL de `.../verPedido?id=101` para `.../verPedido?id=102`.
> * **Contramedida Principal:** Implementar, no lado do servidor, uma verificação de controle de acesso para **toda requisição**, garantindo que o usuário logado possui as permissões necessárias para acessar o objeto solicitado. O uso de referências indiretas e não previsíveis também é recomendado.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **CSRF vs. XSS:** Repetindo, pois é uma confusão clássica. **CSRF** força o navegador a **enviar uma requisição**. **XSS** engana o navegador para **executar um script**. No CSRF, o atacante não vê a resposta da requisição. No XSS, o script executado pode enviar dados da vítima para o atacante.
> > * **Alvo do CSRF:** O ataque CSRF visa exclusivamente ações que **modificam o estado** (ações transacionais). É inútil para roubar dados.
> > * **Causa Raiz do IDOR:** A vulnerabilidade do IDOR não está em expor o ID, mas na **ausência de uma verificação de autorização** no *back-end*. A aplicação assume que, se o usuário pode formar a requisição, ele tem direito de acessar o recurso, o que é uma premissa falha.

---
# Classe: A
# Conteúdo: Armazenamento Criptográfico Inseguro

## 5. Armazenamento Criptográfico Inseguro (Exposição de Dados Sensíveis)

> **TEORIA-ALVO**
>
> Esta categoria de vulnerabilidade ocorre quando uma aplicação falha em proteger adequadamente informações sensíveis, tanto em trânsito quanto em repouso, tornando-as suscetíveis a comprometimento.
>
> * **Dados em Trânsito:**
>     * **Falha:** Comunicação entre o cliente e o servidor realizada via protocolos não criptografados (e.g., HTTP, FTP), permitindo que um atacante na rede intercepte e leia os dados em texto claro.
>     * **Contramedida:** Utilizar **TLS (Transport Layer Security)** para criptografar todo o tráfego. Isso é implementado através de protocolos como HTTPS, FTPS, etc. É crucial também utilizar configurações de TLS seguras (versões e cifras criptográficas fortes).
> * **Dados em Repouso:**
>     * **Falha:** Armazenamento de dados sensíveis (e.g., dados pessoais, informações financeiras, credenciais) em bancos de dados, arquivos de log ou backups sem criptografia, ou utilizando algoritmos criptográficos fracos, obsoletos ou mal implementados.
>     * **Contramedida:** Criptografar os dados sensíveis antes de armazená-los, utilizando algoritmos simétricos fortes e padronizados (e.g., **AES - Advanced Encryption Standard**). A segurança da criptografia depende fundamentalmente da proteção das chaves criptográficas.
> * **Gerenciamento de Chaves:** A segurança da criptografia é tão forte quanto a segurança das chaves. As chaves devem ser armazenadas de forma segura, separadas dos dados criptografados, e com acesso restrito, utilizando, preferencialmente, um sistema de gerenciamento de chaves (KMS) ou um módulo de segurança de hardware (HSM).

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Criptografia não é a Solução Completa:** A banca pode sugerir que o simples ato de criptografar os dados resolve o problema. **INCOMPLETO**. A escolha de **algoritmos fortes** (e.g., AES em vez de DES) e, principalmente, o **gerenciamento seguro das chaves criptográficas**, são igualmente críticos. Chaves expostas tornam a criptografia inútil.
> > * **Confidencialidade vs. Integridade de Senhas:** Para senhas, o objetivo não é poder decifrá-las (confidencialidade reversível), mas apenas verificar sua correção. Portanto, para senhas, não se usa criptografia, mas sim **funções de hash lentas e com salt** (e.g., bcrypt), que garantem a integridade e dificultam a quebra, mas são unidirecionais. A banca pode confundir esses conceitos.
> > * **Escopo da Vulnerabilidade:** Esta falha não se refere ao processo de autenticação (que é coberto pela "Quebra de Autenticação"), mas sim à proteção do **dado em si**, seja ele qual for, quando está armazenado ou sendo transmitido.