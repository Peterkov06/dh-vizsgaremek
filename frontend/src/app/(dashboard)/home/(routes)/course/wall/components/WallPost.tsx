"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import fetchWithAuth from "@/lib/api-client";
import { Post, WallPostType } from "@/lib/models/CourseWall";
import { ArrowRight, File } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
  async function handleComment(postId: string) {
    const res = await fetchWithAuth("/api/tutoring/wall/post/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        wallId,
        postId,
        text: comment,
      }),
    });

    if (res.ok) {
      setComment("");
    } else {
      toast.error("Hiba történt");
    }
  }

  return (
    <div
      className="bg-light-bg-gray relative  rounded-2xl flex flex-col gap-4 p-3 lg:p-6 hover:scale-103 transition-all duration-300"
      onClick={() => {
        router.push(
          `wall/${props.post.handInId === null ? "post" : "handin"}?wallId=${wallId}&postId=${props.post.id}`,
        );
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
            <h2 className=" lg:text-lg">{props.post.posterName}</h2>
            <h1 className="text-primary text-xl lg:text-2xl">
              {props.post.title}
            </h1>
          </div>
        )}
      </div>
      <div className="flex gap-3 min-w-0">
        <div className="overflow-hidden max-h-[23em] min-w-0 flex-1">
          <p className="text-xl wrap-break-word">{props.post.text}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
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
        <div
          className="flex gap-3 mt-2 lg:mt-5"
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            value={comment}
            className="border-2 border-primary"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="Komment..."
          ></Input>
          <Button
            onClick={() => {
              handleComment(props.post.id);
            }}
            disabled={comment === ""}
          >
            <ArrowRight></ArrowRight>
          </Button>
        </div>
      )}
    </div>
  );
};

export default WallPost;
