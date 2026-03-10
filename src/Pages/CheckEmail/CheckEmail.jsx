import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiServices } from "../../services/apiServices";

const CheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleResend = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { data } = await apiServices.resendVerification(email);

      setMessage(data.message || "Email reenviado com sucesso!");
      setTimeLeft(60);
    } catch (err) {
      setMessage(err.response?.data?.error || "Erro ao reenviar email.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          📩 Verifique seu email
        </h1>

        <p className="text-gray-600 mb-4">
          Enviamos um link de confirmação para:
        </p>

        <p className="font-semibold text-blue-600 mb-6">{email}</p>

        <p className="text-sm text-gray-500 mb-6">
          Verifique sua caixa de entrada e spam. Após confirmar seu email, você
          poderá fazer login.
        </p>

        {message && (
          <div className="mb-4 text-sm text-green-600">{message}</div>
        )}

        {timeLeft > 0 ? (
          <p className="text-sm text-gray-500 mb-4">
            Reenviar email em {timeLeft}s
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700"
          >
            {loading ? "Enviando..." : "Reenviar Email"}
          </button>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
        >
          Ir para Login
        </button>
      </div>
    </div>
  );
};

export default CheckEmail;
