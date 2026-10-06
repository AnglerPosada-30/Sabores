import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (usuario.trim() !== '' && password.trim() !== '') {
      try {
        const response = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: usuario,
            password: password
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          // ALERTA DE DIAGNÓSTICO: Te dirá exactamente qué lee React desde Django
          alert(`¡Inicio de sesión exitoso! Django detectó que tu rol es: [${data.rol}]`);
          
          // Guardamos los tokens y el rol
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          localStorage.setItem('user_role', data.rol);
          
          // Redirección inteligente
          if (data.rol === 'ADMIN') {
            navigate('/admin-panel');
          } else if (data.rol === 'REPARTIDOR') {
            navigate('/delivery');
          } else {
            navigate('/menu');
          }
          
        } else {
          alert('Credenciales incorrectas. Verifica tu usuario y contraseña.');
        }
      } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert('Error al conectar con el servidor. Inténtalo más tarde.');
      }
    } else {
      alert('Por favor, ingresa tu usuario y contraseña');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#b4a5ee',
      backgroundImage: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2e1065', fontSize: '2.3rem', margin: '0 0 10px 0', fontWeight: '800', textShadow: '0 1px 4px rgba(255,255,255,0.4)' }}>
          🍔 ¡Bienvenido a EL COMILON! 🍕
        </h1>
        <p style={{ color: '#4c1d95', fontSize: '1.05rem', margin: 0, fontWeight: '500' }}>
          Inicia sesión para descubrir los mejores sabores y gestionar tus pedidos.
        </p>
      </div>

      <div style={{
        background: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(46, 16, 101, 0.15)',
        width: '100%',
        maxWidth: '400px',
        boxSizing: 'border-box',
        border: '1px solid rgba(255, 255, 255, 0.8)'
      }}>
        <h2 style={{ color: '#2e1065', textAlign: 'center', marginTop: 0, marginBottom: '25px', fontWeight: '800', fontSize: '1.5rem' }}>
          Iniciar Sesión
        </h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4c1d95', fontWeight: '700', fontSize: '0.9rem' }}>
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
                fontSize: '0.95rem', 
                borderRadius: '8px', 
                border: '1px solid #ddd6fe',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#faf5ff',
                color: '#2e1065'
              }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4c1d95', fontWeight: '700', fontSize: '0.9rem' }}>
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
                fontSize: '0.95rem', 
                borderRadius: '8px', 
                border: '1px solid #ddd6fe',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#faf5ff',
                color: '#2e1065'
              }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              padding: '14px', 
              backgroundColor: '#7c3aed', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '1rem',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
              marginTop: '5px'
            }}
          >
            Ingresar al Sistema
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#4b5563' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{ color: '#7c3aed', fontWeight: '700', textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}