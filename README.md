# Loja FiveM — Plataforma estilo CentralCart

Loja completa para monetizar seu servidor FiveM com entrega automática.

## Início rápido

```bash
# Duplo clique em start.bat
# OU:
npm install
npx prisma db push
npm run db:seed
npm run dev
```

- **Loja:** http://localhost:3000
- **Admin:** http://localhost:3000/admin (senha: `admin123`)

## Funcionalidades

- Vitrine com categorias (VIP, Veículos, Dinheiro, Itens)
- Carrinho e checkout com PIX
- Entrega automática no servidor FiveM
- Painel admin (pedidos, produtos, configurações)
- Resource Lua para FiveM (estilo CentralCart)
- Comandos customizáveis por produto

## Integração FiveM

1. Copie a pasta `fivem-resource` para `resources/[local]/loja-fivem-delivery`
2. No painel admin > Configurações, copie o **Token API**
3. Edite `fivem-resource/config.lua`:
   ```lua
   Config.StoreUrl = "http://SEU-IP:3000"
   Config.ApiToken = "seu_token_aqui"
   ```
4. Adicione no `server.cfg`:
   ```
   ensure loja-fivem-delivery
   ```
5. Personalize `extensions/custom.lua` para vRP/ESX/QBCore

## Comandos de produto

| Comando | Args | Descrição |
|---------|------|-----------|
| `addvip` | `[id, tier, dias]` | Adiciona VIP |
| `givemoney` | `[id, valor]` | Dá dinheiro in-game |
| `givevehicle` | `[id, modelo]` | Adiciona veículo |
| `notify` | `[source]` | Notifica jogador |

Use `{client_identifier}` nos args do produto — substituído pelo ID do comprador.

## Estrutura

```
fivem-loja/
├── src/app/          # Loja + Admin + API
├── prisma/           # Banco SQLite
├── fivem-resource/   # Script FiveM
└── start.bat         # Iniciar no Windows
```

## Produção

- Hospede em VPS ou Vercel + banco PostgreSQL
- Configure domínio e HTTPS
- Integre webhook PIX real (Mercado Pago, Efi Pay)
- Aponte `Config.StoreUrl` para seu domínio
