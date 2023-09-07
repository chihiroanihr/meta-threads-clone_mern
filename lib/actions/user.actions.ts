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
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

/**
 * API - Update a user info in the "User" table.
 * @param param0 - User object
 */
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  try {
    // Connect to DB first
    connectToDB();

    // Upsert a User object
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true } // "Insert" + "Update"
      /*
      Upsert: Update an existing row if a value already exists in a table, 
      and insert a new row if the valu edoes not already exist in the table.
      */
    );

    // Update cached data without waiting for a revalidation period to expire.
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`[LOG] Failed to create/update user: ${error.message}`);
  }
}

/**
 * API - Get/Fetch a user info from the "User" table via user ID
 * @param userId - User ID
 * @returns
 */
export async function fetchUser(userId: string) {
  try {
    // Connect to DB first
    connectToDB();

    // Find a User info based on user's id
    return await User.findOne({ id: userId });
    // .populate({
    //     path: "communities",
    //     model: Community
    // })
  } catch (error: any) {
    throw new Error(`[LOG] Failed to fetch user: ${error.message}`);
  }
}

/**
 * API - Get/Fetch ALL threads (and its children threads) from the "User" table via user ID
 * @param userId - User ID
 * @returns
 */
export async function fetchUserPosts(userId: string) {
  try {
    // Connect to DB first
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId })
      /* TODO: Populate community */
      .populate({
        path: "threads",
        model: Thread,
        populate: {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "username image id",
          },
        },
      });

    return threads;
  } catch (error: any) {
    throw new Error(`[LOG] Failed to fetch user threads: ${error.message}`);
  }
}
