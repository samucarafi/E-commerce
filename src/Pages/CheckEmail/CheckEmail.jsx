import { useLocation, useNavigate } from "react-router-dom";

const CheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

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

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Ir para Login
        </button>
      </div>
    </div>
  );
};

export default CheckEmail;
