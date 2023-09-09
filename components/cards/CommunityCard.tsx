import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  name: string;
  slug: string;
  image: string;
  bio: string;
  members: {
    image: string;
  }[];
}

function CommunityCard({ id, name, slug, image, bio, members }: Props) {
  return (
    <article className="community-card">
      <div className="flex flex-wrap items-center gap-3">
        {/* Profile Image */}
        <Link href={`/communities/${id}`} className="relative h-12 w-12">
          <Image
            src={image}
            alt="community_logo"
            fill
            className="rounded-full object-cover"
          />
        </Link>

        {/* Name & Slug */}
        <div>
          <Link href={`/communities/${id}`}>
            <h4 className="text-base-semibold text-light-1">{name}</h4>
          </Link>
          <p className="text-small-medium text-gray-1">@{slug}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-4 text-subtle-medium text-gray-1">{bio}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        {/* View More Button */}
        <Link href={`/communities/${id}`}>
          <Button size="sm" className="community-card_btn">
            View
          </Button>
        </Link>

        {/* Members Preview as Icons */}
        {members.length > 0 && (
          <div className="flex items-center">
            {members.map((member, index) => (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={28}
                height={28}
                className={`${
                  index !== 0 && "-ml-2"
                } rounded-full object-cover`}
              />
            ))}
            {members.length > 3 && (
              <p className="ml-1 text-subtle-medium text-gray-1">
                {members.length}+ Users
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default CommunityCard;
