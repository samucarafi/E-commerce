import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../Contexts/Product/ProductContext";

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] placeholder:text-gray-300 focus:outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E]/30 transition-colors bg-white";

const Select = ({ value, onChange, children, required }) => (
  <select
    required={required}
    value={value}
    onChange={onChange}
    className={inputCls}
  >
    {children}
  </select>
);

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addProduct, updateProduct } = useProduct();

  const product = getProductById(id);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    category: "",
    weight: "",
    type: "",
    gender: "",
    brand: "",
    isNewProduct: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        image: product.image || "",
        stock: product.stock || "",
        category: product.category || "",
        weight: product.weight || "",
        type: product.type || "",
        gender: product.gender || "",
        brand: product.brand || "",
        isNewProduct: product.isNewProduct || false,
      });
    }
  }, [product]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleClose = () => {
    navigate("/admin/products");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      weight: parseFloat(form.weight),
    };

    const result = id
      ? await updateProduct(id, payload)
      : await addProduct({ ...payload, popularity: 0 });

    setLoading(false);

    if (result.success) {
      handleClose();
    } else {
      setError(result.error || "Erro ao salvar produto.");
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-[#EEE8E0] overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Modal header */}
        <div className="bg-[#5B2333] px-7 py-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="font-semibold text-[#F5E6D3] tracking-wide">
              {product ? "Editar Produto" : "Novo Produto"}
            </h2>
            <p className="text-[#D4A5A5] text-xs mt-0.5">
              {product
                ? "Atualize as informações"
                : "Preencha os dados do novo produto"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-[#D4A5A5] hover:text-[#F5E6D3] text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 p-7 space-y-5"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Image preview */}
          {form.image && (
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-2xl bg-[#FAF7F4] border border-[#EEE8E0] overflow-hidden">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nome do produto" required>
              <input
                required
                value={form.name}
                onChange={set("name")}
                placeholder="Ex: Bleu de Chanel"
                className={inputCls}
              />
            </Field>
            <Field label="Marca">
              <input
                value={form.brand}
                onChange={set("brand")}
                placeholder="Ex: Chanel"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Link da imagem" required>
            <input
              required
              type="url"
              value={form.image}
              onChange={set("image")}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>

          <Field label="Descrição" required>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={set("description")}
              placeholder="Descreva o produto, notas olfativas, etc."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Preço (R$)" required>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={set("price")}
                placeholder="0.00"
                className={inputCls}
              />
            </Field>
            <Field label="Estoque" required>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={set("stock")}
                placeholder="0"
                className={inputCls}
              />
            </Field>
            <Field label="Peso (kg)" required>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.weight}
                onChange={set("weight")}
                placeholder="0.00"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Categoria" required>
              <Select required value={form.category} onChange={set("category")}>
                <option value="">Selecione</option>
                {[
                  "Floral",
                  "Frutado",
                  "Amadeirado",
                  "Oriental",
                  "Cítrico",
                  "Aromático",
                  "Gourmand",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tipo">
              <Select value={form.type} onChange={set("type")}>
                <option value="">Selecione</option>
                <option value="Perfume">Perfume</option>
                <option value="Decante">Decante</option>
              </Select>
            </Field>
            <Field label="Gênero">
              <Select value={form.gender} onChange={set("gender")}>
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Unissex">Unissex</option>
              </Select>
            </Field>
          </div>

          {/* Launch toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() =>
                setForm((p) => ({ ...p, isNewProduct: !p.isNewProduct }))
              }
              className={`w-10 h-5 rounded-full transition-colors relative ${form.isNewProduct ? "bg-[#C6A75E]" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isNewProduct ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-sm text-[#1C1C1C] font-medium">
              Marcar como lançamento
            </span>
            {form.isNewProduct && (
              <span className="text-[10px] bg-[#C6A75E]/15 text-[#C6A75E] px-2 py-0.5 rounded-full font-semibold">
                Novo
              </span>
            )}
          </label>
        </form>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 px-7 py-5 border-t border-[#F0E8E0] flex-shrink-0 bg-white">
          <button
            type="button"
            onClick={handleClose}
            className="border border-[#E8DDD0] text-gray-500 hover:border-[#5B2333] hover:text-[#5B2333] px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#5B2333] hover:bg-[#4a1c29] disabled:opacity-50 text-[#F5E6D3] px-7 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando…
              </>
            ) : product ? (
              "Atualizar Produto"
            ) : (
              "Criar Produto"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
