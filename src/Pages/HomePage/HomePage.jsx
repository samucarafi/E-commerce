import React, { useEffect } from "react";
import { useProduct } from "../../Contexts/Product/ProductContext";
import ProductCard from "../../Components/ProductCard/ProductCard";
import FiltersSidebar from "../../Components/FiltersSidebar/FiltersSidebar";
import Cart from "../../Components/Cart/Cart";
import logo from "/images/ROYAL.png";
import { useState } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = ({ searchTerm, setSearchTerm }) => {
  const { loading, filteredProducts, searchProducts, clearFilters } =
    useProduct();
  const { addToCart, clearCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();
  // conecta busca com contexto
  useEffect(() => {
    searchProducts(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (location.pathname === "/products") {
      const el = document.getElementById("products");

      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const coupon = params.get("coupon");
    const buy = params.get("buy");
    const productId = params.get("product");

    // 🚫 só roda se tiver cupom E user carregado
    if (coupon && user) {
      const couponUpper = coupon.toUpperCase();

      // 🚫 impedir usar próprio cupom
      if (user.affiliate?.couponCode === couponUpper) {
        console.log("Não pode usar próprio cupom");

        // remove se já tiver salvo
        localStorage.removeItem("affiliate_coupon");

        // limpa URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        return;
      }

      // ✅ salva normalmente
      localStorage.setItem("affiliate_coupon", couponUpper);

      // 🧹 limpa URL (evita reaplicar)
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (buy === "true" && productId) {
      localStorage.setItem("affiliate_buy_product", productId);
      localStorage.setItem("affiliate_checkout_intent", "true");
    }
  }, [user]); // 👈 IMPORTANTE

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
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-[#C6A75E] mx-auto"></div>
          <p className="mt-6 text-xl text-[#5B2333]">
            Preparando experiências olfativas exclusivas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E]">
      {/* HERO */}
      <section className="gradient-bg text-[#F5E6D3] py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-widest animate-fade-in">
            Essência & Luxo
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-[#E8D8C3] font-light max-w-2xl mx-auto">
            Descubra fragrâncias que despertam emoções e eternizam momentos
          </p>

          <button
            onClick={() =>
              document
                .getElementById("products")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="btn-gold px-10 py-4 rounded-full text-lg tracking-wide"
          >
            Explorar Coleção
          </button>
        </div>
      </section>

      {/* PRODUTOS */}
      <main className="container mx-auto px-4 py-12" id="products">
        {/* barra superior */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setFiltersOpen(true)}
            className="border border-[#C6A75E] px-5 py-2 rounded-full hover:bg-[#C6A75E] cursor-pointer"
          >
            Filtros
          </button>

          {searchTerm && (
            <p className="text-[#5B2333]">
              {filteredProducts.length} resultados para "{searchTerm}"
            </p>
          )}
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* vazio */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl mb-4">Nenhum produto encontrado</h3>

            <button
              onClick={() => {
                setSearchTerm("");
                clearFilters();
              }}
              className="btn-gold px-6 py-3 rounded-full"
            >
              Ver todos
            </button>
          </div>
        )}
      </main>

      {/* filtros */}
      <FiltersSidebar
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <Cart />

      {/* FOOTER */}
      <footer className="bg-[#1C1C1C] text-[#F5E6D3] py-8 mt-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="ROYAL"
              className="h-20 md:h-24 w-auto object-contain"
            />
          </div>

          <p className="text-[#D4A5A5] mb-8 font-light">
            Alta perfumaria para momentos inesquecíveis
          </p>

          <div className="w-24 h-px bg-[#C6A75E] mx-auto mb-6"></div>

          <div className="flex justify-center space-x-6 mb-6 text-sm">
            <a
              href="https://instagram.com/roya.lparfums"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C6A75E]"
            >
              Instagram
            </a>

            <a
              href="https://wa.me/5521989291846"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C6A75E]"
            >
              WhatsApp
            </a>
          </div>

          <p className="text-xs text-[#A38B6D] tracking-wide my-4">
            Desenvolvido por{" "}
            <a
              href="https://portfolio-indol-delta-osca4gno4i.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C6A75E] underline"
            >
              Samuel Rafino
            </a>
          </p>

          <p className="text-xs text-[#D4A5A5] tracking-wide">
            © 2026 ROYAL — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
