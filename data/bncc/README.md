# Base curricular BNCC — PEI Inteligente

Esta pasta contém uma cópia versionada da base de dados estruturada da BNCC utilizada pelo Worker do PEI Inteligente.

## Origem e atribuição

- Projeto de dados: [bncc.dev — bncc-dados](https://github.com/bncc-dev/bncc-dados)
- Fonte normativa: documentos homologados pelo Ministério da Educação e complemento de Computação do CNE.
- Licença da compilação e curadoria: [Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.pt-br).
- Atribuição exigida: **bncc.dev (mantido pela Profy)**, com link para https://github.com/bncc-dev/bncc-dados.
- O dataset registra a proveniência de cada habilidade/objetivo, incluindo o documento e a localização da fonte oficial.

Os textos oficiais da BNCC são atos normativos públicos; a licença CC BY 4.0 cobre a compilação, a estruturação, as relações e a curadoria do dataset.

## Organização

- `current.json`: versão atualmente sincronizada.
- `releases/<versão>/dados/bncc-2018/`: Educação Infantil, Ensino Fundamental, Ensino Médio e estrutura curricular.
- `releases/<versão>/dados/computacao-2022/`: complemento de Computação.
- `releases/<versão>/dados/LICENSE.md`: licença dos dados de origem.

## Atualização

O workflow `.github/workflows/sync-bncc.yml` consulta a última versão estável publicada pelo projeto de origem, baixa os arquivos, registra a versão e faz commit no repositório. Também pode ser executado manualmente na aba **Actions** do GitHub.

## Uso no PEI Inteligente

O Worker lê `current.json`, carrega o JSON correspondente à etapa e pesquisa automaticamente por conteúdo, objetivo, etapa, ano, área e componente curricular. Os códigos e textos apresentados no PEI são recuperados da base; a IA não deve inventar referências.

A busca automática é uma sugestão de alinhamento curricular, não substitui a análise do currículo da rede e a validação do professor. No Ensino Médio, a BNCC apresenta habilidades da área para o bloco de 1º a 3º ano, sem distribuir todas as habilidades por série.

**Versão atual:** consulte `current.json`.
