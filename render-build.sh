#!/usr/bin/env bash

echo "🚀 Iniciando build simple..."

# Instalar dependencias
npm install

# Verificar que puppeteer se instaló
echo "🔍 Verificando puppeteer..."
ls -la node_modules/puppeteer/ || echo "Puppeteer no encontrado"

# Forzar descarga de Chrome
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
node node_modules/puppeteer/install.js

# Verificar Chrome
echo "🔍 Verificando Chrome..."
find node_modules -name "chrome" -type f 2>/dev/null | head -5 || echo "Chrome no encontrado"

echo "✅ Build completado"
