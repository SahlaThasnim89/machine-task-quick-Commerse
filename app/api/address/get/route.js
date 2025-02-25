import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import connectDB from "@/utils/db";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const email = request.nextUrl.searchParams.get("email");
        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const addresses = await Address.findOne({ userEmail: email });

        return NextResponse.json({ success: true, addresses }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
