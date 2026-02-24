#!/usr/bin/env bash

echo "🚀 Iniciando build optimizado para Render..."

# Instalar dependencias
npm install

# Instalar Chrome específicamente
echo "📦 Instalando Chrome manualmente..."
node node_modules/puppeteer/install.js

# Verificar instalación
echo "🔍 Verificando Chrome:"
ls -la node_modules/puppeteer/.local-chromium/ || echo "Directorio no encontrado"

echo "✅ Build completado exitosamente"
