"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StudentsCourse } from "@/lib/models/StudentCourseModel";
import {
  ArrowRightFromLine,
  ArrowRightIcon,
  ClockFading,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

const StudentCourseCard = (props: { data: StudentsCourse }) => {
  const router = useRouter();

  return (
    <div className="flex hover:scale-105 transition-all duration-300 cursor-pointer will-change-transform">
      <div className="relative">
        <img
          src={props.data.bannerImg}
          alt=""
          className="w-[35em] h-[10em] rounded-l-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-r from-20% from-transparent to-light-bg-gray p-1" />
        <Avatar className="size-20 absolute -bottom-5 -right-10 border-2 border-light-bg-gray">
          <AvatarImage src={props.data.avatarImg}></AvatarImage>
        </Avatar>
      </div>
      <div className="bg-light-bg-gray flex-1 flex justify-between items-center px-5 rounded-r-2xl">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl text-primary font-bold">
            {props.data.courseName}
          </h1>
          <p className="flex gap-2 ml-10 text-lg">
            <User className="size-8 "></User>
            {props.data.teacherName}
          </p>
        </div>
        <Button
          disabled={props.data.isPedding}
          className="text-2xl h-12"
          onClick={() => {
            router.push(`course/wall?id=${props.data.id}`);
          }}
        >
          {props.data.isPedding && (
            <ClockFading className="size-8"></ClockFading>
          )}
          {props.data.isPedding ? "Függőben..." : "Aktív"}
          {!props.data.isPedding && (
            <ArrowRightFromLine className="size-8"></ArrowRightFromLine>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StudentCourseCard;
