import { useState } from "react";
import { CartContext } from "./CartContext";
import { useEffect } from "react";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === product._id);

      const stock = Number(product.stock) || 0;

      if (existingItem) {
        return prev.map((item) => {
          const total = existingItem.quantity + quantity;

          if (total > stock) {
            alert("Quantidade máxima em estoque atingida");
          }

          if (item._id === product._id) {
            const newQuantity = Math.min(item.quantity + quantity, stock);

            return { ...item, quantity: newQuantity };
          }

          return item;
        });
      }

      return [
        ...prev,
        {
          ...product,
          quantity: Math.min(quantity, stock), // 🔥 protege na entrada
          weight: product.weight || 0.5,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalWeight = () => {
    return cartItems.reduce(
      (total, item) => total + (item.weight || 0.5) * item.quantity,
      0,
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getTotalItems,
        getTotalWeight,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
