# PEI Inteligente para Windows

Aplicativo desktop que abre a interface oficial do PEI Inteligente em uma janela própria do Windows.

## Requisitos

- Windows 10 ou Windows 11, 64 bits.
- Conexão com a internet.
- Não exige instalação de Node.js para o usuário final.

## Como funciona

A interface do PEI é carregada de `https://brenner279.github.io/assistente/`. A geração de propostas continua sendo feita pelos serviços online já configurados no projeto (Cloudflare Workers AI e Groq, conforme o modo selecionado).

O aplicativo não contém chaves de API. Ele apenas apresenta o site oficial em uma janela desktop. Assim, atualizações publicadas no site ficam disponíveis no aplicativo sem precisar reinstalar o programa.

## Gerar o instalador

O workflow `.github/workflows/build-windows-desktop.yml` compila o aplicativo em um runner Windows e publica o instalador como artefato do GitHub Actions.

O arquivo gerado tem o padrão:

`PEI-Inteligente-Setup-1.0.0-x64.exe`

## Privacidade e conectividade

- A conexão com a internet é obrigatória.
- Os PDFs e dados enviados pelo usuário seguem o fluxo online do site e são processados pela API configurada no Worker.
- O instalador não inclui uma chave secreta da Groq ou de qualquer outro provedor.
- Não use documentos reais de estudantes até que a rede de ensino valide a base legal, as autorizações, os avisos de privacidade, o fluxo de dados e as regras de retenção aplicáveis.
- O PEI gerado permanece uma proposta preliminar e requer revisão e validação da equipe escolar.

## Segurança da janela desktop

O conteúdo do site é aberto em um componente WebView isolado, sem acesso ao Node.js. Permissões do sistema são negadas por padrão; links HTTPS externos são abertos no navegador padrão.
