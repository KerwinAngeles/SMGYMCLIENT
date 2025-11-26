import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from '@/components/custom/ErrorBoundary.tsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={<p>Something went wrong. Please refresh the page and try again.</p>}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
