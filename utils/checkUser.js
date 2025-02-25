
"use client"

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/userStore"; // Adjust the import path

const AuthChecker = () => {
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAuthenticated) {
                router.push("/");
            }
        }, 1000); // Check every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, [isAuthenticated, router]);

    return null; // This component does not render anything
};

export default AuthChecker;



