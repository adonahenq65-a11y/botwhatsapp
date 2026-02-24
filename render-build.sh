#!/usr/bin/env bash

echo "🚀 Iniciando build optimizado para Render..."

# Instalar dependencias
npm install

# Instalar puppeteer específicamente
npm install puppeteer@21.11.0

# BUSCAR CHROME Y MOSTRAR LA RUTA EN LOGS
echo "🔍 BUSCANDO CHROME - ESTO ES CRÍTICO:"
echo "----------------------------------------"

# Buscar en ubicaciones comunes de Render
echo "Buscando en /opt/render:"
find /opt/render -name "chrome" -type f 2>/dev/null || echo "No encontrado en /opt/render"

echo ""
echo "Buscando en node_modules:"
find node_modules -name "chrome" -type f 2>/dev/null || echo "No encontrado en node_modules"

echo "----------------------------------------"
echo "✅ Búsqueda completada"

# Instalar Chrome explícitamente
echo "📦 Instalando Chrome manualmente..."
node node_modules/puppeteer/install.js

echo "✅ Build completado"
