import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const estadosPedido = [
  ['PENDIENTE', 'Pendiente'],
  ['PREPARACION', 'En preparación'],
  ['DESPACHO', 'En despacho'],
  ['ENTREGADO', 'Entregado'],
  ['CANCELADO', 'Cancelado'],
];

const formatoPrecio = (precio) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(precio);

export default function AdminPanel() {
  const [platos, setPlatos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [cambios, setCambios] = useState([
    { id: 1, usuario: 'Sistema', descripcion: 'Panel conectado a la base de datos', hora: 'Ahora' },
  ]);
  const [filtroPedidos, setFiltroPedidos] = useState('TODOS');
  const [guardando, setGuardando] = useState('');
  const [cargando, setCargando] = useState(true);
  
  // NUEVOS ESTADOS: Para manejar el formulario de recarga de saldo
  const [rutRecarga, setRutRecarga] = useState('');
  const [montoRecarga, setMontoRecarga] = useState('');
  const [mensajeRecarga, setMensajeRecarga] = useState(null); // Guardará { tipo: 'exito' | 'error', texto: '...' }

  const navigate = useNavigate();

  // 1. Cargar datos reales al abrir el panel
  useEffect(() => {
    cargarDatosDelServidor();
  }, []);

  const cargarDatosDelServidor = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const resPedidos = await fetch('http://localhost:8000/api/pedidos/', { headers });
      if (resPedidos.ok) {
        const dataPedidos = await resPedidos.json();
        setPedidos(dataPedidos);
      }

      // IMPORTANTE: Asegúrate de que esta URL sea la correcta (ayer le quitamos el /platos/ extra)
      const resPlatos = await fetch('http://localhost:8000/api/catalogo/', { headers });
      if (resPlatos.ok) {
        const dataPlatos = await resPlatos.json();
        setPlatos(dataPlatos);
      }
    } catch (error) {
      console.error("Error cargando el panel:", error);
      registrarCambio("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const registrarCambio = (descripcion) => {
    setCambios((actuales) => [
      { id: Date.now(), usuario: 'Administración', descripcion, hora: new Date().toLocaleTimeString() },
      ...actuales,
    ]);
  };

  // 2. NUEVA FUNCIÓN: Conectar con la API para inyectar dinero al Cliente Corporativo
  const manejarRecargaSaldo = async (e) => {
    e.preventDefault();
    setGuardando('recarga');
    setMensajeRecarga(null);

    try {
      const token = localStorage.getItem('access_token');
      // Asegúrate de que la ruta coincida con la que pusiste en tu urls.py de usuarios
      const response = await fetch('http://localhost:8000/api/recargar-saldo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          rut: rutRecarga, 
          monto: parseInt(montoRecarga) 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensajeRecarga({ tipo: 'exito', texto: data.mensaje });
        setRutRecarga(''); // Limpiamos el formulario
        setMontoRecarga('');
        registrarCambio(`Inyección de fondos: $${montoRecarga} al RUT ${rutRecarga}`);
      } else {
        setMensajeRecarga({ tipo: 'error', texto: data.error || 'Error al recargar saldo.' });
      }
    } catch (error) {
      setMensajeRecarga({ tipo: 'error', texto: 'No se pudo conectar con el servidor.' });
    } finally {
      setGuardando('');
    }
  };

  // 3. Actualizar Inventario en Django
  const actualizarPlato = async (event, plato) => {
    event.preventDefault();
    const valores = new FormData(event.currentTarget);
    const precio = Number(valores.get('precio'));
    const stock = Number(valores.get('stock'));
    const disponible = valores.get('disponible') === 'on';

    if (!Number.isInteger(precio) || precio < 0 || !Number.isInteger(stock) || stock < 0) {
      window.alert('El precio y el stock deben ser números enteros iguales o mayores que cero.');
      return;
    }

    setGuardando(`plato-${plato.id}`);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/catalogo/${plato.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ precio, stock, disponible })
      });

      if (response.ok) {
        setPlatos((actuales) => actuales.map((a) => a.id === plato.id ? { ...a, precio, stock, disponible } : a));
        registrarCambio(`Actualizó stock/precio de “${plato.nombre}”.`);
      } else {
        window.alert("Error al guardar en la base de datos.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setGuardando('');
    }
  };

  // 4. Actualizar Estado de Pedido en Django
  const actualizarPedido = async (pedido, nuevoEstado) => {
    let motivo = '';
    if (nuevoEstado === 'CANCELADO') {
      motivo = window.prompt('Escribe el motivo de la cancelación:')?.trim() || '';
      if (!motivo) return;
    }

    setGuardando(`pedido-${pedido.id}`);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/pedidos/${pedido.id}/estado/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        setPedidos((actuales) => actuales.map((a) => a.id === pedido.id ? { ...a, estado: nuevoEstado, motivo: nuevoEstado === 'CANCELADO' ? motivo : '' } : a));
        registrarCambio(
          nuevoEstado === 'CANCELADO'
            ? `Canceló el pedido #${pedido.id}. Motivo: ${motivo}`
            : `Movió el pedido #${pedido.id} a ${estadosPedido.find(([valor]) => valor === nuevoEstado)?.[1]}.`
        );
      } else {
        window.alert("No se pudo cambiar el estado del pedido.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setGuardando('');
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  const pedidosFiltrados = pedidos.filter(
    (pedido) => filtroPedidos === 'TODOS' || pedido.estado === filtroPedidos
  );

  if (cargando) {
    return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'system-ui' }}><h2 style={{ color: '#2e1065' }}>Conectando con la base de datos...</h2></div>;
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-icon" aria-hidden="true">E</span>
          <span><strong>EL COMILÓN</strong><small>Panel de control</small></span>
        </Link>

        <p className="admin-nav-label">ADMINISTRACIÓN</p>
        <nav className="admin-nav" aria-label="Navegación de administración">
          <a className="admin-nav-link is-active" href="#resumen"><span aria-hidden="true">▦</span> Resumen</a>
          <a className="admin-nav-link" href="#finanzas"><span aria-hidden="true">💰</span> Finanzas B2B</a>
          <a className="admin-nav-link" href="#pedidos"><span aria-hidden="true">▤</span> Pedidos</a>
          <a className="admin-nav-link" href="#inventario"><span aria-hidden="true">◈</span> Precios y stock</a>
          <a className="admin-nav-link" href="#auditoria"><span aria-hidden="true">↻</span> Actividad</a>
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-user-avatar" aria-hidden="true">AD</span>
          <span><strong>Administrador</strong><small>Conectado (En Vivo)</small></span>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">EL COMILÓN <span>/</span> ADMINISTRACIÓN</span>
            <h1>Panel de control</h1>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-demo-badge" style={{ backgroundColor: '#dcfce7', color: '#166534' }}><span style={{ backgroundColor: '#22c55e' }}/> SISTEMA EN LÍNEA</span>
            <button type="button" className="admin-logout" onClick={cerrarSesion}>Salir</button>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-welcome">
            <div>
              <h2>Hola, administrador <span aria-hidden="true">✦</span></h2>
              <p>Supervisa los pedidos, inyecta fondos y controla el menú en tiempo real.</p>
            </div>
            <span className="admin-date">{new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <section id="resumen" className="admin-summary" aria-label="Resumen de actividad">
            <article className="admin-summary-card">
              <span className="admin-summary-icon summary-purple" aria-hidden="true">▤</span>
              <div><small>Total Pedidos</small><strong>{pedidos.length}</strong><span>registrados</span></div>
            </article>
            <article className="admin-summary-card">
              <span className="admin-summary-icon summary-orange" aria-hidden="true">◷</span>
              <div><small>En Cocina</small><strong>{pedidos.filter((pedido) => ['PENDIENTE', 'PREPARACION'].includes(pedido.estado)).length}</strong><span>requieren atención</span></div>
            </article>
            <article className="admin-summary-card">
              <span className="admin-summary-icon summary-green" aria-hidden="true">◈</span>
              <div><small>Platos Activos</small><strong>{platos.filter((plato) => plato.disponible).length}<span className="admin-out-of"> / {platos.length}</span></strong><span>disponibles</span></div>
            </article>
          </section>

          {/* NUEVA SECCIÓN: BILLETERA CORPORATIVA */}
          <section id="finanzas" className="admin-section">
            <div className="admin-section-heading">
              <div><p className="admin-eyebrow">CONVENIOS</p><h2>Recargar Billetera Corporativa</h2></div>
            </div>
            <div style={{ background: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <p style={{ color: '#4b5563', marginBottom: '20px', fontSize: '0.95rem' }}>
                Ingresa el RUT de un Cliente Corporativo registrado para inyectar fondos a su cuenta.
              </p>
              
              <form onSubmit={manejarRecargaSaldo} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>RUT del Cliente</label>
                  <input 
                    type="text" 
                    value={rutRecarga} 
                    onChange={(e) => setRutRecarga(e.target.value)}
                    placeholder="Ej: 12345678-9" 
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                  />
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Monto a Inyectar ($)</label>
                  <input 
                    type="number" 
                    value={montoRecarga} 
                    onChange={(e) => setMontoRecarga(e.target.value)}
                    min="1" 
                    placeholder="Ej: 50000" 
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={guardando === 'recarga'}
                  style={{ padding: '10px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: guardando === 'recarga' ? 'not-allowed' : 'pointer', height: '42px' }}
                >
                  {guardando === 'recarga' ? 'Procesando...' : '💰 Recargar Saldo'}
                </button>
              </form>

              {/* Mensajes de feedback (Éxito o Error) */}
              {mensajeRecarga && (
                <div style={{ marginTop: '20px', padding: '12px', borderRadius: '6px', backgroundColor: mensajeRecarga.tipo === 'exito' ? '#ecfdf5' : '#fef2f2', border: `1px solid ${mensajeRecarga.tipo === 'exito' ? '#a7f3d0' : '#fecaca'}`, color: mensajeRecarga.tipo === 'exito' ? '#065f46' : '#991b1b', fontWeight: '500', fontSize: '0.9rem' }}>
                  {mensajeRecarga.tipo === 'exito' ? '✅ ' : '⚠️ '} {mensajeRecarga.texto}
                </div>
              )}
            </div>
          </section>

          <section id="pedidos" className="admin-section">
            <div className="admin-section-heading">
              <div><p className="admin-eyebrow">OPERACIONES</p><h2>Gestión de pedidos</h2></div>
              <label className="admin-filter-label">
                <span className="sr-only">Filtrar pedidos</span>
                <select value={filtroPedidos} onChange={(event) => setFiltroPedidos(event.target.value)}>
                  <option value="TODOS">Todos los pedidos</option>
                  {estadosPedido.map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
                </select>
              </label>
            </div>
            <div className="admin-orders">
              {pedidosFiltrados.map((pedido) => (
                <article className="admin-order-card" key={pedido.id}>
                  <div className="admin-order-main">
                    <span className="admin-order-icon" aria-hidden="true">▤</span>
                    <div className="admin-order-details">
                      <div className="admin-order-title">
                        <strong>Pedido #{pedido.id}</strong>
                        <span className={`admin-status status-${pedido.estado.toLowerCase()}`}>
                          {estadosPedido.find(([valor]) => valor === pedido.estado)?.[1]}
                        </span>
                      </div>
                      <p>Cliente N°{pedido.cliente} <span>·</span> {new Date(pedido.creado_en || Date.now()).toLocaleTimeString()}</p>
                      
                      <ul style={{ margin: '10px 0', paddingLeft: '20px', color: '#4b5563', fontSize: '0.9rem' }}>
                        {pedido.detalles && pedido.detalles.map((detalle, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            {detalle.cantidad}x Plato ID {detalle.plato} - ${detalle.precioUnitario}
                          </li>
                        ))}
                      </ul>
                      
                      {pedido.observaciones && (
                        <div style={{ backgroundColor: '#fffbeb', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', color: '#92400e', marginBottom: '10px', border: '1px solid #fde68a' }}>
                          <strong>📝 Notas:</strong> {pedido.observaciones}
                        </div>
                      )}
                      
                      {pedido.motivo && <small className="admin-cancel-reason">Motivo de cancelación: {pedido.motivo}</small>}
                    </div>
                  </div>
                  <div className="admin-order-controls">
                    <strong>{formatoPrecio(pedido.total)}</strong>
                    {!['ENTREGADO', 'CANCELADO'].includes(pedido.estado) && (
                      <select
                        aria-label={`Cambiar estado del pedido ${pedido.id}`}
                        value={pedido.estado}
                        disabled={guardando === `pedido-${pedido.id}`}
                        onChange={(event) => actualizarPedido(pedido, event.target.value)}
                      >
                        {estadosPedido.map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
                      </select>
                    )}
                  </div>
                </article>
              ))}
              {pedidosFiltrados.length === 0 && <p className="admin-empty">No hay pedidos para este filtro.</p>}
            </div>
          </section>

          <section id="inventario" className="admin-section">
            <div className="admin-section-heading">
              <div><p className="admin-eyebrow">MENÚ E INVENTARIO</p><h2>Precios y stock</h2></div>
              <span className="admin-section-caption">{platos.length} productos</span>
            </div>
            <div className="admin-inventory">
              <div className="admin-inventory-header">
                <span>Producto</span><span>Precio</span><span>Stock</span><span>Disponibilidad</span><span />
              </div>
              {platos.map((plato) => (
                <form className="admin-product-row" key={plato.id} onSubmit={(event) => actualizarPlato(event, plato)}>
                  <div className="admin-product-name">
                    <strong>{plato.nombre}</strong><small>ID: {plato.id}</small>
                  </div>
                  <label className="admin-field-label">
                    <span className="sr-only">Precio de {plato.nombre}</span>
                    <input name="precio" type="number" min="0" step="1" defaultValue={plato.precio} required />
                  </label>
                  <label className="admin-field-label">
                    <span className="sr-only">Stock de {plato.nombre}</span>
                    <input name="stock" type="number" min="0" step="1" defaultValue={plato.stock} required />
                  </label>
                  <label className="admin-availability">
                    <input name="disponible" type="checkbox" defaultChecked={plato.disponible} />
                    <span>{plato.disponible ? 'Disponible' : 'Pausado'}</span>
                  </label>
                  <button className="admin-save-button" type="submit" disabled={guardando === `plato-${plato.id}`}>
                    {guardando === `plato-${plato.id}` ? 'Guardando…' : 'Guardar'}
                  </button>
                </form>
              ))}
            </div>
          </section>

          <section id="auditoria" className="admin-section">
            <div className="admin-section-heading">
              <div><p className="admin-eyebrow">TRAZABILIDAD</p><h2>Actividad reciente</h2></div>
            </div>
            <div className="admin-activity-list">
              {cambios.map((cambio) => (
                <article className="admin-activity-row" key={cambio.id}>
                  <span className="admin-activity-icon" aria-hidden="true">↻</span>
                  <div><strong>{cambio.usuario}</strong><p>{cambio.descripcion}</p></div>
                  <time>{cambio.hora}</time>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}