import { Link } from "react-router-dom";

export default function Failure() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Pagamento recusado ❌
        </h1>

        <p className="mb-8 text-gray-600">Algo deu errado com seu pagamento.</p>

        <Link
          to="/checkout"
          className="bg-[#5B2333] text-white px-8 py-3 rounded-full"
        >
          Tentar novamente
        </Link>
      </div>
    </div>
  );
}
