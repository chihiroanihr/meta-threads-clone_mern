import * as z from "zod";

// Thread post form schema
export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(1, { message: "Minimum 1 character." }),
  userId: z.string(),
});

// Comment thread post form schema
export const CommentValidation = z.object({
  thread: z.string().nonempty().min(1, { message: "Minimum 1 character." }),
});
