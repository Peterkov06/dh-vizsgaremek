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
    <div className="lg:flex-row flex-col rounded-2xl flex hover:scale-105 transition-all duration-300 cursor-pointer will-change-transform">
      <div className="relative">
        <img
          src={props.data.courseBannerURL || "/defaults/default_course.jpg"}
          alt=""
          className="w-[35em] h-[10em] rounded-t-2xl lg:rounded-l-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-b lg:bg-linear-to-r from-20% from-transparent to-light-bg-gray p-1" />
        <Avatar className="size-16 lg:size-20 absolute bottom-0 -right-3 lg:-bottom-5 lg:-right-10 border-2 border-light-bg-gray">
          <AvatarImage
            src={
              props.data.teacherProfilePictureURL ||
              "/defaults/default_avatar.jpg"
            }
          ></AvatarImage>
        </Avatar>
      </div>
      <div className="bg-light-bg-gray flex-1 flex justify-between items-center py-3 lg:py-0 px-5 rounded-b-2xl lg:rounded-none lg:rounded-r-2xl">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl lg:text-4xl text-primary font-bold">
            {props.data.courseName}
          </h1>
          <p className="flex gap-2 lg:ml-10 items-center lg:text-lg">
            <User className="lg:size-8"></User>
            {props.data.teacherName}
          </p>
        </div>
        <Button
          disabled={props.data.status === "Pending"}
          className="text-2xl h-12"
          onClick={() => {
            // // router.push(`course/wall?wallId=${props.data.courseBaseId}`);
            router.push(
              `course/wall?courseId=${props.data.courseBaseId}&wallId=${props.data.instanceId}`,
            );
          }}
        >
          {props.data.status === "Pending" && (
            <ClockFading className="size-8"></ClockFading>
          )}
          <span className="hidden lg:block">
            {props.data.status === "Pending" ? "Függőben..." : "Aktív"}
          </span>
          {props.data.status !== "Pending" && (
            <ArrowRightFromLine className="size-8"></ArrowRightFromLine>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StudentCourseCard;
