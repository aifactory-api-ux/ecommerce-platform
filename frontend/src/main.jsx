import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error("No element with id 'root' found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);