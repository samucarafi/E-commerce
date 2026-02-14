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
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600">
            Carregando produtos incríveis...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Bem-vindo à TechStore
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Os melhores produtos de tecnologia com os melhores preços
          </p>
          <button
            onClick={() =>
              document
                .getElementById("products")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Ver Produtos
          </button>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12" id="products">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Categorias</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === ""
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
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
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
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
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Ver Todos os Produtos
            </button>
          </div>
        )}
      </main>

      <Cart />

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            TechStore
          </div>
          <p className="text-gray-400 mb-6">
            Sua loja de tecnologia de confiança
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Sobre
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contato
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Termos de Uso
            </a>
          </div>
          <p className="text-gray-500">
            &copy; 2024 TechStore. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
