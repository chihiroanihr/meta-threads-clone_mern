import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

import { ProfileHeader, ThreadsTabContent } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCommunityInfo } from "@/lib/actions/community.actions";
import { communityTabs } from "@/constants";
import { UserCard } from "@/components/cards";

async function Page({ params }: { params: { id: string } }) {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Check if "clicked" community exists /* TODO: display user not found */
  if (!params.id) return null;
  // Fetch community info of the "clicked" community via its cimmunity ID (Call to backend)
  const communityInfo = await fetchCommunityInfo(params.id);

  return (
    <section>
      <ProfileHeader
        currentAccountId={user.id}
        accountId={communityInfo.id}
        accountName={communityInfo.name}
        accountUsername={communityInfo.slug}
        accountBio={communityInfo.bio}
        accountImage={communityInfo.image}
        accountType="Community"
      />

      {/* Tabs section */}
      <div className="mt-9">
        {/* Tab Container */}
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {/* Tab */}
            {communityTabs.map((tab) => (
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
                    {communityInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content - Threads Tab */}
          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadsTabContent
              currentAccountId={user.id}
              accountId={communityInfo._id} // we could be checking other account's profile.
              accountType="Community"
            />
          </TabsContent>

          {/* Content - Members Tab */}
          <TabsContent value="members" className="w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              {communityInfo?.members.map((member: any) => {
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  image={member.image}
                />;
              })}
            </section>
          </TabsContent>

          {/* Content - Requests Tab */}
          <TabsContent value="requests" className="w-full text-light-1">
            <ThreadsTabContent
              currentAccountId={user.id}
              accountId={communityInfo._id} // we could be checking other account's profile.
              accountType="Community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
