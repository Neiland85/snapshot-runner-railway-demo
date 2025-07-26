import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';

async function startServer() {
  // Crear instancia de Express
  const app = express();

  // Configurar Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Configuración para desarrollo - desactivar Apollo Studio
    introspection: true,
    csrfPrevention: false,
  });

  // Inicializar Apollo Server
  await server.start();

  // Configurar middleware
  app.use(cors());
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  // GraphQL Playground simple
  app.get('/playground', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>GraphQL Playground - Snapshot Runner</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #1a1a1a;
            color: white;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          h1 { color: #61dafb; text-align: center; }
          .playground { 
            display: flex; 
            gap: 20px; 
            margin-top: 20px; 
            height: 60vh; 
          }
          .panel { 
            flex: 1; 
            background: #2d2d2d; 
            border-radius: 8px; 
            padding: 15px; 
          }
          textarea { 
            width: 100%; 
            height: 100%; 
            background: #1e1e1e; 
            color: #ffffff; 
            border: 1px solid #444; 
            border-radius: 4px; 
            padding: 10px; 
            font-family: 'Monaco', 'Consolas', monospace; 
            font-size: 14px;
            resize: none;
            outline: none;
            line-height: 1.4;
            tab-size: 2;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
          }
          textarea:focus { 
            border-color: #61dafb; 
            box-shadow: 0 0 0 2px rgba(97, 218, 251, 0.2); 
          }
          button { 
            background: #61dafb; 
            color: #000; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 4px; 
            cursor: pointer; 
            font-weight: bold;
            margin: 10px 0;
          }
          button:hover { background: #4fa8c5; }
          .result { 
            background: #1e1e1e; 
            border: 1px solid #444; 
            border-radius: 4px; 
            padding: 10px; 
            height: calc(100% - 60px); 
            overflow-y: auto;
            white-space: pre-wrap;
            font-family: 'Monaco', 'Consolas', monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 GraphQL Playground - Snapshot Runner</h1>
          <div class="playground">
            <div class="panel">
              <h3>Query</h3>
              <textarea id="query" placeholder="Escribe tu consulta GraphQL aquí... Puedes usar Ctrl+V para pegar">
{
  status
}</textarea>
              <div style="margin: 10px 0; display: flex; gap: 10px; flex-wrap: wrap;">
                <button onclick="executeQuery()">▶ Ejecutar Query</button>
                <button onclick="clearQuery()" style="background: #666; color: white;">🗑️ Limpiar</button>
                <button onclick="loadExample()" style="background: #4CAF50; color: white;">📝 Ejemplo</button>
                <button onclick="focusQuery()" style="background: #FF9800; color: white;">🎯 Enfocar</button>
              </div>
            </div>
            <div class="panel">
              <h3>Resultado</h3>
              <div id="result" class="result">Presiona "Ejecutar Query" para ver los resultados...</div>
            </div>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #2d2d2d; border-radius: 8px;">
            <h3>🔗 Endpoints disponibles:</h3>
            <ul>
              <li><strong>GraphQL:</strong> <code>http://localhost:4000/graphql</code></li>
              <li><strong>Health:</strong> <code>http://localhost:4000/health</code></li>
              <li><strong>Playground:</strong> <code>http://localhost:4000/playground</code></li>
            </ul>
          </div>
        </div>

        <script>
          async function executeQuery() {
            const query = document.getElementById('query').value;
            const resultDiv = document.getElementById('result');
            
            if (!query.trim()) {
              resultDiv.textContent = 'Por favor, ingresa una consulta GraphQL.';
              return;
            }

            resultDiv.textContent = 'Ejecutando consulta...';

            try {
              const response = await fetch('/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query })
              });

              const result = await response.json();
              resultDiv.textContent = JSON.stringify(result, null, 2);
            } catch (error) {
              resultDiv.textContent = 'Error: ' + error.message;
            }
          }

          function clearQuery() {
            document.getElementById('query').value = '';
            document.getElementById('query').focus();
          }

          function loadExample() {
            document.getElementById('query').value = \`{
  audits {
    id
    type
    status
    target
    createdAt
  }
}\`;
            document.getElementById('query').focus();
          }

          function focusQuery() {
            const textarea = document.getElementById('query');
            textarea.focus();
            textarea.select();
          }

          // Auto-enfocar al cargar la página
          window.addEventListener('load', function() {
            setTimeout(() => {
              document.getElementById('query').focus();
            }, 100);
          });

          // Permitir Ctrl+Enter para ejecutar
          document.getElementById('query').addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              executeQuery();
            }
          });

          // Mejorar el pegado
          document.getElementById('query').addEventListener('paste', function(e) {
            // Permitir el pegado normal
            setTimeout(() => {
              console.log('Contenido pegado correctamente');
            }, 10);
          });
        </script>
      </body>
      </html>
    `);
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'snapshot-runner-backend',
    });
  });

  // Ruta raíz
  app.get('/', (req, res) => {
    res.json({
      message: '🚀 Snapshot Runner Backend API',
      graphql: '/graphql',
      playground: '/playground',
      health: '/health',
      docs: 'Open /playground in browser for GraphQL Playground',
    });
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🎮 GraphQL Playground: http://localhost:${PORT}/playground`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
  });
}

// Manejo de errores
startServer().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});
