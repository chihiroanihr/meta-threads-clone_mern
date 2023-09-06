/*
Reduced client-side javascripts. Ensuring that these codes should be rendered only on the server. 
Reference: https://nextjs.org/docs/app/api-reference/functions/server-actions
*/
"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "@/lib/mongoose";
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
 * API - Update user info in the "User" table.
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
