"use client"
import React, { useEffect, useRef, useState } from "react";
import { assets} from "@/assets/assets";
import Link from "next/link"
import toast from "react-hot-toast";
import Image from "next/image";
import { useUserStore } from "@/Zustand/store";
import { useRouter } from "next/navigation";
import { Menu, MenuItem, Button } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useAppStore } from "@/context/AppContext";




const Navbar = () => {
  const router=useRouter()
  const { name, email, isAuthenticated, logout, role } = useUserStore();
  const {isSeller}=useAppStore()
  // console.log(isAuthenticated,'isAuthenticated')
  const routes = useRouter();
  const {data:session,status}=useSession()
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget); 
    } else {
      routes.push("/sign-In"); 
    }
  };



  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut=async()=>{
    await signOut({
      redirect:false,
    });
    logout();
    toast.success("Logged out successfully");
  }

  const user=useUserStore()





  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
 

        {role=== "delivery" && <button onClick={() => router.push('/delivery')} className="text-xs border px-4 py-1.5 rounded-full">Delivery Dashboard</button>}

      </div>



<div className="relative">
      <ul className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        <button className="flex items-center gap-2 hover:text-gray-900 transition" onClick={handleClick}>
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>

        {isAuthenticated && (role === "customer" ? (
  <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ style: { width: 200 } }}>
    <MenuItem onClick={() => { routes.push('/customer'); handleClose(); }}>My Account</MenuItem>
    <MenuItem onClick={() => { routes.push('/cart'); handleClose(); }}>My Cart</MenuItem>
    <MenuItem onClick={() => { handleSignOut(); handleClose(); }}>Logout</MenuItem>
  </Menu>
) : role === "delivery" ? (
  <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ style: { width: 200 } }}>
    <MenuItem onClick={() => { routes.push('/delivery'); handleClose(); }}>My Account</MenuItem>
    <MenuItem onClick={() => { handleSignOut(); handleClose(); }}>Logout</MenuItem>
  </Menu>
) : null)}
      </ul>
    </div>

       


      {/* <div className="flex items-center md:hidden gap-3">
        {role=== "delivery" && <button onClick={() => router.push('/delivery')}  className="text-xs border px-4 py-1.5 rounded-full">Delivery Dashboard</button>}
        <button className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </div> */}
    </nav>
  );
};

export default Navbar;