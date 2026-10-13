// Apuração ao vivo — lê os arquivos públicos de divulgação do TSE.
// Não recarrega a página (atualiza só o conteúdo), o que é compatível com as políticas do AdSense.
(function () {
  var BASE = "https://resultados.tse.jus.br/oficial/ele2026/";
  var ELEICOES = {
    t2: { cod: "6258", nome: "2º turno — 25/10/2026" },
    t1: { cod: "6257", nome: "1º turno — 04/10/2026" },
  };
  var REFRESH_BR = 15000;
  var REFRESH_UF = 60000;

  var CORES = { "13": "var(--lula)", "22": "var(--flavio)" };
  var CORES_HEX = { "13": "#c62828", "22": "#1d4fb8" };
  // O TSE publica os nomes de urna sem acentos.
  var NOMES = { "22": "Flávio Bolsonaro" };
  var EXTRA = ["#6d4c41", "#00897b", "#8e24aa", "#f9a825", "#546e7a", "#d81b60", "#3949ab", "#7cb342", "#5d4037", "#0097a7"];

  var UFS = {
    ac: "Acre", al: "Alagoas", am: "Amazonas", ap: "Amapá", ba: "Bahia", ce: "Ceará", df: "Distrito Federal",
    es: "Espírito Santo", go: "Goiás", ma: "Maranhão", mg: "Minas Gerais", ms: "Mato Grosso do Sul",
    mt: "Mato Grosso", pa: "Pará", pb: "Paraíba", pe: "Pernambuco", pi: "Piauí", pr: "Paraná",
    rj: "Rio de Janeiro", rn: "Rio Grande do Norte", ro: "Rondônia", rr: "Roraima", rs: "Rio Grande do Sul",
    sc: "Santa Catarina", se: "Sergipe", sp: "São Paulo", to: "Tocantins",
  };
  // Posição [coluna, linha] de cada estado no mapa em blocos.
  var GRID = {
    rr: [2, 1], ap: [3, 1],
    am: [2, 2], pa: [3, 2], ma: [4, 2], ce: [5, 2], rn: [6, 2],
    ac: [1, 3], ro: [2, 3], mt: [3, 3], to: [4, 3], pi: [5, 3], pb: [6, 3], pe: [7, 3],
    ms: [3, 4], go: [4, 4], df: [5, 4], ba: [6, 4], al: [7, 4],
    pr: [3, 5], sp: [4, 5], mg: [5, 5], es: [6, 5], se: [7, 5],
    sc: [3, 6], rj: [5, 6],
    rs: [3, 7],
  };

  var atual = "t2";
  var timers = [];
  var ordemNacional = [];
  var corPorNumero = {};

  var $ = function (id) { return document.getElementById(id); };
  var num = function (s) { return parseFloat(String(s || "0").replace(",", ".")) || 0; };
  var fmt = function (n) { return Number(n || 0).toLocaleString("pt-BR"); };
  var pct = function (s) { return num(s).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"; };
  var titulo = function (s) {
    return String(s || "").toLowerCase().replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); });
  };

  function url(abr) {
    var cod = ELEICOES[atual].cod;
    return BASE + cod + "/dados/" + abr + "/" + abr + "-c0001-e00" + cod + "-u.json";
  }

  function candidatos(d) {
    var lista = [];
    var cargo = (d.carg || [])[0] || {};
    (cargo.agr || []).forEach(function (agr) {
      (agr.par || []).forEach(function (par) {
        (par.cand || []).forEach(function (c) {
          lista.push({
            n: c.n, sq: c.sqcand, nome: NOMES[c.n] || titulo(c.nmu), partido: par.sg,
            vice: c.vs && c.vs[0] ? titulo(c.vs[0].nmu) : "",
            votos: Number(c.vap || 0), pct: num(c.pvapn), eleito: c.e === "s",
            st: c.st || "",
          });
        });
      });
    });
    return lista.sort(function (a, b) { return b.votos - a.votos || a.nome.localeCompare(b.nome); });
  }

  function cor(n) {
    if (CORES[n]) return CORES[n];
    if (!corPorNumero[n]) corPorNumero[n] = EXTRA[Object.keys(corPorNumero).length % EXTRA.length];
    return corPorNumero[n];
  }

  function renderBR(d) {
    var s = d.s || {}, e = d.e || {}, v = d.v || {};
    var lista = candidatos(d);
    ordemNacional = lista.slice(0, 2);
    var totalizado = d.tf === "s";

    $("secoes-pct").textContent = pct(s.pst);
    $("secoes-bar").style.width = num(s.pst) + "%";
    $("secoes-txt").textContent = fmt(s.st) + " de " + fmt(s.ts) + " seções totalizadas";
    $("atualizado").textContent = d.ht
      ? "Última totalização: " + d.dt + " às " + d.ht + " (horário de Brasília)"
      : "Aguardando o início da totalização (a divulgação começa após as 17h de Brasília).";
    $("status-final").hidden = !totalizado;

    $("lista").innerHTML = lista.map(function (c) {
      var foto = BASE + ELEICOES[atual].cod + "/fotos/br/" + c.sq + ".jpeg";
      var tag = c.eleito && atual === "t2" && totalizado ? '<span class="eleito">Eleito</span>'
        : c.st === "2º turno" ? '<span class="eleito" style="background:#3949ab">2º turno</span>' : "";
      return (
        '<div class="result" style="--c:' + cor(c.n) + '">' +
          '<img src="' + foto + '" alt="Foto de ' + c.nome + '" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
          '<div><div class="name">' + c.nome + " " + tag + "</div>" +
          '<div class="meta">' + c.n + " · " + c.partido + (c.vice ? " · Vice: " + c.vice : "") + "</div></div>" +
          '<div><div class="pct">' + pct(c.pct) + '</div><div class="votes">' + fmt(c.votos) + " votos</div></div>" +
          '<div class="bar"><span style="width:' + c.pct + '%"></span></div>' +
        "</div>"
      );
    }).join("");

    $("stats").innerHTML = [
      [fmt(e.te), "Eleitorado apto"],
      [fmt(e.c) + " <small>(" + pct(e.pc) + ")</small>", "Comparecimento"],
      [fmt(e.a) + " <small>(" + pct(e.pa) + ")</small>", "Abstenção"],
      [fmt(v.vv), "Votos válidos"],
      [fmt(v.vb) + " <small>(" + pct(v.pvb) + ")</small>", "Brancos"],
      [fmt(v.tvn) + " <small>(" + pct(v.ptvn) + ")</small>", "Nulos"],
    ].map(function (x) { return '<div class="stat"><b>' + x[0] + "</b><span>" + x[1] + "</span></div>"; }).join("");
  }

  function renderUFs(dados) {
    var a = ordemNacional[0], b = ordemNacional[1];
    if (!a || !b) return;
    $("th-a").textContent = a.nome;
    $("th-b").textContent = b.nome;
    $("legenda").innerHTML =
      '<span><i style="background:' + (CORES_HEX[a.n] || cor(a.n)) + '"></i>' + a.nome + "</span>" +
      '<span><i style="background:' + (CORES_HEX[b.n] || cor(b.n)) + '"></i>' + b.nome + "</span>" +
      '<span><i style="background:#c3c9d6"></i>Sem votos apurados</span>';

    var linhas = [], tiles = [];
    Object.keys(UFS).forEach(function (uf) {
      var d = dados[uf];
      var lista = d ? candidatos(d) : [];
      var ca = lista.find(function (c) { return c.n === a.n; }) || { pct: 0, votos: 0 };
      var cb = lista.find(function (c) { return c.n === b.n; }) || { pct: 0, votos: 0 };
      var lider = lista[0] && lista[0].votos > 0 ? lista[0] : null;
      var secoes = d && d.s ? num(d.s.pst) : 0;

      var bg = lider ? (CORES_HEX[lider.n] || cor(lider.n)) : "#c3c9d6";
      var op = lider ? Math.min(1, 0.45 + (lider.pct - 40) / 40) : 1;
      var pos = GRID[uf];
      tiles.push(
        '<div class="uf-tile" title="' + UFS[uf] + (lider ? " — " + lider.nome + " " + pct(lider.pct) : "") + '" ' +
        'style="grid-column:' + pos[0] + ";grid-row:" + pos[1] + ";background:" + bg + ";opacity:" + op.toFixed(2) + '">' +
        "<span>" + uf.toUpperCase() + (lider ? "<small>" + Math.round(lider.pct) + "%</small>" : "") + "</span></div>"
      );

      var cls = function (c) { return lider && c.n === lider.n ? (c.n === "13" ? "lead-l" : "lead-f") : ""; };
      linhas.push(
        "<tr><td>" + UFS[uf] + " (" + uf.toUpperCase() + ")</td>" +
        "<td>" + pct(secoes) + "</td>" +
        '<td class="' + cls(a) + '">' + pct(ca.pct) + " <span class=\"muted small\">(" + fmt(ca.votos) + ")</span></td>" +
        '<td class="' + cls(b) + '">' + pct(cb.pct) + " <span class=\"muted small\">(" + fmt(cb.votos) + ")</span></td></tr>"
      );
    });
    $("mapa").innerHTML = tiles.join("");
    $("uf-body").innerHTML = linhas.join("");
  }

  function carregarBR() {
    return fetch(url("br"), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { renderBR(d); $("erro").hidden = true; })
      .catch(function () { $("erro").hidden = false; });
  }

  function carregarUFs() {
    var dados = {};
    return Promise.all(Object.keys(UFS).map(function (uf) {
      return fetch(url(uf), { cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { dados[uf] = d; })
        .catch(function () { dados[uf] = null; });
    })).then(function () { renderUFs(dados); });
  }

  function iniciar(chave) {
    atual = chave;
    timers.forEach(clearInterval);
    timers = [];
    document.querySelectorAll("[data-turno]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.turno === chave);
    });
    $("turno-nome").textContent = ELEICOES[chave].nome;
    carregarBR().then(carregarUFs);
    // Pausa as atualizações quando a aba está em segundo plano para poupar requisições.
    timers.push(setInterval(function () { if (!document.hidden) carregarBR(); }, REFRESH_BR));
    timers.push(setInterval(function () { if (!document.hidden) carregarUFs(); }, REFRESH_UF));
  }

  document.querySelectorAll("[data-turno]").forEach(function (b) {
    b.addEventListener("click", function () { iniciar(b.dataset.turno); });
  });
  $("btn-atualizar").addEventListener("click", function () { carregarBR().then(carregarUFs); });

  iniciar(new URLSearchParams(location.search).get("turno") === "1" ? "t1" : "t2");
})();
