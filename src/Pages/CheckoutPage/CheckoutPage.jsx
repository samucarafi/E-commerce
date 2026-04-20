import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../Contexts/Cart/CartContext";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useCheckout } from "../../Contexts/Checkout/CheckoutContext";
import { shippingUtils } from "../../Utils/shippingUtils";
import { api } from "../../config/api";
import { cpfUtils } from "../../Utils/cpfUtils";
import { apiServices } from "../../services/apiServices";

/* ─── Step indicator ─── */
const StepIndicator = ({ steps, current }) => (
  <div className="flex items-center">
    {steps.map((step, i) => {
      const done = current > step.n;
      const active = current === step.n;
      return (
        <React.Fragment key={step.n}>
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                done
                  ? "bg-[#C6A75E] text-[#111]"
                  : active
                    ? "bg-[#5B2333] text-white"
                    : "bg-[#EEE] text-gray-400"
              }`}
            >
              {done ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                step.n
              )}
            </div>
            <p
              className={`text-[10px] mt-1.5 font-medium tracking-wide whitespace-nowrap ${
                active
                  ? "text-[#5B2333]"
                  : done
                    ? "text-[#C6A75E]"
                    : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-3 mb-4 transition-colors duration-300 ${done ? "bg-[#C6A75E]" : "bg-[#E8E0D8]"}`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium">
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full border border-[#E8DDD0] rounded-xl px-4 py-3 text-sm text-[#1C1C1C] placeholder:text-gray-300 focus:outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E]/30 transition-colors bg-white ${className}`}
  />
);

const SummaryRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center text-sm">
    <span className={highlight ? "text-emerald-600" : "text-gray-500"}>
      {label}
    </span>
    <span
      className={`font-medium ${highlight ? "text-emerald-600" : "text-[#1C1C1C]"}`}
    >
      {value}
    </span>
  </div>
);

/* ─── Order Summary sidebar ─── */
const OrderSummary = ({
  cartItems,
  getTotalPrice,
  selectedShipping,
  appliedCoupon,
  couponCode,
  setCouponCode,
  onApplyCoupon,
  couponLoading,
  couponError,
  requiresCpfForCoupon,
  couponCpf,
  setCouponCpf,
}) => {
  const subtotal = (() => {
    let s = getTotalPrice();
    if (appliedCoupon?.type === "percentage")
      s *= 1 - appliedCoupon.value / 100;
    if (appliedCoupon?.type === "fixed") s -= appliedCoupon.value;
    return Math.max(0, s);
  })();
  const shipping = (() => {
    let s = selectedShipping?.price || 0;
    if (appliedCoupon?.type === "shipping")
      s = Math.max(0, s - appliedCoupon.value);
    return s;
  })();

  return (
    <div className="bg-white rounded-2xl border border-[#EEE8E0] p-6 space-y-5 sticky top-6">
      <h3 className="font-semibold text-[#1C1C1C] text-sm">Resumo do Pedido</h3>

      <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div key={item._id} className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-[#FAF7F4] rounded-lg flex-shrink-0 overflow-hidden">
              <img
                src={item.image || "/images/default-perfume.jpg"}
                alt={item.name}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#1C1C1C] truncate">
                {item.name}
              </p>
              <p className="text-[10px] text-gray-400">× {item.quantity}</p>
            </div>
            <p className="text-xs font-semibold text-[#1C1C1C] whitespace-nowrap">
              R$ {(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-[#F0E8E0] pt-4 space-y-2">
        <SummaryRow
          label="Subtotal"
          value={`R$ ${getTotalPrice().toFixed(2)}`}
        />
        {appliedCoupon?.type === "percentage" && (
          <SummaryRow
            label={`Desconto (${appliedCoupon.code})`}
            value={`− ${appliedCoupon.value}% (R$ ${((getTotalPrice() * appliedCoupon.value) / 100).toFixed(2)})`}
            highlight
          />
        )}
        {appliedCoupon?.type === "fixed" && (
          <SummaryRow
            label={`Desconto (${appliedCoupon.code})`}
            value={`− R$ ${appliedCoupon.value.toFixed(2)}`}
            highlight
          />
        )}
        <SummaryRow
          label="Frete"
          value={
            selectedShipping
              ? `R$ ${shipping.toFixed(2)}`
              : "Calculado a seguir"
          }
        />
        {appliedCoupon?.type === "shipping" && (
          <SummaryRow
            label="Desconto no frete"
            value={`− R$ ${appliedCoupon.value.toFixed(2)}`}
            highlight
          />
        )}
      </div>

      <div className="border-t border-[#F0E8E0] pt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#1C1C1C]">Total</span>
          <span className="text-lg font-bold text-[#5B2333]">
            R$ {(subtotal + shipping).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Coupon */}
      <div className="border-t border-[#F0E8E0] pt-4">
        {appliedCoupon ? (
          <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Cupom <strong>{appliedCoupon.code}</strong> aplicado!
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block">
              Cupom de desconto
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="CÓDIGO"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 border border-[#E8DDD0] rounded-xl px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-[#C6A75E] transition-colors"
              />
              <button
                onClick={onApplyCoupon}
                disabled={!couponCode || couponLoading}
                className="bg-[#5B2333] text-white px-4 py-2 rounded-xl text-xs font-medium disabled:opacity-40 hover:bg-[#4a1c29] transition-colors"
              >
                {couponLoading ? "..." : "Aplicar"}
              </button>
            </div>
            {requiresCpfForCoupon && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                <p className="text-[10px] text-amber-700 font-medium">
                  O cupom <strong>PRIMEIRACOMPRA</strong> é válido apenas para o
                  primeiro pedido por CPF. Informe seu CPF:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={couponCpf}
                    onChange={(e) =>
                      setCouponCpf(cpfUtils.format(e.target.value))
                    }
                    maxLength={14}
                    className="flex-1 border border-amber-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C6A75E] transition-colors bg-white"
                  />
                  <button
                    onClick={onApplyCoupon}
                    disabled={!cpfUtils.isValid(couponCpf) || couponLoading}
                    className="bg-[#5B2333] text-white px-4 py-2 rounded-xl text-xs font-medium disabled:opacity-40 hover:bg-[#4a1c29] transition-colors"
                  >
                    {couponLoading ? "..." : "Validar"}
                  </button>
                </div>
              </div>
            )}
            {couponError && (
              <p className="text-[10px] text-red-500">{couponError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN CheckoutPage
───────────────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: "Endereço" },
  { n: 2, label: "Frete" },
  { n: 3, label: "Revisão" },
  { n: 4, label: "Pagamento" },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    shippingAddress,
    setShippingAddress,
    selectedShipping,
    setSelectedShipping,
    couponCode,
    resetCheckout,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
  } = useCheckout();

  const [shippingConfig, setShippingConfig] = useState(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [error, setError] = useState("");
  const [pixData, setPixData] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // PRIMEIRACOMPRA CPF
  const [requiresCpfForCoupon, setRequiresCpfForCoupon] = useState(false);
  const [couponCpf, setCouponCpf] = useState("");

  /* Guards */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Se há pedido PIX pendente mas carrinho vazio, mostra o pix (não redireciona)
    const saved = localStorage.getItem("pending_order");
    if (!user) {
      navigate("/login");
      return;
    }

    // só bloqueia se NÃO tem pedido pendente
    if (!saved && cartItems.length === 0) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    apiServices
      .getShippingConfig()
      .then(({ data }) => setShippingConfig(data))
      .catch(console.error);
  }, []);

  /* Restore pending PIX */
  useEffect(() => {
    const saved = localStorage.getItem("pending_order");
    if (saved) {
      setPixData(JSON.parse(saved));
      goToStep(4);
    } else {
      resetCheckout();
    }
  }, []);

  /* Auto-apply affiliate coupon */
  useEffect(() => {
    const saved = localStorage.getItem("affiliate_coupon");
    if (saved && !appliedCoupon) {
      setCouponCode(saved);
      applyCoupon(saved, { items: cartItems, total: getTotalPrice() }).catch(
        () => {},
      );
    }
  }, []);

  /* Poll PIX */
  useEffect(() => {
    if (!pixData) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get("/orders");
        const order = res.data.find((o) => o.orderId === pixData.orderId);
        if (!order) return;
        if (order.payment?.status === "approved") {
          clearInterval(interval);
          localStorage.removeItem("pending_order");
          clearCart();
          setPaymentConfirmed(true);
        }
        if (order.payment?.status === "rejected") {
          clearInterval(interval);
          localStorage.removeItem("pending_order");
          setError("Pagamento expirado ou cancelado. Tente novamente.");
          setPixData(null);
          goToStep(3);
        }
      } catch (e) {
        console.error(e);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [pixData]);

  /* Helpers */
  const calcSubtotal = () => {
    let s = getTotalPrice();
    if (appliedCoupon?.type === "percentage")
      s *= 1 - appliedCoupon.value / 100;
    if (appliedCoupon?.type === "fixed") s -= appliedCoupon.value;
    return Math.max(0, s);
  };
  const calcShipping = () => {
    let s = selectedShipping?.price || 0;
    if (appliedCoupon?.type === "shipping")
      s = Math.max(0, s - appliedCoupon.value);
    return s;
  };
  const calcTotal = () => calcSubtotal() + calcShipping();

  /* CEP */
  const handleCep = async (val) => {
    const formatted = shippingUtils.formatCep(val);
    setShippingAddress((p) => ({ ...p, cep: formatted }));
    if (!shippingUtils.validateCep(formatted)) {
      setShippingAddress((p) => ({
        ...p,
        ...shippingUtils.clearAddressFields(),
      }));
      return;
    }
    setCepLoading(true);
    try {
      const data = await shippingUtils.consultCep(formatted);
      setShippingAddress((p) => ({ ...p, ...data }));
    } catch {
      setError("CEP inválido ou não encontrado.");
    } finally {
      setCepLoading(false);
    }
  };

  /* Shipping */
  const handleCalcShipping = async () => {
    setCalcLoading(true);
    setError("");
    try {
      const qty = cartItems.reduce((s, i) => s + i.quantity, 0);
      const price = shippingUtils.calculateShippingByState(
        shippingAddress.state,
        qty,
        shippingConfig?.shippingByState,
      );
      if (!price)
        throw new Error("Não foi possível calcular frete para este estado.");
      setSelectedShipping({
        id: "fixed",
        name: "Entrega Padrão",
        price,
        deliveryTime: "3-5 dias úteis",
      });
      nextStep();
    } catch (e) {
      setError(e.message);
    } finally {
      setCalcLoading(false);
    }
  };

  /* Coupon */
  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setRequiresCpfForCoupon(false);
    try {
      await applyCoupon(couponCode, {
        items: cartItems,
        total: getTotalPrice(),
        cpf: couponCpf || undefined,
      });
    } catch (e) {
      if (e?.requiresCpf) {
        setRequiresCpfForCoupon(true);
      } else {
        setCouponError(e?.message || "Cupom inválido");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  /* Pay */
  const handlePay = async () => {
    setPayLoading(true);
    setError("");
    try {
      const items = cartItems.map((item) => ({
        productId: item._id,
        quantity: Number(item.quantity),
        type: "product",
      }));
      const res = await api.post("/checkout", {
        items,
        shipping: Number(calcShipping()),
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
      localStorage.setItem("pending_order", JSON.stringify(res.data));
      [
        "affiliate_coupon",
        "affiliate_buy_product",
        "affiliate_checkout_intent",
      ].forEach((k) => localStorage.removeItem(k));
      nextStep(); // → step 4
    } catch (e) {
      setError(
        e.response?.data?.error || "Erro ao gerar pagamento. Tente novamente.",
      );
    } finally {
      setPayLoading(false);
    }
  };

  /* Handle "voltar à loja" quando há PIX pendente */
  const handleBackToStore = () => {
    if (pixData && !paymentConfirmed) {
      const confirm = window.confirm(
        'Seu pagamento Pix ainda está pendente! Você pode finalizar depois em "Meus Pedidos". Deseja sair mesmo assim?',
      );
      if (!confirm) return;
    }

    localStorage.removeItem("pending_order");

    clearCart();
    resetCheckout();

    navigate("/");
  };

  const addressValid =
    shippingUtils.validateCep(shippingAddress.cep) &&
    shippingAddress.number &&
    shippingAddress.state &&
    shippingAddress.cpf &&
    (shippingAddress.cpf === "USE_SAVED_CPF" ||
      cpfUtils.isValid(shippingAddress.cpf));

  /* ─── PAYMENT CONFIRMED screen ─── */
  if (paymentConfirmed) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#EEE8E0] shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#1C1C1C] mb-2">
            Pagamento Confirmado!
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Seu pedido foi aprovado com sucesso.
          </p>
          <p className="text-xs text-gray-400 mb-8">
            Acompanhe o status da entrega em <strong>Meus Pedidos</strong>. Você
            receberá atualizações por email.
          </p>
          <Link
            to="/orders"
            className="block w-full bg-[#C6A75E] hover:bg-[#B8954D] text-[#111] py-3.5 rounded-full text-sm font-semibold mb-3 transition-colors"
          >
            Acompanhar meu pedido
          </Link>
          <Link
            to="/"
            className="block text-xs text-gray-400 hover:text-[#5B2333] transition-colors"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  /* ─── RENDER ─── */
  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#EEE8E0] px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleBackToStore}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5B2333] transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Voltar à loja
        </button>
        <p className="text-[10px] text-[#C6A75E] tracking-[0.25em] uppercase font-medium">
          Royal Parfums · Checkout
        </p>
        <div className="w-24" />
      </div>

      {/* PIX pending banner */}
      {pixData && currentStep === 4 && !paymentConfirmed && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-center">
          <p className="text-xs text-amber-700">
            ✅ Pedido criado! Após o pagamento ser confirmado, acompanhe sua
            entrega em Meus Pedidos.
          </p>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {currentStep < 4 && (
          <div className="mb-10 max-w-md mx-auto">
            <StepIndicator steps={STEPS} current={currentStep} />
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm">
            <span className="flex-shrink-0">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <div
          className={`grid gap-6 ${currentStep === 4 ? "" : "lg:grid-cols-[1fr_340px]"}`}
        >
          {/* ── STEP 1 – Address ── */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-[#EEE8E0] p-8 shadow-sm">
              <h2 className="text-base font-semibold text-[#1C1C1C] mb-1">
                Endereço de Entrega
              </h2>
              <p className="text-xs text-gray-400 mb-7">
                Preencha o endereço completo para calcular o frete
              </p>

              {user?.addresses?.length > 0 && (
                <div className="mb-6 bg-[#FAF7F4] rounded-2xl p-4">
                  <button
                    onClick={() => setShowSaved(!showSaved)}
                    className="flex items-center justify-between w-full text-sm font-medium text-[#5B2333]"
                  >
                    <span>Usar endereço salvo</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transform: showSaved ? "rotate(180deg)" : "" }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {showSaved && (
                    <div className="mt-3 space-y-2">
                      {user.addresses.map((addr) => (
                        <button
                          key={addr._id}
                          onClick={() =>
                            setShippingAddress({
                              ...addr,
                              cpf: shippingAddress.cpf,
                            })
                          }
                          className="w-full text-left border border-[#E8DDD0] bg-white hover:border-[#C6A75E] rounded-xl p-3 text-sm transition-colors"
                        >
                          <p className="font-medium text-[#1C1C1C]">
                            {addr.street}, {addr.number}
                          </p>
                          <p className="text-xs text-gray-400">
                            {addr.city} – {addr.state} · CEP {addr.cep}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  {user?.cpfMasked && (
                    <label className="flex items-center gap-2 text-xs text-gray-500 mb-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={shippingAddress.cpf === "USE_SAVED_CPF"}
                        onChange={(e) =>
                          setShippingAddress((p) => ({
                            ...p,
                            cpf: e.target.checked ? "USE_SAVED_CPF" : "",
                          }))
                        }
                        className="accent-[#C6A75E]"
                      />
                      Usar CPF cadastrado ({user.cpfMasked})
                    </label>
                  )}
                  <Field label="CPF">
                    <Input
                      placeholder="000.000.000-00"
                      value={
                        shippingAddress.cpf === "USE_SAVED_CPF"
                          ? (user?.cpfMasked ?? "")
                          : shippingAddress.cpf || ""
                      }
                      disabled={shippingAddress.cpf === "USE_SAVED_CPF"}
                      onChange={(e) =>
                        setShippingAddress((p) => ({
                          ...p,
                          cpf: cpfUtils.format(e.target.value),
                        }))
                      }
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label={`CEP ${cepLoading ? "(buscando...)" : ""}`}>
                    <Input
                      placeholder="00000-000"
                      maxLength={9}
                      value={shippingAddress.cep}
                      onChange={(e) => handleCep(e.target.value)}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Rua">
                    <Input
                      placeholder="Nome da rua"
                      value={shippingAddress.street}
                      onChange={(e) =>
                        setShippingAddress((p) => ({
                          ...p,
                          street: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
                <Field label="Número">
                  <Input
                    placeholder="123"
                    value={shippingAddress.number}
                    onChange={(e) =>
                      setShippingAddress((p) => ({
                        ...p,
                        number: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="Complemento">
                  <Input
                    placeholder="Apto, bloco, etc."
                    value={shippingAddress.complement}
                    onChange={(e) =>
                      setShippingAddress((p) => ({
                        ...p,
                        complement: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="Bairro">
                  <Input
                    placeholder="Bairro"
                    value={shippingAddress.neighborhood}
                    onChange={(e) =>
                      setShippingAddress((p) => ({
                        ...p,
                        neighborhood: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="Cidade">
                  <Input
                    placeholder="Cidade"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress((p) => ({
                        ...p,
                        city: e.target.value,
                      }))
                    }
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Estado (UF)">
                    <Input
                      placeholder="Ex: RJ"
                      maxLength={2}
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress((p) => ({
                          ...p,
                          state: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleCalcShipping}
                  disabled={!addressValid || calcLoading}
                  className="bg-[#5B2333] hover:bg-[#4a1c29] disabled:opacity-40 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all flex items-center gap-2"
                >
                  {calcLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Calculando...
                    </>
                  ) : (
                    "Calcular Frete →"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 – Shipping ── */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl border border-[#EEE8E0] p-8 shadow-sm">
              <h2 className="text-base font-semibold text-[#1C1C1C] mb-1">
                Opção de Envio
              </h2>
              <p className="text-xs text-gray-400 mb-7">
                Confirme o método de entrega
              </p>
              {selectedShipping && (
                <div className="border-2 border-[#C6A75E] bg-[#FAF7F4] rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#C6A75E]/15 rounded-xl flex items-center justify-center text-xl">
                    🚚
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1C1C1C] text-sm">
                      {selectedShipping.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {selectedShipping.deliveryTime}
                    </p>
                  </div>
                  <p className="font-bold text-[#5B2333]">
                    R$ {selectedShipping.price.toFixed(2)}
                  </p>
                </div>
              )}
              <div className="mt-6 bg-[#F8F5F2] rounded-2xl p-4 text-sm space-y-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                  Endereço de entrega
                </p>
                <p className="font-medium text-[#1C1C1C]">
                  {shippingAddress.street}, {shippingAddress.number}
                </p>
                <p className="text-gray-500">
                  {shippingAddress.neighborhood} · {shippingAddress.city} –{" "}
                  {shippingAddress.state}
                </p>
                <p className="text-gray-400 text-xs">
                  CEP {shippingAddress.cep}
                </p>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="border border-[#E8DDD0] text-gray-500 hover:border-[#5B2333] hover:text-[#5B2333] px-6 py-3 rounded-full text-sm transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={nextStep}
                  className="bg-[#5B2333] hover:bg-[#4a1c29] text-white px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-colors"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 – Review (sem resumo duplicado) ── */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl border border-[#EEE8E0] p-8 shadow-sm">
              <h2 className="text-base font-semibold text-[#1C1C1C] mb-1">
                Revisão do Pedido
              </h2>
              <p className="text-xs text-gray-400 mb-7">
                Confirme os dados antes de prosseguir para o pagamento
              </p>

              {/* Entrega */}
              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">
                  Entrega
                </p>
                <div className="bg-[#FAF7F4] rounded-xl p-4 text-sm">
                  <p className="font-medium text-[#1C1C1C]">
                    {shippingAddress.street}, {shippingAddress.number}
                  </p>
                  <p className="text-gray-400 mt-0.5">
                    {shippingAddress.city} – {shippingAddress.state} · CEP{" "}
                    {shippingAddress.cep}
                  </p>
                  <p className="text-[#C6A75E] mt-2 font-medium">
                    {selectedShipping?.name} · R$ {calcShipping().toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Itens */}
              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">
                  Itens ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                </p>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 bg-[#FAF7F4] rounded-xl p-3"
                    >
                      <img
                        src={item.image || "/images/default-perfume.jpg"}
                        alt={item.name}
                        className="w-10 h-10 object-contain flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1C1C1C] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#1C1C1C]">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#FAF7F4] rounded-xl p-4 space-y-2 mb-8">
                <SummaryRow
                  label="Subtotal dos produtos"
                  value={`R$ ${getTotalPrice().toFixed(2)}`}
                />
                {appliedCoupon &&
                  (() => {
                    const total = getTotalPrice();

                    let discountValue = 0;

                    if (appliedCoupon.type === "percentage") {
                      discountValue = (total * appliedCoupon.value) / 100;
                    } else if (appliedCoupon.type === "fixed") {
                      discountValue = appliedCoupon.value;
                    }

                    return (
                      <SummaryRow
                        label={`Desconto (${appliedCoupon.code})`}
                        value={
                          appliedCoupon.type === "percentage"
                            ? `− ${appliedCoupon.value}% (R$ ${discountValue.toFixed(2)})`
                            : `− R$ ${discountValue.toFixed(2)}`
                        }
                        highlight
                      />
                    );
                  })()}
                <SummaryRow
                  label="Frete"
                  value={`R$ ${calcShipping().toFixed(2)}`}
                />
                <div className="border-t border-[#E8DDD0] pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1C1C1C]">Total</span>
                    <span className="text-lg font-bold text-[#5B2333]">
                      R$ {calcTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              {/* Info de pagamento */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-xs text-blue-700">
                💡 Ao clicar em <strong>Gerar Pagamento Pix</strong>, seu pedido
                será criado. Você poderá acompanhá-lo em{" "}
                <strong>Meus Pedidos</strong> mesmo após fechar esta página.
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="border border-[#E8DDD0] text-gray-500 hover:border-[#5B2333] hover:text-[#5B2333] px-6 py-3 rounded-full text-sm transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handlePay}
                  disabled={payLoading}
                  className="bg-[#C6A75E] hover:bg-[#B8954D] disabled:opacity-50 text-[#111] px-8 py-3.5 rounded-full text-sm font-bold tracking-wide transition-all flex items-center gap-2"
                >
                  {payLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#111]/20 border-t-[#111] rounded-full animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar Pagamento Pix →"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4 – PIX ── */}
          {currentStep === 4 && (
            <div className="max-w-md mx-auto w-full">
              {payLoading ? (
                <div className="bg-white rounded-2xl border border-[#EEE8E0] p-16 text-center shadow-sm">
                  <div className="w-12 h-12 border-2 border-[#C6A75E]/20 border-t-[#C6A75E] rounded-full animate-spin mx-auto mb-6" />
                  <p className="font-medium text-[#1C1C1C]">
                    Gerando pagamento…
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Aguarde um momento
                  </p>
                </div>
              ) : pixData ? (
                <div className="bg-white rounded-2xl border border-[#EEE8E0] p-8 shadow-sm text-center">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📲</span>
                  </div>
                  <h2 className="font-semibold text-[#1C1C1C] mb-1">
                    Aguardando Pagamento
                  </h2>
                  <p className="text-xs text-gray-400 mb-2">
                    Escaneie o QR Code ou copie o código Pix
                  </p>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-5">
                    <span className="w-3 h-3 border border-[#C6A75E]/40 border-t-[#C6A75E] rounded-full animate-spin" />
                    Verificando pagamento automaticamente…
                  </div>

                  {/* QR */}
                  <div className="bg-[#FAF7F4] rounded-2xl p-4 inline-block mb-5">
                    <img
                      src={`data:image/png;base64,${pixData.qr_code_base64}`}
                      alt="QR Code Pix"
                      className="w-44 h-44 object-contain mx-auto"
                    />
                  </div>

                  {/* Copy */}
                  <div className="bg-[#FAF7F4] rounded-xl p-3 mb-4 text-left">
                    <p className="text-[10px] text-gray-400 mb-1.5">
                      Código Pix copia e cola
                    </p>
                    <textarea
                      value={pixData.qr_code}
                      readOnly
                      rows={3}
                      className="w-full text-[10px] bg-transparent text-gray-500 resize-none outline-none text-center break-all"
                    />
                  </div>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(pixData.qr_code)
                    }
                    className="w-full bg-[#5B2333] hover:bg-[#4a1c29] text-white py-3.5 rounded-full text-sm font-semibold mb-3 transition-colors"
                  >
                    Copiar código Pix
                  </button>
                  <a
                    href={pixData.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border border-[#5B2333] text-[#5B2333] hover:bg-[#5B2333] hover:text-white py-3 rounded-full text-sm font-medium mb-5 transition-all"
                  >
                    Abrir no Mercado Pago
                  </a>

                  {/* Totals */}
                  <div className="bg-[#FAF7F4] rounded-xl p-4 text-left space-y-2">
                    <SummaryRow
                      label="Subtotal"
                      value={`R$ ${calcSubtotal().toFixed(2)}`}
                    />
                    <SummaryRow
                      label="Frete"
                      value={`R$ ${calcShipping().toFixed(2)}`}
                    />
                    <div className="border-t border-[#E8DDD0] pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#1C1C1C] text-sm">
                          Total
                        </span>
                        <span className="font-bold text-[#5B2333]">
                          R$ {calcTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Sidebar – steps 1-2 */}
          {currentStep < 3 && (
            <OrderSummary
              cartItems={cartItems}
              getTotalPrice={getTotalPrice}
              selectedShipping={selectedShipping}
              appliedCoupon={appliedCoupon}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onApplyCoupon={handleCoupon}
              couponLoading={couponLoading}
              couponError={couponError}
              requiresCpfForCoupon={requiresCpfForCoupon}
              couponCpf={couponCpf}
              setCouponCpf={setCouponCpf}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
