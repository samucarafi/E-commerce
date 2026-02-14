import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../Contexts/App/AppContext";
import OrderDetailsModal from "../OrderDetailsModal/OrderDetailsModal";

const OrdersTab = () => {
  const { userOrders } = useApp();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (userOrders.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">Meus Pedidos</h3>
        <div className="text-center py-8">
          <i className="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Você ainda não fez nenhum pedido</p>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Começar a Comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Meus Pedidos</h3>
        <div className="text-sm text-gray-600">
          {userOrders.length} pedido{userOrders.length !== 1 ? "s" : ""}{" "}
          encontrado{userOrders.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-4">
        {userOrders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-lg">Pedido #{order.id}</h4>
                  <span
                  // className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  //   order.status
                  // )}`}
                  >
                    {/* {getStatusText(order.status)} */}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    <i className="fas fa-calendar mr-1"></i>
                    {new Date(order.date_created).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {order.preferenceId && (
                    <span>
                      <i className="fab fa-cc-mastercard mr-1"></i>
                      Mercado Pago
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {/* <i className={getPaymentStatusIcon(order.paymentStatus)}></i> */}
                  <span
                  // className={`text-sm font-medium ${
                  //   getStatusColor(order.paymentStatus).split(" ")[1]
                  // }`}
                  >
                    {/* {getStatusText(order.paymentStatus)} */}
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {/* R$ {order.total.toFixed(2).replace(".", ",")} */}
                </div>
              </div>
            </div>

            {/* Items Preview */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-box text-gray-400"></i>
                <span className="text-sm font-medium text-gray-700">
                  {order.items.length || 0} item
                  {(order.items.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-1">
                {order.items?.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.title} (x{item.quantity})
                    </span>
                    <span className="text-gray-800 font-medium">
                      R${" "}
                      {(item.unit_price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  </div>
                ))}
                {(order.items.length || 0) > 2 && (
                  <div className="text-sm text-blue-600">
                    +{(order.items.length || 0) - 2} item
                    {(order.items.length || 0) - 2 !== 1 ? "s" : ""} adicional
                    {(order.items.length || 0) - 2 !== 1 ? "is" : ""}
                  </div>
                )}
              </div>
            </div>

            {/* Actions and Info */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {order.trackingCode && (
                  <span>
                    <i className="fas fa-truck mr-1"></i>
                    Rastreio: {order.trackingCode}
                  </span>
                )}
                {order.mercadoPagoData?.shipments?.receiver_address && (
                  <span>
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {order.mercadoPagoData.shipments.receiver_address.city_name}
                    ,{" "}
                    {
                      order.mercadoPagoData.shipments.receiver_address
                        .state_name
                    }
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  <i className="fas fa-eye mr-2"></i>Ver Detalhes
                </button>
                {order.paymentStatus === "approved" &&
                  order.status !== "delivered" && (
                    <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                      <i className="fas fa-times mr-2"></i>Cancelar
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrdersTab;
