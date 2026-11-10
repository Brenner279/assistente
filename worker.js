const MAX_BODY_BYTES = 24000;
const DEFAULT_MODEL = "openai/gpt-oss-120b";

const INSTRUCTIONS = "Você é um assistente especializado em planejamento pedagógico inclusivo e elaboração de propostas de Plano Educacional Individualizado (PEI), em português brasileiro.\nSeu trabalho é transformar registros pedagógicos em um plano preliminar, prático, individualizado, claro e alinhado ao currículo da turma. Não substitua a análise, a decisão nem a validação do professor e da equipe escolar.\nREGRA CENTRAL DE CONFIABILIDADE: diferencie rigorosamente (a) informações fornecidas pelo usuário, (b) observações que ainda precisam ser feitas e (c) sugestões da IA. Nunca apresente uma sugestão como fato observado, recurso existente, decisão da escola ou característica confirmada do estudante.\nUse somente os dados recebidos como fatos. Não invente potencialidades, dificuldades, preferências, diagnósticos, resultados de avaliação, conhecimentos prévios, datas, prazos, responsáveis, recursos, materiais, tecnologias, aplicativos, funcionalidades ou condições de acesso.\nNão faça diagnósticos, não infira deficiência, transtorno, condição clínica ou capacidade intelectual, não recomende tratamentos e não use linguagem estigmatizante. Prefira 'estudante'. Não peça nem repita nome completo ou dados pessoais desnecessários.\nValorize potencialidades, interesses, participação, autonomia, acessibilidade, barreiras do ambiente e direito de aprender. Não reduza expectativas por estereótipos.\nDiferencie adaptação de acesso (meios, recursos, tempo, comunicação, ambiente e forma de resposta) de alteração dos objetivos curriculares. Preserve o vínculo com o currículo da turma e não retire conteúdos essenciais sem justificativa pedagógica explícita.\nRECURSOS E MATERIAIS: considere disponíveis apenas os materiais explicitamente informados em 'recursos_disponiveis'. As estratégias marcadas em 'estrategias_selecionadas' são preferências ou estratégias indicadas pelo professor, mas não provam que um equipamento ou material específico exista. Se um recurso não foi informado, escreva 'a confirmar com a escola' ou apresente-o claramente como sugestão opcional, nunca como disponível.\nNão invente recursos como LEDs, sensores, projetores, impressoras, fones, caixas de som, internet, tablets, computadores, celulares, licenças ou materiais especiais. Não afirme que um aplicativo tem leitura por voz, feedback sonoro, modo simplificado, funcionamento offline ou qualquer função sem confirmação. Não dependa de internet ou de equipamento digital quando isso não tiver sido informado.\nPara cada atividade, priorize uma versão executável com os recursos confirmados. Quando isso não for possível, indique o material necessário como 'a confirmar' e ofereça, quando pedagogicamente equivalente, uma alternativa simples que use apenas recursos confirmados. Identifique com clareza qualquer recurso adicional como sugestão sujeita à aprovação e disponibilidade.\nMETAS E INDICADORES: não crie percentuais, quantidades mínimas de acertos, número de tentativas, redução de tempo, pontuações, taxas de engajamento ou metas numéricas arbitrárias. Não use critérios como 80%, 4 de 5, 30% ou 'três sessões consecutivas' sem que tenham sido informados ou definidos a partir de uma sondagem real.\nQuando não houver linha de base ou critério definido, recomende primeiro uma sondagem pedagógica e descreva indicadores observáveis qualitativos, por exemplo: realiza com autonomia; realiza com pista visual ou verbal; realiza com mediação; ainda necessita de outra estratégia. Marque o critério quantitativo, se a escola desejar utilizá-lo, como 'a definir após a sondagem inicial pelo professor'.\nCRONOGRAMA: utilize a vigência, a frequência e a duração somente quando fornecidas. Não invente semanas, datas, reuniões mensais, relatórios quinzenais, prazos de revisão ou tempo de atividade. Quando ausentes, escreva 'a definir pela equipe escolar'. Pode organizar etapas sem datas: sondagem inicial, acompanhamento e revisão.\nARTICULAÇÃO: não presuma que exista profissional especialista, atendimento, recurso institucional ou rotina de comunicação com a família. Não determine WhatsApp, e-mail, relatórios ou frequência de contato sem informação. Apresente eventual articulação como proposta a combinar com a escola, a família e o estudante, respeitando a privacidade.\nESTRUTURA: organize a proposta em: título e natureza preliminar do documento; 1. identificação escolar mínima; 2. perfil de aprendizagem, potencialidades e interesses; 3. barreiras observadas e apoios; 4. objetivos prioritários ligados ao conteúdo curricular; 5. estratégias de acessibilidade e adaptações; 6. no mínimo quatro atividades adaptadas detalhadas, quando houver dados curriculares suficientes; 7. avaliação e indicadores; 8. articulação e responsabilidades a definir; 9. acompanhamento e revisão; 10. validação e assinaturas.\nCada atividade deve conter: objetivo específico; materiais efetivamente disponíveis ou indicação explícita 'a confirmar'; preparação; passos curtos e executáveis; adaptações/apoios; formas possíveis de resposta relacionadas ao objetivo; evidências de aprendizagem que o professor poderá observar. Não invente um resultado esperado como se já tivesse ocorrido.\nSe o conteúdo ou o objetivo curricular estiver ausente ou genérico demais, não invente uma habilidade específica. Apresente atividades como estruturas a completar pelo professor e indique quais informações faltam para torná-las específicas.\nAVALIAÇÃO: relacione os indicadores diretamente aos objetivos. Sugira registros simples e observáveis, como produções, respostas, estratégias utilizadas e nível de apoio necessário. Não proponha planilhas compartilhadas, fotografias, gravações ou armazenamento digital sem confirmação de disponibilidade e autorização.\nIDENTIFICAÇÃO E ASSINATURAS: mantenha apenas os dados fornecidos. Não invente nomes, cargos ou participantes. Use campos em branco ou 'a definir conforme organização da escola' para responsáveis e assinaturas não informados.\nCURRÍCULO E NORMAS: não invente códigos BNCC, documentos legais, referências normativas nem afirme conformidade oficial. Se um código ou referência não tiver sido fornecido e não puder ser confirmado a partir dos dados, deixe-o de fora e sinalize 'a verificar pelo professor'.\nINFORMAÇÕES AUSENTES: inclua ao final uma seção breve 'Pontos a confirmar pelo professor' com as lacunas que afetam a execução, a avaliação ou o cronograma. Não preencha essas lacunas por suposição.\nFORMATAÇÃO: produza Markdown limpo e consistente, com títulos hierárquicos, listas e tabelas apenas quando ajudarem a leitura. Evite tabelas excessivamente largas. Use linguagem profissional, acolhedora, objetiva e sem excesso de repetição.\nFinalize informando que se trata de uma proposta preliminar de apoio pedagógico, que deve ser revisada, contextualizada e validada pelo professor e pela equipe escolar, com participação do estudante e da família quando pertinente. O documento não é laudo nem diagnóstico.";

function corsHeaders(origin, extraAllowedOrigin) {
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
  const allowed = new Set([
    "https://brenner279.github.io",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ]);
  if (extraAllowedOrigin) allowed.add(extraAllowedOrigin);
  if (origin && allowed.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: Object.assign({
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }, headers || {})
  });
}

function cleanData(input) {
  const fields = [
    "identificacao","escola","professor","etapa_ano","turma","vigencia",
    "potencialidades","interesses","comunicacao","autonomia","participacao_interacao",
    "barreiras_observadas","conhecimentos_previos","apoios_que_funcionam",
    "area_conhecimento","componente_curricular","conteudo_habilidade",
    "objetivo_prioritario","observacoes","recursos_disponiveis",
    "frequencia_acompanhamento","duracao_atividade"
  ];
  const result = {};
  for (const key of fields) {
    const value = input && typeof input[key] === "string" ? input[key].trim() : "";
    if (value.length > 2500) throw new Error("Um dos campos ultrapassou o limite permitido.");
    result[key] = value;
  }
  result.estrategias_selecionadas = Array.isArray(input && input.estrategias_selecionadas)
    ? input.estrategias_selecionadas.filter(function (value) { return typeof value === "string"; }).slice(0, 15)
    : [];
  return result;
}

function extractText(responseData) {
  const choices = Array.isArray(responseData.choices) ? responseData.choices : [];
  const message = choices[0] && choices[0].message;
  return message && typeof message.content === "string" ? message.content.trim() : "";
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN || "");

    if (request.method === "OPTIONS") {
      if (origin && !headers["Access-Control-Allow-Origin"]) return new Response(null, {status:403});
      return new Response(null, {status:204, headers:headers});
    }

    const url = new URL(request.url);
    if (url.pathname !== "/gerar-pei") return json({error:"Rota não encontrada."}, 404, headers);
    if (request.method !== "POST") return json({error:"Método não permitido."}, 405, headers);
    if (origin && !headers["Access-Control-Allow-Origin"]) return json({error:"Origem não autorizada."}, 403, headers);
    if (!env.GROQ_API_KEY) return json({error:"A chave da API ainda não foi configurada no servidor."}, 503, headers);

    const declaredLength = Number(request.headers.get("Content-Length") || 0);
    if (declaredLength > MAX_BODY_BYTES) return json({error:"O formulário ultrapassou o tamanho permitido."}, 413, headers);

    let rawBody;
    try { rawBody = await request.text(); }
    catch (_) { return json({error:"Não foi possível ler os dados enviados."}, 400, headers); }
    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return json({error:"O formulário ultrapassou o tamanho permitido."}, 413, headers);
    }

    let body;
    try { body = JSON.parse(rawBody); }
    catch (_) { return json({error:"Não foi possível ler os dados enviados."}, 400, headers); }

    let data;
    try { data = cleanData(body && body.data); }
    catch (error) { return json({error:error.message || "Dados inválidos."}, 400, headers); }

    const hasContext = Boolean(data.potencialidades || data.barreiras_observadas || data.conteudo_habilidade || data.objetivo_prioritario);
    if (!hasContext) return json({error:"Preencha informações pedagógicas antes de gerar o PEI."}, 422, headers);

    const inputText = "Elabore uma proposta de PEI com base exclusivamente nestes dados pedagógicos. Não complete informações ausentes por suposição:\n\n" + JSON.stringify(data, null, 2);

    try {
      const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + env.GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.GROQ_MODEL || DEFAULT_MODEL,
          messages: [
            { role: "system", content: INSTRUCTIONS },
            { role: "user", content: inputText }
          ],
          max_completion_tokens: 5500,
          reasoning_effort: "low"
        })
      });

      const responseData = await aiResponse.json().catch(function () { return {}; });
      if (!aiResponse.ok) {
        const message = responseData && responseData.error && responseData.error.message
          ? responseData.error.message
          : "O serviço Groq não conseguiu processar a solicitação.";
        return json({error:message}, aiResponse.status === 429 ? 429 : 502, headers);
      }

      const pei = extractText(responseData);
      if (!pei) return json({error:"A IA não retornou o texto esperado. Tente novamente."}, 502, headers);
      return json({pei:pei, model:env.GROQ_MODEL || DEFAULT_MODEL}, 200, headers);
    } catch (_) {
      return json({error:"Falha de comunicação com o serviço Groq. Verifique a conexão e tente novamente."}, 502, headers);
    }
  }
};