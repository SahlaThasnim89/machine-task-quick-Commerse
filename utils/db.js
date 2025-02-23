import mongoose from "mongoose";


const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

const connectDB = async () => {
  console.log("🔄 Attempting to connect to MongoDB...");
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Already connected to MongoDB");
    return; 
  }

  try {
    console.log("🟡 Connecting to MongoDB URI:", MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
    // process.exit(1);
  }
};

export default connectDB;
