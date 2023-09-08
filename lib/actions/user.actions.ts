/*
Reduced client-side javascripts. Ensuring that these codes should be rendered only on the server. 
Reference: https://nextjs.org/docs/app/api-reference/functions/server-actions
*/
"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "@/lib/mongoose";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";

interface UpdateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

interface FetchUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

/**
 * API - Update a user info in the "User" table via user ID.
 * @param param0 - User object
 */
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UpdateUserParams): Promise<void> {
  try {
    // Connect to the DB
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
    throw new Error(
      `[LOG] Error updating / creating new user: ${error.message}`
    );
  }
}

/**
 * API - Get/Fetch a user info from the "User" table via user ID.
 * @param userId - User ID
 * @returns
 */
export async function fetchUser(userId: string) {
  try {
    // Connect to the DB
    connectToDB();

    // Find a User info based on user's id
    return await User.findOne({ id: userId });
    // .populate({
    //     path: "communities",
    //     model: Community
    // })
  } catch (error: any) {
    throw new Error(`[LOG] Error fetching user: ${error.message}`);
  }
}

/**
 * API - Get/Fetch ALL threads and its children threads (comments/replies) which belongs to the given user ID.
 * (Children threads are fetched from the "User" table)
 * @param userId - User ID
 * @returns
 */
export async function fetchUserThreads(userId: string) {
  try {
    // Connect to the DB
    connectToDB();

    // Find all threads authored by the user with the given userId
    return await User.findOne({ id: userId })
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
  } catch (error: any) {
    throw new Error(`[LOG] Error fetching user threads: ${error.message}`);
  }
}
/**
 * API - Get/Fetch ALL children threads (replies) that are made by others towards the given user ID (currently logged-in user).
 * (Reply threads are fetched from the "Thread" table)
 * @param userId - User ID
 * @returns
 */
export async function getActivity(userId: string) {
  try {
    // Connect to the DB
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all child thread (comments/replies) IDs from the "children" field
    const childrenThreadIds = userThreads.reduce(
      (acc, userThread) => {
        /*
      1. acc: Accumulates the children threads from an array of "userThreads".
      2. concat(): Creates a new array by merging the accumulated elements ("acc" array) with the "userThread.children" array.
      3. reduce(): Concatenate all the child thread object IDs (_id) from each "userThread" into a single array stored in the "childrenThreadIds".
      */
        return acc.concat(userThread.children); // Retrieves object _id.
      },
      [] // default acc
    );

    // Fetch all replies **made by other users** from the children threads created
    const replies = await Thread.find({
      _id: { $in: childrenThreadIds }, // thread ID exists in children threads
      author: { $ne: userId }, // author is not current user ID (must exclude curent user ID)
    }).populate({
      path: "author",
      model: User,
      select: "username image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`[LOG] Error fetching activity: ${error.message}`);
  }
}
