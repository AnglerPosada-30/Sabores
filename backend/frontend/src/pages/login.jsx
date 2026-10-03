import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes agregar validación si lo deseas, o redirigir al catálogo
    if (usuario.trim() !== '' && password.trim() !== '') {
      navigate('/catalogo');
    } else {
      alert('Por favor, ingresa tu usuario y contraseña');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3e8ff', // Fondo lila suave
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Cabecera / Bienvenida de la página */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#553c9a', fontSize: '2.5rem', margin: '0 0 10px 0' }}>
          🍔 ¡Bienvenido a EL COMILON! 🍕
        </h1>
        <p style={{ color: '#6b46c1', fontSize: '1.1rem', margin: 0 }}>
          Inicia sesión para descubrir los mejores sabores y gestionar tus pedidos.
        </p>
      </div>

      {/* Tarjeta del Formulario */}
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(107, 70, 193, 0.15)',
        width: '100%',
        maxWidth: '400px',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ color: '#4a307d', textAlign: 'center', marginTop: 0, marginBottom: '25px' }}>
          Iniciar Sesión
        </h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a307d', fontWeight: 'bold' }}>
              Usuario:
            </label>
            <input 
              type="text" 
              placeholder="Ingresa tu usuario" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '15px', 
                borderRadius: '6px', 
                border: '1px solid #cbd5e0',
                boxSizing: 'border-box',
                outline: 'none'
              }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a307d', fontWeight: 'bold' }}>
              Contraseña:
            </label>
            <input 
              type="password" 
              placeholder="Ingresa tu contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '15px', 
                borderRadius: '6px', 
                border: '1px solid #cbd5e0',
                boxSizing: 'border-box',
                outline: 'none'
              }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              padding: '14px', 
              backgroundColor: '#6b46c1', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background 0.2s',
              marginTop: '10px'
            }}
          >
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
}