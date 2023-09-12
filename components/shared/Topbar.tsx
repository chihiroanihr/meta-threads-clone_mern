import Image from "next/image";
import Link from "next/link";
import { SignedIn, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

function Topbar() {
  // const router = useRouter();

  return (
    <nav className="top-bar">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-2">
        {/* Organization Switcher */}
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
              organizationSwitcherTriggerIcon: "ml-0",
            },
          }}
        />

        {/* Sign Out Button (only visible on small devices, will be on left sidebar on large devices.) */}
        <div className="block md:hidden">
          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonAvatarBox: "w-9 h-9",
                },
              }}
              afterSignOutUrl="/sign-in"
            />
            {/* <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton> */}
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;
