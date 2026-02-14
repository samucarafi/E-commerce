import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Contexts/Cart/CartContext";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useCheckout } from "../../Contexts/Checkout/CheckoutContext";
import { shippingUtils } from "../../Utils/shippingUtils";
const CheckoutPage = () => {
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
    shippingOptions,
    selectedPayment,
    setSelectedPayment,
    couponCode,
    setCouponCode,
    appliedCoupon,
    setAppliedCoupon,
    calculateShipping,
    applyCoupon,
    createOrder,
    processPayment,
  } = useCheckout();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      navigate("/");
      return;
    }
  }, [user, cartItems, navigate]);

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
      } catch (error) {
        setError("CEP não encontrado");
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleCalculateShipping = async () => {
    setLoading(true);
    setError("");
    try {
      await calculateShipping(cartItems);
      nextStep();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFinishOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: cartItems,
        shippingAddress,
        shipping: selectedShipping,
        payment: selectedPayment,
        coupon: appliedCoupon,
        total: calculateTotal(),
      };

      const orderResult = await createOrder(orderData);

      if (orderResult.success) {
        const paymentResult = await processPayment({
          orderId: orderResult.order.id,
          method: selectedPayment,
          amount: calculateTotal(),
        });

        if (paymentResult.success) {
          clearCart();
          navigate(`/order-success/${orderResult.order.id}`);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    let total = getTotalPrice();

    if (selectedShipping) {
      total += selectedShipping.price;
    }

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
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`checkout-step w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step.number
                        ? "active"
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
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                {/* Step 1: Endereço */}
                {currentStep === 1 && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      Endereço de Entrega
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CEP *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={shippingAddress.cep}
                            onChange={(e) => handleCepChange(e.target.value)}
                            placeholder="00000-000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {cepLoading && (
                            <div className="absolute right-3 top-3">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rua *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.street}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                street: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.number}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                number: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.complement}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              complement: e.target.value,
                            }))
                          }
                          placeholder="Apartamento, bloco, etc."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bairro *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.neighborhood}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                neighborhood: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.state}
                            onChange={(e) =>
                              setShippingAddress((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        onClick={handleCalculateShipping}
                        disabled={
                          loading ||
                          !shippingAddress.cep ||
                          !shippingAddress.street ||
                          !shippingAddress.number
                        }
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                      >
                        {loading ? "Calculando..." : "Calcular Frete"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Frete */}
                {currentStep === 2 && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      Opções de Frete
                    </h2>
                    <div className="space-y-4">
                      {shippingOptions.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => setSelectedShipping(option)}
                          className={`payment-method p-4 border-2 rounded-xl cursor-pointer ${
                            selectedShipping?.id === option.id
                              ? "selected"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">
                                {option.name}
                              </h3>
                              <p className="text-gray-600">
                                {option.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {option.company}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                R$ {option.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {option.deliveryTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-8">
                      <button
                        onClick={prevStep}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={!selectedShipping}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Pagamento */}
                {currentStep === 3 && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      Forma de Pagamento
                    </h2>

                    <div className="space-y-4 mb-6">
                      {[
                        {
                          id: "credit",
                          name: "Cartão de Crédito",
                          icon: "💳",
                          description: "Visa, Mastercard, Elo",
                        },
                        {
                          id: "debit",
                          name: "Cartão de Débito",
                          icon: "💳",
                          description: "Débito à vista",
                        },
                        {
                          id: "pix",
                          name: "PIX",
                          icon: "📱",
                          description: "Pagamento instantâneo",
                        },
                        {
                          id: "boleto",
                          name: "Boleto Bancário",
                          icon: "🧾",
                          description: "Vencimento em 3 dias",
                        },
                      ].map((method) => (
                        <div
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`payment-method p-4 border-2 rounded-xl cursor-pointer ${
                            selectedPayment === method.id
                              ? "selected"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-3xl mr-4">{method.icon}</span>
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">
                                {method.name}
                              </h3>
                              <p className="text-gray-600">
                                {method.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-8">
                      <button
                        onClick={prevStep}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={!selectedPayment}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                      >
                        Revisar Pedido
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmação */}
                {currentStep === 4 && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      Confirmar Pedido
                    </h2>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold mb-2">Endereço de Entrega</h3>
                        <p className="text-gray-700">
                          {shippingAddress.street}, {shippingAddress.number}
                          {shippingAddress.complement &&
                            `, ${shippingAddress.complement}`}
                          <br />
                          {shippingAddress.neighborhood} -{" "}
                          {shippingAddress.city}/{shippingAddress.state}
                          <br />
                          CEP: {shippingAddress.cep}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold mb-2">Frete Selecionado</h3>
                        <p className="text-gray-700">
                          {selectedShipping?.name} - {selectedShipping?.company}
                          <br />
                          {selectedShipping?.deliveryTime} - R${" "}
                          {selectedShipping?.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold mb-2">Forma de Pagamento</h3>
                        <p className="text-gray-700">
                          {selectedPayment === "credit" && "Cartão de Crédito"}
                          {selectedPayment === "debit" && "Cartão de Débito"}
                          {selectedPayment === "pix" && "PIX"}
                          {selectedPayment === "boleto" && "Boleto Bancário"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <button
                        onClick={prevStep}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={handleFinishOrder}
                        disabled={loading}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                      >
                        {loading ? "Processando..." : "Finalizar Pedido"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Resumo do Pedido
                </h3>

                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-sm">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Cupom de Desconto */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Cupom de desconto"
                      className="flex px-2 w-40 py-2 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={loading || !couponCode.trim()}
                      className="bg-blue-600 hover:bg-blue-700 px-2 text-white py-2 rounded text-sm disabled:opacity-50"
                    >
                      Aplicar
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-800 text-sm font-medium">
                        ✓ {appliedCoupon.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                  {selectedShipping && (
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span>R$ {selectedShipping.price.toFixed(2)}</span>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto:</span>
                      <span>
                        - R${" "}
                        {appliedCoupon.type === "percentage"
                          ? (
                              (getTotalPrice() * appliedCoupon.value) /
                              100
                            ).toFixed(2)
                          : appliedCoupon.type === "fixed"
                            ? appliedCoupon.value.toFixed(2)
                            : appliedCoupon.type === "shipping" &&
                                selectedShipping
                              ? Math.min(
                                  appliedCoupon.value,
                                  selectedShipping.price,
                                ).toFixed(2)
                              : "0.00"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">
                      R$ {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>💡 Dica:</strong> Cupons disponíveis para teste:
                    <br />• DESCONTO10 (10% off)
                    <br />• FRETE20 (R$ 20 off no frete)
                    <br />• BEMVINDO (R$ 50 off)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
