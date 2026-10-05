import React from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener instalado react-router-dom
import './CarritoModal.css';

const CarritoModal = ({ carrito, isOpen, onClose }) => {
  const navigate = useNavigate();
=======
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom'; // Importamos el hook para cambiar de página

export default function CarritoModal() {
  const { carrito, verCarrito, setVerCarrito, agregarAlPedido, disminuirOQuitar, totalPagar, setCarrito } = useCart();
  
  // Inicializamos el hook de navegación para poder redirigir al usuario
  const navigate = useNavigate(); 
>>>>>>> 5dcfa3b3dafd76356aea58950eda68e351b44067

  if (!isOpen) return null;

<<<<<<< HEAD
  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const irAlCheckout = () => {
    onClose(); // Cerramos el modal
    navigate('/checkout'); // Redirigimos a la página de checkout que creaste
=======
  // Transformamos finalizarCompra en una función asíncrona real
  const finalizarCompra = async () => {
    if (carrito.length === 0) return;

    // 1. Verificamos la seguridad: ¿El usuario está logueado?
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Debes iniciar sesión para poder confirmar tu pedido.");
      return;
    }

    // 2. Adaptamos los productos del carrito al JSON que espera tu vista ProcesarPedidoView en Django
    const itemsParaBackend = carrito.map((item) => ({
      plato_id: item.id,
      cantidad: item.cantidad
    }));

    // 3. Preparamos el paquete de datos
    const payload = {
      items: itemsParaBackend,
      metodo_pago: 'TARJETA' // Simulando el método de pago por ahora
    };

    try {
      // 4. Disparamos la orden hacia Django
      const response = await fetch('http://localhost:8000/api/pedidos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Aquí enviamos el pase de seguridad
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // 5. ¡Camino Feliz! La base de datos guardó el pedido
        
        setCarrito([]); // Vaciamos el carrito local
        setVerCarrito(false); // Cerramos la ventana del carrito
        
        // 6. Redirigimos a la pantalla del Comprobante.
        // El atributo 'state' nos permite enviar datos ocultos a la siguiente ruta
        // sin exponerlos en la URL, para que la boleta sepa qué mostrar.
        navigate('/comprobante', { 
          state: { 
            pedido_id: data.pedido_id, 
            total: totalPagar, 
            items: carrito 
          } 
        });

      } else {
        // 7. Si el backend rechazó la compra (ej. fondos insuficientes simulados)
        alert("Error al procesar: " + (data.error || "Intenta nuevamente."));
      }
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      alert("Hubo un problema al conectar con el servidor. Revisa tu conexión.");
    }
>>>>>>> 5dcfa3b3dafd76356aea58950eda68e351b44067
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