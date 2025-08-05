// meu-tema-mermaid.js

/**
 * Arquivo de configuração de tema para o Mermaid.js.
 * Este tema será aplicado a todos os diagramas renderizados na página.
 */
mermaid.initialize({
    // 'startOnLoad: false' é importante aqui, pois o diagrama é gerado
    // por um botão, e não automaticamente ao carregar a página.
    startOnLoad: false,

    // Usamos 'base' para poder sobrescrever as variáveis com nossas cores.
    theme: 'base',

    // Aqui estão todas as suas variáveis de tema customizadas.
    themeVariables: {
        primaryColor: '#e9f5f5',
        primaryTextColor: '#003b5c',
        primaryBorderColor: '#0a9396',
        lineColor: '#495057',
        secondaryColor: '#cae9ff',
        tertiaryColor: '#f8f9fa',
        nodeBkg: '#cae9ff',
        nodeTextColor: '#003b5c',
        nodeBorder: '#89c2d9',
        mainBkg: '#ffffff',
        textColor: '#343a40',
        errorBkgColor: '#ffcdd2',
        errorTextColor: '#b71c1c',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: '12px',
        edgeLabelBackground: '#ffffff'
    },

    // Adiciona as configurações de fluxograma do HTML original,
    // garantindo que elas sejam aplicadas.
    flowchart: {
        useMaxWidth: false,
        htmlLabels: false,
        padding: 15
    }
});