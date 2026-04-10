"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CoursePage, WallPostType } from "@/lib/models/CourseWall";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import WallPost from "../../../course/wall/components/WallPost";
import { Button } from "@/components/ui/button";
import PostDialog from "../components/PostDialog";
import HandInDialog from "../components/HandInDialog";
import fetchWithAuth from "@/lib/api-client";
import { useSearchParams } from "next/navigation";
import { CourseBrief } from "../../../course/wall/page";

const TeacherCourseWallPage = () => {
  const [posts, setPosts] = useState<WallPostType[]>();

  const searchParams = useSearchParams();

  const wallId = searchParams.get("wallId");

  const [page, setPage] = useState<CourseBrief>();

  const handleFetch = async () => {
    // await fetchWithAuth(`/api/walls/${wallId}`)
    //   .then((data) => data.json())
    //   .then((res) => {
    //     setPage(res);
    //   });
    await fetchWithAuth(`/api/tutoring/${wallId}/posts`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPosts(data);
      });
  };

  useEffect(() => {
    handleFetch();
  }, [wallId]);

  return (
    <main>
      <section className="flex items-end py-2 relative bg-linear-to-br from-primary to-secondary h-46 rounded-2xl w-full text-primary-foreground">
        <Avatar className="absolute size-30 -bottom-8 left-5">
          <AvatarImage
            src={page?.iconURL || "/defaults/default_avatar.jpg"}
          ></AvatarImage>
        </Avatar>
        <div className="flex flex-col gap-3 ml-40">
          <h1 className="text-3xl font-bold">{page?.courseName}</h1>
          <p className="flex gap-2 ml-10 text-lg">
            <User className="size-8 "></User>
            {page?.teacherName}
          </p>
        </div>
      </section>
      <section className="flex mt-10 gap-7">
        <section className="flex flex-1  flex-col gap-5">
          <div className="flex justify-evenly">
            <PostDialog onSuccess={handleFetch}></PostDialog>
            <HandInDialog onSuccess={handleFetch}></HandInDialog>
          </div>
          {posts?.map((p) => (
            <WallPost post={p} key={p.id}></WallPost>
          ))}
        </section>
      </section>
    </main>
  );
};

export default TeacherCourseWallPage;
