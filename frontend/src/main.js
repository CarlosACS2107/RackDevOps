import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers';
import { AuthProvider } from './auth/AuthContext';
import App from './App';
import './index.css';
const root = document.getElementById('root');
if (root) {
    createRoot(root).render(_jsx(StrictMode, { children: _jsx(AppProviders, { children: _jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(App, {}) }) }) }) }));
}
