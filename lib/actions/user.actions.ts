"use server"; // Reduced client-side javascripts. Ensuring that these codes should be rendered only on the server.

/* Reference: https://nextjs.org/docs/app/api-reference/functions/server-actions */

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
 * API - Update "User" table in database.
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
  // Connect to DB first
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true } // "Insert" + "Update"

      /* Upsert: Update an existing row if a value already exists in a table, 
    and insert a new row if the valu edoes not already exist in the table.
    */
    );

    if (path === "/profile/edit") {
      revalidatePath(path); // Update cached data without waiting for a revalidation period to expire.
    }
  } catch (error: any) {
    throw new Error(`[LOG] Failed to create/update user: ${error.message}`);
  }
}
