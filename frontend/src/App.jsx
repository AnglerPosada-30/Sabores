import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RutaProtegida from './components/RutaProtegida';
import { CartProvider } from './CartContext'; // Proveedor global del carrito

// Importación de páginas
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Pedidos from './pages/Pedidos';
import Registro from './pages/Registro';
import Comprobante from './pages/Comprobante';
import MenuDetallado from './pages/MenuDetallado';
import Delivery from './pages/Delivery';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* 1. RUTAS PÚBLICAS (Cualquiera puede entrar sin iniciar sesión) */}
          <Route path="/" element={<Catalogo />} /> {/* Asumiendo que el Catálogo es tu Home */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* 2. RUTAS PROTEGIDAS PARA CLIENTES Y ADMINISTRADORES */}
          <Route 
            path="/menu" 
            element={
              <RutaProtegida rolesPermitidos={['CLIENTE', 'ADMIN']}>
                <MenuDetallado />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <RutaProtegida rolesPermitidos={['CLIENTE', 'ADMIN']}>
                <Checkout />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/comprobante" 
            element={
              <RutaProtegida rolesPermitidos={['CLIENTE', 'ADMIN']}>
                <Comprobante />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/mis-pedidos" 
            element={
              <RutaProtegida rolesPermitidos={['CLIENTE']}>
                <Pedidos />
              </RutaProtegida>
            } 
          />

          {/* 3. RUTA EXCLUSIVA PARA REPARTIDORES */}
          <Route 
            path="/delivery" 
            element={
              <RutaProtegida rolesPermitidos={['REPARTIDOR']}>
                <Delivery />
              </RutaProtegida>
            } 
          />

          {/* 4. RUTA EXCLUSIVA PARA LA COCINA/ADMINISTRACIÓN */}
          <Route 
            path="/admin-panel" 
            element={
              <RutaProtegida rolesPermitidos={['ADMIN']}>
                <AdminPanel />
              </RutaProtegida>
            } 
          />

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;