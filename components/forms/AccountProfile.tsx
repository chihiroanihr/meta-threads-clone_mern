"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { isBase64Image } from "@/lib/utils";
import { UserValidation } from "@/lib/validations/user";
import { useUploadThing } from "@/lib/validations/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AccountProfileProps {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  buttonTitle: string;
}

function AccountProfile({ user, buttonTitle }: AccountProfileProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Define your form
   */
  const form = useForm({
    resolver: zodResolver(UserValidation), // Form Schema
    // Bring default values from login information
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  /**
   * Upload profile image handler
   * @param e - Event parameter for a file input change event
   * @param fieldChange - A callback function to handle changes to the profile image
   * @returns
   */
  const handleUploadImage = (
    e: ChangeEvent<HTMLInputElement>, // typed as a ChangeEvent for an <input> element with HTMLInputElement type.
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault(); // Prevent automatic page reload caused by form submission

    // Create a new FileReader object to read the selected image file
    const fileReader = new FileReader(); // API that asynchronously read the contents of the file.

    // Check if there are selected files in the file inputs
    if (e.target.files && e.target.files.length > 0) {
      // If there are multiple files selected, it proceeds with handling the first selected file.
      setFiles(Array.from(e.target.files));
      const file = e.target.files[0]; // Get the first selected file

      // If file type is not image (based on its MIME type) then skip
      if (!file.type.includes("image")) return;

      // Define a callback for when the FileReader has successfully loaded the image
      fileReader.onload = async (event) => {
        // Read the image file URL from the event result
        const imageDataURL = event.target?.result?.toString() || "";
        // Notify that the profile image has changed via 'fieldChange' callback
        fieldChange(imageDataURL); // === onChange()
      };

      // Read the selected image file as a Data URL (base64-encoded image)
      fileReader.readAsDataURL(file);
    }
  };

  /**
   * Form submit handler - Call backend to update user profile.
   * ✅ This will be type-safe and validated.
   * @param values -  An object with a structure that conforms to the type defined by "UserValidation".
   */
  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo; // Get image data from profile photo
    const hasImageChanged = isBase64Image(blob); // If image data is base64-encoded image, meaning that profile image has been newly uploaded.

    // If profile image has been newly uploaded:
    if (hasImageChanged) {
      const imgRes = await startUpload(files); // An asynchronous function that takes the files as an argument and uploads them.

      // New profile image exists & is a valid image
      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url; // User's profile photo is updated with the new URL.
      }
    }

    // Update user profile (Call to backend)
    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });

    if (pathname === "/profile/edit") {
      router.back(); // go back to the previous page.
    } else {
      router.push("/"); // coming from onboarding -> go back to home.
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        {/* Profile Image */}
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  // If profile image uploaded
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  // If profile image is not uploaded
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    priority
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  onChange={(e) => handleUploadImage(e, field.onChange)}
                  className="account-form_image-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className="account-form_input no-focus"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className="account-form_input no-focus"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea rows={10} className="account-form_input no-focus" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default AccountProfile;
