import { useEffect } from "react";
import { useOrder } from "../../Contexts/Orders/OrderContext";

const OrdersPage = () => {
  const { orders, loadMyOrders, loading } = useOrder();
  useEffect(() => {
    loadMyOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

      {orders.length === 0 && (
        <p className="text-gray-500">Você ainda não fez pedidos.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-6 bg-white shadow"
          >
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Pedido #{order.orderId}</span>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.payment.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.payment.status}
              </span>
            </div>

            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.title} x{item.quantity}
                  </span>
                  <span>R$ {(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right font-bold">
              Total: R$ {order.totals.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
