### **Classe:** A
### **Conteúdo:** ENGENHARIA DE SOFTWARE - Gerenciamento de processos de negócio - modelagem de processos

---

### **1. Conceitos Fundamentais e Estrutura da BPMN (Business Process Model and Notation)**

> #### **TEORIA-ALVO**
> BPMN é uma notação gráfica padronizada pela Object Management Group (OMG) para a modelagem de processos de negócio, servindo como uma linguagem comum para partes interessadas técnicas e de negócio. Sua estrutura é organizada em quatro categorias principais de elementos:
>
> *   **Objetos de Fluxo (Flow Objects):** Elementos que definem o comportamento do processo. São eles: **Eventos** (círculos), **Atividades** (retângulos de cantos arredondados) e **Gateways/Desvios** (losangos).
> *   **Objetos de Conexão (Connecting Objects):** Elementos que conectam os Objetos de Fluxo. São eles: **Fluxo de Sequência** (linha contínua), **Fluxo de Mensagem** (linha tracejada) e **Associação** (linha pontilhada).
> *   **Raias (Swimlanes):** Elementos que organizam e categorizam as atividades. São eles: **Pools** (piscinas) e **Lanes** (raias).
> *   **Artefatos (Artifacts):** Elementos que fornecem informações adicionais sobre o processo, sem afetar seu fluxo. São eles: **Objeto de Dados**, **Grupo** e **Anotação**.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > *   **Natureza da BPMN:** A banca frequentemente testa a finalidade da BPMN. BPMN **NÃO é uma metodologia** de gerenciamento de processos (como o ciclo PDCA ou o Seis Sigma), nem é, por si só, um motor de execução de processos (BPM-S). É estritamente uma **notação de modelagem**.
> > *   **Classificação dos Elementos:** Ponto crítico de cobrança. A banca apresentará um elemento e pedirá sua categoria. Ex.: "Um Pool é um Objeto de Fluxo." **ERRADO**. Um Pool é uma Swimlane. "Um Objeto de Dados afeta o fluxo do processo." **ERRADO**. É um Artefato e não se conecta a Fluxos de Sequência.
> > *   **Diferença entre Conectores:** A distinção entre os tipos de linhas é fundamental.
> >    *   **Fluxo de Sequência:** Indica a ordem de execução das atividades **DENTRO de um único Pool**. Não pode cruzar a fronteira de um Pool.
> >    *   **Fluxo de Mensagem:** Representa a comunicação **ENTRE Pools** (participantes) distintos. É o único conector que pode cruzar a fronteira de um Pool.
> >    *   **Associação:** Vincula um Artefato a um Objeto de Fluxo ou Conexão. Não indica direção de fluxo.

---

### **2. Atividades e Subprocessos**

> #### **TEORIA-ALVO**
> Uma **Atividade** representa um trabalho a ser executado no processo. A principal forma é a **Tarefa (Task)**. As tarefas podem ser de diversos tipos, indicando a natureza do trabalho (ex.: `User Task`, `Service Task`, `Script Task`). Um **Subprocesso** é uma atividade composta, que contém seu próprio fluxo de atividades, eventos e gateways.
>
> *   **Tipos de Tarefa:**
>    *   **User Task:** Executada por um humano com auxílio de uma aplicação de software.
>    *   **Service Task:** Executada por um serviço web ou aplicação automatizada.
>    *   **Script Task:** Executada por um motor de processo.
>    *   **Manual Task:** Executada por um humano sem auxílio de software.
> *   **Tipos de Subprocesso:**
>    *   **Embutido (Embedded):** Parte integral do processo pai, compartilhando seu contexto. Visualmente, não possui borda espessa.
>    *   **Reutilizável (Call Activity):** Invoca um processo globalmente definido e independente. Permite reuso. Visualmente, possui uma **borda espessa**.
>    *   **Baseado em Eventos:** Não possui um fluxo de sequência de entrada; é iniciado por um evento que ocorre durante a execução do processo pai.
>    *   **Transacional:** Agrupa atividades que devem ser tratadas como uma transação atômica (sucesso completo ou falha com reversão).

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > *   **Subprocesso Embutido vs. Reutilizável (Call Activity):** Essa distinção é altamente explorada. A banca afirmará que um subprocesso embutido pode ser invocado por outros processos. **ERRADO**. Apenas o `Call Activity` (reutilizável) tem essa característica. O marcador visual (borda espessa) é um detalhe crucial para questões com imagens.
> > *   **Natureza das Tarefas:** A banca descreverá um cenário e solicitará a correta classificação da tarefa. Ex.: "O processo de aprovação de crédito requer que um analista consulte um sistema legado e insira sua decisão em um formulário". Isso caracteriza uma `User Task`, e não uma `Manual Task` (pois envolve sistema) ou `Service Task` (pois envolve decisão humana).
> > *   **Subprocesso Ad-Hoc:** Um tipo especial onde as atividades contidas nele não possuem uma ordem predefinida de execução (sem fluxos de sequência). A banca pode descrevê-lo como um subprocesso "desestruturado" ou "flexível".

---

### **3. Eventos (Events)**

> #### **TEORIA-ALVO**
> Eventos representam algo que "acontece" durante um processo. São classificados pela **posição** (Início, Intermediário, Fim) e pelo **gatilho** (trigger).
>
> *   **Classificação por Posição:**
>    *   **Evento de Início (Start Event):** Linha simples. Indica onde um processo se inicia.
>    *   **Evento Intermediário (Intermediate Event):** Linha dupla. Ocorre durante o processo. Pode estar no fluxo normal ou anexado a uma atividade (evento de fronteira).
>    *   **Evento de Fim (End Event):** Linha espessa. Indica onde um caminho do processo termina.
> *   **Gatilhos Comuns:** `Timer` (tempo), `Message` (recebimento de mensagem), `Signal` (sinal broadcast), `Error` (ocorrência de um erro nomeado), `Escalation` (escalada de um problema para um nível superior), `Conditional` (condição se torna verdadeira).

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > *   **Evento de Fronteira (Boundary Event):** Ponto de altíssima incidência. É um evento intermediário anexado à borda de uma atividade.
> >    *   **Interrupção vs. Não Interrupção:** Se a borda do círculo for **sólida**, o evento **interrompe** a atividade à qual está anexo. Se a borda for **tracejada**, o evento **não interrompe** a atividade (cria um fluxo paralelo). A banca apresentará um diagrama e perguntará o comportamento do fluxo.
> > *   **Mensagem (Message) vs. Sinal (Signal):** Confusão clássica.
> >    *   **Mensagem:** Direcionada a **um único** destinatário específico (comunicação 1-para-1). Usada na comunicação entre Pools.
> >    *   **Sinal:** É um **broadcast** para múltiplos ouvintes (comunicação 1-para-muitos), sem um alvo específico. Pode ser usado dentro de um mesmo Pool ou entre Pools.
> > *   **Erro (Error) vs. Escalonamento (Escalation):**
> >    *   **Erro:** Indica uma falha crítica. O evento de fronteira de erro *sempre* interrompe a atividade e desvia o fluxo para uma rotina de tratamento de erro. O objetivo é terminar o subprocesso problemático.
> >    *   **Escalonamento:** Indica um problema que precisa ser comunicado a um nível superior do processo, mas **não necessariamente** termina a atividade original (pode ser não interruptivo).

---

### **4. Gateways / Desvios (Gateways)**

> #### **TEORIA-ALVO**
> Gateways controlam a divergência e a convergência do fluxo de sequência. Eles não representam trabalho, apenas decisões de roteamento.
>
> *   **Gateway Exclusivo (XOR - Exclusive):** Marcado com um "X" (opcional se não houver marcador). Apenas **um** caminho de saída é ativado. Na convergência, prossegue assim que um fluxo de entrada chega.
> *   **Gateway Paralelo (AND - Parallel):** Marcado com um "+". **Todos** os caminhos de saída são ativados simultaneamente. Na convergência, ele aguarda a chegada de **todos** os fluxos de entrada antes de prosseguir.
> *   **Gateway Inclusivo (OR - Inclusive):** Marcado com um "O". **Um ou mais** caminhos de saída são ativados, com base em condições que podem ser simultaneamente verdadeiras. Na convergência, ele aguarda a chegada de todos os fluxos que foram **efetivamente ativados** na divergência.
> *   **Gateway Baseado em Eventos:** Parece um gateway exclusivo com um evento intermediário dentro. O caminho é escolhido com base em **qual evento ocorre primeiro**.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > *   **Gateway Inclusivo vs. Exclusivo:** A principal fonte de erros. A banca descreverá uma situação: "O cliente pode escolher entre as opções de pagamento A, B ou C". Isso é **Exclusivo**. "O cliente pode adicionar os opcionais A, B e C ao seu pedido". Isso é **Inclusivo** (pode escolher A, B, A+B, etc.).
> > *   **Lógica de Convergência (Merge):** A banca testa o comportamento do "join".
> >    *   **Paralelo:** É o único que **sempre** sincroniza todos os ramos. Se um caminho nunca chega, o processo trava (deadlock).
> >    *   **Inclusivo:** É o mais complexo. Ele "sabe" quantos ramos foram ativados na sua contraparte de divergência e aguarda apenas por eles.
> > *   **Gateway sem Marcador:** Um losango vazio (sem marcador interno) é, por padrão, um **Gateway Exclusivo**. A banca pode omitir o "X" para testar esse conhecimento.
> > *   **Gateway vs. Atividade:** Afirmações como "O Gateway Exclusivo realiza a análise de crédito" são **ERRADAS**. O gateway não executa trabalho; ele apenas direciona o fluxo com base no resultado de uma atividade anterior (ex.: "Analisar Crédito").
