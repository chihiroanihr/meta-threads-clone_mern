import { ThreadCard } from "@/components/cards";
import { fetchCommunityThreads } from "@/lib/actions/community.actions";
import { fetchUserThreads } from "@/lib/actions/user.actions";

interface ThreadsTabContentProps {
  currentAccountId: string;
  accountId: string;
  accountType: "User" | "Community";
}

async function ThreadsTabContent({
  currentAccountId,
  accountId,
  accountType,
}: ThreadsTabContentProps) {
  let result: any;
    // Fetch all threads for "clicked" user via its user ID (Call to backend)
    result = await fetchUserThreads(accountId);

  return (
    <section className="mt-9 flex flex-col gap-10">
      {
        // If no threads exist
        result.threads.length === 0 ? (
          <p className="no-result">No users found.</p>
        ) : (
          // If threads exist
          result.threads.map((thread: any) => (
            <ThreadCard
              key={thread._id}
              id={thread._id}
              currentUserId={currentAccountId}
              parentId={thread.parentId}
              content={thread.text}
              author={
                accountType === "User"
                  ? {
                      id: result.id,
                      username: result.username,
                      image: result.image,
                    }
                  : {
                      id: thread.author.id,
                      username: thread.author.username,
                      image: thread.author.image,
                    }
              } // TODO
              community={thread.community} // TODO
              createdAt={thread.createdAt}
              comments={thread.children}
            />
          ))
        )
      }
    </section>
  );
}

export default ThreadsTabContent;
