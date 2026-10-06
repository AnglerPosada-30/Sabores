import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Delivery.css';

// Mantenemos los datos del repartidor estáticos por ahora (hasta que conectemos el Perfil)
const repartidor = {
  nombre: 'Camila Ramírez',
  iniciales: 'CR',
  rol: 'Repartidora',
  correo: 'camila.ramirez@email.com',
  telefono: '+56 9 6248 1370',
  zona: 'Providencia, Santiago',
  codigo: 'DEL-024',
};

// Mantenemos el historial estático como demostración visual
const pedidosCompletados = [
  { numero: '#PED-1081', cliente: 'Isidora Muñoz', resumen: '2 platos · 1 bebida', fecha: 'Hoy, 13:42', total: 18900 },
  { numero: '#PED-1076', cliente: 'Martín Rojas', resumen: '1 plato · 2 acompañamientos', fecha: 'Hoy, 12:18', total: 27600 },
];

const formatoPrecio = (precio) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(precio);

function Delivery() {
  // 1. ESTADOS DE REACT: Guardarán la información que viene de Django
  const [pedidosActivos, setPedidosActivos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 2. EFECTO DE CARGA: Se ejecuta automáticamente al abrir la página
  useEffect(() => {
    cargarPedidosEnDespacho();
  }, []);

  // 3. PUENTE DE LECTURA (GET): Va a buscar los pedidos con estado 'DESPACHO'
  const cargarPedidosEnDespacho = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/pedidos/despacho/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setPedidosActivos(data); // Guardamos los pedidos reales en el estado
      }
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    } finally {
      setCargando(false);
    }
  };

  // 4. PUENTE DE ACCIÓN (PATCH): Avisa a Django que el pedido fue entregado
  const marcarComoEntregado = async (pedidoId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/pedidos/${pedidoId}/estado/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'ENTREGADO' })
      });

      if (response.ok) {
        // Si Django confirma la actualización, sacamos el pedido de la pantalla
        setPedidosActivos(pedidosActivos.filter(p => p.id !== pedidoId));
        alert(`Pedido #${pedidoId} marcado como entregado.`);
      } else {
        alert("Hubo un problema al actualizar el estado.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

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
          to="/delivery/pedidos"
          className={`delivery-nav-link${currentPage === 'pedidos' ? ' is-active' : ''}`}
          aria-current={currentPage === 'pedidos' ? 'page' : undefined}
        >
          <span aria-hidden="true">▤</span> Pedidos
        </Link>
        <Link
          to="/delivery"
          className={`delivery-nav-link${currentPage === 'perfil' ? ' is-active' : ''}`}
          aria-current={currentPage === 'perfil' ? 'page' : undefined}
        >
          <span aria-hidden="true">◉</span> Mi perfil
        </Link>
      </nav>

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

function Delivery() {
  return (
    <div className="delivery-page">
      <DeliverySidebar currentPage="perfil" />
      <main className="delivery-main">
        <header className="delivery-topbar">
          <div>
            <span className="delivery-eyebrow">ESPACIO DEL REPARTIDOR</span>
            <h1>Mi panel</h1>
          </div>
          <span className="delivery-online"><span /> Disponible</span>
        </header>

        <section className="delivery-profile-card" aria-labelledby="delivery-profile-title">
          <div className="delivery-profile-identity">
            <span className="delivery-avatar" aria-hidden="true">{repartidor.iniciales}</span>
            <div>
              <span className="delivery-eyebrow">TU PERFIL</span>
              <h2 id="delivery-profile-title">{repartidor.nombre}</h2>
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

        <section className="delivery-stats" aria-label="Resumen de actividad">
          <article className="delivery-stat-card">
            <span className="delivery-stat-icon stat-green" aria-hidden="true">✓</span>
            <div><small>Pedidos entregados</small><strong>128</strong></div>
            <span className="delivery-stat-note">este mes</span>
          </article>
          <article className="delivery-stat-card">
            <span className="delivery-stat-icon stat-orange" aria-hidden="true">↗</span>
            {/* Vinculamos el contador a la cantidad real de pedidos en la BD */}
            <div><small>En curso</small><strong>{pedidosActivos.length}</strong></div>
            <span className="delivery-stat-note">ahora</span>
          </article>
          <article className="delivery-stat-card">
            <span className="delivery-stat-icon stat-purple" aria-hidden="true">★</span>
            <div><small>Calificación</small><strong>4,9 <span className="delivery-out-of">/ 5</span></strong></div>
            <span className="delivery-stat-note">promedio</span>
          </article>
        </section>

        <section className="delivery-section" aria-labelledby="delivery-active-title">
          <div className="delivery-section-heading">
            <div>
              <span className="delivery-eyebrow">EN TIEMPO REAL</span>
              <h2 id="delivery-active-title">Pedidos en curso</h2>
            </div>
            <span className="delivery-count">{pedidosActivos.length} activos</span>
          </div>

          <div className="delivery-active-orders">
            {cargando ? (
              <p>Cargando rutas asignadas...</p>
            ) : pedidosActivos.length === 0 ? (
              <p style={{ color: '#6b7280', padding: '20px' }}>No tienes pedidos pendientes de entrega en este momento.</p>
            ) : (
              // 5. RENDERIZADO DINÁMICO: Dibujamos las tarjetas usando los datos de Django
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
                      {pedido.detalles.map((detalle, index) => (
                        <li key={index}>
                          <span>Plato ID: {detalle.plato}</span><span>× {detalle.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="delivery-order-total">
                    <span>Monto a cobrar/verificar</span><strong>{formatoPrecio(pedido.total)}</strong>
                  </div>

                  {/* 6. BOTÓN DE ACCIÓN: Ejecuta el PATCH hacia la base de datos */}
                  <button 
                    onClick={() => marcarComoEntregado(pedido.id)}
                    style={{ marginTop: '15px', width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    ✓ Marcar Entrega Exitosa
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="delivery-section delivery-history" aria-labelledby="delivery-history-title">
          <div className="delivery-section-heading">
            <div>
              <span className="delivery-eyebrow">TU ACTIVIDAD</span>
              <h2 id="delivery-history-title">Pedidos transportados</h2>
            </div>
            <span className="delivery-history-total">Últimas entregas (Demo)</span>
          </div>
          <div className="delivery-history-list">
            {pedidosCompletados.map((pedido) => (
              <article className="delivery-history-row" key={pedido.numero}>
                <span className="delivery-history-check" aria-hidden="true">✓</span>
                <div className="delivery-history-customer">
                  <strong>{pedido.cliente}</strong>
                  <small>{pedido.numero} <span>·</span> {pedido.resumen}</small>
                </div>
                <span className="delivery-history-date">{pedido.fecha}</span>
                <strong className="delivery-history-price">{formatoPrecio(pedido.total)}</strong>
                <span className="delivery-delivered">Entregado</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Delivery;