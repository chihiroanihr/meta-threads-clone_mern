import mongoose from "mongoose";

let isConnected = false; // Check connection status

export const connectToDB = async () => {
  const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
  const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
  const MONGODB_CLUSTER_NAME = process.env.MONGODB_CLUSTER_NAME;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

  // If connection URL invalid
  if (!MONGODB_USERNAME || !MONGODB_PASSWORD || MONGODB_CLUSTER_NAME)
    throw new Error("[LOG] Error: MongoDB connection URL not found.");

  // If already connected to the DB
  if (isConnected) return console.log("[LOG] Already connected to MongoDB.");

  // DB connection URL
  const MONGODB_CONN_URL =
    `mongodb+srv://${MONGODB_USERNAME}:` +
    `${MONGODB_PASSWORD}@${MONGODB_CLUSTER_NAME}.w3vcjr6.mongodb.net/` +
    `${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

  // Prevent unknown field queries
  mongoose.set("strictQuery", true);

  try {
    // Connect to the DB
    await mongoose.connect(MONGODB_CONN_URL);
    isConnected = true;
    console.log("[LOG] Connected to MongoDB.");
  } catch (error) {
    // Error
    console.log("[LOG] ", error);
  }
};
