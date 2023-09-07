import * as z from "zod";

// Form Schema
export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(1, { message: "Minimum 1 character." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(1, { message: "Minimum 1 character." }),
});
