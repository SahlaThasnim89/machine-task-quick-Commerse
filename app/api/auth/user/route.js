import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    // console.log(session);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email }).select(
      "-password"
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const role = user.role;

    return NextResponse.json(
      { user, redirect: role === "customer" ? "/customer" : "/delivery" },
      { status: 200 }
    );

    // return NextResponse.json({ user }, { status: 200 });
  } catch {
    console.log("Error fetching user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
