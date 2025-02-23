import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email }).select(
      "-password"
    );
    // console.log(user);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const pendingOrders = await Order.find({
      status: status || "",
    }).populate("customerId");
    // console.log(pendingOrders, "iuuyyu");

    return NextResponse.json({ orders: pendingOrders }, { status: 200 });
  } catch (error) {
    console.log("Order creation failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
