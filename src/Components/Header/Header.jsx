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
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-2xl font-bold bg-linear-to-r from-[#C6A75E] to-[#D4A5A5] bg-clip-text text-transparent"
            >
              🌹 Maison Élégance
            </Link>
            <nav className="hidden md:flex space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-blue-600 transition-colors font-medium ${
                    isActive ? "text-blue-600" : ""
                  }`
                }
              >
                Início
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-blue-600 transition-colors font-medium ${
                    isActive ? "text-blue-600" : ""
                  }`
                }
              >
                Produtos
              </NavLink>
              {isAdmin() && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `text-purple-600 hover:text-purple-700 transition-colors font-medium ${
                      isActive ? "text-purple-700" : ""
                    }`
                  }
                >
                  🔧 Admin
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onSearch()}
                className="px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={onSearch}
                className="btn-gold text-white px-4 py-2 rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                🔍
              </button>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-linear-to-r bg-[#5B2333] hover:bg-[#4a1b29] text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105"
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-all"
                >
                  <span className="text-2xl">👤</span>
                  <span className="hidden md:block font-medium text-gray-700">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {isAdmin() && (
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mt-1">
                          Administrador
                        </span>
                      )}
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Meus Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-gold text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Entrar
              </Link>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg"
              />
              <button
                onClick={onSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
              >
                🔍
              </button>
            </div>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-left hover:text-blue-600">
                Início
              </Link>
              <Link to="/products" className="text-left hover:text-blue-600">
                Produtos
              </Link>
              {isAdmin() && (
                <Link
                  to="/admin"
                  className="text-left text-purple-600 hover:text-purple-700"
                >
                  🔧 Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
