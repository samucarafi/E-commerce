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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [shippingConfig, setShippingConfig] = useState(null);
  const { cartItems, getTotalPrice } = useCart();
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
  } = useCheckout();

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
    setLoading(true);
    setError("");

    try {
      let items = cartItems.map((item) => {
        let price = item.price;

        if (appliedCoupon) {
          if (appliedCoupon.type === "percentage") {
            price = price * (1 - appliedCoupon.value / 100);
          }
        }

        return {
          productId: item._id,
          title: item.name,
          type: "product",
          quantity: Number(item.quantity),
          unit_price: Number(price.toFixed(2)),
        };
      });

      // desconto fixo vira item negativo
      if (appliedCoupon?.type === "fixed") {
        items.push({
          title: `Cupom ${appliedCoupon.code}`,
          quantity: 1,
          unit_price: -Math.abs(appliedCoupon.value),
          type: "discount",
        });
      }

      // desconto frete
      let shippingPrice = calculateShipping();

      if (appliedCoupon?.type === "shipping") {
        shippingPrice = Math.max(0, shippingPrice - appliedCoupon.value);
      }

      const res = await api.post("/checkout", {
        items,
        shipping: shippingPrice,
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

      window.location.href = res.data.init_point;
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
            onClick={() => navigate("/")}
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
          <div className="grid lg:grid-cols-3 gap-8">
            {user?.addresses?.length > 0 && (
              <div className="mb-6 bg-white rounded-xl shadow p-4 border">
                <button
                  onClick={() => setShowSavedAddresses(!showSavedAddresses)}
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

                  <button
                    onClick={handleExternalPayment}
                    disabled={loading}
                    className="bg-gradient-to-r from-[#5B2333] to-[#8C3A4E] hover:scale-105 transition text-white px-10 py-4 rounded-full font-semibold tracking-wide shadow-md"
                  >
                    {loading ? "Redirecionando..." : "Ir para pagamento"}
                  </button>

                  <div className="flex justify-between mt-8">
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

            {/* RESUMO DO PEDIDO */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#E8D8C3] h-fit sticky top-6">
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
