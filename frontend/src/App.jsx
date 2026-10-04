import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Pedidos from './pages/Pedidos';
import Registro from './pages/Registro';
import MenuDetallado from './pages/MenuDetallado';
import { CartProvider } from './CartContext'; // 1. Importa el proveedor del carrito

function App() {
  return (
    <CartProvider> {/* 2. Envuelve todo el Router para que el carrito sea global */}
      <Router>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/menu" element={<MenuDetallado />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;