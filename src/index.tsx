import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './normalize.css';
import App from './App';
import { ClockProvider } from './features/useClock';
import { CountdownProvider } from './features/useCountdown';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ClockProvider>
      <CountdownProvider>
        <App />
      </CountdownProvider>
    </ClockProvider>
  </React.StrictMode>,
);
