@echo off
echo Starting Coding Platform...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Installer les dépendances si nécessaire
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

REM Démarrer le serveur
echo Starting server...
npm run dev
pause
