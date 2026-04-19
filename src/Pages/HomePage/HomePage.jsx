import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "../../Contexts/Product/ProductContext";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Cart from "../../Components/Cart/Cart";
import logo from "/images/ROYAL.png";
import { useCart } from "../../Contexts/Cart/CartContext";
import { useAuth } from "../../Contexts/Auth/AuthContext";

/* ─── Carousel for new/featured products ─── */
const NewProductsCarousel = ({ products }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const count = products.length;

  const goTo = (i) => {
    setFade(false);
    setTimeout(() => {
      setIndex(i);
      setFade(true);
    }, 220);
  };

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => goTo((prev) => (prev + 1) % count), 5000);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;
  const product = products[index];

  return (
    <section className="bg-[#171717] py-14 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[#C6A75E] text-[10px] tracking-[0.3em] uppercase mb-1">
              Em Destaque
            </p>
            <h2 className="text-xl font-light text-[#F5E6D3] tracking-wide">
              Lançamentos
            </h2>
          </div>
          {count > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo((index - 1 + count) % count)}
                className="w-8 h-8 rounded-full border border-[#333] text-[#F5E6D3] hover:border-[#C6A75E] hover:text-[#C6A75E] flex items-center justify-center transition-all text-lg leading-none"
              >
                ‹
              </button>
              <button
                onClick={() => goTo((index + 1) % count)}
                className="w-8 h-8 rounded-full border border-[#333] text-[#F5E6D3] hover:border-[#C6A75E] hover:text-[#C6A75E] flex items-center justify-center transition-all text-lg leading-none"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Slide */}
        <div
          className="grid md:grid-cols-2 gap-10 items-center"
          style={{ opacity: fade ? 1 : 0, transition: "opacity 0.22s ease" }}
        >
          {/* Image */}
          <Link to={`/product/${product._id}`} className="block">
            <div className="bg-[#1E1E1E] rounded-3xl aspect-square max-w-[420px] mx-auto md:mx-0 overflow-hidden group">
              <img
                src={product.image || "/images/default-perfume.jpg"}
                alt={product.name}
                className="w-full h-full object-contain p-10 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>

          {/* Content */}
          <div className="text-center md:text-left">
            <span className="inline-block bg-[#C6A75E] text-[#111] text-[10px] font-bold px-3 py-1 rounded-full tracking-[0.15em] uppercase mb-5">
              Novo
            </span>
            <p className="text-[#888] text-sm mb-2 tracking-wide">
              {product.brand}
            </p>
            <h3 className="text-3xl md:text-4xl font-light text-[#F5E6D3] mb-4 leading-tight">
              {product.name}
            </h3>
            <p className="text-[#999] font-light leading-relaxed mb-6 max-w-sm mx-auto md:mx-0 line-clamp-3">
              {product.description}
            </p>
            <p className="text-2xl font-light text-[#C6A75E] mb-8">
              R$ {product.price?.toFixed(2)}
            </p>
            <Link
              to={`/product/${product._id}`}
              className="inline-block bg-[#C6A75E] text-[#111] px-9 py-3.5 rounded-full text-sm font-semibold hover:bg-[#B8954D] transition-all tracking-wide"
            >
              Ver Produto
            </Link>
          </div>
        </div>

        {/* Dots */}
        {count > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === index
                    ? "w-7 h-1.5 bg-[#C6A75E]"
                    : "w-1.5 h-1.5 bg-[#333]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ─── Skeleton loader for product grid ─── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
    <div className="bg-gray-200 aspect-square" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
    </div>
  </div>
);

/* ─── Main HomePage ─── */
const HomePage = () => {
  const { loading, filteredProducts, products, clearFilters, searchTerm } =
    useProduct();
  const { addToCart, clearCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const newProducts = products.filter((p) => p.isNewProduct);

  // Page fade-in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Scroll to products on /products route
  useEffect(() => {
    if (location.pathname === "/products") {
      const el = document.getElementById("products");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 120);
    }
  }, [location]);

  // Affiliate coupon
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const coupon = params.get("coupon");
    const buy = params.get("buy");
    const productId = params.get("product");

    if (coupon && user) {
      const code = coupon.toUpperCase();
      if (user.affiliate?.couponCode === code) {
        localStorage.removeItem("affiliate_coupon");
      } else {
        localStorage.setItem("affiliate_coupon", code);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (buy === "true" && productId) {
      localStorage.setItem("affiliate_buy_product", productId);
      localStorage.setItem("affiliate_checkout_intent", "true");
    }
  }, [user]);

  useEffect(() => {
    const storedProduct = localStorage.getItem("affiliate_buy_product");
    if (storedProduct && filteredProducts.length > 0) {
      const product = filteredProducts.find((p) => p._id === storedProduct);
      if (product) {
        clearCart();
        addToCart(product, 1);
        localStorage.removeItem("affiliate_buy_product");
        navigate("/checkout");
      }
    }
  }, [filteredProducts]);

  return (
    <div
      className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.45s ease" }}
    >
      {/* ── HERO ── */}
      <section className="gradient-bg text-[#F5E6D3] py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />
        {/* Decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/3 rounded-full pointer-events-none" />

        <div className="relative max-w-[1400px] mx-auto px-6 text-center">
          <p className="text-[#C6A75E] text-[10px] tracking-[0.35em] uppercase mb-5 font-light">
            Alta Perfumaria
          </p>
          <h1 className="text-4xl md:text-6xl font-extralight mb-6 tracking-[0.12em]">
            Essência <span className="text-[#C6A75E]">&</span> Luxo
          </h1>
          <p className="text-base md:text-lg mb-10 text-[#E8D8C3]/70 font-light max-w-xl mx-auto leading-loose">
            Fragrâncias exclusivas das melhores maisons de perfumaria do mundo.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-gold px-10 py-3.5 rounded-full text-sm tracking-[0.18em] uppercase"
          >
            Explorar Coleção
          </button>
        </div>
      </section>

      {/* ── NEW PRODUCTS CAROUSEL ── */}
      {!loading && newProducts.length > 0 && (
        <NewProductsCarousel products={newProducts} />
      )}

      {/* ── PRODUCT GRID ── */}
      <main className="max-w-[1400px] mx-auto px-6 py-14" id="products">
        {/* Heading */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#C6A75E] text-[10px] tracking-[0.28em] uppercase mb-1">
              Catálogo
            </p>
            <h2 className="text-xl font-light text-[#2E2E2E] tracking-wide">
              {searchTerm
                ? `Resultados para "${searchTerm}"`
                : "Nossas Fragrâncias"}
            </h2>
          </div>
          {!loading && (
            <p className="text-xs text-gray-400 tracking-wide">
              {filteredProducts.length} produto
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-7">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-28">
            <div className="text-5xl mb-5">✦</div>
            <h3 className="text-lg font-light mb-2 text-[#2E2E2E] tracking-wide">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-400 text-sm mb-8 font-light">
              Tente ajustar os filtros ou a busca
            </p>
            <button
              onClick={clearFilters}
              className="btn-gold px-8 py-3 rounded-full text-sm tracking-wide"
            >
              Ver todos
            </button>
          </div>
        )}
      </main>

      <Cart />

      {/* ── FOOTER ── */}
      <footer className="bg-[#111] text-[#F5E6D3] py-14 mt-10">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <div className="flex justify-center mb-7">
            <img
              src={logo}
              alt="ROYAL"
              className="h-20 w-auto object-contain opacity-90"
            />
          </div>
          <p className="text-[#888] mb-8 font-light text-sm tracking-[0.12em]">
            Alta perfumaria para momentos inesquecíveis
          </p>
          <div className="w-12 h-px bg-[#C6A75E] mx-auto mb-8" />
          <div className="flex justify-center gap-10 mb-8 text-xs tracking-[0.12em] uppercase">
            <a
              href="https://instagram.com/roya.lparfums"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#C6A75E] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/5521989291846"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#C6A75E] transition-colors"
            >
              WhatsApp
            </a>
          </div>
          <p className="text-[10px] text-[#555] tracking-wide mb-2">
            Desenvolvido por{" "}
            <a
              href="https://portfolio-indol-delta-osca4gno4i.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C6A75E] underline transition-colors"
            >
              Samuel Rafino
            </a>
          </p>
          <p className="text-[10px] text-[#444] tracking-wide">
            © 2026 ROYAL — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
