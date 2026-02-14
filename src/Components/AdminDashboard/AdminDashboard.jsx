import React from "react";

const AdminDashboard = () => {
  const { products, orders, users } = useApp();
  console.log(products, orders, users);
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    recentOrders: orders.slice(0, 5),
    lowStockProducts: products.filter((p) => p.stock < 20),
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu marketplace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <i className="fas fa-box text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Produtos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <i className="fas fa-shopping-bag text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <i className="fas fa-users text-purple-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Usuários
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <i className="fas fa-dollar-sign text-yellow-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {stats.totalRevenue.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Pedidos Recentes</h3>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    R$ {order.total.toFixed(2).replace(".", ",")}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            Produtos com Estoque Baixo
          </h3>
          <div className="space-y-3">
            {stats.lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{product.image}</span>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">ID: {product.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    {product.stock} unidades
                  </p>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
