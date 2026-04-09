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
import { useEffect, useState } from "react";
import PeddingStudentProfile from "../course/components/PeddingStudentProfile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import fetchWithAuth from "@/lib/api-client";
import { toast } from "sonner";

export interface TutoringStudent {
  studentId: string;
  name: string;
  nickname: string;
  courseNumber: number;
  ongoingHandins: number;
  chatId: string;
  wallId: string;
}

export interface MyStudents {
  tutoring: TutoringStudent[];
  learningPath: any[];
}

export interface PeddingStudentType {
  id: string;
  studentName: string;
  studentId: string;
  courseName: string;
  courseId: string;
}

const StudentPage = () => {
  const router = useRouter();

  const [searchStudent, setSearchStudent] = useState<string>("");
  const [peddingStudents, setPeddingStudents] =
    useState<PeddingStudentType[]>();

  const [myStudents, setMyStudents] = useState<MyStudents>();

  const HandleFetches = async () => {
    await fetchWithAuth("/api/tutoring/enrollment/teacher")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPeddingStudents(data);
      });
    await fetchWithAuth("/api/pages/teacher/my-student")
      .then((res) => res.json())
      .then((data) => {
        setMyStudents(data);
      });
  };

  const HandleAcceptance = async (id: string, accepted: boolean) => {
    await fetchWithAuth("/api/tutoring/enrollment/react", {
      method: "PATCH",
      body: JSON.stringify({
        enrollmentID: id,
        accepted: accepted,
      }),
    }).then((res) => {
      if (res.ok)
        toast.success(
          `Sikeres tanuló ${accepted ? "elfogadás" : "elutasítás"}`,
        );
      else toast.error("Hiba történt");
      HandleFetches();
    });
  };

  useEffect(() => {
    HandleFetches();
  }, []);

  function HandleRedirect(id: string, name: string) {
    router.push(`students/student/${name}?id=${id}`);
  }

  return (
    <main>
      {peddingStudents && peddingStudents.length > 0 && (
        <section className="border-4 border-light-bg-gray lg:p-3 p-2 m-auto rounded-2xl w-fit mb-5 lg:mb-10">
          <h1 className="lg:text-2xl text-xl text-primary">Új jelentkezések</h1>
          <div className="max-w-[90em] max-h-[14em]">
            <div className="flex-col lg:flex-row max-h-[14em] flex gap-3 lg:gap-7 overflow-auto touch-pan-y">
              {peddingStudents &&
                peddingStudents.map((ps) => (
                  <div
                    key={ps.id}
                    className="flex items-center gap-3 bg-light-bg-gray px-1 py-2 lg:px-3 lg:py-5 rounded-2xl border-2 border-secondary hover:border-primary transition-all duration-300"
                  >
                    <Avatar className="size-14 lg:size-20 bg-background">
                      <AvatarImage
                        src={"/defaults/default_avatar.jpg"}
                      ></AvatarImage>
                    </Avatar>
                    <div className="flex flex-col justify-between">
                      <h2 className="text-xl lg:text-2xl">{ps.studentName}</h2>
                      <h3>{ps.courseName}</h3>
                      <div className="flex justify-between w-[14em]">
                        <PeddingStudentProfile
                          id={ps.studentId}
                        ></PeddingStudentProfile>
                        <div className="flex gap-1 items-center mr-5 lg:mr-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="h-8 w-8 lg:h-10 lg:w-10 bg-linear-to-tl from-primary to-[#7CB08C]"
                                onClick={() => {
                                  HandleAcceptance(ps.id, true);
                                }}
                              >
                                <Check className="size-7 lg:size-8"></Check>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-lg">Elfogadás</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="h-8 w-8 lg:h-10 lg:w-10 bg-linear-to-tl from-[#B02929] to-[#BD6060]"
                                onClick={() => {
                                  HandleAcceptance(ps.id, false);
                                }}
                              >
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
      )}
      <div className="lg:flex-row flex-col gap-2 flex justify-between mb-10">
        <h1 className="text-3xl lg:text-5xl text-primary font-bold">
          Tanulóim
        </h1>
        <InputGroup className=" lg:max-w-[40%] shadow-2xl">
          <InputGroupInput
            type="text"
            value={searchStudent}
            onChange={(e) => {
              setSearchStudent(e.target.value.toLowerCase());
            }}
            className="lg:text-lg!"
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
        {myStudents?.tutoring
          .filter((as) => as.name.toLowerCase().includes(searchStudent))
          .map((as) => (
            <div
              key={as.studentId}
              className="relative flex border-4 rounded-2xl hover:border-secondary border-transparent transition-all duration-300 shadow-2xl"
            >
              {/* <h2 className="absolute -top-5 right-6 bg-background py-0 px-1 lg:px-2 lg:py-1 text-xs lg:text-lg rounded-2xl">
                {as.courseName}
              </h2> */}
              <img
                src={"/defaults/default_avatar.jpg"}
                alt=""
                className="h-24 w-24 lg:w-30 lg:h-30 rounded-l-2xl"
              />
              <div className="bg-light-bg-gray gap-2 lg:gap-0 px-6 w-full lg:flex-row flex-col flex lg:justify-between lg:items-center rounded-r-2xl">
                <div className="flex lg:flex-col gap-1 lg:gap-3">
                  <div>
                    <h1 className="text-md lg:text-2xl text-primary font-bold">
                      {as.name}
                    </h1>
                    <h2 className="text-xs lg:text-sm text-gray-500">
                      {as.nickname}
                    </h2>
                  </div>
                  <div className="hidden lg:flex gap-2 lg:gap-5">
                    <div className="text-xs lg:text-lg items-center flex gap-2 bg-background border-2 border-primary rounded-md w-fit h-fit p-1">
                      <Book className="size-4 lg:size-6"></Book>
                      <p className="">Kurzusok:</p>
                      <p className="font-bold">{as.courseNumber}</p>
                    </div>

                    <div className="flex gap-2 text-xs lg:text-lg items-center  bg-background border-2 border-primary rounded-md w-fit h-fit px-1 lg:px-2 py-1">
                      <HandHelping className="size-4 lg:size-6"></HandHelping>
                      <p className="hidden lg:block">Beadandók:</p>
                      <p className="font-bold">{as.ongoingHandins}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-11 w-11 lg:h-16 lg:w-16"
                        onClick={() => {
                          HandleRedirect(as.studentId, "profile");
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
                          HandleRedirect(as.chatId, "message");
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
                          HandleRedirect(as.wallId, "wall");
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
      <div className="mt-10 h-1"></div>
    </main>
  );
};

export default StudentPage;
