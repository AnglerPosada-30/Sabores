import React from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import './CarritoModal.css';

export default function CarritoModal() {
  const { carrito, verCarrito, setVerCarrito, totalPagar } = useCart();
  const navigate = useNavigate(); 

  // Si usamos la propiedad 'verCarrito' del contexto, controlamos la apertura con eso, o con isOpen si se pasa por props.
  // Vamos a usar setVerCarrito(false) para cerrar el modal correctamente.
  const isOpen = verCarrito !== undefined ? verCarrito : true; 

  if (!isOpen) return null;

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const irAlCheckout = () => {
    if (setVerCarrito) {
      setVerCarrito(false); // Cierra el modal usando el contexto
    }
    navigate('/checkout'); // Redirige a la página de pago que creamos
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
          <button onClick={() => setVerCarrito && setVerCarrito(false)} className="btn-secundario">
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
}