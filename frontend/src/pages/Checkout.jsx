import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Checkout.css'; // Si gustas crearle estilos independientes

const Checkout = ({ carrito = [] }) => { // Idealmente recibes el carrito por props o contexto
  const navigate = useNavigate();
  
  const [notas, setNotas] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState('delivery');
  
  const tipoClienteActual = localStorage.getItem('tipoCliente') || 'normal'; 
  const [metodoPago, setMetodoPago] = useState(tipoClienteActual === 'empresa' ? 'convenio_empresa' : 'tarjeta');

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const handleSubmitPedido = (e) => {
    e.preventDefault();

    const datosPedido = {
      productos: carrito,
      total: totalCarrito,
      observaciones: notas,
      tipo_entrega: tipoEntrega,
      metodo_pago: metodoPago,
    };

    console.log("Datos listos para enviar al backend de Django:", datosPedido);
    
    // Aquí tus compañeros conectarán Axios/Fetch:
    // axios.post('/api/pedidos/', datosPedido)

    alert("¡Pedido creado con éxito!");
    navigate('/'); // Vuelve al inicio o a donde prefieras
  };

  return (
    <div className="pagina-checkout" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Finalizar Pedido - El Comilón</h2>

      <div className="checkout-seccion">
        <h3>Detalle del pedido</h3>
        <ul>
          {carrito.map((item, index) => (
            <li key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.nombre} (x{item.cantidad})</span>
              <span>${item.precio * item.cantidad}</span>
            </li>
          ))}
        </ul>
        <p><strong>Total a pagar: ${totalCarrito}</strong></p>
      </div>

      <form onSubmit={handleSubmitPedido}>
        
        {/* Notas */}
        <div className="checkout-seccion" style={{ marginTop: '15px' }}>
          <label><strong>Notas / Información adicional:</strong></label>
          <textarea 
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Ej: Casa de reja negra, sin cebolla..."
            rows="3"
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>

        {/* Tipo de Entrega */}
        <div className="checkout-seccion" style={{ marginTop: '15px' }}>
          <label><strong>Método de entrega:</strong></label>
          <div>
            <label>
              <input 
                type="radio" 
                name="tipoEntrega" 
                checked={tipoEntrega === 'retiro'}
                onChange={() => setTipoEntrega('retiro')}
              />
              Retiro en tienda
            </label>
          </div>
          <div>
            <label>
              <input 
                type="radio" 
                name="tipoEntrega" 
                checked={tipoEntrega === 'delivery'}
                onChange={() => setTipoEntrega('delivery')}
              />
              Delivery (aprox. 40 mins)
            </label>
          </div>
        </div>

        {/* Medio de Pago */}
        <div className="checkout-seccion" style={{ marginTop: '15px' }}>
          <label><strong>Medio de pago:</strong></label>
          {tipoClienteActual === 'empresa' ? (
            <div>
              <label>
                <input 
                  type="radio" 
                  name="metodoPago" 
                  checked={metodoPago === 'convenio_empresa'}
                  onChange={() => setMetodoPago('convenio_empresa')}
                />
                🏢 Facturación por Convenio
              </label>
              <label style={{ marginLeft: '15px' }}>
                <input 
                  type="radio" 
                  name="metodoPago" 
                  checked={metodoPago === 'tarjeta'}
                  onChange={() => setMetodoPago('tarjeta')}
                />
                💳 Tarjeta (Transbank)
              </label>
            </div>
          ) : (
            <p>💳 Tarjeta (Transbank) - Pago seguro en línea</p>
          )}
        </div>

        {/* Botones */}
        <div className="checkout-acciones" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button type="button" onClick={() => navigate(-1)} className="btn-secundario">
            Volver
          </button>
          <button type="submit" className="btn-primario">
            Confirmar y Enviar Pedido
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;