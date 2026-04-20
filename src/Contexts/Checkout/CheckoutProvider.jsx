import { useState } from "react";
import { CheckoutContext } from "./CheckoutContext";
import { shippingUtils } from "../../Utils/shippingUtils";
import { api } from "../../config/api";

export const CheckoutProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    cpf: "",
  });
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentData, setPaymentData] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderSummary, setOrderSummary] = useState({});

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const calculateShipping = async (items) => {
    try {
      if (
        !shippingAddress.cep ||
        !shippingUtils.validateCep(shippingAddress.cep)
      ) {
        throw new Error("CEP inválido");
      }

      // Aqui você substituirá pela chamada real da API
      // const response = await apiServices.calculateShipping({
      //     cep: shippingAddress.cep,
      //     items: items
      // });

      // Simulação para desenvolvimento
      const options = shippingUtils.calculateShippingSimulation(
        shippingAddress.cep,
        items,
      );
      setShippingOptions(options);
      return options;
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      throw error;
    }
  };

  const applyCoupon = async (code, orderData) => {
    try {
      const { data } = await api.post("/coupons/validate", {
        code,
        cpf: orderData.cpf, // ← novo campo para PRIMEIRACOMPRA
        ...orderData,
      });
      setAppliedCoupon(data.coupon);
      return { success: true, coupon: data.coupon };
    } catch (error) {
      // Repassa o objeto do servidor para o chamador decidir o que mostrar
      const serverError = error.response?.data;
      if (serverError?.requiresCpf) {
        throw { requiresCpf: true, message: serverError.error };
      }
      throw new Error(serverError?.error || "Cupom inválido");
    }
  };

  const createOrder = async (orderData) => {
    try {
      // Aqui você substituirá pela chamada real da API
      // const response = await apiServices.createOrder(orderData);

      // Simulação para desenvolvimento
      const order = {
        id: Date.now(),
        ...orderData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      return { success: true, order };
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    }
  };

  const resetCheckout = () => {
    setCurrentStep(1);
    setShippingAddress({
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      cpf: "",
    });
    setSelectedShipping(null);
    setCouponCode("");
    setAppliedCoupon(null);
  };

  const processPayment = async (paymentData) => {
    try {
      // Aqui você substituirá pela chamada real da API
      // const response = await apiServices.createPayment(paymentData);

      // Simulação para desenvolvimento
      const payment = {
        id: Date.now(),
        status: "approved",
        method: paymentData.method,
        amount: paymentData.amount,
        createdAt: new Date().toISOString(),
      };

      return { success: true, payment };
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      throw error;
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        currentStep,
        nextStep,
        prevStep,
        goToStep,
        resetCheckout,
        shippingAddress,
        setShippingAddress,
        selectedShipping,
        setSelectedShipping,
        shippingOptions,
        setShippingOptions,
        selectedPayment,
        setSelectedPayment,
        paymentData,
        setPaymentData,
        couponCode,
        setCouponCode,
        appliedCoupon,
        setAppliedCoupon,
        orderSummary,
        setOrderSummary,
        calculateShipping,
        applyCoupon,
        createOrder,
        processPayment,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
