"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface UserCardProps {
  currentUserId?: string | null;
  id: string;
  name: string;
  username: string;
  image: string;
}

const UserCard = ({
  currentUserId = null,
  id,
  name,
  username,
  image,
}: UserCardProps) => {
  const router = useRouter();

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        {/* Profile Image */}
        <Image
          src={image}
          alt="profile image"
          width={48}
          height={48}
          className="rounded-full"
        />
        {/* Name & Username */}
        <div className="flex flex-1 flex-col gap-1 text-ellipsis">
          {currentUserId === id ? ( // If user is an admin
            <div className="flex items-center gap-3">
              <h4 className="text-base-semibold text-light-1">{name}</h4>
              <p className="text-gray-1">—</p>
              <p className="text-gray-1">admin</p>
            </div>
          ) : (
            // If normal user
            <h4 className="text-base-semibold text-light-1">{name}</h4>
          )}
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      {/* View More Button */}
      <Button
        onClick={() => router.push(`/profile/${id}`)}
        className="user-card_btn"
      >
        View
      </Button>
    </article>
  );
};

export default UserCard;
