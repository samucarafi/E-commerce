import { useEffect, useMemo, useState } from "react";
import { useOrder } from "../../Contexts/Orders/OrderContext";

const OrdersManage = () => {
  const { adminOrders, loadAllOrders, updateOrderStatus } = useOrder();

  const [filter, setFilter] = useState("approved_processing");

  useEffect(() => {
    loadAllOrders();
  }, []);

  // ================================
  // FILTRO INTELIGENTE
  // ================================
  const filteredOrders = useMemo(() => {
    if (!adminOrders) return [];

    switch (filter) {
      case "approved_processing":
        return adminOrders.filter(
          (o) =>
            o.payment?.status === "approved" &&
            (o.deliveryStatus === "processing" || !o.deliveryStatus),
        );

      case "approved":
        return adminOrders.filter((o) => o.payment?.status === "approved");

      case "pending":
        return adminOrders.filter((o) => o.payment?.status !== "approved");

      case "sent":
        return adminOrders.filter((o) => o.deliveryStatus === "sent");

      case "delivered":
        return adminOrders.filter((o) => o.deliveryStatus === "delivered");

      default:
        return adminOrders;
    }
  }, [adminOrders, filter]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8">Painel de Pedidos</h2>

      {/* ================= FILTRO ================= */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { id: "approved_processing", label: "Pagos + Processando" },
          { id: "approved", label: "Pagos" },
          { id: "pending", label: "Pendentes" },
          { id: "sent", label: "Enviados" },
          { id: "delivered", label: "Entregues" },
          { id: "all", label: "Todos" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                filter === f.id
                  ? "bg-[#5B2333] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ================= LISTA ================= */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded-2xl p-6 border"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold text-lg">
                    Pedido #{order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.payment?.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.payment?.status}
                </span>
              </div>

              {/* CLIENTE */}
              <div className="mb-4">
                <p className="font-medium">Cliente</p>
                <p>{order.customer?.name}</p>
                <p className="text-sm text-gray-600">{order.customer?.email}</p>

                {order.userId?.cpf && (
                  <p className="text-sm text-gray-500">
                    CPF: {order.userId.cpf}
                  </p>
                )}
              </div>

              {/* ENDEREÇO */}
              <div className="mb-4">
                <p className="font-medium">Endereço</p>
                <p>
                  {order.shippingAddress?.street},{" "}
                  {order.shippingAddress?.number}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.neighborhood} —{" "}
                  {order.shippingAddress?.city} / {order.shippingAddress?.state}
                </p>
                <p className="text-sm text-gray-500">
                  CEP: {order.shippingAddress?.cep}
                </p>
              </div>

              {/* PRODUTOS */}
              <div className="mb-4">
                <p className="font-medium mb-2">Produtos</p>

                <div className="space-y-1 text-sm">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between border-b pb-1">
                      <span>
                        {item.title} × {item.quantity}
                      </span>
                      <span>
                        R$ {(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between border-b pb-1">
                    <span>Frete</span>
                    <span>
                      R$ {order.totals?.shipping?.toFixed?.(2) ?? "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* TOTAL */}
              <div className="flex justify-between items-center mt-4">
                <p className="font-bold text-lg">
                  Total: R$ {order.totals?.total?.toFixed(2) || "0.00"}
                </p>

                <select
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  value={order.deliveryStatus || "processing"}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="processing">Processando</option>
                  <option value="sent">Enviado</option>
                  <option value="delivered">Entregue</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersManage;
