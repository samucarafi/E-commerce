import React, { useState } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth/AuthContext";

const Header = ({ onSearch, searchTerm, setSearchTerm }) => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="backdrop-blur-md bg-[#F8F5F2]/80 border-b border-[#E8DFD6] sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center space-x-10">
            <Link
              to="/"
              className="text-2xl font-semibold tracking-widest text-[#5B2333] hover:text-[#C6A75E] transition-all duration-300"
            >
              Maison Élégance
            </Link>

            {/* NAV DESKTOP */}
            <nav className="hidden md:flex space-x-8 text-sm uppercase tracking-wider">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative pb-1 transition-all duration-300 ${
                    isActive
                      ? "text-[#C6A75E]"
                      : "text-[#2E2E2E] hover:text-[#5B2333]"
                  }`
                }
              >
                Início
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `relative pb-1 transition-all duration-300 ${
                    isActive
                      ? "text-[#C6A75E]"
                      : "text-[#2E2E2E] hover:text-[#5B2333]"
                  }`
                }
              >
                Fragrâncias
              </NavLink>

              {isAdmin() && (
                <NavLink
                  to="/admin"
                  className="text-[#5B2333] hover:text-[#C6A75E] transition-all"
                >
                  Admin
                </NavLink>
              )}
            </nav>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-5">
            {/* SEARCH */}
            <div className="hidden md:flex items-center border border-[#E8DFD6] rounded-full overflow-hidden bg-white">
              <input
                type="text"
                placeholder="Buscar fragrância..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                className="px-4 py-2 outline-none text-sm bg-transparent"
              />
              <button
                onClick={onSearch}
                className="px-4 text-[#5B2333] hover:text-[#C6A75E] transition-all"
              >
                🔍
              </button>
            </div>

            {/* CART */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative border border-[#5B2333] text-[#5B2333] px-4 py-2 rounded-full hover:bg-[#5B2333] hover:text-[#F5E6D3] transition-all duration-300"
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C6A75E] text-[#1C1C1C] text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* USER */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-sm text-[#5B2333] hover:text-[#C6A75E] transition-all"
                >
                  {user.name.split(" ")[0]}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-[#E8DFD6] rounded-xl shadow-xl py-3">
                    <div className="px-4 pb-3 border-b border-[#E8DFD6]">
                      <p className="font-medium text-[#2E2E2E]">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-[#F8F5F2]"
                    >
                      Meu Perfil
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-[#F8F5F2]"
                    >
                      Meus Pedidos
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-[#5B2333] hover:bg-[#F8F5F2]"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="border border-[#C6A75E] text-[#5B2333] px-5 py-2 rounded-full hover:bg-[#C6A75E] hover:text-[#1C1C1C] transition-all duration-300 text-sm"
              >
                Entrar
              </Link>
            )}

            {/* MOBILE MENU */}
            <button
              className="md:hidden text-[#5B2333]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 space-y-4 border-t pt-4 text-sm">
            <input
              type="text"
              placeholder="Buscar fragrância..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[#E8DFD6] rounded-full"
            />

            <nav className="flex flex-col space-y-3 text-[#5B2333]">
              <Link to="/">Início</Link>
              <Link to="/products">Fragrâncias</Link>
              {isAdmin() && <Link to="/admin">Admin</Link>}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
