import { Link } from 'react-router-dom';
import './Delivery.css';

const repartidor = {
  nombre: 'Camila Ramírez',
  iniciales: 'CR',
  rol: 'Repartidora',
  correo: 'camila.ramirez@email.com',
  telefono: '+56 9 6248 1370',
  zona: 'Providencia, Santiago',
  codigo: 'DEL-024',
};

const pedidosEnCurso = [
  {
    numero: '#PED-1084',
    cliente: 'Valentina Soto',
    direccion: 'Av. Nueva Providencia 1840, depto. 602',
    referencia: 'Tocar el timbre del 602',
    platos: [
      { nombre: 'Hamburguesa clásica', cantidad: 2 },
      { nombre: 'Papas rústicas', cantidad: 1 },
      { nombre: 'Limonada natural', cantidad: 2 },
    ],
    total: 24800,
    estado: 'En camino',
  },
  {
    numero: '#PED-1087',
    cliente: 'Diego Fernández',
    direccion: 'Los Leones 735, oficina 402',
    referencia: 'Entregar en recepción',
    platos: [
      { nombre: 'Pizza margarita', cantidad: 1 },
      { nombre: 'Ensalada César', cantidad: 1 },
    ],
    total: 21900,
    estado: 'Preparando',
  },
];

const pedidosCompletados = [
  {
    numero: '#PED-1081',
    cliente: 'Isidora Muñoz',
    resumen: '2 platos · 1 bebida',
    fecha: 'Hoy, 13:42',
    total: 18900,
  },
  {
    numero: '#PED-1076',
    cliente: 'Martín Rojas',
    resumen: '1 plato · 2 acompañamientos',
    fecha: 'Hoy, 12:18',
    total: 27600,
  },
  {
    numero: '#PED-1069',
    cliente: 'Antonia Silva',
    resumen: '3 platos · 2 bebidas',
    fecha: 'Ayer, 20:35',
    total: 34200,
  },
];

const formatoPrecio = (precio) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(precio);

function DeliverySidebar({ currentPage }) {
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
            <div><small>En curso</small><strong>{pedidosEnCurso.length}</strong></div>
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
            <span className="delivery-count">{pedidosEnCurso.length} activos</span>
          </div>

          <div className="delivery-active-orders">
            {pedidosEnCurso.map((pedido) => (
              <article className="delivery-order-card" key={pedido.numero}>
                <div className="delivery-order-heading">
                  <span className="delivery-order-number">{pedido.numero}</span>
                  <span className={`delivery-status ${pedido.estado === 'En camino' ? 'status-transit' : 'status-preparing'}`}>
                    <span />{pedido.estado}
                  </span>
                </div>
                <div className="delivery-customer">
                  <span className="delivery-customer-icon" aria-hidden="true">♙</span>
                  <div><small>Cliente</small><strong>{pedido.cliente}</strong></div>
                </div>
                <div className="delivery-address">
                  <span className="delivery-detail-icon" aria-hidden="true">⌖</span>
                  <div><small>Dirección de entrega</small><strong>{pedido.direccion}</strong><p>{pedido.referencia}</p></div>
                </div>
                <div className="delivery-order-items">
                  <small>Lo que pidió</small>
                  <ul>
                    {pedido.platos.map((plato) => (
                      <li key={plato.nombre}>
                        <span>{plato.nombre}</span><span>× {plato.cantidad}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="delivery-order-total">
                  <span>Total del pedido</span><strong>{formatoPrecio(pedido.total)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="delivery-section delivery-history" aria-labelledby="delivery-history-title">
          <div className="delivery-section-heading">
            <div>
              <span className="delivery-eyebrow">TU ACTIVIDAD</span>
              <h2 id="delivery-history-title">Pedidos transportados</h2>
            </div>
            <span className="delivery-history-total">Últimas entregas</span>
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

        <p className="delivery-demo-note">
          Información de ejemplo. Los datos se conectarán al backend en una siguiente etapa.
        </p>
      </main>
    </div>
  );
}

export function PedidosDelivery() {
  return (
    <div className="delivery-page">
      <DeliverySidebar currentPage="pedidos" />
      <main className="delivery-main">
        <header className="delivery-topbar">
          <div>
            <span className="delivery-eyebrow">HISTORIAL DEL REPARTIDOR</span>
            <h1>Pedidos completados</h1>
          </div>
          <span className="delivery-count">{pedidosCompletados.length} entregas</span>
        </header>

        <section className="delivery-history delivery-completed-page" aria-labelledby="delivery-history-title">
          <div className="delivery-section-heading">
            <div>
              <span className="delivery-eyebrow">ENTREGAS REALIZADAS</span>
              <h2 id="delivery-history-title">Pedidos transportados</h2>
            </div>
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

        <p className="delivery-demo-note">
          Información de ejemplo. Los datos se conectarán al backend en una siguiente etapa.
        </p>
      </main>
    </div>
  );
}

export default Delivery;
