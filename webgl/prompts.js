export const promptBase = `
Generate a comprehensive, hierarchical JSON mind map from the provided content.
Root node name: coherent, self-assigned.
All "name" fields (topics) <= 35 chars.
"definition" fields: dense, complete, objective.
Maximize child and sub-nodes to cover all content details.
Arrange the child nodes in a logical order that facilitates the easiest understanding and learning of the content.
Output MUST be ONLY the JSON structure, no extra text or markdown, no citations.
All output text MUST be in Brazilian Portuguese.
Format: { "name": "...", "definition": "...", "children": [ { "name": "...", "definition": "...", "children": [...] } ] }
`;