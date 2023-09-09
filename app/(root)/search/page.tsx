import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { UserCard } from "@/components/cards";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";

const Page = async () => {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Fetch user info via its currently logged-in user ID (Call to backend)
  const userInfo = await fetchUser(user.id);
  // If no currently logged-in user info exists
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch all users based on given search input (Call to backend)
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Search Bar */}

      <div className="mt-14 flex flex-col gap-9">
        {
          // If no users (results) found
          result.users.length === 0 ? (
            <p className="no-result">No users found.</p>
          ) : (
            // If users (results) found
            result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                image={user.image}
              />
            ))
          )
        }
      </div>
    </section>
  );
};

export default Page;
