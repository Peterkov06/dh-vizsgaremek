"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  BrickWall,
  ChevronDown,
  CircleUserRound,
  FileText,
  MessageCircleMore,
} from "lucide-react";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type StudentType = {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
};

export interface StudentProfileType {
  id: string;
  fullName: string;
  nickname: string;
  introduction: string;
  profilePictureUrl: string;
  type: "Student" | "Teacher" | "Admin" | string;
  age: number;
}

const StudentPageSidebar = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const path = pathName.split("/");

  const studentId = searchParams.get("studentId");
  const wallId = searchParams.get("wallId");
  const chatId = searchParams.get("chatId");
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [student, setStudent] = useState<StudentProfileType>();

  //   const [course, setCourse] = useState<CourseDetail>();

  useEffect(() => {
    fetch(`/api/identity/profile/${studentId}`)
      .then((res) => res.json())
      .then((res) => setStudent(res));
  }, []);

  const HandleNavigate = (name: string) => {
    if (!path.includes(name)) {
      redirect(
        `${name}?studentId=${studentId}&wallId=${wallId}&chatId=${chatId}`,
      );
    }
  };

  return (
    <div className="border-4 border-light-bg-gray rounded-2xl h-fit px-2 py-4 bg-light-bg-gray w-full lg:w-[20em]">
      <div
        className="flex items-center justify-between"
        onClick={() => setIsOpenFilter((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={student?.profilePictureUrl || "/defaults/default_avatar.jpg"}
            ></AvatarImage>
          </Avatar>
          <div>
            <h1 className="text-xl text-primary font-bold">
              {student?.fullName}
            </h1>
            <h2 className="text-gray-500">{student?.nickname}</h2>
          </div>
        </div>
        <ChevronDown
          className={` transition-transform duration-300 size-14 md:hidden text-primary ${
            isOpenFilter ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      <div
        className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 md:flex md:overflow-visible ${
          isOpenFilter
            ? "max-h-500 opacity-100"
            : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
        }`}
      >
        <div className="flex flex-col gap-5 bg-background rounded-2xl py-5 px-2">
          <div
            className={`flex gap-2 bg-light-bg-gray cursor-pointer px-2 py-1 rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path.includes("profile") && "bg-primary text-background"}`}
            onClick={() => {
              HandleNavigate("profile");
            }}
          >
            <CircleUserRound></CircleUserRound>
            Profil
          </div>
          <div
            className={`flex gap-2 bg-light-bg-gray px-2 py-1 cursor-pointer rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path.includes("message") && "bg-primary text-background"}`}
            onClick={() => {
              HandleNavigate("message");
            }}
          >
            <MessageCircleMore></MessageCircleMore>
            Üzenetek
          </div>

          <div
            className={`flex gap-2 bg-light-bg-gray px-2 py-1 cursor-pointer rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path.includes("wall") && "bg-primary text-background"}`}
            onClick={() => {
              HandleNavigate("wall");
            }}
          >
            <BrickWall></BrickWall>
            Kurzus fal
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPageSidebar;
