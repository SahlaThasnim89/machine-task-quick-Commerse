import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import connectDB from "@/utils/db";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fullName, phoneNumber, street, city, state, zipCode, country } =
      await request.json();
    const userEmail = session.user.email;

    let userAddress = await Address.findOne({ userEmail });

    if (!userAddress) {
      userAddress = new Address({ userEmail, address: [] });
    }

    userAddress.address.push({
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      country,
    });
    await userAddress.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        data: userAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = request.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }
    // console.log(email)
    const addresses = await Address.find({ userEmail: email });

    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
