import 'remixicon/fonts/remixicon.css';
import './styles/tokens.css';
import './styles/app.css';
import './styles/deck.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
