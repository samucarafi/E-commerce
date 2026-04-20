import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/Auth/AuthContext";
import { cpfUtils } from "../../Utils/cpfUtils";
import { apiServices } from "../../services/apiServices";

/* ─── Field wrapper ─── */
const FieldRow = ({
  label,
  displayValue,
  onEdit,
  children,
  editing,
  onCancel,
  onSave,
  saving,
}) => (
  <div className="py-5 border-b border-[#F0E8E0] last:border-0">
    <div className="flex items-center justify-between mb-1">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
        {label}
      </p>
      {!editing && (
        <button
          onClick={onEdit}
          className="text-xs text-[#5B2333] hover:text-[#C6A75E] transition-colors font-medium"
        >
          Editar
        </button>
      )}
    </div>

    {editing ? (
      <div className="mt-3 space-y-3">
        {children}
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="bg-[#5B2333] hover:bg-[#4a1c29] disabled:opacity-50 text-[#F5E6D3] px-5 py-2 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            {saving ? (
              <>
                <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                Salvando…
              </>
            ) : (
              "Salvar"
            )}
          </button>
          <button
            onClick={onCancel}
            className="border border-[#E8DDD0] text-gray-500 hover:border-[#5B2333] hover:text-[#5B2333] px-5 py-2 rounded-full text-xs transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    ) : (
      <p className="text-sm text-[#1C1C1C] font-medium mt-0.5">
        {displayValue || "Não informado"}
      </p>
    )}
  </div>
);

const inputCls =
  "w-full border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] placeholder:text-gray-300 focus:outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E]/30 transition-colors bg-white";

/* ─── ProfilePage ─── */
const ProfilePage = () => {
  const { user, setUser, updateProfile } = useContext(AuthContext);

  const [editField, setEditField] = useState(null);
  const [savingField, setSavingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [cpfError, setCpfError] = useState("");
  const [pwdData, setPwdData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        cpf: "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      });
    }
  }, [user]);

  if (!user) return null;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("pt-BR") : "Não informado";

  const startEdit = (field) => {
    setEditField(field);
    setCpfError("");
    setPwdError("");
    setPwdSuccess("");
  };
  const cancelEdit = () => {
    setEditField(null);
    setCpfError("");
    setFormData((p) => ({ ...p, cpf: "" }));
  };

  const handleSave = async (field) => {
    if (field === "cpf") {
      if (!cpfUtils.isValid(formData.cpf)) {
        setCpfError("CPF inválido");
        return;
      }
      setCpfError("");
    }
    setSavingField(field);
    const res = await updateProfile({ [field]: formData[field] });
    setSavingField(null);
    if (!res.success) {
      alert(res.error || "Erro ao atualizar");
      return;
    }
    setEditField(null);
    setFormData((p) => ({ ...p, cpf: "" }));
  };

  const handlePassword = async () => {
    setPwdError("");
    setPwdSuccess("");
    if (user.hasPassword && !pwdData.currentPassword) {
      setPwdError("Informe a senha atual");
      return;
    }
    if (!pwdData.newPassword || pwdData.newPassword.length < 6) {
      setPwdError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (pwdData.newPassword !== pwdData.confirmNewPassword) {
      setPwdError("As senhas não coincidem");
      return;
    }
    setSavingField("password");
    try {
      const res = await apiServices.changePassword(pwdData);
      setUser((p) => ({ ...p, hasPassword: true }));
      setPwdSuccess(res.data.message || "Senha alterada com sucesso");
      setEditField(null);
      setPwdData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (e) {
      setPwdError(e.response?.data?.error || "Erro ao alterar senha");
    } finally {
      setSavingField(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#C6A75E] text-[10px] tracking-[0.28em] uppercase mb-1">
            Conta
          </p>
          <h1 className="text-xl font-light text-[#1C1C1C] tracking-wide">
            Minha Conta
          </h1>
        </div>

        {/* Avatar card */}
        <div className="bg-[#5B2333] rounded-2xl p-6 mb-5 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-[#F5E6D3] text-xl font-semibold flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[#F5E6D3] tracking-wide">
              {user.name}
            </p>
            <p className="text-[#D4A5A5] text-xs mt-0.5">{user.email}</p>
            {user.affiliate?.couponCode && (
              <p className="text-[10px] text-[#C6A75E] mt-1 font-mono tracking-wider">
                Cupom afiliado: {user.affiliate.couponCode}
              </p>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="bg-white rounded-2xl border border-[#EEE8E0] shadow-sm px-6 pt-2 pb-2 mb-5">
          {/* Name */}
          <FieldRow
            label="Nome completo"
            displayValue={user.name}
            editing={editField === "name"}
            onEdit={() => startEdit("name")}
            onCancel={cancelEdit}
            onSave={() => handleSave("name")}
            saving={savingField === "name"}
          >
            <input
              className={inputCls}
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Nome completo"
            />
          </FieldRow>

          {/* Email */}
          <FieldRow
            label="Email"
            displayValue={user.email}
            editing={editField === "email"}
            onEdit={() => startEdit("email")}
            onCancel={cancelEdit}
            onSave={() => handleSave("email")}
            saving={savingField === "email"}
          >
            <input
              type="email"
              className={inputCls}
              value={formData.email}
              onChange={(e) =>
                setFormData((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="email@exemplo.com"
            />
          </FieldRow>

          {/* Phone */}
          <FieldRow
            label="Telefone"
            displayValue={user.phone}
            editing={editField === "phone"}
            onEdit={() => startEdit("phone")}
            onCancel={cancelEdit}
            onSave={() => handleSave("phone")}
            saving={savingField === "phone"}
          >
            <input
              className={inputCls}
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="(11) 99999-0000"
            />
          </FieldRow>

          {/* CPF */}
          <FieldRow
            label="CPF"
            displayValue={user.cpfMasked}
            editing={editField === "cpf"}
            onEdit={() => startEdit("cpf")}
            onCancel={cancelEdit}
            onSave={() => handleSave("cpf")}
            saving={savingField === "cpf"}
          >
            <input
              className={inputCls}
              value={formData.cpf}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  cpf: cpfUtils.format(e.target.value),
                }))
              }
              placeholder="000.000.000-00"
              maxLength={14}
            />
            {cpfError && <p className="text-xs text-red-500">{cpfError}</p>}
          </FieldRow>

          {/* Date of birth */}
          <FieldRow
            label="Data de nascimento"
            displayValue={formatDate(user.dateOfBirth)}
            editing={editField === "dateOfBirth"}
            onEdit={() => startEdit("dateOfBirth")}
            onCancel={cancelEdit}
            onSave={() => handleSave("dateOfBirth")}
            saving={savingField === "dateOfBirth"}
          >
            <input
              type="date"
              className={inputCls}
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))
              }
            />
          </FieldRow>
        </div>

        {/* Password card */}
        <div className="bg-white rounded-2xl border border-[#EEE8E0] shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                Segurança
              </p>
              <p className="text-sm text-[#1C1C1C] font-medium">
                {user.hasPassword
                  ? "Senha cadastrada"
                  : "Nenhuma senha cadastrada"}
              </p>
            </div>
            {editField !== "password" && (
              <button
                onClick={() => startEdit("password")}
                className="text-xs text-[#5B2333] hover:text-[#C6A75E] transition-colors font-medium"
              >
                {user.hasPassword ? "Alterar" : "Criar senha"}
              </button>
            )}
          </div>

          {pwdSuccess && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {pwdSuccess}
            </div>
          )}

          {editField === "password" && (
            <div className="mt-4 space-y-3">
              {user.hasPassword && (
                <input
                  type="password"
                  className={inputCls}
                  placeholder="Senha atual"
                  value={pwdData.currentPassword}
                  onChange={(e) =>
                    setPwdData((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                />
              )}
              <input
                type="password"
                className={inputCls}
                placeholder="Nova senha (mínimo 6 caracteres)"
                value={pwdData.newPassword}
                onChange={(e) =>
                  setPwdData((p) => ({ ...p, newPassword: e.target.value }))
                }
              />
              <input
                type="password"
                className={inputCls}
                placeholder="Confirmar nova senha"
                value={pwdData.confirmNewPassword}
                onChange={(e) =>
                  setPwdData((p) => ({
                    ...p,
                    confirmNewPassword: e.target.value,
                  }))
                }
              />
              {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handlePassword}
                  disabled={savingField === "password"}
                  className="bg-[#5B2333] hover:bg-[#4a1c29] disabled:opacity-50 text-[#F5E6D3] px-5 py-2 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  {savingField === "password" ? (
                    <>
                      <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      Salvando…
                    </>
                  ) : (
                    "Salvar senha"
                  )}
                </button>
                <button
                  onClick={cancelEdit}
                  className="border border-[#E8DDD0] text-gray-500 hover:border-[#5B2333] hover:text-[#5B2333] px-5 py-2 rounded-full text-xs transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Affiliate info */}
        {user.affiliate?.couponCode && (
          <div className="bg-white rounded-2xl border border-[#EEE8E0] shadow-sm px-6 py-5 mt-5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-3">
              Programa de Afiliados
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Seu cupom",
                  value: user.affiliate.couponCode,
                  mono: true,
                },
                {
                  label: "Saldo",
                  value: `R$ ${(user.affiliate.pendingBalance || 0).toFixed(2)}`,
                  highlight: true,
                },
                {
                  label: "Total ganho",
                  value: `R$ ${(user.affiliate.totalEarned || 0).toFixed(2)}`,
                },
                {
                  label: "Total recebido",
                  value: `R$ ${(user.affiliate.totalPaid || 0).toFixed(2)}`,
                },
              ].map(({ label, value, mono, highlight }) => (
                <div
                  key={label}
                  className="bg-[#FAF7F4] rounded-xl p-3 text-center"
                >
                  <p className="text-[10px] text-gray-400 mb-1">{label}</p>
                  <p
                    className={`text-sm font-semibold ${highlight ? "text-emerald-600" : "text-[#1C1C1C]"} ${mono ? "font-mono tracking-wider" : ""}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
