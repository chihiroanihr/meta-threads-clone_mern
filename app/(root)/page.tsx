import { UserButton, currentUser } from "@clerk/nextjs";

import { ThreadCard } from "@/components/cards";
import { fetchThreads } from "@/lib/actions/thread.actions";

export default async function Home() {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Fetch all threads for given pagination (Call to backend)
  const result = await fetchThreads({
    pageNumber: 1,
  }); /* TODO: Dynamic Pagination Input **/

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.threads.length === 0 ? (
          <p className="no-result">No threads found.</p>
        ) : (
          <>
            {result.threads.map((thread) => (
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
            ))}
          </>
        )}
      </section>
      {/* <UserButton afterSignOutUrl="/" /> */}
    </div>
  );
}
