import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { ProfileHeader, ThreadsTab } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUser } from "@/lib/actions/user.actions";
import { profileTabs } from "@/constants";

async function Page({ params }: { params: { id: string } }) {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Fetch user info of the "clicked" user via its user ID (Call to backend)
  const userInfo = await fetchUser(params.id); // !! params.id instead of user.id from currentUser() since we could be checking other account's profile.
  // If no user info exists
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        currentUserId={user.id}
        userId={userInfo.id}
        name={userInfo.name}
        username={userInfo.username}
        bio={userInfo.bio}
        imgUrl={userInfo.image}
      />

      {/* Tabs section */}
      <div className="mt-9">
        {/* Tab Container */}
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {/* Tab */}
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                {/* Tab Image */}
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />

                {/* Label (hide on small devices) */}
                <p className="max-sm:hidden">{tab.label}</p>

                {/* Number of thread posts the user has */}
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm px-2 py-1 bg-light-4 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              <ThreadsTab
                currentUserId={user.id}
                userId={userInfo.id} // we could be checking other account's profile.
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
