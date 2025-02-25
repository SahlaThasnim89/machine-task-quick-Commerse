
"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/Zustand/store";


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



