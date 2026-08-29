import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { QueryClientProvider } from './providers/QueryClientProvider.jsx';
import './globalStyles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
