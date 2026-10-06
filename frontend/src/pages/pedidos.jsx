import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const formatoPrecio = (precio) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(precio);

export default function Pedidos() {
  const [misPedidos, setMisPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarMisPedidos();
  }, []);

  const cargarMisPedidos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      // Consultamos al backend. Si tu Django está bien configurado, 
      // este endpoint solo devolverá los pedidos del usuario logueado.
      const response = await fetch('http://localhost:8000/api/pedidos/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Si hay paginación usamos .results, si no, la data directa
        const pedidosReales = data.results ? data.results : data;
        
        // Ordenamos para que los más recientes salgan primero
        const pedidosOrdenados = pedidosReales.sort((a, b) => b.id - a.id);
        setMisPedidos(pedidosOrdenados);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Separamos los pedidos activos de los que ya terminaron
  const pedidosActivos = misPedidos.filter(p => ['PENDIENTE', 'PREPARACION', 'DESPACHO'].includes(p.estado));
  const historial = misPedidos.filter(p => ['ENTREGADO', 'CANCELADO'].includes(p.estado));

  // Función visual para la barra de progreso del cliente
  const obtenerProgreso = (estado) => {
    switch(estado) {
      case 'PENDIENTE': return { porcentaje: '25%', color: '#9ca3af', texto: 'Recibido' };
      case 'PREPARACION': return { porcentaje: '50%', color: '#eab308', texto: 'En Cocina' };
      case 'DESPACHO': return { porcentaje: '75%', color: '#3b82f6', texto: 'En Camino' };
      case 'ENTREGADO': return { porcentaje: '100%', color: '#22c55e', texto: 'Entregado' };
      case 'CANCELADO': return { porcentaje: '100%', color: '#ef4444', texto: 'Cancelado' };
      default: return { porcentaje: '0%', color: '#ccc', texto: 'Desconocido' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Barra de Navegación del Cliente */}
      <header style={{ backgroundColor: '#ffffff', padding: '15px 40px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/menu" style={{ textDecoration: 'none', color: '#4c1d95', fontWeight: '800', fontSize: '1.2rem' }}>
            🍔 EL COMILÓN
          </Link>
          <nav>
            <Link to="/menu" style={{ textDecoration: 'none', color: '#6b7280', marginRight: '15px', fontWeight: '500' }}>Menú</Link>
            <Link to="/mis-pedidos" style={{ textDecoration: 'none', color: '#7c3aed', fontWeight: 'bold' }}>Mis Pedidos</Link>
          </nav>
        </div>
        <button 
          onClick={cerrarSesion}
          style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          Cerrar Sesión
        </button>
      </header>

      <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Mis Pedidos</h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>Rastrea tus compras en tiempo real.</p>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Cargando tus pedidos...</div>
        ) : misPedidos.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#9ca3af' }}>Aún no tienes pedidos</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>¡Anímate a probar nuestros deliciosos platos!</p>
            <Link to="/menu" style={{ padding: '12px 24px', backgroundColor: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              Ir al Menú
            </Link>
          </div>
        ) : (
          <>
            {/* SECCIÓN 1: PEDIDOS EN CURSO */}
            {pedidosActivos.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.2rem', color: '#374151', marginBottom: '15px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>En curso</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {pedidosActivos.map(pedido => {
                    const progreso = obtenerProgreso(pedido.estado);
                    return (
                      <article key={pedido.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: `5px solid ${progreso.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                          <strong style={{ fontSize: '1.1rem' }}>Pedido #{pedido.id}</strong>
                          <span style={{ fontWeight: 'bold', color: progreso.color }}>{progreso.texto}</span>
                        </div>
                        
                        {/* Barra de progreso visual */}
                        <div style={{ width: '100%', backgroundColor: '#f3f4f6', height: '8px', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
                          <div style={{ width: progreso.porcentaje, backgroundColor: progreso.color, height: '100%', transition: 'width 0.5s ease-in-out' }}></div>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0', color: '#4b5563', fontSize: '0.95rem' }}>
                          {pedido.detalles && pedido.detalles.map((det, i) => (
                            <li key={i} style={{ padding: '4px 0' }}>{det.cantidad}x Plato ID {det.plato}</li>
                          ))}
                        </ul>
                        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: '#111827' }}>
                          Total: {formatoPrecio(pedido.total)}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECCIÓN 2: HISTORIAL (Entregados y Cancelados) */}
            {historial.length > 0 && (
              <section>
                <h2 style={{ fontSize: '1.2rem', color: '#374151', marginBottom: '15px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>Historial</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {historial.map(pedido => (
                    <article key={pedido.id} style={{ backgroundColor: '#f9fafb', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>Pedido #{pedido.id}</strong>
                        <span style={{ fontSize: '0.85rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: pedido.estado === 'ENTREGADO' ? '#dcfce7' : '#fee2e2', color: pedido.estado === 'ENTREGADO' ? '#166534' : '#991b1b' }}>
                          {pedido.estado}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontWeight: 'bold', color: '#374151' }}>{formatoPrecio(pedido.total)}</span>
                        <small style={{ color: '#9ca3af' }}>{new Date(pedido.creado_en || Date.now()).toLocaleDateString()}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}