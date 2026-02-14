import { useCart } from "../../Contexts/Cart/CartContext";
import { Link } from "react-router-dom";
import { useApp } from "../../Contexts/App/AppContext";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const { createPreference } = useApp();
  const handleCompletePurchase = async () => {
    await createPreference(cart);
  };
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 fade-in">
        <h2 className="text-3xl font-bold mb-8">Carrinho de Compras</h2>
        <div className="text-center py-16">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Seu carrinho está vazio
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione produtos para começar suas compras
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <h2 className="text-3xl font-bold mb-8">Carrinho de Compras</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
              >
                <div className="text-4xl">{item.image}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-green-600 font-semibold">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <i className="fas fa-minus text-sm"></i>
                  </button>
                  <span className="font-semibold w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <i className="fas fa-plus text-sm"></i>
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Resumo do Pedido</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>R$ {shipping.toFixed(2).replace(".", ",")}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Código de desconto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Aplicar Cupom
              </button>
              <Link
                onClick={handleCompletePurchase}
                to="/checkout"
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-center block"
              >
                Finalizar Compra
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
