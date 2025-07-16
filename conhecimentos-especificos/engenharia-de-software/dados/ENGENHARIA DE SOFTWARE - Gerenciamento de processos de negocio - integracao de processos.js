todosOsDados.push({
    tituloPrincipal: "Gerenciamento de processos de negócio - integração de processos",
    conceitos: [
        {
            id: 1,
            titulo: "Integração de Processos de Negócio",
            teoria: `
                <p><strong>Integração de processos de negócio (BPM - Business Process Management)</strong> visa conectar sistemas, dados e atividades para otimizar fluxos de trabalho. Pontos críticos:</p>
                <ul>
                    <li><strong>Orquestração</strong>: Controle centralizado de processos (ex: BPEL)</li>
                    <li><strong>Colaboração</strong>: Interação descentralizada entre sistemas (ex: troca de mensagens)</li>
                    <li><strong>Middleware</strong>: Ferramentas como ESB (Enterprise Service Bus) facilitam a comunicação entre sistemas heterogêneos</li>
                </ul>
                <p><strong>Armadilha Cebraspe</strong>: Confundir "orquestração" (centralizada) com "colaboração" (descentralizada).</p>`,
            analogiaPokemon: `Imagine um <em>Comando Pokémon</em> (orquestração) onde o treinador (BPEL) dita ordens específicas para cada Pokémon (sistema). Já na <em>Batalha Selvagem</em> (colaboração), os Pokémon reagem independentemente a eventos, como um ESB permitindo que Pikachu e Charizard troquem energia sem um líder.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A orquestração de processos de negócio é caracterizada pela interação autônoma entre sistemas heterogêneos, sem a necessidade de um controlador central, sendo equivalente ao modelo de colaboração."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva troca os conceitos de orquestração (controlada por um coordenador central, como BPEL) e colaboração (sistemas autônomos interagindo). A Cebraspe explora essa diferença sutil em questões sobre BPM."
            }
        },
        {
            id: 2,
            titulo: "ESB (Enterprise Service Bus)",
            teoria: `
                <p><strong>ESB</strong> é um middleware que padroniza a comunicação entre aplicações via barramento de serviços. Características:</p>
                <ul>
                    <li><strong>Desacoplamento</strong>: Sistemas não se comunicam diretamente, reduzindo dependências</li>
                    <li><strong>Transformação de dados</strong>: Converte formatos (ex: XML para JSON)</li>
                </ul>
                <p><strong>Pegadinha</strong>: ESB não é sinônimo de API Gateway (este último gerencia APIs, enquanto ESB integra processos).</p>`,
            analogiaPokemon: `O ESB é como o <em>Centro Pokémon</em>: cura (transforma) Pokémons de diferentes times (sistemas) para que possam batalhar juntos, sem que os treinadores (aplicações) precisem se comunicar diretamente.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O ESB atua como um gateway de APIs, responsável exclusivamente por gerenciar autenticação e throttling de requisições, sem realizar transformação de formatos de dados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva descreve um API Gateway, não um ESB. Este último foca em integração (transformação de dados, roteamento), enquanto gateways gerenciam APIs. A Cebraspe costuma misturar esses termos."
            }
        },
        {
            id: 3,
            titulo: "BPEL (Business Process Execution Language)",
            teoria: `
                <p><strong>BPEL</strong> é uma linguagem para orquestrar serviços web em processos de negócio. Nuances:</p>
                <ul>
                    <li><strong>Execução sequencial</strong>: Define fluxos como 'faça X, depois Y'</li>
                    <li><strong>Compensação</strong>: Rollback em caso de falha (ex: desfazer reserva se pagamento falhar)</li>
                </ul>
                <p><strong>Armadilha</strong>: BPEL não é usado para processos colaborativos (ex: troca de mensagens assíncronas).</p>`,
            analogiaPokemon: `BPEL é como o <em>script de um ginásio Pokémon</em>: o líder (orquestrador) define a ordem dos desafios (serviços) – "derrote Onix antes de enfrentar Machoke". Se o treinador falha, volta ao início (compensação).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O BPEL é adequado para modelar processos colaborativos, onde sistemas independentes trocam mensagens assíncronas sem um coordenador central."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "BPEL é voltado para orquestração (controle central), não colaboração. A assertiva inverte os cenários, pegadinha comum em provas."
            }
        }
    ]
});