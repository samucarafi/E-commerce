import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useCart } from "../../Contexts/Cart/CartContext";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useCheckout } from "../../Contexts/Checkout/CheckoutContext";
import { shippingUtils } from "../../Utils/shippingUtils";

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);

  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    currentStep,
    nextStep,
    prevStep,
    shippingAddress,
    setShippingAddress,
    selectedShipping,
    setSelectedShipping,
    selectedPayment,
    couponCode,
    setCouponCode,
    appliedCoupon,
    calculateShipping,
    applyCoupon,
    createOrder,
  } = useCheckout();

  useEffect(() => {
    if (!user) navigate("/login");
    if (cartItems.length === 0) navigate("/");
  }, [user, cartItems, navigate]);

  // ================================
  // PAGAMENTO EXTERNO
  // ================================
  const handleExternalPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/create-checkout`,
        {
          cartItems,
          shipping: selectedShipping?.price || 0,
          customer: {
            name: user.name,
            email: user.email,
            cpf: shippingAddress.cpf,
          },
          address: shippingAddress,
        },
      );

      window.location.href = res.data.link;
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar link de pagamento");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // CEP
  // ================================
  const handleCepChange = async (cep) => {
    const formattedCep = shippingUtils.formatCep(cep);
    setShippingAddress((prev) => ({ ...prev, cep: formattedCep }));

    if (shippingUtils.validateCep(formattedCep)) {
      setCepLoading(true);
      try {
        const addressData = await shippingUtils.consultCep(formattedCep);
        setShippingAddress((prev) => ({
          ...prev,
          street: addressData.street,
          neighborhood: addressData.neighborhood,
          city: addressData.city,
          state: addressData.state,
        }));
      } catch {
        setError("CEP não encontrado");
      } finally {
        setCepLoading(false);
      }
    }
  };

  // ================================
  // FRETE
  // ================================
  const handleCalculateShipping = async () => {
    setLoading(true);
    setError("");

    try {
      if (!shippingUtils.isSudeste(shippingAddress.cep)) {
        throw new Error("Desculpe, entregamos apenas para o Sudeste.");
      }

      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      const price = shippingUtils.calculateFixedShipping(totalQuantity);

      const shippingOption = {
        id: "fixed",
        name: "Frete Fixo",
        description: "Entrega em até 5 dias úteis",
        price,
        deliveryTime: "3-5 dias úteis",
        company: "Transportadora",
      };

      setSelectedShipping(shippingOption);
      nextStep();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // CUPOM
  // ================================
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setLoading(true);
    try {
      await applyCoupon(couponCode, {
        items: cartItems,
        total: getTotalPrice(),
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // TOTAL
  // ================================
  const calculateTotal = () => {
    let total = getTotalPrice();

    if (selectedShipping) total += selectedShipping.price;

    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        total *= 1 - appliedCoupon.value / 100;
      } else if (appliedCoupon.type === "fixed") {
        total -= appliedCoupon.value;
      } else if (appliedCoupon.type === "shipping" && selectedShipping) {
        total -= Math.min(appliedCoupon.value, selectedShipping.price);
      }
    }

    return Math.max(0, total);
  };

  const steps = [
    { number: 1, title: "Endereço", icon: "📍" },
    { number: 2, title: "Frete", icon: "🚚" },
    { number: 3, title: "Pagamento", icon: "💳" },
    { number: 4, title: "Confirmação", icon: "✅" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.icon}
                  </div>

                  <div className="ml-3">
                    <p
                      className={`font-medium ${
                        currentStep >= step.number
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-4 ${
                        currentStep > step.number
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* STEP 1 */}
            {currentStep === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6">Endereço de Entrega</h2>

                <input
                  type="text"
                  placeholder="CPF"
                  value={shippingAddress.cpf || ""}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      cpf: e.target.value,
                    }))
                  }
                  className="w-full border p-3 rounded mb-3"
                />

                <input
                  type="text"
                  placeholder="CEP"
                  value={shippingAddress.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  className="w-full border p-3 rounded mb-3"
                />

                <input
                  type="text"
                  placeholder="Rua"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      street: e.target.value,
                    }))
                  }
                  className="w-full border p-3 rounded mb-3"
                />

                <input
                  type="text"
                  placeholder="Número"
                  value={shippingAddress.number}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      number: e.target.value,
                    }))
                  }
                  className="w-full border p-3 rounded mb-3"
                />

                <input
                  type="text"
                  placeholder="Complemento"
                  value={shippingAddress.complement}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      complement: e.target.value,
                    }))
                  }
                  className="w-full border p-3 rounded mb-3"
                />

                <input
                  type="text"
                  placeholder="Bairro"
                  value={shippingAddress.neighborhood}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      neighborhood: e.target.value,
                    }))
                  }
                  className="w-full border p-3 rounded mb-3"
                />

                <input
                  type="text"
                  placeholder="Cidade"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="w-full border p-3 rounded mb-3"
                />

                <input
                  type="text"
                  placeholder="Estado"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="w-full border p-3 rounded mb-3"
                />

                <button
                  onClick={handleCalculateShipping}
                  className="bg-blue-600 text-white px-6 py-3 rounded"
                >
                  Calcular Frete
                </button>
              </>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && selectedShipping && (
              <>
                <h2 className="text-2xl font-bold mb-6">Frete</h2>

                <p>{selectedShipping.name}</p>
                <p>R$ {selectedShipping.price.toFixed(2)}</p>

                <div className="flex justify-between mt-6">
                  <button onClick={prevStep}>Voltar</button>
                  <button onClick={nextStep}>Continuar</button>
                </div>
              </>
            )}

            {/* STEP 3 PAGAMENTO EXTERNO */}
            {currentStep === 3 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6">Pagamento</h2>

                <button
                  onClick={handleExternalPayment}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  {loading ? "Redirecionando..." : "Ir para pagamento"}
                </button>

                <div className="flex justify-between mt-8">
                  <button onClick={prevStep}>Voltar</button>
                  <button onClick={nextStep}>Continuar</button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <>
                <h2 className="text-2xl font-bold mb-6">Confirmar Pedido</h2>

                <p>Total: R$ {calculateTotal().toFixed(2)}</p>

                <div className="flex justify-between mt-6">
                  <button onClick={prevStep}>Voltar</button>
                  <button className="bg-green-600 text-white px-6 py-3 rounded">
                    Finalizar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
