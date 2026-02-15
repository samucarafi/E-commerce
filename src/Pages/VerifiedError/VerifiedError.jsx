import { useState } from "react";
import { apiServices } from "../../services/apiServices";

export default function VerifiedError() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    try {
      const { data } = await apiServices.resendVerification(email);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao reenviar");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold text-red-500 mb-4">
        Link inválido ou expirado
      </h1>

      <p className="mb-4 text-gray-600">
        Digite seu email para receber um novo link.
      </p>

      <input
        type="email"
        placeholder="Seu email"
        className="border px-4 py-2 rounded mb-4 w-80"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleResend}
        className="bg-[#C6A75E] text-white px-6 py-2 rounded"
      >
        Reenviar email
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
