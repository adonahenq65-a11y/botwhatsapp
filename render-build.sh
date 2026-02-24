#!/usr/bin/env bash

echo "🚀 Iniciando build final..."

# Instalar dependencias
npm install

# Mostrar información de Chrome
echo "🔍 Verificando Chrome..."
which google-chrome-stable || which chromium-browser || echo "Chrome no encontrado en PATH"

echo "✅ Build completado"
