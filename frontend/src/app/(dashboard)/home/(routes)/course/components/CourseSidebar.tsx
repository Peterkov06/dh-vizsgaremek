"use client";

import { CourseDetail } from "@/lib/models/CourseSearchModel";
import { ChevronDown, Eye, FileText, Globe, Users } from "lucide-react";
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
  const [isOpenFilter, setIsOpenFilter] = useState(false);

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
    <div className="border-4 border-light-bg-gray rounded-2xl h-fit lg:px-2 lg:py-4 bg-light-bg-gray w-full lg:w-[20em]">
      <div className="lg:mb-5">
        {/* <h1 className="text-primary font-bold">{course?.courseName}</h1> */}
        <h1
          className="lg:text-xl font-bold text-primary flex items-center gap-2 bg-light-bg-gray p-2 rounded-xl"
          onClick={() => setIsOpenFilter((prev) => !prev)}
        >
          {course?.courseName}
          <ChevronDown
            className={` transition-transform duration-300 size-20 md:hidden ${
              isOpenFilter ? "rotate-180" : "rotate-0"
            }`}
          />
        </h1>
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
            className={`flex items-center gap-2 bg-light-bg-gray cursor-pointer px-2 py-1 rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path === "modify" && "bg-primary text-background"}`}
            onClick={() => {
              HandleNavigate("modify");
            }}
          >
            <FileText></FileText>
            Kurzus profil
          </div>
          <div
            className={`flex items-center gap-2 bg-light-bg-gray px-2 py-1 cursor-pointer rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path === "students" && "bg-primary text-background"}`}
            onClick={() => {
              HandleNavigate("students");
            }}
          >
            <Users></Users>
            Tanulók
          </div>
          <div
            className={`flex items-center gap-2 bg-light-bg-gray px-2 py-1 cursor-pointer rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path === "community" && "bg-primary text-background"}`}
            onClick={() => {
              HandleNavigate("community");
            }}
          >
            <Eye></Eye>
            Áttekintés
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
