import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RutaProtegida from './components/RutaProtegida';
import { CartProvider } from './CartContext'; 

// Importación de páginas
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Pedidos from './pages/Pedidos';
import Registro from './pages/Registro';
import Comprobante from './pages/Comprobante';
import MenuDetallado from './pages/MenuDetallado';
import Delivery from './pages/Delivery';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* 1. RUTAS PÚBLICAS */}
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* 2. RUTAS PROTEGIDAS PARA CLIENTES (NORMALES Y CORPORATIVOS) Y ADMINS */}
          <Route 
            path="/menu" 
            element={
              // AQUÍ ESTÁ LA MAGIA: Agregamos 'CLIENTE_CORP'
              <RutaProtegida rolesPermitidos={['CLIENTE', 'CLIENTE_CORP', 'ADMIN']}>
                <MenuDetallado />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <RutaProtegida rolesPermitidos={['CLIENTE', 'CLIENTE_CORP', 'ADMIN']}>
                <Checkout />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/comprobante" 
            element={
              <RutaProtegida rolesPermitidos={['CLIENTE', 'CLIENTE_CORP', 'ADMIN']}>
                <Comprobante />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/mis-pedidos" 
            element={
              <RutaProtegida rolesPermitidos={['CLIENTE', 'CLIENTE_CORP']}>
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