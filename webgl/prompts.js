export const promptBase = `Por favor, analise o conteúdo do arquivo anexo. Crie uma estrutura JSON hierárquica que aborde de forma densa e completa todo o conteúdo do arquivo, texto ou link informado..

O nome do nó raiz ("name") deve ser atribuído por você, de forma coerente com o nome do arquivo e com o conteúdo.

Cada "name" (título do tópico) em todos os níveis da hierarquia não pode ter mais de 35 caracteres. A "definition" (definição do tópico) deve ser densa, completa e objetiva.

Faça o máximo de nós filhos ("children") e sub-nós que forem necessários para cobrir todos os detalhes do conteúdo (NÃO POUPE ESFORÇOS PARA ISTO).

**Importante:** A resposta deve conter *apenas* a estrutura JSON. Não inclua citações como [cite_start], introduções ou qualquer texto adicional antes ou depois do JSON. Não inclua citações de hiperlinks da fonte.

A estrutura JSON final deve seguir exatamente este formato:

{
  "name": "Root Node Name",
  "definition": "definition for the root node.",
  "children": [
    {
      "name": "Child Node 1",
      "definition": "definition for child node 1.",
      "children": [
        {
          "name": "Grandchild Node 1.1",
          "definition": "definition for grandchild node 1.1."
        },
        {
          "name": "Grandchild Node 1.2",
          "definition": "definition for grandchild node 1.2."
        }
      ]
    },
    {
      "name": "Child Node 2",
      "definition": "definition for child node 2.",
      "children": [
        {
          "name": "Grandchild Node 2.1",
          "definition": "definition for grandchild node 2.1."
        }
      ]
    }
  ]
}



`;