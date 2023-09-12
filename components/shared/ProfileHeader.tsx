import Image from "next/image";
import Link from "next/link";

interface ProfileHeaderProps {
  currentAccountId: string;
  accountId: string;
  accountName: string;
  accountUsername: string;
  accountBio: string;
  accountImage: string;
  accountType?: "User" | "Community";
}

function ProfileHeader({
  currentAccountId,
  accountId,
  accountName,
  accountUsername,
  accountBio,
  accountImage,
  accountType,
}: ProfileHeaderProps) {
  return (
    <div className="w-full flex flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Profile Image */}
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={accountImage}
              alt="profile image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          {/* Account name & Name */}
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {accountName}
            </h2>
            <p className="text-base-medium text-gray-1">@{accountUsername}</p>
          </div>
        </div>

        {/* Edit Account */}
        {accountId === currentAccountId && accountType !== "Community" && (
          <Link href="/profile/edit">
            <div className="flex gap-3 rounded-lg px-4 py-2 bg-dark-3 cursor-pointer">
              <Image
                src="/assets/edit.svg"
                alt="edit account"
                width={16}
                height={16}
              />
              <p className="text-light-2 max-sm:hidden">Edit</p>
            </div>
          </Link>
        )}
      </div>

      {/* Bio */}
      <p className="mt-6 max-w-lg text-base-regular text-light-2">
        {accountBio}
      </p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}

export default ProfileHeader;
