#!/usr/bin/env bash

echo "🚀 Iniciando build ultra-rápido..."

# Instalar dependencias (sin instalar Chrome)
npm install --ignore-scripts

# Decirle a Puppeteer que use el Chrome del sistema
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

echo "✅ Build completado en tiempo récord"
