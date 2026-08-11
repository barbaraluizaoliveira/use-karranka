import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Login } from './pages/Login';
import { App } from './App';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { CartProvider } from './context/CartContext';
import { theme } from './styles/theme'; 
import { GlobalStyle } from './styles/global'; 
import RegisterScreen from './pages/Register';
import { OrderSuccess } from './pages/OrderSuccess';
import { MyOrders } from './pages/MyOrders';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  //const token = localStorage.getItem("token");
  const token = localStorage.getItem("@Karranka:token");
  const isAuthenticated = !!token && token !== "null" && token !== "undefined" && token.length > 5;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/my-orders" element={<MyOrders />} />
            {/* Rota Privada */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
);