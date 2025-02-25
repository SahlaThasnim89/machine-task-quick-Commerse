"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, getSession } from "next-auth/react"; 
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUserStore } from "@/Zustand/store";
import axiosConfig from "@/utils/axiosConfig";




const SignIn = () => {

  const {isAuthenticated,login}=useUserStore()
  const router=useRouter()


  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); 
    }
  }, [isAuthenticated, router]);


  const [form,setForm]=useState({
    email: "",
    password: "",
  })

  const [pending,setPending]=useState(false)
  const [isDeliveryPartner, setIsDeliveryPartner] = useState(false);
  const [error,setError]=useState('')



const handleSubmit = async (e) => {
  e.preventDefault();
  setPending(true);

  const updatedForm = {
    ...form,
    role: isDeliveryPartner ? "delivery" : "customer",
  };

  // console.log(updatedForm);

  const res = await signIn("credentials", { redirect: false, ...updatedForm });

  console.log("Response:", res);

  if (!res?.error) { 
    toast.success("Login successful");

    const userRes = await getSession();  
    // console.log("User Data:", userRes);

    if (userRes?.user) {
      login(userRes.user); 
    }

    router.push("/");
  } else if (res?.status === 401) {
    toast.error("Invalid credentials");
    setPending(false);
  } else {
    toast.error("Something went wrong");
    setPending(false);
  }
};

  return (
    <div className="flex flex-col text-center space-y-2 min-h-screen justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
        <p className="text-2xl md:text-3xl text-gray-500">Login</p>
        <div className="space-y-3 max-w-sm mt-10 items-center">
        <input
            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
            type="email"
            disabled={pending}
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            value={form.email}
            required
          />
          <input
            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
            type="password"
            disabled={pending}
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            value={form.password}
            required
          />
        </div>
        <label className="flex items-center space-x-2 my-2">
          <input
            type="checkbox"
            checked={isDeliveryPartner}
            onChange={() => setIsDeliveryPartner(!isDeliveryPartner)}
            className="h-4 w-4"
          />
          <span>Sign in as Delivery Partner</span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="max-w-sm w-full mt-4 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase"
        >
          Sign In
        </button>
        <p className="py-2">
          Already have an account?
          <span className="text-orange-600">
            {" "}
            <Link
              href="/sign-up"
              className="hover:text-orange-700 hover:underline transition"
            >
              Sign Up
            </Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;