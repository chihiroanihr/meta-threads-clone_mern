import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs";

/*
-------- Creating your first FileRoute --------
All files uploaded to uploadthing are associated with a FileRoute.
Think of a FileRoute similar to an endpoint, it has:

- Permitted types ["image", "video", etc]
- Max file size
- (Optional) middleware to authenticate and tag requests
- onUploadComplete callback for when uploads are completed
*/

const f = createUploadthing();

// Fetch user info
const getUser = async () => await currentUser();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Check user authorized
      const user = await getUser(); // This code runs on your server before upload
      if (!user) throw new Error("Unauthorized"); // If you throw, the user will not be able to upload

      // Return User ID
      return { userId: user.id }; // Whatever is returned here is accessible in onUploadComplete as `metadata`
    })

    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

/* Reference: https://docs.uploadthing.com/nextjs/appdir */
