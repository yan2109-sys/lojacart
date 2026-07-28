# Deploy no Vercel

## Passo a passo para deploy gratuito:

### 1. Preparar o projeto
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Criar conta no Vercel
- Acesse https://vercel.com
- Crie uma conta gratuita usando GitHub

### 3. Criar banco de dados Neon (PostgreSQL gratuito)
- Acesse https://neon.tech
- Crie uma conta gratuita
- Crie um novo projeto PostgreSQL
- Copie a connection string (DATABASE_URL)

### 4. Deploy no Vercel
- No painel do Vercel, clique em "Add New Project"
- Importe seu repositório do GitHub
- Configure as variáveis de ambiente:
  - `DATABASE_URL`: Cole a connection string do Neon
  - `ADMIN_SECRET`: Crie uma senha secreta (ex: `fivem-loja-admin-secret-123`)
  - `NEXT_PUBLIC_APP_URL`: Deixe em branco ou use `https://seu-projeto.vercel.app`

### 5. Deploy automático
- Clique em "Deploy"
- O Vercel vai construir e deployar automaticamente
- Após alguns minutos, você terá um link público (ex: `https://seu-projeto.vercel.app`)

### 6. Configurar banco de dados
- Após o deploy, rode o seed no banco Neon:
  - Use o dashboard do Neon para executar o script de seed
  - Ou configure um job no Vercel para rodar o seed

## Variáveis de ambiente necessárias:
- `DATABASE_URL`: Connection string do Neon PostgreSQL
- `ADMIN_SECRET`: Senha secreta para autenticação admin
- `NEXT_PUBLIC_APP_URL`: URL pública do site (opcional)

## Links úteis:
- Vercel: https://vercel.com
- Neon (PostgreSQL gratuito): https://neon.tech
