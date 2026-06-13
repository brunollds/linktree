# Automação do YouTube

O workflow `.github/workflows/sync-youtube-deploy.yml` executa às 06:15
(horário de Brasília) nas terças, quintas e sábados. Ele sincroniza os seis
vídeos mais recentes, gera o build e publica em `link.emcasacomcecilia.com`.

## Configuração única no GitHub

Em `Settings → Secrets and variables → Actions`, crie:

- `YOUTUBE_API_KEY`: chave da YouTube Data API.
- `YOUTUBE_CHANNEL_ID`: ID do canal.
- `HOSTINGER_SSH_PRIVATE_KEY`: conteúdo completo da chave privada autorizada
  na Hostinger.

Não use o Measurement ID do Analytics como secret: o GA4 permanece desativado
até a implementação do consentimento.

## Teste manual

Abra `Actions → Sync YouTube and deploy → Run workflow`. O job deve concluir
as etapas de build, deploy e verificação da produção.
