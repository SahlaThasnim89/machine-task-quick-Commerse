'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import axiosConfig from "@/utils/axiosConfig";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaLocationCrosshairs } from "react-icons/fa6";
import MapPicker from "@/components/MapPicker";





const AddAddress = () => {

    const { data: session } = useSession(); 
    const router=useRouter()
    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        zipCode: '',
        street: '',
        city: '',
        state: '',
        country:'',
    })

    const [errors, setErrors] = useState({});
    const [location, setLocation] = useState("");
    const [mapOpen, setMapOpen] = useState(false);

    

    // const handleSelectLocation = async (pos) => {
    //     setLocation(`Lat: ${pos.lat}, Lng: ${pos.lng}`);
    //     setMapOpen(false);
    
    //     try {
    //         const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 
    //         const res = await axiosConfig.get(
    //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=${apiKey}`
    //         );
    
    //         if (res.data.status === "OK" && res.data.results.length > 0) {
    //             const addressComponents = res.data.results[0].address_components;
    
    //             const getComponent = (type) => addressComponents.find((c) => c.types.includes(type))?.long_name || "";
    
    //             setAddress({
    //                 fullName: address.fullName, // Preserve entered name
    //                 phoneNumber: address.phoneNumber, // Preserve entered phone
    //                 zipCode: getComponent("postal_code"),
    //                 street: getComponent("route") + " " + getComponent("street_number"),
    //                 city: getComponent("locality"),
    //                 state: getComponent("administrative_area_level_1"),
    //                 country: getComponent("country"),
    //             });
    //         } else {
    //             toast.error("Failed to fetch address.");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Error fetching address.");
    //     }
    // };


 

    

    // const validateForm = () => {
    //     let newErrors = {};

    //     if (!address.fullName.trim()) newErrors.fullName = "Full name is required.";
    //     if (!address.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    //     else if (!/^\d{10}$/.test(address.phoneNumber)) newErrors.phoneNumber = "Enter a valid 10-digit phone number.";

    //     if (!address.zipCode.trim()) newErrors.zipCode = "Zip code is required.";
    //     else if (!/^\d+$/.test(address.zipCode)) newErrors.zipCode = "Zip code must be numbers only.";

    //     if (!address.street.trim()) newErrors.street = "Street address is required.";
    //     if (!address.city.trim()) newErrors.city = "City is required.";
    //     if (!address.state.trim()) newErrors.state = "State is required.";
    //     if (!address.country.trim()) newErrors.country = "Country is required.";

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    

    // const onSubmitHandler = async (e) => {
    //     e.preventDefault();
    //     // console.log(address)
    //     if(!session){
    //         return;
    //     }
    //     if (!validateForm()) return;
    //     try {
    //         const res = await axiosConfig.post("/api/address/add", address);

    //         if (res.data) {
    //             toast("Address added successfully!");
    //             setAddress({
    //                 fullName: '',
    //                 phoneNumber: '',
    //                 zipCode: '',
    //                 street: '',
    //                 city: '',
    //                 state: '',
    //                 country: '',
    //             });
    //             setErrors({});
    //             router.push('/cart')
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast("Failed to add address.");
    //     }
    // }
    const onSubmitHandler = async (e) => {
        e.preventDefault();
    
        if (!session) {
            return;
        }
    
        if (!validateForm()) {
            toast.error("Please fill all required fields.");
            return;
        }
    
        console.log(address,'uiiyiu')
        try {
            const res = await axiosConfig.post("/api/address/add", address);
    
            if (res.data) {
                toast.success("Address added successfully!");
                setAddress({
                    fullName: '',
                    phoneNumber: '',
                    zipCode: '',
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                });
                setErrors({});
                router.push('/cart');
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
                        Add Shipping <span className="font-semibold text-orange-600">Address</span>
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
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Full name"
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                            value={address.fullName}
                            required
                        />
                        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Phone number"
                            onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                            value={address.phoneNumber}
                            required
                        />
                         {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Pin code"
                            onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                            value={address.zipCode}
                            required
                        />
                          {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                        <textarea
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
                            type="text"
                            rows={4}
                            placeholder="Address (Area and Street)"
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            value={address.street}
                            required
                        ></textarea>
                         {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
                        <div className="flex space-x-3">
                            <input
                                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                placeholder="City/District/Town"
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                value={address.city}
                                required
                            />
                             {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                            <input
                                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                placeholder="State"
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                value={address.state}
                                required
                            />
                             {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                        </div>
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Country"
                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                            value={address.country}
                            required
                        />
                         {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                    </div>
                    <button type="submit" className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase">
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