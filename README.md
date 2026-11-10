# PEI Inteligente

Plataforma web de apoio à elaboração de propostas de Plano Educacional Individualizado (PEI), com geração assistida por Inteligência Artificial.

**Página do projeto:** https://brenner279.github.io/assistente/

## Primeira versão

- Formulário para registro de informações pedagógicas.
- Campos de potencialidades, interesses, comunicação, autonomia, participação, barreiras, habilidades e objetivos.
- Seleção de estratégias, adaptações e recursos disponíveis.
- Modelo demonstrativo local, que funciona sem IA.
- Área de relatório com opção de copiar e imprimir/salvar em PDF pelo navegador.
- API em Cloudflare Worker para manter a chave de IA fora do código público.

## Arquitetura

- Interface: HTML, CSS e JavaScript, publicada pelo GitHub Pages.
- API: Cloudflare Worker, arquivo worker.js.
- Modelo: OpenAI Responses API. O padrão inicial é gpt-6-luna e pode ser alterado na variável OPENAI_MODEL.
- Dados: a página não salva os formulários de estudantes no navegador. Apenas o endereço da API é salvo localmente para facilitar a configuração.

## Publicar a página

Confira em Settings → Pages se o GitHub Pages está habilitado, usando a branch main e a pasta raiz (/). A página deve ficar disponível em:

https://brenner279.github.io/assistente/

## Configurar a integração com IA

A página estática não deve conter uma chave secreta. A integração utiliza um Cloudflare Worker como servidor intermediário.

1. Crie uma conta Cloudflare e instale Node.js e Wrangler no computador.
2. Na pasta do projeto, autentique o Wrangler:

   npx wrangler login

3. Cadastre a chave da OpenAI como segredo do Worker. Não coloque a chave no GitHub:

   npx wrangler secret put OPENAI_API_KEY

4. Publique o Worker:

   npx wrangler deploy

5. O Wrangler exibirá um endereço semelhante a:

   https://pei-inteligente-api.seu-subdominio.workers.dev

6. Abra a página do PEI Inteligente, expanda “Configuração da conexão com a IA” e informe a URL completa terminando em /gerar-pei. Exemplo:

   https://pei-inteligente-api.seu-subdominio.workers.dev/gerar-pei

7. Salve o endereço e teste a geração com dados fictícios, sem informações identificáveis de estudantes.

Para trocar o modelo, altere OPENAI_MODEL no painel do Worker ou em wrangler.toml e publique novamente.

## Segurança e privacidade

Este repositório é público. Nunca grave chaves de API, senhas, nomes completos de estudantes, laudos ou documentos individuais no GitHub.

O formulário foi pensado para receber informações pedagógicas minimizadas. Use códigos ou iniciais; não informe CPF, endereço, telefone, documentos clínicos ou outros identificadores. A página não persiste o conteúdo do formulário. Ao acionar a IA, os campos preenchidos são enviados ao Worker e encaminhados à OpenAI para processamento. Consulte as políticas e configurações de retenção do provedor e as regras da rede de ensino antes de utilizar dados reais. Segundo a documentação da OpenAI, os dados enviados pela API não são usados para treinar ou melhorar os modelos por padrão; registros de monitoramento de abuso podem, contudo, conter conteúdo da solicitação e ser retidos por até 30 dias, salvo exceções descritas pelo provedor. O uso da API é cobrado separadamente da assinatura do ChatGPT e requer configuração própria de faturamento.

O Worker aplica validação de campos, limite de tamanho e restrição básica de origem (CORS). CORS não é autenticação e não impede chamadas feitas por scripts ou clientes externos. Antes de divulgar amplamente a página para uso público, implemente autenticação/controle de acesso, limitação de requisições e monitoramento de custos.

A adequação à LGPD, a definição da base legal, a transparência, os consentimentos ou demais providências aplicáveis devem ser avaliados pela instituição responsável e seu encarregado de dados. Dados de crianças e adolescentes exigem atenção especial ao melhor interesse e às regras legais aplicáveis.

## Uso pedagógico responsável

O relatório é uma proposta inicial de apoio, não um PEI automaticamente validado. O professor e a equipe escolar devem revisar e contextualizar objetivos, adaptações, atividades, critérios de avaliação e responsabilidades. A ferramenta não realiza diagnóstico, não substitui avaliação profissional e não deve decidir sozinha sobre atendimento, matrícula, promoção, retenção ou elegibilidade a serviços.

## Estrutura do repositório

- index.html — interface e estilos.
- app.js — formulário, demonstração local, integração e exportação por impressão.
- worker.js — endpoint de integração com a OpenAI.
- wrangler.toml — configuração de publicação do Worker.
- README.md — documentação.

## Próximas evoluções

- Edição do relatório antes da exportação.
- Modelos por etapa de ensino e componente curricular.
- Banco de atividades adaptadas por habilidade.
- Histórico de versões com armazenamento seguro e consentimento institucional.
- Autenticação de professores e perfis de acesso.
- Exportação DOCX com identidade visual da escola.
- Avaliação de qualidade pedagógica com professores e profissionais do AEE.
