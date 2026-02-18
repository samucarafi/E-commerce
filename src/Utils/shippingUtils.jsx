const sudestePrefixes = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09", // SP
  "20",
  "21",
  "22",
  "23",
  "24", // RJ
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38", // MG
  "29", // ES
];

export const shippingUtils = {
  isSudeste: (cep) => {
    const cleanCep = cep.replace(/\D/g, "");
    const prefix = cleanCep.substring(0, 2);
    return sudestePrefixes.includes(prefix);
  },

  calculateFixedShipping: (quantity) => {
    const base = 16.92;
    const adicional = Math.max(quantity - 1, 0) * 2;
    return +(base + adicional).toFixed(2);
  },
  formatCep: (cep) => {
    return cep.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");
  },
  clearAddressFields: () => ({
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
  }),

  validateCep: (cep) => {
    const cleanCep = cep.replace(/\D/g, "");
    return cleanCep.length === 8;
  },

  // Simulação de cálculo de frete (substitua pela API real)
  calculateShippingSimulation: (cep, items) => {
    const totalWeight = items.reduce(
      (sum, item) => sum + (item.weight || 0.5) * item.quantity,
      0,
    );
    const totalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const basePrice = 15.0;
    const weightFactor = totalWeight * 2.5;
    const valueFactor = totalValue * 0.01;

    return [
      {
        id: "pac",
        name: "PAC",
        description: "Entrega em 8-12 dias úteis",
        price: basePrice + weightFactor + valueFactor,
        deliveryTime: "8-12 dias úteis",
        company: "Correios",
      },
      {
        id: "sedex",
        name: "SEDEX",
        description: "Entrega em 2-4 dias úteis",
        price: (basePrice + weightFactor + valueFactor) * 1.8,
        deliveryTime: "2-4 dias úteis",
        company: "Correios",
      },
      {
        id: "expressa",
        name: "Entrega Expressa",
        description: "Entrega em 1-2 dias úteis",
        price: (basePrice + weightFactor + valueFactor) * 2.5,
        deliveryTime: "1-2 dias úteis",
        company: "Transportadora",
      },
    ];
  },

  // Consulta CEP via ViaCEP (API pública)
  consultCep: async (cep) => {
    try {
      const cleanCep = cep.replace(/\D/g, "");
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      return {
        cep: data.cep,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        complement: data.complemento,
      };
    } catch (error) {
      throw new Error("Erro ao consultar CEP");
    }
  },
};
