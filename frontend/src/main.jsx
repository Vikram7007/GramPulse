import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers import कर
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';

// Multi-language (जर तू i18n वापरत असशील तर)
import './i18n/index.js';  // comment कर अगर नाही वापरत
import './i18n/i18n.js';  // हा line add कर
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontSize: '16px',
              },
              success: {
                style: {
                  background: '#10b981',
                  color: 'white',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: 'white',
                },
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);