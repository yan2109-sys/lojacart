@echo off
title Deploy Automatizado - FiveM Loja
cd /d "%~dp0"

echo.
echo  ========================================
echo   Deploy Automatizado - FiveM Loja
echo  ========================================
echo.

echo  [1/5] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo  Erro ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo  [2/5] Inicializando Git...
if not exist ".git" (
    git init
    git add .
    git commit -m "Initial commit - FiveM Loja"
    echo  Git inicializado e commit criado
) else (
    echo  Git ja inicializado
)

echo.
echo  [3/5] Pronto para upload no GitHub
echo.
echo  PROXIMOS PASSOS:
echo  1. Va para https://github.com/new
echo  2. Crie um novo repositorio (publico ou privado)
echo  3. Copie a URL do repositorio (ex: https://github.com/usuario/fivem-loja.git)
echo  4. Cole a URL abaixo quando solicitado
echo.

set /p GITHUB_URL="Digite a URL do seu repositorio GitHub: "

if "%GITHUB_URL%"=="" (
    echo  URL do GitHub nao fornecida
    pause
    exit /b 1
)

echo.
echo  [4/5] Conectando ao GitHub...
git remote add origin %GITHUB_URL% 2>nul
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo  Erro ao fazer push para GitHub
    echo  Verifique suas credenciais do Git
    pause
    exit /b 1
)

echo.
echo  [5/5] Configuracao do banco de dados
echo.
echo  PROXIMO PASSO:
echo  1. Va para https://neon.tech
echo  2. Crie um projeto PostgreSQL
echo  3. Copie a Connection String (DATABASE_URL)
echo  4. Cole abaixo quando solicitado
echo.

set /p DATABASE_URL="Digite a DATABASE_URL do Neon: "

if "%DATABASE_URL%"=="" (
    echo  DATABASE_URL nao fornecida
    pause
    exit /b 1
)

echo.
echo  ========================================
echo   Deploy pronto para Vercel!
echo  ========================================
echo.
echo  PROXIMO PASSO FINAL:
echo  1. Va para https://vercel.com/new
echo  2. Importe seu repositorio do GitHub
echo  3. Configure as variaveis de ambiente:
echo     - DATABASE_URL: %DATABASE_URL%
echo     - ADMIN_SECRET: crie uma senha (ex: fivem-loja-admin-secret-123)
echo     - NEXT_PUBLIC_APP_URL: deixe em branco
echo  4. Clique em Deploy
echo.
echo  Após alguns minutos, seu site estara online!
echo.
pause
