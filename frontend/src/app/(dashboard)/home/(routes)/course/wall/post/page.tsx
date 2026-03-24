"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Post } from "@/lib/models/CourseWall";
import { ArrowRight, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const WallPost = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const [post, setPost] = useState<Post>();
  const [comment, setComment] = useState<string>("");

  const formatDate = (dateString?: Date) => {
    if (!dateString) return;

    return new Date(dateString).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetch("/mockup/WallPost.json")
      .then((data) => data.json())
      .then((res) => setPost(res));
  }, []);

  return (
    <main className="flex gap-3 px-10 w-full">
      <section className="flex flex-col flex-1 gap-5">
        <div>
          <h1 className="text-3xl text-primary font-bold">
            {formatDate(post?.createdAt)}
          </h1>
          <h2 className="flex  gap-2">
            <User className="text-primary"></User>
            {post?.author.name}
          </h2>
        </div>
        <hr className="border-2 rounded-2xl" />
        <div className="overflow-hidden max-h-[30em]">
          <p className="text-xl overflow-auto h-full">{post?.content}</p>
        </div>
        <hr className="border-2 rounded-2xl" />
      </section>
      <section className="p-4 gap-4 flex flex-col justify-between w-[30em] bg-light-bg-gray mt-10 rounded-2xl">
        <h1 className="text-3xl text-primary">Kommentek</h1>
        <div className=" overflow-hidden flex-1 max-h-[25em]">
          <div className="flex flex-col gap-2 overflow-auto h-full">
            {post?.comments.map((coms) => (
              <div
                className="flex gap-2 items-start bg-background p-2 rounded-2xl mr-2"
                key={coms.id}
              >
                <Avatar className="size-10 mt-3">
                  <AvatarImage src={coms.author.avatarUrl}></AvatarImage>
                </Avatar>
                <div>
                  <h3>{coms.author.name}</h3>
                  <h1 className="text-lg">{coms.content}</h1>
                </div>
              </div>
            ))}
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
          <Button>
            <ArrowRight></ArrowRight>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default WallPost;
