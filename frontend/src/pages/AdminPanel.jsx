import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const estadosPedido = [
  ['PENDIENTE', 'Pendiente'],
  ['PREPARACION', 'En preparación'],
  ['DESPACHO', 'En despacho'],
  ['ENTREGADO', 'Entregado'],
  ['CANCELADO', 'Cancelado'],
];

const platosIniciales = [
  { id: 1, nombre: 'Cazuela de Vacuno Tradicional', categoria: 'Platos y entradas', precio: 6500, stock: 18, disponible: true },
  { id: 2, nombre: 'Pastel de Choclo en Greda', categoria: 'Platos y entradas', precio: 7000, stock: 12, disponible: true },
  { id: 3, nombre: 'Ensalada Executive de Salmón', categoria: 'Platos y entradas', precio: 8500, stock: 7, disponible: true },
  { id: 4, nombre: 'Menú Ejecutivo Pollo Arvejado', categoria: 'Menú del día', precio: 5800, stock: 0, disponible: false },
  { id: 5, nombre: 'Limonada natural', categoria: 'Bebestibles', precio: 2200, stock: 24, disponible: true },
];

const pedidosIniciales = [
  {
    id: '1088',
    cliente: 'Valentina Soto',
    hora: 'Hoy, 14:32',
    productos: ['2 × Cazuela de Vacuno', '1 × Limonada natural'],
    total: 15200,
    estado: 'PREPARACION',
  },
  {
    id: '1087',
    cliente: 'Diego Fernández',
    hora: 'Hoy, 14:18',
    productos: ['1 × Pastel de Choclo', '1 × Ensalada de Salmón'],
    total: 15500,
    estado: 'DESPACHO',
  },
  {
    id: '1086',
    cliente: 'Isidora Muñoz',
    hora: 'Hoy, 13:54',
    productos: ['1 × Menú Pollo Arvejado'],
    total: 5800,
    estado: 'ENTREGADO',
  },
  {
    id: '1085',
    cliente: 'Martín Rojas',
    hora: 'Hoy, 13:40',
    productos: ['2 × Pastel de Choclo'],
    total: 14000,
    estado: 'CANCELADO',
    motivo: 'El cliente solicitó cancelar.',
  },
];

const formatoPrecio = (precio) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(precio);

export default function AdminPanel() {
  const [platos, setPlatos] = useState(platosIniciales);
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [cambios, setCambios] = useState([
    { id: 1, usuario: 'Administración', descripcion: 'Sesión de demostración iniciada', hora: 'Ahora' },
  ]);
  const [filtroPedidos, setFiltroPedidos] = useState('TODOS');
  const [guardando, setGuardando] = useState('');
  const navigate = useNavigate();

  const registrarCambio = (descripcion) => {
    setCambios((actuales) => [
      { id: Date.now(), usuario: 'Administración', descripcion, hora: 'Ahora' },
      ...actuales,
    ]);
  };

  const actualizarPlato = (event, plato) => {
    event.preventDefault();
    const valores = new FormData(event.currentTarget);
    const precio = Number(valores.get('precio'));
    const stock = Number(valores.get('stock'));

    if (!Number.isInteger(precio) || precio < 0 || !Number.isInteger(stock) || stock < 0) {
      window.alert('El precio y el stock deben ser números enteros iguales o mayores que cero.');
      return;
    }

    setGuardando(`plato-${plato.id}`);
    const disponible = valores.get('disponible') === 'on';
    setPlatos((actuales) =>
      actuales.map((actual) =>
        actual.id === plato.id
          ? { ...actual, precio, stock, disponible }
          : actual
      )
    );
    registrarCambio(`Actualizó precio, stock o disponibilidad de “${plato.nombre}”.`);
    setGuardando('');
  };

  const actualizarPedido = (pedido, nuevoEstado) => {
    let motivo = '';
    if (nuevoEstado === 'CANCELADO') {
      motivo = window.prompt('Escribe el motivo de la cancelación:')?.trim() || '';
      if (!motivo) return;
    }

    setPedidos((actuales) =>
      actuales.map((actual) =>
        actual.id === pedido.id
          ? { ...actual, estado: nuevoEstado, motivo: nuevoEstado === 'CANCELADO' ? motivo : '' }
          : actual
      )
    );
    registrarCambio(
      nuevoEstado === 'CANCELADO'
        ? `Canceló el pedido #${pedido.id}. Motivo: ${motivo}`
        : `Cambió el pedido #${pedido.id} a ${estadosPedido.find(([valor]) => valor === nuevoEstado)?.[1]}.`
    );
  };

  const cerrarDemo = () => navigate('/admin/login');
  const pedidosFiltrados = pedidos.filter(
    (pedido) => filtroPedidos === 'TODOS' || pedido.estado === filtroPedidos
  );

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
          <span><strong>Administrador</strong><small>Modo demostración</small></span>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">EL COMILÓN <span>/</span> ADMINISTRACIÓN</span>
            <h1>Panel de control</h1>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-demo-badge"><span /> DEMO · DATOS LOCALES</span>
            <button type="button" className="admin-logout" onClick={cerrarDemo}>Salir</button>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-welcome">
            <div>
              <h2>Hola, administrador <span aria-hidden="true">✦</span></h2>
              <p>Desde aquí puedes supervisar pedidos, menú e inventario.</p>
            </div>
            <span className="admin-date">Vista de demostración</span>
          </div>

          <div className="admin-prototype-notice" role="note">
            Este panel es solo una maqueta frontend. Los cambios se mantienen únicamente mientras la página esté abierta; aún no se guardan ni se verifican en el servidor.
          </div>

          <section id="resumen" className="admin-summary" aria-label="Resumen de actividad">
            <article className="admin-summary-card">
              <span className="admin-summary-icon summary-purple" aria-hidden="true">▤</span>
              <div><small>Pedidos de hoy</small><strong>{pedidos.length}</strong><span>en el ejemplo local</span></div>
            </article>
            <article className="admin-summary-card">
              <span className="admin-summary-icon summary-orange" aria-hidden="true">◷</span>
              <div><small>Por preparar o entregar</small><strong>{pedidos.filter((pedido) => ['PENDIENTE', 'PREPARACION', 'DESPACHO'].includes(pedido.estado)).length}</strong><span>requieren seguimiento</span></div>
            </article>
            <article className="admin-summary-card">
              <span className="admin-summary-icon summary-green" aria-hidden="true">◈</span>
              <div><small>Productos disponibles</small><strong>{platos.filter((plato) => plato.disponible).length}<span className="admin-out-of"> / {platos.length}</span></strong><span>en el menú de ejemplo</span></div>
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
                      <p>{pedido.cliente} <span>·</span> {pedido.hora}</p>
                      <ul>{pedido.productos.map((producto) => <li key={producto}>{producto}</li>)}</ul>
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
                    <strong>{plato.nombre}</strong><small>{plato.categoria}</small>
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

          <p className="admin-footer-note">Prototipo frontend · Conexión con el backend pendiente</p>
        </div>
      </div>
    </main>
  );
}
