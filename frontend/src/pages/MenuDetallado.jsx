import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';          
import CarritoModal from '../components/CarritoModal'; 

export default function MenuDetallado() {
  const [categoriaActiva, setCategoriaActiva] = useState('platos');
  const { agregarAlPedido, setVerCarrito, totalItems } = useCart();

  // Leemos los datos de la billetera corporativa desde el navegador
  const tipoCliente = localStorage.getItem('tipoCliente') || 'normal';
  const saldoCorporativo = parseFloat(localStorage.getItem('saldoCorporativo') || '0');

  const [cartaCompleta, setCartaCompleta] = useState({
    platos: [],
    bebestibles: [],
    postres: [],
    extras: []
  });

  useEffect(() => {
    const obtenerMenu = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/catalogo/'); 
        
        if (response.ok) {
          const datosBackend = await response.json();
          const menuOrdenado = { platos: [], bebestibles: [], postres: [], extras: [] };
          
          datosBackend.forEach((item) => {
            const platoAdaptado = {
              id: item.id,
              nombre: item.nombre,
              desc: item.descripcion,      
              precio: item.precio,
              icon: item.icono || '🍲',    
              proveedor: item.esPropio ? 'El Comilón' : item.nombre_proveedor
            };

            if (menuOrdenado[item.categoria]) {
              menuOrdenado[item.categoria].push(platoAdaptado);
            }
          });

          setCartaCompleta(menuOrdenado);
        } else {
          throw new Error("No se pudo conectar con el servidor");
        }
      } catch (error) {
        console.warn("Backend no disponible temporalmente. Usando datos de prueba locales para maquetar:", error);
        
        setCartaCompleta({
          platos: [
            { id: 1, nombre: 'Cazuela de Aves', desc: 'Delicioso plato casero con choclo y zapallo.', precio: 6500, icon: '🍲', proveedor: 'El Comilón' },
            { id: 2, nombre: 'Pastel de Choclo', desc: 'Tradicional pastel de choclo en greda.', precio: 7000, icon: '🌽', proveedor: 'El Comilón' }
          ],
          bebestibles: [
            { id: 3, nombre: 'Jugo Natural de Frambuesa', desc: 'Medio litro fresco del día.', precio: 2500, icon: '🧃', proveedor: 'El Comilón' }
          ],
          postres: [
            { id: 4, nombre: 'Leche Asada', desc: 'Receta tradicional de la casa.', precio: 3000, icon: '🍮', proveedor: 'El Comilón' }
          ],
          extras: [
            { id: 5, nombre: 'Papas Fritas Caseras', desc: 'Porción crujiente.', precio: 3500, icon: '🍟', proveedor: 'El Comilón' }
          ]
        });
      }
    };

    obtenerMenu();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', width: '100%',
      backgroundColor: '#b4a5ee',
      backgroundImage: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
      margin: 0, padding: 0, boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* BARRA SUPERIOR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.8rem 2.5rem', backgroundColor: 'rgba(139, 92, 246, 0.95)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* BILLETERA CORPORATIVA: Solo se muestra si el cliente es tipo empresa */}
          {tipoCliente === 'empresa' && (
            <div style={{ 
              backgroundColor: '#10b981', color: '#ffffff', padding: '6px 14px', 
              borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800', 
              display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
            }}>
              💼 Saldo: ${saldoCorporativo.toLocaleString('es-CL')}
            </div>
          )}

          <button 
            onClick={() => setVerCarrito(true)}
            style={{ 
              backgroundColor: '#ffffff', border: 'none', padding: '8px 16px', 
              borderRadius: '20px', fontSize: '0.9rem', fontWeight: '800', 
              display: 'flex', alignItems: 'center', gap: '8px', color: '#5b21b6', 
              cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
            }}
          >
            🛒 <span>Carrito ({totalItems})</span>
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px 50px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2e1065', fontSize: '2.2rem', margin: '0 0 10px 0', fontWeight: '800' }}>Nuestra Carta Completa</h1>
          <p style={{ color: '#4c1d95', fontSize: '1rem', fontWeight: '500' }}>Disfruta de entradas, platos de fondo, bebestibles, postres y extras caseros.</p>
        </div>

        {/* BOTONES DE CATEGORÍAS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '35px', flexWrap: 'wrap' }}>
          <button onClick={() => setCategoriaActiva('platos')} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: categoriaActiva === 'platos' ? '#ffffff' : 'rgba(255,255,255,0.4)', color: '#5b21b6', fontWeight: '800', cursor: 'pointer' }}>🍲 Platos y Entradas</button>
          <button onClick={() => setCategoriaActiva('bebestibles')} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: categoriaActiva === 'bebestibles' ? '#ffffff' : 'rgba(255,255,255,0.4)', color: '#5b21b6', fontWeight: '800', cursor: 'pointer' }}>🧃 Bebestibles</button>
          <button onClick={() => setCategoriaActiva('postres')} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: categoriaActiva === 'postres' ? '#ffffff' : 'rgba(255,255,255,0.4)', color: '#5b21b6', fontWeight: '800', cursor: 'pointer' }}>🍮 Postres Variados</button>
          <button onClick={() => setCategoriaActiva('extras')} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: categoriaActiva === 'extras' ? '#ffffff' : 'rgba(255,255,255,0.4)', color: '#5b21b6', fontWeight: '800', cursor: 'pointer' }}>🍟 Extras y Salsas</button>
        </div>

        {/* LISTADO DE PRODUCTOS DINÁMICO */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {cartaCompleta[categoriaActiva] && cartaCompleta[categoriaActiva].length > 0 ? (
            cartaCompleta[categoriaActiva].map((item) => (
              <div key={item.id} style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', boxShadow: '0 8px 20px rgba(46, 16, 101, 0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '2.2rem' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#f3e8ff', color: '#6b21a8', fontWeight: '700' }}>{item.proveedor}</span>
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
            ))
          ) : (
             <p style={{ textAlign: 'center', color: '#4c1d95', width: '100%', fontWeight: '600' }}>Aún no hay productos en esta categoría.</p>
          )}
        </div>
      </main>

      <CarritoModal />
    </div>
  );
}