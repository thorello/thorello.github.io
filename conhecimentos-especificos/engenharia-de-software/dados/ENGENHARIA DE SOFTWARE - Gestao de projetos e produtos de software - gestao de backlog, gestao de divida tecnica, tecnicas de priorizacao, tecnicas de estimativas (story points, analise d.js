todosOsDados.push({
    tituloPrincipal: "Gestão de projetos e produtos de software - gestão de backlog, gestão de dívida técnica, técnicas de priorização, técnicas de estimativas",
    conceitos: [
        // ... (os conceitos 1 a 4 anteriores permanecem iguais) ...
        {
            id: 5,
            titulo: "Análise de Pontos de Função (APF)",
            teoria: `
                <p>Método estruturado para medir tamanho funcional do software, independente de tecnologia.</p>
                <ul>
                    <li><strong>Componentes</strong>:
                        <ul>
                            <li><strong>ALI</strong> (Arquivo Lógico Interno): Dados mantidos pelo sistema (7 PF cada)</li>
                            <li><strong>AIE</strong> (Arquivo de Interface Externa): Dados compartilhados (5 PF cada)</li>
                            <li><strong>EE</strong> (Entrada Externa): Processamento de dados (3-6 PF)</li>
                            <li><strong>CE</strong> (Consulta Externa): Saídas simples (3-6 PF)</li>
                            <li><strong>SE</strong> (Saída Externa): Relatórios processados (4-7 PF)</li>
                        </ul>
                    </li>
                    <li><strong>Fórmula</strong>: PF = (ALI × 7) + (AIE × 5) + (EE × 3 a 6) + (CE × 3 a 6) + (SE × 4 a 7)</li>
                    <li><strong>Regra de Ouro</strong>: Transações primárias (EE/CE/SE) têm precedência sobre secundárias</li>
                </ul>
                <p><strong>Exemplo Prático</strong> (Pokédex):</p>
                <ol>
                    <li>ALI: Banco de Pokémon (7 PF)</li>
                    <li>AIE: Integração com Pokébank (5 PF)</li>
                    <li>EE: Cadastrar Pokémon (4 PF - médio)</li>
                    <li>CE: Buscar por tipo (3 PF - simples)</li>
                    <li>SE: Relatório de Pokémon raros (5 PF - médio)</li>
                </ol>
                <p><strong>Total</strong>: 7 + 5 + 4 + 3 + 5 = <u>24 PF</u></p>`,
            analogiaPokemon: "APF é como montar uma Pokédex: ALI = estoque de Pokébolas, AIE = troca com outros treinadores, EE = capturar Pokémon, CE = consultar habilidades, SE = emitir certificado de captura.",
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "No cálculo de Pontos de Função, uma Entrada Externa (EE) que atualiza dois Arquivos Lógicos Internos (ALIs) deve ser contabilizada como três pontos: um para a EE e um para cada ALI atualizado."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "A EE conta apenas uma vez (4 PF se média), mesmo afetando múltiplos ALIs (já contabilizados separadamente). A pegadinha está em somar ALIs como PF adicionais. Correto: 1 EE (4 PF) + 2 ALIs (7 PF cada) = 18 PF."
            }
        },
        {
            id: 6,
            titulo: "Cálculo Detalhado de Pontos de Função",
            teoria: `
                <p><strong>Passo a Passo para Cálculo:</strong></p>
                <ol>
                    <li><strong>Identificar componentes</strong>: Listar todos ALIs, AIEs, EEs, CEs e SEs</li>
                    <li><strong>Classificar complexidade</strong>:
                        <table border="1">
                            <tr><th>Componente</th><th>Simples</th><th>Médio</th><th>Complexo</th></tr>
                            <tr><td>EE</td><td>3 PF</td><td>4 PF</td><td>6 PF</td></tr>
                            <tr><td>CE</td><td>3 PF</td><td>4 PF</td><td>6 PF</td></tr>
                            <tr><td>SE</td><td>4 PF</td><td>5 PF</td><td>7 PF</td></tr>
                        </table>
                    </li>
                    <li><strong>Aplicar Fator de Ajuste</strong> (0-35%):
                        <ul>
                            <li>Considera características técnicas (ex: performance crítica, segurança)</li>
                            <li>Fórmula: PF Ajustado = PF Não Ajustado × (0.65 + 0.01 × Total de Influências)</li>
                        </ul>
                    </li>
                </ol>
                <p><strong>Exemplo Completo</strong> (Sistema de Vendas):</p>
                <ul>
                    <li>2 ALIs (7 PF cada) = 14 PF</li>
                    <li>1 AIE (5 PF) = 5 PF</li>
                    <li>3 EEs (2 médias = 8 PF, 1 complexa = 6 PF) = 14 PF</li>
                    <li>Fator de Ajuste (20%) = (14+5+14) × 1.20 = <u>39.6 PF</u></li>
                </ul>`,
            analogiaPokemon: "Como calcular o poder total de um time Pokémon: cada tipo (Água, Fogo, etc.) equivale a um componente (ALI/AIE), e cada ataque (EE/CE/SE) tem peso diferente conforme seu PP (Poder de Pontos).",
            assertiva: {
                fonte: "(CESPE/CEBRASPE - Concurso Fictício/2025 - Adaptada)",
                texto: "O Fator de Ajuste na APF pode reduzir o total de Pontos de Função em até 35%, sendo obrigatório sua aplicação mesmo em projetos simples."
            },
            analise: {
                gabarito: "ERRADO",
                explicacao: "O Fator de Ajuste pode AUMENTAR (até +35%) ou DIMINUIR (até -35%) os PF. Além disso, não é obrigatório - projetos podem usar PF Não Ajustados. A assertiva erra nos dois aspectos."
            }
        }
    ]
});