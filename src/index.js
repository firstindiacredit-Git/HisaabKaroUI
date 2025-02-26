import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './site-icon.png';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./context/AuthContext";
 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App>
    
    </App>
  
  </AuthProvider>
);
 

reportWebVitals();
