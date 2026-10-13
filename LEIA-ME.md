# Segundo Turno 2026 — site estático

Páginas: index, propostas, apuracao (ao vivo, dados do TSE), como-votar, sobre, contato, privacidade.
Não precisa de servidor/back-end: a apuração busca os JSON públicos do TSE direto do navegador.

## Antes de publicar
1. Troque `ca-pub-9078973827446715` pelo seu ID do AdSense em TODOS os .html e no `ads.txt`
   (no ads.txt fica `pub-...`, sem o `ca-`).
2. Troque os `data-ad-slot="000000000X"` pelos IDs dos blocos criados no AdSense
   (ou apague os blocos `<ins>` e use só Anúncios automáticos).
3. Troque `seudominio.com.br` em `robots.txt`, `sitemap.xml` e o e-mail em `contato.html`.

## Publicar (grátis)
- Netlify: arraste esta pasta em https://app.netlify.com/drop
- ou Vercel / Cloudflare Pages / GitHub Pages.
Depois conecte um domínio próprio (.com.br) — o AdSense exige domínio próprio.

## Apuração
- Código das eleições no TSE: 1º turno 6257, 2º turno 6258 (em `assets/apuracao.js`).
- Atualiza o nacional a cada 15 s e os estados a cada 60 s, sem recarregar a página.
- Teste já com dados reais: `apuracao.html?turno=1`.

## Anúncios de venda direta ("Anuncie seu negócio aqui")
- Todos os espaços são configurados em `assets/anuncios.js` (instruções no topo do arquivo).
- Para publicar um anúncio vendido: coloque a arte em `assets/anuncios/` e troque `null` pelo
  `{ nome, link, img }` do espaço. Para voltar ao "Anuncie aqui", volte para `null`.
- Tamanhos: laterais 160x600 · banners 728x90 (desktop) + 640x200 (celular, campo `imgCelular`).
- Laterais aparecem a partir de 1200px (quiz, como votar) ou 1560px (início, propostas, apuração).
- Não aceite anúncios de partidos, candidatos ou campanhas.
