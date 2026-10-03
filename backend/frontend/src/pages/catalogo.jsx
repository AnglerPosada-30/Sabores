import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Catalogo() {
  // Estado para simular un carrito de compras rápido
  const [carrito, setCarrito] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  // Datos simulados basados en el informe técnico (Platos propios y de proveedores externos)
  const platos = [
    { id: 1, nombre: 'Cazuela de Vacuno Tradicional', tipo: 'propio', proveedor: 'El Comilón (Local)', precio: 6500, desc: 'Preparación casera con vacuno fresco, zapallo, choclo y papa.', icon: '🍲' },
    { id: 2, nombre: 'pastel de Choclo en Greda', tipo: 'propio', proveedor: 'El Comilón (Local)', precio: 7000, desc: 'Tradicional receta horneada con pino de carne, pollo, aceituna y albahaca.', icon: '🥧' },
    { id: 3, nombre: 'Ensalada Executive de Salmón', tipo: 'externo', proveedor: 'GreenFood SpA (Partner)', precio: 8500, desc: 'Mix de hojas verdes, salmón a la plancha, palta y aderezo de yogur.', icon: '🥗' },
    { id: 4, nombre: 'Menú Ejecutivo Pollo Arvejado', tipo: 'propio', proveedor: 'El Comilón (Local)', precio: 5800, desc: 'Incluye consomé de entrada, plato principal con arroz y postre del día.', icon: '🍗' },
  ];

  const platosFiltrados = filtro === 'todos' ? platos : platos.filter(p => p.tipo === filtro);

  const agregarAlPedido = (plato) => {
    setCarrito([...carrito, plato]);
    alert(`¡"${plato.nombre}" agregado a tu pedido!`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f5ff', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 1. BARRA DE NAVEGACIÓN SUPERIOR (Navbar) */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#6b46c1',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem' }}>🍔 EL COMILON</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.95rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Catálogo</Link>
          <Link to="/pedidos" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Mis Pedidos</Link>
          <span style={{ cursor: 'pointer', fontWeight: 'bold' }}>Convenios B2B</span>
          
          {/* Indicador de Carrito */}
          <div style={{ backgroundColor: '#553c9a', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
            🛒 Pedidos: {carrito.length}
          </div>

          <Link to="/login" style={{
            backgroundColor: 'white',
            color: '#6b46c1',
            padding: '8px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* 2. SECCIÓN HERO / BIENVENIDA INSTITUCIONAL */}
      <header style={{
        backgroundColor: '#553c9a',
        color: 'white',
        textAlign: 'center',
        padding: '50px 20px',
        boxShadow: 'inset 0 -10px 15px -10px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 15px 0' }}>
          Plataforma de Almuerzos y Convenios Corporativos
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '750px', margin: '0 auto 25px auto', color: '#e9d8fd' }}>
          Solucionamos el tiempo de almuerzo de los trabajadores del centro. Disfruta de comida casera tradicional de "El Comilón" y de nuestra red de proveedores externos asociados con despachos optimizados.
        </p>
      </header>

      {/* 3. CONTENEDOR PRINCIPAL Y FILTROS DE CATÁLOGO HÍBRIDO */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ color: '#4a307d', margin: 0 }}>Menú del Día y Oferta Unificada</h2>
          
          {/* Botones de Filtro (Modelando el Catálogo Híbrido del informe) */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setFiltro('todos')}
              style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #6b46c1', backgroundColor: filtro === 'todos' ? '#6b46c1' : 'white', color: filtro === 'todos' ? 'white' : '#6b46c1', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Todos
            </button>
            <button 
              onClick={() => setFiltro('propio')}
              style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #6b46c1', backgroundColor: filtro === 'propio' ? '#6b46c1' : 'white', color: filtro === 'propio' ? 'white' : '#6b46c1', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Cocina El Comilón
            </button>
            <button 
              onClick={() => setFiltro('externo')}
              style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #6b46c1', backgroundColor: filtro === 'externo' ? '#6b46c1' : 'white', color: filtro === 'externo' ? 'white' : '#6b46c1', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Proveedores Partners
            </button>
          </div>
        </div>

        {/* 4. CUADRÍCULA DE PRODUCTOS / TARJETAS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '25px'
        }}>
          {platosFiltrados.map((plato) => (
            <div key={plato.id} style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(107, 70, 193, 0.1)',
              border: '1px solid #e9d8fd',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '25px',
              transition: 'transform 0.2s'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '2.5rem' }}>{plato.icon}</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    backgroundColor: plato.tipo === 'propio' ? '#e9d8fd' : '#c6f6d5',
                    color: plato.tipo === 'propio' ? '#44337a' : '#22543d',
                    fontWeight: 'bold'
                  }}>
                    {plato.proveedor}
                  </span>
                </div>
                <h3 style={{ color: '#4a307d', margin: '0 0 10px 0', fontSize: '1.3rem' }}>{plato.nombre}</h3>
                <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '20px' }}>
                  {plato.desc}
                </p>
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#6b46c1', marginBottom: '15px' }}>
                  ${plato.pago || plato.precio.toLocaleString('es-CL')}
                </div>
                <button 
                  onClick={() => agregarAlPedido(plato)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#6b46c1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  Añadir al Pedido
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}