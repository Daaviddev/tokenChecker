/* eslint-disable @typescript-eslint/no-explicit-any */
// Polyfill for the global object
if (typeof global === 'undefined') {
  (window as any).global = window;
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
