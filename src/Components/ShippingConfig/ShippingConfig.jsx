import React from "react";

const ShippingConfig = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Configurações de Frete
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">APIs de Frete Configuradas</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span>Correios</span>
              <span className="text-green-600">✓ Ativo</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span>Melhor Envio</span>
              <span className="text-gray-500">Configurar</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span>Jadlog</span>
              <span className="text-gray-500">Configurar</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Configurações Gerais</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Frete Grátis a partir de:
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="R$ 200,00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Prazo adicional (dias):
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="2"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingConfig;
