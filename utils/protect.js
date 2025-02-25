"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from './../Zustand/store';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/sign-In"); // Redirect if not authenticated
    }
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
}
