# Automação do YouTube

O workflow `.github/workflows/sync-youtube-deploy.yml` executa às 06:15
(horário de Brasília) nas terças, quintas e sábados. Ele sincroniza os seis
vídeos mais recentes, gera o build e publica em `link.emcasacomcecilia.com`.

## Configuração única no GitHub

Em `Settings → Secrets and variables → Actions`, crie:

- `YOUTUBE_API_KEY`: chave da YouTube Data API.
- `YOUTUBE_CHANNEL_ID`: ID do canal.
- `HOSTINGER_SSH_PRIVATE_KEY_B64`: chave privada autorizada na Hostinger
  convertida para Base64.

O GA4 é configurado diretamente no workflow com `VITE_GA_MEASUREMENT_ID` e
`VITE_GA_ENABLED=true`, pois o Measurement ID não é segredo.

Com GitHub CLI instalado e autenticado, os secrets podem ser cadastrados pelo
terminal:

```powershell
gh secret set YOUTUBE_API_KEY
gh secret set YOUTUBE_CHANNEL_ID
$bytes = [System.IO.File]::ReadAllBytes("$HOME\.ssh\id_ed25519")
[Convert]::ToBase64String($bytes) | gh secret set HOSTINGER_SSH_PRIVATE_KEY_B64
```

Sem GitHub CLI, gere o valor e copie a saída para a página de secrets:

```powershell
$bytes = [System.IO.File]::ReadAllBytes("$HOME\.ssh\id_ed25519")
[Convert]::ToBase64String($bytes)
```

O resultado deve ser uma única linha, sem espaços ou quebras.

## Teste manual

Abra `Actions → Sync YouTube and deploy → Run workflow`. O job deve concluir
as etapas de build, deploy e verificação da produção.
