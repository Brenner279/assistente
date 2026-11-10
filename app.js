(function () {
  "use strict";
  const form = document.getElementById("peiForm");
  const status = document.getElementById("status");
  const statusText = document.getElementById("statusText");
  const report = document.getElementById("reportContent");
  const empty = document.getElementById("emptyState");
  const disclaimer = document.getElementById("reportDisclaimer");
  const generateBtn = document.getElementById("generateBtn");
  const copyBtn = document.getElementById("copyBtn");
  const printBtn = document.getElementById("printBtn");
  const wordBtn = document.getElementById("wordBtn");
  let currentReport = "";

  function setStatus(message, kind) {
    statusText.textContent = message;
    status.className = "status" + (kind ? " " + kind : "");
  }
  function value(id) { return document.getElementById(id).value.trim(); }
  function collectData() {
    return {
      identificacao:value("studentCode"), escola:value("school"), professor:value("teacher"),
      etapa_ano:value("grade"), turma:value("classGroup"), vigencia:value("period"),
      potencialidades:value("strengths"), interesses:value("interests"), comunicacao:value("communication"),
      autonomia:value("autonomy"), participacao_interacao:value("interaction"),
      barreiras_observadas:value("barriers"), conhecimentos_previos:value("priorSkills"),
      apoios_que_funcionam:value("supportNeeds"), area_conhecimento:value("area"),
      componente_curricular:value("subject"), conteudo_habilidade:value("topic"),
      objetivo_prioritario:value("goal"), observacoes:value("observations"),
      estrategias_selecionadas:Array.from(form.querySelectorAll('input[name="supports"]:checked')).map(function (el) { return el.value; }),
      recursos_disponiveis:value("resources"), frequencia_acompanhamento:value("frequency"),
      duracao_atividade:value("duration")
    };
  }
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function inline(text) {
    return escapeHtml(text)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>");
  }
  function markdownToHtml(source) {
    const lines = String(source || "").replace(/\r/g, "").split("\n");
    const out = [];
    let i = 0;
    const isTableRow = function (line) { return /^\s*\|?.+\|.+\|?\s*$/.test(line); };
    const cells = function (line) {
      return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (cell) { return cell.trim(); });
    };
    const isTableDivider = function (line) {
      return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
    };
    while (i < lines.length) {
      const s = lines[i].trim();
      if (!s) { i++; continue; }
      if (/^---+$/.test(s)) { out.push("<hr>"); i++; continue; }

      const heading = s.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        out.push("<h" + level + ">" + inline(heading[2]) + "</h" + level + ">");
        i++; continue;
      }

      if (i + 1 < lines.length && isTableRow(lines[i]) && isTableDivider(lines[i + 1])) {
        const headers = cells(lines[i]);
        out.push('<div class="table-wrap"><table><thead><tr>' +
          headers.map(function (cell) { return "<th>" + inline(cell) + "</th>"; }).join("") +
          "</tr></thead><tbody>");
        i += 2;
        while (i < lines.length && lines[i].trim() && isTableRow(lines[i])) {
          const row = cells(lines[i]);
          out.push("<tr>" + headers.map(function (_, index) {
            return "<td>" + inline(row[index] || "") + "</td>";
          }).join("") + "</tr>");
          i++;
        }
        out.push("</tbody></table></div>");
        continue;
      }

      if (/^[-*]\s+/.test(s)) {
        out.push("<ul>");
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          out.push("<li>" + inline(lines[i].trim().replace(/^[-*]\s+/, "")) + "</li>");
          i++;
        }
        out.push("</ul>");
        continue;
      }

      if (/^\d+[.)]\s+/.test(s)) {
        out.push("<ol>");
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
          out.push("<li>" + inline(lines[i].trim().replace(/^\d+[.)]\s+/, "")) + "</li>");
          i++;
        }
        out.push("</ol>");
        continue;
      }

      if (/^>\s?/.test(s)) {
        const quote = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) {
          quote.push(inline(lines[i].trim().replace(/^>\s?/, "")));
          i++;
        }
        out.push("<blockquote>" + quote.join("<br>") + "</blockquote>");
        continue;
      }

      const paragraph = [s];
      i++;
      while (i < lines.length && lines[i].trim() &&
        !/^(#{1,3})\s+/.test(lines[i].trim()) &&
        !/^---+$/.test(lines[i].trim()) &&
        !/^[-*]\s+/.test(lines[i].trim()) &&
        !/^\d+[.)]\s+/.test(lines[i].trim()) &&
        !/^>\s?/.test(lines[i].trim()) &&
        !(i + 1 < lines.length && isTableRow(lines[i]) && isTableDivider(lines[i + 1]))) {
        paragraph.push(lines[i].trim());
        i++;
      }
      out.push("<p>" + inline(paragraph.join(" ")) + "</p>");
    }
    return out.join("");
  }
  function showReport(text, message, kind) {
    currentReport = String(text || "");
    report.innerHTML = markdownToHtml(currentReport);
    report.hidden = false; empty.hidden = true; disclaimer.hidden = false;
    copyBtn.disabled = false; printBtn.disabled = false; wordBtn.disabled = false;
    setStatus(message || "Proposta pronta para revisão.", kind || "ready");
    document.getElementById("relatorio").scrollIntoView({behavior:"smooth",block:"start"});
  }
  function makeDemo(d) {
    const student = d.identificacao || "Estudante (identificação não informada)";
    const subject = d.componente_curricular || d.area_conhecimento || "Componente curricular a definir";
    const topic = d.conteudo_habilidade || "Habilidade curricular a ser definida pelo professor";
    const goal = d.objetivo_prioritario || "Definir um objetivo observável a partir das habilidades atuais e do currículo da turma.";
    const supports = d.estrategias_selecionadas.length ? d.estrategias_selecionadas : ["Instruções claras e divididas em etapas","Diferentes formas de demonstrar a aprendizagem"];
    const time = d.duracao_atividade || "20 a 30 minutos, ajustáveis conforme participação e pausas";
    const resources = d.recursos_disponiveis || "Cartões, imagens, objetos do cotidiano ou materiais disponíveis na escola";
    return [
      "# PROPOSTA DE PLANO EDUCACIONAL INDIVIDUALIZADO (PEI)",
      "## 1. Identificação e contexto",
      "- **Estudante:** " + student,
      "- **Escola:** " + (d.escola || "A preencher"),
      "- **Professor(a):** " + (d.professor || "A preencher"),
      "- **Etapa / ano:** " + (d.etapa_ano || "A preencher"),
      "- **Turma:** " + (d.turma || "A preencher"),
      "- **Vigência:** " + (d.vigencia || "A definir"),
      "- **Área / componente:** " + subject,
      "- **Conteúdo ou habilidade:** " + topic,
      "## 2. Perfil de aprendizagem e potencialidades",
      d.potencialidades || "Registrar habilidades, interesses e conhecimentos já demonstrados pelo estudante.",
      "**Interesses e motivadores:** " + (d.interesses || "Selecionar temas de interesse após conversa e observação."),
      "**Comunicação:** " + (d.comunicacao || "Registrar como compreende instruções e expressa ideias, escolhas ou dúvidas."),
      "**Autonomia:** " + (d.autonomia || "Observar em quais etapas realiza tarefas com independência e em quais necessita de apoio."),
      "**Participação e interação:** " + (d.participacao_interacao || "Descrever contextos em que participa com maior conforto e iniciativa."),
      "## 3. Barreiras e necessidades de apoio",
      d.barreiras_observadas || "Investigar, por observação pedagógica, quais situações dificultam o acesso, a participação ou a demonstração da aprendizagem.",
      "**Conhecimentos prévios:** " + (d.conhecimentos_previos || "Levantar evidências iniciais por meio de sondagem pedagógica."),
      "**Apoios que já funcionam:** " + (d.apoios_que_funcionam || "Testar apoios, registrar respostas e manter aqueles que favorecem a participação."),
      "## 4. Objetivo prioritário de aprendizagem",
      goal,
      "O objetivo deve ser detalhado pelo professor em uma ação observável, com critério de sucesso e prazo de acompanhamento, preservando o vínculo com o currículo da turma.",
      "## 5. Estratégias de acessibilidade e adaptações",
      supports.map(function (x) { return "- " + x; }).join("\n"),
      "- Apresentar um exemplo resolvido ou modelo visual antes da atividade.",
      "- Verificar a compreensão solicitando que o estudante indique ou explique o primeiro passo.",
      "- Ajustar a quantidade de itens sem retirar o objetivo essencial de aprendizagem.",
      "- Permitir respostas por fala, seleção, apontamento, desenho, manipulação ou registro escrito, conforme o objetivo avaliado.",
      "## 6. Sugestões iniciais de atividades adaptadas",
      "### Atividade 1 — Explorar, observar e organizar",
      "**Objetivo:** identificar conhecimentos prévios relacionados a " + topic + ".",
      "**Como realizar:** apresentar 3 a 5 exemplos concretos ou imagens; pedir que o estudante observe, agrupe, ordene ou associe; registrar a estratégia utilizada e o apoio necessário.",
      "**Recursos:** " + resources + ".",
      "**Adaptação:** oferecer poucas opções por vez, instruções curtas e modelo visual. Tempo sugerido: " + time + ".",
      "**Evidências:** escolhas realizadas, explicação oral ou demonstração prática.",
      "### Atividade 2 — Aprender em pequenas etapas",
      "**Objetivo:** avançar em direção ao objetivo prioritário com apoio gradual.",
      "**Como realizar:** dividir a tarefa em três etapas; realizar a primeira junto ao estudante; oferecer pista visual na segunda; observar a terceira com menor mediação.",
      "**Adaptação:** reduzir elementos concorrentes, disponibilizar pausa planejada e permitir diferentes formas de resposta.",
      "**Evidências:** etapas concluídas, estratégias utilizadas e tipo de apoio necessário.",
      "### Atividade 3 — Aplicar em uma situação significativa",
      "**Objetivo:** transferir o que foi aprendido para uma situação contextualizada.",
      "**Como realizar:** propor um pequeno desafio ligado a " + (d.interesses || "um tema de interesse do estudante") + "; permitir escolha entre duas formas de execução ou resposta.",
      "**Adaptação:** usar materiais familiares, demonstração prática e tempo flexível.",
      "**Evidências:** aplicação da habilidade em novo contexto e nível de autonomia.",
      "## 7. Avaliação e acompanhamento",
      "- **Foco:** progresso em relação ao ponto de partida e ao objetivo, não comparação com outros estudantes.",
      "- **Instrumentos:** observação sistemática, portfólio, registros de produção, rubrica simples e devolutivas do estudante.",
      "- **Frequência sugerida:** " + (d.frequencia_acompanhamento || "Semanal") + ".",
      "- **Indicadores:** realiza a tarefa; realiza com pista; realiza com mediação; ainda necessita de nova estratégia.",
      "- **Revisão:** reavaliar estratégias quando não houver progresso, quando a barreira mudar ou quando o objetivo for alcançado.",
      "## 8. Articulação e próximos passos",
      "Dialogar com o estudante, a família, o professor do Atendimento Educacional Especializado (quando houver) e a equipe pedagógica. Registrar apoios combinados, responsáveis e data de revisão.",
      "## 9. Validação pedagógica",
      "Esta é uma estrutura demonstrativa, não uma avaliação do estudante. O professor deve substituir sugestões genéricas por atividades alinhadas ao currículo, às observações reais e às condições da escola. Não utilizar este documento para inferir ou registrar diagnósticos."
    ].join("\n\n");
  }
  function validate(data) {
    const ok = [data.potencialidades,data.barreiras_observadas,data.conteudo_habilidade,data.objetivo_prioritario].some(function (x) { return x.length > 0; });
    if (!ok) setStatus("Preencha pelo menos um campo sobre potencialidades, barreiras, conteúdo ou objetivo.","error");
    return ok;
  }
  const API_URL = "https://pei-inteligente-api.michel-brenner279.workers.dev/gerar-pei";

  async function generateAI(data) {
    const endpoint = API_URL;
    try {
      const parsed = new URL(endpoint);
      if (parsed.protocol !== "https:") throw new Error("Por segurança, a API precisa utilizar HTTPS.");
    } catch (error) {
      setStatus(error.message || "Endereço da API inválido.","error"); return;
    }
    generateBtn.disabled = true; generateBtn.textContent = "Gerando proposta...";
    setStatus("A IA está organizando as informações. Aguarde a resposta.","");
    try {
      const response = await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:data})});
      const result = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(result.error || "Não foi possível gerar o relatório.");
      if (!result.pei || typeof result.pei !== "string") throw new Error("A resposta da IA veio em formato inesperado.");
      showReport(result.pei,"Proposta gerada pela IA. Revise e personalize antes de utilizar.","ready");
    } catch (error) {
      setStatus(error.message || "Falha na conexão com a IA.","error");
    } finally {
      generateBtn.disabled = false; generateBtn.textContent = "✦ Gerar proposta com IA";
    }
  }

  const manualModeBtn = document.getElementById("manualModeBtn");
  const documentsModeBtn = document.getElementById("documentsModeBtn");
  const formPanel = document.querySelector(".form-panel");
  const uploadPanel = document.getElementById("documentUploadPanel");
  const documentsForm = document.getElementById("documentsForm");
  const documentsBtn = document.getElementById("generateDocumentsBtn");
  function setGenerationMode(mode) {
    const manual = mode === "manual";
    formPanel.hidden = !manual;
    uploadPanel.hidden = manual;
    manualModeBtn.classList.toggle("active", manual);
    documentsModeBtn.classList.toggle("active", !manual);
    manualModeBtn.setAttribute("aria-pressed", String(manual));
    documentsModeBtn.setAttribute("aria-pressed", String(!manual));
    setStatus(manual ? "Modo de preenchimento manual selecionado." : "Modo de envio de documentos selecionado.", "");
  }
  manualModeBtn.addEventListener("click", function () { setGenerationMode("manual"); });
  documentsModeBtn.addEventListener("click", function () { setGenerationMode("documents"); });

  documentsForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const fields = [
      ["entrevista_pais", document.getElementById("parentInterview").files[0]],
      ["anamnese_aluno", document.getElementById("studentAnamnesis").files[0]],
      ["relatorio_coordenacao", document.getElementById("coordinationReport").files[0]]
    ].filter(function (item) { return !!item[1]; });
    if (!fields.length) { setStatus("Selecione pelo menos um documento PDF.", "error"); return; }
    if (!document.getElementById("documentConsent").checked) { setStatus("Confirme a autorização e a ciência sobre o envio à Cloudflare Workers AI.", "error"); return; }
    let total = 0;
    for (const item of fields) {
      const file = item[1];
      if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
        setStatus("O arquivo '" + file.name + "' não parece ser um PDF válido.", "error"); return;
      }
      if (file.size > 6 * 1024 * 1024) {
        setStatus("Cada PDF deve ter no máximo 6 MB.", "error"); return;
      }
      total += file.size;
    }
    if (total > 12 * 1024 * 1024) { setStatus("O tamanho total dos PDFs não pode ultrapassar 12 MB.", "error"); return; }
    documentsBtn.disabled = true;
    documentsBtn.textContent = "Analisando documentos...";
    setStatus("Os documentos estão sendo enviados para análise. Aguarde; arquivos maiores podem levar alguns instantes.", "");
    try {
      const payload = new FormData();
      fields.forEach(function (item) { payload.append(item[0], item[1], item[1].name); });
      const endpoint = API_URL.replace("/gerar-pei", "/gerar-pei-documentos");
      const response = await fetch(endpoint, {method:"POST", body:payload});
      const result = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(result.error || "Não foi possível analisar os documentos.");
      if (!result.pei || typeof result.pei !== "string") throw new Error("A resposta da IA veio em formato inesperado.");
      showReport(result.pei, "PEI gerado a partir dos documentos. Revise e valide as informações antes de utilizar.", "ready");
    } catch (error) {
      setStatus(error.message || "Falha na análise dos documentos.", "error");
    } finally {
      documentsBtn.disabled = false;
      documentsBtn.textContent = "✦ Analisar documentos e gerar PEI";
    }
  });
  document.getElementById("clearDocumentsBtn").addEventListener("click", function () {
    documentsForm.reset();
    setStatus("Arquivos selecionados removidos.", "");
  });

  form.addEventListener("submit",function (event) {
    event.preventDefault(); const data = collectData(); if (validate(data)) generateAI(data);
  });
  document.getElementById("previewBtn").addEventListener("click",function () {
    const data = collectData(); if (validate(data)) showReport(makeDemo(data),"Modelo demonstrativo criado localmente. Este exemplo não utiliza IA.","ready");
  });

  function docxRunsFromNode(node, inherited) {
    const format = Object.assign({}, inherited || {});
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue ? [new docx.TextRun({
        text: node.nodeValue,
        bold: !!format.bold,
        italics: !!format.italics,
        strike: !!format.strike,
        font: format.code ? "Consolas" : "Arial",
        color: format.code ? "53645D" : "263A33"
      })] : [];
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return [];
    const tag = node.tagName.toLowerCase();
    if (tag === "strong" || tag === "b") format.bold = true;
    if (tag === "em" || tag === "i") format.italics = true;
    if (tag === "s" || tag === "del") format.strike = true;
    if (tag === "code") format.code = true;
    return Array.from(node.childNodes).flatMap(function (child) {
      return docxRunsFromNode(child, format);
    });
  }

  function docxParagraphFromElement(element, extra) {
    const runs = Array.from(element.childNodes).flatMap(function (node) {
      return docxRunsFromNode(node, {});
    });
    return new docx.Paragraph(Object.assign({
      children: runs.length ? runs : [new docx.TextRun({text: element.textContent || " "})],
      spacing: { after: 120 }
    }, extra || {}));
  }

  function docxTableFromElement(tableElement) {
    const rows = Array.from(tableElement.querySelectorAll("tr")).map(function (row, rowIndex) {
      const cells = Array.from(row.children).map(function (cell) {
        const runs = Array.from(cell.childNodes).flatMap(function (node) {
          return docxRunsFromNode(node, {bold: cell.tagName.toLowerCase() === "th"});
        });
        return new docx.TableCell({
          children: [new docx.Paragraph({
            children: runs.length ? runs : [new docx.TextRun({text: cell.textContent || " "})],
            spacing: {after: 60}
          })],
        });
      });
      return new docx.TableRow({children: cells});
    });
    return new docx.Table({rows: rows});
  }

  async function exportWordDocument() {
    if (!currentReport || !report || report.hidden) {
      setStatus("Gere uma proposta antes de exportar para Word.", "error");
      return;
    }
    if (!window.docx || !window.docx.Document || !window.docx.Packer) {
      setStatus("O módulo de exportação Word não carregou. Verifique a conexão e atualize a página.", "error");
      return;
    }

    const oldLabel = wordBtn.textContent;
    wordBtn.disabled = true;
    wordBtn.textContent = "Preparando Word...";
    try {
      const children = [];
      Array.from(report.children).forEach(function (element) {
        const tag = element.tagName.toLowerCase();
        if (tag === "h1") {
          children.push(docxParagraphFromElement(element, {
            heading: docx.HeadingLevel.HEADING_1,
            spacing: {before: 100, after: 220}
          }));
        } else if (tag === "h2") {
          children.push(docxParagraphFromElement(element, {
            heading: docx.HeadingLevel.HEADING_2,
            spacing: {before: 260, after: 120}
          }));
        } else if (tag === "h3") {
          children.push(docxParagraphFromElement(element, {
            heading: docx.HeadingLevel.HEADING_3,
            spacing: {before: 180, after: 80}
          }));
        } else if (tag === "p") {
          children.push(docxParagraphFromElement(element, {
            alignment: docx.AlignmentType.JUSTIFIED
          }));
        } else if (tag === "ul") {
          Array.from(element.children).forEach(function (item) {
            children.push(docxParagraphFromElement(item, {
              bullet: {level: 0},
              spacing: {after: 70}
            }));
          });
        } else if (tag === "ol") {
          Array.from(element.children).forEach(function (item, index) {
            const runs = [new docx.TextRun({text: (index + 1) + ". "})]
              .concat(Array.from(item.childNodes).flatMap(function (node) {
                return docxRunsFromNode(node, {});
              }));
            children.push(new docx.Paragraph({children: runs, spacing: {after: 70}}));
          });
        } else if (tag === "blockquote") {
          children.push(new docx.Paragraph({
            children: [new docx.TextRun({text: element.textContent, italics: true, color: "53645D"})],
            indent: {left: 360},
            spacing: {before: 100, after: 120}
          }));
        } else if (tag === "div" && element.querySelector("table")) {
          children.push(docxTableFromElement(element.querySelector("table")));
          children.push(new docx.Paragraph({text: "", spacing: {after: 100}}));
        } else if (tag === "table") {
          children.push(docxTableFromElement(element));
        } else if (tag === "hr") {
          children.push(new docx.Paragraph({text: " "}));
        }
      });

      if (disclaimer && !disclaimer.hidden && disclaimer.textContent.trim()) {
        children.push(new docx.Paragraph({
          children: [new docx.TextRun({
            text: disclaimer.textContent.trim(),
            italics: true,
            color: "52665E",
            size: 18
          })],
          spacing: {before: 260, after: 100}
        }));
      }

      const wordDocument = new docx.Document({
        creator: "PEI Inteligente",
        title: "Proposta de Plano Educacional Individualizado",
        description: "Documento preliminar de apoio pedagógico para revisão da equipe escolar.",
        sections: [{
          properties: {
            page: {
              size: {width: 11906, height: 16838},
              margin: {top: 1200, right: 1080, bottom: 1200, left: 1080}
            }
          },
          children: children
        }]
      });

      const blob = await docx.Packer.toBlob(wordDocument);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      const date = new Date();
      const stamp = date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
      link.download = "PEI-Inteligente-" + stamp + ".docx";
      link.style.display = "none";
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      setStatus("Documento Word (.docx) exportado. Revise a formatação antes de imprimir ou compartilhar.", "ready");
    } catch (error) {
      console.error("Falha ao exportar DOCX:", error);
      setStatus("Não foi possível gerar o arquivo Word. Atualize a página e tente novamente.", "error");
    } finally {
      wordBtn.disabled = false;
      wordBtn.textContent = oldLabel;
    }
  }

  wordBtn.addEventListener("click", exportWordDocument);

  copyBtn.addEventListener("click",async function () {
    if (!currentReport) return;
    try { await navigator.clipboard.writeText(currentReport); setStatus("Relatório copiado para a área de transferência.","ready"); }
    catch (_) { setStatus("Não foi possível copiar automaticamente. Selecione o texto do relatório.","error"); }
  });
  printBtn.addEventListener("click",function () { window.print(); });
  document.getElementById("clearBtn").addEventListener("click",function () {
    if (!window.confirm("Deseja limpar os campos preenchidos e remover o relatório atual?")) return;
    form.reset(); currentReport = ""; report.innerHTML = ""; report.hidden = true; disclaimer.hidden = true; empty.hidden = false;
    copyBtn.disabled = true; printBtn.disabled = true; wordBtn.disabled = true;
    setStatus("Formulário limpo. Esta página não salva as informações dos estudantes.","");
    document.getElementById("formulario").scrollIntoView({behavior:"smooth",block:"start"});
  });
})();