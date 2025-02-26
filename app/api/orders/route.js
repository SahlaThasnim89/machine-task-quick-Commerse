import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import User from "@/models/User";
import { socket } from "@/utils/socket";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { customerId, products, quantity, address, orderAmount } = body;

    if (!customerId || !products || !quantity || !address || !orderAmount) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    const newOrder = new Order({
      customerId,
      products,
      quantity,
      address,
      orderAmount,
      // status,
    });

    const data = await newOrder.save();
    // console.log(data, "order placed");
    return NextResponse.json(
      { message: "Order placed successfully", orderId: newOrder._id },
      { status: 201 }
    );
  } catch (error) {
    console.log("Order creation failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const newStatus = !status ? { $ne: "Delivered" } : status;
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
    console.log(user);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const pendingOrders = await Order.find({
      customerId: user._id,
      status: newStatus,
    });
    console.log(pendingOrders, "iuuyyu");

    return NextResponse.json({ orders: pendingOrders }, { status: 200 });
  } catch (error) {
    console.log("Order creation failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function GET(req) {
//   try {
//     console.log("API hit");
//     console.log(req.url);
//     const { searchParams } = new URL(req.url);
//     console.log("Search Params:", searchParams.toString());
//     const status = searchParams.get("status");
//     console.log("Status:", status);
//     const newStatus = !status ? { $ne: "Delivered" } : status;
//     console.log(newStatus,'dfghjk')
//     await connectDB();
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { message: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     const user = await User.findOne({ email: session.user.email }).select(
//       "-password"
//     );
//     console.log(user);
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     const pendingOrders = await Order.find({
//       customerId: user._id,
//       status: newStatus,
//     });
//     console.log(pendingOrders, "iuuyyu");

//     return NextResponse.json({ orders: pendingOrders }, { status: 200 });
//   } catch (error) {
//     console.log("Order creation failed:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }




export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).select(
      "-password"
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { orderId, status: newStatus } = await req.json();
    // console.log(orderId, newStatus);

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { message: "Order ID and status are required" },
        { status: 400 }
      );
    }

    let updateData = { status: newStatus };

    // If the order is being accepted, set the deliveryPartnerId
    if (newStatus === "Accepted") {
      updateData.deliveryPartnerId = user._id;
    }

    // const updatedOrder = await Order.findOneAndUpdate(
    //   { _id: orderId, },
    //   updateData,
    //   { new: true }
    // ).populate("customerId");
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      updateData,
      { new: true }
    ).populate("customerId").populate("deliveryPartnerId");

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order not found or unauthorized" },
        { status: 404 }
      );
    }
    
    
   
    return NextResponse.json(
      { message: "Order updated successfully", order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.log("Order update failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
