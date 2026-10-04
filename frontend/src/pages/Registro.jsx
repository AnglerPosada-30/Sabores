import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
  /* 
   * ESTADO DEL COMPONENTE (STATE)
   * Aquí definimos la estructura de datos que almacenará en tiempo real 
   * lo que el usuario escribe en los inputs. 
   * Las llaves coinciden exactamente con lo que enviaremos a nuestro backend en Django.
   */
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

  // Hook de React Router para redirigir al usuario a otras pantallas por código
  const navigate = useNavigate();

  /*
   * FUNCIÓN MANEJADORA DE CAMBIOS (handleChange)
   * Se ejecuta cada vez que el usuario presiona una tecla en cualquier input.
   * Utiliza "desestructuración" (...formData) para mantener los datos anteriores 
   * y solo actualiza el campo específico (e.target.name) que está siendo modificado.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /*
   * FUNCIÓN PRINCIPAL DE ENVÍO (handleRegistro)
   * Es asíncrona (async) porque debe esperar la respuesta del servidor a través de Internet/Red local.
   */
  const handleRegistro = async (e) => {
    // Evita que el navegador recargue la página por defecto al hacer submit del formulario
    e.preventDefault();
    
    /* 
     * 1. VALIDACIONES FRONTEND (Primera capa de defensa)
     * Verificamos que no falten datos antes de gastar recursos haciendo una petición a la API.
     */
    const camposObligatorios = ['nombre', 'rut', 'email', 'telefono', 'direccion', 'comuna', 'ciudad', 'password', 'confirmPassword'];
    for (let key of camposObligatorios) {
      if (!formData[key].trim()) {
        alert('Por favor, completa todos los campos obligatorios.');
        return; // Detiene la ejecución si falta un dato
      }
    }

    // 2. Validación de seguridad básica: coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, revísalas.');
      return;
    }

    /*
     * 3. COMUNICACIÓN CON EL BACKEND (La integración real)
     * Usamos fetch para enviar los datos a la URL de nuestra API de Django.
     */
    try {
      const response = await fetch('http://localhost:8000/api/usuarios/registro/', {
        method: 'POST', // Indicamos que vamos a crear un nuevo recurso
        headers: {
          'Content-Type': 'application/json', // Le decimos a Django que lea esto como un JSON puro
        },
        // Transformamos nuestro estado de React a texto JSON para enviarlo por la red
        body: JSON.stringify({
          username: formData.rut,
          rut: formData.rut,
          email: formData.email,
          telefono: formData.telefono,
          password: formData.password,
          nombre: formData.nombre,
          direccion: formData.direccion,
          comuna: formData.comuna,
          ciudad: formData.ciudad,
          empresa: formData.empresa
        })
      });

      /*
       * 4. MANEJO DE LA RESPUESTA DE DJANGO
       * Evaluamos el código HTTP que nos devuelve el servidor.
       */
      if (response.ok) {
        // Si el código es 200 o 201 (Creado exitosamente)
        if (formData.empresa.trim() !== '') {
          // Lógica de negocio: Mensaje diferenciado si es un perfil corporativo (convenio)
          alert(`¡Registro exitoso!\nHas registrado convenio con "${formData.empresa}". Tu perfil está en revisión.`);
        } else {
          // Mensaje para clientes regulares
          alert(`¡Registro exitoso! Bienvenido/a a El Comilón, ${formData.nombre}.`);
        }
        // Redirigimos al usuario al Login para que inicie sesión y obtenga su token JWT
        navigate('/login'); 
      } else {
        // Si Django rechaza la petición (ej. error 400), capturamos el mensaje exacto
        // Esto es útil si el RUT falla la validación del Módulo 11 en el backend o si el correo ya existe
        const errorData = await response.json();
        alert(`Error en el registro: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      // Capturamos errores de red (ej. si el servidor de Django está apagado)
      console.error("Error al registrar:", error);
      alert('Error de conexión con el servidor. Verifica que el backend esté corriendo.');
    }
  };

  /*
   * RENDERIZADO DE LA INTERFAZ
   * Aquí se dibuja el formulario. Cada input está "controlado" por React, 
   * ya que su valor (value) está atado al estado (formData) 
   * y su evento (onChange) ejecuta nuestra función (handleChange).
   */
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
        
        {/* onSubmit intercepta el "enter" o el clic en el botón submit y ejecuta nuestra lógica */}
        <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4c1d95', fontWeight: '700', fontSize: '0.85rem' }}>
              Nombre Completo: *
            </label>
            <input 
              type="text" 
              name="nombre" /* El atributo name debe ser igual a la llave en el useState */
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