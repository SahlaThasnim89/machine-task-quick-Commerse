
"use client";

import React, { useEffect } from 'react';
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUserStore } from "@/Zustand/store";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

const Navbar = () => {

  const  router  =  useRouter()
  const { name, email, isAuthenticated, logout, role } = useUserStore();
  const {data:session,status}=useSession()

  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSignOut=async()=>{
    await signOut({
      redirect:false,
    });
    logout();
    toast.success("Logged out successfully");
  }

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <Image onClick={()=>router.push('/')} className='w-28 lg:w-32 cursor-pointer' src={assets.logo} alt="" />
      <button onClick={() => handleSignOut()} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar