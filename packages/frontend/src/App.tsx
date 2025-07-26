import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Dashboard from './components/Dashboard';

// Configuración de Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-dark-900 text-dark-50">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              🚀 Snapshot Runner
            </h1>
            
            <Routes>
              <Route path="/" element={
                <>
                  <p className="text-center text-dark-300 mb-8">
                    Frontend listo para integrar componentes V0.dev
                  </p>
                  <div className="glass rounded-lg p-6 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-primary-400">
                      📋 Próximos Pasos:
                    </h2>
                    <ol className="list-decimal list-inside space-y-2 text-dark-200">
                      <li>Usar V0.dev con los prompts Railway creados</li>
                      <li>Generar componentes para Dashboard, Security, Dependencies</li>
                      <li>Integrar los componentes generados aquí</li>
                      <li>Conectar con GraphQL backend (ya configurado)</li>
                    </ol>
                  </div>
                </>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
