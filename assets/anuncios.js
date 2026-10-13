// Espaços de venda direta "Anuncie seu negócio aqui".
//
// COMO PUBLICAR UM ANÚNCIO VENDIDO
// 1. Coloque as artes em assets/anuncios/ (ex.: assets/anuncios/padaria-lateral.jpg).
// 2. Preencha o espaço abaixo, trocando null por:
//      { nome: "Padaria do Zé", link: "https://...", img: "assets/anuncios/padaria-lateral.jpg" }
//    Nos banners horizontais, informe também a arte do celular:
//      { nome: "...", link: "...", img: "assets/anuncios/x-728x90.jpg", imgCelular: "assets/anuncios/x-640x200.jpg" }
// 3. Para voltar a mostrar "Anuncie aqui", troque de novo por null.
//
// TAMANHOS DAS ARTES
//   Laterais (só desktop) ............ 160 x 600 px
//   Banners horizontais (desktop) .... 728 x 90 px  (envie 1456 x 180 para telas retina)
//   Banners horizontais (celular) .... 640 x 200 px (aparece em 320 x 100)
//
// Não aceite anúncios de partidos, candidatos ou campanhas: propaganda eleitoral paga em sites é proibida.
var ANUNCIOS = {
  // Início
  "inicio-lateral-esq": null,
  "inicio-lateral-dir": null,
  "inicio-banner": null,
  // Propostas
  "propostas-lateral-esq": null,
  "propostas-lateral-dir": null,
  "propostas-banner-1": null,
  "propostas-banner-2": null,
  // Apuração
  "apuracao-lateral-esq": null,
  "apuracao-lateral-dir": null,
  "apuracao-banner": null,
  // Quiz
  "quiz-lateral-esq": null,
  "quiz-lateral-dir": null,
  "quiz-banner": null,
  // Como votar
  "como-votar-lateral-esq": null,
  "como-votar-lateral-dir": null,
  "como-votar-banner": null,
};

(function () {
  // Os botões levam à seção "Anuncie no site" da página de contato (funciona mesmo sem programa de e-mail).
  var CONTATO = "contato.html#anuncie";

  // Textos alternados para os espaços vazios não ficarem todos iguais.
  var CHAMADAS = [
    { ico: "📣", titulo: "Anuncie seu negócio aqui", texto: "Apareça para quem está acompanhando as eleições 2026." },
    { ico: "🚀", titulo: "Sua marca neste espaço", texto: "Divulgue seu negócio durante o 2º turno." },
    { ico: "🎯", titulo: "Seu anúncio aqui", texto: "Alcance eleitores de todo o Brasil." },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function vendido(a, banner) {
    var img = '<img src="' + esc(a.img) + '" alt="' + esc(a.nome) + '" loading="lazy">';
    if (banner && a.imgCelular) {
      img = '<picture><source media="(max-width: 760px)" srcset="' + esc(a.imgCelular) + '">' + img + "</picture>";
    }
    return (
      '<span class="biz-label">Publicidade</span>' +
      '<a class="biz-link" href="' + esc(a.link) + '" target="_blank" rel="sponsored noopener">' + img + "</a>"
    );
  }

  function vazio(c, banner) {
    return (
      '<span class="biz-label">Espaço publicitário</span>' +
      '<div class="biz-ico">' + c.ico + "</div>" +
      (banner ? '<div class="biz-txt">' : "") +
      "<strong>" + c.titulo + "</strong><p>" + c.texto + "</p>" +
      (banner ? "</div>" : "") +
      '<a class="btn" href="' + CONTATO + '">' + (banner ? "Anunciar" : "Quero anunciar") + "</a>"
    );
  }

  document.querySelectorAll("[data-anuncio]").forEach(function (el, i) {
    var id = el.dataset.anuncio;
    var banner = el.classList.contains("biz-banner");
    var a = ANUNCIOS[id];
    el.setAttribute("aria-label", "Espaço publicitário");
    el.innerHTML =
      '<div class="biz-slot' + (a ? " biz-vendido" : "") + '">' +
      (a ? vendido(a, banner) : vazio(CHAMADAS[i % CHAMADAS.length], banner)) +
      "</div>";
  });
})();
