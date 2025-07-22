### Olá, futuro(a) aprovado(a)! Vamos abrir as portas do conhecimento sobre Autenticação para você garantir seu acesso à aprovação no Cebraspe.

Pense em autenticação e autorização como o processo de **entrar em um clube de luxo super exclusivo** 💎 e usar seus serviços. Cada conceito é uma camada de segurança ou uma permissão especial.

---

### ### Autenticação Multifator (MFA): Provando Quem Você É na Portaria

**Autenticação** é o ato de provar para o segurança da portaria que você é realmente um membro do clube.

* **Os Fatores de Autenticação (As Provas de Identidade):**
    Existem 3 tipos de "provas" que você pode apresentar:
    1.  **Algo que você SABE (Conhecimento):** A **senha secreta** que só os membros conhecem.
    2.  **Algo que você TEM (Posse):** O **cartão de membro** físico e intransferível no seu bolso.
    3.  **Algo que você É (Inerência):** Sua **impressão digital** no leitor da catraca.

* **O que é MFA?**
    É a regra do clube que diz que uma única prova não é suficiente. Para entrar, você precisa apresentar **pelo menos duas provas de TIPOS DIFERENTES**. Por exemplo, a senha secreta **(sabe)** + o cartão de membro **(tem)**. Isso é a Autenticação de Dois Fatores (2FA), o tipo mais comum de MFA.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * A pegadinha mais clássica! A banca vai dizer que usar "uma senha e um PIN" é MFA. **ERRADO!** Senha e PIN são ambos da categoria **conhecimento**. Para ser MFA, os fatores precisam ser de **categorias diferentes**.
> > * A MFA é a defesa mais forte contra a maioria dos ataques de roubo de senha. Mesmo que o ladrão descubra sua senha, ele ainda não consegue entrar no clube porque não tem o seu cartão de membro.

---

### ### OAuth 2.0: Autorizando seu Personal Shopper

Você está no clube e quer que um serviço de *personal shopper* (um aplicativo terceiro) organize seu armário de vinhos privado (seus dados no Google Fotos). Você não vai dar a chave do clube e a senha do seu armário para ele!

* **O que é OAuth 2.0?**
    É o **framework de AUTORIZAÇÃO DELEGADA**. É o procedimento que o clube usa para que você possa autorizar o *personal shopper* a acessar seu armário, sem entregar suas senhas.

* **O Fluxo:**
    1.  O *personal shopper* (aplicação cliente) te pede permissão.
    2.  Você vai até a **gerência do clube** (é redirecionado para a página de login do Google).
    3.  Você prova para o gerente que é você e autoriza: "Pode deixar o *personal shopper* entrar, mas SÓ no meu armário de vinhos".
    4.  O gerente entrega uma **chave de acesso temporária e restrita (Access Token)** para o *personal shopper*.
    5.  O *personal shopper* usa essa chave para acessar apenas o seu armário de vinhos (o Resource Server).

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * **AUTORIZAÇÃO, NÃO AUTENTICAÇÃO!** A banca VAI dizer que OAuth 2.0 serve para fazer login. **ERRADO!** OAuth 2.0 serve para **autorizar** um app a acessar seus dados. Ele delega permissões. Quem faz a autenticação (o login) é o protocolo a seguir...

---

### ### OpenID Connect (OIDC): O "Login com o Clube"

Agora, uma charutaria da esquina (outro site) quer te dar um desconto por você ser membro do clube. A charutaria não quer acessar seus dados, ela só precisa **saber que você é realmente um membro verificado**.

* **O que é OIDC?**
    É uma camada de **AUTENTICAÇÃO** construída **em cima do OAuth 2.0**. É o que permite o famoso "Entrar com o Google".

* **A Mágica do OIDC:**
    O fluxo é o mesmo do OAuth, mas com um item extra. Além da chave de acesso (Access Token), a gerência do clube também entrega para a charutaria um **crachá de identidade autenticado (ID Token)**.

* **ID Token vs. Access Token:**
    * **Access Token (A Chave do Armário):** É para o **servidor de recursos** (o guarda do armário). É uma chave de permissão.
    * **ID Token (O Crachá de Identidade):** É para a **aplicação cliente** (a charutaria). É um comprovante que diz: "Eu, o Clube, garanto que este é o João, e ele se autenticou com sucesso".

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * OIDC e OAuth 2.0 não são rivais. O **OIDC estende o OAuth 2.0**, adicionando a peça que faltava: a autenticação.
> > * Se a questão fala em **login** ou **verificação de identidade**, a resposta é **OIDC**. Se fala em **dar permissão** para um app acessar seus dados, a resposta é **OAuth 2.0**.

---

### ### JSON Web Token (JWT): O Design do Crachá Digital

* **O que é JWT?**
    É o padrão de como o **crachá de identidade digital (o ID Token)** é desenhado.

* **A Estrutura (header.payload.signature):**
    O crachá tem 3 partes, separadas por pontos.
    1.  **Header (Cabeçalho):** Diz o tipo de crachá e como ele foi assinado.
    2.  **Payload (Carga Útil):** As informações do membro (nome, ID, validade do crachá).
    3.  **Signature (Assinatura):** A **assinatura digital do gerente do clube**. É o que garante que o crachá é autêntico e não foi falsificado.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * **JWT NÃO É CRIPTOGRAFADO (por padrão)!** A pegadinha mais comum. As informações no crachá (Payload) são apenas codificadas em Base64, qualquer um pode ler. A segurança do JWT vem da **ASSINATURA**, que garante **autenticidade e integridade** (prova que foi o gerente que emitiu e que não foi alterado), mas **NÃO garante confidencialidade**.
> > * **Stateless:** Como o crachá já contém as informações do usuário, o segurança não precisa consultar a lista de membros a cada vez que o vê. Isso permite que os sistemas sejam *stateless* (sem estado), o que é ótimo para a escalabilidade.

### ### Mapa Mental: OAuth 2.0 (Autorização) vs. OpenID Connect (Autenticação)

```mermaid
%%{init: {"theme": "tokyo-midnight", "themeVariables": { "fontFamily": "lexend"}}}%%
graph TD
    A["<b>OAuth 2.0</b><br>Framework de <b>AUTORIZAÇÃO</b>"]
    
    subgraph "Gera como resultado"
        direction LR
        AT["🔑<br>Access Token<br>(Para a API)"]
    end

    B["<b>OpenID Connect (OIDC)</b><br>Camada de <b>AUTENTICAÇÃO</b>"]

    subgraph "Adiciona ao fluxo o"
        direction LR
        IT["🪪<br>ID Token (JWT)<br>(Para o Cliente)"]
    end

    B -- "É construído sobre o" --> A
    A --> AT
    B --> IT
````

### **Classe:** A
### **Conteúdo:** Autenticação: Autenticação Multifator (MFA)

---

### **1. Autenticação Multifator (MFA)**

> #### **TEORIA-ALVO**
> A **Autenticação** é o processo de verificação da identidade declarada por uma entidade (usuário, sistema ou processo). A **Autenticação Multifator (MFA)** é um método de controle de acesso que exige que um usuário forneça com sucesso duas ou mais evidências (fatores) de diferentes categorias para uma credencial, a fim de obter acesso a um recurso.
>
> * **Fatores de Autenticação:** São classificados em três tipos:
>     1.  **Fator de Conhecimento (Algo que você sabe):** Informação que apenas o usuário deve conhecer.
>         * Exemplos: Senha, frase secreta (passphrase), número de identificação pessoal (PIN), resposta a uma pergunta de segurança.
>     2.  **Fator de Posse (Algo que você tem):** Um objeto físico na posse do usuário.
>         * Exemplos: Token de segurança de hardware (e.g., YubiKey), token de software em um aplicativo autenticador (e.g., Google Authenticator, Microsoft Authenticator) que gera senhas de uso único baseadas em tempo (TOTP), smartphone para recebimento de SMS ou notificações push, cartão inteligente.
>     3.  **Fator de Inerência (Algo que você é):** Uma característica biométrica única do usuário.
>         * Exemplos: Impressão digital, reconhecimento facial, varredura de retina ou íris, reconhecimento de voz.
> * **Implementação:** A MFA combina fatores de **categorias distintas**. A Autenticação de Dois Fatores (2FA) é o subconjunto mais comum da MFA, exigindo exatamente dois fatores.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Fatores de Tipos Diferentes:** Este é o ponto mais crítico e frequentemente explorado. A banca afirmará que o uso de "uma senha e um PIN" constitui autenticação multifator. **ERRADO**. Ambos são fatores da mesma categoria (conhecimento). A MFA requer a combinação de fatores de **categorias diferentes**, como, por exemplo, uma senha (conhecimento) e um código gerado por um aplicativo autenticador (posse).
> > * **MFA vs. 2FA:** A Autenticação de Dois Fatores (2FA) é um tipo específico de MFA. Toda 2FA é MFA, mas nem toda MFA é 2FA (uma MFA pode exigir três fatores, por exemplo).
> > * **Eficácia:** A MFA é considerada uma das defesas mais eficazes contra a maioria dos ataques de comprometimento de credenciais, incluindo *phishing*, ataques de força bruta e reutilização de senhas, pois um atacante que comprometa a senha do usuário ainda precisará de acesso ao segundo fator físico ou biométrico.

---

### **Classe:** A
### **Conteúdo:** Framework de Autorização OAuth 2.0

---

### **2. OAuth 2.0**

> #### **TEORIA-ALVO**
> O OAuth 2.0 é um padrão aberto e um **framework de autorização**. Seu objetivo principal é permitir que uma aplicação de terceiros (cliente) obtenha acesso limitado e delegado a recursos de um usuário em um servidor HTTP, sem que a aplicação cliente precise manipular ou armazenar as credenciais (senha) do usuário.
>
> * **Atores (Papéis) no Fluxo OAuth 2.0:**
>     * **Resource Owner (Dono do Recurso):** O usuário final que concede a permissão de acesso aos seus dados.
>     * **Client (Cliente):** A aplicação de terceiros que deseja acessar os recursos do usuário.
>     * **Authorization Server (Servidor de Autorização):** O servidor que autentica o Resource Owner, obtém seu consentimento e emite os *Access Tokens*.
>     * **Resource Server (Servidor de Recurso):** O servidor que hospeda os recursos protegidos (a API) e aceita os *Access Tokens*.
> * **Fluxo Básico (Conceitual):**
>     1.  O **Client** solicita autorização ao **Resource Owner**.
>     2.  O **Resource Owner** se autentica no **Authorization Server** e concede a permissão.
>     3.  O **Authorization Server** retorna um **Access Token** (token de acesso) ao **Client**.
>     4.  O **Client** utiliza o **Access Token** para requisitar o recurso ao **Resource Server**.
> * **Grant Types (Tipos de Concessão):** O OAuth 2.0 define vários fluxos para obter um *Access Token*, adequados a diferentes tipos de clientes. O mais comum e seguro para aplicações web é o **Authorization Code Grant**.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Autorização, NÃO Autenticação:** Esta é a distinção mais importante e o principal alvo de questões. O OAuth 2.0 é um protocolo para **DELEGAR AUTORIZAÇÃO** de acesso a recursos. Ele **NÃO** é, por si só, um protocolo de autenticação de usuários. A banca afirmará que "o OAuth 2.0 é um padrão para realizar o login de um usuário em um site". **ERRADO**. Essa função é desempenhada pelo OpenID Connect, que opera sobre o OAuth 2.0.
> > * **Proteção de Credenciais:** O benefício central do OAuth 2.0 é que a aplicação cliente **nunca tem acesso à senha do usuário**. O usuário insere suas credenciais diretamente no Servidor de Autorização (e.g., na página de login do Google ou do Facebook).
> > * **Access Token:** O resultado do fluxo OAuth 2.0 é um **Access Token**. Este token representa a permissão concedida, possui um escopo limitado (e.g., acesso apenas a fotos, não a e-mails) e um tempo de vida curto. É uma "chave temporária" para a API.

---

### **Classe:** A
### **Conteúdo:** Protocolo de Autenticação OpenID Connect (OIDC)

---

### **3. OpenID Connect (OIDC)**

> #### **TEORIA-ALVO**
> O OpenID Connect (OIDC) é um protocolo de autenticação e uma camada de identidade simples construída **sobre o framework de autorização OAuth 2.0**. Ele permite que aplicações clientes verifiquem a identidade de um usuário final com base na autenticação realizada por um Servidor de Autorização.
>
> * **Relação com OAuth 2.0:** O OIDC estende o OAuth 2.0 para adicionar a funcionalidade de autenticação que lhe falta. Todo fluxo OIDC é também um fluxo OAuth 2.0. O OIDC é o que habilita as funcionalidades de login social, como "Entrar com o Google" ou "Entrar com o Facebook".
> * **Funcionamento:** Além de obter um **Access Token** (para acessar recursos, conforme o OAuth 2.0), uma aplicação cliente que utiliza OIDC também recebe um **ID Token**.
> * **ID Token:**
>     * **Definição:** É a principal extensão do OIDC sobre o OAuth 2.0. Trata-se de um artefato de segurança, especificamente um **JSON Web Token (JWT)**, que contém um conjunto de **reivindicações (*claims*)** sobre o evento de autenticação do usuário.
>     * **Conteúdo:** Inclui informações como o identificador único do usuário (`sub`), o emissor do token (`iss`), a aplicação para a qual o token foi emitido (`aud`), a data de expiração (`exp`) e quando a autenticação ocorreu (`auth_time`). Pode, opcionalmente, conter informações de perfil do usuário (nome, e-mail).
>     * **Propósito:** É a prova, para a aplicação cliente, de que o usuário foi autenticado com sucesso pelo provedor de identidade.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **OIDC é construído sobre o OAuth 2.0:** É fundamental entender essa relação. A banca pode apresentar OIDC e OAuth 2.0 como protocolos concorrentes ou independentes. **ERRADO**. O OIDC **adiciona** uma camada de identidade (autenticação) ao OAuth 2.0 (que é focado em autorização).
> > * **ID Token vs. Access Token:** A distinção do propósito dos tokens é crítica.
> >     * O **Access Token** é destinado ao **Resource Server (API)**. É a "chave" que a aplicação cliente usa para acessar os dados do usuário.
> >     * O **ID Token** é destinado à **aplicação Cliente**. É o "comprovante" que informa ao cliente quem é o usuário e que ele foi devidamente autenticado.
> > * **OIDC provê Autenticação:** É correto afirmar que o OpenID Connect é um protocolo de autenticação. **CORRETO**. É a combinação do fluxo OAuth 2.0 com o ID Token que permite realizar a autenticação federada.

---

### **Classe:** A
### **Conteúdo:** JSON Web Token (JWT)

---

### **4. JSON Web Token (JWT)**

> #### **TEORIA-ALVO**
> Um **JSON Web Token (JWT)** é um padrão aberto (RFC 7519) que define uma forma compacta e autossuficiente para transmitir informações entre partes de forma segura como um objeto JSON. A informação em um JWT pode ser verificada e confiada porque ela é **assinada digitalmente**.
>
> * **Estrutura:** Um JWT consiste em três partes, codificadas em Base64Url e separadas por pontos: `header.payload.signature`.
>     1.  **Header (Cabeçalho):** Contém metadados sobre o token, tipicamente o tipo do token (`typ`, que é "JWT") e o algoritmo de assinatura utilizado (`alg`, e.g., `HS256` ou `RS256`).
>     2.  **Payload (Carga Útil):** Contém as **reivindicações (*claims*)**, que são declarações sobre uma entidade (normalmente, o usuário) e metadados adicionais. Exemplos de *claims* padrão: `sub` (sujeito/ID do usuário), `iss` (emissor), `exp` (tempo de expiração).
>     3.  **Signature (Assinatura):** É utilizada para verificar que a mensagem não foi alterada e, no caso de assinaturas assimétricas, para verificar o remetente do JWT. É criada assinando-se o `header` e o `payload` codificados.
> * **Uso:** JWTs são amplamente utilizados como **ID Tokens** no OpenID Connect e, em muitos cenários, como **Access Tokens** no OAuth 2.0. Permitem a criação de sistemas de autenticação *stateless*.
> * **Validação:** Para validar um JWT, o receptor verifica a assinatura usando a chave apropriada (o segredo compartilhado para HMAC ou a chave pública para RSA/ECDSA). Se a assinatura for válida, o receptor pode confiar no conteúdo do *payload*.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **JWT não é Criptografado (por Padrão):** Esta é a pegadinha mais comum. A banca afirmará que o conteúdo de um JWT é confidencial. **ERRADO**. O *header* e o *payload* de um JWT são apenas codificados em **Base64Url**, que é um formato trivialmente reversível. O JWT é **assinado digitalmente**, o que garante sua **autenticidade** e **integridade**, mas **não** sua **confidencialidade**. Informações sensíveis não devem ser colocadas no *payload* de um JWT, a menos que o JWT inteiro seja criptografado (usando o padrão JWE - JSON Web Encryption).
> > * **Assinado vs. Verificado:** A assinatura é criada pelo **emissor** (e.g., o servidor de autorização) usando uma chave secreta ou privada. A verificação da assinatura é feita pelo **receptor** (e.g., a API) usando o segredo compartilhado ou a chave pública do emissor.
> > * **Stateless (Sem Estado):** Como o JWT é autossuficiente (contém todas as informações necessárias sobre o usuário), ele permite que as APIs sejam *stateless*. O servidor não precisa armazenar informações de sessão; basta validar o JWT recebido em cada requisição.
