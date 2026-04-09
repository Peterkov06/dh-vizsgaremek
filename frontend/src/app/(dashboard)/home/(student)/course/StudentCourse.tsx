"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "@/lib/auth";
import { StudentsCourse } from "@/lib/models/StudentCourseModel";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import StudentCourseCard from "../components/StudentCourseCard";
import fetchWithAuth from "@/lib/api-client";
import { Search } from "lucide-react";

const StudentCourse = (props: { user: User }) => {
  const [courseStatus, setCourseStatus] = useState<string>("active");

  const [studentCourses, setStudentCourses] = useState<StudentsCourse[]>([]);

  const HandleFetch = async () => {
    await fetchWithAuth("/api/pages/student/my-courses")
      .then((res) => res.json())
      .then((data) => {
        setStudentCourses(data);
      });
  };

  useEffect(() => {
    HandleFetch();
  }, []);

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
          {studentCourses.length === 0 && (
            <div className="flex gap-3">
              <h1 className="text-2xl">Még nincs kurzusod! Keress egyet: </h1>
              <Link href={"search"}>
                <Button>
                  <Search></Search>Keresés
                </Button>
              </Link>
            </div>
          )}
          {studentCourses.map((sc) => (
            <StudentCourseCard
              data={sc}
              key={sc.instanceId}
            ></StudentCourseCard>
          ))}
        </section>
      </section>
    </main>
  );
};

export default StudentCourse;
