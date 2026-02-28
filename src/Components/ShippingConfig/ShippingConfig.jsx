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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    await apiServices.updateShippingConfig(config);
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
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* HEADER */}
      <div className="bg-[#5B2333] text-[#F5E6D3] px-8 py-6 rounded-3xl mb-8 shadow-xl">
        <h2 className="text-2xl font-semibold tracking-wide">
          Configurações de Frete
        </h2>
        <p className="text-[#D4A5A5] text-sm mt-1">
          Gerencie valores e regras de envio
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ESTADOS */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#E8D8C3]">
          <h3 className="font-semibold text-[#5B2333] mb-6">
            Valor por Estado
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {states.map((uf) => (
              <div key={uf}>
                <label className="text-sm text-[#5B2333]">{uf}</label>
                <input
                  type="number"
                  value={config.shippingByState?.[uf] || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      shippingByState: {
                        ...config.shippingByState,
                        [uf]: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full mt-2 px-4 py-2 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CONFIG GERAL */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#E8D8C3] space-y-6">
          <div>
            <label className="text-sm text-[#5B2333]">
              Frete grátis a partir de
            </label>
            <input
              type="number"
              value={config.freeShippingMinValue}
              onChange={(e) =>
                setConfig({
                  ...config,
                  freeShippingMinValue: Number(e.target.value),
                })
              }
              className="w-full mt-2 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-[#5B2333]">Dias extras</label>
            <input
              type="number"
              value={config.extraDays}
              onChange={(e) =>
                setConfig({
                  ...config,
                  extraDays: Number(e.target.value),
                })
              }
              className="w-full mt-2 px-4 py-3 rounded-full border border-[#D4A5A5] focus:ring-2 focus:ring-[#C6A75E] outline-none"
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full py-3 rounded-full bg-[#5B2333] hover:bg-[#4a1c29] text-[#F5E6D3] transition-all disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingConfig;
