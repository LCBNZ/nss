import create from "zustand";

export const clientStore = create((set) => ({
  modal: false,
  toggleModal: (value) => set(({ sideModalOpen: value })),
}));
