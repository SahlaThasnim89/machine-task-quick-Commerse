"use client";
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";

import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import axiosConfig from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import { socket } from "@/utils/socket";

const ProductList = () => {
  const statusOptions = [
    "Pending",
    "Accepted",
    "Out for Delivery",
    "Delivered",
  ];
  const [changed, setchanged] = useState(false);
  const handleStatusChange = async (index, newStatus, orderId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, status: newStatus } : product
      )
    );
    try {
      const {data} = await axiosConfig.put(`/api/orders`, {
        orderId,
        status: newStatus,
      });
      socket.emit("orderStatusChange",{userId:data.order.customerId.email,status:newStatus})
      // console.log(res);
      setchanged(false);
      toast.success("stauts updated successfully");
      // console.log("Order status updated successfully");
    } catch (error) {
      console.log("error", error.message);
    }
  };


  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    const { data } = await axiosConfig.get("/api/orders/all?status=Pending");
    setProducts(data.orders);
    setLoading(false);
  };

  useEffect(() => {
    if (!changed) fetchSellerProduct();
    setchanged(true);
  }, [changed]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
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
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Pending Orders</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className=" table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="px-1 py-3 font-medium truncate">#</th>
                  <th className="px-1 py-3 font-medium truncate">
                    customer name
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Order Amount
                  </th>
                  <th className="px-4 py-3 font-medium truncate">
                    Product Quantity
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr key={index} className="border-t border-gray-500/20">
                    <td className="md:px-4  py-3 ">
                      <h1>{index + 1}</h1>
                      {/* <div className="bg-gray-500/10 rounded p-2"> */}

                      {/* <Image
                          src={product.image[0]}
                          alt="product Image"
                          className="w-16"
                          width={1280}
                          height={720}
                        /> */}
                      {/* </div> */}
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {product.customerId?.name}
                    </td>
                    <td className="px-4 py-3">${product.orderAmount}</td>
                    <td className="px-4 py-3">{product.quantity}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <select
                        value={product.status}
                        onChange={(e) =>
                          handleStatusChange(index, e.target.value, product._id)
                        }
                        className="border rounded p-2 bg-gray-600 text-white"
                      >
                        {statusOptions.map((status, i) => (
                          <option key={i} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr className="border-t border-gray-500/20 flex items-center justify-start">
                    <td className="w-full  p-5"> ooops! no pending orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
