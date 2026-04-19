import React, { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";

const inputCls =
  "w-full border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] placeholder:text-gray-300 focus:outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E]/30 transition-colors bg-white disabled:bg-[#FAF7F4] disabled:text-gray-400 disabled:cursor-not-allowed";

const UserForm = () => {
  const { editingUser, setEditingUser, updateUser } = useAuth();

  const [form, setForm] = useState({ role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingUser) setForm({ role: editingUser.role || "" });
  }, [editingUser]);

  if (!editingUser) return null;

  const handleClose = () => {
    setEditingUser(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await updateUser(editingUser._id, form);
    setLoading(false);
    if (result?.success) {
      handleClose();
    } else {
      setError(result?.error || "Erro ao atualizar usuário.");
    }
  };

  const joined = new Date(editingUser.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#EEE8E0] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#5B2333] px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-[#F5E6D3] text-sm tracking-wide">
              Editar Usuário
            </h2>
            <p className="text-[#D4A5A5] text-xs mt-0.5">
              Altere a função de acesso
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-[#D4A5A5] hover:text-[#F5E6D3] text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Avatar + info */}
          <div className="flex items-center gap-4 bg-[#FAF7F4] rounded-2xl p-4">
            <div className="w-12 h-12 rounded-full bg-[#5B2333]/10 flex items-center justify-center text-[#5B2333] text-lg font-semibold flex-shrink-0">
              {editingUser.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-[#1C1C1C] text-sm truncate">
                {editingUser.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {editingUser.email}
              </p>
              <p className="text-[10px] text-gray-300 mt-0.5">Desde {joined}</p>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">
              Função de acesso <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={inputCls}
            >
              <option value="">Selecione</option>
              <option value="admin">Administrador</option>
              <option value="user">Cliente</option>
            </select>
          </div>

          {/* Info note */}
          {form.role === "admin" && (
            <div className="flex gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2.5 rounded-xl">
              <span>⚠️</span>
              <p>Este usuário terá acesso total ao painel administrativo.</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="border border-[#E8DDD0] text-gray-500 hover:border-[#5B2333] hover:text-[#5B2333] px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !form.role}
              className="bg-[#5B2333] hover:bg-[#4a1c29] disabled:opacity-50 text-[#F5E6D3] px-6 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando…
                </>
              ) : (
                "Atualizar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
