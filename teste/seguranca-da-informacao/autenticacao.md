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
