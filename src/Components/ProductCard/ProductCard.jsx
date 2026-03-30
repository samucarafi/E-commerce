import React, { useState } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";
import { useAuth } from "../../Contexts/Auth/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { user } = useAuth();
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowQuantitySelector(false);
    setQuantity(1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (product.stock <= 0) return null;
  const shareLink = () => {
    if (!user?.affiliate?.couponCode) {
      alert("Cupom não disponível");
      return;
    }

    const link =
      window.location.origin +
      "/products?product=" +
      product._id +
      "&coupon=" +
      user.affiliate.couponCode +
      "&buy=true";

    navigator.clipboard.writeText(link);

    alert("Link copiado!");
  };
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#F1E8E2] hover:shadow-xl transition-all duration-300">
      {/* IMAGEM */}
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

        {/* LANÇAMENTO */}
        {product.isNewProduct && (
          <div className="absolute top-3 left-3 bg-[#C6A75E] text-[#1C1C1C] text-xs px-3 py-1 rounded-full font-semibold">
            Lançamento
          </div>
        )}

        {/* ESTOQUE */}
        {product.stock < 10 && (
          <div className="absolute top-3 right-3 bg-[#5B2333] text-[#F5E6D3] text-xs px-3 py-1 rounded-full">
            Estoque: {product.stock}
          </div>
        )}
      </div>

      {/* CONTEÚDO */}
      <div className="text-right p-2">
        <button
          className="flex-1 bg-[#C6A75E] hover:bg-[#B8954D] text-[#1C1C1C] py-2 px-2 rounded-full transition-all "
          onClick={shareLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFF"
          >
            <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm508.5-291.5Q720-743 720-760t-11.5-28.5Q697-800 680-800t-28.5 11.5Q640-777 640-760t11.5 28.5Q663-720 680-720t28.5-11.5ZM680-200ZM200-480Zm480-280Z" />
          </svg>
        </button>
      </div>
      <div className="p-6">
        {/* MARCA */}
        {product.brand && (
          <p className="text-xs uppercase tracking-wide text-[#8C7A7A] mb-1">
            {product.brand}
          </p>
        )}

        {/* NOME */}

        <h3 className="font-semibold text-xl mb-2 text-[#2E2E2E] tracking-wide">
          {product.name}
        </h3>

        {/* DESCRIÇÃO */}
        <p className="text-[#6B5E5E] text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.type && (
            <span className="text-xs bg-[#F1E8E2] text-[#5B2333] px-3 py-1 rounded-full">
              {product.type}
            </span>
          )}

          {product.gender && (
            <span className="text-xs bg-[#F1E8E2] text-[#5B2333] px-3 py-1 rounded-full">
              {product.gender}
            </span>
          )}

          {product.category && (
            <span className="text-xs bg-[#F1E8E2] text-[#5B2333] px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* PREÇO */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-2xl font-bold text-[#5B2333]">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        {/* BOTÃO / QUANTIDADE */}
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
