import { api } from "../config/api";

export const createCheckoutPayment = async (payload) => {
  const { data } = await api.post("/checkout", payload);
  return data;
};
