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
  User,
  X,
} from "lucide-react";
import { useState } from "react";

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
        <h1 className="text-2xl text-primary">Új jelentkezések</h1>
        <div className="overflow-hidden max-w-[80em]">
          <div className="flex gap-7 overflow-auto">
            {myStudents.isPeddingStudents.map((ps) => (
              <div
                key={ps.id}
                className="flex gap-3 bg-light-bg-gray px-3 py-5 rounded-2xl border-2 border-secondary"
              >
                <Avatar className="size-20 bg-background">
                  <AvatarImage
                    src={ps.avatarUrl || "/defaults/default_avatar.jpg"}
                  ></AvatarImage>
                </Avatar>
                <div className="flex flex-col justify-between">
                  <h2 className="text-2xl">{ps.name}</h2>
                  <div className="flex justify-between w-[14em]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className="h-10 w-10">
                          <CircleUserRound className="size-6"></CircleUserRound>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-lg">Profil</p>
                      </TooltipContent>
                    </Tooltip>
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
      <section className="w-full">
        <div className="flex justify-between mb-10">
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
              <div key={as.id} className="flex">
                <img
                  src={as.avatarUrl || "/defaults/default_avatar.jpg"}
                  alt=""
                  className="w-30 h-30"
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
                        <Button className="h-16 w-16">
                          <CircleUserRound className="size-10"></CircleUserRound>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-lg">Profil</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className="h-16 w-16">
                          <MessageCircleMore className="size-10"></MessageCircleMore>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-lg">Üzenetek</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className="h-16 w-16">
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
      </section>
    </main>
  );
};

export default StudentsPage;
