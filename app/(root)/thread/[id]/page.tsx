import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { ThreadCard } from "@/components/cards";
import { Comment } from "@/components/forms";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.actions";

const Page = async ({ params }: { params: { id: string } }) => {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Fetch user info via its currently logged-in user ID (Call to backend)
  const userInfo = await fetchUser(user.id);
  // Check if user has onboarded (user info is stored) (Call to backend)
  if (!userInfo?.onboarded) redirect("/onboard");

  // Check if "clicked" user exists
  if (!params.id) return null;
  // Fetch the detailed thread info of the "clicked" user via its user ID (Call to backend)
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

      {/* Comment Form */}
      <div className="mt-7">
        <Comment
          threadId={JSON.stringify(thread._id)}
          currentUserId={JSON.stringify(userInfo._id)}
          currentUserImg={userInfo.image}
        />
      </div>

      {/* Comment */}
      <div className="mt-10">
        {thread.children.map((threadChild: any) => (
          <ThreadCard
            key={threadChild._id}
            id={threadChild._id}
            currentUserId={user?.id || ""}
            parentId={threadChild.parentId}
            content={threadChild.text}
            author={threadChild.author}
            community={threadChild.community}
            createdAt={threadChild.createdAt}
            comments={threadChild.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
