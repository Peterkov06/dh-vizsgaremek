"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CoursePage } from "@/lib/models/CourseWall";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import WallPost from "./components/WallPost";

const CourseWall = () => {
  const [page, setPage] = useState<CoursePage>();

  useEffect(() => {
    fetch("/mockup/courseWall.json")
      .then((data) => data.json())
      .then((res) => setPage(res));
  }, []);

  return (
    <main>
      <section className="flex items-end py-2 relative bg-linear-to-br from-primary to-secondary h-46 rounded-2xl w-full text-primary-foreground">
        <Avatar className="absolute size-30 -bottom-8 left-5">
          <AvatarImage src={page?.teacher.avatarUrl}></AvatarImage>
        </Avatar>
        <div className="flex flex-col gap-3 ml-40">
          <h1 className="text-3xl font-bold">{page?.title}</h1>
          <p className="flex gap-2 ml-10 text-lg">
            <User className="size-8 "></User>
            {page?.teacher.name}
          </p>
        </div>
      </section>
      <section className="flex mt-10 gap-7">
        <section className="flex flex-1  flex-col gap-5">
          {page?.posts.map((p) => (
            <WallPost post={p} key={p.id}></WallPost>
          ))}
        </section>
        <section className="bg-linear-to-br sticky top-2 from-primary w-[30em] to-secondary rounded-2xl flex flex-col px-3 py-10    gap-5 h-fit">
          <div className="flex flex-col">
            <h1 className="text-2xl text-primary-foreground">
              Közelgő beadandók
            </h1>
            <div className="overflow-hidden max-h-[10em] mt-5">
              <div className="overflow-auto h-full flex flex-col gap-3">
                {page?.sidebar.upcoming.map((uc) => (
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
                {page?.sidebar.nextLessons.map((nl) => (
                  <div
                    className="flex gap-0! bg-background text-primary rounded-lg px-3 py-1 shadow-2xl justify-between"
                    key={nl.id}
                  >
                    <div className="flex justify-center items-center min-w-0">
                      <h2 className="font-bold text-lg min-w-0  flex-1">
                        {nl.title}
                      </h2>
                    </div>
                    <div className="flex flex-col justify-end items-end ">
                      <p className="text-md shrink-0">{nl.date}</p>
                      <p className="text-lg font-bold">{nl.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default CourseWall;
