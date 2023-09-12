import { ThreadCard } from "@/components/cards";

const ThreadsTabContent = ({
  currentAccountId: currentAccountId,
  accountType: accountType,
  data: data,
}: {
  currentAccountId: string;
  accountType: string;
  data: any;
}) => {
  return data.length === 0 ? (
    // If no threads exist
    <p className="no-result">No threads found.</p>
  ) : (
    // If threads exist
    data.map((thread: any) => (
      <ThreadCard
        key={thread._id}
        id={thread._id}
        currentUserId={currentAccountId}
        parentId={thread.parentId}
        content={thread.text}
        author={
          accountType === "User"
            ? {
                id: thread.author.id,
                username: thread.author.username,
                image: thread.author.image,
              }
            : {
                id: thread.author.id,
                username: thread.author.username,
                image: thread.author.image,
              }
        }
        community={
          accountType === "User"
            ? thread.community
            : {
                name: data.name,
                id: data.id,
                image: data.image,
              }
        }
        createdAt={thread.createdAt}
        comments={thread.children}
        displayReplyNumber={true}
      />
    ))
  );
};

export default ThreadsTabContent;
