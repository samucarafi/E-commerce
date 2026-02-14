import React, { useState } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowQuantitySelector(false);
    setQuantity(1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#F1E8E2] hover:shadow-xl transition-all duration-300">
      <div className="h-56 bg-[#F1E8E2] flex items-center justify-center relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full object-contain"
          />
        ) : (
          <img
            src={"/images/default-perfume.jpg"}
            alt={product.name}
            className="h-full object-contain"
          />
        )}

        {product.stock < 10 && (
          <div className="absolute top-3 right-3 bg-[#5B2333] text-[#F5E6D3] text-xs px-3 py-1 rounded-full">
            Últimas {product.stock} unidades
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-xl mb-2 text-[#2E2E2E] tracking-wide">
          {product.name}
        </h3>

        <p className="text-[#6B5E5E] text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-5">
          <span className="text-2xl font-bold text-[#5B2333]">
            R$ {product.price.toFixed(2)}
          </span>

          <span className="text-xs text-[#5B2333] bg-[#F1E8E2] px-3 py-1 rounded-full tracking-wide">
            {product.category}
          </span>
        </div>

        {showQuantitySelector ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-[#F1E8E2] hover:bg-[#E8D8C3] rounded-full flex items-center justify-center font-bold transition-all"
              >
                -
              </button>

              <span className="w-12 text-center font-semibold text-lg">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-10 h-10 bg-[#F1E8E2] hover:bg-[#E8D8C3] rounded-full flex items-center justify-center font-bold transition-all"
              >
                +
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowQuantitySelector(false)}
                className="flex-1 border border-[#5B2333] text-[#5B2333] py-2 rounded-full hover:bg-[#5B2333] hover:text-[#F5E6D3] transition-all"
              >
                Cancelar
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#C6A75E] hover:bg-[#B8954D] text-[#1C1C1C] py-2 rounded-full transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowQuantitySelector(true)}
            className={`w-full py-3 rounded-full font-semibold tracking-wide transition-all ${
              isAdded
                ? "bg-[#5B2333] text-[#F5E6D3]"
                : "bg-[#C6A75E] hover:bg-[#B8954D] text-[#1C1C1C]"
            }`}
          >
            {isAdded ? "✓ Adicionado" : "Adicionar à Sacola"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
