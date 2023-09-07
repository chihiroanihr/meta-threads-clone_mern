"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface CommentProps {
  threadId: string;
  currentUserId: string;
  currentUserImg: string;
}

function Comment({ threadId, currentUserId, currentUserImg }: CommentProps) {
  const pathname = usePathname();

  /**
   * Define your form
   */
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  /**
   * Form submit handler - Call backend to insert comment post.
   * ✅ This will be type-safe and validated.
   * @param values -  An object with a structure that conforms to the type defined by "CommentValidation".
   */
  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    // Insert/Create thread comment post (Call to backend)
    await addCommentToThread({
      originalThreadId: JSON.parse(threadId),
      commentedText: values.thread,
      commentedAuthor: JSON.parse(currentUserId),
      path: pathname,
    });

    // Reset form
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="w-full flex items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile Image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  {...field}
                  type="text"
                  placeholder="Comment..."
                  className="no-focus outline-none text-light-1"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
