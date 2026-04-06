"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

type Student = {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
  introduction: string;
  age: number;
  address: string;
  preferences: string[];
};

const StudentProfile = () => {
  const [student, setStudent] = useState<Student>({
    id: "st-001",
    name: "Benjamin Taylor",
    nickname: "BennyT",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ben",
    introduction:
      "Aspiring full-stack developer with a passion for clean code and UX design. I love solving complex problems with simple solutions.",
    age: 24,
    address: "123 Tech Lane, San Francisco, CA",
    preferences: ["React", "TypeScript", "Node.js", "Dark Mode"],
  });
  return (
    <main className="flex gap-5">
      <section className="flex-1 flex flex-col gap-10">
        <div className="bg-secondary rounded-2xl w-full h-50 flex items-end px-5 py-3 gap-5">
          <Avatar className="size-40 bg-background">
            <AvatarImage
              src={student.avatarUrl || "/defaults/default_avatar.jpg"}
            ></AvatarImage>
          </Avatar>
          <div className="mb-4">
            <h1 className="text-3xl text-primary font-bold">{student.name}</h1>
            <h2 className="text-xl text-gray-500">{student.nickname}</h2>
          </div>
        </div>
        <div className="bg-secondary rounded-2xl w-full flex gap-5 flex-col p-6">
          <h1 className="text-2xl text-primary">Bemutatkozás</h1>
          <p className="text-lg">{student.introduction}</p>
        </div>
      </section>
      <section className="w-[30em] bg-light-bg-gray rounded-2xl p-5 flex flex-col gap-5 h-fit">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-primary">Életkor:</h2>
          <h2 className="text-2xl text-primary font-bold">{student.age}</h2>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-primary">Lakhely:</h2>
          <h2 className="text-2xl text-primary font-bold text-end">
            {student.address}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl text-primary">Preferenciák:</h2>
          <div className="flex gap-2">
            {student.preferences.map((pref, id) => (
              <div
                key={id}
                className="bg-background py-1 px-2 rounded-lg border-2 border-primary"
              >
                {pref}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default StudentProfile;
