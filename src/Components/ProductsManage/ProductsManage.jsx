import React from "react";
import { useProduct } from "../../Contexts/Product/ProductContext";
import { NavLink, Outlet } from "react-router-dom";

const Badge = ({ children, color = "gray" }) => {
  const colors = {
    gray: "bg-gray-100 text-gray-600",
    rose: "bg-rose-50 text-rose-700",
    gold: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
};

const ProductsManage = () => {
  const { products, deleteProduct } = useProduct();

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-semibold text-[#1C1C1C]">Produtos</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {products.length} cadastrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <NavLink
          to="/admin/products/new"
          className="flex items-center gap-2 bg-[#C6A75E] hover:bg-[#B8954D] text-[#111] px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
        >
          <span className="text-base leading-none">+</span> Novo Produto
        </NavLink>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EEE8E0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7F4] border-b border-[#EEE8E0]">
                <th className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Produto
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Preço
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Estoque
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Tipo
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Categoria
                </th>
                <th className="px-5 py-3.5 text-right text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0EB]">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-[#FAF7F4] transition-colors"
                >
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#F5F0EB] rounded-xl flex-shrink-0 overflow-hidden">
                        <img
                          src={product.image || "/images/default-perfume.jpg"}
                          alt={product.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1C1C1C] truncate max-w-[180px]">
                          {product.name}
                        </p>
                        {product.brand && (
                          <p className="text-[10px] text-[#B0A090] uppercase tracking-wide mt-0.5">
                            {product.brand}
                          </p>
                        )}
                        {/* Truncated description — max 60 chars */}
                        <p className="text-[11px] text-gray-400 mt-0.5 max-w-[220px] truncate">
                          {product.description?.slice(0, 60)}
                          {product.description?.length > 60 ? "…" : ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 font-medium text-[#5B2333] whitespace-nowrap">
                    R$ {product.price.toFixed(2)}
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-4">
                    <Badge
                      color={
                        product.stock === 0
                          ? "rose"
                          : product.stock < 10
                            ? "gold"
                            : "green"
                      }
                    >
                      {product.stock === 0 ? "Esgotado" : `${product.stock} un`}
                    </Badge>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    {product.type && <Badge>{product.type}</Badge>}
                    {product.isNewProduct && (
                      <Badge color="gold">&nbsp;Novo&nbsp;</Badge>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {product.category || "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <NavLink
                        to={`/admin/products/edit/${product._id}`}
                        className="text-xs font-medium text-[#5B2333] hover:text-[#C6A75E] transition-colors"
                      >
                        Editar
                      </NavLink>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">Nenhum produto cadastrado</p>
            </div>
          )}
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default ProductsManage;
