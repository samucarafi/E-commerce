import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Contexts/Auth/AuthContext";
import { cpfUtils } from "../../Utils/cpfUtils";
import { apiServices } from "../../services/apiServices";

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [editField, setEditField] = useState(null);
  const [savingField, setSavingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [cpfError, setCpfError] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const formatDate = (date) => {
    if (!date) return "Não informado";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        cpf: "", // ✅ nunca preenche com cpf real
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async (field) => {
    try {
      if (field === "cpf") {
        const numbers = formData.cpf.replace(/\D/g, "");

        if (!cpfUtils.isValid(numbers)) {
          setCpfError("CPF inválido");
          return;
        }

        setCpfError("");
      }

      setSavingField(field);

      const response = await updateProfile({
        [field]: formData[field],
      });

      if (!response.success) {
        alert(response.error || "Erro ao atualizar");
        return;
      }

      setEditField(null);
      setFormData((prev) => ({ ...prev, cpf: "" }));
    } finally {
      setSavingField(null);
    }
  };

  /* ================================
     CPF FIELD
  ================================= */
  const renderCpfField = () => (
    <div className="border-b border-[#E8D8C3] pb-5">
      <label className="text-sm text-[#5B2333] font-medium">CPF</label>

      {editField === "cpf" ? (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => {
              const formatted = cpfUtils.format(e.target.value);
              setFormData({ ...formData, cpf: formatted });
            }}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
          />

          {cpfError && <p className="text-sm text-red-500">{cpfError}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => handleSave("cpf")}
              disabled={savingField === "cpf"}
              className="px-6 py-2 rounded-full bg-[#5B2333] text-[#F5E6D3] hover:bg-[#4a1c29] transition disabled:opacity-50"
            >
              {savingField === "cpf" ? "Salvando..." : "Salvar"}
            </button>

            <button
              onClick={() => {
                setEditField(null);
                setFormData((prev) => ({ ...prev, cpf: "" }));
                setCpfError("");
              }}
              className="px-6 py-2 rounded-full border border-[#D4A5A5] text-[#5B2333] hover:bg-[#F1E8E2]"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-800 font-medium">
            {user.cpfMasked || "Não informado"}
          </p>

          <button
            onClick={() => setEditField("cpf")}
            className="text-[#5B2333] text-sm hover:text-[#C6A75E] transition"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );

  /* ================================
     OUTROS CAMPOS
  ================================= */
  const renderEditableField = (label, field, type = "text") => (
    <div className="border-b border-[#E8D8C3] pb-5">
      <label className="text-sm text-[#5B2333] font-medium">{label}</label>

      {editField === field ? (
        <div className="mt-3 flex gap-3 items-center">
          <input
            type={type}
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
            className="flex-1 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
          />

          <button
            onClick={() => handleSave(field)}
            disabled={savingField === field}
            className="px-6 py-2 rounded-full bg-[#5B2333] text-[#F5E6D3] hover:bg-[#4a1c29] transition disabled:opacity-50"
          >
            {savingField === field ? "Salvando..." : "Salvar"}
          </button>

          <button
            onClick={() => setEditField(null)}
            className="px-6 py-2 rounded-full border border-[#D4A5A5] text-[#5B2333] hover:bg-[#F1E8E2]"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-800 font-medium">
            {field === "dateOfBirth"
              ? formatDate(user[field])
              : user[field] || "Não informado"}
          </p>

          <button
            onClick={() => setEditField(field)}
            className="text-[#5B2333] text-sm hover:text-[#C6A75E]"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );

  const renderPasswordField = () => (
    <div className="border-b border-[#E8D8C3] pb-5">
      <label className="text-sm text-[#5B2333] font-medium">
        {user?.hasPassword ? "Alterar senha" : "Criar senha"}
      </label>

      {editField === "password" ? (
        <div className="mt-3 space-y-3">
          {user?.hasPassword && (
            <input
              type="password"
              placeholder="Senha atual"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-full border border-[#D4A5A5]"
            />
          )}

          <input
            type="password"
            placeholder="Nova senha"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-full border border-[#D4A5A5]"
          />

          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmNewPassword: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-full border border-[#D4A5A5]"
          />

          <div className="flex gap-3">
            <button
              onClick={async () => {
                try {
                  const res = await apiServices.changePassword(passwordData);

                  alert(res.data.message);

                  setEditField(null);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                  });
                } catch (err) {
                  alert(err.response?.data?.error || "Erro");
                }
              }}
              className="px-6 py-2 rounded-full bg-[#5B2333] text-[#F5E6D3]"
            >
              Salvar
            </button>

            <button
              onClick={() => setEditField(null)}
              className="px-6 py-2 rounded-full border"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between mt-2">
          <p className="text-gray-800">
            {user?.hasPassword ? "********" : "Nenhuma senha cadastrada"}
          </p>

          <button onClick={() => setEditField("password")}>
            {user?.hasPassword ? "Alterar" : "Criar"}
          </button>
        </div>
      )}
    </div>
  );
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="bg-[#5B2333] text-[#F5E6D3] px-8 py-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-semibold">Minha Conta</h2>
        <p className="text-[#D4A5A5] text-sm mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-3xl p-8 border border-[#E8D8C3] space-y-6">
        {renderEditableField("Nome Completo", "name")}
        {renderEditableField("Email", "email", "email")}
        {renderEditableField("Telefone", "phone")}
        {renderCpfField()}
        {renderEditableField("Data de Nascimento", "dateOfBirth", "date")}
        {renderPasswordField()}
      </div>
    </div>
  );
};

export default ProfilePage;
