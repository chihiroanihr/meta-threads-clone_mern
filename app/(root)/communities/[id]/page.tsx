import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

import { ProfileHeader } from "@/components/shared";
import { ThreadsTabContent, MembersTabContent } from "@/components/tabs";
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

  // Fetch community info of the "clicked" community via its community ID (Call to backend)
  const communityInfo = await fetchCommunityInfo(params.id);
  // If no community
  if (!communityInfo) return null;
  const communityMembers = communityInfo.members;
  const communityThreads = communityInfo.threads;

  return (
    <section>
      {/* -------- Profile Section -------- */}
      <ProfileHeader
        currentAccountId={user.id}
        accountId={communityInfo.id}
        accountName={communityInfo.name}
        accountUsername={communityInfo.slug}
        accountBio={communityInfo.bio}
        accountImage={communityInfo.image}
        accountType="Community"
      />

      {/* -------- Tabs section -------- */}
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          {/* 3 Tabs */}
          <TabsList className="tab">
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

                {/* Tab label (hide on small devices) */}
                <p className="max-sm:hidden">{tab.label}</p>

                {/* Number of thread posts the community has */}
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityThreads.length}
                  </p>
                )}
                {/* Number of members the community has */}
                {tab.label === "Members" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityMembers.length}
                  </p>
                )}
                {/* Number of requests the community has */}
                {tab.label === "Requests" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {/* TODO: {communityInfo?.requests?.length}  */}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content - Threads Tab */}
          <TabsContent value="threads" className="w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              <ThreadsTabContent
                currentAccountId={user.id}
                accountType="Community"
                data={communityThreads}
              />
            </section>
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
              <MembersTabContent
                currentAccountId={user.id}
                data={communityMembers}
              />
            </section>
          </TabsContent>

          {/* Content - Requests Tab */}
          <TabsContent value="requests" className="w-full text-light-1">
            {/* Todo */}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
