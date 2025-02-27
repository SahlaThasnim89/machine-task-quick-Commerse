"use client";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaLocationCrosshairs } from "react-icons/fa6";
import MapPicker from "@/components/MapPicker";
import { useUserStore } from "@/Zustand/store";

const AddAddress = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    zipCode: "",
    street: "",
    city: "",
    state: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState("");
  const [mapOpen, setMapOpen] = useState(false);
  const user = useUserStore();

  useEffect(() => {
    if (!user) {
      router.push("/sign-In");
    }
  }, [user, router]);

  const handleSelectLocation = async (pos) => {
    setLocation(`Lat: ${pos.lat}, Lng: ${pos.lng}`);
    setMapOpen(false);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error("Google Maps API Key is missing");

      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=${apiKey}`
      );

      if (res.data.status === "OK" && res.data.results.length > 0) {
        const addressComponents = res.data.results[0].address_components;

        const getComponent = (type) =>
          addressComponents.find((c) => c.types.includes(type))?.long_name ||
          "";

        setAddress((prev) => ({
          ...prev,
          zipCode: getComponent("postal_code"),
          street: `${getComponent("route")} ${getComponent(
            "street_number"
          )}`.trim(),
          city: getComponent("locality"),
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
        }));
      } else {
        toast.error("Failed to fetch address.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching address.");
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!address.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!address.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required.";
    else if (!/^\d{10}$/.test(address.phoneNumber))
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";

    if (!address.zipCode.trim()) newErrors.zipCode = "Zip code is required.";
    else if (!/^\d+$/.test(address.zipCode))
      newErrors.zipCode = "Zip code must be numbers only.";

    if (!address.street.trim())
      newErrors.street = "Street address is required.";
    if (!address.city.trim()) newErrors.city = "City is required.";
    if (!address.state.trim()) newErrors.state = "State is required.";
    if (!address.country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!session || !user) {
      // console.log(session, "ghjhj");
      toast.error("You must be logged in to add an address.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const res = await axios.post("/api/address/add", address);
      if (res.data) {
        toast.success("Address added successfully!");
        setAddress({
          fullName: "",
          phoneNumber: "",
          zipCode: "",
          street: "",
          city: "",
          state: "",
          country: "",
        });
        setErrors({});
        router.push("/cart");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add address.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form onSubmit={onSubmitHandler} className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            Add Shipping{" "}
            <span className="font-semibold text-orange-600">Address</span>
          </p>
          <div className="space-y-3 max-w-sm mt-10">
            <div>
              <label className="text-base font-medium uppercase text-gray-600 block mb-2">
                Set Delivery Location
              </label>
              <div className="relative w-full">
                <FaLocationCrosshairs className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={location}
                  readOnly
                  onClick={() => setMapOpen(true)}
                  className="w-full outline-none p-2.5 pl-10 text-gray-600 border cursor-pointer"
                  placeholder="Click to select location"
                />
              </div>
            </div>
            {Object.entries({
              fullName: "Full name",
              phoneNumber: "Phone number",
              zipCode: "Pin code",
              street: "Address (Area and Street)",
              city: "City/District/Town",
              state: "State",
              country: "Country",
            }).map(([key, placeholder]) => (
              <div key={key}>
                <input
                  className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                  type="text"
                  placeholder={placeholder}
                  onChange={(e) =>
                    setAddress({ ...address, [key]: e.target.value })
                  }
                  value={address[key]}
                  required
                />
                {errors[key] && (
                  <p className="text-red-500 text-sm">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase"
          >
            Save address
          </button>
        </form>
        <Image
          className="md:mr-16 mt-16 md:mt-0"
          src={assets.my_location_image}
          alt="my_location_image"
        />
      </div>
      <MapPicker
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        onSelectLocation={handleSelectLocation}
      />
      <Footer />
    </>
  );
};

export default AddAddress;
