import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../public/css/bootstrap.min.css';
import '../public/css/site.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
