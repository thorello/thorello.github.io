### **Classe:** A
### **Conteúdo:** Comunicação em Auditoria: Exemplo de Relatório

---

### **1. Exemplo de Relatório de Auditoria de TI**

> #### **TEORIA-ALVO**
> O relatório é o produto final que formaliza e comunica os resultados de uma auditoria. Sua estrutura e linguagem devem ser claras, objetivas, precisas e fundamentadas em evidências. A seguir, apresenta-se um exemplo simplificado de um relatório de auditoria de TI, focado em um achado específico, para ilustrar a aplicação dos conceitos.
> 
> ---
> 
> **RELATÓRIO DE AUDITORIA Nº 015/2025 – AUDIN/PRES**
> 
> **Unidade Auditada:** Diretoria de Tecnologia da Informação (DTI) – Entidade Governamental X.
> 
> **Objeto da Auditoria:** Auditoria do Processo de Gerenciamento de Acessos Lógicos aos Sistemas Corporativos.
> 
> **Período da Auditoria:** 01/06/2025 a 30/06/2025.
> 
> **1. INTRODUÇÃO**
> 
> 1.1. O presente relatório trata da auditoria realizada no processo de gerenciamento de acessos lógicos da Entidade X, com o objetivo de verificar a conformidade dos procedimentos de concessão, alteração, remoção e revisão de acessos aos sistemas ERP e de Processo Eletrônico com a Política de Segurança da Informação (PSI) da entidade e com as boas práticas de mercado, notadamente a norma ABNT NBR ISO/IEC 27002.
> 
> 1.2. O escopo dos trabalhos abrangeu a análise de solicitações e registros de acesso no período de 01/01/2025 a 31/05/2025. Os procedimentos de auditoria incluíram inspeção documental, análise de logs, reexecução de procedimentos de controle e entrevistas com gestores e equipes técnicas da DTI e do Setor de Gestão de Pessoas (SGP).
> 
> **2. SUMÁRIO EXECUTIVO**
> 
> 2.1. Foram identificadas fragilidades relevantes no processo de gerenciamento de acessos, notadamente no que tange à tempestividade da revogação de acessos de colaboradores desligados e à ausência de um processo formal de revisão periódica de perfis, expondo a entidade a riscos de segurança e de não conformidade legal. Os achados e as recomendações para mitigação dos riscos identificados são detalhados a seguir.
> 
> **3. ACHADOS DE AUDITORIA**
> 
> **3.1. Achado 01 – Contas de ex-colaboradores permanecem ativas nos sistemas corporativos após o desligamento.**
> 
> > * **Condição:** Constatou-se, por meio de cruzamento de dados entre a base de usuários ativos do sistema ERP e a lista de colaboradores desligados fornecida pelo SGP, a existência de 25 (vinte e cinco) contas de usuário pertencentes a ex-colaboradores com vínculo encerrado há mais de 90 (noventa) dias, as quais permaneciam com o status "ativo" e com perfis de acesso inalterados.
> 
> > * **Critério:**
> >     * Art. 15, inciso II, da Política de Segurança da Informação (PSI) da Entidade X, que estabelece: "As contas de usuário devem ser desativadas ou removidas imediatamente após a confirmação do término do vínculo do colaborador com a entidade".
> >     * Controle 5.18 da norma ABNT NBR ISO/IEC 27002:2022, que preconiza a implementação de um processo para gerenciar todo o ciclo de vida da identidade, incluindo a remoção tempestiva dos direitos de acesso quando não mais necessários.
> 
> > * **Causa:** Inexistência de um fluxo de trabalho formal e automatizado para a comunicação de desligamentos de colaboradores entre o Setor de Gestão de Pessoas (SGP) e a Diretoria de Tecnologia da Informação (DTI), e ausência de um procedimento de revisão periódica de contas ativas.
> 
> > * **Efeito (Consequência/Risco):** A permanência de contas ativas de ex-colaboradores eleva significativamente o risco de acesso não autorizado a sistemas e informações sensíveis da entidade, podendo resultar em vazamento de dados, fraudes e não conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD).
> 
> **3.1.1. Recomendações:**
> 
> > * **Recomendação 1.1 (Para a DTI e o SGP):** Recomenda-se que a DTI e o SGP, em conjunto, no prazo de 90 (noventa) dias, estabeleçam e formalizem um procedimento para a comunicação obrigatória e tempestiva de todos os desligamentos de colaboradores.
> 
> > * **Recomendação 1.2 (Para a DTI):** Recomenda-se que a DTI, no prazo de 30 (trinta) dias, realize uma revisão completa de todas as contas de usuário nos sistemas corporativos e desative as contas pertencentes a ex-colaboradores. Recomenda-se, ainda, a instituição de um procedimento de revisão periódica trimestral dos direitos de acesso.
> 
> **4. CONCLUSÃO**
> 
> 4.1. Conclui-se que o processo de gerenciamento de acessos lógicos da Entidade X apresenta deficiências de controle interno que geram riscos relevantes à segurança da informação. A implementação das recomendações propostas é fundamental para a mitigação dos riscos identificados e para o fortalecimento do ambiente de controles de TI.
> 
> Porto Alegre, 17 de julho de 2025.
> 
> 
> 
> **[Nome do Auditor-Líder]**
> 
> Matrícula nº XXXXXX
> 
> Coordenador da Equipe de Auditoria

> #### **FOCO CEBRASPE (Pontos de Atenção e "Pegadinhas")**
> > * **Estrutura do Achado:** O exemplo evidencia a aplicação obrigatória dos quatro atributos de um achado de auditoria: **Condição** (o que é), **Critério** (o que deveria ser), **Causa** (por que aconteceu) e **Efeito** (qual o impacto). Um relatório que apresenta apenas a Condição ("encontramos 25 contas ativas") sem os demais elementos é considerado tecnicamente incompleto pelas normas de auditoria.
> > * **Recomendações Direcionadas à Causa:** Observe que as recomendações propostas no exemplo não se limitam a corrigir a condição (desativar as contas), mas atacam principalmente a **causa** do problema (falta de um procedimento formal e de uma revisão periódica). Recomendações eficazes devem ser direcionadas à causa raiz.
> > * **Linguagem e Tom:** O relatório utiliza linguagem impessoal, formal e objetiva. As constatações são baseadas em fatos e evidências ("cruzamento de dados", "análise da base de usuários") e os critérios são fundamentados em normativos internos (PSI) e externos (ISO 27002), conferindo credibilidade e autoridade ao documento.
