import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Pedidos from './pages/Pedidos';
import Registro from './pages/Registro';
import Comprobante from './pages/Comprobante';
import MenuDetallado from './pages/MenuDetallado';
import Delivery from './pages/Delivery';
import { CartProvider } from './CartContext'; // 1. Importa el proveedor del carrito

function App() {
  return (
    <CartProvider> {/* 2. Envuelve todo el Router para que el carrito sea global */}
      <Router>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/comprobante" element={<Comprobante />} />
          <Route path="/menu" element={<MenuDetallado />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;