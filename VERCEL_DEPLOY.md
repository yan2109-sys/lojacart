# Deploy no Vercel - Passo a Passo

## 🚀 Deploy Automático no Vercel

### 1. Acesse o Vercel
- Vá para https://vercel.com
- Faça login com sua conta GitHub

### 2. Importe o projeto
- Clique em "Add New" → "Project"
- Selecione o repositório `yan2109-sys/lojacart`
- Clique em "Import"

### 3. Configure o projeto
- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `./` (padrão)
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)

### 4. Variáveis de Ambiente
Adicione estas variáveis em "Environment Variables":

```
DATABASE_URL = file:./prisma/dev.db
ADMIN_SECRET = fivem-loja-admin-secret-change-me
NEXT_PUBLIC_APP_URL = https://lojacart.vercel.app
```

### 5. Deploy
- Clique em "Deploy"
- Aguarde alguns minutos
- Seu site estará online em: `https://lojacart.vercel.app`

## ⚠️ Importante sobre Banco de Dados

Este projeto usa SQLite localmente. Para produção no Vercel, você precisará:

**Opção 1: Vercel Postgres (Recomendado)**
1. No painel do Vercel, vá em "Storage"
2. Crie um banco de dados Postgres
3. Copie a `POSTGRES_PRISMA_URL`
4. Atualize a variável `DATABASE_URL` com este valor

**Opção 2: Neon PostgreSQL**
1. Crie conta em https://neon.tech
2. Crie projeto PostgreSQL
3. Use a connection string como `DATABASE_URL`

## 🔗 Links Úteis
- Seu repositório: https://github.com/yan2109-sys/lojacart
- Vercel: https://vercel.com
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres

## 📝 Após o Deploy
1. Acesse `/admin` para configurar a loja
2. Senha padrão: `admin123`
3. Configure produtos, categorias e pagamentos
