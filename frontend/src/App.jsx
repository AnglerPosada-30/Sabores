import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Pedidos from './pages/Pedidos';
import Registro from './pages/Registro';
import MenuDetallado from './pages/MenuDetallado'; // 1. Importa tu menú detallado

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/menu" element={<MenuDetallado />} /> {/* 2. Agrega esta ruta */}
      </Routes>
    </Router>
  );
}

export default App;