import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { RoutePage } from './pages/RoutePage.tsx';
import { matchRoute } from './pages/routes.ts';

const page = matchRoute(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>{page ? <RoutePage page={page} /> : <App />}</StrictMode>,
);
