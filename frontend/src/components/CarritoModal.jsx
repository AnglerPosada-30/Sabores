import React from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import './CarritoModal.css';

export default function CarritoModal() {
  // Extraemos también las funciones para sumar y restar del contexto
  const { carrito, verCarrito, setVerCarrito, agregarAlPedido, disminuirOQuitar } = useCart();
  const navigate = useNavigate(); 

  const isOpen = verCarrito !== undefined ? verCarrito : true; 

  if (!isOpen) return null;

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const irAlCheckout = () => {
    if (setVerCarrito) {
      setVerCarrito(false);
    }
    navigate('/checkout'); 
  };

  return (
    // Si hace clic en la capa oscura, cerramos el carrito
    <div className="checkout-overlay" onClick={() => setVerCarrito && setVerCarrito(false)}>
      
      {/* Detenemos la propagación del clic para que no se cierre si hace clic dentro del panel blanco */}
      <div className="checkout-content" onClick={(e) => e.stopPropagation()}>
        <h2>Tu Pedido</h2>
        
        <div className="checkout-seccion">
          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '40px' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🛒</span>
              <p>Tu carrito está vacío.</p>
              <p style={{ fontSize: '0.9rem' }}>¡Agrega algunos platos deliciosos!</p>
            </div>
          ) : (
            <ul className="checkout-lista-productos">
              {carrito.map((item, index) => (
                <li key={index}>
                  <div className="item-info">
                    <span className="item-nombre">{item.nombre}</span>
                    <span className="item-precio">${item.precio.toLocaleString('es-CL')}</span>
                  </div>
                  
                  {/* Botones para sumar o restar */}
                  <div className="item-controles">
                    <button className="btn-control" onClick={() => disminuirOQuitar(item.id)}>-</button>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem', minWidth: '20px', textAlign: 'center' }}>
                      {item.cantidad}
                    </span>
                    <button className="btn-control" onClick={() => agregarAlPedido(item)}>+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="checkout-total">
          <span>Total a pagar:</span>
          <strong>${totalCarrito.toLocaleString('es-CL')}</strong>
        </div>

        <div className="checkout-acciones">
          <button onClick={() => setVerCarrito && setVerCarrito(false)} className="btn-secundario">
            Volver
          </button>
          {carrito.length > 0 && (
            <button onClick={irAlCheckout} className="btn-primario">
              Ir a Pagar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}