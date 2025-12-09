
import mongoose from "mongoose";

export async function connectMongo() {
  const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
 
    throw new Error("MONGO_URI environment variable is not set");
  }
  try {
    
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
   
  }
}

export async function disconnectMongo() {
  try {
    await mongoose.disconnect();
    console.log("🔌MongoDB disconnected");
  } catch (err) {
    console.error(" Error disconnecting MongoDB:", err);
  }
}