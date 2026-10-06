import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Comprobante() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extraemos el objeto "pedido" completo que nos envió Checkout.jsx desde Django
  const { pedido } = location.state || {};
  const [tiempoEstimado, setTiempoEstimado] = useState('');

  useEffect(() => {
    // Si no hay pedido en memoria, lo expulsamos al menú
    if (!pedido) {
      navigate('/menu');
      return;
    }

    // Calculamos el tiempo estimado (Hora actual + 45 minutos)
    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + 45);
    setTiempoEstimado(fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }));
  }, [pedido, navigate]);

  if (!pedido) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '400px', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderTop: '8px solid #7c3aed' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#2e1065', margin: '0 0 10px 0', fontSize: '1.8rem' }}>¡Pedido Confirmado! 🎉</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '1rem' }}>Orden #{pedido.id}</p>
        </div>

        <div style={{ backgroundColor: '#f3e8ff', borderRadius: '8px', padding: '15px', textAlign: 'center', marginBottom: '25px' }}>
          <p style={{ margin: 0, color: '#4c1d95', fontWeight: '600', fontSize: '0.9rem' }}>Tiempo estimado de entrega</p>
          <p style={{ margin: '5px 0 0 0', color: '#7c3aed', fontWeight: '800', fontSize: '1.5rem' }}>{tiempoEstimado}</p>
        </div>

        <div style={{ borderTop: '2px dashed #e5e7eb', borderBottom: '2px dashed #e5e7eb', padding: '15px 0', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151', fontSize: '1.1rem' }}>Detalle de tu compra:</h3>
          {/* Mapeamos los detalles reales guardados en la BD */}
          {pedido.detalles && pedido.detalles.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#4b5563' }}>
              <span>{item.cantidad}x Plato ID: {item.plato}</span>
              {item.precio && (
                <span style={{ fontWeight: '600' }}>
                  ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.3rem', fontWeight: '800', color: '#2e1065', marginBottom: '30px' }}>
          <span>Total Pagado:</span>
          <span>${Number(pedido.total).toLocaleString('es-CL')}</span>
        </div>

        <button 
          onClick={() => navigate('/mis-pedidos')}
          style={{ width: '100%', padding: '12px', backgroundColor: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
        >
          Rastrear mi pedido
        </button>
      </div>
    </div>
  );
}