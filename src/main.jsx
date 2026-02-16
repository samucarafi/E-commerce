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

createRoot(document.getElementById("root")).render(
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
  </StrictMode>,
);
