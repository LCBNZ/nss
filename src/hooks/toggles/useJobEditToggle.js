import create from 'zustand';

export const useJobEditToggle = create((set) => ({
  displayModal: false,
  toggle: () => set((state) => ({ displayModal: !state.displayModal })),
}));
