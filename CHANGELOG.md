# Changelog

Todas as alterações relevantes deste projeto serão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa versionamento semântico a partir da estabilização da primeira versão publicável.

## [Unreleased]

### Added

- Guia de contribuição em `AGENTS.md`.
- Protótipo alternativo preservado em `backup_alternativo_codex/`.
- Documentação específica do projeto em `README.md`.
- Camada centralizada para links e tipos compartilhados.
- Consumo em tempo real do feed `ultimos-posts-dicas.json`.
- Sincronização do YouTube durante desenvolvimento e build, sem expor tokens no bundle.

### Changed

- Projeto original do Kimi movido do subdiretório para a raiz.
- Pacote renomeado para `em-casa-com-cecilia-linkhub`.
- Dependências vulneráveis atualizadas com `npm audit fix`.
- Tipagem da resposta da API do YouTube corrigida.
- Ciclo de limpeza do fundo WebGL corrigido.
- Configuração do Vite simplificada e plugin de inspeção do Kimi removido.
- Ofertas demonstrativas substituídas pelo feed público real do Dicas.
- Vídeos fictícios substituídos pelos seis uploads mais recentes do canal configurado.
- Links oficiais centralizados a partir do site principal.
- Foto oficial da Cecília aplicada ao perfil.
- Métricas do mídia kit atualizadas para alcance e engajamento informados.
- Título, idioma e metadados básicos da página atualizados.
- Dicas & Promoções movido dos links principais para um card fixo no carrossel.
- E-book Air Fryer mantido como configuração desativada.
- Domínio canônico definido como `link.emcasacomcecilia.com`.
- Suporte a Google Analytics 4 e eventos de clique preparado via ambiente.
- Fundo WebGL atual preservado em backup antes dos estudos visuais.
- Fundo WebGL substituído pelo tema estático de papel premium claro.
- Cabeçalho reorganizado horizontalmente para exibir mais conteúdo antes da rolagem.
- Animações de entrada simplificadas para não ocultar conteúdo nem manter cartões flutuando.
- Cores de cartões, controles e textos ajustadas para contraste no tema claro.
- Links das redes sociais movidos do rodapé para o cabeçalho.
- E-mail de contato comercial adicionado abaixo do mídia kit.
- Redes sociais reposicionadas antes da área “Marcas”.
- Ícones genéricos substituídos por logotipos de redes sociais sem círculos.
- Cabeçalho atualizado com slogan oficial e link do perfil para o Instagram.
- Nome “Cecília Mauad” recebeu destaque editorial no cabeçalho.
- Textos dos links principais e descrição da DAMIE revisados.
- Logotipos oficiais de DAMIE, Dolce Gusto e YesStyle aplicados aos cupons.
- Interação de troca de texto restaurada nos links e estendida aos cupons.
- Favicon configurado com a foto oficial da Cecília.
- Checklist de publicação revisado para o estado atual do projeto.
- URLs rastreáveis de DAMIE e YesStyle aplicadas aos cupons.
- WhatsApp removido das redes sociais e substituído por X/Twitter.
- Campo fictício de WhatsApp direto removido da configuração.
- Primeira publicação definida sem GA4 até a implementação do consentimento.
- URL oficial da Dolce Gusto corrigida.
- YesStyle identificada como código de recompensa cumulativo, não cupom.
- Títulos dos links receberam transição de texto e movimento sutil dos ícones.
- Chips dos benefícios dos cupons receberam contraste reforçado.
- Propriedade GA4 `emcasacomcecilia` escolhida para preservar a jornada da marca.
- Measurement ID do GA4 configurado com coleta desativada até consentimento.
- Chip de recompensa removido da YesStyle e descrição cumulativa simplificada.
- Cards de cupons redesenhados como tickets compactos com aba destacável para copiar o código.
- Layout responsivo validado no modo mobile do navegador para a primeira publicação.
- Primeira versão aprovada publicada no repositório GitHub `brunollds/linktree`.
- Primeira versão publicada em `https://link.emcasacomcecilia.com`.
- HTTPS, imagens, ofertas, cupons e vídeos validados em produção.
- Seções “Links” e “Cupons” trocaram de posição na página.
- Workflow agendado criado para sincronizar YouTube e publicar na Hostinger às terças, quintas e sábados.
- Workflow atualizado para Node 24 e configuração SSH resiliente sem dependência de `ssh-keyscan`.
- Chave SSH do workflow alterada para Base64 para preservar sua formatação no GitHub Secrets.
- Arquivos `sitemap.xml`, `robots.txt` e `llms.txt` adicionados para mecanismos de busca e agentes de IA.
- Meta tag de verificação do Bing Webmaster Tools adicionada.
- Cupons Nestlé Nutre e I Wanna Sleep adicionados com logotipos oficiais.
- Chip `5% OFF` restaurado no card da YesStyle.
- Badge percentual das ofertas movido para o topo da imagem para compactar os cards.
- Encaixe dos logotipos dos cupons ajustado para preservar proporções das marcas.
- Ícone e badge de acesso do Mídia Kit ajustados para verde mais legível.

### Design Studies

- Galeria independente criada com seis alternativas de fundo para comparação.

### Removed

- Catálogo shadcn com aproximadamente 50 componentes não utilizados.
- Arquivos residuais do template Vite: `Home.tsx`, `LinkCard.tsx` e `App.css`.
- Hooks, utilitários e configuração shadcn sem referências.
- 251 pacotes transitivos associados ao código removido.

### Security

- Auditoria npm reduzida de 9 vulnerabilidades para 0.

### Validation

- `npm run lint` executa sem erros.
- `npm run build` gera o bundle de produção com sucesso.
