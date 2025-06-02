import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/common.css';
import './index.css';
import App from './App';
import { TicketProvider } from './context/TicketContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TicketProvider>
      <ErrorBoundary>
       <App />
      </ErrorBoundary>
    </TicketProvider>
  </React.StrictMode>
);


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
