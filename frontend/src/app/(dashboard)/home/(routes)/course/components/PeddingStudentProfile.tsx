"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleUserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { StudentProfileType } from "../../students/student/components/StudentPageSidebar";

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

const PeddingStudentProfile = (props: { id: string }) => {
  const [student, setStudent] = useState<StudentProfileType>();

  useEffect(() => {
    fetch(`/api/identity/profile/${props.id}`)
      .then((res) => res.json())
      .then((res) => setStudent(res));
  }, []);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-8 w-8 lg:h-10 lg:w-10">
              <CircleUserRound className="size-5 lg:size-6"></CircleUserRound>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-fit lg:max-w-none!">
            <DialogHeader>
              <DialogTitle className="text-2xl lg:text-4xl">Profil</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 lg:gap-5">
              <section className="w-fit flex flex-col gap-5">
                <div className="bg-secondary rounded-2xl w-full lg:h-30 flex items-center py-2 px-2 lg:px-5 gap-5">
                  <Avatar className="size-16 lg:size-24 bg-background">
                    <AvatarImage src={student?.profilePictureUrl}></AvatarImage>
                  </Avatar>
                  <div>
                    <h1 className="text-xl lg:text-3xl text-primary font-bold">
                      {student?.fullName}
                    </h1>
                    <h2 className="text-md lg:text-xl text-gray-500">
                      {student?.nickname}
                    </h2>
                  </div>
                </div>
                <div className="bg-secondary rounded-2xl  lg:w-full flex gap-2 flex-col p-4">
                  <h1 className="text-xl lg:text-2xl text-primary">
                    Bemutatkozás
                  </h1>
                  <div className="overflow-hidden w-[16em] lg:w-[40em] max-h-[10em]">
                    <p className="lg:text-lg overflow-auto h-full">
                      {student?.introduction}
                    </p>
                  </div>
                </div>
              </section>
              <section className="w-[18em] lg:w-full bg-light-bg-gray rounded-2xl p-2 px-3 lg:p-5 flex flex-col gap-5 h-fit">
                <div className="flex justify-between items-center">
                  <h2 className="lg:text-xl text-primary">Életkor:</h2>
                  <h2 className="lg:text-xl text-primary font-bold">
                    {student?.age}
                  </h2>
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="lg:text-xl text-primary">Lakhely:</h2>
                  <h2 className="lg:text-xl text-primary font-bold text-end">
                    {student?.location}
                  </h2>
                </div>
                {/* <div className="flex justify-between gap-3">
                  <h2 className="lg:text-xl text-primary">Preferenciák:</h2>
                  <div className="flex gap-1 lg:gap-2 overflow-auto max-w-[10em] lg:max-w-[25em]">
                    {student.preferences.map((pref, id) => (
                      <div
                        key={id}
                        className="bg-background h-fit shrink-0 p-1 lg:px-2 rounded-lg border-2 border-primary text-xs lg:text-base"
                      >
                        {pref}
                      </div>
                    ))}
                  </div>
                </div> */}
              </section>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>
                  <X></X> Bezárás
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-lg">Profil</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default PeddingStudentProfile;
