import React, { useEffect, useState } from "react";
import { apiServices } from "../../services/apiServices";

const STATES = [
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO",
];

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1.5 font-medium">
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] placeholder:text-gray-300 focus:outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E]/30 transition-colors bg-white ${className}`}
  />
);

const ShippingConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    shippingByState: {},
    freeShippingMinValue: 0,
    extraDays: 0,
  });

  useEffect(() => {
    apiServices
      .getShippingConfig()
      .then(({ data }) =>
        setConfig({
          shippingByState: data.shippingByState || {},
          freeShippingMinValue: data.freeShippingMinValue ?? 0,
          extraDays: data.extraDays ?? 0,
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await apiServices.updateShippingConfig(config);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const setStatePrice = (uf, val) =>
    setConfig((prev) => ({
      ...prev,
      shippingByState: { ...prev.shippingByState, [uf]: Number(val) },
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#C6A75E]/20 border-t-[#C6A75E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-[#1C1C1C]">
            Configurações de Frete
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Valores por estado e regras de envio
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-[#C6A75E] hover:bg-[#B8954D] text-[#111] disabled:opacity-50"
          }`}
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-[#111]/20 border-t-[#111] rounded-full animate-spin" />
              Salvando…
            </>
          ) : saved ? (
            "✓ Salvo!"
          ) : (
            "Salvar Configurações"
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Frete por estado ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EEE8E0] p-6 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-5">
            Valor por Estado (R$)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STATES.map((uf) => (
              <div key={uf}>
                <label className="text-[10px] text-[#5B2333] font-semibold uppercase tracking-wider mb-1 block">
                  {uf}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                    R$
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={config.shippingByState?.[uf] || ""}
                    onChange={(e) => setStatePrice(uf, e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-[#E8DDD0] rounded-xl pl-8 pr-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E]/30 transition-colors bg-white placeholder:text-gray-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Regras gerais ── */}
        <div className="bg-white rounded-2xl border border-[#EEE8E0] p-6 shadow-sm space-y-5 h-fit">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            Regras Gerais
          </p>

          <Field label="Frete grátis acima de (R$)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                R$
              </span>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={config.freeShippingMinValue}
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    freeShippingMinValue: Number(e.target.value),
                  }))
                }
                className="pl-8"
              />
            </div>
          </Field>

          <Field label="Dias extras de prazo">
            <Input
              type="number"
              min={0}
              value={config.extraDays}
              onChange={(e) =>
                setConfig((p) => ({ ...p, extraDays: Number(e.target.value) }))
              }
            />
          </Field>

          {/* Info card */}
          <div className="bg-[#FAF7F4] rounded-xl p-4 text-xs text-gray-500 space-y-1.5">
            <p className="font-medium text-[#1C1C1C]">Como funciona</p>
            <p>
              O frete é calculado pelo estado de destino e quantidade de itens.
            </p>
            {config.freeShippingMinValue > 0 && (
              <p className="text-emerald-600 font-medium">
                Frete grátis para pedidos acima de R${" "}
                {Number(config.freeShippingMinValue).toFixed(2)}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingConfig;
