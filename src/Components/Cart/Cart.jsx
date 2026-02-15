import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useCart } from "../../Contexts/Cart/CartContext";

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

  const handleCheckout = async () => {
    if (!user) {
      alert("Faça login para finalizar a compra");
      navigate("/login");
      return;
    }
    setIsCartOpen(false);
    navigate("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <div
      onClick={() => setIsCartOpen(false)}
      className="fixed inset-0 bg-black/40 z-50 flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F8F5F2] w-full max-w-md h-full overflow-y-auto shadow-2xl"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-[#D4A5A5] bg-[#5B2333] text-[#F5E6D3]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-wide">
              Seu Carrinho
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[#F5E6D3] hover:text-[#C6A75E] text-3xl transition-all"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🛍️</div>
              <p className="text-[#5B2333] text-lg font-light">
                Seu carrinho está vazio
              </p>
              <Link
                to="/products"
                onClick={() => setIsCartOpen(false)}
                className="inline-block mt-6 bg-[#5B2333] hover:bg-[#3E1622] text-[#F5E6D3] px-8 py-3 rounded-full tracking-wide transition-all"
              >
                Explorar Coleção
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-5 mb-8">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm border border-[#F1E8E2]"
                  >
                    <div className="w-16 h-16 bg-[#F1E8E2] rounded-lg flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-[#2E2E2E]">
                        {item.name}
                      </h4>

                      <p className="text-[#C6A75E] font-bold">
                        R$ {item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center space-x-3 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-[#F1E8E2] hover:bg-[#E8D8C3] rounded-full flex items-center justify-center font-bold transition-all"
                        >
                          -
                        </button>

                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-[#F1E8E2] hover:bg-[#E8D8C3] rounded-full flex items-center justify-center font-bold transition-all"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-[#5B2333] hover:text-red-600 ml-2 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="border-t border-[#D4A5A5] pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-[#2E2E2E]">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#5B2333]">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#C6A75E] hover:bg-[#B8954D] text-[#1C1C1C] py-4 rounded-full font-semibold tracking-wide transition-all mb-3"
                >
                  Finalizar Compra
                </button>

                <button
                  onClick={clearCart}
                  className="w-full border border-[#5B2333] text-[#5B2333] hover:bg-[#5B2333] hover:text-[#F5E6D3] py-2 rounded-full transition-all"
                >
                  Limpar Carrinho
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
