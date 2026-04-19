import { useParams, Link } from "react-router-dom";
import { useProduct } from "../../Contexts/Product/ProductContext";
import { useEffect, useState } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";
import Cart from "../../Components/Cart/Cart";
import ProductCard from "../../Components/ProductCard/ProductCard";

/* ─── Info badge ─── */
const InfoTile = ({ label, value }) => (
  <div className="bg-[#F1E8E2] rounded-2xl p-4 text-center">
    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="font-medium text-[#2E2E2E] text-sm">{value}</p>
  </div>
);

/* ─── Main component ─── */
const ProductDetails = () => {
  const { id } = useParams();
  const { products, filteredProducts } = useProduct();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [visible, setVisible] = useState(false);

  // Find product from full list first (avoids losing it when filters are active)
  useEffect(() => {
    const found =
      products.find((p) => p._id === id) ||
      filteredProducts.find((p) => p._id === id);
    setProduct(found || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Trigger fade-in
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, [id, products, filteredProducts]);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setIsAdded(false);
  }, [id]);

  const similarProducts = product
    ? (products.length ? products : filteredProducts)
        .filter(
          (p) =>
            p._id !== id &&
            (p.category === product.category || p.brand === product.brand),
        )
        .slice(0, 4)
    : [];

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsCartOpen(true);
    }, 1200);
  };

  /* ── Loading state ── */
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C6A75E]/20 border-t-[#C6A75E] rounded-full animate-spin mx-auto mb-5" />
          <p className="text-gray-400 font-light text-sm tracking-wide">
            Carregando produto...
          </p>
        </div>
      </div>
    );
  }

  const inStock = Number(product.stock) > 0;
  const maxQty = Number(product.stock) || 1;

  return (
    <div
      className="min-h-screen bg-[#F8F5F2]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.45s ease" }}
    >
      {/* ── Breadcrumb ── */}
      <div className="max-w-[1400px] mx-auto px-6 pt-8 pb-2">
        <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-wide">
          <Link to="/" className="hover:text-[#C6A75E] transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link
            to="/products"
            className="hover:text-[#C6A75E] transition-colors"
          >
            Fragrâncias
          </Link>
          <span>›</span>
          <span className="text-[#2E2E2E] truncate max-w-[160px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* ── Main section ── */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* ── LEFT: Image + badges ── */}
          <div className="space-y-5">
            <div className="bg-[#F1E8E2] rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative group">
              <img
                src={product.image || "/images/default-perfume.jpg"}
                alt={product.name}
                className="w-full h-full object-contain p-10 group-hover:scale-105 transition-transform duration-500"
              />
              {product.isNewProduct && (
                <span className="absolute top-5 left-5 bg-[#C6A75E] text-[#111] text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                  Novo
                </span>
              )}
              {!inStock && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-3xl">
                  <span className="bg-black/70 text-white text-xs px-4 py-2 rounded-full tracking-wide">
                    Indisponível
                  </span>
                </div>
              )}
            </div>

            {/* Tag badges */}
            <div className="flex flex-wrap gap-2">
              {product.gender && (
                <span className="border border-[#E0D0C0] text-gray-500 text-xs px-3.5 py-1 rounded-full">
                  {product.gender}
                </span>
              )}
              {product.type && (
                <span className="border border-[#E0D0C0] text-gray-500 text-xs px-3.5 py-1 rounded-full">
                  {product.type}
                </span>
              )}
              {product.category && (
                <span className="border border-[#E0D0C0] text-gray-500 text-xs px-3.5 py-1 rounded-full">
                  {product.category}
                </span>
              )}
            </div>
          </div>

          {/* ── RIGHT: Info + CTA ── */}
          <div className="flex flex-col">
            {/* Brand */}
            <p className="text-[#C6A75E] text-xs tracking-[0.22em] uppercase mb-3">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-light text-[#1C1C1C] mb-5 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-7">
              <span className="text-3xl font-light text-[#5B2333]">
                R$ {product.price?.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 font-light leading-relaxed mb-8 whitespace-pre-line text-sm">
              {product.description}
            </p>

            <div className="w-full h-px bg-[#EAD9C9] mb-8" />

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-7">
              <span
                className={`w-2 h-2 rounded-full ${inStock ? "bg-emerald-400" : "bg-red-400"}`}
              />
              <span className="text-xs text-gray-400 tracking-wide">
                {inStock
                  ? `${product.stock} unidade${product.stock !== 1 ? "s" : ""} disponível${product.stock !== 1 ? "is" : ""}`
                  : "Indisponível no momento"}
              </span>
            </div>

            {/* Quantity selector */}
            {inStock && (
              <div className="mb-7">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-3">
                  Quantidade
                </p>
                <div className="inline-flex items-center border border-[#E8D8C3] rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#5B2333] hover:bg-[#F1E8E2] transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-[#2E2E2E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#5B2333] hover:bg-[#F1E8E2] transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full py-4 rounded-full font-medium tracking-[0.1em] text-sm transition-all duration-300 cursor-pointer ${
                isAdded
                  ? "bg-[#5B2333] text-[#F5E6D3]"
                  : !inStock
                    ? "bg-[#EEE] text-gray-400 cursor-not-allowed"
                    : "bg-[#C6A75E] hover:bg-[#B8954D] text-[#1C1C1C]"
              }`}
            >
              {isAdded
                ? "✓ Adicionado à Sacola"
                : !inStock
                  ? "Indisponível"
                  : "Adicionar à Sacola"}
            </button>

            {/* Extra info tiles */}
            {(product.volume || product.concentration) && (
              <div className="mt-8 grid grid-cols-2 gap-3">
                {product.volume && (
                  <InfoTile label="Volume" value={`${product.volume}ml`} />
                )}
                {product.concentration && (
                  <InfoTile
                    label="Concentração"
                    value={product.concentration}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Similar Products ── */}
      {similarProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 pb-16">
          <div className="border-t border-[#E8D8C3] pt-14">
            <div className="mb-8">
              <p className="text-[#C6A75E] text-[10px] tracking-[0.28em] uppercase mb-1">
                Você também pode gostar
              </p>
              <h2 className="text-xl font-light text-[#2E2E2E] tracking-wide">
                Produtos Similares
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Cart />
    </div>
  );
};

export default ProductDetails;
