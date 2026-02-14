import { useEffect } from "react";
import { useState } from "react";
import { useProduct } from "../../Contexts/Product/ProductContext";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addProduct, updateProduct } = useProduct();

  const handleClose = () => {
    navigate("..");
  };
  const product = getProductById(id);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    category: "",
    weight: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        image: product.image || "",
        stock: product.stock || "",
        category: product.category || "",
        weight: product.weight || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        image: "",
        stock: "",
        category: "",
        weight: "",
      });
    }
  }, [product]);

  const handleSubmit = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        weight: parseFloat(formData.weight),
      };

      if (id) {
        await updateProduct(id, productData);
      } else {
        await addProduct({ ...productData, popularity: 0 });
      }

      navigate("..");
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erro ao salvar produto");
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/50  z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {product ? "Editar Produto" : "Novo Produto"}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 text-3xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: iPhone 14 Pro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link da Imagem *
              </label>
              <input
                type="url"
                required
                value={formData.image || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição detalhada do produto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estoque *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Floral">Floral</option>
              <option value="Amadeirado">Amadeirado</option>
              <option value="Oriental">Oriental</option>
              <option value="Cítrico">Cítrico</option>
              <option value="Aromático">Aromático</option>
              <option value="Gourmand">Gourmand</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading
                ? "Salvando..."
                : product
                  ? "Atualizar"
                  : "Criar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
