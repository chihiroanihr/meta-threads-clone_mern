import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { AccountProfile } from "@/components/forms";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Fetch user info via its currently logged-in user ID (Call to backend)
  const userInfo = await fetchUser(user.id);
  // IF user has onboarded then redirect to Home.
  if (userInfo?.onboarding) redirect("/");

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo.username : user?.username,
    name:
      userInfo?.name ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      "",
    bio: userInfo ? userInfo.bio : "",
    image: userInfo ? userInfo.image : user.imageUrl,
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} buttonTitle="Continue" />
      </section>
    </main>
  );
}

export default Page;
