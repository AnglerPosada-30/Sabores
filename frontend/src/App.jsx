import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Pedidos from './pages/Pedidos';
import Registro from './pages/Registro';
import Comprobante from './pages/Comprobante';
import MenuDetallado from './pages/MenuDetallado';
import Delivery, { PedidosDelivery } from './pages/Delivery';
import { CartProvider } from './CartContext'; // Proveedor global del carrito
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/delivery/pedidos" element={<PedidosDelivery />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/comprobante" element={<Comprobante />} />
          <Route path="/menu" element={<MenuDetallado />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;