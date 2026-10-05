import React from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener instalado react-router-dom
import './CarritoModal.css';

const CarritoModal = ({ carrito, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const irAlCheckout = () => {
    onClose(); // Cerramos el modal
    navigate('/checkout'); // Redirigimos a la página de checkout que creaste
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-content">
        <h2>Tu Carrito de Compras</h2>
        
        <div className="checkout-seccion">
          {carrito.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            <ul className="checkout-lista-productos">
              {carrito.map((item, index) => (
                <li key={index}>
                  <span>{item.nombre} (x{item.cantidad})</span>
                  <span>${item.precio * item.cantidad}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="checkout-total"><strong>Total: ${totalCarrito}</strong></p>

        <div className="checkout-acciones">
          <button onClick={onClose} className="btn-secundario">
            Cerrar
          </button>
          {carrito.length > 0 && (
            <button onClick={irAlCheckout} className="btn-primario">
              Finalizar Pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarritoModal;