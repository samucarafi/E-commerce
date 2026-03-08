import { useProduct } from "../../Contexts/Product/ProductContext";

const FiltersSidebar = ({ isOpen, onClose }) => {
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
  } = useProduct();

  if (!isOpen) return null;

  return (
    <>
      {/* overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40"></div>

      <aside className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#5B2333]">Filtros</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#5B2333] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* TIPO */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-[#5B2333]">Tipo</h3>

          <div className="flex flex-col gap-2 text-sm">
            {["Perfume", "Decante"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setSelectedType(selectedType === type ? "" : type)
                }
                className={`text-left cursor-pointer ${
                  selectedType === type
                    ? "text-[#C6A75E] font-semibold"
                    : "hover:text-[#C6A75E]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* GENERO */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-[#5B2333]">Gênero</h3>

          <div className="flex flex-col gap-2 text-sm">
            {["Masculino", "Feminino", "Unissex"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(selectedGender === g ? "" : g)}
                className={`text-left cursor-pointer ${
                  selectedGender === g
                    ? "text-[#C6A75E] font-semibold"
                    : "hover:text-[#C6A75E]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORIAS */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-[#5B2333]">Categorias</h3>

          <div className="flex flex-col gap-2 text-sm">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  filterByCategory(
                    selectedCategory === cat.name ? "" : cat.name,
                  )
                }
                className={`text-left cursor-pointer ${
                  selectedCategory === cat.name
                    ? "text-[#C6A75E] font-semibold"
                    : "hover:text-[#C6A75E]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* OUTROS */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-[#5B2333]">Outros</h3>

          <button
            onClick={() => setOnlyNew(!onlyNew)}
            className={`text-sm cursor-pointer ${
              onlyNew ? "text-[#C6A75E] font-semibold" : "hover:text-[#C6A75E]"
            }`}
          >
            Apenas lançamentos
          </button>
        </div>

        {/* ORDENAR */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-[#5B2333]">Ordenar por</h3>

          <select
            onChange={(e) => setSortFilter(e.target.value)}
            className="w-full border border-[#E8D8C3] rounded-lg p-2 text-sm cursor-pointer"
          >
            <option value="name">Nome</option>
            <option value="price-asc">Preço menor</option>
            <option value="price-desc">Preço maior</option>
            <option value="popularity">Mais populares</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="text-sm text-red-500 mt-4 cursor-pointer"
        >
          Limpar filtros
        </button>
      </aside>
    </>
  );
};

export default FiltersSidebar;
