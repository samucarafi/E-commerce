import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../Contexts/Cart/CartContext";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#2E2E2E] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center animate-fade-in">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Pedido Realizado com Sucesso!
        </h1>
        <p className="text-gray-600 mb-6">
          Seu pedido #{orderId} foi confirmado e está sendo processado.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            ✓ Pagamento confirmado
            <br />
            ✓ Pedido em preparação
            <br />✓ Você receberá atualizações por email
          </p>
        </div>
        <div className="space-y-3">
          <Link
            to="/orders"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all text-center"
          >
            Ver Meus Pedidos
          </Link>
          <Link
            to="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-all text-center"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
