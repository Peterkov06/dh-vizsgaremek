"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "@/lib/auth";
import { StudentsCourse } from "@/lib/models/StudentCourseModel";
import Link from "next/link";
import { useState } from "react";
import StudentCourseCard from "../components/StudentCourseCard";

const StudentCourse = (props: { user: User }) => {
  const [courseStatus, setCourseStatus] = useState<string>("active");

  const [studentCourses, setStudentCourses] = useState<StudentsCourse[]>([
    {
      id: "1",
      bannerImg: "https://picsum.photos/seed/course1/800/200",
      avatarImg: "https://picsum.photos/seed/teacher1/100/100",
      courseName: "Matematika alapok",
      teacherName: "Kovács János",
      isPedding: false,
    },
    {
      id: "2",
      bannerImg: "https://picsum.photos/seed/course2/800/200",
      avatarImg: "https://picsum.photos/seed/teacher2/100/100",
      courseName: "Angol nyelvtan",
      teacherName: "Nagy Éva",
      isPedding: true,
    },
  ]);

  return (
    <main>
      <h1 className="text-4xl font-bold text-primary">Kurzusaim</h1>
      <section className="mt-5">
        <RadioGroup
          className="grid grid-cols-2 gap-0 w-[30em]"
          value={courseStatus}
          onValueChange={setCourseStatus}
        >
          <div
            className={`border-6 border-light-bg-gray rounded-l-xl py-2 ${courseStatus === "active" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
          >
            <RadioGroupItem
              value="active"
              className="hidden"
              id="studs"
            ></RadioGroupItem>
            <Label
              htmlFor="studs"
              className="h-full w-full flex justify-center items-center text-xl"
            >
              Aktív
            </Label>
          </div>
          <div
            className={`border-6 border-light-bg-gray rounded-r-xl ${courseStatus === "archivalt" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
          >
            <RadioGroupItem
              value="archivalt"
              className="hidden"
              id="money"
            ></RadioGroupItem>
            <Label
              htmlFor="money"
              className="h-full w-full flex justify-center items-center text-xl"
            >
              Archivált
            </Label>
          </div>
        </RadioGroup>

        <section className="flex flex-col gap-10 mt-5">
          {studentCourses.map((sc) => (
            <StudentCourseCard data={sc} key={sc.id}></StudentCourseCard>
          ))}
        </section>
      </section>
    </main>
  );
};

export default StudentCourse;
