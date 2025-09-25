Com certeza! Aqui está o guia de estudos sobre Segurança da Informação, com as contramedidas e sem os links de citação, conforme você solicitou.

---

### Guia de Estudo: Dominando a Segurança da Informação para Concursos

Este guia foi elaborado para fornecer uma visão clara e organizada sobre os principais conceitos, ameaças e defesas no campo da Segurança da Informação, ajudando você a se preparar de forma eficaz.

#### Passo 1: Os Pilares da Segurança da Informação (CID)

Toda a Segurança da Informação se baseia em três princípios fundamentais, conhecidos pela sigla **CID**:

1.  **Confidencialidade**: Garante que a informação seja acessível apenas por pessoas autorizadas. É o princípio que assegura o **sigilo**. A principal ferramenta para garantir a confidencialidade é a **criptografia**.
2.  **Integridade**: Garante que a informação não foi alterada ou destruída de maneira não autorizada. O objetivo é manter os dados íntegros e completos, exatamente como foram criados. A principal ferramenta para isso são as **funções de hash**.
3.  **Disponibilidade**: Garante que a informação e os sistemas estejam acessíveis e utilizáveis sempre que necessário por usuários autorizados. Um ataque de negação de serviço (DDoS), por exemplo, ataca diretamente a disponibilidade.

Além desses, existem outros dois princípios importantes frequentemente cobrados:
* **Autenticidade**: Garante que a identidade de quem envia ou cria a informação é verdadeira.
* **Não Repúdio (Irretratabilidade)**: Garante que uma pessoa não possa negar ter realizado uma ação ou enviado uma mensagem.

---
#### Passo 2: A Principal Ferramenta de Proteção – Criptografia

Criptografia é a arte de codificar uma mensagem ("texto claro") para que ela se torne ininteligível ("texto cifrado"), a menos que o destinatário tenha a "chave" correta para decodificá-la.

* **Criptografia Simétrica (Chave Secreta/Única)**
    * **Como funciona**: Utiliza **uma única chave** tanto para criptografar quanto para descriptografar os dados. Essa chave precisa ser compartilhada de forma segura entre o emissor e o receptor.
    * **Vantagens**: É **muito mais rápida e eficiente** para criptografar grandes volumes de dados.
    * **Desvantagens**: O gerenciamento e a distribuição segura da chave são complexos. Se a chave for interceptada, a segurança é comprometida.
    * **Algoritmos comuns**: AES (o mais utilizado atualmente), DES, 3DES, RC4, Blowfish.

* **Criptografia Assimétrica (Chave Pública)**
    * **Como funciona**: Utiliza um **par de chaves** matematicamente relacionadas: uma **chave pública** (que pode ser distribuída livremente) e uma **chave privada** (que deve ser mantida em segredo absoluto pelo seu dono).
    * **Vantagens**: É **muito mais segura** para a troca de informações e chaves, pois a chave privada nunca precisa ser compartilhada.
    * **Desvantagens**: É **significativamente mais lenta** que a criptografia simétrica.
    * **Algoritmos comuns**: RSA, ECC (Criptografia de Curva Elíptica), DSA.

* **Aplicação da Criptografia Assimétrica**
    O uso das chaves pública e privada depende do objetivo:
    * **Para garantir Confidencialidade (Sigilo)**: O remetente criptografa a mensagem com a **chave pública do destinatário**. Apenas o destinatário poderá descriptografar com sua **chave privada** correspondente.
    * **Para garantir Autenticidade e Não Repúdio (Assinatura Digital)**: O remetente "assina" a mensagem usando sua **própria chave privada**. Qualquer pessoa pode verificar a assinatura usando a **chave pública do remetente**.

* **Funções de Hash (Resumo Criptográfico)**
    * **O que é**: Um algoritmo que transforma uma entrada de qualquer tamanho em uma saída de **tamanho fixo** e único, chamada de "hash" ou "digest".
    * **Características**:
        * **Mão única**: É computacionalmente impossível reverter o processo, ou seja, obter a mensagem original a partir do hash.
        * **Sensibilidade**: Qualquer pequena alteração na mensagem original gera um hash completamente diferente.
    * **Uso principal**: Garantir a **integridade** de dados.
    * **Colisão**: Ocorre quando duas entradas diferentes produzem o mesmo hash. Algoritmos mais antigos como o MD5 são vulneráveis a colisões, comprometendo a verificação de integridade.

* **Assinatura Digital**
    Combina o uso de **funções de hash** e **criptografia assimétrica** para garantir:
    * **Integridade**: O hash garante que a mensagem não foi alterada.
    * **Autenticidade**: A criptografia com a chave privada prova quem foi o autor.
    * **Não Repúdio**: O autor não pode negar a autoria.

---
#### Passo 3: Conhecendo o Inimigo – Ataques, Ameaças e Contramedidas

Compreender os tipos de ataque é fundamental para saber como se defender.

* **Ataques de Injeção**
    Ocorrem quando dados maliciosos são inseridos em uma aplicação e interpretados como comandos.
    * **SQL Injection**: O atacante injeta comandos SQL em campos de entrada para manipular o banco de dados. A vulnerabilidade nasce da falta de separação entre dados e comandos.
        * **Contramedidas e Prevenção**: Utilizar **consultas parametrizadas** (*prepared statements*), que separam logicamente os comandos dos dados, e realizar a **sanitização e validação rigorosa** de todas as entradas do usuário.
    * **Cross-Site Scripting (XSS)**: O atacante injeta scripts maliciosos (geralmente JavaScript) em uma página web. Quando outro usuário acessa essa página, o script é executado em seu navegador. O alvo do XSS não é a aplicação em si, mas seus usuários.
        * **Contramedidas e Prevenção**: **Sanitizar e validar** todas as entradas do usuário para remover ou codificar caracteres perigosos (como `<` e `>`). Implementar políticas de segurança de conteúdo (CSP) no servidor.

* **Ataques de Manipulação de Sessão**
    * **CSRF (Cross-Site Request Forgery)**: O atacante força o navegador de um usuário já autenticado em um site a enviar uma requisição maliciosa para esse site, sem o conhecimento da vítima (ex: realizar uma transferência bancária).
        * **Contramedidas e Prevenção**: Utilizar **tokens anti-CSRF**, que são valores únicos e imprevisíveis enviados em cada requisição para validação no servidor. Verificar o cabeçalho `Referer` ou `Origin` da requisição e usar cookies com o atributo `SameSite`.

* **Ataques de Negação de Serviço**
    Visam tornar um serviço ou recurso indisponível para usuários legítimos.
    * **DoS (Denial of Service)**: O ataque parte de uma **única origem**.
    * **DDoS (Distributed Denial of Service)**: O ataque é distribuído e parte de **múltiplas origens** simultaneamente, geralmente usando uma **botnet** (rede de computadores "zumbis").
        * **Contramedidas e Prevenção**: Utilizar **firewalls** e sistemas de detecção/prevenção de intrusão (IDS/IPS) para filtrar tráfego malicioso. Implementar **limitação de taxa** (*rate limiting*) nas requisições e utilizar serviços especializados de mitigação de DDoS. Um antivírus sozinho não é suficiente.

* **Engenharia Social e Phishing**
    * **Engenharia Social**: Técnica de manipulação psicológica para enganar pessoas e fazê-las executar ações ou revelar informações confidenciais.
    * **Phishing**: O tipo mais comum. Ocorre através de e-mails, mensagens ou sites falsos para "pescar" dados sensíveis da vítima.
        * **Contramedidas e Prevenção**: A melhor defesa é o **treinamento e a conscientização dos usuários** para que aprendam a identificar e-mails e sites fraudulentos. Utilizar **filtros de e-mail** e, crucialmente, implementar **autenticação multifator (MFA)**, que impede o acesso mesmo que a senha seja roubada.

* **Ransomware**
    * **O que é**: Um malware que criptografa os arquivos da vítima e exige um resgate (pagamento) para devolvê-los.
        * **Contramedidas e Prevenção**: A medida mais eficaz é manter uma **política de backup robusta**, com cópias de segurança armazenadas de forma isolada (offline ou em rede separada). Ter um **plano de gestão de crises e recuperação de desastres** também é fundamental. Pagar o resgate não garante a recuperação dos dados.

---
#### Passo 4: Verificação de Identidade – Autenticação

Autenticação é o processo de confirmar se um usuário é quem ele diz ser. Autorização é o processo de definir o que um usuário autenticado pode fazer.

* **Fatores de Autenticação**:
    1.  **Algo que você sabe**: Senha, PIN.
    2.  **Algo que você tem**: Celular, token físico, cartão.
    3.  **Algo que você é (Inerência)**: Biometria (impressão digital, facial).

* **Autenticação Multifator (MFA)**: Combina **dois ou mais** desses fatores para aumentar a segurança.

* **Single Sign-On (SSO)**: Permite que um usuário faça login uma única vez e acesse múltiplos sistemas e aplicações sem precisar se autenticar novamente.

* **OAuth 2.0 e OpenID Connect (OIDC)**:
    * **OAuth 2.0**: É um protocolo de **AUTORIZAÇÃO**. Permite que uma aplicação acesse recursos de outra em nome do usuário, sem que ele precise compartilhar sua senha.
    * **OpenID Connect (OIDC)**: É uma camada de **AUTENTICAÇÃO** construída sobre o OAuth 2.0. Permite que aplicações verifiquem a identidade de um usuário com base na autenticação feita por um provedor de identidade (como Google).
    * **JWT (JSON Web Token)**: É um formato de **token** compacto e seguro usado para transmitir informações de identidade e autorização, amplamente utilizado em conjunto com OIDC e OAuth 2.0.

---
### Exemplo Prático Integrado

Vamos aplicar esses conceitos em um cenário do dia a dia: **Ana acessando seu aplicativo bancário para fazer uma transferência.**

1.  **Acesso e Autenticação Segura**:
    * Ana digita sua senha (**1º Fator: Conhecimento**). O aplicativo pede um código gerado pelo app autenticador no celular dela (**2º Fator: Posse**). Isso é uma implementação de **MFA**.

2.  **Proteção da Comunicação (Criptografia)**:
    * A comunicação entre o app e o servidor do banco é protegida usando **criptografia híbrida (TLS)**.
    * Primeiro, a **criptografia assimétrica (RSA)** é usada para trocar de forma segura uma chave secreta.
    * Depois, a **criptografia simétrica (AES)**, que é mais rápida, usa essa chave para proteger todos os dados da transação (confidencialidade).

3.  **Ameaça e Contramedida**:
    * **Ameaça**: Um golpista envia a Ana um e-mail falso se passando pelo banco (**Phishing**). O link leva a um site clone.
    * **Contramedida**: Ana, por ter recebido treinamento de **conscientização**, desconfia do e-mail, não clica no link e acessa o site do banco digitando o endereço diretamente no navegador.

4.  **Garantia da Integridade da Transação**:
    * Quando Ana confirma uma transferência, o aplicativo cria um **hash** dos dados.
    * Esse hash é criptografado com a **chave privada** de Ana, gerando uma **assinatura digital**.
    * O servidor do banco usa a **chave pública** de Ana para verificar a assinatura, garantindo a **Integridade** e a **Autenticidade** da ordem.

5.  **Garantia da Disponibilidade**:
    * O banco utiliza múltiplos servidores e firewalls para se proteger contra ataques **DDoS**, que visam sobrecarregar o sistema, garantindo a **Disponibilidade** do serviço para clientes como Ana.

Agora que o material está no formato ideal, gostaria que eu criasse um glossário com os termos técnicos mais importantes (como *Phishing*, *Ransomware*, *MFA*, *SSO*, etc.) para facilitar suas revisões rápidas?