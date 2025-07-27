# Classe: A

# Conteúdo: Relacionais: Conceitos Básicos do Modelo Relacional

## 1\. Conceitos Básicos do Modelo Relacional

> **TEORIA-ALVO**
>
> O Modelo Relacional, proposto por Edgar F. Codd, organiza os dados em um conjunto de tabelas ou relações. A estrutura é baseada na teoria matemática dos conjuntos e na lógica de predicados de primeira ordem.
>
>   * **Terminologia Formal:**
>       * **Relação:** Uma tabela bidimensional composta por linhas e colunas.
>       * **Tupla:** Uma linha (ou registro) de uma relação, representando uma instância de uma entidade ou de um relacionamento.
>       * **Atributo:** Uma coluna de uma relação, que representa uma propriedade ou característica da entidade.
>       * **Domínio:** O conjunto de valores atômicos e permitidos para um atributo. Define o tipo de dado e possíveis restrições.
>   * **Chaves (Keys):** Conjuntos de um ou mais atributos utilizados para identificar unicamente as tuplas em uma relação ou para estabelecer relacionamentos.
>       * **Superchave:** Um ou mais atributos que, tomados coletivamente, permitem identificar de forma única uma tupla em uma relação.
>       * **Chave Candidata:** Uma superchave mínima, ou seja, da qual nenhum atributo pode ser removido sem que se perca a propriedade de identificação única. Uma relação pode ter múltiplas chaves candidatas.
>       * **Chave Primária (PK - *Primary Key*):** A chave candidata que é escolhida pelo projetista do banco de dados para ser o identificador principal da relação. Por definição, não pode conter valores nulos (restrição de entidade).
>       * **Chave Estrangeira (FK - *Foreign Key*):** Um conjunto de atributos em uma relação que faz referência à chave primária de outra relação (ou da mesma relação). É o mecanismo que implementa os relacionamentos entre tabelas.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Terminologia Formal vs. Informal:** A banca frequentemente utiliza a terminologia formal (Relação, Tupla, Atributo) em suas questões. É mandatório que o candidato conheça a correspondência com os termos informais (Tabela, Linha/Registro, Coluna).
> >   * **Chave Candidata vs. Chave Primária:** Todo banco de dados relacional deve ter, para cada tabela, uma e apenas uma chave primária. Contudo, uma tabela pode possuir várias chaves candidatas. A chave primária é a candidata que foi **escolhida** para ser o identificador principal. A banca pode afirmar que uma tabela pode ter mais de uma chave primária. **ERRADO**.
> >   * **Chave Estrangeira Nula:** Uma chave estrangeira **pode** aceitar valores nulos, a menos que uma restrição `NOT NULL` seja explicitamente definida sobre ela. Isso representa, por exemplo, um funcionário que não está alocado a nenhum departamento.

-----

# Classe: A

# Conteúdo: SQL (Structured Query Language)

## 2\. SQL - Linguagem de Consulta Estruturada

> **TEORIA-ALVO**
>
> `SQL` é a linguagem padrão para a definição, manipulação e controle de bancos de dados relacionais. É uma linguagem declarativa, onde o usuário especifica "o que" deseja, e não "como" obter. A `SQL` é dividida em subconjuntos de comandos.
>
>   * **`DML` (Linguagem de Manipulação de Dados):** Usada para consultar e modificar os dados.
>       * **`SELECT`:** Recupera dados das tabelas. Suas cláusulas principais, na ordem de execução lógica, são: `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `SELECT`, `ORDER BY`.
>       * **`INSERT`:** Adiciona novas tuplas (linhas) a uma tabela.
>       * **`UPDATE`:** Modifica os valores de atributos em tuplas existentes.
>       * **`DELETE`:** Remove tuplas de uma tabela.
>   * **`DDL` (Linguagem de Definição de Dados):** Usada para definir e gerenciar a estrutura do banco de dados (o esquema).
>       * **`CREATE`:** Cria objetos no banco de dados, como `TABLE`, `VIEW`, `INDEX`.
>       * **`ALTER`:** Modifica a estrutura de um objeto existente.
>       * **`DROP`:** Remove permanentemente um objeto do banco de dados.
>   * **`DCL` (Linguagem de Controle de Dados):** Usada para gerenciar permissões de acesso aos dados.
>       * **`GRANT`:** Concede privilégios (e.g., `SELECT`, `INSERT`) a um usuário ou papel.
>       * **`REVOKE`:** Remove privilégios previamente concedidos.
>   * **`DTL` ou `TCL` (Linguagem de Transação de Dados):** Usada para gerenciar transações.
>       * **`COMMIT`:** Torna permanentes todas as modificações da transação.
>       * **`ROLLBACK`:** Desfaz todas as modificações da transação.
>       * **`SAVEPOINT`:** Define um ponto de retorno dentro de uma transação.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **`WHERE` vs. `HAVING`:** Esta é uma pegadinha clássica. A cláusula **`WHERE`** filtra **linhas individuais** *antes* de qualquer agrupamento. A cláusula **`HAVING`** filtra **grupos de linhas** *após* o agrupamento realizado pelo `GROUP BY`. `HAVING` é usada com funções de agregação (`COUNT()`, `SUM()`, `AVG()`), enquanto `WHERE` não pode conter tais funções.
> >   * **Tipos de `JOIN`:** A diferença entre `INNER JOIN` e `OUTER JOIN` (`LEFT`, `RIGHT`, `FULL`) é crucial. **`INNER JOIN`** retorna apenas as linhas que possuem correspondência em ambas as tabelas. **`LEFT JOIN`** retorna todas as linhas da tabela da esquerda, mais as correspondências da direita (ou `NULL` se não houver). A banca fornecerá dois conjuntos de dados e pedirá o resultado de um `JOIN` específico.
> >   * **`DROP` vs. `TRUNCATE` vs. `DELETE`:** A banca vai explorar a confusão entre esses comandos. **`DELETE`** (`DML`) remove linhas, pode ser seletivo (`WHERE`) e é uma operação transacional (pode ser desfeita com `ROLLBACK`). **`TRUNCATE TABLE`** (`DDL`) remove *todas* as linhas de uma tabela de forma muito mais rápida, geralmente não pode ser desfeita e não aciona *triggers* de `DELETE`. **`DROP TABLE`** (`DDL`) remove a tabela inteira, incluindo sua estrutura e dados.

-----

# Classe: B

# Conteúdo: Integridade e Proteção

## 3\. Integridade e Controle de Proteção

> **TEORIA-ALVO**
>
> A integridade do banco de dados refere-se à manutenção da correção, consistência e precisão dos dados ao longo do tempo. É garantida por um conjunto de restrições (*constraints*). O controle de proteção refere-se à segurança e ao gerenciamento de acesso.
>
>   * **Restrições de Integridade:**
>       * **Integridade de Domínio:** Garante que os valores de um atributo estejam em conformidade com seu domínio definido. Implementada por meio da definição de tipos de dados, `CHECK` (e.g., `salario > 0`) e `NOT NULL`.
>       * **Integridade de Entidade:** Garante que cada tupla de uma relação seja unicamente identificável. Implementada pela **Chave Primária**, que, por definição, não pode conter valores `NULL`.
>       * **Integridade Referencial:** Garante a consistência entre tuplas de duas relações. Implementada pela **Chave Estrangeira**. Um valor de FK deve corresponder a um valor de PK existente na tabela referenciada, ou ser `NULL`.
>           * **Ações Referenciais:** Definem o comportamento do SGBD quando um registro pai é alterado ou deletado. Principais ações: `CASCADE` (propaga a operação para os registros filhos), `SET NULL` (define a FK dos filhos como nula), `RESTRICT`/`NO ACTION` (impede a operação no pai se houver filhos).
>   * **Controle de Proteção (Segurança):**
>       * **Autenticação:** Processo de verificação da identidade de um usuário.
>       * **Autorização:** Processo de conceder permissões (privilégios) a usuários autenticados sobre objetos do banco de dados. É implementado via comandos `DCL` (`GRANT` e `REVOKE`).

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Ações de Integridade Referencial:** A banca vai apresentar um cenário como "o que acontece com os pedidos de um cliente se o registro desse cliente for deletado?" e a resposta dependerá da ação `ON DELETE` definida na chave estrangeira da tabela de pedidos (`CASCADE` apagaria os pedidos, `SET NULL` anularia a referência, `RESTRICT` impediria a exclusão do cliente).
> >   * **`NOT NULL` e Chaves:** Uma chave primária é implicitamente `NOT NULL`. Uma chave estrangeira pode ser `NULL`, a menos que especificado o contrário.
> >   * **Diferença entre DML e DCL:** A banca pode classificar `GRANT` como um comando DML. **ERRADO**. `GRANT` é DCL, pois lida com controle de acesso, não com a manipulação dos dados em si.

-----

# Classe: B

# Conteúdo: Controle de Transação, Concorrência e Bloqueio

## 4\. Controle de Transação, Concorrência e Bloqueio

> **TEORIA-ALVO**
>
> Um SGBD deve garantir a execução confiável de transações, mesmo com múltiplos usuários acessando os dados simultaneamente (concorrência).
>
>   * **Transação:** Uma unidade lógica de trabalho, composta por uma ou mais operações de banco de dados, que deve ser executada de forma completa e indivisível.
>   * **Propriedades `ACID`:** Garantem a confiabilidade das transações.
>       * **Atomicidade:** A transação é "tudo ou nada". Ou todas as suas operações são executadas com sucesso (`COMMIT`), ou nenhuma delas é (`ROLLBACK`).
>       * **Consistência:** A transação leva o banco de dados de um estado válido para outro estado válido, preservando as restrições de integridade.
>       * **Isolamento:** As transações concorrentes não devem interferir umas nas outras. O efeito de transações executadas simultaneamente deve ser o mesmo que se elas fossem executadas sequencialmente.
>       * **Durabilidade:** Uma vez que uma transação é comitada, suas alterações são permanentes e sobrevivem a falhas do sistema.
>   * **Fenômenos da Concorrência (Anomalias):** Ocorrem quando o isolamento não é perfeito.
>       * **Leitura Suja (*Dirty Read*):** Uma transação lê dados modificados por outra transação ainda não comitada.
>       * **Leitura Não Repetível (*Non-repeatable Read*):** Uma transação lê o mesmo dado duas vezes e obtém valores diferentes, pois outra transação alterou o dado entre as leituras.
>       * **Leitura Fantasma (*Phantom Read*):** Uma transação reexecuta uma consulta e obtém um conjunto diferente de linhas, pois outra transação inseriu novas linhas que satisfazem a condição da consulta.
>   * **Bloqueio (*Locking*):** O mecanismo mais comum para controlar a concorrência e garantir o isolamento.
>       * **Bloqueio Compartilhado (S - *Shared*):** Permite que múltiplas transações leiam o mesmo item de dados, mas nenhuma o modifique.
>       * **Bloqueio Exclusivo (X - *eXclusive*):** Permite que apenas uma transação leia e modifique o item de dados.

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **Diferença entre as Anomalias:** A banca vai descrever um cenário e pedir para identificar o fenômeno. A chave para diferenciar **Leitura Não Repetível** de **Leitura Fantasma** é que a primeira envolve a **alteração** de uma linha existente que já havia sido lida, enquanto a segunda envolve a **aparição de novas linhas** que não existiam na primeira leitura.
> >   * **Propriedades `ACID`:** A banca pode confundir as definições. **Atomicidade** é sobre o "tudo ou nada". **Isolamento** é sobre a invisibilidade entre transações concorrentes. **Durabilidade** é sobre a persistência após o `COMMIT`.
> >   * **Compatibilidade de Bloqueios:** Múltiplas transações podem obter um bloqueio **compartilhado (S)** sobre o mesmo item simultaneamente. No entanto, se uma transação possui um bloqueio **exclusivo (X)**, nenhuma outra transação pode obter qualquer tipo de bloqueio (nem S, nem X) sobre aquele item.

-----

# Classe: B

# Conteúdo: SGBD Oracle e PL/SQL

## 5\. Administração, SGBD Oracle e PL/SQL

> **TEORIA-ALVO**
>
> O SGBD Oracle é um dos sistemas gerenciadores de banco de dados relacionais-objeto mais robustos e utilizados no ambiente corporativo. A administração de um SGBD (tarefa do DBA) envolve um conjunto amplo de atividades. O PL/SQL é a linguagem procedural da Oracle.
>
>   * **Administração de Banco de Dados (DBA):**
>       * **Atividades:** Instalação e configuração do SGBD; criação e gerenciamento de bancos de dados; gerenciamento de armazenamento; monitoramento de desempenho e otimização de consultas (*tuning*); planejamento e execução de rotinas de *backup* e *restore*; gerenciamento de usuários e segurança.
>   * **SGBD Oracle:**
>       * **Arquitetura:** Composta por uma **instância** (processos em memória e processos em segundo plano) e um **banco de dados** (arquivos físicos em disco, como *datafiles*, *control files* e *redo log files*).
>   * **`PL/SQL` (Procedural Language/SQL):**
>       * **Definição:** É a extensão procedural da Oracle para a linguagem SQL, que permite a criação de lógica de programação complexa diretamente no banco de dados. Com ele, é possível criar blocos anônimos, *procedures*, *functions*, *packages* e *triggers*.
>       * **Estrutura de Bloco:** Um bloco PL/SQL é estruturado da seguinte forma:
>         ```sql
>         DECLARE
>             -- Seção opcional para declaração de variáveis, cursores, etc.
>         BEGIN
>             -- Seção obrigatória com os comandos executáveis (SQL e PL/SQL).
>         EXCEPTION
>             -- Seção opcional para tratamento de erros.
>         END;
>         ```

> **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
>
> >   * **`PL/SQL` como Linguagem:** O PL/SQL permite o uso de estruturas de controle (IF-THEN-ELSE, laços FOR e WHILE), variáveis e tratamento de exceções, integrando-se nativamente com comandos SQL DML e de transação.
> >   * **Estrutura do Bloco `PL/SQL`:** A banca pode apresentar um bloco PL/SQL e questionar sobre suas seções. A seção `DECLARE` e `EXCEPTION` são **opcionais**. A seção `BEGIN...END;` é **obrigatória**.
> >   * **Backup e Restore:** Um tópico comum de administração é a diferença entre os tipos de backup. **Backup Completo (*Full*):** Copia todos os dados. **Backup Incremental:** Copia apenas os dados alterados desde o *último backup* (seja ele completo ou incremental). **Backup Diferencial:** Copia os dados alterados desde o *último backup completo*.