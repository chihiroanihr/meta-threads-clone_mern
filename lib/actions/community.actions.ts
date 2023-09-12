/*
Reduced client-side javascripts. Ensuring that these codes should be rendered only on the server. 
Reference: https://nextjs.org/docs/app/api-reference/functions/server-actions
*/
"use server";

import mongoose, { FilterQuery, SortOrder } from "mongoose";

import { connectToDB } from "@/lib/mongoose";
import Community from "@/lib/models/community.model";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";

interface CreateCommunityParams {
  communityId: string;
  communityName: string;
  communitySlug: string;
  communityImage: string;
  communityBio: string;
  createdByUserId: string;
}

interface FetchCommmunitiesFromSearchParams {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

interface AddMemberToCommunityParams {
  communityId: string;
  userId: string;
}

interface RemoveUserFromCommunityParams {
  communityId: string;
  userId: string;
}

interface UpdateCommunityInfoParams {
  communityId: string;
  communityName: string;
  communitySlug: string;
  communityImage: string;
}

// Connect to the DB
connectToDB();

/**
 * API - Insert a new community in the "Community" table created by given user.
 * @param param0 - Community object
 * @returns
 */
export async function createCommunity({
  communityId,
  communityName,
  communitySlug,
  communityImage,
  communityBio,
  createdByUserId,
}: CreateCommunityParams) {
  try {
    // Find the user via given user ID
    const user = await User.findOne({ id: createdByUserId });
    // If user not found
    if (!user) {
      throw new Error("User not found.");
    }

    // Create/Insert a new community object
    const newCommunity = new Community({
      id: communityId,
      name: communityName,
      slug: communitySlug,
      image: communityImage,
      bio: communityBio,
      createdBy: user._id, // Use the mongoose ID of the user
    });
    const createdCommunity = await newCommunity.save();

    // Update the user's community array in the "User" table with the new community's ID
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (error: any) {
    throw new Error(`[LOG] Error creating a community: ${error.message}`);
  }
}

/**
 * API - Get/Fetch community info from the "Community" table via community ID.
 * @param id - Community ID
 * @returns
 */
export async function fetchCommunityInfo(id: string) {
  try {
    // Find a community info based on community ID
    return await Community.findOne({ id }).populate([
      "createdBy", // Also fetch community creation user's user info from the "User" table
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
    ]);
  } catch (error: any) {
    throw new Error(`[LOG] Error fetching community details: ${error.message}`);
  }
}

/**
 * API - Get/Fetch ALL community threads from the "Community" table.
 * @param id - Community ID
 * @returns
 */
export async function fetchCommunityThreads(id: string) {
  try {
    // Fetch all community threads based on community ID
    return await Community.findById(id).populate({
      // Fetch each threads info from the "Thread" table
      path: "threads",
      model: Thread,
      populate: [
        {
          // Fetch the user of each threads from the "User" table
          path: "author",
          model: User,
          select: "username image id",
        },
        {
          // Fetch the children threads (replies/comments) of each original threads from the "Thread" table
          path: "children",
          model: Thread,
          populate: {
            // Fetch the user of each children threads from the "User" table
            path: "author",
            model: User,
            select: "username image _id",
          },
        },
      ],
    });
  } catch (error: any) {
    throw new Error(`[LOG] Error fetching community threads: ${error.message}`);
  }
}

/**
 * API - Get/Fetch ALL communities from the "Community" table.
 * @param param0 - Search input and page info object
 * @returns
 */
export async function fetchCommunitiesFromSearch({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchCommmunitiesFromSearchParams) {
  try {
    // Get search string as regex
    const regex = new RegExp(searchString, "i"); // case-insensitive

    // Define query filters
    const query: FilterQuery<typeof Community> = {};
    // If search string exists
    if (searchString.trim() !== "") {
      // $or conditions : match either by slug or name
      query.$or = [{ slug: { $regex: regex } }, { name: { $regex: regex } }];
    }

    // Fetch all the communities with matches with the query filtered above
    const communities = await Community.find(query)
      .sort({ createdAt: sortBy }) // sort option
      .skip((pageNumber - 1) * pageSize) // number of communities to skip based on the page number and page size
      .limit(pageSize)
      .populate("members")
      .lean(); // for improved performance

    // Get the total number of communities without fetching all documents
    const totalCommunitiesCount = await Community.countDocuments(query);

    // Next page exists
    const isNext = totalCommunitiesCount > pageNumber * pageSize;

    return { communities, isNext };
  } catch (error: any) {
    throw new Error(`[LOG] Error fetching communities: ${error.message}`);
  }
}

/**
 * API
 * 1. Insert a new community member (user) in the "Community" table.
 * 2. Update the community arrays of the user in the "User" table to include new community.
 * @param param0 - Cew community member object
 * @returns
 */
export async function addMemberToCommunity({
  communityId,
  userId,
}: AddMemberToCommunityParams) {
  try {
    // Find the community by its community ID
    const community = await Community.findOne({ id: communityId });
    // If community not found
    if (!community) {
      throw new Error("Community not found.");
    }

    // Find the user by its user ID
    const user = await User.findOne({ id: userId });
    // IF user not found
    if (!user) {
      throw new Error("User not found.");
    }

    // If user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community.");
    }

    // Update the members array in the "Community" table to include the new user
    community.members.push(user._id);
    await community.save();

    // Update the communities array in the "User" table to include the community
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error: any) {
    throw new Error(
      `[LOG] Error adding member to the community: ${error.message}`
    );
  }
}

/**
 * API
 * 1. Delete a community member (user) from the "Community" table.
 * 2. Update the community arrays of the user in the "User" table to remove the community.
 * @param param0 - Community member object
 * @returns
 */
export async function removeUserFromCommunity({
  communityId,
  userId,
}: RemoveUserFromCommunityParams) {
  try {
    // Find the user by its user ID
    const user = await User.findOne({ id: userId }, { _id: 1 });
    // If user not found
    if (!user) {
      throw new Error("User not found.");
    }

    // Find the community by its community ID
    const community = await Community.findOne({ id: communityId }, { _id: 1 });
    // If community not found
    if (!community) {
      throw new Error("Community not found.");
    }

    // Update the members array in the "Community" table to remove the user
    await Community.updateOne(
      { _id: community._id },
      { $pull: { members: user._id } }
    );

    // Update the communities array in the "User" table to remove the community
    await User.updateOne(
      { _id: user._id },
      { $pull: { communities: community._id } }
    );

    return { success: true };
  } catch (error: any) {
    throw new Error(
      `[LOG] Error removing user from community: ${error.message}`
    );
  }
}

/**
 * API - Update a community info in the "Community" table via community ID.
 * @param param0 - Community object
 * @returns
 */
export async function updateCommunityInfo({
  communityId,
  communityName,
  communitySlug,
  communityImage,
}: UpdateCommunityInfoParams) {
  try {
    // Update the community in the "Community" table by community ID
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { communityName, communitySlug, communityImage }
    );
    // If community not found
    if (!updatedCommunity) {
      throw new Error("Community not found.");
    }

    return updatedCommunity;
  } catch (error: any) {
    throw new Error(
      `[LOG] Error updating community information: ${error.message}`
    );
  }
}

/**
 * API - Delete a community from the "Community" table via community ID.
 * @param communityId - Community ID
 * @returns
 */
export async function deleteCommunity(communityId: string) {
  try {
    // Find the community
    const community = await Community.findOne({ id: communityId });
    if (!community) {
      throw new Error("Community not found.");
    }

    // Convert the _id string to a MongoDB ObjectId
    const communityObjectId = new mongoose.Types.ObjectId(community._id);

    // Retrieve the list of threads associated with that community
    const threadsToDelete = await Thread.find({ community: communityObjectId });

    // Delete all threads
    await Promise.all(
      threadsToDelete.map(async (thread) => {
        // Remove references to the thread in the "User" table
        await User.updateMany(
          { threads: thread._id },
          { $pull: { threads: thread._id } }
        );
        // Delete the thread from "Thread" table
        await Thread.findByIdAndDelete(thread._id);
      })
    );

    // Remove references to the community in the "User" table
    await User.updateMany(
      { communities: communityObjectId },
      { $pull: { communities: communityObjectId } }
    );

    // Delete the community itself from the "Community" table
    const deletedCommunity =
      await Community.findByIdAndDelete(communityObjectId);

    return deletedCommunity;
  } catch (error: any) {
    throw new Error(`[LOG] Error deleting community: ${error.message}`);
  }
}
