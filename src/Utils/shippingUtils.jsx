export const shippingUtils = {
  formatCep: (cep) => cep.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2"),

  validateCep: (cep) => cep.replace(/\D/g, "").length === 8,

  clearAddressFields: () => ({
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
  }),

  calculateShippingByState: (state, quantity, table) => {
    if (!state || !table || !table[state]) return null;

    const base = table[state];
    const additional = Math.max(quantity - 1, 0) * 2.5;

    return +(base + additional).toFixed(2);
  },

  consultCep: async (cep) => {
    const cleanCep = cep.replace(/\D/g, "");
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) throw new Error("CEP não encontrado");

    return {
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      complement: data.complemento,
    };
  },
};
