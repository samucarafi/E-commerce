import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useCart } from "../../Contexts/Cart/CartContext";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useCheckout } from "../../Contexts/Checkout/CheckoutContext";
import { shippingUtils } from "../../Utils/shippingUtils";
import { api } from "../../config/api";
import { cpfUtils } from "../../Utils/cpfUtils";
import { apiServices } from "../../services/apiServices";
const CheckoutPage = () => {
  const [pixData, setPixData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pixLoading, setPixLoading] = useState(false);
  const [error, setError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [shippingConfig, setShippingConfig] = useState(null);
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const {
    currentStep,
    nextStep,
    prevStep,
    shippingAddress,
    setShippingAddress,
    selectedShipping,
    setSelectedShipping,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    goToStep,
  } = useCheckout();

  useEffect(() => {
    setPixData(null);
    setSelectedShipping(null);

    // força voltar pro step 1
    if (currentStep !== 1) {
      goToStep(1); // ou cria função resetSteps()
    }
  }, []);

  useEffect(() => {
    const savedCoupon = localStorage.getItem("affiliate_coupon");

    if (savedCoupon && !appliedCoupon) {
      setCouponCode(savedCoupon);
      applyCoupon(savedCoupon, {
        items: cartItems,
        total: getTotalPrice(),
      });
    }
  }, []);

  useEffect(() => {
    if (!pixData) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get("/orders");

        const order = res.data.find((o) => o.orderId === pixData.orderId);

        if (order?.payment?.status === "approved") {
          clearInterval(interval);
          clearCart();
          navigate("/success");
        }
      } catch (err) {
        console.error("Erro ao verificar pagamento:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pixData]);

  useEffect(() => {
    if (!user) navigate("/login");
    if (cartItems.length === 0) navigate("/");
    const loadShipping = async () => {
      try {
        const { data } = await apiServices.getShippingConfig();

        setShippingConfig(data);
      } catch (err) {
        console.error("Erro ao carregar config frete:", err);
        console.warn("Erro ao carregar config frete");
      }
    };

    loadShipping();
  }, [user, cartItems, navigate]);

  // ================================
  // PAGAMENTO EXTERNO
  // ================================
  const handleExternalPayment = async () => {
    setPixLoading(true);
    setError("");

    try {
      nextStep(); // vai pro step 4 já
      const items = cartItems.map((item) => ({
        productId: item._id,
        quantity: Number(item.quantity),
        type: "product",
      }));

      const shippingPrice = calculateShipping();

      const res = await api.post("/checkout", {
        items,
        shipping: Number(shippingPrice),
        coupon: appliedCoupon || null,
        customer: {
          name: user.name,
          email: user.email,
          cpf:
            shippingAddress.cpf === "USE_SAVED_CPF"
              ? "USE_SAVED_CPF"
              : shippingAddress.cpf.replace(/\D/g, ""),
        },
        shippingAddress,
      });
      setPixData(res.data);

      localStorage.removeItem("affiliate_coupon");
      localStorage.removeItem("affiliate_buy_product");
      localStorage.removeItem("affiliate_checkout_intent");

      // opcional
      localStorage.removeItem("last_used_coupon");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erro ao gerar pagamento");
      prevStep(); // volta se der erro

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setPixLoading(false);
    }
  };

  // ================================
  // CEP
  // ================================
  const handleCepChange = async (cep) => {
    const formatted = shippingUtils.formatCep(cep);

    setShippingAddress((prev) => ({
      ...prev,
      cep: formatted,
    }));

    // se não tiver 8 dígitos ainda → limpa endereço
    if (!shippingUtils.validateCep(formatted)) {
      setShippingAddress((prev) => ({
        ...prev,
        ...shippingUtils.clearAddressFields(),
      }));

      return;
    }

    setCepLoading(true);
    setError("");

    try {
      const data = await shippingUtils.consultCep(formatted);

      setShippingAddress((prev) => ({
        ...prev,
        ...data,
      }));
    } catch {
      setShippingAddress((prev) => ({
        ...prev,
        ...shippingUtils.clearAddressFields(),
      }));

      setError("CEP inválido ou não encontrado");
    } finally {
      setCepLoading(false);
    }
  };

  // ================================
  // FRETE
  // ================================
  const handleCalculateShipping = async () => {
    setLoading(true);
    setError("");

    try {
      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      const price = shippingUtils.calculateShippingByState(
        shippingAddress.state,
        totalQuantity,
        shippingConfig?.shippingByState,
      );

      if (!price)
        throw new Error("Não foi possível calcular frete para esse estado.");

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
  const calculateShipping = () => {
    let shipping = selectedShipping?.price || 0;

    if (appliedCoupon?.type === "shipping") {
      shipping -= appliedCoupon.value;
    }

    return Math.max(0, shipping);
  };

  const calculateSubtotal = () => {
    let subtotal = getTotalPrice();

    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        subtotal *= 1 - appliedCoupon.value / 100;
      }

      if (appliedCoupon.type === "fixed") {
        subtotal -= appliedCoupon.value;
      }
    }

    return Math.max(0, subtotal);
  };

  // ================================
  // TOTAL
  // ================================
  const calculateTotal = () => {
    let total = calculateSubtotal();

    total += calculateShipping();

    return Math.max(0, total);
  };

  const steps = [
    { number: 1, title: "Endereço", icon: "📍" },
    { number: 2, title: "Frete", icon: "🚚" },
    { number: 3, title: "Pagamento", icon: "💳" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F2] to-[#EFE7DF] py-12 px-4">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              goToStep(1);
              navigate("/");
            }}
            className="mb-6 text-sm text-[#5B2333] hover:underline cursor-pointer"
          >
            ← Voltar para loja
          </button>
          {/* Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {steps.slice(0, 3).map((step) => (
                <div key={step.number} className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 flex items-center justify-center rounded-full font-bold transition ${
                      currentStep >= step.number
                        ? "bg-[#5B2333] text-[#F5E6D3]"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.icon}
                  </div>

                  <span
                    className={`text-sm font-medium whitespace-nowrap ${
                      currentStep >= step.number
                        ? "text-[#5B2333]"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conteúdo */}
          {/* Conteúdo */}
          <div
            className={`grid ${currentStep === 4 ? "" : "lg:grid-cols-3 "}  gap-8`}
          >
            {/* FORMULÁRIO / STEPS */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 border border-[#E8D8C3]">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              {/* STEP 1 */}
              {currentStep === 1 && (
                <>
                  {user?.addresses?.length > 0 && (
                    <div className="mb-6 bg-white rounded-xl shadow p-4 border">
                      <button
                        onClick={() =>
                          setShowSavedAddresses(!showSavedAddresses)
                        }
                        className="w-full flex justify-between items-center font-medium text-sm"
                      >
                        Endereços salvos
                        <span>{showSavedAddresses ? "▲" : "▼"}</span>
                      </button>

                      {showSavedAddresses && (
                        <div className="mt-4 space-y-3">
                          {user.addresses.map((addr) => (
                            <div
                              key={addr._id}
                              className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition"
                              onClick={() =>
                                setShippingAddress({
                                  ...addr,
                                  cpf: shippingAddress.cpf,
                                })
                              }
                            >
                              <p className="font-medium">
                                {addr.street}, {addr.number}
                              </p>
                              <p className="text-sm text-gray-500">
                                {addr.city} - {addr.state}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mb-6">
                    Endereço de Entrega
                  </h2>
                  {user?.cpfMasked && (
                    <div className="mb-3">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shippingAddress.cpf === "USE_SAVED_CPF"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShippingAddress((prev) => ({
                                ...prev,
                                cpf: "USE_SAVED_CPF",
                              }));
                            } else {
                              setShippingAddress((prev) => ({
                                ...prev,
                                cpf: "",
                              }));
                            }
                          }}
                        />
                        Usar CPF cadastrado ({user.cpfMasked})
                      </label>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="CPF"
                    value={
                      shippingAddress.cpf === "USE_SAVED_CPF"
                        ? user.cpfMasked
                        : shippingAddress.cpf || ""
                    }
                    disabled={shippingAddress.cpf === "USE_SAVED_CPF"}
                    onChange={(e) => {
                      const formatted = cpfUtils.format(e.target.value);

                      setShippingAddress((prev) => ({
                        ...prev,
                        cpf: formatted,
                      }));
                    }}
                    className="w-full border p-3 rounded mb-1"
                  />

                  {shippingAddress.cpf &&
                    shippingAddress.cpf !== "USE_SAVED_CPF" &&
                    !cpfUtils.isValid(shippingAddress.cpf) && (
                      <p className="text-red-500 text-xs mb-3">CPF inválido</p>
                    )}

                  <input
                    type="text"
                    placeholder="CEP"
                    maxLength={8}
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
                    disabled={
                      !shippingUtils.validateCep(shippingAddress.cep) ||
                      !shippingAddress.number ||
                      !shippingAddress.cpf ||
                      loading ||
                      (shippingAddress.cpf !== "USE_SAVED_CPF" &&
                        !cpfUtils.isValid(shippingAddress.cpf))
                    }
                    className="bg-gradient-to-r from-[#5B2333] to-[#8C3A4E] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition text-white px-10 py-4 rounded-full font-semibold tracking-wide shadow-md"
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
                    <button
                      className="bg-gradient-to-r from-[#5B2333] to-[#8C3A4E] hover:scale-105 transition text-white px-10 py-4 rounded-full font-semibold tracking-wide shadow-md"
                      onClick={prevStep}
                    >
                      Voltar
                    </button>
                    <button
                      className="bg-gradient-to-r from-[#5B2333] to-[#8C3A4E] hover:scale-105 transition text-white px-10 py-4 rounded-full font-semibold tracking-wide shadow-md"
                      onClick={nextStep}
                    >
                      Continuar
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3 PAGAMENTO EXTERNO */}
              {currentStep === 3 && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-6">Pagamento</h2>

                  <div className="flex justify-between mt-8">
                    <button
                      className="bg-gradient-to-r from-[#5B2333] to-[#8C3A4E] hover:scale-105 transition text-white px-10 py-4 rounded-full font-semibold tracking-wide shadow-md"
                      onClick={prevStep}
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => {
                        handleExternalPayment();
                        nextStep();
                      }}
                      disabled={loading}
                      className="bg-gradient-to-r from-[#5B2333] to-[#8C3A4E] hover:scale-105 transition text-white px-10 py-4 rounded-full font-semibold tracking-wide shadow-md"
                    >
                      {loading ? "Redirecionando..." : "Ir para pagamento"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {currentStep === 4 && pixLoading && (
                <div className="text-center py-16">
                  <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 border-4 border-[#5B2333] border-t-transparent rounded-full animate-spin"></div>
                  </div>

                  <h2 className="text-xl font-semibold text-[#5B2333]">
                    Gerando pagamento...
                  </h2>

                  <p className="text-sm text-gray-500 mt-2">
                    Aguarde enquanto preparamos seu Pix
                  </p>
                </div>
              )}
              {currentStep === 4 && !pixLoading && pixData && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2 text-[#5B2333]">
                    Aguardando pagamento
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Escaneie o QR Code ou copie o código Pix
                  </p>
                  {/* animação */}
                  <div className="flex justify-center mb-6">
                    <div className="w-10 h-10 border-4 border-[#5B2333] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  {/* QR CODE MENOR */}
                  <div className="bg-white p-4 rounded-2xl shadow-md inline-block">
                    <img
                      src={`data:image/png;base64,${pixData.qr_code_base64}`}
                      alt="QR Code Pix"
                      className="w-40 h-40 object-contain mx-auto"
                    />
                  </div>
                  {/* COPIA E COLA MELHOR */}
                  <div className="mt-5">
                    <textarea
                      value={pixData.qr_code}
                      readOnly
                      className="w-full p-3 border rounded-xl text-xs text-center resize-none"
                      rows={3}
                    />

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pixData.qr_code);
                      }}
                      className="mt-3 w-full bg-[#5B2333] text-white py-3 rounded-full font-semibold hover:scale-105 transition"
                    >
                      Copiar código Pix
                    </button>
                  </div>
                  {/* BOTÃO ABRIR */}
                  <a
                    href={pixData.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full border border-[#5B2333] text-[#5B2333] py-3 rounded-full font-semibold hover:bg-[#5B2333] hover:text-white transition"
                  >
                    Abrir no app do Mercado Pago
                  </a>
                  {/* VOLTAR PADRÃO */}
                  <button
                    onClick={prevStep}
                    className="mt-4 bg-gradient-to-r from-[#5B2333] to-[#8C3A4E] text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
                  >
                    Voltar
                  </button>
                  {/* RESUMO DENTRO */}
                  <div className="mt-8 bg-[#F8F5F2] rounded-2xl p-6 text-left ">
                    <h3 className="font-bold mb-3 text-[#5B2333]">
                      Resumo do pedido
                    </h3>

                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal</span>
                      <span>R$ {calculateSubtotal().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm mb-2">
                      <span>Frete</span>
                      <span>R$ {calculateShipping().toFixed(2)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-600 mb-2">
                        <span>Cupom ({appliedCoupon.code})</span>
                        <span>
                          {appliedCoupon.type === "percentage"
                            ? `${appliedCoupon.value}%`
                            : `- R$ ${appliedCoupon.value}`}
                        </span>
                      </div>
                    )}

                    <hr className="my-3" />

                    <div className="flex justify-between font-bold text-[#5B2333]">
                      <span>Total</span>
                      <span>R$ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RESUMO DO PEDIDO */}
            <div
              className={`bg-white rounded-3xl shadow-xl p-6 border border-[#E8D8C3] h-fit sticky top-6 ${currentStep === 4 ? "hidden" : ""} `}
            >
              <h3 className="text-xl font-bold mb-4 text-[#5B2333]">Resumo</h3>

              {/* itens */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => {
                  const originalTotal = item.price * item.quantity;

                  let discountedTotal = originalTotal;

                  if (appliedCoupon?.type === "percentage") {
                    discountedTotal =
                      originalTotal * (1 - appliedCoupon.value / 100);
                  }

                  return (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <div className="text-right">
                        {appliedCoupon?.type === "percentage" ? (
                          <>
                            <p className="line-through text-gray-400">
                              R$ {originalTotal.toFixed(2)}
                            </p>
                            <p className="text-green-600 font-semibold">
                              R$ {discountedTotal.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p>R$ {originalTotal.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* desconto fixo como item */}
                {appliedCoupon?.type === "fixed" && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto ({appliedCoupon.code})</span>
                    <span>- R$ {appliedCoupon.value.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <hr className="my-4" />

              {/* subtotal */}
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>R$ {calculateSubtotal().toFixed(2)}</span>
              </div>

              {/* frete */}
              <div className="flex justify-between mb-2">
                <span>Frete</span>

                <div className="text-right">
                  {selectedShipping ? (
                    appliedCoupon?.type === "shipping" ? (
                      <>
                        <p className="line-through text-gray-400">
                          R$ {selectedShipping.price.toFixed(2)}
                        </p>
                        <p className="text-green-600 font-semibold">
                          R$ {calculateShipping().toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p>R$ {selectedShipping.price.toFixed(2)}</p>
                    )
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              {/* input cupom */}
              <div className="mt-4">
                <label className="text-sm font-medium">Cupom</label>

                <div className="grid grid-cols-3 gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Digite o cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="col-span-2 border p-2 rounded text-sm"
                  />

                  <button
                    onClick={handleApplyCoupon}
                    className="bg-[#5B2333] text-white px-4 rounded text-sm hover:scale-105 transition"
                  >
                    Aplicar
                  </button>
                </div>

                {appliedCoupon && (
                  <p className="text-green-600 text-xs mt-1">
                    Cupom aplicado: {appliedCoupon.code} —{" "}
                    {appliedCoupon.description}
                  </p>
                )}
              </div>

              {/* cupom */}
              {appliedCoupon && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Desconto</span>
                  <span>
                    {appliedCoupon.type === "percentage"
                      ? `${appliedCoupon.value}%`
                      : `- R$ ${appliedCoupon.value}`}
                  </span>
                </div>
              )}

              <hr className="my-4" />

              {/* total */}
              <div className="flex justify-between text-lg font-bold text-[#5B2333]">
                <span>Total</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
