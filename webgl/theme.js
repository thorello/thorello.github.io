export const lightTheme = {
    // Cores
    backgroundColor: 0xF4F4F5,

    // Paleta de cores fortes para as BORDAS das ramificações
    branchBorderColors: [
        0xE53935, // Vermelho Forte
        0x43A047, // Verde Escuro
        0xFB8C00, // Laranja
        0x8E24AA, // Roxo
        0xD81B60, // Pink
        0x00897B, // Verde-azulado (Teal)
        0x7CB342, // Verde Limão
        0xFDD835, // Amarelo Queimado (Gold)
        0x6D4C41, // Marrom
        0x5E35B1  // Índigo
    ],

    // A cor de fundo dos nós agora é padrão para TODOS os nós
    nodeBackgroundColor: 0xF4F4F5,

    linkColor: 0x4B5563,
    dragHandleColor: 0x111827,
    textColor: 0x111827, // Cor de texto padrão para TODOS os nós
    highlightColor: 0x3498db, // Cor de destaque ao selecionar um nó

    // A cor da BORDA do nó raiz
    rootNodeBorderColor: 0x3498db,

    // Outras configurações
    font: {
        size: 16,
        characterWidth: 0.5,
    },
    padding: { x: 30, y: 10 },
    borderRadius: 20,
    dragHandleRadius: 6,
    zoom: {
        speed: 0.2,
        min: 0.05,
        max: 8,
    },
    verticalNodeSpacingDetailed: 180,
    verticalNodeSpacingSimple: 100,
    horizontalNodeSpacing: 400,
    FIXED_NODE_CHARACTER_LIMIT: 35,
    FIXED_NODE_HEIGHT_MULTIPLIER: 2.5,
};

// Exemplo de um tema escuro
export const darkTheme = {
    ...lightTheme,

    // Sobrescreve as cores para o tema escuro
    backgroundColor: 0x111827,
    nodeBackgroundColor: 0x111827,
    linkColor: 0x9CA3AF,
    dragHandleColor: 0xF9FAFB,
    textColor: 0xF9FAFB,
    highlightColor: 0x14B8A6,

    // Cor da BORDA do nó raiz no tema escuro
    rootNodeBorderColor: 0x2563EB,
};