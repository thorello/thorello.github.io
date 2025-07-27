# Função auxiliar para determinar o nível de indentação de uma linha
# Conta o número de espaços em branco no início da linha.
function Get-IndentationLevel {
    param(
        [string]$Line
    )
    if ($Line -match '^(?<indent>\s*)') {
        return $Matches.indent.Length
    }
    return 0
}

# Função principal para converter o texto indentado em uma estrutura de dados de mapa mental
# Lê um arquivo de texto e o converte em um objeto PowerShell que pode ser serializado para JSON
# no formato de mapa mental desejado (name, children).
function Convert-IndentedTextToMindMapData {
    param(
        [string]$FilePath
    )

    Write-Host "Iniciando a leitura do arquivo: $FilePath"
    # Lê o conteúdo do arquivo linha por linha
    $content = Get-Content -Path $FilePath -Encoding UTF8 -ErrorAction Stop # Garantindo UTF8 na leitura
    Write-Host "Arquivo lido com sucesso. Total de linhas: $($content.Count)"

    # Inicializa o nó raiz do mapa mental. Será a primeira linha não vazia de nível 0.
    $rootNode = $null
    # A pilha (Stack) é usada para rastrear os nós pais na hierarquia.
    # Cada item na pilha é um objeto PowerShell que representa um nó do mapa mental,
    # incluindo uma propriedade '_level' interna para controle de indentação.
    $nodeStack = New-Object System.Collections.Generic.Stack[PSObject]

    foreach ($line in $content) {
        $trimmedLine = $line.Trim()
        # Ignora linhas vazias ou que contêm apenas espaços em branco
        if ([string]::IsNullOrWhiteSpace($trimmedLine)) {
            continue
        }

        # Obtém o nível de indentação da linha atual
        $level = Get-IndentationLevel -Line $line

        # Cria um objeto PowerShell para o nó atual.
        # '_level' é uma propriedade temporária para o algoritmo de indentação,
        # 'name' e 'children' são para o formato de saída JSON.
        $currentNode = [PSCustomObject]@{
            name = $trimmedLine
            children = @() # Inicializa o array de filhos
            _level = $level # Propriedade interna para controle de indentação
        }

        # Se 'rootNode' ainda não foi definido, este é o primeiro nó (o nó raiz principal).
        if ($rootNode -eq $null) {
            $rootNode = $currentNode
            [void]$nodeStack.Push($currentNode) # Suprime a saída do Push
            continue # Vai para a próxima linha
        }

        # Ajusta a pilha: Remove os nós do topo da pilha que não são mais pais do nó atual.
        # Isso acontece quando o nível de indentação do nó atual é menor ou igual
        # ao nível do nó no topo da pilha, indicando que estamos "subindo" na hierarquia
        # ou permanecendo no mesmo nível de um irmão.
        while ($nodeStack.Count -gt 0 -and $level -le $nodeStack.Peek()._level) {
            [void]$nodeStack.Pop() # Suprime a saída do Pop
        }

        # O nó que agora está no topo da pilha é o pai do nó atual.
        if ($nodeStack.Count -gt 0) {
            $parentNode = $nodeStack.Peek()
            # CORREÇÃO: Adiciona o currentNode diretamente à lista de filhos do pai e suprime a saída.
            [void]($parentNode.children += $currentNode)
        } else {
            # Este bloco é executado se um nó de nível 0 (ou seja, sem indentação)
            # for encontrado após o nó raiz principal já ter sido definido.
            # Para um mapa mental com um único nó raiz, isso pode indicar um erro na entrada
            # ou uma estrutura de dados que não se encaixa no formato de saída desejada.
            # Para este problema específico, assumimos que a primeira linha é o único nó raiz.
            Write-Warning "Nó de nível 0 encontrado sem pai: '$trimmedLine'. Certifique-se de que a estrutura de entrada tenha um único nó raiz."
            # Neste caso, o nó não será adicionado ao mapa mental final, pois não tem um pai válido.
            # Se a intenção fosse ter múltiplos mapas mentais, a lógica aqui seria diferente.
        }

        # Adiciona o nó atual à pilha para que ele possa ser o pai de nós futuros.
        [void]$nodeStack.Push($currentNode) # Suprime a saída do Push
    }

    # Função auxiliar recursiva para remover a propriedade '_level' de todos os nós
    # na estrutura de dados, garantindo que o JSON final esteja limpo.
    function Clean-NodeProperties {
        param(
            [PSObject]$Node
        )
        # Cria um novo objeto limpo com apenas 'name'
        $cleanNode = [PSCustomObject]@{
            name = $Node.name
        }
        # Se o nó tem filhos, limpa recursivamente os filhos e os adiciona ao novo nó
        if ($Node.children.Count -gt 0) {
            $cleanedChildren = @()
            foreach ($child in $Node.children) {
                [void]($cleanedChildren += (Clean-NodeProperties -Node $child)) # Suprime a saída da adição
            }
            $cleanNode | Add-Member -MemberType NoteProperty -Name "children" -Value $cleanedChildren
        }
        return $cleanNode
    }

    # Aplica a limpeza ao nó raiz final antes da conversão para JSON
    Write-Host "Aplicando limpeza de propriedades e preparando para JSON..."
    $finalRootNode = Clean-NodeProperties -Node $rootNode

    # Converte a estrutura de dados do PowerShell para uma string JSON.
    # -Depth 100 garante que todas as sub-árvores sejam incluídas.
    # -Compress remove espaços em branco extras para que possamos formatar manualmente depois.
    $jsonOutput = $finalRootNode | ConvertTo-Json -Depth 100 -Compress
    Write-Host "JSON inicial gerado (comprimido)."

    # Converte o JSON para um objeto PowerShell novamente e depois de volta para JSON.
    # REMOVIDO: '-Indent 4' para compatibilidade com versões mais antigas do PowerShell.
    $formattedJson = $jsonOutput | ConvertFrom-Json | ConvertTo-Json -Depth 100
    Write-Host "JSON formatado (sem indentação automática do PowerShell antigo)."

    # Formata a string JSON na declaração de variável JavaScript desejada.
    $jsOutput = "const mindMapData = $($formattedJson);"
    Write-Host "Saída JavaScript final pronta."

    return $jsOutput
}

# --- Script Principal ---

# Define o caminho para o arquivo de entrada (onde sua árvore indentada está)
$inputFilePath = "tree.txt"
# Define o caminho para o arquivo de saída (onde o JavaScript será salvo)
$outputFilePath = "result.txt" # Alterado para result.txt

# Bloco try/finally para garantir que o console pause no final
try {
    # --- Geração dos Dados do Mapa Mental ---
    # Chama a função principal para converter o arquivo 'tree.txt'
    try {
        # Verifica se o arquivo de entrada existe antes de tentar lê-lo
        Write-Host "Verificando a existência do arquivo de entrada: $inputFilePath"
        if (-not (Test-Path -Path $inputFilePath)) {
            Write-Error "ERRO: O arquivo de entrada '$inputFilePath' não foi encontrado. Por favor, certifique-se de que ele existe no mesmo diretório do script ou forneça o caminho completo."
            exit 1 # Sai do script se o arquivo não for encontrado
        }
        Write-Host "Arquivo de entrada '$inputFilePath' encontrado."

        $mindMapJs = Convert-IndentedTextToMindMapData -FilePath $inputFilePath
        
        # Verifica se a saída da conversão não está vazia
        if ([string]::IsNullOrEmpty($mindMapJs)) {
            Write-Error "ERRO: A conversão do mapa mental resultou em uma string vazia. O arquivo 'result.txt' não será criado."
            exit 1 # Sai do script se a saída for vazia
        }

        Write-Host "Tentando gravar o conteúdo no arquivo: $outputFilePath"
        # Salva o resultado no arquivo JavaScript de saída
        Set-Content -Path $outputFilePath -Value $mindMapJs -Encoding UTF8 -ErrorAction Stop # Adicionado -ErrorAction Stop
        Write-Host "Arquivo '$outputFilePath' gerado com sucesso!"
    } catch [System.IO.IOException] {
        Write-Error "ERRO de E/S ao gravar o arquivo '$outputFilePath': $($_.Exception.Message). Verifique as permissões de gravação no diretório."
        # Não sai aqui para que o bloco finally seja executado
    } catch {
        Write-Error "ERRO inesperado ao gerar os dados do mapa mental: $($_.Exception.Message)"
        # Não sai aqui para que o bloco finally seja executado
    }

    # --- Exibição do Conteúdo Gerado ---
    # Exibe o conteúdo do arquivo 'result.txt' no console para verificação.
    Write-Host "`n--- Conteúdo de '$outputFilePath' ---"
    try {
        # Verifica se o arquivo foi realmente criado antes de tentar lê-lo
        if (Test-Path -Path $outputFilePath) {
            Get-Content -Path $outputFilePath -Encoding UTF8 -ErrorAction Stop # Garantindo UTF8 na leitura para exibição
        } else {
            Write-Warning "AVISO: O arquivo '$outputFilePath' não foi encontrado para exibição. Pode ter ocorrido um erro anterior."
        }
    } catch {
        Write-Error "ERRO: Não foi possível ler o conteúdo de '$outputFilePath' para exibição: $($_.Exception.Message)"
    }
    Write-Host "------------------------------------"

} finally {
    # Adiciona uma pausa no final para manter o console aberto, independentemente de erros
    Write-Host "`nPressione qualquer tecla para sair..."
    $null = Read-Host
}
