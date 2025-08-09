#!/bin/bash
echo "Starting Coding Platform..."
echo

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Démarrer le serveur
echo "Starting server..."
npm run dev
