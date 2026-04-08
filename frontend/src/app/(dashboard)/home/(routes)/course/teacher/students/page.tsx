"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import PeddingStudentProfile from "../../components/PeddingStudentProfile";

type PeddingStudentType = {
  id: string;
  name: string;
  avatarUrl: string;
};

type ActiveStudentType = {
  id: string;
  name: string;
  avatarUrl: string;
  nickname: string;
  courses: number;
  handIn: number;
};

type MYStudentsType = {
  isPeddingStudents: PeddingStudentType[];
  activeStudents: ActiveStudentType[];
};

const StudentsPage = () => {
  const [searchStudent, setSearchStudent] = useState<string>("");
  const router = useRouter();

  const [myStudents, setMyStudents] = useState<MYStudentsType>({
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
        id: "a1",
        name: "Diana Prince",
        nickname: "WonderDev",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
        courses: 3,
        handIn: 12,
      },
      {
        id: "a2",
        name: "Edward Norton",
        nickname: "EdTheRed",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Edward",
        courses: 1,
        handIn: 4,
      },
      {
        id: "a3",
        name: "Fiona Gallagher",
        nickname: "FiFi",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona",
        courses: 5,
        handIn: 28,
      },
    ],
  });

  return (
    <main className="flex flex-col items-center gap-4">
      <section className="border-4 border-light-bg-gray p-3 rounded-2xl w-fit">
        <h1 className="text-lg lg:text-2xl text-primary">Új jelentkezések</h1>
        <div className="max-w-[80em] max-h-[12em]">
          <div className="flex-col lg:flex-row max-h-[12em] flex gap-3 lg:gap-7 overflow-auto touch-pan-y">
            {myStudents.isPeddingStudents.map((ps) => (
              <div
                key={ps.id}
                className="flex gap-3 bg-light-bg-gray px-1 py-3 lg:px-3 lg:py-5 rounded-2xl border-2 border-secondary hover:border-primary transition-all duration-300"
              >
                <Avatar className="size-14 lg:size-20 bg-background">
                  <AvatarImage
                    src={ps.avatarUrl || "/defaults/default_avatar.jpg"}
                  ></AvatarImage>
                </Avatar>
                <div className="flex flex-col justify-between">
                  <h2 className="text-xl lg:text-2xl">{ps.name}</h2>
                  <div className="flex justify-between w-[14em]">
                    <PeddingStudentProfile id={ps.id}></PeddingStudentProfile>
                    <div className="flex gap-1 items-center mr-5 lg:mr-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className="h-8 w-8 lg:h-10 lg:w-10 bg-linear-to-tl from-primary to-[#7CB08C]">
                            <Check className="size-7 lg:size-8"></Check>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-lg">Elfogadás</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className="h-8 w-8 lg:h-10 lg:w-10 bg-linear-to-tl from-[#B02929] to-[#BD6060]">
                            <X className="size-7 lg:size-8"></X>
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
      <section className="w-full">
        <div className="lg:flex-row flex-col gap-3 flex justify-between mb-10">
          <h1 className="text-3xl text-primary font-bold">Tanulóim</h1>
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
          {myStudents.activeStudents
            .filter((as) => as.name.toLowerCase().includes(searchStudent))
            .map((as) => (
              <div
                key={as.id}
                className="flex border-4 rounded-2xl hover:border-secondary border-transparent transition-all duration-300 shadow-2xl"
              >
                <img
                  src={as.avatarUrl || "/defaults/default_avatar.jpg"}
                  alt=""
                  className="h-24 w-24 lg:w-30 lg:h-30 rounded-l-2xl"
                />
                <div className="bg-light-bg-gray gap-2 lg:gap-0 px-6 w-full lg:flex-row flex-col flex justify-between lg:items-center rounded-r-2xl">
                  <div className="flex lg:flex-col gap-3">
                    <div>
                      <h1 className="text-lg lg:text-2xl text-primary font-bold">
                        {as.name}
                      </h1>
                      <h2 className="text-sm lg:text-md text-gray-500">
                        {as.nickname}
                      </h2>
                    </div>
                    <div className="hidden lg:flex gap-2 lg:gap-5">
                      <div className="text-xs lg:text-base flex gap-2 bg-background border-2 border-primary rounded-md w-fit h-fit p-1">
                        <Book className="size-4 lg:size-6"></Book>
                        <p className="hidden lg:block">Kurzusok:</p>
                        <p className="font-bold">{as.courses}</p>
                      </div>

                      <div className="flex gap-2 text-xs lg:text-base  bg-background border-2 border-primary rounded-md w-fit h-fit px-1 lg:px-2 py-1">
                        <HandHelping className="size-4 lg:size-6"></HandHelping>
                        <p>Beadandók:</p>
                        <p className="font-bold">{as.handIn}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-11 w-11 lg:h-16 lg:w-16"
                          onClick={() => {
                            router.push(
                              `/home/students/student/profile?id=${as.id}`,
                            );
                          }}
                        >
                          <CircleUserRound className="size-7 lg:size-10"></CircleUserRound>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-lg">Profil</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-11 w-11 lg:h-16 lg:w-16"
                          onClick={() => {
                            router.push(
                              `/home/students/student/message?id=${as.id}`,
                            );
                          }}
                        >
                          <MessageCircleMore className="size-7 lg:size-10"></MessageCircleMore>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-lg">Üzenetek</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-11 w-11 lg:h-16 lg:w-16"
                          onClick={() => {
                            router.push(
                              `/home/students/student/wall?id=${as.id}`,
                            );
                          }}
                        >
                          <BrickWall className="size-7 lg:size-10"></BrickWall>
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
      </section>
      <div className="lg:hidden h-10"></div>
    </main>
  );
};

export default StudentsPage;
