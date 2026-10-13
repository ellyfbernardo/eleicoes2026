// Comportamentos comuns a todas as páginas.
(function () {
  // Inicializa os blocos de anúncio do AdSense presentes na página.
  document.querySelectorAll("ins.adsbygoogle").forEach(function () {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  });

  // Aviso de cookies (LGPD).
  if (!localStorage.getItem("cookie-ok")) {
    var box = document.createElement("div");
    box.className = "cookie";
    box.innerHTML =
      '<p>Usamos cookies, inclusive do Google AdSense, para exibir anúncios e medir audiência. ' +
      'Saiba mais na nossa <a href="privacidade.html">Política de Privacidade</a>.</p>' +
      '<button class="btn" type="button">Entendi</button>';
    box.querySelector("button").addEventListener("click", function () {
      localStorage.setItem("cookie-ok", "1");
      box.remove();
    });
    document.body.appendChild(box);
  }

  // Contagem regressiva para a abertura das urnas (25/10/2026, 8h de Brasília).
  var cd = document.getElementById("countdown");
  if (cd) {
    var target = new Date("2026-10-25T08:00:00-03:00").getTime();
    var close = new Date("2026-10-25T17:00:00-03:00").getTime();
    var tick = function () {
      var now = Date.now();
      if (now >= close) {
        cd.innerHTML = '<p style="font-size:1.2rem;margin:0"><strong>Votação encerrada.</strong> Acompanhe a <a href="apuracao.html" style="color:#ffd34d">apuração ao vivo</a>.</p>';
        return;
      }
      if (now >= target) {
        cd.innerHTML = '<p style="font-size:1.2rem;margin:0"><strong>Urnas abertas até 17h (horário de Brasília).</strong></p>';
        return;
      }
      var s = Math.floor((target - now) / 1000);
      var parts = [
        [Math.floor(s / 86400), "dias"],
        [Math.floor((s % 86400) / 3600), "horas"],
        [Math.floor((s % 3600) / 60), "min"],
        [s % 60, "seg"],
      ];
      cd.innerHTML = parts
        .map(function (p) { return "<div><strong>" + String(p[0]).padStart(2, "0") + "</strong><span>" + p[1] + "</span></div>"; })
        .join("");
      setTimeout(tick, 1000);
    };
    tick();
  }

  // Filtros da página de propostas.
  var toggles = document.querySelectorAll("[data-view]");
  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.body.classList.remove("only-lula", "only-flavio");
      if (btn.dataset.view !== "both") document.body.classList.add("only-" + btn.dataset.view);
      toggles.forEach(function (b) { b.classList.toggle("active", b === btn); });
    });
  });
})();
