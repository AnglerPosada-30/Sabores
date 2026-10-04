import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    empresa: '',
    referencia: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    const camposObligatorios = ['nombre', 'rut', 'email', 'telefono', 'direccion', 'comuna', 'ciudad', 'password', 'confirmPassword'];
    for (let key of camposObligatorios) {
      if (!formData[key].trim()) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, revísalas.');
      return;
    }

    // Lógica diferenciada si ingresó Empresa / Convenio
    if (formData.empresa.trim() !== '') {
      alert(
        `¡Registro exitoso, ${formData.nombre}!\n\n` +
        `Has registrado convenio con la empresa "${formData.empresa}".\n` +
        `Tu perfil ha quedado en **estado de revisión** para validar el beneficio corporativo. Te notificaremos a tu correo (${formData.email}) cuando esté activo.`
      );
      navigate('/login'); // Opcional: mandarlo al login o a una pantalla de espera
    } else {
      alert(`¡Registro exitoso! Bienvenido/a a El Comilón, ${formData.nombre}.`);
      navigate('/catalogo');
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
      padding: '30px 20px',
      boxSizing: 'border-box'
    }}>
      {/* Cabecera / Bienvenida */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ color: '#2e1065', fontSize: '2.3rem', margin: '0 0 10px 0', fontWeight: '800', textShadow: '0 1px 4px rgba(255,255,255,0.4)' }}>
          📝 Únete a EL COMILON 🍔
        </h1>
        <p style={{ color: '#4c1d95', fontSize: '1.05rem', margin: 0, fontWeight: '500' }}>
          Crea tu cuenta para realizar pedidos y gestionar tus despachos a oficina.
        </p>
      </div>

      {/* Tarjeta del Formulario de Registro */}
      <div style={{
        background: '#ffffff',
        padding: '35px 40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(46, 16, 101, 0.15)',
        width: '100%',
        maxWidth: '550px',
        boxSizing: 'border-box',
        border: '1px solid rgba(255, 255, 255, 0.8)'
      }}>
        <h2 style={{ color: '#2e1065', textAlign: 'center', marginTop: 0, marginBottom: '20px', fontWeight: '800', fontSize: '1.5rem' }}>
          Registro de Usuario
        </h2>
        
        <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
              Nombre Completo: *
            </label>
            <input 
              type="text" 
              name="nombre"
              placeholder="Ej: Juan Pérez" 
              value={formData.nombre}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
                RUT: *
              </label>
              <input 
                type="text" 
                name="rut"
                placeholder="12.345.678-9" 
                value={formData.rut}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
                Teléfono: *
              </label>
              <input 
                type="text" 
                name="telefono"
                placeholder="+56 9 1234 5678" 
                value={formData.telefono}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
              Correo Electrónico: *
            </label>
            <input 
              type="email" 
              name="email"
              placeholder="tucorreo@empresa.cl" 
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
              Dirección de Despacho: *
            </label>
            <input 
              type="text" 
              name="direccion"
              placeholder="Av. Principal 123" 
              value={formData.direccion}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
                Comuna: *
              </label>
              <input 
                type="text" 
                name="comuna"
                placeholder="Ej: Santiago" 
                value={formData.comuna}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
                Ciudad: *
              </label>
              <input 
                type="text" 
                name="ciudad"
                placeholder="Ej: Santiago" 
                value={formData.ciudad}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
                Empresa / Convenio (Opcional):
              </label>
              <input 
                type="text" 
                name="empresa"
                placeholder="Nombre de tu empresa" 
                value={formData.empresa}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
                Referencia de Entrega:
              </label>
              <input 
                type="text" 
                name="referencia"
                placeholder="Ej: Oficina 402" 
                value={formData.referencia}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
                Contraseña: *
              </label>
              <input 
                type="password" 
                name="password"
                placeholder="********" 
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
                Confirmar Contraseña: *
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="********" 
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #ddd6fe', boxSizing: 'border-box', outline: 'none', backgroundColor: '#faf5ff', color: '#2e1065' }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              padding: '12px', 
              backgroundColor: '#7c3aed', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '1rem',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
              marginTop: '10px'
            }}
          >
            Crear Cuenta
          </button>
        </form>

        {/* Enlace para volver al login */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#4b5563' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{ color: '#7c3aed', fontWeight: '700', textDecoration: 'none' }}>
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}