"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Post } from "@/lib/models/CourseWall";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const WallPost = (props: { post: Post }) => {
  const [comment, setComment] = useState<string>("");

  return (
    <div className="bg-light-bg-gray rounded-2xl flex flex-col gap-4 p-6 hover:scale-103 transition-all duration-300">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={props.post.author.avatarUrl}></AvatarImage>
        </Avatar>
        <h1 className="text-primary text-2xl">{props.post.author.name}</h1>
      </div>
      <div className="flex gap-3">
        <div className="overflow-hidden max-h-[23em]">
          <p className="text-xl max-w-[32em] overflow-auto h-full">
            {props.post.content}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {props.post.attachments.map((a) => (
            <div
              key={a.id}
              className="text-md bg-linear-to-tr from-primary to-secondary text-primary-foreground px-4 py-2 rounded-xl"
            >
              {a.label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
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
    </div>
  );
};

export default WallPost;
