import React, { useState } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import OrdersTab from "../../Components/OrdersTab/OrdersTab";

const ProfilePage = () => {
  const { currentUser, changePassword, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const navigate = useNavigate();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  //já verificado
  const handleChangePassword = async (e) => {
    e.preventDefault();
    await changePassword(
      currentPassword,
      newPassword,
      confirmNewPassword,
      setCurrentPassword,
      setNewPassword,
      setConfirmNewPassword,
      navigate
    );
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(name, email, phone, cpf, dateOfBirth, navigate);
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6">
                <i className="fas fa-user text-3xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{currentUser.name}</h2>
                <p className="text-blue-100">{currentUser.email}</p>
                <p className="text-sm text-blue-200 mt-1">
                  <i className="fas fa-calendar mr-2"></i>
                  Membro desde Janeiro 2024
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="fas fa-user mr-2"></i>Perfil
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "orders"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="fas fa-shopping-bag mr-2"></i>Meus Pedidos
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "addresses"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="fas fa-map-marker-alt mr-2"></i>Endereços
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "security"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="fas fa-shield-alt mr-2"></i>Segurança
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">
                  Informações Pessoais
                </h3>
                <form
                  autoComplete="on"
                  onSubmit={handleProfileUpdate}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        defaultValue={currentUser.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        defaultValue={currentUser.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        defaultValue={currentUser.phone}
                        placeholder="Digite seu telefone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF
                      </label>
                      <input
                        onChange={(e) => setCpf(e.target.value)}
                        type="text"
                        defaultValue={currentUser.cpf || ""}
                        placeholder="Digite seu CPF"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento
                    </label>
                    <input
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      defaultValue={currentUser.dateOfBirth || ""}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </form>
              </div>
            )}

            {activeTab === "orders" && <OrdersTab />}

            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Meus Endereços</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i className="fas fa-plus mr-2"></i>Adicionar Endereço
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Casa</h4>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Principal
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Rua das Flores, 123
                      <br />
                      Jardim Paulista
                      <br />
                      São Paulo - SP
                      <br />
                      01234-567
                    </p>
                    <div className="mt-3 space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">
                  Segurança da Conta
                </h3>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Alterar Senha</h4>
                    <form
                      autoComplete="on"
                      onSubmit={handleChangePassword}
                      className="space-y-4"
                    >
                      {/* Campo de usuário oculto, mas acessível */}
                      <label htmlFor="username" className="sr-only">
                        Usuário
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        defaultValue={currentUser.email || ""}
                        className="sr-only"
                        readOnly
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Senha Atual
                        </label>
                        <input
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          type="password"
                          autoComplete="current-password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nova Senha
                        </label>
                        <input
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nova Senha
                        </label>
                        <input
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                          autoComplete="new-password"
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Alterar Senha
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
