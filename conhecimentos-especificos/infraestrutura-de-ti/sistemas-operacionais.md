### Olá, futuro(a) aprovado(a)! Vamos abrir as caixas de ferramentas dos Sistemas Operacionais para você construir sua aprovação no Cebraspe.

Pense nos sistemas operacionais como duas caixas de ferramentas diferentes: **GNU/Linux** é a caixa de ferramentas do artesão, totalmente customizável e poderosa. **MS Windows** é a caixa de ferramentas de uma grande marca, super integrada e com uma interface amigável.

---

### ### GNU/Linux: A Caixa de Ferramentas do Artesão

A principal forma de usar essa caixa é através da linha de comando (o *shell*), usando ferramentas precisas.

* **Comandos Essenciais:**
    * `ls`: Sua **lanterna** para ver o que tem dentro de um diretório.
    * `cd`: A ferramenta para **mudar** de um compartimento (diretório) para outro.
    * `mv`: Ferramenta para **mover** ou **renomear** uma peça.
    * `rm`: A **marreta** para remover uma peça. Cuidado com o `rm -rf`, que é a marreta atômica!
    * `grep`: A **lupa** para procurar por um texto específico dentro de um manual.

* **O Sistema de Permissões (Os 3 Cadeados):**
    Cada ferramenta e cada gaveta (arquivo e diretório) tem 3 cadeados: um para o **Dono (u)**, um para o seu **Grupo (g)** de trabalho, e um para **Outros (o)**. Cada cadeado tem 3 posições (permissões):

    | Permissão | Símbolo | Valor (Octal) | O que permite? |
    | :--- | :-: | :-: | :--- |
    | **Leitura** | `r` | **4** | **Olhar** o conteúdo da gaveta (arquivo) ou **listar** as ferramentas nela. |
    | **Escrita** | `w` | **2** | **Colocar ou tirar** ferramentas da gaveta (arquivo). |
    | **Execução** | `x` | **1** | **Usar** a ferramenta (se for uma furadeira) ou **entrar** na sala (diretório). |

    A permissão `rwxr-xr--` é a soma dos valores: `(4+2+1)(4+0+1)(4+0+0)` = **754**.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * **Permissões em Diretórios:** A banca vai te testar nisso! Para **entrar** em uma sala (diretório) com `cd`, você precisa da permissão de **execução (`x`)**. Para **listar** o que tem dentro com `ls`, precisa de **leitura (`r`)**.
> > * **Notação Octal:** É obrigatório saber converter de `rwx` para octal e vice-versa. `777` é liberação geral. `700` é acesso exclusivo do dono.
> > * **Samba:** É o serviço que faz o Linux "falar a língua" do Windows para compartilhar arquivos. Ele usa o protocolo **SMB**, não o NFS, para essa finalidade.

---

### ### MS Windows: A Caixa de Ferramentas da Grande Marca

O Windows tem seu próprio sistema de organização e segurança, o NTFS.

* **Permissões NTFS (Cadeados Granulares):**
    O sistema de cadeados é mais complexo. Você pode dar permissões super específicas como "Controle Total", "Modificar", "Apenas Leitura", etc.
    * **Herança:** Se uma gaveta tem um cadeado, qualquer nova ferramenta que você colocar nela "herda" o mesmo cadeado automaticamente.
    * **A Regra de Ouro da Precedência:** **NEGAR SEMPRE VENCE!** Se um usuário tem duas permissões para a mesma pasta, uma que **Permite** e outra que **Nega**, a permissão final será **Negar**.

* **PowerShell (A Ferramenta Multifuncional a Laser):**
    É o sucessor moderno do antigo `cmd.exe`. Sua grande diferença é que ele é **orientado a objetos**.
    * **O que isso significa?** O `cmd` te entrega um relatório em texto sobre as ferramentas. O PowerShell te entrega as **ferramentas reais** na mão, com todas as suas propriedades. Você pode pegar a "furadeira" (objeto) que um comando te deu e passar direto para outro comando que "liga a furadeira na tomada". O nome dos comandos segue o padrão `Verbo-Substantivo` (ex: `Get-Service`, `Stop-Process`).

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * **NEGAR > PERMITIR:** A banca vai criar um cenário com um usuário em dois grupos com permissões conflitantes. Lembre-se, a permissão de **Negar** sempre terá precedência.
> > * **PowerShell é Orientado a Objetos:** A banca vai dizer que a única vantagem do PowerShell é ter comandos com nomes diferentes. **ERRADO!** A principal vantagem é sua capacidade de manipular **objetos** em vez de texto, o que o torna infinitamente mais poderoso para automação.

---

### ### MS Active Directory: O Organograma e o Sistema de Crachás da Empresa

O Active Directory (AD) é o cérebro que gerencia a identidade e o acesso em toda a rede de uma empresa.

* **Estrutura Lógica (O Organograma):**
    * **Floresta:** A corporação inteira.
    * **Domínio:** Uma grande filial (ex: "Empresa Brasil").
    * **Unidade Organizacional (UO):** Os departamentos dentro da filial (RH, TI, Vendas). **UOs servem para organizar e aplicar regras (GPOs)**.

* **Estrutura Física (A Planta dos Prédios):**
    * **Controlador de Domínio (DC):** O servidor principal da filial, que guarda uma cópia da lista de todos os funcionários.
    * **Site:** Um prédio físico da empresa em uma cidade. Serve para otimizar a comunicação na rede.

* **Políticas de Grupo (GPO - As Regras da Empresa):**
    É o mecanismo para aplicar configurações de forma centralizada. "Todos os computadores do departamento de Vendas terão o site do CRM como página inicial".
    * **Ordem de Aplicação (LSDOU):** As regras são aplicadas nesta ordem: **L**ocal → **S**ite → **D**omínio → **U**nidade **O**rganizacional. A última regra aplicada é a que vale em caso de conflito. **A regra mais próxima do funcionário sempre vence**.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * **UO vs. Grupo:** **Grupos** servem para dar **permissões**. **UOs** servem para **organizar e aplicar GPOs**. Você não aplica uma GPO a um grupo, mas sim a uma UO.
> > * **LSDOU:** A banca vai criar um cenário com regras conflitantes no Domínio e na UO. A regra da **UO** (a mais específica, mais próxima) vai prevalecer.

---

### ### Serviços de Rede Windows: As Salas Especiais da Empresa

* **IIS (Internet Information Services):** É a **sala do servidor que hospeda o site** público da empresa.
* **RDS (Remote Desktop Services):** É a tecnologia que permite que os funcionários **trabalhem de casa**, acessando remotamente o computador do escritório como se estivessem sentados na frente dele.

> #### Foco Cebraspe (Pontos de Atenção e "Pegadinhas")
> > * **Application Pools (IIS):** É um mecanismo de isolamento. Cada site hospedado no IIS pode rodar em sua "piscina de aplicações" separada. Se um site travar, ele não derruba os outros.
> > * **RDS vs. Área de Trabalho Remota:** **RDS** é a infraestrutura no servidor que permite múltiplas conexões. A **Área de Trabalho Remota** é o "clientinho" que você usa para se conectar.

### ### Mapa Mental: Precedência de GPOs no Active Directory (LSDOU)

```mermaid
%%{init: {"theme": "tokyo-midnight", "themeVariables": { "fontFamily": "lexend"}}}%%
graph TD
    A["Regra da Unidade Organizacional (UO)<br>Ex: 'Proibir USB no TI'"]
    B["Regra do Domínio<br>Ex: 'Papel de parede da Empresa'"]
    C["Regra do Site<br>Ex: 'Configurar impressora da filial'"]
    D["Regra Local<br>Ex: 'Tela de descanso em 5 min'"]
    
    subgraph "Hierarquia AD"
        direction TB
        B --> A
        C --> B
        D --> C
    end

    E["💻<br>Computador do<br>Departamento de TI"]

    A -- "Aplica por último<br>(<b>VENCE!</b>)" --> E
    B -- "Aplica antes" --> E
    C -- "Aplica antes" --> E
    D -- "Aplica primeiro" --> E
````


### **Classe:** B
### **Conteúdo:** Sistemas Operacionais: GNU/Linux

---

### **1. GNU/Linux: Comandos Shell e Permissões**

> #### **TEORIA-ALVO**
> GNU/Linux é um sistema operacional do tipo Unix, cujo núcleo (kernel) é o Linux. A interação primária se dá por meio de um interpretador de comandos (*shell*), como o Bash. O sistema de arquivos é hierárquico e o controle de acesso é baseado em um modelo de permissões.
>
> * **Comandos Essenciais do Shell:**
>     * **Navegação e Listagem:** `pwd` (imprime o diretório atual), `cd` (muda de diretório), `ls` (lista o conteúdo de um diretório).
>     * **Manipulação de Arquivos/Diretórios:** `touch` (cria um arquivo vazio ou atualiza sua data), `cp` (copia), `mv` (move ou renomeia), `rm` (remove), `mkdir` (cria um diretório).
>     * **Busca e Filtragem:** `grep` (busca por padrões em texto), `find` (localiza arquivos/diretórios com base em critérios).
>     * **Gerenciamento de Processos:** `ps` (lista os processos em execução), `kill` (envia um sinal para um processo, geralmente para terminá-lo).
> * **Modelo de Permissões:**
>     * **Estrutura:** Cada arquivo e diretório possui um conjunto de 9 bits de permissão, divididos em três classes de usuários:
>         1.  **Dono (*User*):** O proprietário do arquivo.
>         2.  **Grupo (*Group*):** O grupo ao qual o arquivo pertence.
>         3.  **Outros (*Others*):** Todos os outros usuários.
>     * **Permissões:** Para cada classe, existem três permissões básicas:
>         * **`r` (Leitura - *read*):** Valor octal **4**. Permite ler o conteúdo do arquivo ou listar o conteúdo de um diretório.
>         * **`w` (Escrita - *write*):** Valor octal **2**. Permite modificar o arquivo ou criar/remover arquivos dentro de um diretório.
>         * **`x` (Execução - *execute*):** Valor octal **1**. Permite executar o arquivo (se for um script/programa) ou entrar no diretório (`cd`).
>     * **Comando `chmod`:** Utilizado para modificar as permissões. Pode usar notação simbólica (`u+x`) ou **octal** (`chmod 755 arquivo.sh`).

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Permissões em Diretórios:** A banca frequentemente testa o significado das permissões em diretórios. A permissão de **execução (`x`)** em um diretório é necessária para **acessá-lo** (e.g., com `cd`). A permissão de **leitura (`r`)** é necessária para **listar** seu conteúdo (e.g., com `ls`). A permissão de **escrita (`w`)** é necessária para **criar ou remover** arquivos dentro dele.
> > * **Notação Octal:** O conhecimento da representação octal é mandatório. A banca fornecerá uma permissão simbólica (e.g., `rwxr-xr--`) e solicitará o código octal correspondente (`754`), ou vice-versa.
> > * **Comando `rm -rf`:** A combinação das opções `-r` (recursivo) e `-f` (forçar, sem pedir confirmação) no comando `rm` é extremamente poderosa e perigosa, capaz de apagar diretórios inteiros de forma irreversível.
> > * **Samba:** É o serviço que implementa o protocolo **SMB/CIFS** em sistemas Linux, permitindo o compartilhamento de arquivos e impressoras de forma interoperável com clientes Microsoft Windows. É incorreto afirmar que o Samba utiliza o protocolo NFS para essa finalidade.

---

### **Classe:** B
### **Conteúdo:** MS Windows Server e Desktop

---

### **2. MS Windows: Gerenciamento, Permissões e PowerShell**

> #### **TEORIA-ALVO**
> Os sistemas operacionais Microsoft Windows (versões Server e Desktop) utilizam o sistema de arquivos **NTFS (New Technology File System)**, que possui um modelo de permissões granular e uma suíte robusta de ferramentas de administração.
>
> * **Controle de Usuários e Grupos Locais:** O gerenciamento de acesso inicia-se com contas de usuário e grupos locais, administrados através do console de Gerenciamento do Computador.
> * **Permissões NTFS:** São aplicadas a arquivos e pastas, controlando o nível de acesso de usuários e grupos.
>     * **Permissões Básicas:** Incluem Controle Total (*Full Control*), Modificar (*Modify*), Ler e Executar (*Read & Execute*), Listar Conteúdo da Pasta (*List Folder Contents*), Ler (*Read*) e Gravar (*Write*).
>     * **Herança:** Por padrão, um objeto (arquivo/pasta) herda as permissões de seu objeto pai (a pasta que o contém). Permissões explícitas (definidas diretamente no objeto) têm precedência sobre as herdadas.
>     * **Precedência de Permissões:** A regra fundamental é que as permissões de **Negar (*Deny*)** sempre se sobrepõem às permissões de **Permitir (*Allow*)**.
> * **Windows PowerShell:**
>     * **Definição:** Um *shell* de linha de comando e uma linguagem de *scripting* para automação de tarefas, baseado na plataforma .NET. É orientado a objetos.
>     * **Orientação a Objetos:** Diferentemente de *shells* tradicionais que manipulam texto, o PowerShell manipula **objetos .NET**. A saída de um comando (`cmdlet`) é um objeto, cujas propriedades podem ser inspecionadas e passadas via *pipeline* (`|`) para outro `cmdlet`.
>     * **Cmdlets:** Comandos que seguem um padrão de nomenclatura `Verbo-Substantivo` (e.g., `Get-Process`, `Stop-Service`, `New-Item`).
> * **Windows Defender Firewall:** É um *firewall* de host do tipo *stateful*, que filtra o tráfego de rede de entrada e saída com base em um conjunto de regras. Opera com base em perfis de rede (Domínio, Privado, Público), aplicando políticas de segurança diferentes para cada um.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Precedência de Permissões NTFS:** Este é o ponto mais crítico. A banca criará um cenário onde um usuário pertence a um Grupo A (com permissão de Modificar) e a um Grupo B (com permissão de Negar Gravação) sobre a mesma pasta. A permissão efetiva será a negação, pois **Negar se sobrepõe a Permitir**.
> > * **PowerShell vs. CMD:** A principal diferença a ser testada é a **orientação a objetos** do PowerShell. A capacidade de manipular objetos em vez de texto puro o torna significativamente mais poderoso para *scripting* e automação do que o `cmd.exe` legado.
> > * **Perfis de Firewall:** O candidato deve saber que o Windows aplica regras de firewall diferentes dependendo de como a rede é classificada (Pública, Privada ou de Domínio), sendo o perfil Público o mais restritivo por padrão.

---

### **Classe:** B
### **Conteúdo:** MS Active Directory

---

### **3. MS Active Directory: Estrutura e Gerenciamento**

> #### **TEORIA-ALVO**
> O **Active Directory Domain Services (AD DS)** é o serviço de diretório da Microsoft, que fornece gerenciamento centralizado de identidade e acesso em um ambiente de rede Windows.
>
> * **Estrutura Lógica vs. Física:**
>     * **Estrutura Lógica:** Como os objetos são organizados.
>         * **Floresta (*Forest*):** O contêiner de mais alto nível. Representa o limite de segurança da organização.
>         * **Árvore (*Tree*):** Uma ou mais domínios com um espaço de nomes DNS contíguo.
>         * **Domínio (*Domain*):** A unidade central de administração, replicação e segurança.
>         * **Unidade Organizacional (UO ou OU):** Um contêiner dentro de um domínio, usado para organizar objetos (usuários, grupos, computadores) e para delegar permissões administrativas e aplicar Políticas de Grupo.
>     * **Estrutura Física:** Como a comunicação e a replicação ocorrem.
>         * **Controlador de Domínio (DC):** Um servidor que hospeda uma cópia gravável do banco de dados do Active Directory (`NTDS.DIT`).
>         * **Site:** Representa a topologia física da rede (e.g., uma localidade geográfica definida por uma ou mais sub-redes IP). Sites são usados para otimizar o tráfego de replicação e a localização de serviços.
> * **Protocolo de Acesso:** O principal protocolo utilizado para consultar e modificar o Active Directory é o **LDAP (Lightweight Directory Access Protocol)**.
> * **Políticas de Grupo (GPO - Group Policy Object):**
>     * **Definição:** São o principal mecanismo para o gerenciamento centralizado de configurações de usuários e computadores em um ambiente AD. Uma GPO é um objeto virtual que contém um conjunto de políticas.
>     * **Aplicação e Precedência (LSDOU):** As GPOs são aplicadas em uma ordem hierárquica específica:
>         1.  **L**ocal (política da máquina local)
>         2.  **S**ite
>         3.  **D**omínio
>         4.  **U**nidade **O**rganizacional (OUs aninhadas, da mais alta para a mais baixa)
>     * A última política aplicada tem precedência em caso de conflito.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **UO vs. Contêiner vs. Grupo:** A banca vai confundir esses conceitos. **Grupos** são usados para agrupar objetos para fins de atribuição de permissões. **UOs** são contêineres usados para **organizar objetos, delegar administração e aplicar GPOs**. Contêineres padrão (como o contêiner "Users") não podem ter GPOs aplicadas diretamente a eles, ao contrário das UOs.
> > * **Estrutura Física vs. Lógica:** A estrutura lógica (domínios, UOs) é independente da estrutura física (sites). Uma UO pode conter usuários de diferentes localidades físicas. Um site pode conter computadores de diferentes domínios. O propósito dos sites é controlar a **replicação** e a **autenticação**.
> > * **Ordem de Aplicação de GPO (LSDOU):** A ordem de aplicação e precedência é um tópico clássico. A banca apresentará um cenário com GPOs conflitantes em diferentes níveis (e.g., uma política no nível do Domínio e outra na UO) e perguntará qual configuração prevalecerá no computador ou usuário. A regra é: **a mais próxima do objeto vence**.

---

### **Classe:** C
### **Conteúdo:** Serviços de Rede Windows

---

### **4. Serviços de Rede Windows (IIS, RDS)**

> #### **TEORIA-ALVO**
> O Windows Server oferece uma gama de serviços integrados para fornecer funcionalidades de rede.
>
> * **IIS (Internet Information Services):**
>     * **Definição:** É o servidor web extensível da Microsoft, integrado ao Windows Server. É utilizado para hospedar sites, serviços e aplicações web.
>     * **Protocolos:** Suporta nativamente os protocolos HTTP, HTTPS, FTP, FTPS, SMTP e NNTP.
>     * **Arquitetura:** Sua arquitetura modular permite a adição ou remoção de funcionalidades conforme a necessidade. O modelo de processo utiliza *Application Pools* (grupos de aplicações) para isolar aplicações web umas das outras, aumentando a confiabilidade e a segurança.
> * **RDS (Remote Desktop Services):**
>     * **Definição:** Anteriormente conhecido como *Terminal Services*, o RDS é uma plataforma da Microsoft para fornecer acesso remoto a desktops baseados em sessão, desktops virtuais (VDI) ou aplicações remotas (*RemoteApp*).
>     * **Objetivo:** Centralizar o gerenciamento de aplicações e desktops, permitindo que os usuários acessem seus ambientes de trabalho a partir de qualquer local ou dispositivo.
>     * **Área de Trabalho Remota (*Remote Desktop*):** É a funcionalidade cliente, implementada pelo protocolo RDP (Remote Desktop Protocol), que permite a um usuário se conectar e controlar um computador remoto que esteja executando o serviço.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **IIS vs. Apache:** A banca pode comparar o IIS com seu principal concorrente no mercado de servidores web, o Apache HTTP Server. O **IIS** é a solução nativa do ecossistema Microsoft, com forte integração com o Active Directory e a plataforma .NET. O **Apache** é de código aberto e tradicionalmente a plataforma dominante em servidores Linux.
> > * **Application Pools no IIS:** O conceito de *Application Pool* é fundamental para o isolamento de aplicações no IIS. Cada *pool* roda em seu próprio processo de trabalho (`w3wp.exe`), de modo que uma falha em uma aplicação não afete as outras que estão em *pools* diferentes.
> > * **RDS vs. Área de Trabalho Remota:** **RDS** é a **infraestrutura do lado do servidor**, um conjunto de funções (*roles*) que precisam ser instaladas e configuradas. A **Área de Trabalho Remota** é a **funcionalidade do lado do cliente** (ou a conexão 1-para-1 em sistemas desktop) que utiliza o protocolo RDP para se conectar ao servidor RDS ou a outro computador.
