'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData,productsDummyData } from "@/assets/assets";
import Image from "next/image";
 ;
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { useAppStore } from "@/context/AppContext";
import axiosConfig from "@/utils/axiosConfig";


const Orders = () => {


  const { currency } = useAppStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axiosConfig.get("/api/orders?status=Delivered");
    //   console.log(response);

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

    const getProductName = (id) => {
      const product = productsDummyData.find((p) => p._id === id);
      return product ? product.name : "Unknown Product";
    };
  
    const getProductImage = (id) => {
      const product = productsDummyData.find((p) => p._id === id);
      return product?.image?.[0] || assets.box_icon;
    };

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
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
          <p className="text-gray-500 text-lg mt-4">You have'nt ordered with us in past</p>
        </div>
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
                   {order.products.map((item) => (
                                     <Image
                                       key={item.id}
                                       className="w-16 h-16 object-cover"
                                       src={getProductImage(item.id) || assets.box_icon}
                                       alt="Product Image"
                                       width={64}
                                       height={64}
                                     />
                                   ))}
                  <p className="flex flex-col gap-3">
                    <span className="font-medium">
                    {order.products
                        .map(
                          (item) =>
                            `${getProductName(item.id)} x ${item.quantity}`
                        )
                        .join(", ")}
                    </span>
                    <span>Items : {order.products.length}</span>
                    {order?.deliveryPartnerId && <span>Delivered by: {order.deliveryPartnerId}</span>}                  </p>
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
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};




export default Orders;