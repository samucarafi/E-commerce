import React, { useEffect, useState } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Cart from "../../Components/Cart/Cart";
import { useProduct } from "../../Contexts/Product/ProductContext";
import logo from "/images/ROYAL.png";
const HomePage = ({ searchTerm, setSearchTerm }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { products, categories, loading } = useProduct();

  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-32 w-32 border-b-4 border-[#C6A75E]
 mx-auto"
          ></div>
          <p
            className="mt-6 text-xl text-[#5B2333]
"
          >
            Preparando experiências olfativas exclusivas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E]">
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

      <main className="container mx-auto px-4 py-12" id="products">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Famílias Olfativas
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-6 py-2 rounded-full text-sm tracking-wide border transition-all duration-300 ${
                selectedCategory === ""
                  ? "bg-[#5B2333] text-[#F5E6D3] border-[#5B2333]"
                  : "border-[#D4A5A5] text-[#5B2333] hover:bg-[#5B2333] hover:text-[#F5E6D3]"
              }`}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-2 rounded-full text-sm tracking-wide border transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-[#5B2333] text-[#F5E6D3] border-[#5B2333]"
                    : "border-[#D4A5A5] text-[#5B2333] hover:bg-[#5B2333] hover:text-[#F5E6D3]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {searchTerm && (
          <div className="mb-8 p-4 bg-[#F1E8E2] rounded-lg">
            <p className="text-[#5B2333]">
              <strong>{filteredProducts.length}</strong> produtos encontrados
              para:
              <strong> "{searchTerm}"</strong>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhuma fragrância encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Experimente explorar outras essências ou famílias olfativas
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="btn-gold px-6 py-3 rounded-full tracking-wide"
            >
              Ver Todos os Produtos
            </button>
          </div>
        )}
      </main>

      <Cart />

      <footer className="bg-[#1C1C1C] text-[#F5E6D3] py-16 mt-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="ROYAL"
              className=" h-20 md:h-24 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            />
          </div>

          <p className="text-[#D4A5A5] mb-8 font-light">
            Alta perfumaria para momentos inesquecíveis
          </p>

          <div className="flex justify-center space-x-8 mb-8 text-sm uppercase tracking-wider">
            <a href="#" className="hover:text-[#C6A75E] transition-all">
              Sobre
            </a>
            <a href="#" className="hover:text-[#C6A75E] transition-all">
              Contato
            </a>
            <a href="#" className="hover:text-[#C6A75E] transition-all">
              Privacidade
            </a>
            <a href="#" className="hover:text-[#C6A75E] transition-all">
              Termos
            </a>
          </div>

          <div className="w-24 h-px bg-[#C6A75E] mx-auto mb-6"></div>

          <p className="text-xs text-[#D4A5A5] tracking-wide">
            © 2026 ROYAL — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
