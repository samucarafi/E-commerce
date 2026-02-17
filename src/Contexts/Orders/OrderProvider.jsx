import { useEffect, useState } from "react";
import { OrderContext } from "./OrderContext";
import { apiServices } from "../../services/apiServices";

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =============================
  // USER ORDERS
  // =============================
  const loadMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await apiServices.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ADMIN ORDERS
  // =============================
  const loadAllOrders = async () => {
    try {
      setLoading(true);
      const { data } = await apiServices.getAllOrders();
      setAdminOrders(data);
    } catch (err) {
      setError(err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // SINGLE ORDER
  // =============================
  const getOrderById = async (id) => {
    try {
      setLoading(true);
      const { data } = await apiServices.getOrder(id);
      setSelectedOrder(data.order);
      return data.order;
    } catch (err) {
      setError("Erro ao buscar pedido");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // CREATE ORDER
  // =============================
  const createOrder = async (payload) => {
    try {
      setLoading(true);
      const { data } = await apiServices.createOrder(payload);
      setOrders((prev) => [data.order, ...prev]);
      return { success: true, order: data.order };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // UPDATE STATUS (ADMIN)
  // =============================
  const updateOrderStatus = async (id, status) => {
    try {
      const { data } = await apiServices.updateOrderStatus(id, status);

      setAdminOrders((prev) => prev.map((o) => (o._id === id ? data : o)));

      return true;
    } catch {
      return false;
    }
  };

  // =============================
  // REFRESH PAYMENT STATUS (MP)
  // =============================
  const refreshPaymentStatus = async (id) => {
    try {
      const { data } = await apiServices.refreshPayment(id);

      setOrders((prev) => prev.map((o) => (o._id === id ? data.order : o)));

      return data.order;
    } catch {
      return null;
    }
  };

  // =============================
  // HELPERS
  // =============================
  const getTotalSpent = () =>
    orders.reduce((sum, o) => sum + o.totals.total, 0);

  const getPendingOrders = () =>
    orders.filter((o) => o.payment.status === "pending");

  const getPaidOrders = () =>
    orders.filter((o) => o.payment.status === "approved");

  return (
    <OrderContext.Provider
      value={{
        orders,
        adminOrders,
        selectedOrder,
        loading,
        error,

        setError,
        setSelectedOrder,

        loadMyOrders,
        loadAllOrders,
        getOrderById,
        createOrder,
        updateOrderStatus,
        refreshPaymentStatus,

        getTotalSpent,
        getPendingOrders,
        getPaidOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
