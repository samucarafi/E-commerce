const PaymentsConfig = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Configurações de Pagamento
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Gateways de Pagamento</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span>Mercado Pago</span>
              <span className="text-gray-500">Configurar</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span>PagSeguro</span>
              <span className="text-gray-500">Configurar</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span>Stripe</span>
              <span className="text-gray-500">Configurar</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span>PIX</span>
              <span className="text-green-600">✓ Ativo</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Configurações PIX</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Chave PIX:
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="sua-chave@pix.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Nome do Beneficiário:
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="TechStore LTDA"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Salvar Configurações PIX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsConfig;
