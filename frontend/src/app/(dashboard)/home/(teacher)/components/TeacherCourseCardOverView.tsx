"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRightFromLine, HandHelping, Star, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export type TeacherCourseType = {
  id: string;
  courseName: string;
  avatarImg: string;
  bannerImg: string;
  studentCount: number;
  handInCount: number;
  rating: number;
};

const TeacherCourseCardOverView = (props: { data: TeacherCourseType }) => {
  const router = useRouter();

  return (
    <div className="lg:flex-row flex-col flex hover:scale-105 transition-all duration-300 cursor-pointer will-change-transform">
      <div className="relative">
        <img
          src={props.data.bannerImg || "/defaults/default_course.jpg"}
          alt=""
          className="w-full h-[12em] lg:w-[20em] lg:h-[10em] rounded-t-2xl lg:rounded-r-none lg:rounded-l-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-b lg:bg-linear-to-r from-60% from-transparent to-light-bg-gray p-1" />
        <Avatar className="size-20 absolute -bottom-7 -right-3 lg:-bottom-5 lg:-right-10 border-2 border-light-bg-gray">
          <AvatarImage
            src={props.data.avatarImg || "/defaults/default_avatar.jpg"}
          ></AvatarImage>
        </Avatar>
      </div>
      <div className="bg-light-bg-gray flex-1  flex justify-between items-center px-3 py-3 lg:px-5 rounded-r-2xl">
        <div className="flex flex-col gap-3 lg:ml-5">
          <h1 className="text-xl lg:text-4xl text-primary font-bold">
            {props.data.courseName}
          </h1>
          <div className="flex gap-1 lg:gap-5">
            <div className="flex gap-2 bg-background border-2 border-primary rounded-md w-fit px-2 py-1">
              <User></User>
              <p className="hidden lg:block">Tanulók:</p>
              <p className="font-bold">{props.data.studentCount}</p>
            </div>
            <div className="flex gap-2 bg-background border-2 border-primary rounded-md w-fit px-2 py-1">
              <HandHelping></HandHelping>
              <p className="hidden lg:block">Beadandók:</p>
              <p className="font-bold">{props.data.handInCount}</p>
            </div>
            <div className="flex gap-2 bg-background border-2 border-primary rounded-md w-fit px-2 py-1">
              <p className="font-bold">{props.data.handInCount}</p>
              <Star className="text-yellow-500"></Star>
            </div>
          </div>
        </div>
        <Button
          className="text-2xl h-12"
          onClick={() => {
            router.push(`course/teacher/modify?id=${props.data.id}`);
          }}
        >
          <p className="hidden lg:block">Kurzusra</p>
          <ArrowRightFromLine className="size-8"></ArrowRightFromLine>
        </Button>
      </div>
    </div>
  );
};

export default TeacherCourseCardOverView;
