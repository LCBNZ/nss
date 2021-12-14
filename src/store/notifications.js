import create from "zustand";
import { v4 as uuidv4 } from "uuid";

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => {

    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: uuidv4(), ...notification },
      ],
    }));
  },
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),
}));
