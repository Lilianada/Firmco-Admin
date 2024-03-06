import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import { AuthProvider } from './authState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
<AuthProvider>
  <App />
</AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
