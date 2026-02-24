#!/usr/bin/env bash

echo "🚀 Iniciando build express..."

# Instalar solo lo necesario (sin instalar Chrome)
npm install puppeteer@21.11.0 --no-optional

# Instalar las demás dependencias
npm install

# Verificar instalación
echo "✅ Build completado. Chrome se descargará al iniciar el bot."
