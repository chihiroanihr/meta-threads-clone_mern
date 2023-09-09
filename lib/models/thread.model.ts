import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  /*
  Thread Architecture: Multi-level
  For example...

    [Thread Original]
        -> [Thread Comment 1]
        -> [Thread Comment 2]
            -> [Thread Comment 3]
  */

  // Parent Thread ID
  parentId: {
    type: String,
  },
  // One thread can have multiple threads as children (i.e. Comment threads to the original thread)
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});

const Thread =
  mongoose.models.Thread || // Existing mongoose model (more than second time access)
  mongoose.model("Thread", threadSchema); // Create mongoose model based on the above schema created (first time access)

export default Thread;
