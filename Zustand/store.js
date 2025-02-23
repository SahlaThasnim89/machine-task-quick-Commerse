import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      name: null,
      email: null,

      login: (user) => {
        set({
          isAuthenticated: true,
          ...user,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          name: null,
          email: null,
        });
      },
    }),
    {
      name: "user-storage",
    }
  )
);

  

