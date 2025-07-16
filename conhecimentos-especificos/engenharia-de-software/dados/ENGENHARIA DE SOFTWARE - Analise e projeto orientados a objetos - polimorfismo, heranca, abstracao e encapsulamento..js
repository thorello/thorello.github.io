todosOsDados.push({
    tituloPrincipal: "Análise e projeto orientados a objetos - polimorfismo, herança, abstração e encapsulamento",
    conceitos: [
        {
            id: 1,
            titulo: "Polimorfismo",
            teoria: `
                <p><strong>Polimorfismo</strong> permite que um mesmo método ou operação seja implementado de formas diferentes em classes distintas, desde que compartilhem uma hierarquia de herança ou interface comum.</p>
                <ul>
                    <li><strong>Polimorfismo de Sobrescrita (Override)</strong>: Redefinição de método em subclasse com mesma assinatura da superclasse.</li>
                    <li><strong>Polimorfismo de Sobrecarga (Overload)</strong>: Múltiplos métodos com mesmo nome, mas parâmetros diferentes (não suportado em todas as linguagens, como Python).</li>
                </ul>`,
            analogiaPokemon: `Um Pikachu e um Raichu (sua evolução) usam o mesmo ataque "Thunderbolt", mas com potências diferentes. O método (ataque) é o mesmo, mas a implementação (dano) varia conforme a evolução (classe filha).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O polimorfismo de sobrecarga (overload) ocorre quando uma subclasse redefine um método da superclasse com a mesma assinatura, porém com comportamento distinto, como no caso do método 'atacar()' em Pokémon, onde Pikachu e Charizard implementam o mesmo método de formas diferentes."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva troca os conceitos de sobrecarga (overload) e sobrescrita (override). Sobrecarga exige métodos com parâmetros diferentes, enquanto sobrescrita mantém a mesma assinatura. O exemplo descreve sobrescrita, não sobrecarga."
            }
        },
        {
            id: 2,
            titulo: "Herança",
            teoria: `<p><strong>Herança</strong> é um mecanismo que permite que uma classe (subclasse) herde atributos e métodos de outra (superclasse).</p>
                <ul>
                    <li><strong>Herança única vs. múltipla</strong>: Java suporta apenas herança única (uma superclasse), enquanto Python permite múltipla.</li>
                    <li><strong>Classes abstratas</strong>: Métodos abstratos devem ser obrigatoriamente implementados pelas subclasses.</li>
                </ul>`,
            analogiaPokemon: `Eevee é a superclasse, e suas evoluções (Vaporeon, Jolteon, etc.) são subclasses que herdam atributos base (HP, velocidade) mas adicionam habilidades únicas (tipo Água, Elétrico).`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Em Java, uma subclasse herda automaticamente o construtor da superclasse, podendo ser instanciada sem a necessidade de definir um construtor próprio, desde que a superclasse tenha um construtor padrão (sem parâmetros)."
            },
            analise: {
                gabarito: "CERTO",
                explicacao: "A assertiva está correta, mas é uma pegadinha sutil: a herança de construtor só ocorre se a superclasse tiver um construtor padrão (sem parâmetros). Se a superclasse tiver apenas construtores parametrizados, a subclasse deve explicitamente chamar um deles via super()."
            }
        },
        {
            id: 3,
            titulo: "Abstração",
            teoria: `<p><strong>Abstração</strong> é a modelagem de entidades com foco nos aspectos essenciais, ignorando detalhes irrelevantes.</p>
                <ul>
                    <li><strong>Classes abstratas</strong>: Não podem ser instanciadas diretamente; servem como 'modelos' para subclasses.</li>
                    <li><strong>Métodos abstratos</strong>: Sem implementação na superclasse; obrigatórios nas subclasses.</li>
                </ul>`,
            analogiaPokemon: `Pokémon é uma classe abstrata com métodos abstratos como evoluir(). Cada espécie (Pikachu, Bulbasaur) implementa evoluir() de forma única, mas não faz sentido instanciar um "Pokémon genérico".`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "Classes abstratas e interfaces são intercambiáveis, pois ambas permitem a declaração de métodos abstratos e não podem ser instanciadas diretamente, sendo a única diferença que interfaces suportam herança múltipla."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A assertiva generaliza indevidamente. Interfaces não podem ter métodos concretos (antes do Java 8), enquanto classes abstratas podem. Além disso, interfaces definem contratos, enquanto classes abstratas podem ter estado (atributos)."
            }
        },
        {
            id: 4,
            titulo: "Encapsulamento",
            teoria: `<p><strong>Encapsulamento</strong> protege os dados internos de um objeto, expondo apenas o necessário via métodos públicos.</p>
                <ul>
                    <li><strong>Modificadores de acesso</strong>: private (só na classe), protected (classe e subclasses), public (todos).</li>
                    <li><strong>Getters/Setters</strong>: Padrão para controle de acesso indireto a atributos.</li>
                </ul>`,
            analogiaPokemon: `O PC do Professor Carvalho encapsula os Pokémon (atributos privados). Você só pode acessá-los via métodos públicos ("Liberar Pokémon" ou "Retirar Pokémon").`,
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O encapsulamento em POO garante que atributos declarados como 'protected' em uma superclasse sejam acessíveis apenas por métodos dessa mesma superclasse, não podendo ser herdados ou modificados por subclasses."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "O erro está em afirmar que protected restringe o acesso apenas à superclasse. Na verdade, protected permite acesso pela superclasse e suas subclasses, mas não por classes externas."
            }
        }
    ]
});