import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  // One user can create/belong to many threads (One user can have multiple references to "Thread" table.)
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  // One user can create/belong to many communities (One user can have multiple references to "Community" table.)
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const User =
  mongoose.models.User || // Existing mongoose model (more than second time access)
  mongoose.model("User", userSchema); // Create mongoose model based on the user schema  (first time access)

export default User;
