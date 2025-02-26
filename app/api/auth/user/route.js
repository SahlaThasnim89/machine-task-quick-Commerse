import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/utils/db'
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";


export async function GET(){
    try{
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
          }
      
          const user = await User.findOne({ email: session.user.email }).select("-password");
          if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
          }

          const role = user.role;

          // Redirect based on user role
          if (role === "customer") {
            return NextResponse.redirect(new URL("/customer", req.url));
          } else if (role === "delivery") {
            return NextResponse.redirect(new URL("/delivery", req.url));
          }
      
          return NextResponse.json({ user }, { status: 200 });
    }catch{
        console.log("Error fetching user:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}