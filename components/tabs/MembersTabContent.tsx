import { UserCard } from "@/components/cards";

const MembersTabContent = ({
  currentAccountId,
  data,
}: {
  currentAccountId: string;
  data: any;
}) => {
  // data === list of community members (User schema)
  return data.length === 0 ? (
    <p className="no-result">No users found.</p>
  ) : (
    data.map((member: any) => (
      <UserCard
        key={member.id}
        id={member.id}
        currentUserId={currentAccountId}
        name={member.name}
        username={member.username}
        image={member.image}
      />
    ))
  );
};

export default MembersTabContent;
