'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
 
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { useAppStore } from "@/context/AppContext";
import axiosConfig from "@/utils/axiosConfig";

const MyOrders = () => {

    const { currency } =  useAppStore();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosConfig.get("/api/orders");
            console.log(response)
    
            if (!response.data) {
                throw new Error("Failed to fetch orders");
            }
    
            setOrders(response.data.orders || []);
        } catch (error) {
            console.log("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Image
            src={assets.box_icon} 
            alt="No Orders"
            width={150}
            height={150}
          />
          <p className="text-gray-500 text-lg mt-4">No orders found</p>
        </div>
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            {orders?.map((order, index) => (
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
                      {order?.items
                        .map(
                          (item) => item?.product.name + ` x ${item?.quantity}`
                        )
                        .join(", ")}
                    </span>
                    <span>Items : {order?.items.length}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">
                      {order?.address.fullName}
                    </span>
                    <br />
                    <span>{order?.address.area}</span>
                    <br />
                    <span>{`${order?.address.city}, ${order?.address.state}`}</span>
                    <br />
                    <span>{order?.address.phoneNumber}</span>
                  </p>
                </div>
                <p className="font-medium my-auto">
                  {currency}
                  {order?.amount}
                </p>
                <div>
                  <p className="flex flex-col">
                    <span>Method : COD</span>
                    <span>
                      Date : {new Date(order?.date).toLocaleDateString()}
                    </span>
                    <span>Payment : Pending</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;