import { useEffect, useMemo, useState } from "react";
import { useOrder } from "../../Contexts/Orders/OrderContext";

const OrdersManage = () => {
  const { adminOrders, loadAllOrders, updateOrderStatus } = useOrder();
  const [filter, setFilter] = useState("approved_processing");

  useEffect(() => {
    loadAllOrders();
  }, []);

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
      {/* HEADER */}
      <div className="bg-[#5B2333] text-[#F5E6D3] px-8 py-6 rounded-3xl mb-8 shadow-xl">
        <h2 className="text-2xl font-semibold tracking-wide">
          Painel de Pedidos
        </h2>
        <p className="text-[#D4A5A5] text-sm mt-1">
          Gerencie pagamentos e entregas
        </p>
      </div>

      {/* FILTROS */}
      <div className="mb-8 flex flex-wrap gap-3">
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
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all
              ${
                filter === f.id
                  ? "bg-[#5B2333] text-[#F5E6D3]"
                  : "border border-[#D4A5A5] text-[#5B2333] hover:bg-[#F1E8E2]"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl shadow-xl border border-[#E8D8C3] p-8"
            >
              {/* HEADER PEDIDO */}
              <div className="flex justify-between mb-6">
                <div>
                  <p className="font-semibold text-lg text-[#5B2333]">
                    Pedido #{order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium
                    ${
                      order.payment?.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {order.payment?.status}
                </span>
              </div>

              {/* CLIENTE */}
              <div className="mb-6">
                <p className="font-medium text-[#5B2333] mb-2">Cliente</p>
                <p>{order.customer?.name}</p>
                <p className="text-sm text-gray-600">{order.customer?.email}</p>
                {order.userId?.cpf && (
                  <p className="text-sm text-gray-500">
                    CPF: {order.userId.cpf}
                  </p>
                )}
              </div>

              {/* ENDEREÇO */}
              <div className="mb-6">
                <p className="font-medium text-[#5B2333] mb-2">Endereço</p>
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
              <div className="mb-6">
                <p className="font-medium text-[#5B2333] mb-3">Produtos</p>

                <div className="space-y-2 text-sm">
                  {order.items
                    ?.filter((item) => item.type === "product" || !item.type)
                    .map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between border-b border-[#E8D8C3] pb-2"
                      >
                        <span>
                          {item.title} × {item.quantity}
                        </span>
                        <span>
                          R$ {(item.unit_price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}

                  <div className="flex justify-between border-b border-[#E8D8C3] pb-2">
                    <span>Subtotal dos produtos</span>
                    <span>
                      R${" "}
                      {order.totals?.subtotal?.toFixed?.(2) ??
                        order.totals?.items?.toFixed?.(2) ??
                        "0.00"}
                    </span>
                  </div>

                  {(order.totals?.discount ??
                    order.affiliate?.discountGiven ??
                    0) > 0 && (
                    <div className="flex justify-between border-b border-[#E8D8C3] pb-2 text-green-700">
                      <span>
                        Desconto
                        {order.coupon?.code
                          ? ` (${order.coupon.code})`
                          : order.affiliate?.couponCode
                            ? ` (${order.affiliate.couponCode})`
                            : ""}
                      </span>
                      <span>
                        - R${" "}
                        {(
                          order.totals?.discount ??
                          order.affiliate?.discountGiven ??
                          0
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {(order.totals?.shippingDiscount ?? 0) > 0 && (
                    <div className="flex justify-between border-b border-[#E8D8C3] pb-2 text-green-700">
                      <span>Desconto no frete</span>
                      <span>
                        - R$ {order.totals.shippingDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between border-b border-[#E8D8C3] pb-2">
                    <span>
                      Frete
                      {(order.totals?.originalShipping ?? 0) >
                      (order.totals?.shipping ?? 0)
                        ? ` (de R$ ${order.totals.originalShipping.toFixed(2)})`
                        : ""}
                    </span>
                    <span>
                      R$ {order.totals?.shipping?.toFixed?.(2) ?? "0.00"}
                    </span>
                  </div>

                  {(order.coupon?.applied || order.affiliate?.couponCode) && (
                    <div className="flex justify-between pb-2">
                      <span className="text-[#5B2333] font-medium">
                        Cupom aplicado
                      </span>
                      <span className="text-[#5B2333]">
                        {order.coupon?.code || order.affiliate?.couponCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E8D8C3]">
                <div>
                  <p className="font-bold text-lg text-[#5B2333]">
                    Total: R$ {order.totals?.total?.toFixed?.(2) || "0.00"}
                  </p>

                  {(order.coupon?.type || order.affiliate?.couponCode) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {order.coupon?.type === "percentage" &&
                        "Cupom percentual aplicado"}
                      {order.coupon?.type === "fixed" && "Cupom fixo aplicado"}
                      {order.coupon?.type === "shipping" &&
                        "Cupom de frete aplicado"}
                      {order.coupon?.type === "affiliate" &&
                        "Cupom de afiliado aplicado"}
                      {!order.coupon?.type &&
                        order.affiliate?.couponCode &&
                        "Cupom aplicado"}
                    </p>
                  )}
                </div>
                <select
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  value={order.deliveryStatus || "processing"}
                  className="px-4 py-2 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
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
