export const lightTheme = {
    // Cores
    backgroundColor: 0xF4F4F5,
    nodeColors: [
        0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF
    ],
    linkColor: 0x4B5563,
    dragHandleColor: 0x111827,
    textColor: 0x111827,
    highlightColor: 0x3498db,
    rootNodeColor: 0x3498db,
    rootTextColor: 0xFFFFFF,
    wireframeColor: 0xCCCCCC,

    // Outras configurações (pode manter aqui ou em outro arquivo de config)
    font: {
        size: 16,
        characterWidth: 0.5,
    },
    padding: { x: 30, y: 10 },
    borderRadius: 6,
    dragHandleRadius: 6,
    zoom: {
        speed: 1,
        min: 0.05,
        max: 8,
    },
    horizontalNodePadding: 0,
    verticalNodeSpacing: 80,
    depth1HorizontalOffset: 80,
    FIXED_NODE_CHARACTER_LIMIT: 35,
    FIXED_NODE_HEIGHT_MULTIPLIER: 2.5,
};

// Exemplo de um tema escuro
export const darkTheme = {
    // Reutiliza as configurações de layout do lightTheme primeiro
    ...lightTheme,

    // Em seguida, sobrescreve apenas as cores e outras propriedades que são diferentes no tema escuro
    backgroundColor: 0x111827,
    nodeColors: [
        0x1F2937, 0x1F2937, 0x1F2937, 0x1F2937, 0x1F2937, 0x1F2937
    ],
    linkColor: 0x9CA3AF,
    dragHandleColor: 0xF9FAFB,
    textColor: 0xF9FAFB,
    highlightColor: 0x14B8A6,
    rootNodeColor: 0x2563EB,
    rootTextColor: 0xF9FAFB,
    wireframeColor: 0x4B5563,
};