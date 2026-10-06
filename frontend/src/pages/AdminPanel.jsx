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
  const navigate = useNavigate();

  // 1. Cargar datos reales al abrir el panel
  useEffect(() => {
    cargarDatosDelServidor();
  }, []);

  const cargarDatosDelServidor = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Consultar Pedidos
      const resPedidos = await fetch('http://localhost:8000/api/pedidos/', { headers });
      if (resPedidos.ok) {
        const dataPedidos = await resPedidos.json();
        setPedidos(dataPedidos);
      }

      // Consultar Platos (Asegúrate de que esta URL coincida con tu backend)
      const resPlatos = await fetch('http://localhost:8000/api/catalogo/platos/', { headers });
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

  // 2. Actualizar Inventario en Django
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
      // Petición PATCH para actualizar solo stock, precio y disponibilidad
      const response = await fetch(`http://localhost:8000/api/catalogo/platos/${plato.id}/`, {
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

  // 3. Actualizar Estado de Pedido en Django (El corazón de la app)
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
        body: JSON.stringify({ estado: nuevoEstado }) // Si tienes campo motivo en el backend, agrégalo aquí
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

  // 4. Cierre de sesión real
  const cerrarSesion = () => {
    localStorage.clear(); // Destruimos los tokens
    navigate('/login');
  };

  const pedidosFiltrados = pedidos.filter(
    (pedido) => filtroPedidos === 'TODOS' || pedido.estado === filtroPedidos
  );

  if (cargando) {
    return <div style={{ padding: '50px', textAlign: 'center' }}><h2>Conectando con la base de datos...</h2></div>;
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
              <p>Supervisa los pedidos, el menú y el inventario en tiempo real.</p>
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
                      
                      {/* Dibujamos los detalles reales que vienen de Django */}
                      <ul>
                        {pedido.detalles && pedido.detalles.map((detalle, idx) => (
                          <li key={idx}>Plato ID {detalle.plato} (x{detalle.cantidad})</li>
                        ))}
                      </ul>
                      
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