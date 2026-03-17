import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Ensure root element exists before rendering
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found! Check index.html');
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Error: Root element not found</h1><p>Please check index.html</p></div>';
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: #dc2626;">Application Error</h1>
        <p style="color: #6b7280; margin: 20px 0;">Failed to load the application.</p>
        <p style="color: #9ca3af; font-size: 14px;">Error: ${error.message}</p>
        <button 
          onclick="window.location.reload()" 
          style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Reload Page
        </button>
      </div>
    `;
  }
}

