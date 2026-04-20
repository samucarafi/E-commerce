import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "../../Contexts/Orders/OrderContext";

const StatusBadge = ({ status, deliveryStatus }) => {
  if (status === "approved") {
    const delivery = {
      processing: { label: "Processando", cls: "bg-blue-50 text-blue-700" },
      sent: { label: "Enviado", cls: "bg-amber-50 text-amber-700" },
      delivered: { label: "Entregue", cls: "bg-emerald-50 text-emerald-700" },
    };
    const d = delivery[deliveryStatus] ?? delivery.processing;
    return (
      <div className="flex items-center gap-2">
        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          Pago
        </span>
        <span
          className={`${d.cls} text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide`}
        >
          {d.label}
        </span>
      </div>
    );
  }
  if (status === "pending")
    return (
      <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
        Aguardando Pagamento
      </span>
    );
  if (status === "rejected")
    return (
      <span className="bg-red-50 text-red-600 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
        Pagamento Expirado
      </span>
    );
  return null;
};

const Row = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center text-sm">
    <span className={highlight ? "text-emerald-600" : "text-gray-400"}>
      {label}
    </span>
    <span
      className={`font-medium ${highlight ? "text-emerald-600" : "text-[#1C1C1C]"}`}
    >
      {value}
    </span>
  </div>
);

const OrdersPage = () => {
  const { orders, loadMyOrders, loading } = useOrder();
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C6A75E]/20 border-t-[#C6A75E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#C6A75E] text-[10px] tracking-[0.28em] uppercase mb-1">
            Histórico
          </p>
          <h1 className="text-xl font-light text-[#1C1C1C] tracking-wide">
            Meus Pedidos
          </h1>
        </div>

        {/* Empty */}
        {(!orders || orders.length === 0) && (
          <div className="bg-white rounded-2xl border border-[#EEE8E0] p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#FAF7F4] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C6A75E"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <p className="font-medium text-[#1C1C1C] mb-1">
              Nenhum pedido ainda
            </p>
            <p className="text-sm text-gray-400 mb-7">
              Explore nossa coleção e faça seu primeiro pedido
            </p>
            <Link
              to="/"
              className="inline-block bg-[#C6A75E] hover:bg-[#B8954D] text-[#111] px-8 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              Explorar Coleção
            </Link>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-3">
          {orders?.map((order) => {
            const isOpen = expanded === order._id;
            const isPending = order.payment.status === "pending";
            const isRejected = order.payment.status === "rejected";
            const isApproved = order.payment.status === "approved";

            const subtotal = order.totals?.subtotal ?? order.totals?.items ?? 0;
            const discount =
              order.totals?.discount ?? order.affiliate?.discountGiven ?? 0;
            const shippingDiscount = order.totals?.shippingDiscount ?? 0;
            const finalShipping = order.totals?.shipping ?? 0;
            const originalShipping =
              order.totals?.originalShipping ?? finalShipping;
            const couponCode =
              order.coupon?.code || order.affiliate?.couponCode || null;

            const hasOutOfStock = order.items?.some(
              (item) =>
                item.type === "product" &&
                item.productId &&
                item.productId.stock < item.quantity,
            );

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
                  <svg
                    width="12"
                    height="12"
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

                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                        Pedido
                      </p>
                      <p className="font-semibold text-[#1C1C1C] text-xs truncate">
                        #{order.orderId?.slice(-8) ?? order.orderId}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                        Total
                      </p>
                      <p className="font-semibold text-[#5B2333]">
                        R$ {Number(order.totals?.total ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                        Data
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    status={order.payment.status}
                    deliveryStatus={order.deliveryStatus}
                  />
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-[#F0E8E0] px-6 py-5 bg-[#FAF9F7] space-y-5">
                    {/* Rejected warning */}
                    {isRejected && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">
                        Pagamento expirado. Se desejar, realize um novo pedido.
                      </div>
                    )}

                    {/* Approved banner */}
                    {isApproved && order.deliveryStatus === "delivered" && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-700 flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Pedido entregue com sucesso!
                      </div>
                    )}

                    {/* Delivery address */}
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                        Entrega
                      </p>
                      <div className="bg-white rounded-xl border border-[#F0E8E0] p-4 text-sm space-y-1">
                        <p className="font-medium text-[#1C1C1C]">
                          {order.shippingAddress?.street},{" "}
                          {order.shippingAddress?.number}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {order.shippingAddress?.neighborhood} —{" "}
                          {order.shippingAddress?.city}/
                          {order.shippingAddress?.state}
                        </p>
                        <p className="text-gray-400 text-xs">
                          CEP: {order.shippingAddress?.cep}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                        Produtos
                      </p>
                      <div className="space-y-2">
                        {order.items
                          ?.filter((i) => i.type === "product" || !i.type)
                          .map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center bg-white rounded-xl border border-[#F0E8E0] px-4 py-3 text-sm"
                            >
                              <span className="text-[#1C1C1C]">
                                {item.title}{" "}
                                <span className="text-gray-400">
                                  × {item.quantity}
                                </span>
                              </span>
                              <span className="font-medium">
                                R${" "}
                                {(item.unit_price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="bg-white rounded-xl border border-[#F0E8E0] p-4 space-y-2">
                      <Row
                        label="Subtotal"
                        value={`R$ ${Number(subtotal).toFixed(2)}`}
                      />
                      {discount > 0 && (
                        <Row
                          highlight
                          label={`Desconto${couponCode ? ` (${couponCode})` : ""}`}
                          value={`− R$ ${Number(discount).toFixed(2)}`}
                        />
                      )}
                      {shippingDiscount > 0 && (
                        <Row
                          highlight
                          label="Desconto no frete"
                          value={`− R$ ${Number(shippingDiscount).toFixed(2)}`}
                        />
                      )}
                      <Row
                        label="Frete"
                        value={`R$ ${Number(finalShipping).toFixed(2)}`}
                      />
                      <div className="border-t border-[#F0E8E0] pt-2 mt-1 flex justify-between items-center">
                        <span className="font-semibold text-[#1C1C1C] text-sm">
                          Total
                        </span>
                        <span className="font-bold text-[#5B2333]">
                          R$ {Number(order.totals?.total ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    {isPending && !isRejected && (
                      <div>
                        {hasOutOfStock && (
                          <p className="text-red-600 text-xs mb-3">
                            Produto esgotado — pagamento indisponível.
                          </p>
                        )}
                        <a
                          href={order.payment?.pix?.ticket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block w-full text-center py-3 rounded-full text-sm font-semibold transition-all ${
                            hasOutOfStock
                              ? "bg-gray-100 text-gray-400 pointer-events-none"
                              : "bg-[#C6A75E] hover:bg-[#B8954D] text-[#111]"
                          }`}
                        >
                          {hasOutOfStock
                            ? "Produto esgotado"
                            : "Finalizar Pagamento"}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
