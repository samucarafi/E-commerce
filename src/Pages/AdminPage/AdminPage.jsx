import React, { useEffect } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { NavLink, Outlet } from "react-router-dom";

const AdminPage = () => {
  const { isAdmin, getUsers } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-semibold text-[#5B2333]">
            Acesso Negado
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E]">
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-[#E8D8C3] overflow-hidden">
          <div className="bg-[#5B2333] text-[#F5E6D3] p-8">
            <h1 className="text-3xl font-semibold tracking-wide">
              Painel Royal
            </h1>
            <p className="text-[#D4A5A5] mt-2">
              Controle total da sua perfumaria
            </p>
          </div>

          <div className="flex border-b border-[#E8D8C3]">
            {[
              { id: "products", label: "Produtos" },
              { id: "users", label: "Clientes" },
              { id: "orders", label: "Pedidos" },
              { id: "shipping", label: "Envios" },
              { id: "payments", label: "Pagamentos" },
            ].map((tab) => (
              <NavLink
                key={tab.id}
                to={`/admin/${tab.id}`}
                className={({ isActive }) =>
                  `flex-1 text-center py-4 tracking-wide transition-all ${
                    isActive
                      ? "bg-[#F1E8E2] text-[#5B2333] border-b-2 border-[#C6A75E]"
                      : "text-[#5B2333]/70 hover:bg-[#F8F5F2]"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>

          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
