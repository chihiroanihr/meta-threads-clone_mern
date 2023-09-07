import Image from "next/image";

interface ProfileHeaderProps {
  currentUserId: string;
  userId: string;
  name: string;
  username: string;
  bio: string;
  imgUrl: string;
}

function ProfileHeader({
  currentUserId,
  userId,
  name,
  username,
  bio,
  imgUrl,
}: ProfileHeaderProps) {
  return (
    <div className="w-full flex flex-col justify-start">
      <div className="flex items-center justify-between gap-3">
        {/* Profile Image */}
        <div className="relative h-20 w-20 object-cover">
          <Image
            src={imgUrl}
            alt="profile image"
            fill
            className="rounded-full object-cover shadow-2xl"
          />
        </div>

        {/* Username & Name */}
        <div className="flex-1">
          <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
          <p className="text-base-medium text-gray-1">@{username}</p>
        </div>
      </div>

      {/* TODO: Community */}

      {/* Bio */}
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}

export default ProfileHeader;
