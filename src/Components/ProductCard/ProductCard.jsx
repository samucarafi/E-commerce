import React, { useState } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const IconShare = () => (
  <svg width="14" height="14" viewBox="0 -960 960 960" fill="currentColor">
    <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
  </svg>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [showQty, setShowQty] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (product.stock <= 0) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, qty);
    setShowQty(false);
    setQty(1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (!user?.affiliate?.couponCode) {
      alert("Cupom de afiliado não disponível");
      return;
    }
    const link = `${window.location.origin}/products?product=${product._id}&coupon=${user.affiliate.couponCode}&buy=true`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group bg-white rounded-2xl border border-[#F0E8E0] hover:border-[#DDD0C0] hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* ── Image ── */}
      <div className="relative bg-[#FAF7F4] aspect-square overflow-hidden">
        <img
          src={product.image || "/images/default-perfume.jpg"}
          alt={product.name}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewProduct && (
            <span className="bg-[#C6A75E] text-[#111] text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
              Novo
            </span>
          )}
          {isLowStock && (
            <span className="bg-[#5B2333]/90 text-[#F5E6D3] text-[9px] font-medium px-2.5 py-1 rounded-full">
              Últimas {product.stock}un
            </span>
          )}
        </div>

        {/* Share button (affiliate only) */}
        {user?.affiliate?.couponCode && (
          <button
            onClick={handleShare}
            className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-[#C6A75E]"
            }`}
            title="Copiar link de afiliado"
          >
            {copied ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <IconShare />
            )}
          </button>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] text-[#B0A090] uppercase tracking-[0.15em] mb-1">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h3 className="font-medium text-[#1C1C1C] text-sm leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.type && (
            <span className="text-[9px] bg-[#F5EFE8] text-[#8C6A4E] px-2 py-0.5 rounded-full">
              {product.type}
            </span>
          )}
          {product.gender && (
            <span className="text-[9px] bg-[#F5EFE8] text-[#8C6A4E] px-2 py-0.5 rounded-full">
              {product.gender}
            </span>
          )}
          {product.category && (
            <span className="text-[9px] bg-[#F5EFE8] text-[#8C6A4E] px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <p className="text-lg font-semibold text-[#5B2333] mb-3">
          R$ {product.price.toFixed(2)}
        </p>

        {/* CTA */}
        {showQty ? (
          <div onClick={(e) => e.stopPropagation()} className="space-y-2">
            <div className="flex items-center justify-center gap-3 bg-[#FAF7F4] rounded-full py-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(Math.max(1, qty - 1));
                }}
                className="w-8 h-8 flex items-center justify-center text-[#5B2333] hover:bg-[#F0E8E0] rounded-full transition-colors font-bold text-lg"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold">
                {qty}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(Math.min(product.stock, qty + 1));
                }}
                className="w-8 h-8 flex items-center justify-center text-[#5B2333] hover:bg-[#F0E8E0] rounded-full transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQty(false);
                  setQty(1);
                }}
                className="py-2 text-xs border border-[#DDD] rounded-full text-gray-500 hover:border-[#C6A75E] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToCart}
                className="py-2 text-xs bg-[#C6A75E] hover:bg-[#B8954D] text-[#111] rounded-full font-semibold transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQty(true);
            }}
            className={`w-full py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
              isAdded
                ? "bg-[#5B2333] text-[#F5E6D3]"
                : "bg-[#C6A75E] hover:bg-[#B8954D] text-[#111]"
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
