import React from 'react';
import { useCart } from '../CartContext';

export default function CarritoModal() {
  const { carrito, verCarrito, setVerCarrito, agregarAlPedido, disminuirOQuitar, totalPagar, setCarrito } = useCart();

  if (!verCarrito) return null;

  // Transformamos finalizarCompra en una función asíncrona real
  const finalizarCompra = async () => {
    if (carrito.length === 0) return;

    // 1. Verificamos la seguridad: ¿El usuario está logueado?
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Debes iniciar sesión para poder confirmar tu pedido.");
      return;
    }

    // 2. Adaptamos los productos del carrito al JSON que espera tu vista ProcesarPedidoView
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
        alert(`¡Pedido realizado con éxito! Gracias por preferir El Comilón.\nTu número de orden es: #${data.pedido_id}`);
        setCarrito([]); // Vaciamos el carrito
        setVerCarrito(false); // Cerramos la ventana
      } else {
        // 6. Si el backend rechazó la compra (ej. fondos insuficientes simulados)
        alert("Error al procesar: " + (data.error || "Intenta nuevamente."));
      }
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      alert("Hubo un problema al conectar con el servidor. Revisa tu conexión.");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'flex-end',
      zIndex: 9999
    }}>
      <div style={{
        width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', height: '100%',
        padding: '25px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
        boxShadow: '-5px 0 25px rgba(0,0,0,0.3)'
      }}>
        {/* Cabecera del carrito */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f3e8ff', paddingBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#2e1065', fontSize: '1.4rem', fontWeight: '800' }}>🛒 Tu Carrito</h2>
          <button 
            onClick={() => setVerCarrito(false)} 
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b21a8', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>

        {/* Lista de productos */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '15px 0' }}>
          {carrito.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '50px', fontWeight: '500' }}>Tu carrito está vacío.</p>
          ) : (
            carrito.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ flex: 1, paddingRight: '10px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '0.95rem', fontWeight: '700' }}>{item.nombre}</h4>
                  <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '0.9rem' }}>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f3e8ff', padding: '4px 8px', borderRadius: '8px' }}>
                  <button onClick={() => disminuirOQuitar(item.id)} style={{ border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#6b21a8' }}>-</button>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#4c1d95' }}>{item.cantidad}</span>
                  <button onClick={() => agregarAlPedido(item)} style={{ border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#6b21a8' }}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total y botón de pago */}
        {carrito.length > 0 && (
          <div style={{ borderTop: '2px solid #f3e8ff', paddingTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.1rem', fontWeight: '800', color: '#2e1065' }}>
              <span>Total:</span>
              <span>${totalPagar.toLocaleString('es-CL')}</span>
            </div>
            <button 
              onClick={finalizarCompra} 
              style={{ width: '100%', padding: '12px', backgroundColor: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer' }}
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}