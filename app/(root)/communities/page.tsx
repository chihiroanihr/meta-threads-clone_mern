import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { CommunityCard } from "@/components/cards";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunitiesFromSearch } from "@/lib/actions/community.actions";

const Page = async () => {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Fetch user info via its currently logged-in user ID (Call to backend)
  const userInfo = await fetchUser(user.id);
  // If no currently logged-in user info exists
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch all communities based on given search input (Call to backend)
  const result = await fetchCommunitiesFromSearch({
    searchString: "",
    pageNumber: 1,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Search Bar */}

      <div className="mt-14 flex flex-col gap-9">
        {
          // If no communities (results) found
          result.communities.length === 0 ? (
            <p className="no-result">No communities found.</p>
          ) : (
            // If communities (results) found
            result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                slug={community.slug}
                image={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))
          )
        }
      </div>
    </section>
  );
};

export default Page;
