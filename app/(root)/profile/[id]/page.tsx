import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { ProfileHeader } from "@/components/shared";
import { ThreadsTabContent } from "@/components/tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUser, fetchUserThreads } from "@/lib/actions/user.actions";
import { profileTabs } from "@/constants";

async function Page({ params }: { params: { id: string } }) {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Check if "clicked" user exists /* TODO: display user not found */
  if (!params.id) return null;

  // Fetch user info of the "clicked" user via its user ID (Call to backend)
  const userInfo = await fetchUser(params.id); // !! params.id instead of user.id from currentUser() since we could be checking other account's profile.
  // If user is not onboarded yet
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch all threads that belong to the "clicked" user via its user ID (Call to backend)
  const userThreads = await fetchUserThreads(userInfo._id);

  return (
    <section>
      <ProfileHeader
        currentAccountId={user.id}
        accountId={userInfo.id}
        accountName={userInfo.name}
        accountUsername={userInfo.username}
        accountBio={userInfo.bio}
        accountImage={userInfo.image}
        accountType="User"
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
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="w-full text-light-1"
            >
              <section className="mt-9 flex flex-col gap-10">
                <ThreadsTabContent
                  currentAccountId={user.id}
                  accountType="User"
                  data={userThreads}
                />
              </section>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
