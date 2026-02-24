#!/usr/bin/env bash

echo "🚀 Iniciando build optimizado para Render..."

# Instalar dependencias
npm install

# Forzar instalación de puppeteer con la versión correcta
npm install puppeteer@21.11.0 --save

# Instalar Chrome
node node_modules/puppeteer/install.js

echo "✅ Build completado exitosamente"
