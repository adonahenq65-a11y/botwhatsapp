#!/usr/bin/env bash

echo "🚀 Iniciando build optimizado para Render..."

# Usar Node.js 18 específicamente
export NODE_VERSION=18.18.0

# Instalar dependencias sin scripts para evitar descargas pesadas
npm install --ignore-scripts

# Instalar puppeteer de manera ligera
npm install puppeteer@19.11.1 --no-optional

# Descargar Chromium específico para el entorno
npx puppeteer browsers install chrome

echo "✅ Build completado exitosamente"