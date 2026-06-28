# Roadmap

## SEO e Acessibilidade Técnica

- Revisar metadados principais da página: title, description, canonical, Open Graph e Twitter Card.
- Adicionar JSON-LD para identificar Cecília Mauad e Em Casa com Cecília como presença oficial.
- Garantir hierarquia semântica com um `h1` e seções com `h2` acessíveis.
- Melhorar `alt` de imagens relevantes e manter imagens decorativas com `alt=""`.
- Adicionar `aria-label` em botões e links que dependem de ícones ou contexto visual.

## Experiência Visual

- Manter animações discretas, sem loop infinito agressivo.
- Repetir a sequência de respiração em 3 ciclos gerais, com 10 segundos entre ciclos.
- Respeitar `prefers-reduced-motion` para usuários que desativam movimento.

## Validação

- Rodar `npm run lint` e `npm run build` antes de publicar.
- Verificar produção após deploy com resposta HTTP `200 OK`.
