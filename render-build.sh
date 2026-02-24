#!/usr/bin/env bash

echo "🚀 Iniciando build optimizado para Render..."

# Forzar descarga de Chrome
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
export PUPPETEER_CACHE_DIR=/opt/render/project/.cache/puppeteer

# Instalar dependencias
npm install

# Instalar Chrome a la fuerza
echo "📦 Forzando instalación de Chrome..."
node node_modules/puppeteer/install.js

# Verificar instalación
echo "🔍 Verificando Chrome:"
find /opt/render -name "chrome" -type f 2>/dev/null || echo "Chrome no encontrado"

echo "✅ Build completado exitosamente"
