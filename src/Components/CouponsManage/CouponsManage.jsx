import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { useOrder } from "../../Contexts/Orders/OrderContext";

const CouponsManage = () => {
  const { users, getUsers, updateAffiliate, payAffiliate } = useAuth();
  const { adminOrders, loadAllOrders } = useOrder();

  const [filter, setFilter] = useState("affiliate");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getUsers();
    loadAllOrders();
  }, []);

  // =========================
  // AFILIADOS
  // =========================
  const affiliateCoupons = useMemo(() => {
    if (!users) return [];

    return users
      .filter((u) => u.affiliate?.couponCode)
      .map((u) => ({
        userId: u._id,
        couponCode: u.affiliate.couponCode,
        discountPercentage: u.affiliate.discountPercentage,
        commissionPercentage: u.affiliate.commissionPercentage,
        owner: u.name,
        totalEarned: u.affiliate.totalEarned || 0,
        pendingBalance: u.affiliate.pendingBalance || 0,
        totalPaid: u.affiliate.totalPaid || 0,
      }));
  }, [users]);

  // =========================
  // CUPONS USADOS
  // =========================
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

  const data = filter === "affiliate" ? affiliateCoupons : usedCoupons;

  // =========================
  // HANDLERS
  // =========================

  const handleSave = async () => {
    const payload = {
      couponCode: editing.couponCode,
      discountPercentage: Number(editing.discountPercentage),
      commissionPercentage: Number(editing.commissionPercentage),
    };

    const res = await updateAffiliate(editing.userId, payload);

    if (res.success) {
      alert("Atualizado com sucesso!");
      setEditing(null);
      getUsers(); // 🔄 atualiza lista
    } else {
      alert(res.error);
    }
  };

  const handlePay = async (userId) => {
    const res = await payAffiliate(userId);

    if (res.success) {
      alert(`Pago: R$ ${res.paid}`);
      getUsers(); // 🔄 atualiza saldo
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* HEADER */}
      <div className="bg-[#5B2333] text-[#F5E6D3] px-8 py-6 rounded-3xl mb-8 shadow-xl">
        <h2 className="text-2xl font-semibold">Gerenciamento de Cupons</h2>
      </div>

      {/* FILTROS */}
      <div className="mb-8 flex gap-3">
        {[
          { id: "affiliate", label: "Afiliados" },
          { id: "used", label: "Utilizados" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-5 py-2 rounded-full ${
              filter === f.id ? "bg-[#5B2333] text-white" : "border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="space-y-6">
        {data.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow">
            {filter === "affiliate" ? (
              <>
                <p className="font-bold text-lg">{c.couponCode}</p>
                <p className="text-sm text-gray-500">{c.owner}</p>

                <div className="mt-3 text-sm">
                  <p>Desconto: {c.discountPercentage}%</p>
                  <p>Comissão: {c.commissionPercentage}%</p>

                  <p className="text-green-700">
                    Saldo: R$ {c.pendingBalance.toFixed(2)}
                  </p>

                  <p className="text-gray-500">
                    Total ganho: R$ {c.totalEarned.toFixed(2)}
                  </p>

                  <p className="text-gray-500">
                    Total pago: R$ {c.totalPaid.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      setEditing({
                        userId: c.userId,
                        couponCode: c.couponCode,
                        discountPercentage: c.discountPercentage,
                        commissionPercentage: c.commissionPercentage,
                      })
                    }
                    className="px-4 py-2 bg-[#C6A75E] text-white rounded-full"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handlePay(c.userId)}
                    className="px-4 py-2 bg-green-600 text-white rounded-full"
                  >
                    Pagar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-bold">{c.code}</p>
                <p>Pedido: {c.orderId}</p>
                <p>Cliente: {c.customer}</p>
                <p>R$ {c.discount.toFixed(2)}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Editar Cupom</h3>

            <input
              className="w-full border p-2 mb-3"
              value={editing.couponCode}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  couponCode: e.target.value,
                })
              }
              placeholder="Código"
            />

            <input
              className="w-full border p-2 mb-3"
              type="number"
              value={editing.discountPercentage}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  discountPercentage: e.target.value,
                })
              }
              placeholder="Desconto %"
            />

            <input
              className="w-full border p-2 mb-3"
              type="number"
              value={editing.commissionPercentage}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  commissionPercentage: e.target.value,
                })
              }
              placeholder="Comissão %"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)}>Cancelar</button>

              <button
                onClick={handleSave}
                className="bg-[#5B2333] text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManage;
