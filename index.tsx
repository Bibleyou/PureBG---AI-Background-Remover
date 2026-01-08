import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Falha ao renderizar o app:', error);
    rootElement.innerHTML = `<div style="padding: 20px; text-align: center; color: #ef4444; font-family: sans-serif;">
      <h1 style="font-size: 1.5rem; font-weight: bold;">Erro de Carregamento</h1>
      <p>Não foi possível iniciar a aplicação. Verifique sua conexão ou a chave de API na Vercel.</p>
    </div>`;
  }
}