'use client'
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
 
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import axiosConfig from "@/utils/axiosConfig";


const Profile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


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
                <h2 className="text-lg font-medium">My Account</h2>
                    <Card sx={{ maxWidth: 400, p: 2, borderRadius: 1, boxShadow: 1 }}>
                              <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar sx={{ width: 80, height: 80, mb: 2 }} />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </CardContent>
      </Box>
    </Card>
            </div>}
            <Footer />
        </div>
    );
};

export default Profile;