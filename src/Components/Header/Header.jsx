import React, { useState } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import logo from "/images/ROYAL.png";

const Header = ({ onSearch, searchTerm, setSearchTerm }) => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-[#1C1C1C] border-b border-[#2A2A2A] sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-6">
          {/* LOGO */}
          <Link to="/" className="flex items-center group">
            <img
              src={logo}
              alt="ROYAL"
              className="h-20 md:h-24 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            />
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-12 text-sm uppercase tracking-[0.2em]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-all duration-300 ${
                  isActive
                    ? "text-[#C6A75E]"
                    : "text-[#F5E6D3] hover:text-[#C6A75E]"
                }`
              }
            >
              Início
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `transition-all duration-300 ${
                  isActive
                    ? "text-[#C6A75E]"
                    : "text-[#F5E6D3] hover:text-[#C6A75E]"
                }`
              }
            >
              Fragrâncias
            </NavLink>

            {isAdmin() && (
              <NavLink
                to="/admin"
                className="text-[#F5E6D3] hover:text-[#C6A75E] transition-all"
              >
                Admin
              </NavLink>
            )}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            {/* SEARCH */}
            <div className="hidden md:flex items-center border border-[#333] rounded-full px-4 py-2 bg-[#2A2A2A]">
              <input
                type="text"
                placeholder="Buscar fragrância..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                className="bg-transparent outline-none text-sm px-2 w-44 text-[#F5E6D3] placeholder:text-gray-400"
              />
              <button
                onClick={onSearch}
                className="text-[#C6A75E] hover:opacity-80 transition-all"
              >
                🔍
              </button>
            </div>

            {/* CART */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative border border-[#C6A75E] px-5 py-2 rounded-full text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#1C1C1C] transition-all duration-300"
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
                  className="text-sm text-[#F5E6D3] hover:text-[#C6A75E] transition-all"
                >
                  {user.name.split(" ")[0]}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-[#1C1C1C] border border-[#333] rounded-xl shadow-xl py-3">
                    <div className="px-4 pb-3 border-b border-[#333]">
                      <p className="font-medium text-[#F5E6D3]">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-[#F5E6D3] hover:bg-[#2A2A2A]"
                    >
                      Meu Perfil
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-[#F5E6D3] hover:bg-[#2A2A2A]"
                    >
                      Meus Pedidos
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-[#C6A75E] hover:bg-[#2A2A2A]"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="border border-[#C6A75E] px-6 py-2 rounded-full text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#1C1C1C] transition-all duration-300 text-sm"
              >
                Entrar
              </Link>
            )}

            {/* MOBILE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-2xl text-[#F5E6D3]"
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-[#2A2A2A] pt-4 space-y-4">
            <input
              type="text"
              placeholder="Buscar fragrância..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[#333] rounded-full bg-[#2A2A2A] text-[#F5E6D3]"
            />

            <nav className="flex flex-col gap-4 text-sm uppercase tracking-wider text-[#F5E6D3]">
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
