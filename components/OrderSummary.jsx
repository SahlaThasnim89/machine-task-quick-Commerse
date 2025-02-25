"use client";

import { addressDummyData } from "@/assets/assets";

import axiosConfig from "@/utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/Zustand/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/context/AppContext";
// import { useCartStore } from "@/Zustand/cartStore";




const OrderSummary = () => {
  const router = useRouter();
  // const {clearCart}=useCartStore()

  const user = useUserStore();

  const { currency, getCartCount, getCartAmount, cartItems ,updateCartQuantity } =
    useAppStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    console.log("User updated:", user);
  }, [user]);

  console.log(user);

  const fetchUserAddresses = async () => {
    if (!user || !user.email) return;

    try {
      const response = await axiosConfig.get(
        `/api/address/get?email=${user.email}`
      );
      setUserAddresses(response?.data?.addresses?.address || addressDummyData);
    } catch (error) {
      console.log("Failed to fetch addresses", error);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    console.log(
      cartItems,
      selectedAddress,
      user._id,
      getCartAmount() + Math.floor(getCartAmount() * 0.02)
    );

    // const cartArray = Array.isArray(cartItems) ? cartItems : Object.values(cartItems);

    if (!selectedAddress) {
      toast("Please select an address.");
      return;
    }

    if (cartItems.length === 0) {
      toast("Your cart is empty.");
      return;
    }
    const products = [];
    Object.keys(cartItems).map((key) => {
      products.push({ id: key, quantity: cartItems[key] });
    });

    const orderData = {
      customerId: user._id,
      products: products,
      quantity: products.length,
      address: {
        fullName: selectedAddress.fullName,
        phoneNumber: selectedAddress.phoneNumber,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        country: selectedAddress.country,
      },
      orderAmount: Math.floor(getCartAmount()),
    };

    // console.log(orderData, "ttutytutuytuytff");

    try {
      const response = await axiosConfig.post("/api/orders", orderData);
      // console.log("Order placed successfully:", response.data);
      router.push("/order-placed");
      updateCartQuantity("clearCart", 0);
      // clearCart()
    } catch (error) {
      console.log("Failed to place order", error);
      setError("Failed to place order. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.phoneNumber}, ${selectedAddress.city},${selectedAddress.zipCode}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses?.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.phoneNumber}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">
              {currency}
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>

          {/* <p className="text-gray-600">Tax (2%)</p> */}
          {/* <p className="font-medium text-gray-800">
              {currency}
              {Math.floor(getCartAmount())}
            </p> */}
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {Math.floor(getCartAmount())}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;