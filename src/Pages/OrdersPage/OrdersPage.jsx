import { useEffect } from "react";
import { useOrder } from "../../Contexts/Orders/OrderContext";

const OrdersPage = () => {
  const { orders, loadMyOrders, loading } = useOrder();
  useEffect(() => {
    loadMyOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;

  return (
    // <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center">
    //   <div className="text-center">
    //     <h2 className="text-2xl font-bold">Perfil do Usuário</h2>
    //     <p className="text-gray-600 mt-2">Página em desenvolvimento</p>
    //   </div>
    // </div>
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

      {(!orders || orders.length === 0) && (
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

            {/* ENTREGA */}
            <div className="mt-4 border-t pt-3 text-sm space-y-1">
              <p className="font-semibold text-gray-800 mb-1">Entrega</p>

              <p>
                {order.shippingAddress?.street}, {order.shippingAddress?.number}
              </p>

              <p className="text-gray-500">
                {order.shippingAddress?.neighborhood} —{" "}
                {order.shippingAddress?.city}/{order.shippingAddress?.state}
              </p>

              <p className="text-gray-500">CEP: {order.shippingAddress?.cep}</p>

              <div className="flex justify-between mt-2">
                <span>Status</span>
                <span className="font-medium capitalize">
                  {order.deliveryStatus || "processando"}
                </span>
              </div>
            </div>

            {/* VALORES */}

            <div className="mt-4 border-t pt-3 text-sm space-y-2">
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>
                      {item.title} x{item.quantity}
                    </span>
                    <span>
                      R$ {(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>R$ {order.totals?.shipping?.toFixed?.(2) ?? "0.00"}</span>
              </div>

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>R$ {order.totals?.total?.toFixed?.(2) ?? "0.00"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
