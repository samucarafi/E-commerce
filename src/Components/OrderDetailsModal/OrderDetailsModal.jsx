import getPaymentStatusIcon from "../../Utils/GetPaymentStatusIcon";
import { getStatusColor } from "../../utils/StatusColor";
import { getStatusText } from "../../utils/StatusText";

const OrderDetailsModal = ({ order, onClose }) => {
  {
    console.log(order);
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto slide-up">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">
                Detalhes do Pedido #{order.id}
              </h3>
              <p className="text-gray-600">
                Criado em{" "}
                {new Date(order.date_created).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Status and Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Status do Pedido</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                {order.trackingCode && (
                  <div className="text-sm text-gray-600">
                    <i className="fas fa-truck mr-2"></i>
                    Código de rastreio:{" "}
                    <span className="font-mono">{order.trackingCode}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Status do Pagamento</h4>
              <div className="flex items-center gap-2">
                <i className={getPaymentStatusIcon(order.paymentStatus)}></i>
                <span
                  className={`font-medium ${
                    getStatusColor(order.paymentStatus).split(" ")[1]
                  }`}
                >
                  {getStatusText(order.paymentStatus)}
                </span>
              </div>
              {order.preferenceId && (
                <div className="text-sm text-gray-600 mt-2">
                  <i className="fab fa-cc-mastercard mr-2"></i>
                  Mercado Pago
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-semibold mb-4">Itens do Pedido</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-6">Produto</div>
                  <div className="col-span-2 text-center">Quantidade</div>
                  <div className="col-span-2 text-right">Preço Unit.</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {order.mercadoPagoData?.items?.map((item, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-600">
                          {item.currency_id}
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        R$ {item.unit_price.toFixed(2).replace(".", ",")}
                      </div>
                      <div className="col-span-2 text-right font-semibold">
                        R${" "}
                        {(item.unit_price * item.quantity)
                          .toFixed(2)
                          .replace(".", ",")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total do Pedido:</span>
                  <span className="text-xl font-bold text-green-600">
                    {/* R$ {order.total.toFixed(2).replace(".", ",")} */}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.mercadoPagoData?.shipments?.receiver_address && (
            <div>
              <h4 className="font-semibold mb-4">Endereço de Entrega</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt text-gray-400 mt-1"></i>
                  <div>
                    <div className="font-medium">
                      {order.mercadoPagoData.payer?.name}{" "}
                      {order.mercadoPagoData.payer?.surname}
                    </div>
                    <div className="text-gray-600 mt-1">
                      {
                        order.mercadoPagoData.shipments.receiver_address
                          .street_name
                      }
                      ,{" "}
                      {
                        order.mercadoPagoData.shipments.receiver_address
                          .street_number
                      }
                      <br />
                      {
                        order.mercadoPagoData.shipments.receiver_address
                          .city_name
                      }{" "}
                      -{" "}
                      {
                        order.mercadoPagoData.shipments.receiver_address
                          .state_name
                      }
                      <br />
                      CEP:{" "}
                      {
                        order.mercadoPagoData.shipments.receiver_address
                          .zip_code
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mercado Pago Info */}
          {order.mercadoPagoData && (
            <div>
              <h4 className="font-semibold mb-4">Informações do Pagamento</h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <i className="fab fa-cc-mastercard text-blue-600 text-xl"></i>
                  <div>
                    <div className="font-medium text-blue-800">
                      Mercado Pago
                    </div>
                    <div className="text-sm text-blue-600">
                      Preference ID: {order.preferenceId}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-blue-700">
                  <div>
                    Data de criação:{" "}
                    {new Date(
                      order.mercadoPagoData.date_created
                    ).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {order.mercadoPagoData.payer?.email && (
                    <div>
                      Email do pagador: {order.mercadoPagoData.payer.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
            {order.paymentStatus === "approved" &&
              order.status !== "delivered" && (
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <i className="fas fa-times mr-2"></i>Cancelar Pedido
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetailsModal;
