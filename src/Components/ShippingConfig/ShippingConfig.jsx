import React, { useEffect, useState } from "react";

import { apiServices } from "../../services/apiServices";
const states = [
  "RJ",
  "SP",
  "MG",
  "ES",
  "PR",
  "SC",
  "RS",
  "BA",
  "SE",
  "AL",
  "PE",
  "PB",
  "RN",
  "CE",
  "PI",
  "MA",
  "GO",
  "DF",
  "MT",
  "MS",
  "TO",
  "PA",
  "AP",
  "AM",
  "RR",
  "RO",
  "AC",
];

const ShippingConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    shippingByState: {},
    freeShippingMinValue: 0,
    extraDays: 0,
  });

  const load = async () => {
    try {
      const { data } = await apiServices.getShippingConfig();

      setConfig({
        shippingByState: data.shippingByState || {},
        freeShippingMinValue: data.freeShippingMinValue ?? 0,
        extraDays: data.extraDays ?? 0,
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar config frete");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChangeState = async (uf, value) => {
    const newValue = Number(value);

    setConfig((prev) => {
      const updated = {
        ...prev,
        shippingByState: {
          ...prev.shippingByState,
          [uf]: newValue,
        },
      };

      apiServices.updateShippingConfig(updated);
      return updated;
    });
  };

  const save = async () => {
    setSaving(true);
    await apiServices.updateShippingConfig({
      shippingByState: config.shippingByState,
      freeShippingMinValue: config.freeShippingMinValue,
      extraDays: config.extraDays,
    });
    setSaving(false);
    alert("Salvo!");
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Carregando configurações...
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Configurações de Frete</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* tabela estados */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold mb-4">Valor por Estado</h3>

          <div className="grid grid-cols-2 gap-3">
            {states.map((uf) => (
              <div key={uf}>
                <label className="text-sm">{uf}</label>
                <input
                  type="number"
                  value={config.shippingByState?.[uf] || ""}
                  onChange={(e) => handleChangeState(uf, e.target.value || 0)}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* config geral */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label>Frete grátis a partir de</label>
            <input
              type="number"
              value={config.freeShippingMinValue}
              onChange={(e) =>
                setConfig({
                  ...config,
                  freeShippingMinValue: Number(e.target.value),
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Dias extras</label>
            <input
              type="number"
              value={config.extraDays}
              onChange={(e) =>
                setConfig({
                  ...config,
                  extraDays: Number(e.target.value),
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingConfig;
