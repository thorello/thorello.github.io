# Classe: A
# Conteúdo: Ataques a Redes: Negação de Serviço (DoS/DDoS)

## 1. Negação de Serviço (DoS/DDoS)

> **TEORIA-ALVO**
>
> Um ataque de **Negação de Serviço (DoS - *Denial of Service*)** tem como objetivo tornar um recurso de computação, como um servidor web ou uma rede, indisponível para seus usuários legítimos, sem, contudo, invadir ou roubar informações do sistema.
>
> * **DoS (Denial of Service):** O ataque é originado a partir de uma **única fonte**.
> * **DDoS (Distributed Denial of Service):** É uma variante mais poderosa e complexa, na qual o ataque é lançado simultaneamente a partir de **múltiplas fontes distribuídas geograficamente**. Essas fontes são, tipicamente, computadores comprometidos (chamados de "zumbis" ou "bots") que formam uma rede controlada pelo atacante, conhecida como **botnet**.
> * **Categorias de Ataques:**
>     1.  **Ataques de Volume:** Visam consumir toda a largura de banda da rede do alvo, inundando-o com um volume massivo de tráfego. Exemplo: UDP Flood, ICMP Flood.
>     2.  **Ataques de Protocolo:** Consomem os recursos dos servidores ou de equipamentos de rede intermediários, explorando vulnerabilidades nos protocolos de comunicação. Exemplo: **SYN Flood**, que explora o processo de *three-way handshake* do TCP, deixando conexões semiabertas.
>     3.  **Ataques à Camada de Aplicação:** Direcionados a uma aplicação específica, enviando requisições que parecem legítimas, mas que são projetadas para consumir recursos do servidor (CPU, memória) de forma intensiva. Exemplo: HTTP Flood.
> * **Impacto Principal:** Violação do princípio da **Disponibilidade**.
> * **Contramedidas:** Implementação de *firewalls* e Sistemas de Prevenção de Intrusão (IPS), limitação de taxa (*rate limiting*), e contratação de serviços especializados de mitigação anti-DDoS, que utilizam *scrubbing centers* para filtrar o tráfego malicioso.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **DoS vs. DDoS:** A principal diferença a ser testada é a **origem** do ataque. **DoS** = uma fonte. **DDoS** = múltiplas fontes. Essa característica torna os ataques DDoS significativamente mais difíceis de mitigar, pois é complexo diferenciar o tráfego de ataque distribuído do tráfego legítimo.
> > * **Objetivo do Ataque:** A banca pode afirmar que um ataque DDoS visa roubar dados. **ERRADO**. O objetivo primordial é **esgotar os recursos** do alvo (seja largura de banda, capacidade de processamento do firewall, conexões do servidor) para torná-lo inacessível.
> > * **SYN Flood:** Este é um exemplo clássico de ataque de protocolo. O atacante envia um grande número de pacotes TCP `SYN` (primeira etapa do *handshake*), mas nunca responde aos pacotes `SYN-ACK` do servidor, deixando um grande número de conexões em estado semiaberto e consumindo os recursos da tabela de conexões do servidor.

---
# Classe: A
# Conteúdo: Ataques de Força Bruta e Varredura de Portas

## 2. Força Bruta e Varredura de Portas

> **TEORIA-ALVO**
>
> **Ataque de Força Bruta (*Brute Force*):**
> * **Definição:** Um método de ataque criptoanalítico que consiste em tentar sistematicamente todas as combinações possíveis de senhas ou chaves até que a correta seja encontrada.
> * **Variações:** Um **Ataque de Dicionário** é uma forma otimizada que tenta apenas senhas de uma lista predefinida de palavras comuns, frases e senhas vazadas.
> * **Impacto Principal:** Violação da **Confidencialidade** e da **Autenticidade**, ao permitir o acesso não autorizado a contas e sistemas.
> * **Contramedidas:**
>     * Implementação de políticas de senha forte (exigindo comprimento, complexidade e rotação).
>     * Mecanismos de bloqueio de conta após um número limitado de tentativas de login malsucedidas.
>     * Uso de CAPTCHA para diferenciar humanos de bots.
>     * A contramedida mais eficaz é a **Autenticação Multifator (MFA)**.
>
> **Varredura de Portas (*Port Scanning*):**
> * **Definição:** Uma técnica de **reconhecimento** utilizada para sondar um servidor ou host em busca de portas abertas. O objetivo é identificar quais serviços e aplicações estão em execução no alvo, a fim de encontrar potenciais vetores de ataque.
> * **Técnicas Comuns:**
>     * **TCP Connect Scan:** Tenta estabelecer uma conexão TCP completa. É confiável, mas facilmente detectável nos logs do alvo.
>     * **TCP SYN Scan (ou *Half-open Scan*):** Envia um pacote `SYN`. Se um `SYN-ACK` for recebido, a porta está aberta. O atacante não completa o *handshake*, tornando a varredura mais furtiva (*stealth*).
> * **Ferramenta Padrão:** Nmap é a ferramenta mais conhecida e utilizada para realizar varreduras de portas.
> * **Contramedidas:** Configuração de *firewalls* para descartar pacotes destinados a portas fechadas, e uso de Sistemas de Detecção de Intrusão (IDS) para identificar padrões de varredura.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **MFA como Defesa contra Força Bruta:** A MFA é a mitigação mais robusta, pois mesmo que o atacante consiga adivinhar a senha (o primeiro fator), ele ainda será barrado pela exigência do segundo fator (e.g., um token).
> > * **Varredura de Portas como Fase de Reconhecimento:** A varredura de portas não é um ataque que explora uma vulnerabilidade em si. É uma etapa **preparatória** de um ataque, pertencente à fase de **reconhecimento**, onde o atacante coleta informações sobre a superfície de ataque do alvo.
> > * **Furtividade do SYN Scan:** A banca pode questionar por que o SYN Scan é considerado mais furtivo que o Connect Scan. A razão é que, ao não completar o *three-way handshake* do TCP, a tentativa de conexão muitas vezes não é registrada pelos logs das aplicações que estão escutando na porta, apenas por firewalls ou IDS mais avançados.

---
# Classe: A
# Conteúdo: Ataques de Decepção, Falsificação e Interceptação

## 3. Decepção, Falsificação e Interceptação

> **TEORIA-ALVO**
>
> Esta categoria de ataques explora a confiança e utiliza técnicas de engano, falsificação de identidade ou interceptação de comunicação para comprometer a segurança.
>
> * **Phishing:**
>     * **Definição:** Um ataque de **engenharia social**, geralmente distribuído por e-mail, que visa enganar a vítima para que ela revele informações sensíveis (como credenciais de acesso, dados de cartão de crédito) ou para que execute um código malicioso. O ataque se baseia na criação de mensagens e páginas web falsas que se passam por entidades legítimas e confiáveis (e.g., um banco, uma rede social).
>     * **Spear Phishing:** Uma variante direcionada, na qual o ataque é personalizado para um indivíduo ou organização específica, aumentando sua credibilidade e chance de sucesso.
> * **Eavesdropping (Interceptação Passiva):**
>     * **Definição:** O ato de "escutar" ou monitorar secretamente a comunicação entre duas partes em uma rede para obter informações. É um ataque passivo que viola a **confidencialidade**.
>     * **Cenário Comum:** Ocorre em redes inseguras, como redes Wi-Fi públicas e abertas.
>     * **Contramedida Principal:** **Criptografia**. O uso de protocolos como TLS (resultando em HTTPS) e VPNs torna os dados interceptados ilegíveis para o atacante.
> * **DNS Spoofing (Envenenamento de Cache DNS):**
>     * **Definição:** Um ataque no qual dados falsos são introduzidos no cache de um servidor DNS, fazendo com que o servidor retorne um endereço IP incorreto (malicioso) para um nome de domínio legítimo.
>     * **Objetivo:** Redirecionar usuários para sites falsos (e.g., sites de *phishing*) sem seu conhecimento, mesmo que eles tenham digitado a URL correta no navegador.
>     * **Contramedida Principal:** **DNSSEC (Domain Name System Security Extensions)**, que utiliza assinaturas digitais para garantir a autenticidade e a integridade das respostas DNS.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> > * **Phishing como Engenharia Social:** É fundamental entender que o vetor de ataque do *phishing* é a **manipulação psicológica do usuário**, e não necessariamente uma falha técnica no sistema.
> > * **Eavesdropping e Criptografia:** A defesa mais eficaz contra a interceptação passiva é a criptografia em trânsito. A banca pode afirmar que um *firewall* impede o *eavesdropping*. **INCORRETO**. Um *firewall* controla o acesso, mas não protege o conteúdo do tráfego permitido.
> > * **DNS Spoofing vs. Phishing:** Ambos os ataques podem levar a vítima a um site falso, mas os mecanismos são diferentes. No **Phishing**, a vítima é tipicamente enganada para clicar em um link malicioso. No **DNS Spoofing**, a vítima digita a URL correta, mas a infraestrutura de rede (o servidor DNS comprometido) a redireciona para o endereço IP errado.