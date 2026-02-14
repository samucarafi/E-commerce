import React, { useEffect, useState } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Cart from "../../Components/Cart/Cart";
import { useProduct } from "../../Contexts/Product/ProductContext";
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600">
            Preparando experiências olfativas exclusivas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E]">
      <section className="gradient-bg text-[#F5E6D3] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in tracking-wide">
            Essência & Luxo
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-rose-200">
            Descubra fragrâncias que marcam presença e despertam emoções
          </p>
          <button
            onClick={() =>
              document
                .getElementById("products")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="btn-gold px-8 py-4 rounded-full text-lg"
          >
            Explorar Fragrâncias
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
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === ""
                  ? "btn-gold text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              }`}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.name
                    ? "btn-gold text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {searchTerm && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
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
              className="btn-gold text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Ver Todos os Produtos
            </button>
          </div>
        )}
      </main>

      <Cart />

      <footer className="bg-[#1C1C1C] text-[#F5E6D3] py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-3xl font-bold mb-4 text-[#C6A75E] tracking-wide">
            Maison Élégance
          </div>

          <p className="text-[#D4A5A5] mb-6">
            Perfumes exclusivos para momentos inesquecíveis
          </p>

          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="hover:text-[#C6A75E] transition-colors">
              Sobre
            </a>
            <a href="#" className="hover:text-[#C6A75E] transition-colors">
              Contato
            </a>
            <a href="#" className="hover:text-[#C6A75E] transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-[#C6A75E] transition-colors">
              Termos de Uso
            </a>
          </div>

          <p className="text-sm text-[#D4A5A5]">
            © 2026 Maison Élégance. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
