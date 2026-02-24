#!/usr/bin/env bash

echo "🚀 Iniciando build final..."

# Instalar dependencias normalmente
npm install

# Decirle a Puppeteer que no descargue Chrome
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

echo "✅ Build completado"
