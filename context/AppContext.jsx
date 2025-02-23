"use client";
import { create } from "zustand";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useAppStore = create(
  persist(
    (set, get) => ({
      currency: process.env.NEXT_PUBLIC_CURRENCY,
      isSeller: true,
      userData: null,
      products: productsDummyData,
      cartItems: {},
      //   count: 0,
      setIsSeller: (isSeller) => set({ isSeller }),

      fetchUserData: async () => {
        set({ userData: userDummyData });
      },

      fetchProductData: async () => {
        set({ products: productsDummyData });
      },

      addToCart: (itemId) => {
        if (userData.role == "delivery")
          return toast.error("please login as customer to make and order");
        toast.success("product added successfully");
        const cartData = { ...get().cartItems };
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        set({ cartItems: cartData, count: count + 1 });
      },

      updateCartQuantity: (itemId, quantity) => {
        if (userData.role == "delivery")
          return toast.error("please login as customer to make and order");
        toast.success("product quantity updated successfully");
        const cartData = { ...get().cartItems };
        if (quantity === 0) {
          delete cartData[itemId];
        } else {
          cartData[itemId] = quantity;
        }
        set({ cartItems: cartData });
      },

      getCartCount: () => {
        return Object.values(get().cartItems).reduce(
          (acc, qty) => acc + qty,
          0
        );
      },

      getCartAmount: () => {
        const { cartItems, products } = get();
        return Object.entries(cartItems)
          .reduce((total, [itemId, qty]) => {
            const itemInfo = products.find((product) => product._id === itemId);
            return itemInfo ? total + itemInfo.offerPrice * qty : total;
          }, 0)
          .toFixed(2);
      },
    }),
    {
      name: "cart-store", // Key for persisting the state
    }
  )
);
