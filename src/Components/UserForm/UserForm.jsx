import React, { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";

const UserForm = () => {
  const { editingUser, setEditingUser, updateUser } = useAuth();

  const [formData, setFormData] = useState({ role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOpen = !!editingUser;

  useEffect(() => {
    if (editingUser) {
      setFormData({ role: editingUser.role || "" });
    }
  }, [editingUser]);

  const handleClose = () => {
    setEditingUser(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await updateUser(editingUser._id, formData);

      if (result?.success) {
        handleClose();
      } else {
        setError(result?.error || "Erro ao atualizar usuário.");
      }
    } catch (err) {
      setError(err.message || "Erro ao atualizar usuário.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formattedDate = new Date(editingUser.createdAt).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "2-digit", year: "numeric" },
  );

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-[#E8D8C3] overflow-hidden animate-fade-in"
      >
        {/* HEADER */}
        <div className="bg-[#5B2333] text-[#F5E6D3] px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-wide">
              Editar Usuário
            </h2>
            <p className="text-[#D4A5A5] text-sm mt-1">
              Atualize permissões do cliente
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

          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#5B2333] font-medium">Nome</label>
              <input
                type="text"
                value={editingUser.name}
                disabled
                className="w-full mt-2 px-4 py-3 rounded-full border border-[#E8D8C3] bg-[#F8F5F2] text-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-[#5B2333] font-medium">
                Email
              </label>
              <input
                type="email"
                value={editingUser.email}
                disabled
                className="w-full mt-2 px-4 py-3 rounded-full border border-[#E8D8C3] bg-[#F8F5F2] text-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-[#5B2333] font-medium">
                Data de Cadastro
              </label>
              <input
                type="text"
                value={formattedDate}
                disabled
                className="w-full mt-2 px-4 py-3 rounded-full border border-[#E8D8C3] bg-[#F8F5F2] text-gray-500"
              />
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-[#5B2333] font-medium">Função</label>
            <select
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full mt-2 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
            >
              <option value="">Selecione</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuário</option>
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
              {loading ? "Salvando..." : "Atualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
