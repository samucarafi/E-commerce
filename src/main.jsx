import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Contexts/Auth/AuthProvider.jsx";
import { CheckoutProvider } from "./Contexts/Checkout/CheckoutProvider.jsx";
import { CartProvider } from "./Contexts/Cart/CartProvider.jsx";
import { ProductProvider } from "./Contexts/Product/ProductProvider.jsx";
import { OrderProvider } from "./Contexts/Orders/OrderProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <CheckoutProvider>
                <OrderProvider>
                  <App />
                </OrderProvider>
              </CheckoutProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  </GoogleOAuthProvider>,
);
