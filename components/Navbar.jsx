"use client"
import React, { useEffect, useRef, useState } from "react";
import { assets} from "@/assets/assets";
import Link from "next/link"
 
import Image from "next/image";
import { useUserStore } from "@/Zustand/store";
import { useRouter } from "next/navigation";
import { Menu, MenuItem, Button } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useAppStore } from "@/context/AppContext";
import toast from "react-hot-toast";




const Navbar = () => {
  const { name, email, isAuthenticated, logout, role } = useUserStore();
  // console.log(isAuthenticated,role,'wertyuertyuwertyu')
  const {isSeller}=useAppStore()
  // console.log(isAuthenticated,'isAuthenticated')
  const router = useRouter();
  const {data:session,status}=useSession()
  console.log(data,status,'rtytrt')

  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/"); 
    }
  }, [isAuthenticated, router]);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget); 
    } else {
      router.push("/sign-In"); 
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
 


      </div>



<div className="relative">
      <ul className="hidden md:flex items-center gap-4">
        <button className="flex items-center gap-2 hover:text-gray-900 transition" onClick={handleClick}>
          <Image src={assets.user_icon} alt="user icon" />
          {isAuthenticated ? "Account" : "Login"}
        </button>

        {isAuthenticated && (role === "customer" ? (
  <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ style: { width: 200 } }}>
    <MenuItem onClick={() => { router.push('/customer'); handleClose(); }}>My Account</MenuItem>
    <MenuItem onClick={() => { router.push('/cart'); handleClose(); }}>My Cart</MenuItem>
    <MenuItem onClick={() => { handleSignOut(); handleClose(); }}>Logout</MenuItem>
  </Menu>
)
 : role === "delivery" ? (
  <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ style: { width: 200 } }}>
    <MenuItem onClick={() => { router.push('/delivery'); handleClose(); }}>My Account</MenuItem>
    <MenuItem onClick={() => { handleSignOut(); handleClose(); }}>Logout</MenuItem>
  </Menu>
)
 : null)}
      </ul>
    </div>

       


    </nav>
  );
};

export default Navbar;