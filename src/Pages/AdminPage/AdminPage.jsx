import React, { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useProduct } from "../../Contexts/Product/ProductContext";
import ProductForm from "../../Components/ProductForm/ProductForm";
import UserForm from "../../Components/UserForm/UserForm";
import UserManage from "../../Components/UserManage/UserManage";
import PaymentsConfig from "../../Components/PaymentsConfig/PaymentsConfig";
import ShippingConfig from "../../Components/ShippingConfig/ShippingConfig";
import ProductsManage from "../../Components/ProductsManage/ProductsManage";
import { NavLink, Outlet } from "react-router-dom";

const AdminPage = () => {
  const [loading, setLoading] = useState("");
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { getUsers, users, updateUser } = useAuth();

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleSaveUser = async (user) => {
    const result = await updateUser(editingUser._id, user);

    return result;
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta área.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E]">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-purple-100 mt-2">
              Gerencie produtos, usuários e configurações
            </p>
          </div>

          <div className="flex border-b">
            {[
              { id: "products", label: "Produtos", icon: "📦" },
              { id: "users", label: "Usuários", icon: "👥" },
              { id: "orders", label: "Pedidos", icon: "📋" },
              { id: "shipping", label: "Frete", icon: "🚚" },
              { id: "payments", label: "Pagamentos", icon: "💳" },
            ].map((tab) => (
              <NavLink
                key={tab.id}
                to={`/admin/${tab.id}`}
                className={({ isActive }) =>
                  `flex-1 px-6 py-4 font-medium transition-all ${
                    isActive
                      ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </NavLink>
            ))}
          </div>

          <div className="p-6">
            <Outlet />

            {/* retirar tudo daqui pra baixo e usar rotas */}
            {activeTab === "shipping" && <ShippingConfig />}

            {activeTab === "payments" && <PaymentsConfig />}

            {activeTab === "users" && (
              <UserManage users={users} handleEditUser={handleEditUser} />
            )}
          </div>
        </div>
      </div>
      <UserForm
        isOpen={showUserForm}
        user={editingUser}
        setUser={setEditingUser}
        onClose={() => setShowUserForm(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default AdminPage;
