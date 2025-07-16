todosOsDados.push({
    tituloPrincipal: "Análise e projeto orientados a objetos - conceitos fundamentais, análise, modelagem e padrões de projeto",
    conceitos: [
        {
            id: 1,
            titulo: "Abstração",
            teoria: `
                <p><strong>Abstração</strong> é o processo de identificar e focar apenas nos aspectos essenciais de um objeto ou sistema, ignorando detalhes irrelevantes. Na engenharia de software, ela permite modelar entidades complexas simplificando sua representação.</p>
                <ul>
                    <li>Diferenciação: Não confundir com encapsulamento (que esconde detalhes internos).</li>
                    <li>A abstração seleciona o que modelar, enquanto o encapsulamento define como proteger os dados.</li>
                    <li>Armadilha comum: trocar "abstração" por "generalização".</li>
                </ul>`,
            analogiaPokemon: `Pikachu pode ser abstraído como um "Pokémon Elétrico" em um sistema de batalha. Seus atributos essenciais são tipo, HP e ataques elétricos. Detalhes como altura ou cor são ignorados.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A abstração e o encapsulamento são conceitos idênticos na orientação a objetos, pois ambos tratam de esconder detalhes de implementação para reduzir complexidade."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao equiparar os dois conceitos. A abstração seleciona características relevantes, enquanto o encapsulamento protege dados internos. A Cebraspe explora essa confusão para induzir ao erro."
            }
        },
        {
            id: 2,
            titulo: "Encapsulamento",
            teoria: `<p><strong>Encapsulamento</strong> é o mecanismo que protege os dados internos de um objeto, expondo apenas o necessário via interfaces controladas (métodos públicos).</p>
                <ul>
                    <li>Modificadores de acesso: private (só dentro da classe), protected (classe + herdeiros), public (qualquer acesso).</li>
                    <li>Armadilha: afirmar que encapsulamento "impede totalmente" o acesso a dados privados (errado! É possível via reflection).</li>
                </ul>`,
            analogiaPokemon: `Um Snorlax tem seu 'peso' (atributo privado) encapsulado. Para alterá-lo, usa-se um método público como setPeso(), que valida se o valor é positivo.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O encapsulamento garante que atributos privados de uma classe nunca podem ser acessados ou modificados por outras classes, assegurando absoluta proteção dos dados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva é falsa por generalizar ('nunca'). Técnicas como reflection permitem acessar membros privados. A Cebraspe explora o exagero ('absoluta proteção') para induzir ao erro."
            }
        },
        {
            id: 3,
            titulo: "Herança",
            teoria: `<p><strong>Herança</strong> permite que uma classe (subclasse) herde atributos e métodos de outra (superclasse), promovendo reuso de código.</p>
                <ul>
                    <li>Relação "é-um": Deve existir semântica real (ex.: Pikachu é um PokemonElétrico).</li>
                    <li>Armadilhas: confundir herança múltipla (suportada em C++ mas não em Java) e diferença entre sobrescrita e sobrecarga.</li>
                </ul>`,
            analogiaPokemon: `A evolução de Eevee para Vaporeon é como herança: Vaporeon ganha todos os atributos base de Eevee e adiciona novos (tipo Água, habilidade 'Hidratação').`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em orientação a objetos, a herança sempre melhora o desempenho do sistema, pois reduz a duplicação de código."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva erra ao usar 'sempre'. Herança pode piorar desempenho se mal aplicada (ex.: hierarquias muito profundas). O foco correto é reuso, não performance."
            }
        },
        {
            id: 4,
            titulo: "Polimorfismo",
            teoria: `<p><strong>Polimorfismo</strong> permite que objetos de diferentes classes respondam ao mesmo método de formas distintas.</p>
                <ul>
                    <li>Tipos principais: sobrescrita (override) e sobrecarga (overload).</li>
                    <li>Armadilha: confundir polimorfismo com herança (são conceitos relacionados mas distintos).</li>
                </ul>`,
            analogiaPokemon: `O ataque 'Investida' tem efeitos diferentes: Pikachu causa dano elétrico adicional, enquanto Machop usa força bruta. Mesmo comando, comportamentos distintos!`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O polimorfismo só pode ser implementado através de herança entre classes."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Polimorfismo também pode ocorrer via interfaces, classes abstratas e duck typing. A banca tenta restringir indevidamente o conceito."
            }
        },
        {
            id: 5,
            titulo: "Padrão Singleton",
            teoria: `<p><strong>Singleton</strong> garante que uma classe tenha apenas uma instância e fornece um ponto global de acesso a ela.</p>
                <ul>
                    <li>Construtor privado: Impede instanciação externa.</li>
                    <li>Instância única: Armazenada como atributo estático.</li>
                    <li>Armadilhas: dizer que é 'apenas para otimização' ou confundir com Factory Method.</li>
                </ul>`,
            analogiaPokemon: `O Professor Carvalho é o Singleton do mundo Pokémon - só existe uma instância dele que coordena todos os treinadores. Tentar criar um 'novo Professor' é bloqueado.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O padrão Singleton é recomendado para todas as classes que precisam de apenas um objeto, pois melhora significativamente o desempenho da aplicação."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Dois erros graves: 1) 'Todas as classes' - Singleton tem efeitos colaterais; 2) Foco em 'desempenho' - O objetivo real é controle de estado."
            }
        },
        {
            id: 6,
            titulo: "Padrão Factory Method",
            teoria: `<p><strong>Factory Method</strong> define uma interface para criar objetos, mas permite que subclasses decidam qual classe instanciar.</p>
                <ul>
                    <li>Vantagem: Baixo acoplamento (clientes não conhecem classes concretas).</li>
                    <li>Diferença para Abstract Factory: Factory Method cria UM produto, Abstract Factory cria FAMÍLIAS.</li>
                    <li>Armadilha: trocar os papéis de Creator e Product.</li>
                </ul>`,
            analogiaPokemon: `A Pokébola é uma fábrica: você usa o mesmo método (capturar()) e o resultado pode ser um Pikachu, Charmander etc., onde a lógica interna decide qual Pokémon criar.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O Factory Method deve ser implementado necessariamente como um método estático, pois sua principal função é evitar a instanciação direta de objetos."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Três erros: 1) 'Necessariamente estático' - Pode ser instanciado; 2) 'Evitar instanciação' - O foco é delegar criação; 3) Confunde com Singleton."
            }
        },
        {
            id: 7,
            titulo: "Padrão Observer",
            teoria: `<p><strong>Observer</strong> define uma dependência um-para-muitos entre objetos, onde um objeto (Subject) notifica observadores sobre mudanças.</p>
                <ul>
                    <li>Acoplamento: Subject mantém lista de Observers sem conhecer classes concretas.</li>
                    <li>Notificação push vs pull: Envia dados completos ou apenas notifica.</li>
                    <li>Armadilha: confundir com Mediator ou dizer que Observers podem bloquear o Subject.</li>
                </ul>`,
            analogiaPokemon: `Quando um Pokémon atinge nível X (Subject), a Pokédex (Observer) é notificada para atualizar registros e o professor (outro Observer) recebe notificação para dar insígnias.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No padrão Observer, o objeto observado deve necessariamente enviar todos os seus atributos para os observadores a cada notificação, garantindo consistência de dados."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Dois erros fatais: 1) 'Necessariamente enviar todos' - Pode ser apenas notificação; 2) 'Garantir consistência' - Não é responsabilidade do padrão."
            }
        }
    ]
});