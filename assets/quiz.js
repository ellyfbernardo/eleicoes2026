// Quiz de afinidade com as propostas. Tudo roda no navegador: nenhuma resposta é enviada,
// armazenada ou somada com a de outras pessoas — não é pesquisa nem enquete.
(function () {
  var CAND = {
    flavio: { nome: "Flávio Bolsonaro", num: "22", cor: "var(--flavio)", hex: "#1d4fb8" },
    lula: { nome: "Lula", num: "13", cor: "var(--lula)", hex: "#c62828" },
  };

  // Mesmo número de propostas por candidato, uma de cada lado em cada tema.
  var PERGUNTAS = [
    { c: "flavio", tema: "Economia", txt: "Retomar o programa de privatizações, avaliando estatal por estatal quais podem ser vendidas ou concedidas." },
    { c: "lula", tema: "Economia", txt: "Manter a isenção do Imposto de Renda para quem ganha até R$ 5 mil, compensando com mais impostos sobre super-ricos, fundos exclusivos e offshores." },
    { c: "flavio", tema: "Trabalho", txt: "Flexibilizar as regras da CLT." },
    { c: "lula", tema: "Trabalho", txt: "Reduzir a jornada para 40 horas semanais e acabar com a escala 6x1." },
    { c: "flavio", tema: "Saúde", txt: "Contratar hospitais e clínicas privadas em horários ociosos para reduzir as filas do SUS." },
    { c: "lula", tema: "Saúde", txt: "Ampliar o Farmácia Popular para oferecer também exames laboratoriais." },
    { c: "flavio", tema: "Educação", txt: "Criar um voucher para as famílias pagarem creches privadas." },
    { c: "lula", tema: "Educação", txt: "Expandir o ensino em tempo integral e manter o Pé-de-Meia, a poupança que paga estudantes do ensino médio para não abandonarem a escola." },
    { c: "flavio", tema: "Segurança", txt: "Reduzir a maioridade penal para 14 anos em casos de crimes hediondos." },
    { c: "lula", tema: "Segurança", txt: "Reforçar o controle de armas." },
    { c: "flavio", tema: "Meio ambiente", txt: "Ampliar a exploração de petróleo e gás no país, inclusive liberando o fracking." },
    { c: "lula", tema: "Meio ambiente", txt: "Zerar o desmatamento ilegal em todos os biomas até 2030." },
    { c: "flavio", tema: "Moradia", txt: "Retomar o programa Casa Verde e Amarela com a meta de 2,5 milhões de moradias." },
    { c: "lula", tema: "Moradia e renda", txt: "Ampliar o Minha Casa, Minha Vida e o Auxílio Gás." },
    { c: "flavio", tema: "Gestão do Estado", txt: "Extinguir pelo menos dez ministérios e cortar cargos comissionados." },
    { c: "lula", tema: "Gestão do Estado", txt: "Realizar o Concurso Nacional Unificado (CNU) de forma periódica para contratar servidores federais." },
  ];

  var RESP = { sim: "Concordo", neutro: "Indiferente", nao: "Discordo" };
  var $ = function (id) { return document.getElementById(id); };
  var ordem, i, respostas, placarFinal;
  var formato = "stories";

  function embaralhar(a) {
    for (var k = a.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var t = a[k]; a[k] = a[j]; a[j] = t;
    }
    return a;
  }

  function iniciar() {
    ordem = embaralhar(PERGUNTAS.map(function (_, k) { return k; }));
    i = 0;
    respostas = {};
    $("quiz-intro").hidden = true;
    $("quiz-resultado").hidden = true;
    $("quiz-box").hidden = false;
    mostrar();
  }

  function mostrar() {
    var p = PERGUNTAS[ordem[i]];
    $("quiz-passo").textContent = "Proposta " + (i + 1) + " de " + ordem.length;
    $("quiz-tema").textContent = p.tema;
    $("quiz-texto").textContent = p.txt;
    $("quiz-barra").style.width = (i / ordem.length) * 100 + "%";
    $("quiz-voltar").disabled = i === 0;
    document.querySelectorAll("[data-resp]").forEach(function (b) {
      b.classList.toggle("active", respostas[ordem[i]] === b.dataset.resp);
    });
  }

  function responder(r) {
    respostas[ordem[i]] = r;
    if (i < ordem.length - 1) { i++; mostrar(); } else { resultado(); }
  }

  function resultado() {
    $("quiz-box").hidden = true;
    $("quiz-resultado").hidden = false;
    $("quiz-barra").style.width = "100%";

    var placar = {};
    Object.keys(CAND).forEach(function (c) { placar[c] = { sim: 0, nao: 0, total: 0 }; });
    PERGUNTAS.forEach(function (p, k) {
      var r = respostas[k];
      placar[p.c].total++;
      if (r === "sim") placar[p.c].sim++;
      if (r === "nao") placar[p.c].nao++;
    });

    // Candidatos em ordem alfabética, como no resto do site.
    $("quiz-placar").innerHTML = Object.keys(CAND).map(function (c) {
      var s = placar[c];
      return (
        '<div class="result" style="--c:' + CAND[c].cor + '">' +
          '<span class="cand-num" style="--c:' + CAND[c].cor + ';background:#f0f2f8;color:' + CAND[c].cor + ';text-align:center">' + CAND[c].num + "</span>" +
          '<div><div class="name">' + CAND[c].nome + '</div><div class="meta">propostas com que você concordou' +
          (s.nao ? " · discordou de " + s.nao : "") + "</div></div>" +
          '<div class="pct quiz-qtd">' + s.sim + "<small> de " + s.total + "</small></div>" +
          '<div class="bar"><span style="width:' + (s.sim / s.total) * 100 + '%"></span></div>' +
        "</div>"
      );
    }).join("");

    $("quiz-detalhe").innerHTML = PERGUNTAS.map(function (p, k) {
      var r = respostas[k];
      return (
        '<tr><td style="text-align:left">' + p.txt + '<br><span class="small muted">' + p.tema + "</span></td>" +
        '<td style="text-align:left;color:' + CAND[p.c].cor + ';font-weight:700;white-space:nowrap">' + CAND[p.c].nome + "</td>" +
        '<td style="white-space:nowrap">' + (RESP[r] || "—") + "</td></tr>"
      );
    }).join("");
    placarFinal = placar;
    atualizarPreview();
    window.scrollTo({ top: $("quiz-resultado").offsetTop - 80, behavior: "smooth" });
  }

  // ---- Imagem para o Instagram (Stories 1080x1920 ou Feed 1080x1350) ----
  var FONTE = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  var SITE = "apuraeleicao2026.com.br";

  function retangulo(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function quebrarLinhas(ctx, texto, largura) {
    var linhas = [], linha = "";
    texto.split(" ").forEach(function (p) {
      var teste = linha ? linha + " " + p : p;
      if (ctx.measureText(teste).width > largura && linha) { linhas.push(linha); linha = p; } else { linha = teste; }
    });
    if (linha) linhas.push(linha);
    return linhas;
  }

  function desenhar(fmt) {
    var stories = fmt === "stories";
    var W = 1080, H = stories ? 1920 : 1350;
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");

    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#17306b");
    g.addColorStop(1, "#2a4fa0");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Círculos decorativos
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath(); ctx.arc(W - 80, 160, 260, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(60, H - 120, 200, 0, Math.PI * 2); ctx.fill();

    var M = 80;
    var y = stories ? 260 : 64;

    // Selo
    ctx.font = "800 34px " + FONTE;
    var selo = "QUIZ DE AFINIDADE · 2º TURNO 2026";
    var sw = ctx.measureText(selo).width + 56;
    ctx.fillStyle = "#ffd34d";
    retangulo(ctx, M, y, sw, 68, 34); ctx.fill();
    ctx.fillStyle = "#17306b";
    ctx.textBaseline = "middle";
    ctx.fillText(selo, M + 28, y + 35);
    ctx.textBaseline = "alphabetic";
    y += stories ? 110 : 80;

    // Título e subtítulo
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 " + (stories ? 84 : 72) + "px " + FONTE;
    quebrarLinhas(ctx, "Com quais propostas eu mais concordo?", W - M * 2).forEach(function (l) {
      y += stories ? 96 : 82;
      ctx.fillText(l, M, y);
    });
    y += 24;
    ctx.font = "500 36px " + FONTE;
    ctx.fillStyle = "#c9d4ff";
    quebrarLinhas(ctx, "Respondi a 16 propostas dos planos de governo sem saber de quem era cada uma.", W - M * 2).forEach(function (l) {
      y += 48;
      ctx.fillText(l, M, y);
    });
    y += stories ? 80 : 40;

    // Cartões dos candidatos, em ordem alfabética
    // Cada cartão tem 3 linhas: número + nome / quantidade em destaque / barra.
    var L = stories
      ? { cardH: 400, badgeY: 44, numBase: 280, numFont: 150, deFont: 60, txtFont: 36, barGap: 72 }
      : { cardH: 316, badgeY: 32, numBase: 222, numFont: 116, deFont: 48, txtFont: 32, barGap: 58 };
    var cardH = L.cardH;
    Object.keys(CAND).forEach(function (c) {
      var cand = CAND[c], s = placarFinal[c];
      ctx.fillStyle = "#ffffff";
      retangulo(ctx, M, y, W - M * 2, cardH, 36); ctx.fill();
      ctx.fillStyle = cand.hex;
      retangulo(ctx, M, y, 18, cardH, 9); ctx.fill();

      var cx = M + 60;
      ctx.fillStyle = "#f0f2f8";
      retangulo(ctx, cx, y + L.badgeY, 120, 88, 22); ctx.fill();
      ctx.fillStyle = cand.hex;
      ctx.font = "900 54px " + FONTE;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(cand.num, cx + 60, y + L.badgeY + 46);
      ctx.textAlign = "left";
      ctx.fillStyle = "#141a2b";
      ctx.font = "800 50px " + FONTE;
      ctx.fillText(cand.nome, cx + 150, y + L.badgeY + 46);
      ctx.textBaseline = "alphabetic";

      // Quantidade em destaque: "6" grande na cor do candidato, " de 8" e a legenda menores.
      var nx = cx, base = y + L.numBase;
      ctx.fillStyle = cand.hex;
      ctx.font = "900 " + L.numFont + "px " + FONTE;
      ctx.fillText(String(s.sim), nx, base);
      nx += ctx.measureText(String(s.sim)).width + 14;
      ctx.fillStyle = "#8a93a8";
      ctx.font = "800 " + L.deFont + "px " + FONTE;
      ctx.fillText("de " + s.total, nx, base);
      nx += ctx.measureText("de " + s.total).width + 24;
      ctx.fillStyle = "#5b6478";
      ctx.font = "600 " + L.txtFont + "px " + FONTE;
      ctx.fillText("propostas com que concordei", nx, base);

      // Barra proporcional à quantidade de propostas com que concordou
      var bx = cx, by = y + cardH - L.barGap, bw = W - M - 44 - bx;
      ctx.fillStyle = "#eef0f5";
      retangulo(ctx, bx, by, bw, 26, 13); ctx.fill();
      if (s.sim > 0) {
        ctx.fillStyle = cand.hex;
        retangulo(ctx, bx, by, Math.max(26, (bw * s.sim) / s.total), 26, 13); ctx.fill();
      }
      y += cardH + (stories ? 48 : 28);
    });

    // Rodapé
    var fy = H - (stories ? 250 : 140);
    ctx.textAlign = "center";
    ctx.fillStyle = "#c9d4ff";
    ctx.font = "600 34px " + FONTE;
    ctx.fillText("Faça o seu quiz em", W / 2, fy);
    // Domínio em destaque; a fonte diminui se não couber na largura.
    var tam = 56;
    do {
      ctx.font = "900 " + tam + "px " + FONTE;
      tam -= 2;
    } while (ctx.measureText(SITE).width > W - M * 2 && tam > 24);
    ctx.fillStyle = "#ffd34d";
    ctx.fillText(SITE, W / 2, fy + 66);
    ctx.fillStyle = "#c9d4ff";
    ctx.font = "500 26px " + FONTE;
    ctx.fillText("Resultado individual · Não é pesquisa eleitoral nem enquete", W / 2, fy + 118);
    ctx.textAlign = "left";
    return cv;
  }

  function atualizarPreview() {
    $("ig-preview").src = desenhar(formato).toDataURL("image/png");
    document.querySelectorAll("[data-formato]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.formato === formato);
    });
  }

  function gerarArquivo() {
    return new Promise(function (ok) {
      desenhar(formato).toBlob(function (blob) {
        ok(new File([blob], "meu-resultado-quiz-2turno-" + formato + ".png", { type: "image/png" }));
      }, "image/png");
    });
  }

  function baixar(arquivo) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(arquivo);
    a.download = arquivo.name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  document.querySelectorAll("[data-formato]").forEach(function (b) {
    b.addEventListener("click", function () { formato = b.dataset.formato; atualizarPreview(); });
  });
  // No celular abre o menu de compartilhamento (Instagram, WhatsApp...); no computador, baixa a imagem.
  $("ig-compartilhar").addEventListener("click", function () {
    gerarArquivo().then(function (arq) {
      if (navigator.canShare && navigator.canShare({ files: [arq] })) {
        navigator.share({ files: [arq], title: "Meu resultado no quiz de afinidade" }).catch(function () {});
      } else {
        baixar(arq);
      }
    });
  });
  $("ig-baixar").addEventListener("click", function () { gerarArquivo().then(baixar); });

  document.querySelectorAll("[data-resp]").forEach(function (b) {
    b.addEventListener("click", function () { responder(b.dataset.resp); });
  });
  $("quiz-voltar").addEventListener("click", function () { if (i > 0) { i--; mostrar(); } });
  $("quiz-comecar").addEventListener("click", iniciar);
  $("quiz-refazer").addEventListener("click", iniciar);

  // O compartilhamento convida a fazer o quiz, sem divulgar o resultado individual.
  $("quiz-compartilhar").addEventListener("click", function () {
    var texto = "Descubra com quais propostas de Lula e Flávio Bolsonaro você mais concorda — sem saber de quem é cada uma:";
    var link = location.href.split("#")[0];
    if (navigator.share) {
      navigator.share({ title: "Quiz de afinidade — 2º turno 2026", text: texto, url: link }).catch(function () {});
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(texto + " " + link), "_blank", "noopener");
    }
  });
})();
