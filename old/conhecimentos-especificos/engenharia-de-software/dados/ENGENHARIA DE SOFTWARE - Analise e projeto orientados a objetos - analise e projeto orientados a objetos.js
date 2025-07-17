todosOsDados.push({
    tituloPrincipal: "Análise e projeto orientados a objetos",
    conceitos: [
        {
            id: 1,
            titulo: "Abstração",
            teoria: `
                <p><strong>Abstração</strong> é o processo de identificar e modelar apenas os aspectos essenciais de um sistema, ignorando detalhes irrelevantes para o contexto. Na orientação a objetos, isso se traduz em classes que representam entidades do mundo real, focando em atributos e comportamentos críticos.</p>
                <ul>
                    <li>Diferença chave: <strong>abstração</strong> (foco no "o quê") vs <strong>encapsulamento</strong> (foco no "como")</li>
                    <li>Não confundir com generalização (herança)</li>
                    <li>Seleciona o que é relevante para o domínio do problema</li>
                </ul>`,
            analogiaPokemon: `Uma Pokedex abstrai um Pokémon para dados essenciais (tipo, HP, ataques), ignorando detalhes como padrões de escama ou hábitos alimentares. Assim como uma classe "Pokémon" não modela quantas vezes o Pikachu pisca por minuto.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A abstração em POO consiste em esconder detalhes de implementação de um objeto, permitindo que apenas suas operações públicas sejam acessadas, o que garante segurança e modularidade."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva descreve encapsulamento, não abstração. A pegadinha está na troca sutil de conceitos: abstração seleciona o que é relevante; encapsulamento protege a implementação. Cebraspe frequentemente testa definições próximas para confundir candidatos."
            }
        },
        {
            id: 2,
            titulo: "Herança vs. Composição",
            teoria: `<p><strong>Herança</strong> (relação "é-um") e <strong>Composição</strong> (relação "tem-um") são mecanismos distintos para reuso de código.</p>
                <ul>
                    <li>Herança: acoplamento forte, problemas em hierarquias profundas</li>
                    <li>Composição: maior flexibilidade, preferida quando não há relação clara de generalização/especialização</li>
                    <li>Princípio: "Preferir composição sobre herança" (GoF)</li>
                </ul>`,
            analogiaPokemon: `Herança: Um Charmander é um Fogo, que é um Pokémon. Composição: Uma Pokébola tem um MecanismoDeCaptura, mas não é um MecanismoDeCaptura.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "A composição deve ser preferida sobre a herança sempre que possível, pois reduz o acoplamento e permite maior flexibilidade, mesmo quando há uma relação de generalização/especialização clara entre as entidades."
            },
            analise: {
                gabarito: "CERTO",
                explicacao: "A assertiva está correta, mas a pegadinha está no 'sempre que possível'. A exceção seria quando a relação é claramente 'é-um' (ex.: Cachorro é um Animal). Cebraspe testa se o candidato conhece os limites do princípio."
            }
        },
        {
            id: 3,
            titulo: "Polimorfismo",
            teoria: `<p><strong>Polimorfismo</strong> permite que um mesmo método tenha comportamentos diferentes em classes relacionadas.</p>
                <ul>
                    <li>Sobrescrita (override): redefinição em subclasses com mesma assinatura</li>
                    <li>Sobrecarga (overload): mesmo nome, parâmetros diferentes (nem todas linguagens suportam)</li>
                    <li>Nuance crucial: assinaturas na sobrescrita devem ser idênticas</li>
                </ul>`,
            analogiaPokemon: `Um AtaqueRápido pode ser executado de formas diferentes: Pidgey usa asas, Ekans usa velocidade corporal. Mesmo ataque, implementações distintas.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O polimorfismo por sobrecarga ocorre quando uma subclasse redefine um método da superclasse, mantendo a mesma assinatura, mas alterando apenas o corpo do método."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva descreve sobrescrita, não sobrecarga. Cebraspe explora a confusão entre os termos: sobrescrita = mesma assinatura em classes diferentes; sobrecarga = assinaturas diferentes na mesma classe."
            }
        },
        {
            id: 4,
            titulo: "Princípios SOLID",
            teoria: `<p><strong>SOLID</strong> são 5 princípios fundamentais de design OO:</p>
                <ol>
                    <li><strong>S</strong>ingle Responsibility: uma classe = uma responsabilidade</li>
                    <li><strong>O</strong>pen-Closed: aberta para extensão, fechada para modificação</li>
                    <li><strong>L</strong>iskov Substitution: subclasses devem ser substituíveis</li>
                    <li><strong>I</strong>nterface Segregation: muitas interfaces específicas > uma geral</li>
                    <li><strong>D</strong>ependency Inversion: depender de abstrações, não implementações</li>
                </ol>`,
            analogiaPokemon: `Exemplo Liskov: Um Magikarp não pode substituir um Gyarados em batalha. Exemplo Single Responsibility: Um CurandeiroPokémon não deve gerenciar inventário de itens.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O princípio de inversão de dependência determina que módulos de alto nível não devem depender de módulos de baixo nível, mas ambos devem depender de interfaces concretas, garantindo maior testabilidade."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "O erro crucial está em 'interfaces concretas'. O correto é 'abstrações' (interfaces/classes abstratas). Cebraspe testa o entendimento preciso da dependência em abstrações."
            }
        },
        {
            id: 5,
            titulo: "Padrão de Projeto Strategy",
            teoria: `<p><strong>Strategy</strong> define uma família de algoritmos intercambiáveis, permitindo variar comportamentos dinamicamente.</p>
                <ul>
                    <li>Implementado via composição (não herança)</li>
                    <li>Diferente de Template Method (que usa herança)</li>
                    <li>Contexto mantém referência para estratégia atual</li>
                </ul>`,
            analogiaPokemon: `Um TreinadorPokémon pode alternar entre estratégias de batalha (Agressiva, Defensiva, Esquiva) sem alterar sua classe, usando composição.`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O padrão Strategy é implementado via herança, onde subclasses sobrescrevem métodos para fornecer diferentes comportamentos, promovendo reuso de código através de hierarquias de classes."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "Strategy usa composição/delegação, não herança. A pegadinha é atribuir características do Template Method ao Strategy. Cebraspe explora confusões entre padrões estruturais."
            }
        }
    ]
});