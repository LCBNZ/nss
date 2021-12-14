import create from "zustand";

export const useQuoteStore = create((set) => ({
  quote: null,
  isLoading: true,
  addQuote: (quote) => {
    set({ quote });
  },
  setLoading: (status) => set({ isLoading: status }),
}));
