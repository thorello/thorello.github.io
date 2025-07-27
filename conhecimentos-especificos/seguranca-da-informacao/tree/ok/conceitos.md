# Classe: A
# Conteúdo: Conceitos: Confidencialidade

## 1. Confidencialidade

> **TEORIA-ALVO**
>
> A **Confidencialidade** é o princípio da Segurança da Informação que visa garantir que a informação seja acessível somente por entidades (pessoas, processos ou sistemas) devidamente autorizadas. Trata-se da proteção da informação contra a divulgação não autorizada.
>
> * **Objetivo:** Prevenir o acesso não autorizado a dados sensíveis, tanto em trânsito (durante a comunicação em rede) quanto em repouso (quando armazenados em discos ou outras mídias).
> * **Mecanismos de Controle:**
>     * **Criptografia:** Principal mecanismo técnico para assegurar a confidencialidade. Transforma a informação legível (texto claro) em um formato ilegível (texto cifrado), que só pode ser revertido com o uso de uma chave criptográfica correta. Aplica-se tanto a dados em repouso quanto em trânsito.
>     * **Controle de Acesso:** Implementação de políticas e mecanismos que restringem o acesso a recursos com base na identidade do solicitante. Exemplos incluem Listas de Controle de Acesso (ACLs), senhas, tokens e biometria.
>     * **Classificação da Informação:** Processo de categorizar a informação com base em seu nível de sensibilidade (e.g., pública, interna, confidencial, secreta), o que permite a aplicação de controles de proteção proporcionais.
> * **Ataques que Violam a Confidencialidade:**
>     * Interceptação de dados (*sniffing* ou *eavesdropping*).
>     * Engenharia social.
>     * Acesso físico não autorizado a mídias de armazenamento.
>     * Roubo de credenciais de acesso.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Confidencialidade vs. Privacidade:** A banca pode tratar os termos como sinônimos. **INCORRETO**. A **privacidade** é um conceito mais amplo, relacionado ao direito de um indivíduo sobre a coleta, o uso e a divulgação de seus dados pessoais. A **confidencialidade** é uma das propriedades de segurança e um mecanismo técnico/processual utilizado para proteger a informação e, consequentemente, ajudar a garantir a privacidade.
> > * **Confidencialidade não Garante Integridade:** É possível manter a confidencialidade de uma informação, mas perder sua integridade. Exemplo: um atacante pode interceptar um arquivo criptografado e corrompê-lo (alterar os bits do texto cifrado) sem conseguir decifrá-lo. A confidencialidade foi mantida, mas a integridade foi violada.
> > * **Criptografia como Ferramenta Central:** A criptografia é o controle técnico mais diretamente associado à garantia da confidencialidade. A banca frequentemente associará o uso de algoritmos criptográficos, como AES ou RSA, à proteção da confidencialidade da informação.

---
# Classe: A
# Conteúdo: Integridade

## 2. Integridade

> **TEORIA-ALVO**
>
> A **Integridade** é o princípio que visa salvaguardar a exatidão, a completeza e a consistência da informação e dos métodos de seu processamento. Garante que a informação não foi modificada de forma não autorizada ou acidental.
>
> * **Objetivo:** Proteger os dados contra alterações, inserções ou deleções indevidas, assegurando que a informação mantida ou transmitida é a mesma que a original.
> * **Mecanismos de Controle:**
>     * **Funções de Hash (ou Resumo):** Algoritmos (e.g., SHA-256, MD5) que geram uma saída de tamanho fixo e única (o *hash*) para uma determinada entrada. Qualquer alteração, por menor que seja, na entrada, produzirá um *hash* completamente diferente. São usadas para verificar se um arquivo ou mensagem foi alterado.
>     * **Códigos de Autenticação de Mensagem (MACs/HMACs):** Funções de hash que utilizam uma chave secreta compartilhada para gerar o resumo, garantindo não apenas a integridade, mas também a autenticidade da origem da mensagem.
>     * **Assinaturas Digitais:** Mecanismo que utiliza criptografia de chave assimétrica para garantir integridade, autenticidade e não repúdio.
>     * **Controle de Versão:** Sistemas que rastreiam e gerenciam as alterações em arquivos ao longo do tempo.
> * **Ataques que Violam a Integridade:**
>     * Alteração de dados em trânsito (ataque *man-in-the-middle*).
>     * Modificação não autorizada de registros em um banco de dados.
>     * Vírus de computador que corrompem ou alteram arquivos.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Integridade vs. Confidencialidade:** Esta é a principal fonte de confusão. Se a informação foi **acessada/lida** sem autorização, a **confidencialidade** foi violada. Se a informação foi **modificada/alterada** sem autorização, a **integridade** foi violada. A banca apresentará cenários para que o candidato identifique o princípio afetado.
> > * **Funções de Hash não proveem Confidencialidade:** Uma função de hash é uma via de mão única (não reversível) e serve para verificar a integridade, não para ocultar a informação. É incorreto afirmar que o uso de um algoritmo como o SHA-256 torna uma mensagem confidencial. **ERRADO**.
> > * **Exatidão e Completeza:** Integridade não se refere apenas à proteção contra modificações maliciosas, mas também à garantia de que a informação está completa e é uma representação exata da realidade que se propõe a descrever.

---
# Classe: A
# Conteúdo: Disponibilidade

## 3. Disponibilidade

> **TEORIA-ALVO**
>
> A **Disponibilidade** é o princípio que assegura que os sistemas de informação e os dados estejam acessíveis e utilizáveis sob demanda por uma entidade autorizada, sempre que necessário.
>
> * **Objetivo:** Garantir a continuidade da operação dos serviços de TI e o acesso ininterrupto à informação, prevenindo interrupções não planejadas.
> * **Mecanismos de Controle:**
>     * **Redundância:** Implementação de componentes duplicados para assumir a função em caso de falha do componente principal. Exemplos: RAID para discos, fontes de alimentação redundantes, múltiplos links de internet.
>     * **Alta Disponibilidade (*High Availability*):** Utilização de *clusters* e sistemas de *failover* que transferem automaticamente a operação para um sistema secundário em caso de falha do primário.
>     * **Planos de Continuidade de Negócios (PCN) e de Recuperação de Desastres (PRD):** Processos e planos para responder a incidentes graves e restaurar as operações de negócio em um tempo aceitável.
>     * **Backup e Restauração:** Criação de cópias de segurança dos dados para permitir sua recuperação em caso de perda ou corrupção.
> * **Ataques que Violam a Disponibilidade:**
>     * Ataques de Negação de Serviço (DoS) e Negação de Serviço Distribuída (DDoS), que visam sobrecarregar um sistema até torná-lo inacessível.
>     * Ransomware, que criptografa os dados e os torna indisponíveis até o pagamento de um resgate.
>     * Sabotagem física ou destruição de equipamentos.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Ameaças Abrangentes:** A banca pode limitar as ameaças à disponibilidade apenas a ataques cibernéticos como o DDoS. **INCORRETO**. Ameaças à disponibilidade incluem também falhas de hardware, bugs de software, erros humanos, desastres naturais e falta de energia.
> > * **Redundância como Conceito Chave:** A maioria dos mecanismos técnicos para garantir a disponibilidade se baseia no princípio da **redundância**. A banca pode apresentar um cenário e questionar sobre a tecnologia adequada para aumentar a disponibilidade, cuja resposta frequentemente envolverá alguma forma de redundância.
> > * **Disponibilidade vs. Desempenho:** Embora relacionados, não são a mesma coisa. Um sistema pode estar disponível, mas com um desempenho tão degradado que se torna praticamente inutilizável. A análise da disponibilidade geralmente envolve métricas como o tempo médio entre falhas (MTBF) e o tempo médio para reparo (MTTR).

---
# Classe: A
# Conteúdo: Autenticidade

## 4. Autenticidade

> **TEORIA-ALVO**
>
> A **Autenticidade** é o princípio que garante a veracidade da identidade de uma entidade (seja um usuário, um sistema ou a origem de uma informação), assegurando que ela é quem alega ser.
>
> * **Objetivo:** Provar a identidade de uma parte em uma comunicação ou de um usuário acessando um sistema, prevenindo a falsificação de identidade (*spoofing*).
> * **Mecanismos de Controle:**
>     * **Fatores de Autenticação:** Os mecanismos para provar a identidade são classificados em três tipos:
>         1.  **Algo que você sabe:** Senhas, frases secretas, PINs.
>         2.  **Algo que você tem:** Tokens de segurança (hard ou soft tokens), cartões inteligentes, chaves de segurança (e.g., YubiKey).
>         3.  **Algo que você é:** Biometria (impressão digital, reconhecimento facial, íris).
>     * **Autenticação Multifator (MFA):** Método que exige a apresentação de dois ou mais fatores de autenticação de **tipos diferentes** para verificar a identidade do usuário, aumentando significativamente a segurança.
>     * **Certificados Digitais e Assinaturas Digitais:** Utilizados para garantir a autenticidade da origem de uma mensagem ou de um site.
> * **Ataques que Violam a Autenticidade:**
>     * *Phishing* e *Spear Phishing*.
>     * Falsificação de identidade (*IP spoofing*, *email spoofing*).
>     * Ataques de força bruta e de dicionário para adivinhar senhas.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Autenticação vs. Autorização:** Esta é a confusão mais comum e um alvo certo para questões. **Autenticação** é o processo de verificar a identidade ("Quem é você?"). **Autorização** é o processo de conceder ou negar permissões a uma identidade já autenticada ("O que você tem permissão para fazer?"). A autenticação **sempre** precede a autorização.
> > * **MFA (Autenticação Multifator):** É incorreto afirmar que o uso de duas senhas diferentes constitui MFA. **ERRADO**. A MFA requer o uso de fatores de **tipos diferentes** (e.g., uma senha (algo que sei) e um token (algo que tenho)). Usar duas senhas é um exemplo de autenticação de múltiplos passos, mas de fator único.
> > * **Autenticidade da Informação vs. do Usuário:** A autenticidade pode se referir tanto à identidade de um usuário tentando acessar um sistema quanto à garantia de que uma informação provém de uma fonte legítima e não foi forjada.

---
# Classe: A
# Conteúdo: Não Repúdio (Irretratabilidade)

## 5. Não Repúdio (Irretratabilidade)

> **TEORIA-ALVO**
>
> O **Não Repúdio**, também conhecido como **Irretratabilidade**, é o princípio que impede que uma entidade negue a autoria de uma ação ou transação que tenha realizado anteriormente. Ele fornece provas que vinculam inegavelmente uma ação a uma origem específica.
>
> * **Objetivo:** Criar evidências auditáveis e legalmente válidas sobre a autoria e a integridade de uma transação ou comunicação, de forma que o remetente não possa repudiar (negar) o envio, e o destinatário não possa repudiar o recebimento.
> * **Tipos:**
>     * **Não Repúdio na Origem:** Prova que a mensagem foi enviada pela entidade que se alega ser o remetente.
>     * **Não Repúdio no Destino:** Prova que a mensagem foi recebida pelo destinatário.
> * **Mecanismo de Controle Principal:**
>     * **Assinatura Digital:** É o mecanismo técnico fundamental para prover não repúdio na origem. Ao assinar digitalmente uma mensagem, o remetente utiliza sua **chave privada**, criando um vínculo criptográfico único entre sua identidade e a mensagem.
>         * Uma assinatura digital válida garante simultaneamente:
>             1.  **Autenticidade:** Prova quem é o autor da mensagem.
>             2.  **Integridade:** Prova que a mensagem não foi alterada após a assinatura.
>             3.  **Não Repúdio:** Impede que o autor negue ter assinado a mensagem.
> * **Ataques que o Não Repúdio Mitiga:**
>     * Falsa negação de ter enviado um e-mail ou autorizado uma transação financeira.
>     * Disputas sobre a autoria de um contrato ou documento eletrônico.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Relação com Outros Princípios:** O não repúdio não é um princípio isolado. Ele é construído sobre a garantia da **autenticidade** e da **integridade**. Para que uma ação seja irrefutável, é preciso provar com certeza quem a executou (autenticidade) e que a prova dessa ação não foi adulterada (integridade).
> > * **Mecanismo da Assinatura Digital:** A banca vai testar o funcionamento da assinatura digital. A pegadinha clássica é afirmar que a assinatura é criada com a chave pública. **ERRADO**. A assinatura digital é criada com a **chave PRIVADA** do remetente e é verificada com a **chave PÚBLICA** correspondente.
> > * **Não Repúdio vs. Confidencialidade:** O uso de assinatura digital por si só **não** garante a confidencialidade da mensagem. A assinatura é aplicada sobre o texto claro (ou sobre seu hash). Para obter confidencialidade, a mensagem precisa ser adicionalmente criptografada com a chave pública do destinatário.