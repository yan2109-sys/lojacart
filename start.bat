@echo off
title Loja FiveM
cd /d "%~dp0"

echo.
echo  ========================================
echo   Loja FiveM - Estilo CentralCart
echo  ========================================
echo.

if not exist ".env" (
    echo DATABASE_URL="file:./prisma/dev.db" > .env
    echo ADMIN_SECRET="fivem-loja-admin-secret-change-me" >> .env
    echo NEXT_PUBLIC_APP_URL="http://localhost:3000" >> .env
)

echo  Preparando banco de dados...
call npx prisma generate >nul 2>&1
call npx prisma db push >nul 2>&1
call npm run db:seed >nul 2>&1

echo  Abrindo porta 3000 no firewall...
netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=3000 >nul 2>&1

echo.
echo  Iniciando servidor em background...
start /min cmd /c "cd /d "%~dp0" && npm run dev"
timeout /t 5 >nul

echo.
echo  Iniciando ngrok para acesso PUBLICO...
echo  A URL abaixo pode ser compartilhada com QUALQUER PESSOA
echo  NAO FECHE ESTA JANELA - o ngrok precisa ficar rodando
echo.
npx ngrok http 3000
pause
