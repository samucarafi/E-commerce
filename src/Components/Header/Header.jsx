import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useProduct } from "../../Contexts/Product/ProductContext";
import logo from "/images/ROYAL.png";

/* ─────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────── */
const IconBag = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const IconUser = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconClose = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconSearch = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MenuLink = ({ to, onClick, icon, label }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#F5E6D3] hover:bg-[#2A2A2A] transition-colors"
  >
    <span className="text-base">{icon}</span>
    {label}
  </Link>
);

const FilterSection = ({ title, children }) => (
  <div className="mb-6">
    <p className="text-[10px] font-bold text-[#C6A75E] uppercase tracking-[0.18em] mb-3">
      {title}
    </p>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-xs border transition-all duration-200 cursor-pointer ${
      active
        ? "bg-[#C6A75E] text-[#1C1C1C] border-[#C6A75E] font-semibold"
        : "border-[#2A2A2A] text-[#AAA] hover:border-[#C6A75E]/50 hover:text-[#F5E6D3]"
    }`}
  >
    {label}
  </button>
);

/* ─────────────────────────────────────────────────────────
   Main Header
───────────────────────────────────────────────────────── */
const Header = () => {
  const userMenuRef = useRef(null);
  const { getTotalItems, setIsCartOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const {
    categories,
    selectedType,
    selectedGender,
    selectedCategory,
    onlyNew,
    setSelectedType,
    setSelectedGender,
    filterByCategory,
    setSortFilter,
    setOnlyNew,
    clearFilters,
    searchTerm,
    searchProducts,
    sortBy,
  } = useProduct();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when filter panel is open
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const activeFiltersCount = [
    selectedType,
    selectedGender,
    selectedCategory,
    onlyNew ? "new" : "",
  ].filter(Boolean).length;

  const sortOptions = [
    { value: "name", label: "Nome A–Z" },
    { value: "price-asc", label: "Menor preço" },
    { value: "price-desc", label: "Maior preço" },
    { value: "popularity", label: "Mais populares" },
  ];

  return (
    <>
      <header className="bg-[#1C1C1C] border-b border-[#242424] sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* ── Row 1: Hamburger | Logo | Cart + User ── */}
          <div className="flex items-center justify-between h-16 relative">
            {/* LEFT – Hamburger */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="relative flex flex-col gap-[5px] p-2 group"
              aria-label="Abrir filtros"
            >
              <span className="block w-6 h-[1.5px] bg-[#F5E6D3] group-hover:bg-[#C6A75E] transition-colors" />
              <span className="block w-4 h-[1.5px] bg-[#F5E6D3] group-hover:bg-[#C6A75E] transition-colors" />
              <span className="block w-6 h-[1.5px] bg-[#F5E6D3] group-hover:bg-[#C6A75E] transition-colors" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C6A75E] text-[#1C1C1C] text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* CENTER – Logo (absolute so it stays truly centred) */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img
                src={logo}
                alt="ROYAL"
                className="h-14 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* RIGHT – Cart + User */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#F5E6D3] hover:text-[#C6A75E] transition-colors"
                aria-label="Abrir sacola"
              >
                <IconBag />
                {getTotalItems() > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#C6A75E] text-[#1C1C1C] text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-9 h-9 rounded-full border border-[#333] hover:border-[#C6A75E] bg-[#2A2A2A] flex items-center justify-center text-[#F5E6D3] hover:text-[#C6A75E] transition-all"
                    aria-label="Menu do usuário"
                  >
                    <IconUser />
                  </button>

                  {/* User dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-2xl py-3 z-50">
                      <div className="px-4 pb-3 border-b border-[#2A2A2A]">
                        <p className="font-semibold text-[#F5E6D3] text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {user.email}
                        </p>
                      </div>
                      <MenuLink
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        icon="👤"
                        label="Meu Perfil"
                      />
                      <MenuLink
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        icon="📦"
                        label="Meus Pedidos"
                      />
                      {isAdmin() && (
                        <MenuLink
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          icon="⚙️"
                          label="Painel Admin"
                        />
                      )}
                      <div className="border-t border-[#2A2A2A] mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#C6A75E] hover:bg-[#2A2A2A] transition-colors"
                        >
                          <span>🚪</span> Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-9 h-9 rounded-full border border-[#333] hover:border-[#C6A75E] bg-[#2A2A2A] flex items-center justify-center text-[#F5E6D3] hover:text-[#C6A75E] transition-all"
                  aria-label="Entrar"
                >
                  <IconUser />
                </Link>
              )}
            </div>
          </div>

          {/* ── Row 2: Search bar ── */}
          <div className="pb-3">
            <div className="flex items-center gap-2 border border-[#242424] hover:border-[#333] focus-within:border-[#C6A75E]/40 rounded-full px-4 py-2.5 bg-[#111] transition-colors max-w-2xl mx-auto">
              <span className="text-[#C6A75E] flex-shrink-0">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar fragrância, marca, nota olfativa..."
                value={searchTerm}
                onChange={(e) => searchProducts(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1 text-[#F5E6D3] placeholder:text-gray-600 min-w-0"
              />
              {searchTerm && (
                <button
                  onClick={() => searchProducts("")}
                  className="text-gray-600 hover:text-[#F5E6D3] flex-shrink-0 transition-colors"
                  aria-label="Limpar busca"
                >
                  <IconClose />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─────────── Filter Sidebar ─────────── */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 ${isFilterOpen ? "visible" : "invisible pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsFilterOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0"}`}
        />

        {/* Panel */}
        <aside
          className={`absolute left-0 top-0 h-full w-80 bg-[#111] border-r border-[#1E1E1E] overflow-y-auto transition-transform duration-300 ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-base font-semibold text-[#F5E6D3] tracking-wider">
                  Filtros
                </h2>
                {activeFiltersCount > 0 && (
                  <p className="text-xs text-[#C6A75E] mt-0.5">
                    {activeFiltersCount} filtro
                    {activeFiltersCount > 1 ? "s" : ""} ativo
                    {activeFiltersCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center text-gray-500 hover:text-[#F5E6D3] transition-colors"
              >
                <IconClose />
              </button>
            </div>

            {/* Tipo */}
            <FilterSection title="Tipo">
              {["Perfume", "Decante"].map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  active={selectedType === type}
                  onClick={() =>
                    setSelectedType(selectedType === type ? "" : type)
                  }
                />
              ))}
            </FilterSection>

            {/* Gênero */}
            <FilterSection title="Gênero">
              {["Masculino", "Feminino", "Unissex"].map((g) => (
                <FilterChip
                  key={g}
                  label={g}
                  active={selectedGender === g}
                  onClick={() =>
                    setSelectedGender(selectedGender === g ? "" : g)
                  }
                />
              ))}
            </FilterSection>

            {/* Categoria */}
            <FilterSection title="Categoria Olfativa">
              {categories.map((cat) => (
                <FilterChip
                  key={cat.id}
                  label={cat.name}
                  active={selectedCategory === cat.name}
                  onClick={() =>
                    filterByCategory(
                      selectedCategory === cat.name ? "" : cat.name,
                    )
                  }
                />
              ))}
            </FilterSection>

            {/* Novidades */}
            <FilterSection title="Novidades">
              <FilterChip
                label="Apenas lançamentos"
                active={onlyNew}
                onClick={() => setOnlyNew(!onlyNew)}
              />
            </FilterSection>

            {/* Ordenar */}
            <FilterSection title="Ordenar por">
              {sortOptions.map(({ value, label }) => (
                <FilterChip
                  key={value}
                  label={label}
                  active={sortBy === value}
                  onClick={() => setSortFilter(value)}
                />
              ))}
            </FilterSection>

            {/* Actions */}
            <div className="space-y-3 mt-4">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 border border-red-500/25 text-red-400 rounded-full text-sm hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              )}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-2.5 bg-[#C6A75E] text-[#1C1C1C] rounded-full text-sm font-semibold hover:bg-[#B8954D] transition-all cursor-pointer"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;
