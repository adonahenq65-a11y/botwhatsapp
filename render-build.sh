#!/usr/bin/env bash

echo "🚀 Iniciando build simple..."

# Instalar dependencias (puppeteer ya está en package.json)
npm install

# Forzar descarga de Chrome
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
node node_modules/puppeteer/install.js

echo "✅ Build completado"
echo "📍 Chrome instalado"
