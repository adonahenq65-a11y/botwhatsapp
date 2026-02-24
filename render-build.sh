#!/usr/bin/env bash

echo "🚀 Iniciando build ultra-rápido..."

# Instalar Chrome del sistema (NO descargar)
sudo apt-get update
sudo apt-get install -y wget gnupg
sudo wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Instalar dependencias (sin puppeteer pesado)
npm install puppeteer-core

# Variables de entorno
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=$(which google-chrome-stable)

# Instalar resto de dependencias
npm install

echo "✅ Build completado"
echo "📍 Chrome instalado en: $(which google-chrome-stable)"
