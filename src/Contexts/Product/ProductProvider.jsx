import { useEffect, useState } from "react";
import { ProductContext } from "./ProductContext";
import { apiServices } from "../../services/apiServices";
export const ProductProvider = ({ children }) => {
  // Estados principais
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados de filtros e busca
  const [selectedType, setSelectedType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [onlyNew, setOnlyNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("name"); // name, price, popularity
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Carregar produtos iniciais
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Aplicar filtros sempre que mudarem
  useEffect(() => {
    applyFilters();
  }, [
    products,
    searchTerm,
    selectedCategory,
    priceRange,
    sortBy,
    selectedType,
    selectedGender,
    onlyNew,
  ]);

  // Funções de carregamento
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiServices.getProducts();
      setProducts(response.data.products);

      // Simulação para desenvolvimento
      // const sampleProducts = [
      //   {
      //     _id: 1,
      //     name: "iPhone 14 Pro",
      //     price: 6999.99,
      //     description: "Smartphone Apple com câmera profissional de 48MP",
      //     emoji: "📱",
      //     stock: 15,
      //     category: "Smartphones",
      //     weight: 0.2,
      //     popularity: 95,
      //     tags: ["apple", "smartphone", "camera", "ios"],
      //   },
      //   {
      //     _id: 2,
      //     name: "MacBook Air M2",
      //     price: 8999.99,
      //     description: "Notebook Apple com chip M2 e tela Liquid Retina",
      //     emoji: "💻",
      //     stock: 8,
      //     category: "Notebooks",
      //     weight: 1.2,
      //     popularity: 88,
      //     tags: ["apple", "notebook", "macbook", "m2"],
      //   },
      //   {
      //     _id: 3,
      //     name: "AirPods Pro",
      //     price: 1899.99,
      //     description: "Fones de ouv_ido sem fio com cancelamento de ruído",
      //     emoji: "🎧",
      //     stock: 25,
      //     category: "Acessórios",
      //     weight: 0.1,
      //     popularity: 92,
      //     tags: ["apple", "fones", "wireless", "noise-cancelling"],
      //   },
      //   {
      //     _id: 4,
      //     name: "iPad Air",
      //     price: 4299.99,
      //     description: "Tablet Apple com tela de 10.9 polegadas e chip M1",
      //     emoji: "📱",
      //     stock: 12,
      //     category: "Tablets",
      //     weight: 0.5,
      //     popularity: 85,
      //     tags: ["apple", "tablet", "ipad", "m1"],
      //   },
      //   {
      //     _id: 5,
      //     name: "Apple Watch Series 8",
      //     price: 3299.99,
      //     description: "Smartwatch com monitoramento avançado de saúde",
      //     emoji: "⌚",
      //     stock: 20,
      //     category: "Wearables",
      //     weight: 0.05,
      //     popularity: 90,
      //     tags: ["apple", "watch", "smartwatch", "saude"],
      //   },
      //   {
      //     _id: 6,
      //     name: "Samsung Galaxy S23",
      //     price: 5499.99,
      //     description: "Smartphone Samsung com câmera de 200MP",
      //     emoji: "📱",
      //     stock: 18,
      //     category: "Smartphones",
      //     weight: 0.18,
      //     popularity: 87,
      //     tags: ["samsung", "smartphone", "android", "camera"],
      //   },
      // ];

      // setProducts(sampleProducts);
    } catch (error) {
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // Em produção, usar API real
      // const response = await categoryService.getAll();
      // setCategories(response.data);

      // Simulação para desenvolvimento
      const sampleCategories = [
        { id: 1, name: "Floral", count: 0 },
        { id: 2, name: "Amadeirado", count: 0 },
        { id: 3, name: "Oriental", count: 0 },
        { id: 4, name: "Cítrico", count: 0 },
        { id: 5, name: "Aromático", count: 0 },
        { id: 6, name: "Gourmand", count: 0 },
      ];

      setCategories(sampleCategories);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  // Função de filtros
  const applyFilters = () => {
    let filtered = [...products];

    // categoria olfativa
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // tipo
    if (selectedType) {
      filtered = filtered.filter((product) => product.type === selectedType);
    }

    // gênero
    if (selectedGender) {
      filtered = filtered.filter(
        (product) => product.gender === selectedGender,
      );
    }

    // lançamentos
    if (onlyNew) {
      filtered = filtered.filter((product) => product.isNewProduct);
    }

    // busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower),
      );
    }

    // preço
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max,
    );

    // ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;

        case "price-desc":
          return b.price - a.price;

        case "popularity":
          return b.popularity - a.popularity;

        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  // Funções de busca e filtros
  const searchProducts = (term) => {
    setSearchTerm(term);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
  };

  const setPriceFilter = (min, max) => {
    setPriceRange({ min, max });
  };

  const setSortFilter = (sort) => {
    setSortBy(sort);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedType("");
    setSelectedGender("");
    setOnlyNew(false);
    setPriceRange({ min: 0, max: 10000 });
    setSortBy("name");
  };

  // Funções de produto individual
  const getProductById = (id) => {
    return products.find((product) => product._id === id);
  };

  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category);
  };

  const getFeaturedProducts = () => {
    return products.filter((product) => product.popularity >= 90).slice(0, 4);
  };

  const getRelatedProducts = (productId, limit = 4) => {
    const product = getProductById(productId);
    if (!product) return [];

    return products
      .filter((p) => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  };

  // Funções administrativas (para admin)
  const addProduct = async (productData) => {
    try {
      setLoading(true);

      const { data } = await apiServices.createProduct(productData);

      // Simulação para desenvolvimento
      // const newProduct = {
      //   ...productData,
      //   id: Date.now(),
      //   popularity: 0,
      // };

      setProducts((prev) => [...prev, data.newProduct]);
      return { success: true, newProduct: data.newProduct };
    } catch (error) {
      setError("Erro ao adicionar produto");
      return { success: false, error: error.response.data.error };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);

      // Em produção, usar API real
      const response = await apiServices.updateProduct(id, productData);
      const updatedProduct = response.data.product;
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? updatedProduct : product)),
      );
      // // Simulação para desenvolvimento
      // const updatedProduct = { ...productData, id };

      //

      return { success: true, product: updatedProduct };
    } catch (error) {
      setError("Erro ao atualizar produto");
      return { success: false, error: error.response.data.error };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);

      await apiServices.deleteProduct(id);

      setProducts((prev) => prev.filter((product) => product._id !== id));
      return { success: true };
    } catch (error) {
      setError("Erro ao excluir produto");
      return { success: false, error: error.response.data.error };
    } finally {
      setLoading(false);
    }
  };

  // Estatísticas
  const getStats = () => {
    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      averagePrice:
        products.reduce((sum, p) => sum + p.price, 0) / products.length,
      lowStockProducts: products.filter((p) => p.stock < 10).length,
      outOfStockProducts: products.filter((p) => p.stock === 0).length,
    };
  };

  const value = {
    // Estados
    products,
    categories,
    loading,
    error,
    searchTerm,
    selectedCategory,
    priceRange,
    sortBy,
    filteredProducts,

    // Funções de busca e filtros
    searchProducts,
    filterByCategory,
    setPriceFilter,
    setSortFilter,
    clearFilters,
    selectedType,
    selectedGender,
    onlyNew,
    setSelectedType,
    setSelectedGender,
    setOnlyNew,

    // Funções de produto
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getRelatedProducts,

    // Funções administrativas
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,

    // Utilitários
    loadProducts,
    loadCategories,
    getStats,
    setError,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
