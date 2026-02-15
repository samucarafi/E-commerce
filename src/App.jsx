import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Contexts/Auth/AuthContext";
import Header from "./Components/Header/Header";
import HomePage from "./Pages/HomePage/HomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import AdminPage from "./Pages/AdminPage/AdminPage";
import CheckoutPage from "./Pages/CheckoutPage/CheckoutPage";
import OrderSuccessPage from "./Pages/OrderSuccessPage/OrderSuccessPage";
import ProductForm from "./Components/ProductForm/ProductForm";
import ProductsManage from "./Components/ProductsManage/ProductsManage";
import UserManage from "./Components/UserManage/UserManage";
import ShippingConfig from "./Components/ShippingConfig/ShippingConfig";
import PaymentsConfig from "./Components/PaymentsConfig/PaymentsConfig";
import VerifiedSuccess from "./Pages/VerifiedSucess/VerifiedSucess";
import VerifiedError from "./Pages/VerifiedError/VerifiedError";
import CheckEmail from "./Pages/CheckEmail/CheckEmail";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading } = useAuth();
  const handleSearch = () => {
    // A busca é tratada no HomePage
  };
  const location = useLocation();

  const hideHeaderRoutes = ["/login", "/checkout"];
  const hideHeader =
    hideHeaderRoutes.some((route) => location.pathname.startsWith(route)) ||
    location.pathname.startsWith("/order-success");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-[1400px] mx-auto min-h-screen bg-[#F8F5F2] text-[#2E2E2E]">
      {!hideHeader && (
        <Header
          onSearch={handleSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          }
        />

        <Route path="/verified-success" element={<VerifiedSuccess />} />
        <Route path="/verified-error" element={<VerifiedError />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/products" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route path="products" element={<ProductsManage />}>
            <Route path="edit/:id" element={<ProductForm />} />
            <Route path="new" element={<ProductForm />} />
          </Route>
          <Route path="users" element={<UserManage />} />
          <Route path="shipping" element={<ShippingConfig />} />
          <Route
            path="orders"
            element={
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 cl9assName="text-xl font-semibold text-gray-800 mb-2">
                  Gerenciamento de Pedidos
                </h3>
                <p className="text-gray-600">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
            }
          />
          <Route path="payments" element={<PaymentsConfig />} />
        </Route>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
        <Route
          path="/profile"
          element={
            <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Perfil do Usuário</h2>
                <p className="text-gray-600 mt-2">Página em desenvolvimento</p>
              </div>
            </div>
          }
        />
        <Route
          path="/orders"
          element={
            <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Meus Pedidos</h2>
                <p className="text-gray-600 mt-2">Página em desenvolvimento</p>
              </div>
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
