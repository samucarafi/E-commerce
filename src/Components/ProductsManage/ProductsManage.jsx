import React from "react";
import { useProduct } from "../../Contexts/Product/ProductContext";
import { NavLink, Outlet } from "react-router-dom";

const ProductsManage = ({ handleDeleteProduct }) => {
  const { products } = useProduct();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h2>
        <NavLink
          to={`/admin/products/new`}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
        >
          + Novo Produto
        </NavLink>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estoque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Peso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-contain mr-3 rounded-lg"
                      />
                    ) : (
                      <img
                        src={"/images/default-perfume.jpg"}
                        alt={product.name}
                        className="w-12 h-12 object-contain mr-3 rounded-lg"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  R$ {product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.weight}kg
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <NavLink
                    to={`/admin/products/edit/${product._id}`}
                    className="text-blue-600 hover:text-blue-800"
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
