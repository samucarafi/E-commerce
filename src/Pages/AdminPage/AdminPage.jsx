import React, { useEffect } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { NavLink, Outlet } from "react-router-dom";
import Cart from "../../Components/Cart/Cart";

const NAV_ITEMS = [
  { id: "products", label: "Produtos", icon: "🧴" },
  { id: "orders", label: "Pedidos", icon: "📦" },
  { id: "users", label: "Clientes", icon: "👥" },
  { id: "coupons", label: "Cupons", icon: "🎟️" },
  { id: "shipping", label: "Frete", icon: "🚚" },
];

const AdminPage = () => {
  const { isAdmin, getUsers } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-light text-[#5B2333] tracking-wide">
            Acesso Negado
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#2E2E2E]">
      <div className="flex h-screen overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-56 flex-shrink-0 bg-[#1C1C1C] flex flex-col">
          {/* Logo area */}
          <div className="px-6 py-7 border-b border-[#2A2A2A]">
            <p className="text-[10px] text-[#C6A75E] tracking-[0.25em] uppercase mb-0.5">
              Royal
            </p>
            <h1 className="text-sm font-light text-[#F5E6D3] tracking-wide">
              Painel Admin
            </h1>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={`/admin/${item.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-[#C6A75E]/15 text-[#C6A75E] font-medium"
                      : "text-[#888] hover:text-[#F5E6D3] hover:bg-[#2A2A2A]"
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-[#2A2A2A]">
            <NavLink
              to="/"
              className="flex items-center gap-2 text-xs text-[#555] hover:text-[#F5E6D3] transition-colors"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Voltar à loja
            </NavLink>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Cart />
    </div>
  );
};

export default AdminPage;
