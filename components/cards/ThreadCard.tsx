import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { formatTimeAgo } from "@/lib/utils";

interface ThreadCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    id: string;
    username: string;
    image: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments:
    | {
        author: {
          image: string;
        };
      }[]
    | null;
  isComment?: boolean;
  displayReplyNumber?: boolean;
}

interface ThreadCardContentProps {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    image: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  isComment: boolean;
}

const ThreadCardContent = ({
  id,
  content,
  author,
  community,
  createdAt,
  isComment,
}: ThreadCardContentProps) => {
  return (
    <div className="flex w-full flex-row gap-4">
      {/* --------- Row --------- */}
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
          <Image
            src={author.image}
            alt="profile image"
            fill
            className="cursor-pointer rounded-full"
          />
        </Link>

        {/* Threads Bar (extends) */}
        <div className="thread-card_bar" />
      </div>

      {/* --------- Row --------- */}
      <div className="flex flex-1 flex-col truncate">
        <div className="flex flex-wrap items-center gap-1">
          {/* Author Name */}
          <Link
            href={`/profile/${author.id}`}
            className="w-fit hover:underline"
          >
            <h4 className="cursor-pointer text-base-semibold text-light-1 hover:underline">
              {author.username}
            </h4>
          </Link>

          {/* Community Info */}
          {community && (
            <div className="inline-block truncate text-subtle-medium text-gray-1">
              — from{" "}
              <Link
                href={`/communities/${community.id}`}
                className="inline-flex items-center font-semibold text-gray-400 hover:underline"
              >
                {community.name}
                <Image
                  src={community.image}
                  alt="community profile"
                  width={14}
                  height={14}
                  className="ml-1 rounded-full object-cover"
                />
              </Link>
            </div>
          )}
        </div>

        {/* Thread Content */}
        <p className="mt-2 text-small-regular text-light-2">{content}</p>

        {/* Action Content */}
        <div className={twMerge("mt-5 flex gap-3.5", isComment && "mb-10")}>
          {/* Like Button */}
          <Image
            src="/assets/heart-gray.svg"
            alt="heart"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
          {/* Reply Button */}
          <Link href={`/thread/${id}`}>
            <Image
              src="/assets/reply.svg"
              alt="reply"
              width={24}
              height={24}
              className="cursor-pointer object-contain"
            />
          </Link>
          {/* Repost Button */}
          <Image
            src="/assets/repost.svg"
            alt="repost"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
          {/* Share Button */}
          <Image
            src="/assets/share.svg"
            alt="share"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
        </div>
      </div>

      {/* --------- Row --------- */}
      <div className="text-subtle-medium text-gray-1">
        {/* Date Creation */}
        <p>{formatTimeAgo(createdAt)}</p>
      </div>
    </div>
  );
};

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment = false,
  displayReplyNumber = false,
}: ThreadCardProps) => {
  return (
    <article
      className={twMerge(
        "w-full flex flex-col items-start rounded-xl",
        isComment ? "px-0 xs:px-7" : "p-7 bg-dark-2"
      )}
    >
      {/* Thread Card */}
      <ThreadCardContent
        id={id}
        content={content}
        author={author}
        community={community}
        createdAt={createdAt}
        isComment={isComment}
      />

      {/* {comments && author.id === currentUserId} */}

      {/* Reply Numbers */}
      {displayReplyNumber && comments && comments.length > 0 && (
        <Link href={`/thred/${id}`}>
          <p className="mt-1 text-subtle-medium text-gray-1 hover:underline">
            {comments.length === 0 ? "1 reply" : `${comments.length} replies`}
          </p>
        </Link>
      )}

      {/* TODO: Delete Thread */}
      {/* TODO: Show comment logos */}
    </article>
  );
};

export default ThreadCard;
