import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { App } from './App';
import { ProductDetail } from './pages/ProductDetail';
import { theme } from './styles/theme'; 
import { GlobalStyle } from './styles/global'; 

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          {/* Rota da Vitrine Principal (Home) */}
          <Route path="/" element={<App />} />
          
          {/* Rota Dinâmica de Detalhes do Produto */}
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);