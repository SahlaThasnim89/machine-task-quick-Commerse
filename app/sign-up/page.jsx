"use client"
import axiosConfig from "@/utils/axiosConfig";
import { useUserStore } from "@/Zustand/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/context/AppContext";




const SignUp = () => {

  const { login,isAuthenticated } = useUserStore();
  const router = useRouter();
  const {updateCartQuantity } =useAppStore();



  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); 
    }
  }, [isAuthenticated, router]);

  const [form,setForm]=useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })


  const [errors, setErrors] = useState({});
  const [pending,setPending]=useState(false)
  const [isDeliveryPartner, setIsDeliveryPartner] = useState(false);
  const [session, setSession] = useState(true);

  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters long";

    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
          return;
        }
        setPending(true)
        const updatedForm = {
          ...form,
          role: isDeliveryPartner ? "delivery" : "customer"
      };
      console.log(updatedForm)
      try {
        const res = await axiosConfig.post("/api/auth/signup", updatedForm);
        setSession(true);
        login(res.data.user);
        router.push("/");
        updateCartQuantity("clearCart", 0);
        toast.success(res.data.message || "Signup successful!");
      } catch (error) {
        console.log("Signup Error:", error);
    
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || "Something went wrong!");
        } else {
          toast.error("Network error. Please try again.");
        }
      }
    }

  return (
    <div className="flex flex-col text-center space-y-2 min-h-screen justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
        <p className="text-2xl md:text-3xl text-gray-500">Sign Up</p>
        <div className="space-y-3 max-w-sm mt-10 items-center">
          <input
            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
            type="text"
            placeholder="Full name"
            disabled={pending}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            value={form.name}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

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
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
             {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <input
            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
            type="password"
            disabled={pending}
            placeholder="Confirm Password"
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
            value={form.confirmPassword}
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        
        </div>
        <label className="flex items-center space-x-2 my-2">
          <input
            type="checkbox"
            checked={isDeliveryPartner}
            onChange={() => setIsDeliveryPartner(!isDeliveryPartner)}
            className="h-4 w-4"
          />
          <span>Sign Up as Delivery Partner</span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="max-w-sm w-full mt-4 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase"
        >
          Sign Up
        </button>
        <p className="py-2">
          Already have an account?
          <span className="text-orange-600">
            {" "}
            <Link
              href="/sign-In"
              className="hover:text-orange-700 hover:underline transition"
            >
              Sign In
            </Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
