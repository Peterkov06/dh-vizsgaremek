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

const WallHandin = () => {
  const params = useSearchParams();
  const wallId = params.get("wallId");
  const postId = params.get("postId");
  const [post, setPost] = useState<WallPostType>();
  const [comment, setComment] = useState<string>("");

  const formatDateComment = (dateString?: string) => {
    if (!dateString) return;

    return new Date(dateString).toLocaleDateString("hu-HU", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFetch = async () => {
    await fetchWithAuth(`/api/tutoring/${wallId}/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
    <main className=" lg:flex gap-3 lg:px-10 w-full">
      <section className="flex flex-col flex-1 gap-5">
        <div>
          <h1 className="text-3xl text-primary font-bold">{post?.title}</h1>
          <div className="flex gap-2">
            <h2 className="flex gap-2">
              <User className="text-primary"></User>
              {post?.posterName}
            </h2>
            <h2>-</h2>
            <h2>{formatDateComment(post?.createdAt)}</h2>
          </div>
        </div>
        <hr className="border-2 rounded-2xl" />
        <div className="overflow-hidden max-h-[30em]">
          <p className="text-xl overflow-auto h-full">{post?.text}</p>
        </div>
        <hr className="border-2 rounded-2xl" />
      </section>
      <div className="flex flex-col gap-5">
        <section className="p-4 gap-4 flex flex-col justify-between lg:w-[30em] bg-light-bg-gray mt-10 rounded-2xl">
          <h1 className="text-3xl text-primary">Beadási határidő</h1>
          <h2 className="text-xl">{formatDateComment(post?.dueDate)}</h2>
          <Button>Leadás</Button>
        </section>
        <section className="p-4 gap-4 flex flex-col justify-between lg:w-[30em] bg-light-bg-gray rounded-2xl">
          <h1 className="text-3xl text-primary">Kommentek</h1>
          <div className=" overflow-hidden flex-1 max-h-[25em]">
            <div className="flex flex-col gap-2 overflow-auto max-h-[25em]">
              {post && post?.comments.length < 1 && <h1>Nincs komment</h1>}
              {post?.comments.map((coms, i) => (
                <div
                  className="relative flex gap-2 items-start bg-background p-2 rounded-2xl mr-2"
                  key={i}
                >
                  <Avatar className="size-10 mt-3">
                    <AvatarImage
                      src={coms.senderImg || "/defaults/default_avatar.jpg"}
                    ></AvatarImage>
                  </Avatar>
                  <div className="absolute top-0 right-3 text-sm">
                    {formatDateComment(coms.sentTime)}
                  </div>
                  <div>
                    <h3>{coms.senderName}</h3>
                    <h1 className="text-lg">{coms.text}</h1>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
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
      </div>
    </main>
  );
};

export default WallHandin;
