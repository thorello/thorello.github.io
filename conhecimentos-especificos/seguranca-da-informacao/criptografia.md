### **Classe:** A
### **Conteúdo:** Criptografia: Fundamentos

---

### **1. Criptografia: Fundamentos**

> #### **TEORIA-ALVO**
> **Criptografia** é a ciência e a arte de escrever mensagens em código secreto, com o objetivo de proteger a informação contra acesso não autorizado. É um pilar fundamental da segurança da informação, sendo o principal mecanismo para garantir a **confidencialidade**.
>
> * **Conceitos Básicos:**
>     * **Texto Claro (*Plaintext*):** A mensagem original, legível.
>     * **Texto Cifrado (*Ciphertext*):** A mensagem codificada, ilegível.
>     * **Cifragem (ou Encriptação):** O processo de converter texto claro em texto cifrado.
>     * **Decifragem (ou Decriptação):** O processo de reverter o texto cifrado para o texto claro original.
>     * **Algoritmo Criptográfico (Cifra):** O conjunto de regras matemáticas utilizado para a cifragem e decifragem.
>     * **Chave Criptográfica:** Um parâmetro secreto que controla a operação do algoritmo. A segurança dos sistemas criptográficos modernos reside na confidencialidade da chave, não do algoritmo (Princípio de Kerckhoffs).
> * **Tipos de Criptografia:** A criptografia moderna se divide em duas categorias principais, com base no gerenciamento das chaves:
>     1.  **Criptografia Simétrica (ou de Chave Secreta):** Utiliza uma única chave secreta, compartilhada entre as partes, tanto para cifrar quanto para decifrar a informação.
>     2.  **Criptografia Assimétrica (ou de Chave Pública):** Utiliza um par de chaves matematicamente relacionadas: uma chave pública (que pode ser distribuída livremente) e uma chave privada (que deve ser mantida em segredo por seu dono).

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Objetivos da Criptografia:** A banca pode afirmar que a criptografia, por si só, garante todos os pilares da segurança da informação. **ERRADO**. O objetivo primário da criptografia é prover **confidencialidade**. Embora seja um bloco de construção essencial para garantir **integridade**, **autenticidade** e **não repúdio** (quando combinada com outras técnicas como funções de hash e assinaturas digitais), ela não garante esses princípios isoladamente e não tem relação direta com a **disponibilidade**.
> > * **Princípio de Kerckhoffs:** A segurança de um sistema criptográfico não deve depender do sigilo do algoritmo, mas sim do sigilo da **chave**. A banca pode sugerir que a segurança de um sistema reside em manter o algoritmo em segredo. **ERRADO**. Algoritmos seguros são públicos e extensivamente analisados pela comunidade acadêmica.
> > * **Criptografia vs. Esteganografia:** **Criptografia** oculta o **conteúdo** da mensagem. **Esteganografia** oculta a **existência** da mensagem (e.g., escondendo uma mensagem de texto dentro de um arquivo de imagem).

---

### **Classe:** A
### **Conteúdo:** Sistemas Criptográficos Simétricos

---

### **2. Criptografia Simétrica**

> #### **TEORIA-ALVO**
> A criptografia simétrica, também conhecida como criptografia de chave secreta ou de chave única, é um sistema no qual a mesma chave é utilizada tanto para o processo de cifragem quanto para o de decifragem da informação.
>
> * **Funcionamento:** O remetente utiliza a chave secreta para cifrar o texto claro. O destinatário, que deve possuir a mesma chave secreta, a utiliza para decifrar o texto cifrado e obter a mensagem original.
> * **Características:**
>     * **Velocidade:** É extremamente rápida e computacionalmente eficiente, sendo ideal para a cifragem de grandes volumes de dados (bulk data encryption).
>     * **Problema Principal:** A **distribuição segura da chave**. As partes envolvidas na comunicação precisam compartilhar a chave secreta previamente por meio de um canal seguro, o que representa um grande desafio logístico e de segurança.
> * **Tipos de Cifras Simétricas:**
>     * **Cifras de Bloco:** Operam em blocos de dados de tamanho fixo (e.g., 128 bits). Exemplos de algoritmos: **AES (Advanced Encryption Standard)**, DES (Data Encryption Standard), 3DES.
>     * **Cifras de Fluxo:** Operam em um fluxo contínuo de dados, geralmente cifrando um bit ou um byte de cada vez. Exemplo de algoritmo: RC4.
> * **Padrão Atual:** O **AES** é o padrão globalmente aceito e recomendado para criptografia simétrica, tendo substituído o antigo DES, que é considerado inseguro.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Vantagem Principal (Velocidade):** A principal vantagem da criptografia simétrica, e ponto de comparação com a assimétrica, é seu **alto desempenho**. A banca frequentemente testará essa característica.
> > * **Desvantagem Principal (Distribuição de Chaves):** O principal desafio da criptografia simétrica é o **gerenciamento e a distribuição segura das chaves**. Em uma rede com N usuários, para que todos possam se comunicar secretamente dois a dois, seriam necessárias $N \times (N-1)/2$ chaves, um problema de escalabilidade conhecido.
> > * **Algoritmos (AES vs. DES):** Qualquer afirmação de que o DES é um algoritmo seguro para uso em sistemas modernos está **ERRADA**. O AES é o padrão atual, oferecendo tamanhos de chave de 128, 192 e 256 bits.

---

### **Classe:** A
### **Conteúdo:** Sistemas Criptográficos Assimétricos

---

### **3. Criptografia Assimétrica**

> #### **TEORIA-ALVO**
> A criptografia assimétrica, também conhecida como criptografia de chave pública, utiliza um par de chaves matematicamente relacionadas para cada entidade: uma **chave pública** e uma **chave privada**.
>
> * **Funcionamento e Propriedades:**
>     * A chave pública pode ser livremente distribuída, enquanto a chave privada deve ser mantida em absoluto sigilo por seu proprietário.
>     * O que é cifrado com uma chave só pode ser decifrado com sua chave par correspondente.
>     * **Solução para o Problema da Distribuição de Chaves:** A criptografia assimétrica resolve o problema da distribuição de chaves da criptografia simétrica, pois não há necessidade de compartilhar um segredo previamente.
> * **Aplicações Principais:**
>     1.  **Confidencialidade:** Para enviar uma mensagem confidencial a uma entidade, o remetente cifra a mensagem com a **chave PÚBLICA** da entidade destinatária. Somente a entidade destinatária, com sua **chave PRIVADA** correspondente, poderá decifrar a mensagem.
>     2.  **Assinatura Digital (para Autenticidade, Integridade e Não Repúdio):** Para assinar um documento, o remetente calcula um *hash* do documento e cifra esse *hash* com sua própria **chave PRIVADA**. O resultado é a assinatura digital. Qualquer pessoa pode verificar a assinatura usando a **chave PÚBLICA** do remetente.
> * **Características:** É computacionalmente intensiva e, portanto, significativamente mais **lenta** que a criptografia simétrica.
> * **Algoritmos Comuns:** RSA, ElGamal, ECC (Elliptic Curve Cryptography).

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Uso das Chaves:** Este é o ponto mais crítico e explorado em provas. A banca vai inverter o uso das chaves. É mandatório memorizar:
> >     * Para **CONFIDENCIALIDADE**: Cifra-se com a **PÚBLICA** do destinatário.
> >     * Para **ASSINATURA DIGITAL**: Assina-se (cifra-se o hash) com a **PRIVADA** do remetente.
> > * **Velocidade:** É incorreto afirmar que a criptografia assimétrica é mais rápida que a simétrica. **ERRADO**. A criptografia assimétrica é ordens de magnitude mais **lenta**, sendo inadequada para cifrar grandes volumes de dados.
> > * **Assinatura Digital vs. Criptografia para Confidencialidade:** A assinatura digital, por si só, **não torna a mensagem confidencial**. Ela apenas garante autenticidade, integridade e não repúdio. O conteúdo da mensagem permanece em texto claro.

---

### **Classe:** A
### **Conteúdo:** Criptografia de Dados em Trânsito e em Repouso

---

### **4. Proteção de Dados em Trânsito e em Repouso**

> #### **TEORIA-ALVO**
> A aplicação prática da criptografia envolve a proteção de dados em seus dois principais estados: quando estão sendo transmitidos por uma rede (em trânsito) e quando estão armazenados em um dispositivo (em repouso).
>
> * **Proteção de Dados em Trânsito:**
>     * **Desafio:** Proteger a comunicação em redes inseguras como a Internet.
>     * **Solução (Abordagem Híbrida):** Utiliza-se uma combinação de criptografia simétrica e assimétrica para obter o melhor de ambos os mundos.
>         1.  A **criptografia assimétrica** é usada no início da comunicação para estabelecer um canal seguro e para trocar ou negociar uma **chave de sessão simétrica** única para aquela comunicação.
>         2.  Após a troca segura da chave, toda a comunicação subsequente é cifrada utilizando a **criptografia simétrica** (com a chave de sessão), que é muito mais rápida e eficiente.
>     * **Exemplo Prático:** O protocolo **TLS (Transport Layer Security)**, que protege o protocolo HTTP (resultando no HTTPS).
> * **Proteção de Dados em Repouso:**
>     * **Desafio:** Proteger dados armazenados em discos rígidos, SSDs, bancos de dados ou backups contra acesso não autorizado em caso de roubo físico ou acesso indevido ao sistema.
>     * **Solução:** Geralmente, utiliza-se a **criptografia simétrica** (e.g., AES) para cifrar os dados, devido ao seu alto desempenho para lidar com grandes volumes. A técnica pode ser aplicada em diferentes níveis:
>         * **Criptografia de Disco Completo (FDE - *Full Disk Encryption*):** Cifra todo o dispositivo de armazenamento.
>         * **Criptografia de Arquivos/Pastas.**
>         * **Criptografia em Nível de Banco de Dados.**
>     * **Desafio Principal:** O **gerenciamento seguro das chaves criptográficas** (*key management*). A segurança dos dados cifrados depende inteiramente da proteção das chaves usadas para cifrá-los.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **A Abordagem Híbrida:** A banca frequentemente questionará como a segurança é provida em protocolos como o TLS/HTTPS. É fundamental entender que não se usa a criptografia assimétrica para cifrar todos os dados da comunicação (devido à sua lentidão), mas sim para o estabelecimento seguro da chave de sessão simétrica.
> > * **Aplicação de Simétrica vs. Assimétrica:** A regra geral a ser lembrada é: **Criptografia simétrica para cifrar DADOS**. **Criptografia assimétrica para gerenciar CHAVES e ASSINATURAS**.
> > * **Gerenciamento de Chaves:** Em um cenário de proteção de dados em repouso, a banca pode focar no desafio do gerenciamento das chaves. Afirmar que "basta criptografar os dados com AES para garantir a segurança" está **INCOMPLETO**. A forma como a chave AES é armazenada, protegida e rotacionada é igualmente crítica para a segurança geral do sistema.
