"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  image: string;
}

const UserCard = ({ id, name, username, image }: UserCardProps) => {
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
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
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
