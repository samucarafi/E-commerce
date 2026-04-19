import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useOrder } from "../../Contexts/Orders/OrderContext";

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

const CouponsManage = () => {
  const { users, getUsers, updateAffiliate, payAffiliate } = useAuth();
  const { adminOrders, loadAllOrders } = useOrder();

  const [filter, setFilter] = useState("affiliate");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    getUsers();
    loadAllOrders();
  }, []);

  /* ── Affiliate coupons ── */
  const affiliates = useMemo(() => {
    if (!users) return [];
    return users
      .filter((u) => u.affiliate?.couponCode)
      .map((u) => ({
        userId: u._id,
        couponCode: u.affiliate.couponCode,
        discountPercentage: u.affiliate.discountPercentage,
        commissionPercentage: u.affiliate.commissionPercentage,
        owner: u.name,
        email: u.email,
        totalEarned: u.affiliate.totalEarned || 0,
        pendingBalance: u.affiliate.pendingBalance || 0,
        totalPaid: u.affiliate.totalPaid || 0,
      }));
  }, [users]);

  /* ── Used coupons ── */
  const usedCoupons = useMemo(() => {
    if (!adminOrders) return [];
    return adminOrders
      .filter((o) => o.coupon?.code || o.affiliate?.couponCode)
      .map((o) => ({
        code: o.coupon?.code || o.affiliate?.couponCode,
        type: o.coupon?.type || "affiliate",
        discount: o.totals?.discount || o.affiliate?.discountGiven || 0,
        orderId: o.orderId,
        customer: o.customer?.name,
        status: o.payment?.status,
      }));
  }, [adminOrders]);

  /* ── Save affiliate ── */
  const handleSave = async () => {
    setSaving(true);
    const res = await updateAffiliate(editing.userId, {
      couponCode: editing.couponCode,
      discountPercentage: Number(editing.discountPercentage),
      commissionPercentage: Number(editing.commissionPercentage),
    });
    setSaving(false);
    if (res.success) {
      setEditing(null);
      getUsers();
    } else {
      alert(res.error);
    }
  };

  /* ── Pay affiliate ── */
  const handlePay = async (userId) => {
    if (!window.confirm("Confirmar pagamento ao afiliado?")) return;
    setPaying(userId);
    const res = await payAffiliate(userId);
    setPaying(null);
    if (res.success) {
      alert(`Pago: R$ ${res.paid}`);
      getUsers();
    } else {
      alert(res.error);
    }
  };

  const data = filter === "affiliate" ? affiliates : usedCoupons;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#1C1C1C]">Cupons</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Gerencie afiliados e cupons utilizados
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-7">
        {[
          { id: "affiliate", label: "Afiliados" },
          { id: "used", label: "Utilizados" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f.id
                ? "bg-[#5B2333] text-white"
                : "border border-[#E8DDD0] text-gray-500 hover:border-[#5B2333] hover:text-[#5B2333]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Affiliate table ── */}
      {filter === "affiliate" && (
        <div className="bg-white rounded-2xl border border-[#EEE8E0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF7F4] border-b border-[#EEE8E0]">
                  {[
                    "Cupom",
                    "Afiliado",
                    "Desconto",
                    "Comissão",
                    "Saldo",
                    "Total Ganho",
                    "Total Pago",
                    "Ações",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0EB]">
                {affiliates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-14 text-gray-400 text-xs"
                    >
                      Nenhum afiliado cadastrado
                    </td>
                  </tr>
                ) : (
                  affiliates.map((c) => (
                    <tr
                      key={c.userId}
                      className="hover:bg-[#FAF7F4] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono font-semibold text-[#5B2333] text-xs tracking-wider bg-[#5B2333]/8 px-2.5 py-1 rounded-lg">
                          {c.couponCode}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#1C1C1C] text-sm">
                          {c.owner}
                        </p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {c.discountPercentage}%
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {c.commissionPercentage}%
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-emerald-600">
                          R$ {c.pendingBalance.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        R$ {c.totalEarned.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        R$ {c.totalPaid.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setEditing({ ...c })}
                            className="text-xs font-medium text-[#5B2333] hover:text-[#C6A75E] transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handlePay(c.userId)}
                            disabled={
                              paying === c.userId || c.pendingBalance <= 0
                            }
                            className="text-xs font-medium text-emerald-600 hover:text-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            {paying === c.userId ? "Pagando…" : "Pagar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Used coupons table ── */}
      {filter === "used" && (
        <div className="bg-white rounded-2xl border border-[#EEE8E0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF7F4] border-b border-[#EEE8E0]">
                  {["Código", "Pedido", "Cliente", "Desconto", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0EB]">
                {usedCoupons.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-14 text-gray-400 text-xs"
                    >
                      Nenhum cupom utilizado
                    </td>
                  </tr>
                ) : (
                  usedCoupons.map((c, i) => (
                    <tr
                      key={i}
                      className="hover:bg-[#FAF7F4] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono font-semibold text-[#5B2333] text-xs tracking-wider bg-[#5B2333]/8 px-2.5 py-1 rounded-lg">
                          {c.code}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">#{c.orderId}</td>
                      <td className="px-5 py-4 text-[#1C1C1C]">{c.customer}</td>
                      <td className="px-5 py-4 font-medium text-emerald-600">
                        − R$ {c.discount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                            c.status === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : c.status === "pending"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {c.status === "approved"
                            ? "Pago"
                            : c.status === "pending"
                              ? "Pendente"
                              : (c.status ?? "—")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editing && (
        <div
          onClick={() => setEditing(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-[#EEE8E0] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#5B2333] px-6 py-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-[#F5E6D3] text-sm">
                  Editar Afiliado
                </h3>
                <p className="text-[#D4A5A5] text-xs mt-0.5">{editing.owner}</p>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="text-[#D4A5A5] hover:text-[#F5E6D3] text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Field label="Código do Cupom">
                <Input
                  value={editing.couponCode}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      couponCode: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="CÓDIGO"
                  className="uppercase tracking-wider font-mono"
                />
              </Field>
              <Field label="Desconto ao cliente (%)">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editing.discountPercentage}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      discountPercentage: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Comissão do afiliado (%)">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editing.commissionPercentage}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      commissionPercentage: e.target.value,
                    })
                  }
                />
              </Field>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="border border-[#E8DDD0] text-gray-500 px-5 py-2.5 rounded-full text-sm hover:border-[#5B2333] hover:text-[#5B2333] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#5B2333] hover:bg-[#4a1c29] disabled:opacity-50 text-[#F5E6D3] px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
                >
                  {saving ? "Salvando…" : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManage;
