import { api } from "../config/api";

export const apiServices = {
  // Autenticação
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  verifyEmail: (token) => api.get(`/auth/verify?token=${token}`),
  resendVerification: (email) =>
    api.post("/auth/resend-verification", { email }),

  // Produtos
  getProducts: () => api.get("/products"),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post("/products", productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),

  // Usuários (Admin)
  getUsers: () => api.get("/admin/users"),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Pedidos
  getMyOrders: () => api.get("/orders"),

  getOrder: (id) => api.get(`/orders/${id}`),

  createOrder: (payload) => api.post("/orders", payload),

  refreshPayment: (id) => api.patch(`/orders/${id}/refresh-payment`),
  // ORDERS ADMIN
  // ===============================
  getAllOrders: () => api.get("/admin/orders"),

  updateOrderStatus: (id, status) =>
    api.patch(`/admin/orders/${id}/status`, { status }),

  // PAYMENT
  // ===============================
  createPixPayment: (payload) => api.post("/payments/pix", payload),
  payOrder: (id) => api.get(`/orders/${id}/pay`),
  createCardPayment: (payload) => api.post("/payments/card", payload),

  generatePix: (orderId) => api.post(`/orders/${orderId}/pix`),
  checkOrderStatus: (orderId) => api.get(`/orders/${orderId}/status`),
  getOrders: () => api.get("/orders"),
  getAdminOrders: () => api.get("/admin/orders"),

  // Categorias
  getCategories: () => api.get("/categories"),
  createCategory: (categoryData) => api.post("/categories", categoryData),
  updateCategory: (id, categoryData) =>
    api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // Frete e Endereços
  calculateShipping: (shippingData) =>
    api.post("/shipping/calculate", shippingData),
  validateCep: (cep) => api.get(`/shipping/validate-cep/${cep}`),
  getShippingOptions: () => api.get("/shipping/options"),
  getShippingConfig: () => api.get("/shipping-config"),
  updateShippingConfig: (payload) => api.put("/shipping-config", payload),

  // Pagamentos
  createPayment: (paymentData) => api.post("/payments/create", paymentData),
  confirmPayment: (paymentId) => api.post(`/payments/${paymentId}/confirm`),
  getPaymentStatus: (paymentId) => api.get(`/payments/${paymentId}/status`),
  getPaymentMethods: () => api.get("/payments/methods"),

  // Cupons e Promoções
  validateCoupon: (couponCode) =>
    api.post("/coupons/validate", { code: couponCode }),
  applyCoupon: (couponCode, orderData) =>
    api.post("/coupons/apply", { code: couponCode, order: orderData }),
};
