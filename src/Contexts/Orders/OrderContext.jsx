import { createContext, useContext } from "react";

export const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context)
    throw new Error("useOrder deve ser usado dentro de OrderProvider");
  return context;
};
