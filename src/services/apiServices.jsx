import { api } from "../config/api";

export const apiServices = {
  // Autenticação
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),

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
  createOrder: (orderData) => api.post("/orders", orderData),
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
