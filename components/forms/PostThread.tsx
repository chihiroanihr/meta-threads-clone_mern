"use client";

import { useRouter, usePathname } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Define your form
   */
  const form = useForm({
    resolver: zodResolver(ThreadValidation), // Form Schema
    // Bring default values from login information
    defaultValues: {
      thread: "",
      userId: userId,
    },
  });

  /**
   * Form submit handler - Call DB to insert thread post.
   * ✅ This will be type-safe and validated.
   * @param values -  An object with a structure that conforms to the type defined by "ThreadValidation".
   */
  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });

    // Back to home
    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea {...field} rows={15} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
