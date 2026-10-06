import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Delivery.css';

// Aquí mantengo un objeto estático para los datos del perfil del repartidor en esta demo, 
// pero en un entorno de producción, esto lo consumiríamos desde un endpoint /api/usuarios/me/
const repartidor = {
  nombre: 'Angler Posada (Demo)',
  iniciales: 'AP',
  rol: 'Repartidor',
  correo: 'angler.delivery@elcomilon.com',
  telefono: '+56 9 1234 5678',
  zona: 'Valparaíso y Viña del Mar',
  codigo: 'DEL-001',
};

// Formateador de moneda nativo de JavaScript para mantener la coherencia visual con el resto de la app.
const formatoPrecio = (precio) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(precio);

// --- COMPONENTE SECUNDARIO: BARRA LATERAL ---
function DeliverySidebar({ currentPage, onLogout }) {
  // Este componente renderiza el menú lateral. Recibe el 'currentPage' para marcar
  // visualmente dónde estamos, y la función 'onLogout' para procesar la salida.
  return (
    <aside className="delivery-sidebar">
      <Link className="delivery-brand" to="/">
        <span className="delivery-brand-mark" aria-hidden="true">E</span>
        <span>
          <strong>EL COMILÓN</strong>
          <small>Panel de reparto</small>
        </span>
      </Link>

      <p className="delivery-nav-label">MENÚ</p>
      <nav className="delivery-nav" aria-label="Navegación principal">
        <Link to="/" className="delivery-nav-link">
          <span aria-hidden="true">⌂</span> Inicio
        </Link>
        <Link
          to="/delivery"
          className={`delivery-nav-link${currentPage === 'pedidos' ? ' is-active' : ''}`}
          aria-current={currentPage === 'pedidos' ? 'page' : undefined}
        >
          <span aria-hidden="true">▤</span> Pedidos Asignados
        </Link>
      </nav>

      {/* Agregué el control de sesión directamente en la barra lateral para un acceso rápido */}
      <div style={{ marginTop: 'auto', padding: '0 20px 20px 20px' }}>
        <button 
          onClick={onLogout}
          style={{ width: '100%', padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}
        >
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>

      <div className="delivery-sidebar-user">
        <span className="delivery-avatar delivery-avatar-small" aria-hidden="true">
          {repartidor.iniciales}
        </span>
        <span>
          <strong>{repartidor.nombre}</strong>
          <small>{repartidor.rol}</small>
        </span>
      </div>
    </aside>
  );
}

// --- COMPONENTE PRINCIPAL: PANEL DEL REPARTIDOR ---
function Delivery() {
  // 1. ESTADOS DE REACT
  // Uso estos estados para almacenar la carga de trabajo actual y la que ya se completó en esta sesión.
  const [pedidosActivos, setPedidosActivos] = useState([]);
  const [historialEntregas, setHistorialEntregas] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // 2. CICLO DE VIDA Y POLLING (Actualización en tiempo real)
  // Utilizo useEffect para hacer la primera carga, pero además configuro un setInterval.
  // Esto hace "Polling" cada 10 segundos a Django, simulando un sistema de tiempo real 
  // para que el repartidor reciba nuevos pedidos automáticamente sin tener que refrescar la página.
  useEffect(() => {
    cargarPedidosEnDespacho(); // Carga inicial

    const intervalo = setInterval(() => {
      cargarPedidosEnDespacho(false); // Consultas silenciosas en segundo plano
    }, 10000);

    // Función de limpieza para evitar fugas de memoria si el componente se desmonta
    return () => clearInterval(intervalo);
  }, []);

  const cargarPedidosEnDespacho = async (mostrarCargando = true) => {
    if (mostrarCargando) setCargando(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/pedidos/despacho/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPedidosActivos(data); 
      }
    } catch (error) {
      console.error("Error en la sincronización de pedidos:", error);
    } finally {
      setCargando(false);
    }
  };

  // 3. ACTUALIZACIÓN DE ESTADO (Flujo de Negocio)
  // Esta función se dispara cuando el repartidor toca "Marcar Entrega Exitosa".
  const marcarComoEntregado = async (pedidoId) => {
    try {
      const token = localStorage.getItem('access_token');
      // Ejecuto un PATCH al backend para actualizar exclusivamente el estado del pedido a ENTREGADO
      const response = await fetch(`http://localhost:8000/api/pedidos/${pedidoId}/estado/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'ENTREGADO' })
      });

      if (response.ok) {
        // En lugar de recargar la página, manipulo el DOM virtual de React:
        // Busco el pedido que acabo de entregar...
        const pedidoCompletado = pedidosActivos.find(p => p.id === pedidoId);
        
        // Lo elimino de la lista de pendientes...
        setPedidosActivos(actuales => actuales.filter(p => p.id !== pedidoId));
        
        // Y lo inyecto al principio del historial de actividad de esta sesión.
        if (pedidoCompletado) {
          setHistorialEntregas(prev => [
            { ...pedidoCompletado, fechaEntrega: new Date().toLocaleTimeString() },
            ...prev
          ]);
        }
      } else {
        alert("Atención: Hubo un problema al sincronizar la entrega con el servidor.");
      }
    } catch (error) {
      console.error("Error de red al actualizar:", error);
    }
  };

  // 4. CONTROL DE ACCESO
  const procesarSalida = () => {
    localStorage.clear(); // Limpio los tokens JWT por seguridad
    navigate('/login');   // Redirijo a la pantalla de autenticación
  };

  // 5. RENDERIZADO VISUAL
  return (
    <div className="delivery-page">
      <DeliverySidebar currentPage="pedidos" onLogout={procesarSalida} />
      
      <main className="delivery-main">
        <header className="delivery-topbar">
          <div>
            <span className="delivery-eyebrow">ESPACIO DEL REPARTIDOR</span>
            <h1>Mi panel</h1>
          </div>
          <span className="delivery-online"><span /> En línea</span>
        </header>

        <section className="delivery-profile-card">
          <div className="delivery-profile-identity">
            <span className="delivery-avatar" aria-hidden="true">{repartidor.iniciales}</span>
            <div>
              <span className="delivery-eyebrow">TU PERFIL</span>
              <h2>{repartidor.nombre}</h2>
              <p>{repartidor.rol} <span className="delivery-dot">·</span> ID {repartidor.codigo}</p>
            </div>
          </div>
          <div className="delivery-profile-details">
            <div>
              <span className="delivery-detail-icon" aria-hidden="true">@</span>
              <span><small>Correo</small><strong>{repartidor.correo}</strong></span>
            </div>
            <div>
              <span className="delivery-detail-icon" aria-hidden="true">☎</span>
              <span><small>Teléfono</small><strong>{repartidor.telefono}</strong></span>
            </div>
            <div>
              <span className="delivery-detail-icon" aria-hidden="true">⌖</span>
              <span><small>Zona asignada</small><strong>{repartidor.zona}</strong></span>
            </div>
          </div>
        </section>

        <section className="delivery-stats">
          <article className="delivery-stat-card">
            <span className="delivery-stat-icon stat-green" aria-hidden="true">✓</span>
            <div><small>Entregas de hoy</small><strong>{historialEntregas.length}</strong></div>
            <span className="delivery-stat-note">sesión actual</span>
          </article>
          <article className="delivery-stat-card">
            <span className="delivery-stat-icon stat-orange" aria-hidden="true">↗</span>
            <div><small>Rutas pendientes</small><strong>{pedidosActivos.length}</strong></div>
            <span className="delivery-stat-note">ahora</span>
          </article>
        </section>

        {/* LISTA DE PEDIDOS ACTIVOS EN DESPACHO */}
        <section className="delivery-section">
          <div className="delivery-section-heading">
            <div>
              <span className="delivery-eyebrow">EN TIEMPO REAL</span>
              <h2>Pedidos en curso</h2>
            </div>
            <span className="delivery-count">{pedidosActivos.length} activos</span>
          </div>

          <div className="delivery-active-orders">
            {cargando && pedidosActivos.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>Buscando nuevas rutas asignadas...</div>
            ) : pedidosActivos.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🛵</span>
                <strong style={{ color: '#374151', display: 'block' }}>Todo despejado</strong>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>No tienes pedidos pendientes. Espera a que la cocina asigne nuevas rutas.</p>
              </div>
            ) : (
              pedidosActivos.map((pedido) => (
                <article className="delivery-order-card" key={pedido.id}>
                  <div className="delivery-order-heading">
                    <span className="delivery-order-number">#PED-{pedido.id}</span>
                    <span className="delivery-status status-transit">
                      <span />{pedido.estado}
                    </span>
                  </div>
                  
                  <div className="delivery-customer">
                    <span className="delivery-customer-icon" aria-hidden="true">♙</span>
                    <div><small>ID Cliente</small><strong>Cliente N°{pedido.cliente}</strong></div>
                  </div>
                  
                  <div className="delivery-order-items">
                    <small>Resumen de carga</small>
                    <ul>
                      {pedido.detalles && pedido.detalles.map((detalle, index) => (
                        <li key={index}>
                          <span>Plato ID: {detalle.plato}</span><span>× {detalle.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {pedido.observaciones && (
                    <div style={{ backgroundColor: '#fffbeb', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: '#92400e', marginBottom: '15px' }}>
                      <strong>📝 Instrucciones:</strong> {pedido.observaciones}
                    </div>
                  )}
                  
                  <div className="delivery-order-total">
                    <span>Verificar pago total:</span><strong>{formatoPrecio(pedido.total)}</strong>
                  </div>

                  <button 
                    onClick={() => marcarComoEntregado(pedido.id)}
                    style={{ marginTop: '15px', width: '100%', padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}
                  >
                    ✓ Marcar Entrega Exitosa
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        {/* HISTORIAL DINÁMICO DE ENTREGAS */}
        <section className="delivery-section delivery-history">
          <div className="delivery-section-heading">
            <div>
              <span className="delivery-eyebrow">TU ACTIVIDAD</span>
              <h2>Pedidos transportados</h2>
            </div>
            <span className="delivery-history-total">Sesión actual</span>
          </div>
          
          <div className="delivery-history-list">
            {historialEntregas.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.9rem', padding: '10px 0' }}>Tus entregas finalizadas aparecerán aquí.</p>
            ) : (
              historialEntregas.map((pedido) => (
                <article className="delivery-history-row" key={`hist-${pedido.id}`}>
                  <span className="delivery-history-check" aria-hidden="true">✓</span>
                  <div className="delivery-history-customer">
                    <strong>Cliente N°{pedido.cliente}</strong>
                    <small>#PED-{pedido.id} <span>·</span> {pedido.detalles?.length || 0} items</small>
                  </div>
                  <span className="delivery-history-date">{pedido.fechaEntrega}</span>
                  <strong className="delivery-history-price">{formatoPrecio(pedido.total)}</strong>
                  <span className="delivery-delivered">Entregado</span>
                </article>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default Delivery;