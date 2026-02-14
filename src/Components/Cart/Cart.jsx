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
      className="fixed inset-0 bg-black/50 z-50 flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md h-full overflow-y-auto animate-fade-in"
      >
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Carrinho</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-white hover:text-gray-200 text-3xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
              <Link
                to="/products"
                onClick={() => setIsCartOpen(false)}
                className="inline-block mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg"
              >
                Ver Produtos
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{item.emoji || "📱"}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-blue-600 font-bold">
                        R$ {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center font-bold transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center font-bold transition-all"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 ml-2 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-gray-800">
                    Total:
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 mb-3"
                >
                  Finalizar Compra
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all"
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
