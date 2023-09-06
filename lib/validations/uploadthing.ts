import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

/*
The generateReactHelpers function is used to generate the useUploadThing hook 
and the uploadFiles functions you use to interact with UploadThing in custom components. 
It takes your File Router as a generic.
*/

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

/* Reference: https://docs.uploadthing.com/api-reference/react#generatereacthelpers */
