todosOsDados.push({
    tituloPrincipal: "Engenharia de requisitos - técnicas de validação de requisitos",
    conceitos: [
        {
            id: 1,
            titulo: "Inspeção de Requisitos",
            teoria: `
                <p>A inspeção de requisitos é uma técnica formal de validação que envolve revisões sistemáticas e estruturadas por uma equipe multidisciplinar. Seu objetivo é identificar defeitos, inconsistências, ambiguidades e omissões nos requisitos.</p>
                <ul>
                    <li><strong>Foco em defeitos</strong>, não em soluções.</li>
                    <li>Exige <strong>documentação prévia</strong> dos requisitos.</li>
                    <li>Pode ser aplicada a <strong>qualquer artefato</strong> (não apenas requisitos).</li>
                    <li><strong>Custo elevado</strong> devido ao tempo e recursos envolvidos.</li>
                </ul>`,
            analogiaPokemon: `Imagine uma inspeção como a batalha do Elite Four, onde seu time Pokémon é avaliado em detalhes por especialistas (os líderes). Cada um verifica tipos, ataques e defesas, apontando falhas (ex.: falta de ataques contra água). Não é sobre vencer, mas identificar fraquezas antes da Liga Pokémon.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A inspeção de requisitos é uma técnica de validação que deve ser conduzida exclusivamente pelo engenheiro de requisitos, sem a participação de outros stakeholders, pois sua natureza técnica exige conhecimento especializado em modelagem de software."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao afirmar que a inspeção é exclusiva do engenheiro de requisitos. A técnica requer equipe multidisciplinar (clientes, desenvolvedores, testadores) para cobrir todas as perspectivas. A maldade está na palavra 'exclusivamente' e na generalização sobre 'natureza técnica'."
            }
        },
        {
            id: 2,
            titulo: "Prototipação",
            teoria: `
                <p>A prototipação é uma técnica de validação que cria modelos executáveis ou visuais dos requisitos para feedback rápido. Pode ser:</p>
                <ul>
                    <li><strong>Horizontal</strong> (foca em interfaces, sem lógica).</li>
                    <li><strong>Vertical</strong> (implementa uma funcionalidade completa).</li>
                    <li><strong>Evolucionária</strong> (transforma-se no produto final).</li>
                </ul>
                <p><strong>Nuâncias importantes:</strong></p>
                <ul>
                    <li>Protótipos <strong>não substituem</strong> documentação formal.</li>
                    <li>Risco de <strong>escopo creep</strong> (usuários exigem mais funcionalidades no protótipo).</li>
                    <li>Ideal para requisitos <strong>ambiguos ou não elicitados</strong>.</li>
                </ul>`,
            analogiaPokemon: `Prototipar é como criar um Pokémon Ditto: ele se transforma em outro Pokémon (requisito) para testar suas habilidades em batalha (validação). Se Ditto falha, você ajusta a forma antes de evoluir para o Pokémon definitivo (sistema final).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A prototipação vertical é recomendada para validar requisitos de interface do usuário, pois permite a avaliação rápida de aspectos visuais sem a necessidade de implementação de funcionalidades subjacentes."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A pegadinha está na troca entre prototipação vertical (que valida funcionalidades completas) e horizontal (que foca em interfaces). A assertiva descreve a horizontal, mas cita a vertical."
            }
        },
        {
            id: 3,
            titulo: "Testes de Aceitação",
            teoria: `
                <p>Testes de aceitação validam se o sistema atende aos requisitos acordados com o cliente. Tipos:</p>
                <ul>
                    <li><strong>Aceitação do usuário (UAT)</strong>: Realizado pelo cliente em ambiente real.</li>
                    <li><strong>Aceitação contratual</strong>: Baseado em critérios formais do contrato.</li>
                    <li><strong>Alpha/Beta</strong>: Alpha (interno), Beta (externo com usuários reais).</li>
                </ul>
                <p><strong>Pontos importantes:</strong></p>
                <ul>
                    <li>UAT <strong>não substitui</strong> testes de sistema/integração.</li>
                    <li>Beta testing é <strong>pós-desenvolvimento</strong>, mas antes da entrega final.</li>
                </ul>`,
            analogiaPokemon: `É como a prova da Liga Pokémon: o treinador (cliente) testa seu time (sistema) em batalhas reais contra os líderes (critérios de aceitação). Se vencer, ganha a insígnia (aprovação).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Os testes de aceitação do usuário (UAT) devem ser realizados antes dos testes de sistema, pois garantem que todas as funcionalidades estão corretas do ponto de vista do cliente, eliminando a necessidade de outros níveis de teste."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao sugerir que UAT antecede testes de sistema e os substitui. Na verdade, UAT é a última etapa de validação, após testes de unidade, integração e sistema. A maldade está na inversão da ordem e na generalização 'eliminando a necessidade'."
            }
        },
        {
            id: 4,
            titulo: "Revisão por Pares",
            teoria: `
                <p>Revisão por pares é uma técnica informal onde colegas analisam requisitos para detectar erros. Difere da inspeção por:</p>
                <ul>
                    <li>Não seguir processo estruturado.</li>
                    <li>Não exigir moderador ou checklist.</li>
                    <li>Ser mais <strong>rápida e menos custosa</strong>.</li>
                </ul>
                <p><strong>Variantes:</strong></p>
                <ul>
                    <li><strong>Walkthrough</strong>: autor guia a revisão.</li>
                    <li><strong>Passiva</strong>: revisores analisam silenciosamente.</li>
                </ul>`,
            analogiaPokemon: `É como treinar com outro treinador Pokémon: ele observa suas estratégias e aponta falhas (ex.: usar Charizard contra pedra). Não é uma batalha oficial (inspeção), mas um feedback rápido.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A revisão por pares é considerada uma técnica formal de validação de requisitos, equivalente à inspeção, pois ambas exigem a elaboração de um relatório detalhado com métricas de defeitos e aprovação formal dos participantes."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva confunde revisão por pares (informal) com inspeção (formal). A pegadinha está em 'equivalente' e 'exigem relatório detalhado'. Revisão por pares é ad hoc e não requer métricas formais."
            }
        }
    ]
});