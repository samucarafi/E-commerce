import { useEffect } from "react";
import { useOrder } from "../../Contexts/Orders/OrderContext";

const OrdersManage = () => {
  // const { adminOrders, loadAllOrders, updateOrderStatus } = useOrder(); // use o contexto

  // useEffect(() => {
  //   loadAllOrders();
  // }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Painel de Pedidos</h2>
        <p className="text-gray-600 mt-2">Página em desenvolvimento</p>
      </div>
    </div>
    // <div>
    //   <h2 className="text-2xl font-semibold mb-6">Pedidos</h2>

    //   <div className="space-y-4">
    //     {adminOrders.map((order) => (
    //       <div key={order._id} className="border p-5 rounded-xl">
    //         <p>Cliente: {order.customer.name}</p>
    //         <p>Email: {order.customer.email}</p>
    //         <p>Status: {order.payment.status}</p>

    //         <select
    //           onChange={(e) => updateOrderStatus(order._id, e.target.value)}
    //           value={order.deliveryStatus || "processing"}
    //           className="border p-2 mt-2"
    //         >
    //           <option value="processing">Processando</option>
    //           <option value="shipped">Enviado</option>
    //           <option value="delivered">Entregue</option>
    //         </select>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
};

export default OrdersManage;
