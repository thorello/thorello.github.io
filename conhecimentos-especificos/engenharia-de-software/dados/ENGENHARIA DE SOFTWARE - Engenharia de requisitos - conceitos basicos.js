todosOsDados.push({
    tituloPrincipal: "Engenharia de Requisitos - Conceitos Básicos",
    conceitos: [
        {
            id: 1,
            titulo: "Requisito Funcional vs. Não Funcional",
            teoria: `<p><strong>Requisito Funcional (RF)</strong>: Define <em>o que</em> o sistema deve fazer, descrevendo funcionalidades específicas (ex: "O sistema deve permitir cadastrar usuários").</p>
                <p><strong>Requisito Não Funcional (RNF)</strong>: Define <em>como</em> o sistema deve operar, relacionado a restrições de qualidade, desempenho, segurança etc. (ex: "O sistema deve responder em menos de 2 segundos").</p>
                <p><strong>Nuance Cebraspe</strong>: RNFs são frequentemente confundidos com "requisitos de domínio" (regras de negócio), mas estes últimos são RFs, pois descrevem comportamentos esperados.</p>`,
            analogiaPokemon: `<strong>RF</strong>: Um Pikachu que usa "Choque do Trovão" é como um RF — descreve uma ação específica (ataque elétrico).<br>
                <strong>RNF</strong>: A velocidade do Pikachu (90 de base) é um RNF — define <em>quão bem</em> ele executa a ação, não a ação em si.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Requisitos não funcionais, como 'O sistema deve armazenar dados de clientes', descrevem restrições de desempenho e segurança, sendo irrelevantes para a funcionalidade do software."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva mistura conceitos. 'Armazenar dados' é um RF (funcionalidade), não RNF. RNFs seriam, por exemplo, 'os dados devem ser criptografados' (segurança). A pegadinha está em usar um exemplo de RF como se fosse RNF."
            }
        },
        {
            id: 2,
            titulo: "Técnicas de Elicitação de Requisitos",
            teoria: `<p><strong>Entrevistas</strong>: Diálogo direto com stakeholders para extrair necessidades. <strong>Armadilha</strong>: Não é eficaz para requisitos implícitos.</p>
                <p><strong>Brainstorming</strong>: Geração de ideias em grupo. <strong>Diferencial</strong>: Requer um facilitador para evitar dominância.</p>
                <p><strong>Observação</strong>: Análise do ambiente do usuário. <strong>Exceção</strong>: Inviável em sistemas sem interação humana.</p>
                <p><strong>Prototipagem</strong>: Modelos rápidos para validar ideias. <strong>Risco</strong>: Viés de focar apenas na interface.</p>`,
            analogiaPokemon: `<strong>Entrevista</strong>: Perguntar a um Treinador quais Pokémons ele quer (pode esquecer um curador).<br>
                <strong>Observação</strong>: Ver que ele sempre usa "Curar" no turno 3 (requisito implícito).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A técnica de observação é a mais adequada para elicitar requisitos em sistemas de controle industrial autônomos, pois captura com precisão as interações humanas não documentadas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Sistemas autônomos não têm interações humanas diretas, tornando a observação inútil. A assertiva contradiz a própria definição. A pegadinha está em usar 'interações humanas' como isca."
            }
        },
        {
            id: 3,
            titulo: "Validação vs. Verificação de Requisitos",
            teoria: `<p><strong>Verificação</strong>: Avalia se os requisitos estão corretamente especificados. <strong>Foco</strong>: "Construímos o sistema certo?" (consistência interna).</p>
                <p><strong>Validação</strong>: Confirma se atendem às necessidades reais. <strong>Foco</strong>: "Construímos o sistema correto?" (adequação ao propósito).</p>
                <p><strong>Nuance Cebraspe</strong>: Verificação é técnica (análise estática); Validação envolve stakeholders (dinâmica).</p>`,
            analogiaPokemon: `<strong>Verificação</strong>: Checar se a descrição de "Investida" no Pokédex está correta.<br>
                <strong>Validação</strong>: Testar se "Investida" causa dano como esperado.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A validação de requisitos ocorre durante a fase de implementação do software, por meio de revisões de código, garantindo que os requisitos atendam às expectativas dos usuários."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva confunde validação (expectativas do usuário) com verificação (revisões de código). Validação deve ocorrer antes da implementação. A pegadinha está em associar validação a atividades técnicas."
            }
        },
        {
            id: 4,
            titulo: "Rastreabilidade de Requisitos",
            teoria: `<p><strong>Definição</strong>: Capacidade de relacionar requisitos a origens e artefatos.</p>
                <p><strong>Tipos</strong>:<br>
                - <strong>Para frente</strong>: Requisito → Design/Implementação<br>
                - <strong>Para trás</strong>: Requisito → Fonte/Negócio</p>
                <p><strong>Armadilha Cebraspe</strong>: Não garante qualidade intrínseca, apenas acompanhamento.</p>`,
            analogiaPokemon: "Um Pokédex que mostra onde Pokémons foram capturados (backward) e em quais ginásios serão usados (forward).",
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A rastreabilidade de requisitos assegura a correção dos requisitos capturados, pois permite vincular cada requisito a seus stakeholders, eliminando ambiguidades por design."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Rastreabilidade documenta relações, mas não corrige requisitos mal elaborados. A pegadinha está em usar 'assegura' e 'eliminando por design' como termos absolutos."
            }
        },
        {
            id: 5,
            titulo: "Priorização de Requisitos",
            teoria: `<p><strong>Objetivo</strong>: Classificar por importância (valor) e urgência (tempo/recursos).</p>
                <p><strong>Técnicas</strong>:<br>
                - <strong>MoSCoW</strong>: Must have, Should have, Could have, Won't have<br>
                - <strong>Valor vs. Custo</strong>: Matriz 2x2 (alto/baixo valor x alto/baixo custo)</p>
                <p><strong>Nuance Cebraspe</strong>: Não é estática - deve ser reavaliada iterativamente.</p>`,
            analogiaPokemon: "Montar time Pokémon: Must have = Pokémon tipo Água; Won't have = Pokémon lendário (custo alto).",
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A técnica MoSCoW é imutável após sua aplicação inicial, pois os requisitos 'Must have' definem o núcleo irrevogável do sistema, enquanto os 'Won't have' devem ser permanentemente descartados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Ignora a natureza dinâmica da priorização. Requisitos 'Won't have' podem virar 'Must have' se o contexto mudar. A pegadinha está nos termos absolutos ('irrevogável', 'permanentemente')."
            }
        }
    ]
});