import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create()(
    persist(
      (set) => ({
        cart: [],
  
        addToCart: (item,quantity) =>
          set((state) => {
            const existingItem = state.cart.find((i) => i.id === item.id);
            if (existingItem) {
              return {
                cart: state.cart.map((i) =>
                  i.id === item.id ? { i, quantity: !quantity?i.quantity + 1:q } : i
                ),
              };
            }
            return { cart: [...state.cart, { ...item, quantity: 1 }] };
          }),
  
          removeFromCart: (id) =>
            set((state) => ({
              cart: state.cart.filter((item) => item.id !== id),
            })),
    
          clearCart: () => set({ cart: [] }),
      }),
      {
        name: "cart-storage", // Stores cart data in local storage
      }
    )
  );