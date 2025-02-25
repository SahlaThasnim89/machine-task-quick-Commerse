'use client'
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
 
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import axiosConfig from "@/utils/axiosConfig";
import { useUserStore } from "@/Zustand/store";
import { useAppStore } from "@/context/AppContext";
import { useRouter } from "next/navigation";


const Profile = () => {

    const router=useRouter()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { products } =  useAppStore()
    const haveUser=useUserStore()



    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await axiosConfig.get("/api/auth/user");
            // console.log(res.data.user,'ioioi')
            if (!res.data) throw new Error("Failed to fetch user");
            setUser(res.data.user);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUser();
      }, []);




    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">

        <div className="flex flex-col md:flex-row items-center justify-center md:pl-20 py-14 md:py-0 bg-[#E6E9F2] my-2 rounded-xl overflow-hidden">

      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 py-24 md:px-0">
      <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          Welcome !
        </h2>
        <h2 className="text-2xl md:text-3xl text-orange-600 font-semibold max-w-[290px]">
          {user?.name||haveUser.name}
        </h2>
        <p className="max-w-[343px] font-semibold text-gray-800/60 my-10 text-xl">
          {user?.email||haveUser.name}
        </p>
      
      <button onClick={() => { router.push('/all-products') }} className="px-12 py-2.5 border rounded bg-slate-50/90 text-gray-500/70 hover:bg-slate-70/90 transition">
        Shop more
      </button>
      </div>

    </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Profile;