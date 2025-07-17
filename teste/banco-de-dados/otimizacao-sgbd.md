### **Classe:** C
### **Conteúdo:** Otimização SGBD: Detecção de Problemas

---

### **1. Detecção de Problemas e Conceitos de Otimização**

> #### **TEORIA-ALVO**
> A otimização de banco de dados, ou *tuning*, é o processo iterativo de identificar e resolver gargalos de desempenho em um Sistema Gerenciador de Banco de Dados (SGBD). A detecção de problemas é o primeiro passo e se baseia na análise de como o SGBD executa as consultas.
>
> * **Otimizador de Consultas (*Query Optimizer*):** Componente interno do SGBD responsável por analisar uma instrução SQL e escolher a estratégia de execução mais eficiente. Existem dois tipos principais:
>     * **Otimizador Baseado em Regras (RBO):** Abordagem legada que utiliza um conjunto fixo de regras heurísticas para escolher um plano.
>     * **Otimizador Baseado em Custo (CBO):** Abordagem moderna e padrão. O CBO gera múltiplos planos de execução possíveis e estima o "custo" de cada um (em termos de I/O, CPU, etc.), escolhendo o plano de menor custo estimado.
> * **Plano de Execução (*Execution Plan*):** É a saída do otimizador de consultas. Trata-se de uma "receita" detalhada que descreve a sequência de passos que o SGBD seguirá para executar uma consulta. A análise do plano de execução é a principal ferramenta para diagnosticar consultas lentas.
>     * **Operações Comuns em Planos de Execução:**
>         * **Full Table Scan (Varredura Completa da Tabela):** Leitura de todos os blocos de dados de uma tabela. É eficiente para tabelas pequenas ou consultas que retornam uma grande porcentagem das linhas, mas pode ser um grande gargalo para consultas seletivas em tabelas grandes.
>         * **Index Scan (Varredura de Índice):** Utilização de um índice para localizar rapidamente as linhas que satisfazem uma condição. É o método desejado para consultas altamente seletivas.
>         * **Join Operations (Operações de Junção):** Métodos para combinar dados de duas ou mais tabelas, como `Nested Loops`, `Hash Join` e `Sort Merge Join`.
> * **Estatísticas do Banco de Dados:** São metadados que descrevem os dados armazenados nas tabelas, como o número de linhas, a cardinalidade (número de valores distintos) de cada coluna e histogramas de distribuição de dados. O Otimizador Baseado em Custo (CBO) depende **criticamente** de estatísticas precisas e atualizadas para estimar os custos e escolher um bom plano de execução.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Otimizador e Estatísticas:** A banca pode afirmar que o otimizador sempre escolhe o melhor plano de execução possível. **ERRADO**. O otimizador baseado em custo depende das **estatísticas** disponíveis. Se as estatísticas estiverem desatualizadas ou ausentes, o otimizador pode fazer estimativas de custo incorretas e escolher um plano de execução subótimo.
> > * **Plano de Execução como Ferramenta de Diagnóstico:** O plano de execução não otimiza a consulta; ele **descreve como** a consulta será executada. É a **análise** desse plano que permite ao DBA ou desenvolvedor identificar problemas. A presença de um `Full Table Scan` em uma consulta que deveria usar um índice é um forte indicativo de problema.
> > * **CBO vs. RBO:** O CBO é mais inteligente e flexível que o RBO, mas sua eficácia está diretamente ligada à qualidade das estatísticas. A banca pode apresentar o RBO como uma abordagem mais moderna. **ERRADO**. É uma abordagem legada.

---

### **Classe:** C
### **Conteúdo:** Otimização de Consultas SQL

---

### **2. Otimização de Consultas SQL**

> #### **TEORIA-ALVO**
> A otimização de consultas SQL envolve a reescrita ou estruturação de instruções SQL para garantir que o otimizador de consultas do SGBD possa gerar um plano de execução eficiente. As técnicas focam em auxiliar o SGBD a utilizar seus recursos, especialmente os índices, da melhor forma.
>
> * **Uso Eficiente de Índices:**
>     * **Índices:** Estruturas de dados auxiliares que permitem a localização rápida de linhas em uma tabela com base nos valores de uma ou mais colunas, evitando a necessidade de uma varredura completa da tabela.
>     * **Seletividade:** Um índice é mais útil quando a coluna indexada tem alta seletividade (alta cardinalidade, ou seja, muitos valores distintos). Indexar uma coluna com poucos valores distintos (e.g., uma coluna "sexo" com 'M'/'F') geralmente não é eficiente.
> * **Condições "SARGable" (*Search Argument Able*):**
>     * **Definição:** Uma condição em uma cláusula `WHERE` é considerada "SARGable" se ela pode ser resolvida através de uma busca por índice.
>     * **Anti-padrão:** Aplicar uma função diretamente na **coluna** da tabela geralmente impede o uso do índice, tornando a condição não-SARGable.
>         * **Exemplo Ruim (não-SARGable):** `WHERE SUBSTRING(nome, 1, 3) = 'JOS'`
>         * **Exemplo Bom (SARGable):** `WHERE nome LIKE 'JOS%'`
>         * **Exemplo Ruim (não-SARGable):** `WHERE YEAR(data_pedido) = 2024`
>         * **Exemplo Bom (SARGable):** `WHERE data_pedido >= '2024-01-01' AND data_pedido < '2025-01-01'`
> * **Outras Técnicas de Otimização:**
>     * **Evitar `SELECT *`:** Especifique apenas as colunas necessárias na lista de `SELECT`. Isso reduz o tráfego de rede e a quantidade de dados a serem processados pelo SGBD e pela aplicação.
>     * **Otimização de `JOIN`s:** A ordem em que as tabelas são unidas pode impactar o desempenho. Embora o otimizador tente encontrar a melhor ordem, é boa prática garantir que as condições de `JOIN` utilizem colunas indexadas.
>     * **Uso de `UNION ALL` em vez de `OR`:** Em alguns casos, uma condição `WHERE` com `OR` em colunas diferentes pode ser menos eficiente que a união de duas consultas separadas com `UNION ALL`. `UNION ALL` é preferível a `UNION` quando se sabe que não haverá duplicatas, pois `UNION` precisa realizar um trabalho extra para eliminar as duplicatas.

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Índices como Solução Universal:** A pegadinha mais comum é afirmar que a criação de índices em todas as colunas de uma tabela melhora o desempenho geral do banco de dados. **ERRADO**. Índices aceleram consultas (`SELECT`), mas impõem uma sobrecarga de desempenho em operações de escrita (`INSERT`, `UPDATE`, `DELETE`), pois cada índice relevante também precisa ser atualizado. O excesso de índices é prejudicial.
> > * **SARGability e Funções em `WHERE`:** Este é um conceito técnico frequentemente explorado. A banca apresentará uma consulta com uma função aplicada a uma coluna indexada na cláusula `WHERE` e afirmará que o índice será utilizado. **ERRADO**. A aplicação da função na coluna geralmente força o SGBD a fazer uma varredura completa da tabela, pois ele teria que calcular o resultado da função para cada linha antes de fazer a comparação.
> > * **`LIKE` e o Curinga `%`:** O uso do curinga `%` no **início** de uma string de busca na cláusula `LIKE` (e.g., `WHERE nome LIKE '%SILVA'`) também torna a condição não-SARGable e impede o uso de um índice padrão na coluna, forçando um *full table scan*.
