import React from "react";
import { useProduct } from "../../Contexts/Product/ProductContext";
import { NavLink, Outlet } from "react-router-dom";

const ProductsManage = () => {
  const { products, deleteProduct } = useProduct();

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#5B2333]">
          Gerenciar Produtos
        </h2>

        <NavLink
          to={`/admin/products/new`}
          className="bg-[#5B2333] hover:bg-[#4a1c29] text-[#F5E6D3] px-6 py-2 rounded-full transition-all"
        >
          + Novo Produto
        </NavLink>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E8D8C3]">
        <table className="w-full bg-white">
          <thead className="bg-[#F1E8E2] text-[#5B2333] text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4 text-left">Produto</th>
              <th className="px-6 py-4 text-left">Preço</th>
              <th className="px-6 py-4 text-left">Estoque</th>
              <th className="px-6 py-4 text-left">Peso</th>
              <th className="px-6 py-4 text-left">Categoria</th>
              <th className="px-6 py-4 text-left">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E8D8C3]">
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-[#F8F5F2] transition-all"
              >
                <td className="px-6 py-4 flex items-center">
                  <img
                    src={product.image || "/images/default-perfume.jpg"}
                    alt={product.name}
                    className="w-14 h-14 object-contain rounded-lg mr-4"
                  />
                  <div>
                    <div className="font-medium text-[#2E2E2E]">
                      {product.name}
                    </div>
                    <div className="text-sm text-[#A38B6D]">
                      {product.description}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">R$ {product.price.toFixed(2)}</td>

                <td className="px-6 py-4">{product.stock}</td>

                <td className="px-6 py-4">{product.weight}kg</td>

                <td className="px-6 py-4">{product.category}</td>

                <td className="px-6 py-4 space-x-4">
                  <NavLink
                    to={`/admin/products/edit/${product._id}`}
                    className="text-[#5B2333] hover:text-[#C6A75E]"
                  >
                    Editar
                  </NavLink>

                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Outlet />
    </div>
  );
};

export default ProductsManage;
