/*
Reduced client-side javascripts. Ensuring that these codes should be rendered only on the server. 
Reference: https://nextjs.org/docs/app/api-reference/functions/server-actions
*/
"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "@/lib/mongoose";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

/**
 * API - Insert thread in the "Thread" table.
 * @param param0 - Thread object
 */
export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    // Connect to DB first
    connectToDB();

    // Create/Insert a Thread object
    const threadCreated = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update user model (Push the thread to the specific user/author via its userId)
    await User.findByIdAndUpdate(author, {
      $push: { threads: threadCreated._id },
    });

    // Update cached data without waiting for a revalidation period to expire.
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`[LOG] Error creating thread: ${error.message}`);
  }
}
