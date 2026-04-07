"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Book,
  BrickWall,
  Check,
  CircleUserRound,
  HandHelping,
  MessageCircleMore,
  Search,
  X,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import PeddingStudentProfile from "../course/components/PeddingStudentProfile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type StudentType = {
  id: string;
  name: string;
  avatarUrl: string;
  nickname: string;
  courses: number;
  handIn: number;
  courseName: string;
};

type PeddingStudentType = {
  id: string;
  name: string;
  avatarUrl: string;
};

type MYStudentsType = {
  isPeddingStudents: PeddingStudentType[];
  activeStudents: StudentType[];
};

const StudentPage = () => {
  const router = useRouter();

  const [searchStudent, setSearchStudent] = useState<string>("");

  const dummyStudents: MYStudentsType = {
    isPeddingStudents: [
      {
        id: "p1",
        name: "Alice Thompson",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      },
      {
        id: "p2",
        name: "Bob Vancamp",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      },
      {
        id: "p3",
        name: "Charlie Day",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      },
      {
        id: "p4",
        name: "Charlie Day",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      },
      {
        id: "p5",
        name: "Charlie Day",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      },
    ],
    activeStudents: [
      {
        id: "s1",
        name: "Emma Richardson",
        nickname: "EmmaDev",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        courses: 3,
        handIn: 15,
        courseName: "Advanced React Patterns",
      },
      {
        id: "s2",
        name: "Liam O'Connor",
        nickname: "Liamy",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
        courses: 1,
        handIn: 2,
        courseName: "Introduction to .NET Auth",
      },
      {
        id: "s3",
        name: "Sophia Martinez",
        nickname: "SophiCode",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
        courses: 4,
        handIn: 28,
        courseName: "Entity Framework Deep Dive",
      },
      {
        id: "s4",
        name: "Noah Williams",
        nickname: "No-Ah",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
        courses: 2,
        handIn: 8,
        courseName: "Advanced React Patterns",
      },
      {
        id: "s5",
        name: "Olivia Chen",
        nickname: "Livvy",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
        courses: 1,
        handIn: 0,
        courseName: "PostgreSQL Architecture",
      },
      {
        id: "s6",
        name: "Lucas Varga",
        nickname: "VargaL",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
        courses: 5,
        handIn: 42,
        courseName: "Fullstack Diploma",
      },
    ],
  };

  function HandleRedirect(id: string, name: string) {
    router.push(`students/student/${name}?id=${id}`);
  }

  return (
    <main>
      <section className="border-4 border-light-bg-gray p-3 rounded-2xl w-fit mb-10">
        <h1 className="text-2xl text-primary">Új jelentkezések</h1>
        <div className="overflow-hidden max-w-[92em]">
          <div className="flex gap-7 overflow-auto">
            {dummyStudents.isPeddingStudents.map((ps) => (
              <div
                key={ps.id}
                className="flex gap-3 bg-light-bg-gray px-3 py-5 rounded-2xl border-2 border-secondary hover:border-primary transition-all duration-300"
              >
                <Avatar className="size-20 bg-background">
                  <AvatarImage
                    src={ps.avatarUrl || "/defaults/default_avatar.jpg"}
                  ></AvatarImage>
                </Avatar>
                <div className="flex flex-col justify-between">
                  <h2 className="text-2xl">{ps.name}</h2>
                  <div className="flex justify-between w-[14em]">
                    <PeddingStudentProfile id={ps.id}></PeddingStudentProfile>
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className="h-10 w-10 bg-linear-to-tl from-primary to-[#7CB08C]">
                            <Check className="size-8"></Check>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-lg">Elfogadás</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className="h-10 w-10 bg-linear-to-tl from-[#B02929] to-[#BD6060]">
                            <X className="size-8"></X>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-lg">Elutasítás</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="flex justify-between mb-10">
        <h1 className="text-5xl text-primary font-bold">Tanulóim</h1>
        <InputGroup className=" lg:max-w-[40%] shadow-2xl">
          <InputGroupInput
            type="text"
            value={searchStudent}
            onChange={(e) => {
              setSearchStudent(e.target.value.toLowerCase());
            }}
            className="text-lg!"
            placeholder="Keresés..."
          ></InputGroupInput>
          <InputGroupAddon align={"inline-end"}>
            <InputGroupButton>
              <Search className="size-5"></Search>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex flex-col gap-6">
        {dummyStudents.activeStudents
          .filter((as) => as.name.toLowerCase().includes(searchStudent))
          .map((as) => (
            <div
              key={as.id}
              className="relative flex  border-4 rounded-2xl hover:border-secondary border-transparent transition-all duration-300 shadow-2xl"
            >
              <h2 className="absolute -top-5 right-6 bg-background px-2 py-1 text-lg rounded-2xl">
                {as.courseName}
              </h2>
              <img
                src={as.avatarUrl || "/defaults/default_avatar.jpg"}
                alt=""
                className="w-30 h-30 rounded-l-2xl"
              />
              <div className="bg-light-bg-gray px-6 w-full flex justify-between items-center rounded-r-2xl">
                <div className="flex flex-col gap-3">
                  <div>
                    <h1 className="text-2xl text-primary font-bold">
                      {as.name}
                    </h1>
                    <h2 className=" text-gray-500">{as.nickname}</h2>
                  </div>
                  <div className="flex gap-5">
                    <div className="flex gap-2 bg-background border-2 border-primary rounded-md w-fit p-1">
                      <Book></Book>
                      <p>Kurzusok:</p>
                      <p className="font-bold">{as.courses}</p>
                    </div>

                    <div className="flex gap-2 bg-background border-2 border-primary rounded-md w-fit px-2 py-1">
                      <HandHelping></HandHelping>
                      <p>Beadandók:</p>
                      <p className="font-bold">{as.handIn}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-16 w-16 cursor-pointer"
                        onClick={() => {
                          HandleRedirect(as.id, "profile");
                        }}
                      >
                        <CircleUserRound className="size-10"></CircleUserRound>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-lg">Profil</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-16 w-16 cursor-pointer"
                        onClick={() => {
                          HandleRedirect(as.id, "message");
                        }}
                      >
                        <MessageCircleMore className="size-10"></MessageCircleMore>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-lg">Üzenetek</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-16 w-16 cursor-pointer"
                        onClick={() => {
                          HandleRedirect(as.id, "wall");
                        }}
                      >
                        <BrickWall className="size-10"></BrickWall>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-lg">Tanulói fall</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="mt-10 h-1"></div>
    </main>
  );
};

export default StudentPage;
