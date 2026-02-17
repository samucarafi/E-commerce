import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useProduct } from "../../Contexts/Product/ProductContext";
import logo from "/images/ROYAL.png";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useAuth();
  const { loadProducts } = useProduct();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const result = await login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          await loadProducts();
          navigate("/");
        } else {
          setError(result.error);
        }
      } else {
        const result = await register(formData);

        if (result.success) {
          setFormData({
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
          });
          setIsLogin(true);

          setError("Conta criada! Faça login para continuar.");
          // ATIVAR QUANDO TIVER DOMINIO
          //   ,{
          //   state: { email: formData.email },
          // });
        } else {
          setError(result.error);
        }
      }
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md border border-[#E8D8C3]">
        <div className="text-center mb-8">
          <img src={logo} alt="ROYAL" className="h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-semibold tracking-wide text-[#5B2333]">
            {isLogin ? "Acessar Conta" : "Criar Conta"}
          </h1>
          <p className="text-[#A38B6D] mt-2">
            {isLogin
              ? "Entre para viver a experiência Royal"
              : "Cadastre-se e descubra novas essências"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <input
              type="text"
              required
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
            />
          )}

          <input
            type="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
          />

          <input
            type="password"
            required
            placeholder="Senha"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
          />

          {!isLogin && (
            <input
              type="password"
              required
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5B2333] hover:bg-[#4a1c29] text-[#F5E6D3] py-3 rounded-full tracking-wide transition-all"
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#5B2333]">
          {isLogin ? "Não tem conta?" : "Já possui conta?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 underline hover:text-[#C6A75E]"
          >
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
