import { useState } from "react";
import logo from "/images/ROYAL.png";
import { apiServices } from "../../services/apiServices";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      const { data } = await apiServices.forgotPassword(email);

      setMessage(data.message || "Email enviado com sucesso");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao enviar email");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md border border-[#E8D8C3]">
        <div className="text-center mb-8">
          <img src={logo} alt="ROYAL" className="h-20 mx-auto mb-4" />

          <h1 className="text-3xl font-semibold tracking-wide text-[#5B2333]">
            Recuperar Senha
          </h1>

          <p className="text-[#A38B6D] mt-2">
            Enviaremos um link para redefinir sua senha
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            required
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5B2333] hover:bg-[#4a1c29] text-[#F5E6D3] py-3 rounded-full tracking-wide transition-all cursor-pointer"
          >
            {loading ? "Enviando..." : "Enviar email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
