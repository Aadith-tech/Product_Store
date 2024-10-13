import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MongoDB URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
