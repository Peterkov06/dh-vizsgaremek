"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { StudentProfileType } from "../components/StudentPageSidebar";
import { useSearchParams } from "next/navigation";

const StudentProfile = () => {
  const [student, setStudent] = useState<StudentProfileType>();
  const searchParams = useSearchParams();

  const studentId = searchParams.get("studentId");
  useEffect(() => {
    fetch(`/api/identity/profile/${studentId}`)
      .then((res) => res.json())
      .then((res) => setStudent(res));
  }, []);
  return (
    <main className="flex lg:flex-row flex-col gap-5">
      <section className="flex-1 flex flex-col gap-5 lg:gap-10">
        <div className="bg-secondary rounded-2xl w-full lg:h-50 flex items-end px-5 py-3 gap-5">
          <Avatar className="size-26 lg:size-40 bg-background">
            <AvatarImage
              src={student?.profilePictureUrl || "/defaults/default_avatar.jpg"}
            ></AvatarImage>
          </Avatar>
          <div className="mb-4">
            <h1 className="text-2xl lg:text-3xl text-primary font-bold">
              {student?.fullName}
            </h1>
            <h2 className="text-xl text-gray-500">{student?.nickname}</h2>
          </div>
        </div>
        <div className="bg-secondary rounded-2xl w-full flex gap-5 flex-col p-6">
          <h1 className="text-2xl text-primary">Bemutatkozás</h1>
          <p className="text-lg">{student?.introduction}</p>
        </div>
      </section>
      <section className="w-full lg:w-[30em] bg-light-bg-gray rounded-2xl p-5 flex flex-col gap-5 h-fit">
        <div className="flex justify-between items-center">
          <h2 className="text-xl lg:text-2xl text-primary">Életkor:</h2>
          <h2 className="text-xl lg:text-2xl text-primary font-bold">
            {student?.age}
          </h2>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl lg:text-2xl text-primary">Lakhely:</h2>
          <h2 className="text-xl lg:text-2xl text-primary font-bold text-end">
            {student?.location}
          </h2>
        </div>
        {/* <div className="flex lg:flex-col gap-3">
          <h2 className="text-xl lg:text-2xl text-primary">Preferenciák:</h2>
          <div className="flex gap-1 lg:gap-2 overflow-auto max-w-[12em] lg:max-w-[25em]">
            {student.preferences.map((pref, id) => (
              <div
                key={id}
                className="bg-background h-fit shrink-0 p-1 lg:px-2 rounded-lg border-2 border-primary text-sm lg:text-base"
              >
                {pref}
              </div>
            ))}
          </div>
        </div> */}
      </section>
    </main>
  );
};

export default StudentProfile;
