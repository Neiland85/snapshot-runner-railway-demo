#!/bin/bash

echo "🔍 Testing GraphQL Queries..."

# Verificar que el servidor esté corriendo
echo "📡 Checking server status..."
if curl -s http://localhost:4000/health > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Start it first with: node dist/index.js"
    exit 1
fi

echo ""
echo "🧪 Testing GraphQL endpoint..."

# Query básica de status
echo "1️⃣ Testing basic status query..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ status }"}' \
  http://localhost:4000/graphql

echo -e "\n"

# Query para obtener todas las auditorías
echo "2️⃣ Testing audits query..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ audits { id type status target language containerId createdAt } }"}' \
  http://localhost:4000/graphql

echo -e "\n"

# Query para obtener contenedores activos
echo "3️⃣ Testing active containers query..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ activeContainers { id status auditId image createdAt } }"}' \
  http://localhost:4000/graphql

echo -e "\n"

# Query con filtro
echo "4️⃣ Testing audits with filter..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ audits(filter: { type: PORT_SCAN }) { id type status target results { summary ports { number protocol state service } } } }"}' \
  http://localhost:4000/graphql

echo -e "\n"

# Mutation para iniciar un port scan
echo "5️⃣ Testing start port scan mutation..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { startPortScan(input: { target: \"192.168.1.100\" }) { id type status target containerId createdAt } }"}' \
  http://localhost:4000/graphql

echo -e "\n"

# Query para obtener auditoría específica
echo "6️⃣ Testing specific audit query..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ audit(id: \"1\") { id type status target language results { summary details vulnerabilities { id severity title } ports { number protocol state service } dependencies { name version } } } }"}' \
  http://localhost:4000/graphql

echo -e "\n"

# Mutation para dependency scan
echo "7️⃣ Testing dependency scan mutation..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { startDependencyScan(input: { language: NODEJS, projectPath: \"/app/project\" }) { id type status target language containerId } }"}' \
  http://localhost:4000/graphql

echo -e "\n"

echo "✅ GraphQL tests completed!"
echo "🎯 You can also visit http://localhost:4000/graphql in your browser for GraphQL Playground"
