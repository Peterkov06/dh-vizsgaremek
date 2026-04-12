"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CoursePage, WallPostType } from "@/lib/models/CourseWall";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import WallPost from "./components/WallPost";
import { Button } from "@/components/ui/button";
import EnrollingClassDialog from "./components/EnrollingClassDialog";
import ReviewCourseDialog from "./components/ReviewCourseDialog";
import BuyingTokenDialog from "./components/BuyingTokenDialog";
import fetchWithAuth from "@/lib/api-client";
import { useSearchParams } from "next/navigation";

export interface CourseBrief {
  courseName: string;
  courseBaseId: string;
  instanceId: string;
  teacherName: string;
  teacherId: string;
  bannerURL: string;
  iconURL: string;
  tokenCount: number;
  nextHandins: any[];
  nextLessons: NextLessonType[];
}

interface NextLessonType {
  title: string | null;
  description: string | null;
  startDate: string;
  startTime: string;
}

const CourseWall = () => {
  const [page, setPage] = useState<CourseBrief>();

  const [posts, setPosts] = useState<WallPostType[]>();

  const searchParams = useSearchParams();

  const wallId = searchParams.get("wallId");

  const handleFetch = async () => {
    await fetchWithAuth(`/api/walls/${wallId}`)
      .then((data) => data.json())
      .then((res) => {
        setPage(res);
        console.log(res.teacherId);
      });
    await fetchWithAuth(`/api/tutoring/${wallId}/posts`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPosts(data);
      });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <main>
      <section className="flex items-center lg:items-end py-2 relative bg-linear-to-br from-primary to-secondary h-30 lg:h-46 rounded-2xl w-full text-primary-foreground">
        <Avatar className="lg:absolute size-12 lg:size-30 lg:-bottom-8 lg:left-5">
          <AvatarImage
            src={page?.iconURL || "/defaults/default_avatar.jpg"}
          ></AvatarImage>
        </Avatar>
        <div className="flex flex-col lg:gap-3 lg:ml-40">
          <h1 className="text-lg lg:text-3xl font-bold">{page?.courseName}</h1>
          <p className="flex gap-2 lg:ml-10 lg:text-lg">
            <User className="lg:size-8"></User>
            {page?.teacherName}
          </p>
        </div>
        <div className="absolute bottom-5 right-0 lg:right-5 lg:bottom-5 flex-col lg:flex-row flex gap-3">
          <ReviewCourseDialog></ReviewCourseDialog>
          {page && (
            <BuyingTokenDialog
              course={page.courseName}
              classLength={60}
              tokenCount={page.tokenCount}
            ></BuyingTokenDialog>
          )}
        </div>
      </section>
      <section className="lg:flex-row flex-col-reverse flex mt-10 gap-7">
        <section className="flex flex-1  flex-col gap-5">
          {posts?.map((p) => (
            <WallPost post={p} key={p.id}></WallPost>
          ))}
        </section>
        <section className="bg-linear-to-br lg:sticky top-2 from-primary lg:w-[30em] to-secondary rounded-2xl flex flex-col px-3 pt-10 pb-5 gap-5 h-fit">
          <div className="flex flex-col">
            <h1 className="text-2xl text-primary-foreground">
              Közelgő beadandók
            </h1>
            <div className="overflow-hidden max-h-[10em] mt-5">
              <div className="overflow-auto h-full flex flex-col gap-3">
                {page?.nextHandins.length === 0 && (
                  <h1 className="text-white">Nincs közelgő beadandód</h1>
                )}
                {page?.nextHandins &&
                  page?.nextHandins.map((uc) => (
                    <div
                      className="flex gap-0! bg-background text-primary rounded-lg px-3 py-1 shadow-2xl justify-between"
                      key={uc.id}
                    >
                      <div className="flex justify-center items-center min-w-0">
                        <h2 className="font-bold text-lg min-w-0  flex-1">
                          {uc.title}
                        </h2>
                      </div>
                      <div className="flex flex-col justify-end items-end ">
                        <p className="text-md shrink-0">{uc.date}</p>
                        <p className="text-lg font-bold">{uc.time}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl text-primary-foreground">Következő óra</h1>
            <div className="overflow-hidden max-h-[10em] mt-5">
              <div className="overflow-auto h-full flex flex-col gap-3">
                {page?.nextLessons.length === 0 && (
                  <h1 className="text-white">Nincs közelgő órád</h1>
                )}
                {page &&
                  page?.nextLessons.map((nl, i) => (
                    <div
                      className={`flex gap-0! bg-background text-primary rounded-lg px-3 py-1 shadow-2xl ${nl.title ? "justify-between" : "justify-center"}`}
                      key={i}
                    >
                      <div className="flex justify-center items-center min-w-0">
                        <h2 className="font-bold text-lg min-w-0  flex-1">
                          {nl.title}
                        </h2>
                      </div>
                      <div className="flex flex-col justify-end items-end ">
                        <p className="text-md shrink-0">{nl.startDate}</p>
                        <p className="text-lg font-bold">{nl.startTime}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {page && (
            <EnrollingClassDialog
              token={page.tokenCount} //kell
              teacherId={page.teacherId}
              course={page?.courseName}
            ></EnrollingClassDialog>
          )}
        </section>
      </section>
    </main>
  );
};

export default CourseWall;
