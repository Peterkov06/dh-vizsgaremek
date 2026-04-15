"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CoursesPage } from "@/lib/models/CourseSearchModel";
import { Teacher } from "@/lib/models/TeacherProfileModels";
import { Captions, MapPin, Star, User, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SearchCourseCard from "../components/SearchCourseCard";

const TeacherProfile = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [teacher, setTeacher] = useState<Teacher>();

  const [courses, setCourses] = useState<CoursesPage>();
  const getTeacherInfo = async () => {
    await fetch(`/api/identity/profile/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTeacher(data);
      });
    await fetch(`/api/courses?teacherId=${id}`)
      .then((res) => res.json())
      .then((res) => setCourses(res));
  };

  useEffect(() => {
    getTeacherInfo();
  }, []);

  return (
    <main className="flex lg:flex-row flex-col gap-10">
      <section className="flex-1 flex flex-col gap-10 lg:gap-16">
        <section className="flex items-end py-2 relative bg-linear-to-br from-primary to-secondary h-30 lg:h-46 rounded-2xl w-full text-primary-foreground">
          <Avatar className="absolute size-20 lg:size-30 -bottom-8 left-5 border-2 border-light-bg-gray">
            <AvatarImage src={teacher?.profilePictureUrl}></AvatarImage>
          </Avatar>
          <div className="flex flex-col gap-3 m-auto lg:ml-40">
            <h1 className="text-3xl lg:text-5xl font-bold">
              {teacher?.fullName}
            </h1>
            {/* <p className="flex gap-2 ml-10 text-lg">
              <MapPin className="size-8 "></MapPin>
              {teacher?.teachingLocations[0]}
            </p> */}
          </div>
        </section>
        <section className="grid grid-cols-1 m-auto lg:m-0 lg:grid-cols-3 gap-3">
          {courses?.courses.map((c, id) => (
            <SearchCourseCard card={c} key={id}></SearchCourseCard>
          ))}
        </section>
        <div className="h-1"></div>
      </section>
      <section className="border-4 border-light-bg-gray rounded-2xl lg:w-[27em] h-fit p-3 flex flex-col gap-5">
        <div>
          <div className="flex text-2xl lg:text-3xl font-bold text-primary items-center gap-3">
            <Captions className="size-8 lg:size-10"></Captions>
            <h1>Bemutatkozás:</h1>
          </div>
          <p className="text-xl">{teacher?.introduction}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex text-2xl lg:text-3xl font-bold text-primary items-center gap-3">
            <Star className="size-8 lg:size-10"></Star>
            <h1>Átlagos értékelés:</h1>
          </div>
          <p className="text-2xl lg:text-3xl font-bold">
            {teacher?.ratingAverage}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex text-2xl lg:text-3xl font-bold text-primary items-center gap-3">
            <Users className="size-8 lg:size-10"></Users>
            <h1>Tanulók száma:</h1>
          </div>
          <p className="text-2xl lg:text-3xl font-bold">
            {teacher?.totalStudents}+
          </p>
        </div>
      </section>
    </main>
  );
};

export default TeacherProfile;
