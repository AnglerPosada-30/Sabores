import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Catalogo() {
  const [carrito, setCarrito] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  const platosMenu = [
    { id: 1, nombre: 'Cazuela de Vacuno Tradicional', tipo: 'propio', proveedor: 'El Comilón (Local)', precio: 6500, desc: 'Preparación casera con vacuno fresco, zapallo, choclo y papa.', icon: '🍲' },
    { id: 2, nombre: 'Pastel de Choclo en Greda', tipo: 'propio', proveedor: 'El Comilón (Local)', precio: 7000, desc: 'Tradicional receta horneada con pino de carne, pollo, aceituna y albahaca.', icon: '🥧' },
    { id: 3, nombre: 'Ensalada Executive de Salmón', tipo: 'externo', proveedor: 'GreenFood SpA (Partner)', precio: 8500, desc: 'Mix de hojas verdes, salmón a la plancha, palta y aderezo de yogur.', icon: '🥗' },
    { id: 4, nombre: 'Menú Ejecutivo Pollo Arvejado', tipo: 'propio', proveedor: 'El Comilón (Local)', precio: 5800, desc: 'Incluye consomé de entrada, plato principal con arroz y postre del día.', icon: '🍗' },
  ];

  const favoritos = [
    { id: 5, nombre: 'Lomo a lo Pobre Ejecutivo', tipo: 'propio', proveedor: 'El Comilón (Local)', precio: 7900, desc: 'Bife tierno con papas fritas caseras, cebolla caramelizada y dos huevos fritos.', icon: '🥩' },
    { id: 6, nombre: 'Bowl Veggie de Quínoa y Falafel', tipo: 'externo', proveedor: 'GreenFood SpA (Partner)', precio: 6900, desc: 'Quínoa orgánica, falafel crujiente, hummus, pepino y tomates cherry.', icon: '🥑' }
  ];

  const platosFiltrados = filtro === 'todos' ? platosMenu : platosMenu.filter(p => p.tipo === filtro);

  const agregarAlPedido = (plato) => {
    setCarrito([...carrito, plato]);
    alert(`¡"${plato.nombre}" agregado a tu pedido!`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      backgroundColor: '#b4a5ee',
      backgroundImage: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* 1. BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 2.5rem',
        backgroundColor: 'rgba(139, 92, 246, 0.9)',
        backdropFilter: 'blur(10px)',
        color: '#2e1065',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#ffffff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🍔</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px', color: '#2e1065' }}>EL COMILON</h2>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: '#2e1065', textDecoration: 'none', fontWeight: '700' }}>Menú</Link>
          <Link to="/login" style={{ color: '#2e1065', textDecoration: 'none', fontWeight: '700' }}>Iniciar Sesión</Link>
          <Link to="/registro" style={{ color: '#2e1065', textDecoration: 'none', fontWeight: '700' }}>Regístrate aquí</Link>
          
          <div style={{ backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', color: '#5b21b6', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            🛒 <span>Carrito ({carrito.length})</span>
          </div>
        </div>
      </nav>

      {/* 2. SECCIÓN HERO */}
      <header style={{
        color: '#2e1065',
        textAlign: 'center',
        padding: '35px 20px 20px 20px',
      }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          padding: '5px 14px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '10px',
          color: '#4c1d95',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          🍕 ¡Sabor Casero, Rápido y Exquisito! 🥗
        </div>
        <h1 style={{ fontSize: '2.2rem', margin: '0 0 10px 0', fontWeight: '800', color: '#2e1065', textShadow: '0 1px 4px rgba(255,255,255,0.4)' }}>
          Plataforma de Almuerzos y Convenios
        </h1>
        <p style={{ fontSize: '1rem', maxWidth: '650px', margin: '0 auto', color: '#4c1d95', lineHeight: '1.5', fontWeight: '500' }}>
          Disfruta de la mejor comida tradicional de "El Comilón" y de nuestra red de aliados corporativos con despachos rápidos y puntuales a oficinas.
        </p>
      </header>

      {/* 3. CONTENEDOR PRINCIPAL */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '15px 20px 50px 20px' }}>
        
        {/* MENÚ DEL DÍA Y FILTROS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ color: '#2e1065', margin: 0, fontWeight: '800', fontSize: '1.5rem' }}>Menú del Día</h2>
          
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(124, 58, 237, 0.2)', padding: '4px', borderRadius: '25px', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
            <button 
              onClick={() => setFiltro('todos')}
              style={{ padding: '6px 14px', borderRadius: '18px', border: 'none', backgroundColor: filtro === 'todos' ? '#ffffff' : 'transparent', color: filtro === 'todos' ? '#5b21b6' : '#2e1065', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}
            >
              Todos
            </button>
            <button 
              onClick={() => setFiltro('propio')}
              style={{ padding: '6px 14px', borderRadius: '18px', border: 'none', backgroundColor: filtro === 'propio' ? '#ffffff' : 'transparent', color: filtro === 'propio' ? '#5b21b6' : '#2e1065', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}
            >
              Cocina El Comilón
            </button>
            <button 
              onClick={() => setFiltro('externo')}
              style={{ padding: '6px 14px', borderRadius: '18px', border: 'none', backgroundColor: filtro === 'externo' ? '#ffffff' : 'transparent', color: filtro === 'externo' ? '#5b21b6' : '#2e1065', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}
            >
              Proveedores Partners
            </button>
          </div>
        </div>

        {/* Tarjetas Menú del Día */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {platosFiltrados.map((plato) => (
            <div key={plato.id} style={{
              background: '#ffffff', borderRadius: '14px', overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(46, 16, 101, 0.12)', border: '1px solid rgba(255, 255, 255, 0.8)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2.2rem' }}>{plato.icon}</span>
                  <span style={{ 
                    fontSize: '0.7rem', padding: '4px 10px', borderRadius: '12px', 
                    backgroundColor: plato.tipo === 'propio' ? '#f3e8ff' : '#dcfce7',
                    color: plato.tipo === 'propio' ? '#6b21a8' : '#166534', fontWeight: '700'
                  }}>
                    {plato.proveedor}
                  </span>
                </div>
                <h3 style={{ color: '#4c1d95', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '800' }}>{plato.nombre}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '15px' }}>{plato.desc}</p>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#7c3aed', marginBottom: '12px' }}>
                  ${plato.precio.toLocaleString('es-CL')}
                </div>
                <button 
                  onClick={() => agregarAlPedido(plato)}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}
                >
                  Añadir al Pedido
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* LOS MÁS PEDIDOS */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#2e1065', margin: '0 0 15px 0', fontWeight: '800', fontSize: '1.5rem' }}>⭐ Los Más Pedidos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {favoritos.map((plato) => (
              <div key={plato.id} style={{
                background: '#ffffff', borderRadius: '14px', overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(46, 16, 101, 0.12)', border: '1px solid rgba(255, 255, 255, 0.8)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '2.2rem' }}>{plato.icon}</span>
                    <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '700' }}>
                      🔥 Favorito de Oficinas
                    </span>
                  </div>
                  <h3 style={{ color: '#4c1d95', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '800' }}>{plato.nombre}</h3>
                  <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '15px' }}>{plato.desc}</p>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#7c3aed', marginBottom: '12px' }}>
                    ${plato.precio.toLocaleString('es-CL')}
                  </div>
                  <button 
                    onClick={() => agregarAlPedido(plato)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}
                  >
                    Añadir al Pedido
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN DELIVERY */}
        <div style={{ 
          background: '#ffffff', borderRadius: '14px', padding: '25px', marginBottom: '30px',
          boxShadow: '0 8px 20px rgba(46, 16, 101, 0.12)', border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
          <h2 style={{ color: '#4c1d95', margin: '0 0 10px 0', fontWeight: '800', fontSize: '1.4rem' }}>🚚 Delivery y Despacho a Oficinas</h2>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0' }}>
            Coordinamos entregas masivas y puntuales para asegurar que tu almuerzo llegue caliente y justo a la hora de descanso. 
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ backgroundColor: '#f5f3ff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd6fe' }}>
              <h4 style={{ color: '#7c3aed', margin: '0 0 6px 0', fontWeight: '700', fontSize: '0.95rem' }}>⏰ Horarios de Reparto</h4>
              <p style={{ color: '#4b5563', margin: 0, fontSize: '0.85rem' }}>Lunes a Viernes: 12:30 PM - 15:30 PM</p>
            </div>
            <div style={{ backgroundColor: '#f5f3ff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd6fe' }}>
              <h4 style={{ color: '#7c3aed', margin: '0 0 6px 0', fontWeight: '700', fontSize: '0.95rem' }}>📦 Despacho Optimizado</h4>
              <p style={{ color: '#4b5563', margin: 0, fontSize: '0.85rem' }}>Agrupamos pedidos por edificio corporativo sin costo extra en zonas céntricas.</p>
            </div>
            <div style={{ backgroundColor: '#f5f3ff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd6fe' }}>
              <h4 style={{ color: '#7c3aed', margin: '0 0 6px 0', fontWeight: '700', fontSize: '0.95rem' }}>🤝 Convenios B2B</h4>
              <p style={{ color: '#4b5563', margin: 0, fontSize: '0.85rem' }}>Facturación mensual consolidada para empresas asociadas.</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN DÓNDE UBICARNOS */}
        <div style={{ 
          background: '#ffffff', borderRadius: '14px', padding: '25px', marginBottom: '20px',
          boxShadow: '0 8px 20px rgba(46, 16, 101, 0.12)', border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
          <h2 style={{ color: '#4c1d95', margin: '0 0 10px 0', fontWeight: '800', fontSize: '1.4rem' }}>📍 Dónde Ubicarnos</h2>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 15px 0' }}>
            Visítanos en nuestro local central o comunícate con nuestro equipo comercial para consultas sobre convenios.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#4c1d95', fontSize: '0.9rem', fontWeight: '600' }}>
            <div>🏠 <strong>Dirección Central:</strong> Av. Principal 456, Centro de la Ciudad.</div>
            <div>📞 <strong>Teléfono de Contacto:</strong> +56 9 1234 5678</div>
            <div>✉️ <strong>Correo Electrónico:</strong> contacto@elcomilon.cl</div>
          </div>
        </div>

      </main>
    </div>
  );
}