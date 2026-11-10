# PEI Inteligente

Plataforma web de apoio à elaboração de propostas de Plano Educacional Individualizado (PEI), com geração assistida por Inteligência Artificial.

**Página do projeto:** https://brenner279.github.io/assistente/

## Primeira versão

- Formulário para registro de informações pedagógicas.
- Campos de potencialidades, interesses, comunicação, autonomia, participação, barreiras, habilidades e objetivos.
- Seleção de estratégias, adaptações e recursos disponíveis.
- Modelo demonstrativo local, que funciona sem IA.
- Área de relatório com opção de copiar e imprimir/salvar em PDF pelo navegador.
- API em Cloudflare Worker para manter a chave Groq fora do código público.

## Arquitetura

- Interface: HTML, CSS e JavaScript, publicada pelo GitHub Pages.
- API: Cloudflare Worker, arquivo worker.js.
- Provedor de IA: GroqCloud.
- Modelo inicial: `openai/gpt-oss-120b`, configurado em `GROQ_MODEL`.
- Endpoint: Groq Responses API (`https://api.groq.com/openai/v1/responses`).
- Dados: a página não salva os formulários de estudantes no navegador. Apenas o endereço da API é salvo localmente para facilitar a configuração.

## Publicar a página

Confira em Settings → Pages se o GitHub Pages está habilitado, usando a branch `main` e a pasta raiz (`/`). A página deve ficar disponível em:

https://brenner279.github.io/assistente/

## Configurar a IA gratuita da Groq

A página estática não deve conter uma chave secreta. A integração utiliza um Cloudflare Worker como servidor intermediário.

1. Crie uma conta gratuita em https://console.groq.com/.
2. Gere uma chave de API em https://console.groq.com/keys.
3. Crie uma conta Cloudflare e instale Node.js e Wrangler no computador.
4. Na pasta do projeto, autentique o Wrangler:

   ```bash
   npx wrangler login
   ```

5. Cadastre a chave Groq como segredo do Worker. Não coloque a chave no GitHub:

   ```bash
   npx wrangler secret put GROQ_API_KEY
   ```

6. Publique o Worker:

   ```bash
   npx wrangler deploy
   ```

7. O Wrangler exibirá um endereço semelhante a:

   `https://pei-inteligente-api.seu-subdominio.workers.dev`

8. Abra a página do PEI Inteligente, expanda “Configuração da conexão com a IA” e informe a URL completa terminando em `/gerar-pei`. Exemplo:

   `https://pei-inteligente-api.seu-subdominio.workers.dev/gerar-pei`

9. Salve o endereço e teste a geração com informações fictícias, sem dados pessoais de estudantes.

O modelo padrão pode ser alterado pela variável `GROQ_MODEL` no painel do Worker ou em `wrangler.toml`. Consulte a disponibilidade e as cotas atuais do modelo na documentação da Groq.

## Plano gratuito e limites

A Groq oferece uma modalidade gratuita para desenvolvimento com cotas por modelo e organização. Os limites podem mudar e devem ser confirmados no painel da conta. A documentação consultada apresenta, para o modelo `openai/gpt-oss-120b`, referência de até 30 requisições por minuto, 1.000 por dia, 8.000 tokens por minuto e 200.000 tokens por dia. Esses limites não representam capacidade garantida para produção e requisições maiores podem consumir a cota de tokens rapidamente.

Documentação: https://console.groq.com/docs/rate-limits

## Segurança e privacidade

Este repositório é público. Nunca grave chaves de API, senhas, nomes completos de estudantes, laudos ou documentos individuais no GitHub.

A Groq informa que não usa entradas e saídas de clientes para treinar seus modelos próprios. Por padrão, dados de inferência não são retidos, mas podem ser temporariamente registrados por até 30 dias para solucionar problemas de confiabilidade ou investigar abuso. A Groq oferece opção de Zero Data Retention (ZDR) nas configurações de dados da conta. A documentação também informa que dados retidos são armazenados em infraestrutura nos Estados Unidos.

- Política de dados Groq: https://console.groq.com/docs/your-data
- Controles de dados: https://console.groq.com/settings/data-controls

O formulário foi pensado para receber informações pedagógicas minimizadas. Use códigos ou iniciais; não informe CPF, endereço, telefone, documentos clínicos ou outros identificadores. A página não persiste o conteúdo do formulário. Ao acionar a IA, os campos preenchidos são enviados ao Worker e encaminhados à Groq para processamento.

O Worker aplica validação de campos, limite de tamanho e restrição básica de origem (CORS). CORS não é autenticação e não impede chamadas feitas por scripts ou clientes externos. Antes de divulgar amplamente a página para uso público, implemente autenticação/controle de acesso, limitação de requisições e monitoramento de uso.

A adequação à LGPD, a definição da base legal, a transparência, os consentimentos ou demais providências aplicáveis devem ser avaliados pela instituição responsável e seu encarregado de dados. Dados de crianças e adolescentes exigem atenção especial ao melhor interesse e às regras legais aplicáveis. O uso da API gratuita não substitui essa análise.

## Uso pedagógico responsável

O relatório é uma proposta inicial de apoio, não um PEI automaticamente validado. O professor e a equipe escolar devem revisar e contextualizar objetivos, adaptações, atividades, critérios de avaliação e responsabilidades. A ferramenta não realiza diagnóstico, não substitui avaliação profissional e não deve decidir sozinha sobre atendimento, matrícula, promoção, retenção ou elegibilidade a serviços.

## Estrutura do repositório

- `index.html` — interface e estilos.
- `app.js` — formulário, demonstração local, integração e impressão.
- `worker.js` — endpoint seguro de integração com a Groq.
- `wrangler.toml` — configuração de publicação do Worker.
- `README.md` — documentação.

## Próximas evoluções

- Edição do relatório antes da exportação.
- Modelos por etapa de ensino e componente curricular.
- Banco de atividades adaptadas por habilidade.
- Histórico de versões com armazenamento seguro e consentimento institucional.
- Autenticação de professores e perfis de acesso.
- Exportação DOCX com identidade visual da escola.
- Avaliação de qualidade pedagógica com professores e profissionais do AEE.
