// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Assuming your main application component is App.jsx
import './index.css'; // <--- THIS LINE IS CRUCIAL!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* Ensure your root component (e.g., <App />) is rendered here */}
  </React.StrictMode>,
);
