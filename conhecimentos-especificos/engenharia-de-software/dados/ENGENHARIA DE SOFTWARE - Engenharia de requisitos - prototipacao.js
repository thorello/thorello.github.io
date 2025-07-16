todosOsDados.push({
    tituloPrincipal: "Engenharia de requisitos - prototipação",
    conceitos: [
        {
            id: 1,
            titulo: "Prototipação em Engenharia de Requisitos",
            teoria: `
                <p>A prototipação é uma técnica de elicitação e validação de requisitos que consiste na construção de um modelo simplificado (protótipo) do sistema, com foco em aspectos específicos (interface, funcionalidades, etc.). Pode ser:</p>
                <ul>
                    <li><strong>Evolucionária</strong>: O protótipo é refinado até virar o produto final.</li>
                    <li><strong>Descartável</strong>: Usado apenas para clarificar requisitos, depois é descartado.</li>
                </ul>
                <p><strong>Pontos críticos Cebraspe</strong>:</p>
                <ol>
                    <li><strong>Não substitui</strong> documentação formal de requisitos.</li>
                    <li><strong>Riscos</strong>: Custo adicional, falsas expectativas ("efeito protótipo").</li>
                    <li><strong>Melhor para</strong> requisitos não funcionais (usabilidade) ou quando há alta incerteza.</li>
                </ol>`,
            analogiaPokemon: `Prototipar é como criar um "Ditto" do sistema final: ele se transforma em partes do produto para mostrar como ficará, mas não tem todas as habilidades (funcionalidades) do Pokémon original. Pode ser um "Ditto descartável" (usado só para aprender) ou evoluir para o sistema real.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A prototipação é a técnica mais adequada para elicitar requisitos não funcionais, como desempenho e segurança, pois permite testar diretamente a implementação final do sistema, reduzindo custos e prazos em comparação com outras técnicas."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao afirmar que a prototipação é a mais adequada para requisitos como desempenho e segurança (são melhor tratados por modelos matemáticos ou testes específicos). Além disso, protótipos não testam a implementação final (são modelos simplificados). A maldade está na generalização indevida e na troca de conceitos (protótipo ≠ implementação final)."
            }
        },
        {
            id: 2,
            titulo: "Tipos de Protótipos",
            teoria: `
                <p><strong>Protótipo de Baixa Fidelidade</strong>: Esboços em papel ou wireframes, rápido e barato, focado em fluxos e layout.</p>
                <p><strong>Proótipo de Alta Fidelidade</strong>: Simula funcionalidades e interface próximas do real, custo mais alto.</p>
                <p><strong>Armadilhas Cebraspe</strong>:</p>
                <ol>
                    <li><strong>Baixa fidelidade ≠ inútil</strong>: Ideal para estágios iniciais.</li>
                    <li><strong>Alta fidelidade pode criar vício</strong> no cliente (achar que o sistema está pronto).</li>
                </ol>`,
            analogiaPokemon: `Protótipo de baixa fidelidade é como um "Sketch de Smeargle" – um rascunho das habilidades reais. Já o de alta fidelidade é um "Porygon-Z", que simula um Pokémon digital quase real, mas ainda não é o produto final.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Protótipos de alta fidelidade são sempre superiores aos de baixa fidelidade, pois eliminam a necessidade de documentação de requisitos e garantem que o cliente entenda todas as funcionalidades do sistema desde o primeiro ciclo de desenvolvimento."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva comete dois erros: 1) Generalização: Protótipos de alta fidelidade não são sempre superiores (dependem do contexto e custo). 2) Falsidade: Nunca eliminam a documentação de requisitos (são complementares). A pegadinha está no termo 'sempre' e na exclusão indevida da documentação."
            }
        },
        {
            id: 3,
            titulo: "Efeito Protótipo",
            teoria: `
                <p>Ocorre quando o cliente confunde o protótipo com o produto final, criando expectativas irreais sobre prazos, funcionalidades ou qualidade.</p>
                <p><strong>Formas de mitigar</strong>:</p>
                <ul>
                    <li>Deixar claro o <strong>escopo limitado</strong> do protótipo.</li>
                    <li>Usar cores/recursos distintos do produto final (ex.: "placeholder" em wireframes).</li>
                </ul>
                <p><strong>Cebraspe adora cobrar</strong>: Efeito protótipo é um <strong>risco</strong>, não um benefício.</p>`,
            analogiaPokemon: `É como treinar um "Magikarp" (protótipo) e o cliente achar que já é um "Gyarados" (sistema final). Se não explicar que ele ainda não sabe "Hydro Pump", a decepção será inevitável.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O efeito protótipo é desejável na engenharia de requisitos, pois demonstra ao cliente que a equipe de desenvolvimento já possui domínio total sobre todas as funcionalidades do sistema, acelerando a aprovação do projeto."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "O erro é grave: o efeito protótipo nunca é desejável (é um risco de má comunicação). A assertiva ainda insinua que o protótipo mostra 'domínio total' (falso, ele é limitado). A banca trocou intencionalmente um problema por um suposto benefício."
            }
        }
    ]
});