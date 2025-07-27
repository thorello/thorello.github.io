# Classe: A
# Conteúdo: Tecnologias de Segurança: Firewalls

## 1. Firewalls

> **TEORIA-ALVO**
>
> Um **Firewall** é um dispositivo de segurança de rede, implementado em hardware ou software, que monitora e controla o tráfego de rede de entrada e saída com base em um conjunto predefinido de regras de segurança. Atua como uma barreira entre uma rede interna confiável e uma rede externa não confiável, como a Internet.
>
> * **Gerações e Tipos de Firewalls:**
>     1.  **Filtragem de Pacotes (*Packet Filtering*):** Primeira geração, opera nas camadas 3 (Rede) e 4 (Transporte) do modelo OSI. As decisões de bloqueio ou permissão são baseadas em informações do cabeçalho dos pacotes, como endereços IP de origem e destino, e portas de origem e destino. É um firewall *stateless* (sem estado).
>     2.  **Firewall de Inspeção de Estado (*Stateful Inspection*):** Evolução da filtragem de pacotes. Mantém uma tabela de estado para rastrear o estado das conexões ativas (e.g., o *three-way handshake* do TCP). Permite o tráfego de retorno de uma conexão iniciada internamente sem a necessidade de uma regra explícita, tornando-o mais seguro e eficiente.
>     3.  **Proxy de Aplicação (ou *Application Gateway*):** Opera na Camada 7 (Aplicação). Atua como um intermediário para fluxos de dados de aplicações específicas (e.g., HTTP, FTP, SMTP). Ele entende o protocolo da aplicação e pode inspecionar o conteúdo do tráfego para tomar decisões mais granulares.
>     4.  **Firewall de Próxima Geração (NGFW - *Next-Generation Firewall*):** Um firewall moderno que integra as funcionalidades de um firewall *stateful* com outras capacidades de segurança, como:
>         * **Prevenção de Intrusão (IPS):** Capacidade de detectar e bloquear ataques.
>         * **Controle de Aplicação:** Identificar e controlar o uso de aplicações específicas (e.g., redes sociais, streaming), independentemente da porta utilizada.
>         * **Inspeção Profunda de Pacotes (DPI - *Deep Packet Inspection*):** Análise do conteúdo dos pacotes, não apenas dos cabeçalhos.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Stateless vs. Stateful:** Esta é a distinção mais importante. Um firewall de **filtragem de pacotes (stateless)** analisa cada pacote de forma isolada e não tem memória de conexões anteriores. Um firewall **stateful** monitora o estado das conexões, o que lhe permite tomar decisões mais inteligentes e seguras (e.g., permitir automaticamente um pacote de resposta que faz parte de uma conexão já estabelecida).
> > * **Camada de Operação:** A banca frequentemente testa o conhecimento sobre a camada do modelo OSI em que cada tipo de firewall opera. **Filtragem de Pacotes/Stateful -> Camadas 3 e 4**. **Proxy de Aplicação/NGFW -> Camada 7**.
> > * **Limitações do Firewall:** É incorreto afirmar que um firewall protege contra todos os tipos de ameaças. Um firewall tradicional não inspeciona, por padrão, o conteúdo de tráfego **criptografado** (como HTTPS) e não protege contra ataques que exploram vulnerabilidades em uma aplicação web permitida, nem contra ameaças internas ou malware introduzido por mídias removíveis.

---
# Classe: A
# Conteúdo: IDS (Intrusion Detection System) e IPS (Intrusion Prevention System)

## 2. IDS e IPS

> **TEORIA-ALVO**
>
> IDS e IPS são sistemas projetados para detectar e, no caso do IPS, responder a atividades maliciosas ou violações de políticas de segurança na rede ou em um host.
>
> * **IDS (Intrusion Detection System - Sistema de Detecção de Intrusão):**
>     * **Função:** Monitora o tráfego de rede (NIDS) ou a atividade de um host (HIDS) em busca de assinaturas de ataques conhecidos ou desvios de comportamento. Sua função é **passiva**: ele **detecta** a atividade suspeita e gera um **alerta** (log) para um administrador.
>     * **Posicionamento:** Opera de forma "fora da banda" (*out-of-band*). Ele recebe uma cópia do tráfego de rede (e.g., de uma porta espelhada de um switch) e o analisa sem estar no caminho direto da comunicação.
> * **IPS (Intrusion Prevention System - Sistema de Prevenção de Intrusão):**
>     * **Função:** É uma evolução do IDS. Além de detectar a atividade maliciosa, ele possui a capacidade de tomar uma **ação ativa** para **prevenir** o ataque.
>     * **Ações:** Pode descartar pacotes maliciosos, bloquear o tráfego do endereço IP de origem, ou resetar a conexão.
>     * **Posicionamento:** Opera de forma "em linha" (*in-line*), ou seja, todo o tráfego de rede passa diretamente através do dispositivo IPS, permitindo que ele bloqueie o tráfego em tempo real.
> * **Métodos de Detecção (comuns a ambos):**
>     * **Baseado em Assinaturas:** Compara o tráfego com um banco de dados de padrões (assinaturas) de ataques conhecidos. É eficaz contra ameaças conhecidas, mas ineficaz contra ataques de dia-zero.
>     * **Baseado em Anomalias:** Cria uma linha de base (*baseline*) do comportamento normal da rede e alerta sobre qualquer desvio significativo desse padrão. Pode detectar ataques novos, mas é mais suscetível a gerar falsos positivos.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **IDS vs. IPS: Ação é a Chave:** A principal diferença a ser testada é a capacidade de resposta. **IDS = Detecta e Alerta (Passivo)**. **IPS = Detecta e Bloqueia (Ativo)**. A banca afirmará que um IDS pode bloquear tráfego de rede. **ERRADO**.
> > * **Posicionamento na Rede (*In-line* vs. *Out-of-band*):** A capacidade de um IPS de bloquear ataques depende de seu posicionamento **em linha**, no caminho do tráfego. Um IDS, por operar de forma passiva sobre uma cópia do tráfego, não pode bloquear nada.
> > * **Falsos Positivos e Falsos Negativos:** Um **falso positivo** ocorre quando o sistema alerta sobre uma ameaça que não existe, o que, em um IPS, pode levar ao bloqueio de tráfego legítimo e causar uma negação de serviço. Um **falso negativo** ocorre quando o sistema falha em detectar um ataque real.
> > * **Firewall vs. IPS:** Um firewall tradicional toma decisões com base em portas e endereços. Um IPS analisa o **conteúdo** e o **comportamento** do tráfego para detectar atividades maliciosas, mesmo que em portas permitidas pelo firewall. Um NGFW geralmente integra as funcionalidades de ambos.

---
# Classe: A
# Conteúdo: Assinatura Digital

## 3. Assinatura Digital

> **TEORIA-ALVO**
>
> A **Assinatura Digital** é um mecanismo criptográfico que utiliza criptografia de chave assimétrica para prover garantias de segurança sobre uma mensagem ou documento digital. Ela não visa a confidencialidade do documento, mas sim a verificação de sua origem e de sua integridade.
>
> * **Princípios de Segurança Atendidos:**
>     1.  **Autenticidade:** Garante a identidade do remetente, provando que o documento foi assinado por quem se alega ser o autor.
>     2.  **Integridade:** Garante que o documento não foi alterado desde que foi assinado. Qualquer modificação no documento invalidaria a assinatura.
>     3.  **Não Repúdio (ou Irretratabilidade):** Impede que o autor da assinatura negue sua autoria, pois somente ele possui a chave privada necessária para gerá-la.
> * **Processo de Criação (Realizado pelo Remetente):**
>     1.  Aplica-se uma **função de hash** sobre o documento original, gerando um resumo (*digest*) de tamanho fixo.
>     2.  O remetente **cifra o hash** resultante utilizando sua **chave privada**. O resultado deste processo é a assinatura digital.
>     3.  A assinatura digital é enviada juntamente com o documento original (em texto claro).
> * **Processo de Verificação (Realizado pelo Destinatário):**
>     1.  O destinatário recebe o documento e a assinatura.
>     2.  Ele **decifra a assinatura** utilizando a **chave pública** do remetente, obtendo o hash original (hash A).
>     3.  Ele calcula um novo hash a partir do documento recebido (hash B).
>     4.  Ele compara o hash A com o hash B. Se forem idênticos, a assinatura é válida, provando a autenticidade e a integridade.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Uso das Chaves Criptográficas:** Este é o ponto mais explorado em questões. A banca vai inverter a lógica. É mandatório saber que a assinatura digital é **CRIADA com a chave PRIVADA** do signatário e **VERIFICADA com a chave PÚBLICA** do signatário.
> > * **Assinatura Digital vs. Criptografia para Confidencialidade:** É um erro comum afirmar que a assinatura digital torna a mensagem secreta. **ERRADO**. A assinatura digital **não garante confidencialidade**, pois a mensagem original não é cifrada. Para obter confidencialidade, a mensagem teria que ser adicionalmente cifrada com a chave pública do destinatário.
> > * **Papel da Função de Hash:** O processo de assinatura não é aplicado sobre o documento inteiro (o que seria computacionalmente inviável para documentos grandes), mas sim sobre o seu **hash**. A função de hash garante que qualquer alteração no documento original gere um hash diferente, o que é essencial para a verificação da integridade.

---
# Classe: B
# Conteúdo: Antivírus e Antispam

## 4. Antivírus e Antispam

> **TEORIA-ALVO**
>
> Antivírus e Antispam são tecnologias de segurança focadas na proteção contra ameaças específicas, como software malicioso e e-mails indesejados.
>
> * **Antivírus:**
>     * **Definição:** Um software projetado para detectar, prevenir e remover software malicioso (*malware*), categoria que inclui vírus, *worms*, *trojans*, *spyware*, *adware* e *ransomware*.
>     * **Métodos de Detecção:**
>         * **Baseado em Assinaturas:** O método tradicional. O antivírus mantém um banco de dados de assinaturas (padrões de código) de malwares conhecidos. É eficaz contra ameaças já catalogadas, mas inútil contra malwares novos (ataques de dia-zero).
>         * **Baseado em Heurística/Comportamento:** Analisa o comportamento de um programa em execução para identificar ações suspeitas ou maliciosas (e.g., modificar arquivos de sistema, tentar se replicar). Pode detectar ameaças novas, mas é mais propenso a gerar **falsos positivos**.
>     * **Soluções Modernas (NGAV/EDR):** Antivírus de Próxima Geração (NGAV) e Detecção e Resposta de Endpoint (EDR) combinam múltiplas técnicas, incluindo inteligência artificial e análise comportamental, para uma proteção mais robusta.
> * **Antispam:**
>     * **Definição:** Uma solução de software ou serviço que filtra mensagens de e-mail para identificar e bloquear e-mails não solicitados e em massa (*spam*).
>     * **Técnicas de Filtragem:**
>         * **Análise de Reputação:** Verifica o endereço IP do servidor de e-mail remetente contra listas de reputação (RBLs - *Real-time Blackhole Lists*).
>         * **Listas Brancas e Negras:** Permite ou bloqueia e-mails de remetentes específicos.
>         * **Análise de Conteúdo:** Busca por palavras-chave e características comuns em e-mails de spam.
>         * **Filtros Bayesianos:** Um filtro estatístico que "aprende" a distinguir spam de e-mails legítimos com base em e-mails previamente classificados pelo usuário.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Detecção por Assinaturas vs. Heurística:** A banca vai testar a compreensão dos trade-offs. A detecção por **assinaturas** é precisa para malwares **conhecidos**, mas cega para os **novos**. A detecção por **heurística** pode identificar malwares **novos**, mas com maior risco de **falsos positivos** (bloquear um programa legítimo por engano).
> > * **Antivírus não é Infalível:** É incorreto afirmar que ter um antivírus atualizado garante 100% de proteção contra malware. **ERRADO**. Ameaças de dia-zero e técnicas avançadas de evasão podem contornar as defesas do antivírus. Ele é uma camada de defesa necessária, mas não suficiente.
> > * **Local de Atuação:** As soluções de antivírus operam no **endpoint** (o computador do usuário ou servidor). As soluções de antispam podem operar tanto no **gateway de e-mail** (servidor, protegendo toda a organização) quanto no **cliente de e-mail** do usuário.