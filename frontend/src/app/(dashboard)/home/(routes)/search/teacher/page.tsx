"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Teacher } from "@/lib/models/TeacherProfileModels";
import { Captions, MapPin, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TeacherProfile = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [teacher, setTeacher] = useState<Teacher>();

  const getTeacherInfo = async () => {
    await fetch(`/api/identity/profile/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTeacher(data);
      });
  };

  useEffect(() => {
    getTeacherInfo();
  }, []);

  return (
    <main className="flex gap-10">
      <section className="flex-1">
        <section className="flex items-end py-2 relative bg-linear-to-br from-primary to-secondary h-46 rounded-2xl w-full text-primary-foreground">
          <Avatar className="absolute size-30 -bottom-8 left-5 border-2 border-light-bg-gray">
            <AvatarImage
              src={teacher?.profilePictureUrl || "/defaults/default_avatar.jpg"}
            ></AvatarImage>
          </Avatar>
          <div className="flex flex-col gap-3 ml-40">
            <h1 className="text-3xl font-bold">{teacher?.fullName}</h1>
            {/* <p className="flex gap-2 ml-10 text-lg">
              <MapPin className="size-8 "></MapPin>
              {teacher?.teachingLocations[0]}
            </p> */}
          </div>
        </section>
      </section>
      <section className="border-4 border-light-bg-gray rounded-2xl w-[35em] p-3">
        <div className="flex text-3xl font-bold text-primary items-center gap-3">
          <Captions className="size-10"></Captions>
          <h1>Bemutatkozás</h1>
        </div>
        <p>{teacher?.introduction}</p>
      </section>
    </main>
  );
};

export default TeacherProfile;
