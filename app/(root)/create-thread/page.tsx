import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { PostThread } from "@/components/forms";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  // Check if user authenticated
  const user = await currentUser();
  // If no currently logged-in user
  if (!user) return null;

  // Fetch user info via its currently logged-in user ID (Call to backend)
  const userInfo = await fetchUser(user.id);
  // If no user info exists
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={JSON.stringify(userInfo._id)} />
    </>
  );
}

export default Page;
