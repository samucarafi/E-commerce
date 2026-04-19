import { useEffect, useMemo, useState } from "react";
import { useOrder } from "../../Contexts/Orders/OrderContext";

const STATUS_FILTERS = [
  { id: "approved_processing", label: "Pagos · Processar" },
  { id: "approved", label: "Pagos" },
  { id: "pending", label: "Pendentes" },
  { id: "sent", label: "Enviados" },
  { id: "delivered", label: "Entregues" },
  { id: "all", label: "Todos" },
];

const PayBadge = ({ status }) => {
  const map = {
    approved: { label: "Pago", cls: "bg-emerald-50 text-emerald-700" },
    pending: { label: "Pendente", cls: "bg-amber-50 text-amber-700" },
    rejected: { label: "Recusado", cls: "bg-red-50 text-red-600" },
  };
  const { label, cls } = map[status] ?? {
    label: status ?? "—",
    cls: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${cls}`}
    >
      {label}
    </span>
  );
};

const Row = ({ label, value, highlight, strike }) => (
  <div className="flex justify-between text-xs">
    <span className={highlight ? "text-emerald-600" : "text-gray-400"}>
      {label}
    </span>
    <span
      className={`font-medium ${highlight ? "text-emerald-600" : strike ? "line-through text-gray-300" : "text-[#1C1C1C]"}`}
    >
      {value}
    </span>
  </div>
);

const OrdersManage = () => {
  const { adminOrders, loadAllOrders, updateOrderStatus } = useOrder();
  const [filter, setFilter] = useState("approved_processing");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadAllOrders();
  }, []);

  const filtered = useMemo(() => {
    if (!adminOrders) return [];
    switch (filter) {
      case "approved_processing":
        return adminOrders.filter(
          (o) =>
            o.payment?.status === "approved" &&
            (!o.deliveryStatus || o.deliveryStatus === "processing"),
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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#1C1C1C]">Pedidos</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {filtered.length} pedido{filtered.length !== 1 ? "s" : ""} encontrado
          {filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-7">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f.id
                ? "bg-[#5B2333] text-white"
                : "border border-[#E8DDD0] text-gray-500 hover:border-[#5B2333] hover:text-[#5B2333]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EEE8E0] p-16 text-center text-gray-400 text-sm">
          Nenhum pedido encontrado
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isOpen = expanded === order._id;
            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-[#EEE8E0] shadow-sm overflow-hidden"
              >
                {/* Collapsed row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#FAF7F4] transition-colors text-left"
                >
                  {/* Expand icon */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 text-gray-300 transition-transform"
                    style={{
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>

                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                        Pedido
                      </p>
                      <p className="font-semibold text-[#1C1C1C] truncate">
                        #{order.orderId}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                        Cliente
                      </p>
                      <p className="text-[#1C1C1C] truncate">
                        {order.customer?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                        Total
                      </p>
                      <p className="font-semibold text-[#5B2333]">
                        R$ {order.totals?.total?.toFixed(2) ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PayBadge status={order.payment?.status} />
                    </div>
                  </div>

                  {/* Status selector - stop propagation */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.deliveryStatus || "processing"}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="border border-[#E8DDD0] rounded-xl px-3 py-1.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#C6A75E] cursor-pointer bg-white"
                    >
                      <option value="processing">Processando</option>
                      <option value="sent">Enviado</option>
                      <option value="delivered">Entregue</option>
                    </select>
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-[#F0E8E0] px-6 py-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#FAF9F7]">
                    {/* Cliente */}
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                        Cliente
                      </p>
                      <p className="text-sm font-medium text-[#1C1C1C]">
                        {order.customer?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.customer?.email}
                      </p>
                      {order.userId?.cpf && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          CPF: {order.userId.cpf}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>

                    {/* Endereço */}
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                        Endereço
                      </p>
                      <p className="text-sm text-[#1C1C1C]">
                        {order.shippingAddress?.street},{" "}
                        {order.shippingAddress?.number}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.shippingAddress?.neighborhood} —{" "}
                        {order.shippingAddress?.city} /{" "}
                        {order.shippingAddress?.state}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        CEP: {order.shippingAddress?.cep}
                      </p>
                    </div>

                    {/* Totais */}
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                        Valores
                      </p>
                      <div className="space-y-1.5">
                        <Row
                          label="Subtotal"
                          value={`R$ ${(order.totals?.subtotal ?? order.totals?.items ?? 0).toFixed(2)}`}
                        />

                        {(order.totals?.discount ??
                          order.affiliate?.discountGiven ??
                          0) > 0 && (
                          <Row
                            highlight
                            label={`Desconto${order.coupon?.code ? ` (${order.coupon.code})` : order.affiliate?.couponCode ? ` (${order.affiliate.couponCode})` : ""}`}
                            value={`− R$ ${(order.totals?.discount ?? order.affiliate?.discountGiven ?? 0).toFixed(2)}`}
                          />
                        )}

                        {(order.totals?.shippingDiscount ?? 0) > 0 && (
                          <Row
                            highlight
                            label="Desconto no frete"
                            value={`− R$ ${order.totals.shippingDiscount.toFixed(2)}`}
                          />
                        )}

                        <Row
                          label="Frete"
                          value={`R$ ${(order.totals?.shipping ?? 0).toFixed(2)}`}
                        />

                        <div className="border-t border-[#E8DDD0] pt-1.5 mt-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-[#1C1C1C]">
                              Total
                            </span>
                            <span className="font-bold text-[#5B2333]">
                              R$ {(order.totals?.total ?? 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Produtos (full width) */}
                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                        Produtos
                      </p>
                      <div className="space-y-1.5">
                        {order.items
                          ?.filter(
                            (item) => item.type === "product" || !item.type,
                          )
                          .map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-xs bg-white rounded-xl px-4 py-2.5 border border-[#F0E8E0]"
                            >
                              <span className="text-[#1C1C1C]">
                                {item.title}{" "}
                                <span className="text-gray-400">
                                  × {item.quantity}
                                </span>
                              </span>
                              <span className="font-medium text-[#1C1C1C]">
                                R${" "}
                                {(item.unit_price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersManage;
