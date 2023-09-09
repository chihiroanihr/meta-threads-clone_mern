import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { fetchUser, getActivity } from "@/lib/actions/user.actions";

const Page = async () => {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Fetch user info via its currently logged-in user ID (Call to backend)
  const userInfo = await fetchUser(user.id);
  // If no currently logged-in user info exists
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch all activity notifications for the currently logged-in user (Call to backend)
  const activity = await getActivity(userInfo._id);

  return (
    <section className="mt-10 flex flex-col gap-5">
      {
        // If no activity notifications exist
        activity.length === 0 ? (
          <p className="!text-base-regular text-light-3">No activity yet.</p>
        ) : (
          // If activity notification exist
          activity.map((activity) => (
            <Link
              key={activity._id}
              href={`/thread/${activity.parentId}`} // parentId : original thread post
            >
              <article className="activity-card">
                <Image
                  src={activity.author.image}
                  alt="profile image"
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
                <p className="!text-small-regular text-light-1">
                  <span className="mr-1 text-primary-500">
                    {activity.author.name}
                  </span>{" "}
                  reply to your thread.
                </p>
              </article>
            </Link>
          ))
        )
      }
    </section>
  );
};

export default Page;
