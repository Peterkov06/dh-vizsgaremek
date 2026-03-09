"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { User } from "@/lib/auth";
import { DashboardModel } from "@/lib/models/homeModel";
import { TeacherDashboardModel } from "@/lib/models/teacherHome";
import {
  Bell,
  Check,
  ChevronRight,
  Folder,
  Search,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import CourseCard from "./components/CourseCard";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const TeacherHome = (props: { user: User }) => {
  const [dashboard, setDashboard] = useState<TeacherDashboardModel>();
  const [selectedTab, setSelectedTab] = useState<string>("s");
  const [files, setFiles] = useState<string[]>(["kutya", "meg a", "mája"]);
  const [searchStudent, setSearchStudent] = useState<string>("");

  async function fetchDashboard() {
    const response = await fetch("mockup/teacherHome.json")
      .then((data) => data.json())
      .then((data) => {
        setDashboard(data);
        console.log(data);
      });
  }

  useEffect(() => {
    fetchDashboard();
  }, []);
  return (
    <main className="grid grid-rows-12 h-full">
      <section className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">
          Üdv {props.user.nickname}!
        </h1>
        <div className="relative p-1 bg-linear-to-br from-primary to-secondary rounded-2xl hidden lg:block">
          <div className="w-[21em] relative flex items-center justify-between gap-3 p-2 bg-background rounded-xl">
            <h2 className="absolute top-[-16] bg-background pr-1 pl-1 font-bold text-primary">
              Értesítések
            </h2>
            <p className="text-sm">
              {dashboard?.notifications.lastUnread.courseName}-
              {dashboard?.notifications.lastUnread.text}
            </p>
            <div className="text-primary relative">
              <Bell size={35}></Bell>
              <div className="absolute top-[-5] right-[-5] flex justify-center items-center border-2 border-primary rounded-[100%] aspect-square">
                <p className="flex justify-center items-center w-5 h-5 bg-background rounded-[100%] text-center text-[0.8em]">
                  {dashboard?.notifications.unreadNotificationNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-primary relative block lg:hidden">
          <Bell size={35}></Bell>
          <div className="absolute top-[-5] right-[-5] flex justify-center items-center border-2 border-primary rounded-[100%] aspect-square">
            <p className="flex justify-center items-center w-5 h-5 bg-background rounded-[100%] text-center text-[0.8em]">
              {dashboard?.notifications.unreadNotificationNumber}
            </p>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-4 gap-3 row-span-5">
        <section className=" col-span-2">
          <div className="flex justify-between items-center w-fit lg:w-full gap-5">
            <h1 className="text-xl lg:text-2xl font-bold">Kurzusok</h1>
          </div>

          <Carousel
            opts={{
              align: "start",
            }}
            className="relative overflow-visible"
          >
            <CarouselContent className="ml-1 py-1">
              {dashboard?.activeCourses.map((ac) => (
                <CarouselItem key={ac.courseId} className="basis-1/3 p-1">
                  <CourseCard course={ac}></CourseCard>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-10] top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-[-10] top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </section>
        <section className="col-start-3 border-4 border-[#EBEDEC] p-2 gap-2 rounded-2xl mt-7 grid grid-rows-5">
          <RadioGroup
            className="grid grid-cols-2 gap-0"
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <div
              className={`border-4 border-[#EBEDEC] rounded-l-xl ${selectedTab === "s" ? "bg-background text-primary font-bold" : "bg-[#EBEDEC] text-gray-600"}`}
            >
              <RadioGroupItem
                value="s"
                className="hidden"
                id="studs"
              ></RadioGroupItem>
              <Label
                htmlFor="studs"
                className="h-full w-full flex justify-center items-center"
              >
                Tanulók
              </Label>
            </div>
            <div
              className={`flex justify-center items-center border-4 border-[#EBEDEC] rounded-r-xl ${selectedTab === "m" ? "bg-background text-primary font-bold" : "bg-[#EBEDEC] text-[#898989]"}`}
            >
              <RadioGroupItem
                value="m"
                className="hidden"
                id="money"
              ></RadioGroupItem>
              <Label
                htmlFor="money"
                className="h-full w-full flex justify-center items-center"
              >
                Pénzügyek
              </Label>
            </div>
          </RadioGroup>
          <div className="row-span-3 row-start-2">
            <h1 className="font-bold text-md">Függőben</h1>
            <div className="overflow-hidden h-[7em]">
              <div className="overflow-y-auto h-full flex flex-col gap-2">
                {dashboard?.pendingEnrollments.map((stud, i) => (
                  <div
                    className="flex bg-[#EBEDEC] p-2 rounded-xl items-center justify-between"
                    key={i}
                  >
                    <div className="flex items-center gap-1">
                      <Avatar key={i}>
                        <AvatarImage
                          src="/defaults/default_avatar.jpg"
                          alt=""
                        />
                      </Avatar>
                      <div>
                        <h2 className="text-sm font-bold truncate max-w-32">
                          {stud.userName}
                        </h2>
                        <h3 className="text-xs">{stud.courseName}</h3>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button className="h-8 w-8 bg-linear-to-tl from-primary to-[#7CB08C]">
                        <Check className="size-6"></Check>
                      </Button>
                      <Button className="h-8 w-8 bg-linear-to-tl from-[#B02929] to-[#BD6060]">
                        <X className="size-6"></X>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="row-start-5 flex justify-center">
            <Button className="h-8 w-40 flex gap-1 bg-linear-to-tl from-foreground to-[#868686]">
              <p>Összes Kérés</p>
              <ChevronRight className="size-5 m-0"></ChevronRight>
            </Button>
          </div>
        </section>
        <section className="col-start-4 grid grid-rows-5 p-2 border-4 border-[#EBEDEC] rounded-2xl mt-7">
          <div className="flex bg-[#EBEDEC] items-center gap-3 px-4 py-2 rounded-xl">
            <Folder className="size-7 text-primary"></Folder>
            <h1 className="text-xl font-bold">Munkák</h1>
          </div>
          <div className="row-span-3 overflow-hidden">
            <div className="overflow-y-auto">
              {files.map((f, i) => (
                <div key={i}>
                  <p className="text-xl">{f}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center row-start-5">
            <Button className="h-8 w-40 flex gap-1 bg-linear-to-tl from-foreground to-[#868686]">
              <p>Összes Kérés</p>
              <ChevronRight className="size-5 m-0"></ChevronRight>
            </Button>
          </div>
        </section>
      </section>
      <section className="grid grid-cols-12 gap-4 h-max row-span-5 mt-8">
        <section className=" border-4 border-[#EBEDEC] rounded-2xl col-span-3 h-56 p-2">
          <div className="flex items-center justify-between gap-2 py-1 px-3 rounded-lg bg-[#EBEDEC]">
            <div className="flex items-center gap-2">
              <Users className="text-primary"></Users>
              <h1 className="text-xl font-bold">Tanulók</h1>
            </div>
            <Button className="h-6  w-5 bg-linear-to-tl from-foreground to-[#868686]">
              <ChevronRight className="size-5 m-0"></ChevronRight>
            </Button>
          </div>
          <div className="flex items-center gap-1 bg-[#EBEDEC] p-1 rounded-lg">
            <Search size={20}></Search>
            <Input
              value={searchStudent}
              onChange={(e) => {
                setSearchStudent(e.target.value);
              }}
              className="border-none h-5 focus:border-none focus:ring"
              placeholder="Tanuló keresése..."
            ></Input>
          </div>
          <div className="overflow-hidden h-[8em]">
            <div className="overflow-y-auto h-full flex flex-col gap-2">
              {dashboard?.students.map(
                (stud, i) =>
                  stud.fullName
                    .toLocaleLowerCase()
                    .includes(searchStudent.toLowerCase()) && (
                    <div
                      className="flex bg-[#EBEDEC] p-2 rounded-xl gap-1 items-center justify-between"
                      key={i}
                    >
                      <div className="flex items-center gap-1">
                        <Avatar key={i}>
                          <AvatarImage
                            src="/defaults/default_avatar.jpg"
                            alt=""
                          />
                        </Avatar>
                        <div>
                          <h2 className="text-sm font-bold truncate max-w-26">
                            {stud.fullName}
                          </h2>
                          <h3 className="text-xs truncate max-w-26">
                            {stud.courseName}
                          </h3>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button className="bg-linear-to-tl from-primary to-[#7CB08C]">
                          Üzenet
                        </Button>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </section>
        <section className=" border-4 border-black rounded-2xl col-span-5">
          <div className="flex justify-center">
            <Users></Users>
            <h1>Tanulók</h1>
          </div>
        </section>
        <section className=" border-4 border-black rounded-2xl col-span-4">
          <div className="flex justify-center">
            <Users></Users>
            <h1>Tanulók</h1>
          </div>
        </section>
      </section>
      <section className="w-full bg-linear-to-br from-secondary to-primary h-12 rounded-2xl"></section>
    </main>
  );
};

export default TeacherHome;
