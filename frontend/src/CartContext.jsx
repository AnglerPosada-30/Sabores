import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [verCarrito, setVerCarrito] = useState(false);

  const agregarAlPedido = (item) => {
    const existe = carrito.find((prod) => prod.id === item.id);
    if (existe) {
      setCarrito(
        carrito.map((prod) =>
          prod.id === item.id ? { ...prod, cantidad: prod.cantidad + 1 } : prod
        )
      );
    } else {
      setCarrito([...carrito, { ...item, cantidad: 1 }]);
    }
    setVerCarrito(true); // Abre el carrito automáticamente al añadir algo (opcional, muy cómodo)
  };

  const disminuirOQuitar = (id) => {
    const existe = carrito.find((prod) => prod.id === id);
    if (existe.cantidad > 1) {
      setCarrito(
        carrito.map((prod) =>
          prod.id === id ? { ...prod, cantidad: prod.cantidad - 1 } : prod
        )
      );
    } else {
      setCarrito(carrito.filter((prod) => prod.id !== id));
    }
  };

  const totalPagar = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ carrito, agregarAlPedido, disminuirOQuitar, totalPagar, totalItems, verCarrito, setVerCarrito, setCarrito }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}