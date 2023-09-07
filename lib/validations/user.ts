import * as z from "zod";

// User profile form schema
export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z.string().min(1).max(30),
  username: z.string().nonempty().min(3).max(30),
  bio: z.string().max(1000),
});
