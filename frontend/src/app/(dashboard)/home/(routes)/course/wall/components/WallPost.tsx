"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Post, WallPostType } from "@/lib/models/CourseWall";
import { ArrowRight, File } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const WallPost = (props: { post: WallPostType }) => {
  const [comment, setComment] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const wallId = searchParams.get("wallId");

  const formatDate = (dateString?: string) => {
    if (!dateString) return;

    return new Date(dateString).toLocaleDateString("hu-HU", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="bg-light-bg-gray relative  rounded-2xl flex flex-col gap-4 p-6 hover:scale-103 transition-all duration-300"
      onClick={() => {
        router.push(`wall/post?wallId=${wallId}&postId=${props.post.id}`);
      }}
    >
      <div className="flex items-center gap-2">
        {props.post.handInId === null ? (
          <Avatar>
            <AvatarImage
              src={props.post.posterImg || "/defaults/default_avatar.jpg"}
            ></AvatarImage>
          </Avatar>
        ) : (
          <File className="size-10 text-primary"></File>
        )}
        {props.post.handInId === null ? (
          <h1 className="text-primary text-2xl">{props.post.posterName}</h1>
        ) : (
          <div>
            <h2 className="text-lg">{props.post.posterName}</h2>
            <h1 className="text-primary text-2xl">{props.post.title}</h1>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <div className="overflow-hidden max-h-[23em]">
          <p className="text-xl overflow-auto h-full">{props.post.text}</p>
        </div>
        <div className="flex flex-col gap-2">
          {props.post.handInId === null ? (
            props.post.attachmentURLs.map((a, id) => (
              <div
                key={id}
                className="text-md bg-linear-to-tr from-primary to-secondary text-primary-foreground px-4 py-2 rounded-xl"
              >
                {a}
              </div>
            ))
          ) : (
            <div className="absolute top-1 right-3">
              {" "}
              {formatDate(props.post.createdAt)}
            </div>
          )}
        </div>
      </div>
      {props.post.handInId === null && (
        <div className="flex gap-3 mt-5" onClick={(e) => e.stopPropagation()}>
          <Input
            value={comment}
            className="border-2 border-primary"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="Komment..."
          ></Input>
          <Button>
            <ArrowRight></ArrowRight>
          </Button>
        </div>
      )}
    </div>
  );
};

export default WallPost;
