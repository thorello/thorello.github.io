### **Classe:** C
### **Conteúdo:** Big Data: Noções Fundamentais

---

### **1. Noções de Big Data**

> #### **TEORIA-ALVO**
> **Big Data** refere-se a conjuntos de dados cujo volume, velocidade de geração e variedade excedem a capacidade das tecnologias de banco de dados e ferramentas de software tradicionais para capturar, gerenciar e processar em um tempo razoável. Não é definido apenas pelo tamanho, mas por um conjunto de características conhecidas como os "Vs" do Big Data.
>
> * **Os "Vs" do Big Data:**
>     * **Volume:** Refere-se à magnitude ou à quantidade de dados gerados e armazenados. A escala é tipicamente medida em terabytes, petabytes e além.
>     * **Velocidade:** Refere-se à taxa com que os dados são gerados, transmitidos e precisam ser processados. Abrange desde o processamento em lotes (*batch*) até o processamento em tempo real (*streaming*).
>     * **Variedade:** Refere-se à heterogeneidade dos tipos e fontes de dados. Classifica-se em:
>         * **Estruturados:** Dados com um modelo de dados rígido e bem definido (e.g., tabelas em bancos de dados relacionais).
>         * **Semiestruturados:** Dados que não se conformam a um modelo de dados formal, mas contêm tags ou marcadores para separar elementos semânticos (e.g., JSON, XML).
>         * **Não Estruturados:** Dados que não possuem um modelo de dados predefinido ou organização (e.g., texto livre, imagens, vídeos, áudio, dados de sensores).
>     * **Veracidade:** Refere-se à qualidade, confiabilidade e precisão dos dados. Em ambientes de Big Data, lidar com a incerteza e a inconsistência dos dados é um desafio central.
>     * **Valor:** Refere-se à capacidade de extrair informações úteis e valor de negócio a partir dos grandes volumes de dados. É o objetivo final de qualquer iniciativa de Big Data.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Definição de Big Data:** A banca pode afirmar que o termo Big Data se refere unicamente ao grande volume de dados. **ERRADO**. A definição de Big Data é multidimensional, sendo a **Variedade** e a **Velocidade** características igualmente importantes. A capacidade de processar dados não estruturados em tempo real é um diferencial chave.
> > * **Interpretação dos "Vs":** A banca pode confundir as definições. "A característica 'Velocidade' se refere à rapidez com que as consultas são executadas no banco de dados." **ERRADO**. A velocidade em Big Data se refere à taxa de **geração e ingestão** dos dados. A velocidade das consultas é uma consequência das tecnologias utilizadas para processar esses dados.
> > * **Tecnologias Associadas:** O ecossistema **Apache Hadoop** (com seus componentes HDFS para armazenamento distribuído e MapReduce para processamento paralelo) é a tecnologia pioneira e fundamental associada ao surgimento do Big Data. Mais recentemente, ferramentas como o **Apache Spark** tornaram-se o padrão para processamento em larga escala.

---

### **Classe:** C
### **Conteúdo:** Data Lake

---

### **2. Data Lake**

> #### **TEORIA-ALVO**
> Um **Data Lake** (Lago de Dados) é um repositório de armazenamento centralizado, projetado para armazenar, processar e proteger grandes volumes de dados **estruturados, semiestruturados e não estruturados em seu formato nativo e bruto (*raw*)**. Diferentemente de um Data Warehouse, ele não exige que os dados sejam transformados e estruturados antes de serem armazenados.
>
> * **Arquitetura e Princípios:**
>     * **Armazenamento de Dados Brutos:** A principal característica é a ingestão de dados em seu estado original, sem transformação prévia. Isso permite que os dados sejam preservados na sua forma mais pura para futuras análises que podem ainda não ter sido previstas.
>     * **Schema-on-Read:** A estrutura (esquema) dos dados não é definida no momento da escrita/ingestão (*Schema-on-Write*), como em um Data Warehouse. Em vez disso, o esquema é aplicado no momento da leitura/análise, quando a consulta é executada. Isso confere grande flexibilidade para lidar com novos tipos de dados.
>     * **ETL vs. ELT:** O padrão de processamento associado a um Data Lake é o **ELT (Extract, Load, Transform)**. Os dados são extraídos das fontes e carregados (Load) diretamente no Data Lake. A transformação (Transform) ocorre posteriormente, sob demanda, quando os dados são preparados para uma análise específica.
>
> * **Data Lake vs. Data Warehouse:**
>     | Característica | Data Lake | Data Warehouse |
>     | :--- | :--- | :--- |
>     | **Dados** | Brutos, em formato nativo | Processados, transformados |
>     | **Esquema** | Schema-on-Read | Schema-on-Write |
>     | **Processo** | ELT (Extract, Load, Transform) | ETL (Extract, Transform, Load) |
>     | **Usuários** | Cientistas de Dados, Engenheiros de Dados | Analistas de Negócio, Gestores |
>     | **Agilidade** | Alta (fácil ingestão de novos dados) | Baixa (requer modelagem prévia) |

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Data Lake vs. Data Warehouse:** Esta é a principal distinção a ser testada. A banca frequentemente afirmará que "um Data Lake armazena apenas dados estruturados e processados". **ERRADO**. Essa é a característica de um Data Warehouse. A essência do Data Lake é armazenar dados **brutos** de **múltiplas variedades**.
> > * **Schema-on-Read vs. Schema-on-Write:** Este é o conceito técnico central que diferencia as duas abordagens. A banca vai inverter os conceitos, associando Schema-on-Read ao Data Warehouse. **ERRADO**. **DW = Schema-on-Write**. **Data Lake = Schema-on-Read**.
> > * **Risco do "Pântano de Dados" (*Data Swamp*):** A flexibilidade de um Data Lake é sua maior força e também seu maior risco. Sem uma governança de dados robusta, um catálogo de metadados e controle de qualidade, um Data Lake pode se tornar um **"pântano de dados"**, onde os dados são armazenados, mas se tornam inacessíveis, inutilizáveis e não confiáveis, perdendo todo o seu valor potencial. A banca pode questionar sobre esse risco.
