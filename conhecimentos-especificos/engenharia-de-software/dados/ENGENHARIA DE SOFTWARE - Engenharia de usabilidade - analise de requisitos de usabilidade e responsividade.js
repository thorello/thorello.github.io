todosOsDados.push({
    tituloPrincipal: "Engenharia de usabilidade - análise de requisitos de usabilidade e responsividade",
    conceitos: [
        {
            id: 1,
            titulo: "Análise de Requisitos de Usabilidade",
            teoria: `
                <p>A análise de requisitos de usabilidade é o processo de identificar e documentar as necessidades dos usuários em relação à facilidade de uso, eficiência e satisfação com o sistema. Inclui:</p>
                <ul>
                    <li><strong>Critérios de Nielsen</strong>: visibilidade do status, correspondência entre sistema e mundo real, controle e liberdade do usuário, consistência e padrões, prevenção de erros, reconhecimento em vez de recordação, flexibilidade e eficiência de uso, estética e design minimalista, ajuda aos usuários para reconhecer, diagnosticar e recuperar erros, ajuda e documentação.</li>
                    <li><strong>Métricas de usabilidade</strong>: tempo de tarefa, taxa de erro, satisfação subjetiva (ex: SUS - System Usability Scale).</li>
                    <li><strong>Técnicas</strong>: entrevistas, questionários, prototipagem, testes de usabilidade, personas e cenários.</li>
                </ul>
                <p><strong>Pegadinha Cebraspe</strong>: Confundir "usabilidade" (foco no usuário) com "acessibilidade" (foco em inclusão). Usabilidade não é só sobre "funcionar", mas sobre "ser fácil e agradável de usar".</p>`,
            analogiaPokemon: `Pikachu (usuário) precisa derrotar um Onix (sistema). Se a interface for como uma Pokébola intuitiva (alta usabilidade), Pikachu acerta o golpe rápido. Se for como uma HM confusa (baixa usabilidade), ele erra ou desiste. A análise de requisitos é como o Treinador Oak antecipar os movimentos que Pikachu precisará dominar.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "A análise de requisitos de usabilidade deve priorizar exclusivamente a eficiência do sistema, medida pelo tempo de processamento das operações, pois a satisfação do usuário é subjetiva e não pode ser quantificada."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao reduzir usabilidade à eficiência técnica (tempo de processamento), ignorando critérios como satisfação subjetiva (mensurável via SUS) e prevenção de erros. A pegadinha está na palavra 'exclusivamente' e na negação da quantificação da satisfação. Usabilidade abrange eficiência, eficácia e satisfação (ISO 9241)."
            }
        },
        {
            id: 2,
            titulo: "Responsividade em Engenharia de Usabilidade",
            teoria: `
                <p>Responsividade refere-se à capacidade do sistema de se adaptar a diferentes dispositivos (desktop, mobile) e contextos de uso (tela, conexão), mantendo usabilidade. Inclui:</p>
                <ul>
                    <li><strong>Design Adaptativo</strong>: layouts que mudam conforme o tamanho da tela (breakpoints).</li>
                    <li><strong>Performance</strong>: otimização de carregamento (ex: lazy loading).</li>
                </ul>
                <p><strong>Pegadinha Cebraspe</strong>: Responsividade ≠ Adaptabilidade. Adaptabilidade usa servidor para detectar dispositivo; responsividade usa CSS/media queries.</p>`,
            analogiaPokemon: `Um Ditto (sistema responsivo) se transforma para lutar igualmente bem contra um Charizard (desktop) ou um Pikachu (mobile). Se falhar, vira um blob inútil (site quebrado em mobile).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "A responsividade de um sistema é garantida quando o mesmo código HTML é utilizado para todas as plataformas, independentemente do uso de media queries ou frameworks como Bootstrap."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "O erro está em ignorar que responsividade exige ajustes de layout (via CSS/media queries) ou frameworks. Usar o mesmo HTML sem adaptações resulta em má experiência (ex: texto ilegível em mobile). A pegadinha é a generalização 'independentemente de'."
            }
        },
        {
            id: 3,
            titulo: "Protótipos para Usabilidade",
            teoria: `
                <p>Protótipos são versões simplificadas do sistema para validar requisitos de usabilidade. Tipos:</p>
                <ul>
                    <li><strong>Baixa fidelidade</strong>: esboços em papel (rápido, barato).</li>
                    <li><strong>Alta fidelidade</strong>: simula funcionalidades (ex: Figma).</li>
                </ul>
                <p><strong>Pegadinha Cebraspe</strong>: Protótipos não substituem testes com usuários reais. Um protótipo 'bonito' pode mascarar falhas de usabilidade.</p>`,
            analogiaPokemon: `Criar um protótipo é como evoluir um Eevee para testar se vira Umbreon (usável no escuro) ou Espeon (usável na luz). Sem testes, você pode acabar com um Leafeon inútil para o contexto.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025)",
                texto: "Protótipos de alta fidelidade são sempre superiores aos de baixa fidelidade na análise de requisitos de usabilidade, pois permitem avaliar tanto a interface quanto a performance do sistema em produção."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao dizer 'sempre superiores'. Protótipos de alta fidelidade são caros e demorados para estágios iniciais. Além disso, não avaliam performance real (são simulados). A pegadinha está no absolutismo ('sempre') e na confusão entre protótipo e sistema em produção."
            }
        }
    ]
});