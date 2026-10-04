import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MenuDetallado() {
  const [carrito, setCarrito] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('platos');

  // Datos ampliados de la carta por categorías
  const cartaCompleta = {
    platos: [
      { id: 1, nombre: 'Empanadas de Pino Fritas (2 unid.)', proveedor: 'Entrada - El Comilón', precio: 3200, desc: 'Crujientes empanadas fritas rellenas de pino tradicional.', icon: '🥟' },
      { id: 2, nombre: 'Sopaipillas con Pebre Casero', proveedor: 'Entrada - El Comilón', precio: 2500, desc: 'Sopaipillas pasadas o al plato acompañadas de pebre fresco.', icon: '🫓' },
      { id: 3, nombre: 'Cazuela de Vacuno Tradicional', proveedor: 'El Comilón', precio: 6500, desc: 'Preparación casera con vacuno fresco, zapallo, choclo y papa.', icon: '🍲' },
      { id: 4, nombre: 'Pastel de Choclo en Greda', proveedor: 'El Comilón', precio: 7000, desc: 'Tradicional receta horneada con pino de carne, pollo y albahaca.', icon: '🥧' },
      { id: 5, nombre: 'Lomo a lo Pobre Ejecutivo', proveedor: 'El Comilón', precio: 7900, desc: 'Bife tierno con papas fritas caseras, cebolla y dos huevos fritos.', icon: '🥩' },
      { id: 6, nombre: 'Carbonada Casera con Zapallo', proveedor: 'El Comilón', precio: 5900, desc: 'Sopa espesa de carne picada en cubos con verduras de estación.', icon: '🥘' },
      { id: 7, nombre: 'Pollo Arvejado con Puré', proveedor: 'El Comilón', precio: 6200, desc: 'Prieto o pollo tierno en salsa de arvejitas con puré de papas.', icon: '🍗' },
      { id: 8, nombre: 'Bowl Veggie de Quínoa', proveedor: 'GreenFood SpA', precio: 6900, desc: 'Quínoa orgánica, falafel crujiente, hummus y tomates cherry.', icon: '🥑' }
    ],
    bebestibles: [
      { id: 101, nombre: 'Jugo Natural del Día (350cc)', proveedor: 'El Comilón', precio: 2200, desc: 'Fruta fresca de la estación (Frambuesa, lúcuma o piña).', icon: '🧃' },
      { id: 102, nombre: 'Bebida en Lata 350ml', proveedor: 'Proveedores', precio: 1800, desc: 'Coca-Cola, Coca-Cola Zero, Sprite o Fanta.', icon: '🥤' },
      { id: 103, nombre: 'Agua Mineral sin gas 500ml', proveedor: 'Proveedores', precio: 1500, desc: 'Agua purificada embotellada.', icon: '💧' },
      { id: 104, nombre: 'Chicha Artesanal (Vaso)', proveedor: 'El Comilón', precio: 2000, desc: 'Bebida tradicional chilena.', icon: '🍷' }
    ],
    postres: [
      { id: 201, nombre: 'Leche Asada Casera', proveedor: 'El Comilón', precio: 2500, desc: 'Receta tradicional con caramelo artesanal.', icon: '🍮' },
      { id: 202, nombre: 'Mousse de Maracuyá', proveedor: 'GreenFood SpA', precio: 2800, desc: 'Postre frío y cremoso con toque cítrico.', icon: '🍨' },
      { id: 203, nombre: 'Ensalada de Frutas Frescas', proveedor: 'El Comilón', precio: 2200, desc: 'Mix de frutas de temporada picadas en el día.', icon: '🍓' },
      { id: 204, nombre: 'Suspiro Limeño Artesanal', proveedor: 'El Comilón', precio: 2900, desc: 'Suave manjar blanco con merengue al oporto.', icon: '🍧' },
      { id: 205, nombre: 'Panqueque con Manjar (2 unid.)', proveedor: 'El Comilón', precio: 2600, desc: 'Panqueques caseros rellenos de manjar chileno.', icon: '🥞' }
    ],
    extras: [
      { id: 301, nombre: 'Porción de Papas Fritas', proveedor: 'El Comilón', precio: 3000, desc: 'Papas cortadas a mano y crujientes.', icon: '🍟' },
      { id: 302, nombre: 'Porción de Arroz o Ensalada Chilena', proveedor: 'El Comilón', precio: 2000, desc: 'Acompañamiento extra para tu plato.', icon: '🥗' },
      { id: 303, nombre: 'Pan Amasado con Pebre (2 unid.)', proveedor: 'El Comilón', precio: 1800, desc: 'Horneado del día.', icon: '🥖' },
      { id: 304, nombre: 'Porción Extra de Pebre Casero', proveedor: 'El Comilón', precio: 800, desc: 'Pebre fresco y picantito.', icon: '🥣' },
      { id: 305, nombre: 'Mayonesa Casera (Pocillo)', proveedor: 'El Comilón', precio: 700, desc: 'Mayonesa casera de ajo o tradicional.', icon: '🧄' },
      { id: 306, nombre: 'Sachet de Ketchup / Mostaza', proveedor: 'Proveedores', precio: 300, desc: 'Salsa adicional para tus papas o platos.', icon: '🍅' }
    ]
  };

  const agregarAlPedido = (item) => {
    setCarrito([...carrito, item]);
    alert(`¡"${item.nombre}" agregado a tu pedido!`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', width: '100%',
      backgroundColor: '#b4a5ee',
      backgroundImage: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
      margin: 0, padding: 0, boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden'
    }}>
      
      {/* BARRA SUPERIOR EXCLUSIVA DEL MENÚ */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.8rem 2.5rem', backgroundColor: 'rgba(139, 92, 246, 0.9)',
        backdropFilter: 'blur(10px)', color: '#2e1065', position: 'sticky', top: 0, zIndex: 1000,
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/" style={{ color: '#2e1065', textDecoration: 'none', fontWeight: '800', fontSize: '0.9rem' }}>
            ← Volver al Inicio
          </Link>
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(46, 16, 101, 0.3)' }}></div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#2e1065' }}>CARTA EL COMILÓN</h2>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.9rem' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', color: '#5b21b6' }}>
            🛒 <span>Carrito ({carrito.length})</span>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL DE LA CARTA */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px 50px 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2e1065', fontSize: '2.2rem', margin: '0 0 10px 0', fontWeight: '800' }}>Nuestra Carta Completa</h1>
          <p style={{ color: '#4c1d95', fontSize: '1rem', fontWeight: '500' }}>Disfruta de entradas, platos de fondo, bebestibles, gran variedad de postres y extras.</p>
        </div>

        {/* BOTONES DE CATEGORÍAS INDEPENDIENTES */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '35px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setCategoriaActiva('platos')}
            style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: categoriaActiva === 'platos' ? '#ffffff' : 'rgba(255,255,255,0.4)', color: '#5b21b6', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
          >
            🍲 Platos y Entradas
          </button>
          <button 
            onClick={() => setCategoriaActiva('bebestibles')}
            style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: categoriaActiva === 'bebestibles' ? '#ffffff' : 'rgba(255,255,255,0.4)', color: '#5b21b6', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
          >
            🧃 Bebestibles
          </button>
          <button 
            onClick={() => setCategoriaActiva('postres')}
            style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: categoriaActiva === 'postres' ? '#ffffff' : 'rgba(255,255,255,0.4)', color: '#5b21b6', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
          >
            🍮 Postres Variados
          </button>
          <button 
            onClick={() => setCategoriaActiva('extras')}
            style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: categoriaActiva === 'extras' ? '#ffffff' : 'rgba(255,255,255,0.4)', color: '#5b21b6', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
          >
            🍟 Extras y Salsas
          </button>
        </div>

        {/* LISTADO DE PRODUCTOS SEGÚN LA CATEGORÍA CLICKEADA */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {cartaCompleta[categoriaActiva].map((item) => (
            <div key={item.id} style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', boxShadow: '0 8px 20px rgba(46, 16, 101, 0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2.2rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#f3e8ff', color: '#6b21a8', fontWeight: '700' }}>
                    {item.proveedor}
                  </span>
                </div>
                <h3 style={{ color: '#4c1d95', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '800' }}>{item.nombre}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.85rem', marginBottom: '15px' }}>{item.desc}</p>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#7c3aed', marginBottom: '12px' }}>${item.precio.toLocaleString('es-CL')}</div>
                <button onClick={() => agregarAlPedido(item)} style={{ width: '100%', padding: '10px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
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