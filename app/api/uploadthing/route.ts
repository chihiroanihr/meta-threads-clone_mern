import { createNextRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

/*
-------- Create a Next.js API route using the FileRouter --------
Note: This is the ONLY FILE WHERE THE PATH MATTERS.
You need to serve this API from /api/uploadthing as it is called via webhook to trigger onUploadComplete.
*/

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});

/* Reference: https://docs.uploadthing.com/nextjs/appdir */
