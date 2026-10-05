import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

export default function AdminLogin() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const continuarDemo = (event) => {
    event.preventDefault();
    navigate('/admin');
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-icon" aria-hidden="true">E</span>
          <span><strong>EL COMILÓN</strong><small>Administración</small></span>
        </Link>

        <p className="admin-kicker">ACCESO DE ADMINISTRACIÓN</p>
        <h1>Iniciar sesión</h1>
        <p className="admin-login-description">
          Ingresa para gestionar pedidos, precios e inventario.
        </p>

        <div className="admin-demo-notice" role="status">
          Prototipo de interfaz: el inicio de sesión todavía no está conectado al backend.
          No uses credenciales reales en esta pantalla.
        </div>

        <form className="admin-login-form" onSubmit={continuarDemo}>
          <label htmlFor="admin-username">Usuario administrador</label>
          <input
            id="admin-username"
            autoComplete="username"
            value={usuario}
            onChange={(event) => setUsuario(event.target.value)}
            placeholder="Ingresa tu usuario"
            required
          />
          <label htmlFor="admin-password">Contraseña</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />
          <button type="submit">Continuar al panel de demostración</button>
        </form>
        <Link className="admin-back-link" to="/">Volver al catálogo</Link>
      </section>
    </main>
  );
}
