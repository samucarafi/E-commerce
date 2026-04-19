import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useCart } from "../../Contexts/Cart/CartContext";
import { useEffect, useState } from "react";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(t);
    }
  }, [isCartOpen]);

  if (!mounted) return null;

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      navigate("/login");
      return;
    }
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{
          opacity: isCartOpen ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white flex flex-col"
        style={{
          transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0E8E0]">
          <div>
            <h2 className="font-semibold text-[#1C1C1C] tracking-wide">
              Sacola
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {cartItems.length === 0
                ? "Vazia"
                : `${cartItems.reduce((t, i) => t + i.quantity, 0)} item${cartItems.reduce((t, i) => t + i.quantity, 0) !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F5F0EB] flex items-center justify-center text-gray-500 hover:bg-[#EDE5DC] transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-20 h-20 bg-[#FAF7F4] rounded-full flex items-center justify-center mb-5">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C6A75E"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="font-medium text-[#2E2E2E] mb-1">
                Sua sacola está vazia
              </p>
              <p className="text-sm text-gray-400 mb-7 font-light">
                Adicione fragrâncias para continuar
              </p>
              <Link
                to="/products"
                onClick={() => setIsCartOpen(false)}
                className="bg-[#C6A75E] hover:bg-[#B8954D] text-[#111] px-8 py-3 rounded-full text-sm font-semibold transition-colors"
              >
                Explorar Coleção
              </Link>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 p-3 bg-[#FAF7F4] rounded-2xl"
                >
                  {/* Image */}
                  <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image || "/images/default-perfume.jpg"}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#B0A090] uppercase tracking-wider">
                      {item.brand}
                    </p>
                    <p className="font-medium text-[#1C1C1C] text-sm leading-tight line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[#C6A75E] font-semibold text-sm mt-0.5">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded-full bg-white border border-[#E8DDD0] text-[#5B2333] flex items-center justify-center text-sm font-bold hover:border-[#C6A75E] transition-colors"
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded-full bg-white border border-[#E8DDD0] text-[#5B2333] flex items-center justify-center text-sm font-bold hover:border-[#C6A75E] transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-5 py-5 border-t border-[#F0E8E0] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="font-semibold text-[#1C1C1C]">
                R$ {getTotalPrice().toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-400">Frete calculado no checkout</p>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#C6A75E] hover:bg-[#B8954D] text-[#111] py-3.5 rounded-full font-semibold text-sm tracking-wide transition-colors"
            >
              Ir para o Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full text-xs text-gray-400 hover:text-red-400 transition-colors py-1"
            >
              Limpar sacola
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
