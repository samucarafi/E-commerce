import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Contexts/Auth/AuthContext";
import Header from "./Components/Header/Header";
import HomePage from "./Pages/HomePage/HomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import AdminPage from "./Pages/AdminPage/AdminPage";
import CheckoutPage from "./Pages/CheckoutPage/CheckoutPage";
import VerifiedSuccess from "./Pages/VerifiedSucess/VerifiedSucess";
import VerifiedError from "./Pages/VerifiedError/VerifiedError";
import CheckEmail from "./Pages/CheckEmail/CheckEmail";
import ProductForm from "./Components/ProductForm/ProductForm";
import ProductsManage from "./Components/ProductsManage/ProductsManage";
import UserManage from "./Components/UserManage/UserManage";
import ShippingConfig from "./Components/ShippingConfig/ShippingConfig";
import PaymentsConfig from "./Components/PaymentsConfig/PaymentsConfig";
import OrdersManage from "./Components/OrdersManage/OrdersManage";
import OrdersPage from "./Pages/OrdersPage/OrdersPage";
import Success from "./Pages/Success/Success";
import Failure from "./Pages/Failure/Failure";
import Pending from "./Pages/Pending/Pending";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import CouponsManage from "./Components/CouponsManage/CouponsManage";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  const hideHeader =
    ["/checkout"].some((r) => location.pathname.startsWith(r)) ||
    location.pathname.startsWith("/order-success");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-[#C6A75E]/20 border-t-[#C6A75E] rounded-full animate-spin mx-auto" />
          <p className="mt-6 text-gray-400 font-light text-sm tracking-wide">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen bg-[#F8F5F2] text-[#2E2E2E]">
      {/* Header no longer needs searchTerm props — managed by ProductContext */}
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<HomePage />} />
        <Route path="/verified-success" element={<VerifiedSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verified-error" element={<VerifiedError />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/admin" element={<AdminPage />}>
          <Route path="products" element={<ProductsManage />}>
            <Route path="edit/:id" element={<ProductForm />} />
            <Route path="new" element={<ProductForm />} />
          </Route>
          <Route path="coupons" element={<CouponsManage />} />
          <Route path="users" element={<UserManage />} />
          <Route path="shipping" element={<ShippingConfig />} />
          <Route path="orders" element={<OrdersManage />} />
          <Route path="payments" element={<PaymentsConfig />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
