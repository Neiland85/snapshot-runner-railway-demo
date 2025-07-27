#!/bin/bash

# 🔐 Script de Actualización de Seguridad
# Fecha: 27 de julio de 2025

echo "🔍 Iniciando auditoría de seguridad..."

# 1. Auditoría del backend
echo "📦 Verificando backend..."
cd packages/backend
npm audit
if [ $? -eq 0 ]; then
    echo "✅ Backend seguro - 0 vulnerabilidades"
else
    echo "⚠️ Vulnerabilidades encontradas en backend"
fi

# 2. Auditoría del frontend
echo "🖥️ Verificando frontend..."
cd ../frontend
npm audit --audit-level=moderate
FRONTEND_AUDIT=$?

if [ $FRONTEND_AUDIT -ne 0 ]; then
    echo "⚠️ Se encontraron vulnerabilidades en frontend"
    echo "🔧 ¿Deseas aplicar las correcciones automáticas? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "🚀 Aplicando correcciones..."
        npm audit fix
        echo "✅ Correcciones aplicadas"
    else
        echo "⏭️ Omitiendo correcciones automáticas"
    fi
fi

# 3. Verificar archivos sensibles
echo "🔒 Verificando credenciales expuestas..."
cd ../../
if grep -r "password\|secret\|token\|api_key" --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" --exclude-dir=node_modules . | grep -v "EXAMPLE\|example\|\*\*\*\*"; then
    echo "🚨 ALERTA: Posibles credenciales expuestas encontradas"
else
    echo "✅ No se encontraron credenciales expuestas"
fi

# 4. Verificar .env
if [ -f ".env" ]; then
    if grep -q "your-.*-here\|example\|placeholder" .env; then
        echo "✅ Archivo .env tiene valores de placeholder"
    else
        echo "⚠️ Verificar que .env no tenga credenciales reales"
    fi
fi

echo "🎯 Auditoría de seguridad completada"
echo "📋 Revisa SECURITY-AUDIT.md para más detalles"
