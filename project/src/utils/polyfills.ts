import { Buffer } from 'buffer';

// Polyfills necessários para módulos Node.js no navegador
window.Buffer = Buffer;
window.process = {
  ...window.process,
  env: {
    ...window.process?.env,
    NODE_ENV: import.meta.env.MODE,
    VITE_API_URL: import.meta.env.VITE_API_URL
  }
};
