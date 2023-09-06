import mongoose from "mongoose";

let isConnected = false; // Check connection status

export const connectToDB = async () => {
  if (!process.env.MONGODB_URL)
    return console.log("[LOG] MONGODB_URL not found.");

  if (isConnected) return console.log("[LOG] Already connected to MongoDB.");

  mongoose.set("strictQuery", true); // Prevent unknown field queries

  try {
    // Connect
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("[LOG] Connected to MongoDB.");
  } catch (error) {
    // Error
    console.log("[LOG] ", error);
  }
};
