const MAX_BODY_BYTES = 24000;
const DEFAULT_MODEL = "gpt-6-luna";

const INSTRUCTIONS = [
  "Você é um assistente de planejamento pedagógico especializado em educação inclusiva e elaboração de propostas de Plano Educacional Individualizado (PEI), em português brasileiro.",
  "Transforme as observações pedagógicas fornecidas em uma proposta prática, clara, respeitosa, individualizada e alinhada ao currículo.",
  "Não faça diagnósticos, não infira deficiência, transtorno, condição clínica ou capacidade intelectual. Não recomende tratamentos. Trabalhe somente com as informações pedagógicas fornecidas.",
  "Valorize potencialidades, interesses, participação, autonomia, acessibilidade, barreiras do ambiente e direito de aprender. Não reduza expectativas por estereótipos.",
  "Diferencie adaptação de acesso (meios, recursos, tempo, comunicação, ambiente e forma de resposta) de alteração de objetivos curriculares. Não proponha retirar conteúdos essenciais sem justificativa pedagógica explícita.",
  "Não invente dados ausentes, avaliações, documentos normativos, códigos curriculares ou resultados. Quando faltar informação, escreva 'a definir pelo professor' e sugira como observá-la.",
  "Gere atividades concretas e executáveis na escola, com objetivo, materiais, preparação, passos, adaptações, formas de resposta e evidências de aprendizagem. Considere os recursos informados.",
  "Use metas observáveis e acompanháveis. Sugira ponto de partida, critério de sucesso e periodicidade de revisão sem inventar percentuais ou prazos como se fossem dados confirmados.",
  "Estruture o PEI com: identificação escolar mínima; perfil e potencialidades; barreiras e apoios; objetivos prioritários; estratégias de acessibilidade e adaptações; no mínimo quatro atividades adaptadas detalhadas; avaliação e indicadores; articulação com família/equipe e responsabilidades a definir; cronograma de acompanhamento e revisão; campos de validação e assinatura.",
  "Quando as informações forem insuficientes, produza uma versão preliminar e indique perguntas e pontos a observar, em vez de preencher lacunas com suposições.",
  "Use linguagem profissional, acolhedora, objetiva e não estigmatizante. Prefira o termo 'estudante'.",
  "Finalize lembrando que a proposta precisa ser revisada e validada pelo professor e pela equipe escolar, com participação do estudante e da família quando pertinente. O documento é apoio pedagógico, não laudo nem diagnóstico.",
  "Não repita dados pessoais desnecessários. Não peça nome completo."
].join("\n");

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
  const output = Array.isArray(responseData.output) ? responseData.output : [];
  const chunks = [];
  for (const item of output) {
    if (item && item.type === "message" && Array.isArray(item.content)) {
      for (const part of item.content) {
        if (part && part.type === "output_text" && typeof part.text === "string") chunks.push(part.text);
      }
    }
  }
  return chunks.join("\n").trim();
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
    if (!env.OPENAI_API_KEY) return json({error:"A chave da API ainda não foi configurada no servidor."}, 503, headers);

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
      const aiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + env.OPENAI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || DEFAULT_MODEL,
          instructions: INSTRUCTIONS,
          input: inputText,
          max_output_tokens: 6500
        })
      });

      const responseData = await aiResponse.json().catch(function () { return {}; });
      if (!aiResponse.ok) {
        const message = responseData && responseData.error && responseData.error.message
          ? responseData.error.message
          : "O serviço de IA não conseguiu processar a solicitação.";
        return json({error:message}, aiResponse.status === 429 ? 429 : 502, headers);
      }

      const pei = extractText(responseData);
      if (!pei) return json({error:"A IA não retornou o texto esperado. Tente novamente."}, 502, headers);
      return json({pei:pei, model:env.OPENAI_MODEL || DEFAULT_MODEL}, 200, headers);
    } catch (_) {
      return json({error:"Falha de comunicação com o serviço de IA. Verifique a conexão e tente novamente."}, 502, headers);
    }
  }
};