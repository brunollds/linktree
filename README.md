# Em Casa Com Cecília Link Hub

Página de links, cupons, ofertas e conteúdo da Cecília. O frontend usa React, TypeScript, Vite, Tailwind CSS e GSAP, com um tema estático leve em papel premium.

As ofertas são carregadas em tempo real de `https://dicas.emcasacomcecilia.com/ultimos-posts-dicas.json`. Os vídeos do YouTube são sincronizados durante `npm run dev` e `npm run build`, gerando `public/data/youtube.json` sem incluir as credenciais no frontend.

## Desenvolvimento

Requer Node.js 20 ou superior.

```bash
npm install
cp .env.example .env
npm run dev
```

O servidor local usa `http://localhost:3000`.

Configure `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_ID` no `.env`. Esse arquivo é ignorado pelo Git.

## Validação

```bash
npm run lint
npm run build
npm run preview
```

O build estático é gerado em `dist/` e usa caminhos relativos para permitir publicação em domínio ou subpasta.

## Estrutura

- `src/App.tsx`: composição da página.
- `src/components/`: seções de links, cupons, ofertas, vídeos e mídia kit.
- `src/components/fluid/`: implementação WebGL preservada, mas não utilizada pelo tema atual.
- `src/data/site.ts`: links centrais e tipos compartilhados.
- `src/services/dicasOffers.ts`: leitura e normalização do feed público do Dicas.
- `scripts/sync-youtube.mjs`: sincronização segura da YouTube Data API.
- `public/images/`: imagens e logos estáticos.
- `public/data/youtube.json`: vídeos gerados para consumo da SPA.
- `backup_alternativo_codex/`: protótipo alternativo preservado apenas para comparação.

Confirme links, cupons e métricas antes de publicar. Ofertas e vídeos já usam fontes reais.
