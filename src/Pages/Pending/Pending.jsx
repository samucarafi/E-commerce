import { Link } from "react-router-dom";

export default function Pending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#5B2333] mb-4">
          Pagamento pendente ⏳
        </h1>

        <p className="mb-8 text-gray-600">
          Estamos aguardando a confirmação do pagamento.
        </p>

        <Link to="/" className="bg-[#5B2333] text-white px-8 py-3 rounded-full">
          Voltar à loja
        </Link>
      </div>
    </div>
  );
}
