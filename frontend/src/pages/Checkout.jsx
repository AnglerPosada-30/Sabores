import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

export default function Checkout() { 
  const navigate = useNavigate();
  
  const { carrito, setCarrito } = useCart() || { carrito: [] };
  const itemsCarrito = carrito || []; 
  
  const [notas, setNotas] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState('delivery');
  
  // Datos de la billetera corporativa
  const tipoClienteActual = localStorage.getItem('tipoCliente') || 'normal'; 
  const saldoCorporativo = parseFloat(localStorage.getItem('saldoCorporativo') || '0');
  
  const [metodoPago, setMetodoPago] = useState(tipoClienteActual === 'empresa' ? 'CORPORATIVO' : 'TARJETA');

  const totalCarrito = itemsCarrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // Lógica de negocio: Validamos si le alcanza el dinero
  const saldoInsuficiente = tipoClienteActual === 'empresa' && totalCarrito > saldoCorporativo;
  const botonDeshabilitado = itemsCarrito.length === 0 || saldoInsuficiente;

  const handleSubmitPedido = async (e) => {
    e.preventDefault();
    if (saldoInsuficiente) return; // Doble seguridad

    const itemsPedido = itemsCarrito.map(item => ({
      plato_id: item.id, 
      cantidad: item.cantidad,
      precio: item.precio
    }));

    const datosPedido = {
      total: totalCarrito,
      observaciones: notas,
      tipo_entrega: tipoEntrega,
      metodo_pago: metodoPago,
      items: itemsPedido 
    };

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/pedidos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosPedido)
      });

      if (response.ok) {
        const data = await response.json();
        
        const pedidoConfirmado = {
          id: data.pedido_id,
          total: totalCarrito,
          detalles: itemsCarrito.map(item => ({
            plato: item.id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio
          }))
        };

        // Si es empresa, actualizamos el saldo en el frontend restando lo que gastó
        if (tipoClienteActual === 'empresa') {
          const nuevoSaldo = saldoCorporativo - totalCarrito;
          localStorage.setItem('saldoCorporativo', nuevoSaldo);
        }

        if (setCarrito) setCarrito([]); 
        navigate('/comprobante', { state: { pedido: pedidoConfirmado } }); 
      } else {
        const errorData = await response.json();
        alert("Atención:\n\n" + (errorData.error || "No se pudo procesar el pago."));
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        <h2 style={{ color: '#2e1065', textAlign: 'center', margin: '0 0 30px 0', fontSize: '1.8rem', borderBottom: '2px solid #f3e8ff', paddingBottom: '15px' }}>
          Finalizar Pedido
        </h2>

        {/* Resumen del Carrito */}
        <div style={{ backgroundColor: '#faf5ff', padding: '20px', borderRadius: '12px', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#4c1d95', fontSize: '1.2rem' }}>Resumen de tu compra</h3>
          
          {itemsCarrito.length === 0 ? (
            <p style={{ color: '#ef4444', fontWeight: 'bold', textAlign: 'center' }}>Tu carrito está vacío.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {itemsCarrito.map((item, index) => (
                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#4b5563', borderBottom: '1px dashed #ddd6fe', paddingBottom: '10px' }}>
                  <span><strong style={{ color: '#374151' }}>{item.cantidad}x</strong> {item.nombre}</span>
                  <span style={{ fontWeight: '600', color: '#2e1065' }}>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                </li>
              ))}
            </ul>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '1.3rem', color: '#2e1065', fontWeight: '800' }}>
            <span>Total a pagar:</span>
            <span>${totalCarrito.toLocaleString('es-CL')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmitPedido}>
          
          {/* Notas */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Notas / Instrucciones para la cocina:</label>
            <textarea 
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Sin cebolla, timbre malo, etc..."
              rows="3"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* Tipo de Entrega */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Método de entrega:</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ flex: 1, padding: '15px', border: tipoEntrega === 'retiro' ? '2px solid #7c3aed' : '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: tipoEntrega === 'retiro' ? '#f3e8ff' : 'white', textAlign: 'center', fontWeight: '600', color: tipoEntrega === 'retiro' ? '#6d28d9' : '#4b5563' }}>
                <input type="radio" name="tipoEntrega" checked={tipoEntrega === 'retiro'} onChange={() => setTipoEntrega('retiro')} style={{ display: 'none' }} />
                🚶 Retiro en tienda
              </label>
              <label style={{ flex: 1, padding: '15px', border: tipoEntrega === 'delivery' ? '2px solid #7c3aed' : '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: tipoEntrega === 'delivery' ? '#f3e8ff' : 'white', textAlign: 'center', fontWeight: '600', color: tipoEntrega === 'delivery' ? '#6d28d9' : '#4b5563' }}>
                <input type="radio" name="tipoEntrega" checked={tipoEntrega === 'delivery'} onChange={() => setTipoEntrega('delivery')} style={{ display: 'none' }} />
                🛵 Delivery
              </label>
            </div>
          </div>

          {/* Medio de Pago Inteligente */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Medio de pago:</label>
            
            {tipoClienteActual === 'empresa' ? (
              <div style={{ padding: '15px', border: saldoInsuficiente ? '2px solid #ef4444' : '2px solid #10b981', borderRadius: '8px', backgroundColor: saldoInsuficiente ? '#fef2f2' : '#f0fdf4' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: saldoInsuficiente ? '#991b1b' : '#166534', fontWeight: '700' }}>💼 Convenio Corporativo</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: saldoInsuficiente ? '#dc2626' : '#059669' }}>
                    Saldo: ${saldoCorporativo.toLocaleString('es-CL')}
                  </span>
                </div>
                
                {saldoInsuficiente ? (
                  <p style={{ margin: 0, color: '#dc2626', fontSize: '0.9rem', fontWeight: '600' }}>
                    ⚠️ Tu saldo no es suficiente para cubrir el total de esta compra.
                  </p>
                ) : (
                  <p style={{ margin: 0, color: '#059669', fontSize: '0.9rem', fontWeight: '500' }}>
                    Tendrás un saldo restante de ${(saldoCorporativo - totalCarrito).toLocaleString('es-CL')} tras esta compra.
                  </p>
                )}
              </div>
            ) : (
              <div style={{ padding: '15px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#4b5563', fontWeight: '500' }}>
                💳 Tarjeta (Transbank) - Pago seguro en línea
              </div>
            )}
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/menu')} 
              style={{ flex: 1, padding: '14px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' }}
            >
              Volver al Menú
            </button>
            <button 
              type="submit" 
              disabled={botonDeshabilitado}
              style={{ 
                flex: 2, padding: '14px', 
                backgroundColor: botonDeshabilitado ? '#9ca3af' : '#7c3aed', 
                color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', 
                cursor: botonDeshabilitado ? 'not-allowed' : 'pointer', fontSize: '1rem', 
                boxShadow: botonDeshabilitado ? 'none' : '0 4px 12px rgba(124,58,237,0.3)',
                transition: 'all 0.3s'
              }}
            >
              {saldoInsuficiente ? 'Saldo Insuficiente' : itemsCarrito.length === 0 ? 'Carrito Vacío' : 'Pagar y Confirmar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}