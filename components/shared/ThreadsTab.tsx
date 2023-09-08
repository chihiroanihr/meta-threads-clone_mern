import { ThreadCard } from "@/components/cards";
import { fetchUserThreads } from "@/lib/actions/user.actions";

interface ThreadsTabProps {
  currentUserId: string;
  userId: string;
  accountType: string;
}

async function ThreadsTab({
  currentUserId,
  userId,
  accountType,
}: ThreadsTabProps) {
  // Fetch all threads for "clicked" user via  its user ID (Call to backend)
  let result = await fetchUserThreads(userId);

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
              currentUserId={currentUserId}
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

export default ThreadsTab;
