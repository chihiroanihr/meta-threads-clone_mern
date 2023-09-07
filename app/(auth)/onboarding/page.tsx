import { currentUser } from "@clerk/nextjs";

import { AccountProfile } from "@/components/forms";

async function Page() {
  // Check if user authenticated
  const user = await currentUser();

  /* TODO: Connect with Database to fetch. */
  const userInfo = {};
  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || `${user?.firstName} ${user?.lastName}` || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user.imageUrl,
  };

  return (
    <main className="mx-auto max-w-3xl flex flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads.
      </p>

      <section className="mt-9 p-10 bg-dark-2">
        <AccountProfile user={userData} buttonTitle="Continue" />
      </section>
    </main>
  );
}

export default Page;
