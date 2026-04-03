"use client";

import { CourseDetail } from "@/lib/models/CourseSearchModel";
import { FileText, Globe, Users } from "lucide-react";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

const CourseSidebar = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const path = pathName.split("/").at(-1);

  const id = searchParams.get("id");

  const [course, setCourse] = useState<CourseDetail>();

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((res) => res.json())
      .then((res) => setCourse(res));
  }, []);

  const HandleNavigate = (name: string) => {
    if (path !== name) {
      redirect(`${name}?id=${id}`);
    }
  };

  return (
    <div className="border-4 border-light-bg-gray rounded-2xl h-fit px-2 py-4 bg-light-bg-gray w-[20em]">
      <div className="mb-5">
        <h1 className="text-primary font-bold">{course?.courseName}</h1>
      </div>
      <div className="flex flex-col gap-5 bg-background rounded-2xl py-5 px-2">
        <div
          className={`flex gap-2 bg-light-bg-gray cursor-pointer px-2 py-1 rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path === "modify" && "bg-primary text-background"}`}
          onClick={() => {
            HandleNavigate("modify");
          }}
        >
          <FileText></FileText>
          Kurzus profil
        </div>
        <div
          className={`flex gap-2 bg-light-bg-gray px-2 py-1 cursor-pointer rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path === "students" && "bg-primary text-background"}`}
          onClick={() => {
            HandleNavigate("students");
          }}
        >
          <Users></Users>
          Tanulók
        </div>
        <div
          className={`flex gap-2 bg-light-bg-gray px-2 py-1 cursor-pointer rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path === "community" && "bg-primary text-background"}`}
          onClick={() => {
            HandleNavigate("community");
          }}
        >
          <Globe></Globe>
          Közösség
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
