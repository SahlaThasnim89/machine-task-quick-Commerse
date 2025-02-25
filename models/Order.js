import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        id: {
          type: String,
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Out for Delivery", "Delivered"],
      default: "Pending",
    },
    address: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    orderAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
