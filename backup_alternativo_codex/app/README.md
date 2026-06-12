# Em Casa Com Cecília Link Hub

Versão alternativa do link da bio, criada para comparação com o protótipo do Kimi. O foco desta implementação é conversão, legibilidade, carregamento leve e evolução futura para dados administráveis.

## Executar

```bash
npm install
npm run dev
```

O servidor local usa `http://localhost:4174`.

## Validar

```bash
npm run lint
npm run build
```

## Conteúdo

Links, perfil e cupons ficam centralizados em `src/content.ts`. Antes de publicar:

- confirme todos os links e códigos de cupom;
- substitua `public/images/profile-mark.svg` pela foto oficial, se desejado;
- configure uma URL real do canal no link do YouTube;
- use uma imagem JPG ou PNG absoluta nas tags Open Graph em produção.

O build estático é criado em `dist/` e usa caminhos relativos para funcionar em domínio ou subpasta.
