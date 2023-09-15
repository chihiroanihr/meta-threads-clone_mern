import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { formatTimeAgo } from "@/lib/utils";

interface CommentProps {
  _id: string;
  text: string;
  author: {
    id: string;
    image: string;
    username: string;
  };
  parentId: string | null;
  children: any[];
  createdAt: string;
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
  gapsBtwComments: boolean;
}

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
  comments: CommentProps[] | null;
  isThreadPageComment?: boolean;
  displayFirstComment?: boolean;
  displayReplyNumber?: boolean;
}

const ThreadCardContent = ({
  id,
  content,
  author,
  community,
  createdAt,
  gapsBtwComments,
}: ThreadCardContentProps) => {
  return (
    <Link href={`/thread/${id}`} className="mb-2 flex w-full flex-row gap-2">
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
        <div
          className={twMerge(
            "mt-5 flex gap-3.5",
            gapsBtwComments ? "mb-5" : "mb-1"
          )}
        >
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
    </Link>
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
  isThreadPageComment = false,
  displayFirstComment = false,
  displayReplyNumber = false,
}: ThreadCardProps) => {
  // If user commenting first to his/her own post then
  // display up to 1 consecutive comment on feed
  // (Only applicable in home page where displayFirstComment === true).
  const commentedFirstOnOwnPost: boolean =
    displayFirstComment && comments && comments[0]?.parentId === id.toString()
      ? true
      : false;

  // Count number of comments if comment threads exist
  const commentsNumber: number = comments
    ? commentedFirstOnOwnPost
      ? comments.length - 1
      : comments.length
    : 0;

  let uniqueAuthorsCommented = 0;

  return (
    <article
      className={twMerge(
        "w-full flex flex-col items-start rounded-xl",
        isThreadPageComment ? "px-0 xs:px-7" : "p-7 bg-dark-2"
      )}
    >
      {/* Thread Card */}
      <ThreadCardContent
        id={id}
        content={content}
        author={author}
        community={community}
        createdAt={createdAt}
        gapsBtwComments={
          (!isThreadPageComment && commentsNumber > 0) ||
          commentedFirstOnOwnPost
        }
      />

      {/* If user commenting first to his/her own post then display until 1 consecutive comment (only applicatble in home page).*/}
      {comments && displayFirstComment && commentedFirstOnOwnPost && (
        <ThreadCardContent
          id={comments[0]._id}
          content={comments[0].text}
          author={comments[0].author}
          community={null}
          createdAt={comments[0].createdAt}
          gapsBtwComments={false}
        />
      )}

      {/* Reply Numbers */}
      {comments && displayReplyNumber && commentsNumber > 0 && (
        <Link href={`/thread/${id}`} className="flex items-center">
          {/* Profile Icons */}
          <div className="flex w-11 items-center justify-center">
            {comments.map((comment: any, index: number) => {
              // Check if the number of unique authors icon display exceeds 3
              if (uniqueAuthorsCommented >= 3) {
                return null;
              }
              // Return the first iteration since there is no previous comment yet
              if (index === 0) {
                uniqueAuthorsCommented++;
                return (
                  <Image
                    key={index}
                    src={comment.author.image}
                    alt={`user_${index}`}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                );
              }
              // Check if the current comment author id is the same as the previous comment author id
              if (comment.author.id === comments[index - 1].author.id) {
                return null; // Skip the iteration by returning null
              }
              // Render the image component for unique author ids
              uniqueAuthorsCommented++;
              return (
                <Image
                  key={index}
                  src={comment.author.image}
                  alt={`user_${index}`}
                  width={20}
                  height={20}
                  className="-ml-1 rounded-full object-cover"
                />
              );
            })}
          </div>

          {/* Reply Numbers */}
          <p className="text-subtle-medium text-gray-1 hover:underline">
            {commentsNumber === 1 ? "1 reply" : `${commentsNumber} replies`}
          </p>
        </Link>
      )}

      {/* TODO: Delete Thread */}
      {/* TODO: Show comment logos */}
    </article>
  );
};

export default ThreadCard;
