"use client";
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { useAppStore } from "@/context/AppContext";
import axiosConfig from "@/utils/axiosConfig";

const MyOrders = () => {
  const { currency } = useAppStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axiosConfig.get("/api/orders");
      // console.log(response);

      if (!response.data) {
        throw new Error("Failed to fetch orders");
      }

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
              >
                <div className="flex-1 flex gap-5 max-w-80">
                  <Image
                    className="max-w-16 max-h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                  />
                  <p className="flex flex-col gap-3">
                    <span className="font-medium">
                      {order.products
                        .map(
                          (item) => item.id + ` x ${item.quantity}`
                        )
                        .join(", ")}
                    </span>
                    <span>Items : {order.products.length}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">
                      {order.address.fullName}
                    </span>
                    <br />
                    <span>{order.address.area}</span>
                    <br />
                    <span>{`${order.address.city}, ${order.address.state}`}</span>
                    <br />
                    <span>{order.address.phoneNumber}</span>
                  </p>
                </div>
                <p className="font-medium my-auto">
                  {currency}
                  {order.orderAmount}
                </p>
                <div>
                  <p className="flex flex-col">
                    <span>Method : COD</span>
                    <span>
                      Date : {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>Payment : Pending</span>
                  </p>
                </div>
              </div>
            ))}

{orders.length === 0 && (
                  <div className="border-t border-gray-500/20 flex items-center justify-start">
                    <p className="w-full  p-5"> ooops! you have'nt any new orders</p>
                  </div>
                )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyOrders;
