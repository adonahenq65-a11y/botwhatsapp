#!/usr/bin/env bash

echo "🚀 Iniciando build simple..."

# Instalar dependencias
npm install

# Instalar Chrome usando el método de Puppeteer (sin sudo)
echo "📦 Instalando Chrome..."
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
node node_modules/puppeteer/install.js

# Buscar la ruta exacta de Chrome
echo "🔍 Buscando Chrome..."
CHROME_PATH=$(find /opt/render -name "chrome" -type f 2>/dev/null | head -1)
if [ -z "$CHROME_PATH" ]; then
    CHROME_PATH=$(find node_modules -name "chrome" -type f 2>/dev/null | head -1)
fi

echo "📍 Chrome encontrado en: $CHROME_PATH"
echo "PUPPETEER_EXECUTABLE_PATH=$CHROME_PATH" >> $HOME/.bashrc

echo "✅ Build completado"
