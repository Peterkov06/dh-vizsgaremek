"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { Plus } from "lucide-react";
import Link from "next/link";
import TeacherCourseCardOverView, {
  TeacherCourseType,
} from "../components/TeacherCourseCardOverView";
import { useEffect, useState } from "react";
import { CourseDashboardData } from "@/lib/models/teacherSettingsModel";
import fetchWithAuth from "@/lib/api-client";

const TeacherCourse = (props: { user: User }) => {
  const [courses, setCourses] = useState<CourseDashboardData>();

  const handleFetch = async () => {
    await fetchWithAuth("/api/pages/teacher/my-courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
      });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <main className="flex flex-col gap-3">
      <h1 className="text-5xl font-bold text-primary">Kurzusaim</h1>

      <section className="flex flex-col gap-7">
        {courses?.tutoringCourses.map((tc) => (
          <TeacherCourseCardOverView
            data={tc}
            key={tc.courseId}
          ></TeacherCourseCardOverView>
        ))}
        <Link href={"course/creator"}>
          <div className="flex w-full hover:scale-105 transition-all duration-300 cursor-pointer will-change-transform">
            <Button className="text-2xl w-full h-14">
              <Plus className="size-10"></Plus>Kurzus létrehozzása
            </Button>
          </div>
        </Link>
      </section>
    </main>
  );
};

export default TeacherCourse;
