import React, { useState } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      addToCart(product, quantity);
      setShowQuantitySelector(false);
      setQuantity(1);

      // Feedback visual
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-fade-in">
      <div className="h-56 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
        <span className="text-6xl">{product.emoji || "📱"}</span>
        {product.stock < 10 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Últimas {product.stock} unidades!
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            R$ {product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {showQuantitySelector ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold transition-all"
              >
                -
              </button>
              <span className="w-12 text-center font-bold text-lg">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold transition-all"
              >
                +
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowQuantitySelector(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-all transform hover:scale-105"
              >
                Confirmar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowQuantitySelector(true)}
            className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105
              ${
                isAdded
                  ? "bg-green-500 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              }`}
          >
            {isAdded ? "✓ Adicionado!" : "Adicionar ao Carrinho"}
          </button>
        )}
      </div>
    </div>
  );
};
export default ProductCard;
