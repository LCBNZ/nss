import create from "zustand";

export const useQuoteStore = create((set) => ({
  length: 0,
  setLength: (value) => {

    set({ length: value });
  },
}));
