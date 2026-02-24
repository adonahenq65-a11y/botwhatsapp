#!/usr/bin/env bash

echo "🚀 Build iniciado..."

# Forzar clonado completo si es necesario (solo para diagnosticar)
git fetch --unshallow 2>/dev/null || true

# Instalar dependencias
npm install

echo "✅ Build completado"
