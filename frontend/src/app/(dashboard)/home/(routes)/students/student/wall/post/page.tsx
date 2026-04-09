"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import fetchWithAuth from "@/lib/api-client";
import { Post, WallPostType } from "@/lib/models/CourseWall";
import { ArrowRight, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const WallPost = () => {
  const params = useSearchParams();
  const wallId = params.get("wallId");
  const postId = params.get("postId");
  const [post, setPost] = useState<WallPostType>();
  const [comment, setComment] = useState<string>("");

  const formatDate = (dateString?: string) => {
    if (!dateString) return;

    return new Date(dateString).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFetch = async () => {
    await fetchWithAuth(`/api/tutoring/${wallId}/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      });
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleFetch();
  }, []);

  async function handleComment() {
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
      handleFetch();
    } else {
      toast.error("Hiba történt");
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [post?.comments]);

  return (
    <main className="flex gap-3 px-10 w-full">
      <section className="flex flex-col flex-1 gap-5">
        <div>
          <h1 className="text-3xl text-primary font-bold">
            {formatDate(post?.createdAt)}
          </h1>
          <h2 className="flex  gap-2">
            <User className="text-primary"></User>
            {post?.posterName}
          </h2>
        </div>
        <hr className="border-2 rounded-2xl" />
        <div className="overflow-hidden max-h-[30em]">
          <p className="text-xl overflow-auto h-full">{post?.text}</p>
        </div>
        <hr className="border-2 rounded-2xl" />
      </section>
      <section className="p-4 gap-4 flex flex-col justify-between w-[30em] bg-light-bg-gray mt-10 rounded-2xl">
        <h1 className="text-3xl text-primary">Kommentek</h1>
        <div className=" overflow-hidden flex-1 max-h-[25em]">
          <div className="flex flex-col gap-2 overflow-auto h-full">
            {post?.comments.map((coms, i) => (
              <div
                className="flex gap-2 items-start bg-background p-2 rounded-2xl mr-2"
                key={i}
              >
                <Avatar className="size-10 mt-3">
                  <AvatarImage
                    src={coms.senderImg || "/defaults/default_avatar.jpg"}
                  ></AvatarImage>
                </Avatar>
                <div>
                  <h3>{coms.senderName}</h3>
                  <h1 className="text-lg">{coms.text}</h1>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="flex gap-3 mt-5" onClick={(e) => e.stopPropagation()}>
          <Input
            value={comment}
            className="border-2 border-primary"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="Komment..."
          ></Input>
          <Button onClick={handleComment}>
            <ArrowRight></ArrowRight>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default WallPost;
