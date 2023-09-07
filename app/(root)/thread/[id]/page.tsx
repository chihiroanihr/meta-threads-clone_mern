import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.actions";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  // Check if user authenticated
  const user = await currentUser();
  if (!user) return null;

  // Fetch user info via its id (Call to backend)
  const userInfo = await fetchUser(user.id);
  // Check if user has onboarded (user info is stored) (Call to backend)
  if (!userInfo?.onboarded) redirect("/onboard");

  // Fetch the detailed thread info via its id (Call to backend)
  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      {/* Thread Post */}
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
    </section>
  );
};

export default Page;
