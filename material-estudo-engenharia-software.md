<!--
Arquivo gerado automaticamente por assistente Markdown.
Este material foi estruturado para facilitar o estudo dos principais tópicos de Engenharia de Software, Metodologias Ágeis, DevOps e Qualidade.
-->

# Material de Estudo Completo de Engenharia de Software

Este guia foi elaborado a partir de uma análise detalhada das questões e comentários fornecidos, cobrindo os conceitos essenciais para seus estudos.

---

## Sumário

1. [Metodologias Ágeis: Princípios Fundamentais](#1-metodologias-ágeis-princípios-fundamentais)
2. [O Framework Scrum](#2-o-framework-scrum)
   - [2.1 Papéis no Scrum](#21-papéis-no-scrum)
   - [2.2 Eventos do Scrum](#22-eventos-do-scrum)
   - [2.3 Artefatos do Scrum](#23-artefatos-do-scrum)
3. [Kanban](#3-kanban)
4. [Outras Metodologias e Práticas Ágeis](#4-outras-metodologias-e-práticas-ágeis)
5. [DevOps, Gerência de Configuração e Ferramentas](#5-devops-gerência-de-configuração-e-ferramentas)
   - [5.1 Princípios de DevOps](#51-princípios-de-devops)
   - [5.2 Git (Sistema de Controle de Versão)](#52-git-sistema-de-controle-de-versão)
   - [5.3 Docker e Contêineres](#53-docker-e-contêineres)
6. [Qualidade de Software e UX](#6-qualidade-de-software-e-ux)

---

## 1. Metodologias Ágeis: Princípios Fundamentais

As metodologias ágeis são abordagens flexíveis e iterativas para o desenvolvimento de software, focadas em entregar valor contínuo ao cliente. Elas se baseiam em ciclos curtos de desenvolvimento (iterações ou sprints) que permitem adaptação rápida a mudanças.

### Manifesto Ágil — 4 Valores

- **Indivíduos e interações** mais que processos e ferramentas.
- **Software em funcionamento** mais que documentação abrangente.
  - A documentação não é eliminada, mas o foco é documentar apenas o essencial para o entendimento da equipe.
- **Colaboração com o cliente** mais que negociação de contratos.
- **Responder a mudanças** mais que seguir um plano.

> A flexibilidade ágil permite que os requisitos evoluam ao longo do projeto de forma contínua, sem a necessidade de um processo formal e burocrático de gerenciamento de mudanças.

---

## 2. O Framework Scrum

O Scrum é um dos frameworks ágeis mais populares, projetado para gerenciar projetos complexos e entregar produtos de alto valor. Ele se baseia em três pilares empíricos: **transparência, inspeção e adaptação**.

### 2.1 Papéis no Scrum

O Scrum Team é uma unidade coesa, sem hierarquias ou subtimes. É composto por:

#### Product Owner (PO)

- **Responsabilidade principal:** Maximizar o valor do produto resultante do trabalho do Scrum Team.
- **Atribuições:**
  - Gerencia o Product Backlog (criar, comunicar e ordenar itens).
  - Define a visão do produto e representa os interesses dos stakeholders.
  - É uma única pessoa, não um comitê.
  - Pode delegar atividades, mas a responsabilidade final é sempre sua.
  - **Não realiza trabalho técnico de desenvolvimento.**

#### Scrum Master (SM)

- **Responsabilidade principal:** Garantir que a equipe entenda e aplique o Scrum corretamente, atuando como líder-servidor e facilitador.
- **Atribuições:**
  - Remove impedimentos, facilita os eventos e treina a equipe em autogerenciamento.
  - **Não é o chefe** da equipe.
  - Não gerencia o Product Backlog, mas pode auxiliar o PO em técnicas de gerenciamento.

#### Developers (Desenvolvedores)

- **Responsabilidade principal:** Criar um Incremento "Pronto" a cada Sprint.
- **Atribuições:**
  - Time multifuncional e autogerenciável.
  - Selecionam itens do Product Backlog e planejam o trabalho da Sprint.
  - Responsáveis por criar o Sprint Backlog.

---

### 2.2 Eventos do Scrum

Todos os eventos do Scrum ocorrem **dentro de uma Sprint**.

| Evento                | Objetivo                                                                                         | Participantes        | Foco                  |
|-----------------------|--------------------------------------------------------------------------------------------------|----------------------|-----------------------|
| **Sprint**            | Ciclo de trabalho fixo (1-4 semanas ou 10 dias úteis). Só o **PO** pode cancelar.                | Todo o time          | Mini-projeto          |
| **Sprint Planning**   | Definir entregas e plano da Sprint. Criação da **Meta da Sprint** e do **Sprint Backlog**.       | Todo o Scrum Team    | O que e como fazer    |
| **Daily Scrum**       | Inspeção diária do progresso e adaptação do Sprint Backlog.                                      | Developers           | Progresso da Sprint   |
| **Sprint Review**     | Inspeção do Incremento e coleta de feedback dos stakeholders.                                    | Todo o Scrum Team    | Produto               |
| **Sprint Retrospective** | Inspeção do processo e plano de melhorias para próxima Sprint.                                 | Todo o Scrum Team    | Processo e equipe     |

#### Observações:

- **Sprint**: Apenas o Product Owner pode cancelar, e somente se a meta se torna obsoleta.
- **Sprint Planning**: Todo o time define juntos a Meta da Sprint.
- **Daily Scrum**: 15 minutos, estrutura livre, foco no progresso para a meta.
- **Sprint Review**: Demonstração do incremento, ajustes no Product Backlog conforme feedback.
- **Retrospective**: Melhoria contínua dos processos da equipe.

---

### 2.3 Artefatos do Scrum

| Artefato                  | Descrição                                                                                     | Responsável                    |
|---------------------------|-----------------------------------------------------------------------------------------------|--------------------------------|
| **Product Backlog**       | Lista ordenada e emergente de tudo necessário para o produto.                                | Product Owner                  |
| **Sprint Backlog**        | Plano feito **pelos Developers**: meta da Sprint, itens selecionados e plano de ação.        | Developers                     |
| **Incremento**            | Soma dos itens concluídos na Sprint + incrementos anteriores.                                | Developers                     |

> **Nota:** Para um item ser considerado parte do Incremento, deve atender à _Definition of Done_ (DoD).

---

## 3. Kanban

Kanban é um método visual para gerenciar o fluxo de trabalho. Diferente do Scrum, é orientado a fluxo contínuo e não utiliza Sprints.

### Princípios e Práticas

- **Limitar o Trabalho em Progresso (WIP):**
  - Define a quantidade máxima de tarefas em cada etapa do fluxo.
  - **Benefícios:** Melhora eficiência, evita sobrecarga, identifica gargalos e promove foco na conclusão.

### Principais Métricas

| Métrica           | Definição                                                                              |
|-------------------|----------------------------------------------------------------------------------------|
| **Cycle Time**    | Tempo desde o início do trabalho ativo até a finalização.                              |
| **Lead Time**     | Tempo desde a solicitação da demanda até a entrega.                                    |

---

## 4. Outras Metodologias e Práticas Ágeis

### XP (eXtreme Programming)

- Foco em excelência técnica e boas práticas de engenharia.
- **Práticas:** Programação em pares, **Integração Contínua (CI)**, **Refatoração contínua** e **Desenvolvimento Orientado a Testes (TDD)** (*test-first*).
- **Valores:** Comunicação, simplicidade, feedback, coragem e respeito.
- Entregas pequenas e frequentes (*small releases*).

### Lean

- Filosofia de **eliminar desperdícios** e otimizar processos.
- Utiliza **sistema puxado (pull system)**: trabalho só é iniciado quando há demanda da próxima etapa.

### Histórias de Usuário (User Stories)

- **Objetivo:** Expressar necessidades do cliente de forma clara.
- **Formato Padrão:**  
  > "Como [usuário], eu quero [ação] para que [valor/motivo]"
- **Princípio INVEST:**  
  - **I**ndependente
  - **N**egociável
  - **V**aliosa
  - **E**stimável
  - **S**mall (pequena)
  - **T**estável
- Construção colaborativa, não apenas pelo PO.

### Estimativas Ágeis

- **Story Points:**  
  - Métrica de **esforço relativo**, não de tempo.
  - Considera complexidade, risco e volume.

---

## 5. DevOps, Gerência de Configuração e Ferramentas

### 5.1 Princípios de DevOps

DevOps integra desenvolvimento (Dev) e operações (Ops) para entregar software mais rápido e confiável.

- **Entrega Contínua (CD):**  
  Automatiza preparação de alterações de código para produção, incluindo testes automatizados.
- **Integração Contínua (CI):**  
  Desenvolvedores mesclam alterações frequentemente em repositório central, disparando builds e testes automáticos.
- **Infraestrutura como Código (IaC):**  
  Provisionamento automatizado da infraestrutura (ex: Terraform).
  - O Terraform utiliza blocos de configuração para definir provedores e recursos.
- **Cultura:**  
  - Promove ambiente livre de culpa; erros são oportunidades de aprendizado.

---

### 5.2 Git (Sistema de Controle de Versão)

- **Branch:**  
  Linha de desenvolvimento separada, um ponteiro para um commit.  
  > **Não é uma cópia do repositório**.  
  Facilita trabalho colaborativo.

#### Principais Comandos Git

```bash
git clone           # Cria uma cópia local de um repositório remoto
git push            # Envia alterações locais para o remoto
git pull            # Traz alterações do remoto para o local
git commit          # Grava alterações locais como um novo commit
git cherry-pick     # Aplica um commit específico de uma branch em outra
git stash           # Armazena alterações temporárias sem commit
git branch -D <nome>  # Força a exclusão de uma branch local (mesmo com commits não mesclados)
```

---

### 5.3 Docker e Contêineres

- Imagens Docker devem ser **imutáveis**.
  - Para adicionar dependência, atualize o `Dockerfile` e **reconstrua** a imagem.
- **Docker Registry:**  
  Serviço para armazenar e distribuir imagens Docker.
- **Docker Compose:**  
  Ferramenta para definir e executar aplicações multi-contêiner via arquivo YAML.

---

## 6. Qualidade de Software e UX

### Qualidade de Software

- Busca conformidade com requisitos funcionais explícitos e características implícitas.
- **Atributos principais:** manutenibilidade, confiança, proteção, eficiência e aceitabilidade.

### Clean Code e Refatoração

- **Regra do Escoteiro:**  
  > "Sempre deixe o código mais limpo do que você o encontrou."
- **Refatoração:**  
  Melhorar estrutura interna do código sem alterar comportamento externo.
  - *Extract Method*: extrair trecho para novo método, não criar variáveis temporárias.

### Modelos de Qualidade (MPS.BR)

- Define processos para tornar o desenvolvimento de software previsível e controlado.
- **7 níveis de maturidade:**  
  - G (mais baixo) a A (mais alto).

### Experiência do Usuário (UX)

- **Personas:**  
  Perfis fictícios representando grupos de usuários, baseados em dados reais.  
  > **Não representam a jornada do usuário.**
- **Jornada do Usuário:**  
  Sequência de passos para atingir um objetivo, incluindo interações com o produto.
- **Storytelling:**  
  Construção de narrativas para criar conexão emocional com o público.

---