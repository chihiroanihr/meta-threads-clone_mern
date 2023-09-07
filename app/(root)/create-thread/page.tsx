import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { fetchUser } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";

async function Page() {
  const user = await currentUser();

  // If no currently logged in user
  if (!user) return null;

  // Fetch user info via its id (Call to backend)
  const userInfo = await fetchUser(user.id);

  // If no user info exists
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={userInfo._id} />
    </>
  );
}

export default Page;
