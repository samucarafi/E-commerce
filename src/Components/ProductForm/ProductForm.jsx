import React, { useEffect, useState } from "react";
import { useProduct } from "../../Contexts/Product/ProductContext";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addProduct, updateProduct } = useProduct();

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

  const isOpen = true;

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
    }
  }, [product]);

  const handleClose = () => {
    navigate("/admin/products");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

      handleClose();
    } catch (err) {
      setError(err?.response?.data?.error || "Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-[#E8D8C3] overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto"
      >
        {/* HEADER */}
        <div className="bg-[#5B2333] text-[#F5E6D3] px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-wide">
              {product ? "Editar Produto" : "Novo Produto"}
            </h2>
            <p className="text-[#D4A5A5] text-sm mt-1">
              {product
                ? "Atualize as informações do produto"
                : "Cadastre um novo produto no sistema"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-3xl hover:text-[#C6A75E] transition-all"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-[#5B2333] font-medium">
                Nome do Produto
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#5B2333] font-medium">
                Link da Imagem
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#5B2333] font-medium">
              Descrição
            </label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full mt-2 px-4 py-3 rounded-2xl border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none resize-none"
            />
          </div>

          {/* PREÇO / ESTOQUE / PESO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-[#5B2333] font-medium">
                Preço (R$)
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
                className="w-full mt-2 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#5B2333] font-medium">
                Estoque
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#5B2333] font-medium">
                Peso (kg)
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
                className="w-full mt-2 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
              />
            </div>
          </div>

          {/* CATEGORIA */}
          <div>
            <label className="text-sm text-[#5B2333] font-medium">
              Categoria
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full mt-2 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
            >
              <option value="">Selecione</option>
              <option value="Floral">Floral</option>
              <option value="Amadeirado">Amadeirado</option>
              <option value="Oriental">Oriental</option>
              <option value="Cítrico">Cítrico</option>
              <option value="Aromático">Aromático</option>
              <option value="Gourmand">Gourmand</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-[#E8D8C3]">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 rounded-full border border-[#D4A5A5] text-[#5B2333] hover:bg-[#F1E8E2] transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full bg-[#5B2333] hover:bg-[#4a1c29] text-[#F5E6D3] transition-all disabled:opacity-50"
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
