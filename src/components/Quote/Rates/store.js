import create from "zustand";

export const useRatesStore = create((set) => ({
  rates: [],
  setRates: (data) => {
    set({ rates: data });
  },
  updateRate: (id, name, value) => {
    set((state) => ({
      rates: state.rates.map((rate) =>
        rate.id === id ? { ...rate, [name]: value } : rate,
      ),
    }));
  },
}));
