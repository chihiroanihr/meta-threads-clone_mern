"use client"; // useRouter() only works in client-side.

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { twMerge } from "tailwind-merge";

import { sidebarLinks } from "@/constants";

function LeftSidebar() {
  // const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    // Left sidebar on Desktop devices (Bottom-bar on Mobile devices)
    <section className="custom-scrollbar left-sidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          // Active Link
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          // Fix profile link route to current user's profile link
          if (link.route === "/profile") {
            link.route = `${link.route}/${userId}`;
          }

          return (
            <Link
              href={link.route}
              key={link.label}
              className={twMerge(
                "left-sidebar_link",
                isActive && "bg-primary-500"
              )}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Sign Out Button (only visible on large devices, will be on top-bar on small devices.) */}
      <div className="mt-10 px-6">
        <SignedIn>
          <div className="flex w-full items-center justify-center gap-4 p-4">
            <UserButton
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonAvatarBox: "w-7 h-7",
                },
              }}
              afterSignOutUrl="/sign-in"
            />
            <p className="text-light-2 max-lg:hidden">Account Setting</p>
          </div>
          {/* <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton> */}
        </SignedIn>
      </div>
    </section>
  );
}

export default LeftSidebar;
