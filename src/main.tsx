import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './lib/serviceWorker'

// Register Service Worker for background hourly notifications
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);

