# Roadmap

## SEO e Acessibilidade Técnica

- Revisar metadados principais da página: title, description, canonical, Open Graph e Twitter Card.
- Adicionar JSON-LD para identificar Cecília Mauad e Em Casa com Cecília como presença oficial.
- Garantir hierarquia semântica com um `h1` e seções com `h2` acessíveis.
- Melhorar `alt` de imagens relevantes e manter imagens decorativas com `alt=""`.
- Adicionar `aria-label` em botões e links que dependem de ícones ou contexto visual.

## Imagem Social

- Criar uma imagem dedicada de compartilhamento em 1200x630 px.
- Usar foto da Cecília, marca Em Casa com Cecília e chamada curta: “Receitas, cupons e ofertas”.
- Atualizar `og:image` e `twitter:image` para apontar para o novo arquivo.

## Fallback de Ofertas

- Definir 2 ou 3 ofertas/cards fixos para quando o feed do Dicas estiver indisponível.
- Manter os dados em arquivo local versionado, por exemplo `src/data/fallbackOffers.ts`.
- Exibir os cards fallback apenas em erro de rede ou resposta vazia.
- Diferenciar visualmente o estado com texto curto: “Ofertas recentes indisponíveis. Veja sugestões fixas.”

## Experiência Visual

- Manter animações discretas, sem loop infinito agressivo.
- Repetir a sequência de respiração em 3 ciclos gerais, com 10 segundos entre ciclos.
- Respeitar `prefers-reduced-motion` para usuários que desativam movimento.

## Validação

- Rodar `npm run lint` e `npm run build` antes de publicar.
- Verificar produção após deploy com resposta HTTP `200 OK`.
