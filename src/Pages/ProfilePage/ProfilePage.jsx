import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Contexts/Auth/AuthContext";

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [editField, setEditField] = useState(null);
  const [savingField, setSavingField] = useState(null);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        //cpf: user.cpf || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async (field) => {
    try {
      setSavingField(field);

      const response = await updateProfile({
        [field]: formData[field],
      });

      if (!response.success) {
        alert(response.error || "Erro ao atualizar");
        return;
      }

      setEditField(null);
    } finally {
      setSavingField(null);
    }
  };

  const renderEditableField = (label, field, type = "text") => (
    <div className="border-b border-gray-200 pb-5">
      <label className="text-sm text-gray-500">{label}</label>

      {editField === field ? (
        <div className="mt-2 flex gap-2 items-center">
          <input
            type={type}
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => handleSave(field)}
            disabled={savingField === field}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {savingField === field ? "Salvando..." : "Salvar"}
          </button>

          <button
            onClick={() => setEditField(null)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-800 font-medium">
            {user[field] || "Não informado"}
          </p>

          <button
            onClick={() => setEditField(field)}
            className="text-blue-600 text-sm hover:text-blue-800"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">Minha Conta</h2>

      <div className="bg-white shadow-sm rounded-xl p-6 space-y-6">
        {renderEditableField("Nome Completo", "name")}
        {renderEditableField("Email", "email", "email")}
        {renderEditableField("Telefone", "phone")}
        {/* {renderEditableField("CPF", "cpf")} */}
        {renderEditableField("Data de Nascimento", "dateOfBirth", "date")}
      </div>
    </div>
  );
};

export default ProfilePage;
