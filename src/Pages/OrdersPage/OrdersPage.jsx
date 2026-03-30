import { useEffect } from "react";
import { useOrder } from "../../Contexts/Orders/OrderContext";

const OrdersPage = () => {
  const { orders, loadMyOrders, loading, payOrder } = useOrder();

  useEffect(() => {
    loadMyOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

      {(!orders || orders.length === 0) && (
        <p className="text-gray-500">Você ainda não fez pedidos.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => {
          const isPending = order.payment.status === "pending";
          const isApproved = order.payment.status === "approved";

          const hasOutOfStock = order.items?.some(
            (item) =>
              item.type === "product" &&
              item.productId &&
              item.productId.stock < item.quantity,
          );

          const subtotal = order.totals?.subtotal ?? order.totals?.items ?? 0;

          const discount =
            order.totals?.discount ?? order.affiliate?.discountGiven ?? 0;

          const shippingDiscount = order.totals?.shippingDiscount ?? 0;
          const finalShipping = order.totals?.shipping ?? 0;
          const originalShipping =
            order.totals?.originalShipping ?? finalShipping;

          const couponCode =
            order.coupon?.code || order.affiliate?.couponCode || null;

          const couponType =
            order.coupon?.type ||
            (order.affiliate?.couponCode ? "affiliate" : null);

          return (
            <div
              key={order._id}
              className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Pedido</p>
                  <p className="font-semibold text-lg">#{order.orderId}</p>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium w-fit ${
                    isApproved
                      ? "bg-green-100 text-green-700"
                      : isPending
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.payment.status}
                </span>
              </div>

              {/* ENTREGA */}
              <div className="mt-4 border-t pt-4 text-sm space-y-1">
                <p className="font-semibold text-gray-800 mb-1">Entrega</p>

                <p>
                  {order.shippingAddress?.street},{" "}
                  {order.shippingAddress?.number}
                </p>

                <p className="text-gray-500">
                  {order.shippingAddress?.neighborhood} —{" "}
                  {order.shippingAddress?.city}/{order.shippingAddress?.state}
                </p>

                <p className="text-gray-500">
                  CEP: {order.shippingAddress?.cep}
                </p>

                <div className="flex justify-between mt-2">
                  <span>Status</span>
                  <span className="font-medium capitalize">
                    {order.deliveryStatus || "processando"}
                  </span>
                </div>
              </div>

              {/* ITENS */}
              <div className="mt-4 border-t pt-4 text-sm space-y-2">
                {order.items
                  ?.filter((item) => item.type === "product" || !item.type)
                  .map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {item.title} x{item.quantity}
                      </span>
                      <span>
                        R$ {(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                <div className="flex justify-between text-gray-600 pt-2">
                  <span>Subtotal dos produtos</span>
                  <span>R$ {Number(subtotal).toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>
                      Desconto
                      {couponCode ? ` (${couponCode})` : ""}
                    </span>
                    <span>- R$ {Number(discount).toFixed(2)}</span>
                  </div>
                )}

                {shippingDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Desconto no frete</span>
                    <span>- R$ {Number(shippingDiscount).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 pt-2">
                  <span>
                    Frete
                    {originalShipping > finalShipping
                      ? ` (de R$ ${Number(originalShipping).toFixed(2)})`
                      : ""}
                  </span>
                  <span>R$ {Number(finalShipping).toFixed(2)}</span>
                </div>

                {couponCode && (
                  <div className="flex justify-between text-gray-500 pt-1">
                    <span>Cupom aplicado</span>
                    <span>{couponCode}</span>
                  </div>
                )}

                {couponType && (
                  <div className="flex justify-between text-gray-500">
                    <span>Tipo de cupom</span>
                    <span>
                      {couponType === "percentage" && "Percentual"}
                      {couponType === "fixed" && "Fixo"}
                      {couponType === "shipping" && "Frete"}
                      {couponType === "affiliate" && "Afiliado"}
                    </span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>R$ {Number(order.totals?.total ?? 0).toFixed(2)}</span>
                </div>
              </div>

              {/* BOTÃO PAGAR */}
              {isPending && (
                <div className="mt-6">
                  {hasOutOfStock && (
                    <p className="text-red-600 text-sm mb-3 font-medium">
                      Produto esgotado — pagamento indisponível
                    </p>
                  )}

                  <button
                    onClick={() => payOrder(order._id)}
                    disabled={hasOutOfStock}
                    className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-sm ${
                      hasOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#2E2E2E] hover:bg-black text-white hover:shadow-md active:scale-[0.98]"
                    }`}
                  >
                    {hasOutOfStock ? "Produto esgotado" : "Finalizar Pagamento"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
