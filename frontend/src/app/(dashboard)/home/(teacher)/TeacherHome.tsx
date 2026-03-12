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
  BadgeCheck,
  Bell,
  Check,
  ChevronRight,
  Folder,
  Plus,
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
import { Checkbox } from "@/components/ui/checkbox";
import TodayList from "./components/TodayList";
import Example from "@/components/calendar-standard-7";
import EventCalendar from "./components/EventCalendar";
import AllList from "./components/AllList";

const TeacherHome = (props: { user: User }) => {
  const [dashboard, setDashboard] = useState<TeacherDashboardModel>();
  const [selectedTabQueue, setSelectedTabQueue] = useState<string>("students");
  const [selectedTabDate, setSelectedTabDate] = useState<string>("day");
  const [files, setFiles] = useState<string[]>(["kutya", "meg a", "mája"]);
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [formattedDate, setFormattedDate] = useState<string>("");

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
    const today = new Date();
    const formatted = today.toLocaleDateString("hu-HU", {
      month: "long",
      day: "numeric",
    });
    const capitalized = formatted.replace(/[a-záéíóöőúüű]/i, (c) =>
      c.toUpperCase(),
    );
    setFormattedDate(capitalized);
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
        <section className="col-span-2 max-w-[48em]">
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
        <section className="col-start-3 border-4 border-light-bg-gray p-2 gap-2 rounded-2xl mt-7 grid grid-rows-6">
          <RadioGroup
            className="grid grid-cols-2 gap-0"
            value={selectedTabQueue}
            onValueChange={setSelectedTabQueue}
          >
            <div
              className={`border-4 border-light-bg-gray rounded-l-xl ${selectedTabQueue === "students" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
            >
              <RadioGroupItem
                value="students"
                className="hidden"
                id="studs"
              ></RadioGroupItem>
              <Label
                htmlFor="studs"
                className="h-full w-full flex justify-center items-center text-lg"
              >
                Tanulók
              </Label>
            </div>
            <div
              className={`border-4 border-light-bg-gray rounded-r-xl ${selectedTabQueue === "money" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
            >
              <RadioGroupItem
                value="money"
                className="hidden"
                id="money"
              ></RadioGroupItem>
              <Label
                htmlFor="money"
                className="h-full w-full flex justify-center items-center text-lg"
              >
                Pénzügyek
              </Label>
            </div>
          </RadioGroup>
          <div className="row-span-4 row-start-2 flex flex-col justify-between">
            <h1 className="font-bold text-md">Függőben</h1>
            <div className="overflow-hidden h-[10em]">
              <div className="overflow-y-auto h-full flex flex-col gap-2">
                {dashboard?.pendingEnrollments.map((stud, i) => (
                  <div
                    className="flex bg-light-bg-gray p-2 rounded-xl items-center justify-between"
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
                        <h2 className="text-sm font-bold truncate max-w-46">
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
          <div className="row-start-6 flex justify-center items-center">
            <Button className="h-8 w-40 flex gap-1 bg-linear-to-tl from-foreground to-[#868686]">
              <p>Összes Kérés</p>
              <ChevronRight className="size-5 m-0"></ChevronRight>
            </Button>
          </div>
        </section>
        <section className="col-start-4 grid grid-rows-5 p-2 border-4 border-light-bg-gray rounded-2xl mt-7">
          <div className="flex bg-light-bg-gray items-center gap-3 px-4 py-2 rounded-xl">
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
      <section className="grid grid-cols-12 gap-4 h-max row-span-5 mt-2">
        <section className=" border-4 border-light-bg-gray rounded-2xl col-span-3 p-2 flex flex-col gap-2">
          <div className="flex items-center gap-2 py-1 px-3 rounded-lg bg-light-bg-gray">
            <Users className="text-primary"></Users>
            <h1 className="text-xl font-bold">Tanulók</h1>
          </div>
          <div className="flex items-center gap-1 bg-light-bg-gray p-1 rounded-lg">
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
          <div className="overflow-hidden h-[10em]">
            <div className="overflow-y-auto h-full flex flex-col gap-2">
              {dashboard?.students.map(
                (stud, i) =>
                  stud.fullName
                    .toLocaleLowerCase()
                    .includes(searchStudent.toLowerCase()) && (
                    <div
                      className="flex bg-light-bg-gray p-2 rounded-xl gap-1 items-center justify-between"
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
                          <h2 className="text-sm font-bold truncate max-w-46">
                            {stud.fullName}
                          </h2>
                          <h3 className="text-xs truncate max-w-40">
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
          <div className="flex justify-center items-center mt-3">
            <Button className="h-8 w-40 flex gap-1 bg-linear-to-tl from-foreground to-[#868686]">
              <p>Összes tanuló</p>
              <ChevronRight className="size-5 m-0"></ChevronRight>
            </Button>
          </div>
        </section>
        <section className=" border-4 border-light-bg-gray rounded-2xl col-span-5 p-2 flex flex-col gap-2">
          <div className="flex items-center gap-2 py-1 px-3 rounded-lg bg-light-bg-gray">
            <BadgeCheck className="text-primary"></BadgeCheck>
            <h1 className="text-xl font-bold">Teendők</h1>
          </div>
          <div className="overflow-hidden h-[12em]">
            <div className="overflow-y-auto h-full flex flex-col gap-2">
              {dashboard?.gradingQueue.map((gq) => (
                <div
                  className="flex items-center justify-between px-5"
                  key={gq.courseId}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox className="border-2 border-gray-400 size-5"></Checkbox>
                    <div>
                      <p>
                        {gq.studentName} - {gq.handInTitle}
                      </p>
                      <p className="text-xs">{gq.courseName}</p>
                    </div>
                  </div>
                  <p>{gq.submittedDate}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-evenly mt-3">
            <Button className="h-8 w-40 flex gap-1 bg-linear-to-tl from-foreground to-[#868686]">
              <p>Összes teendő</p>
              <ChevronRight className="size-5 m-0"></ChevronRight>
            </Button>
            <Button className="h-8 w-40 flex gap-1 bg-linear-to-tl from-primary to-secondary">
              <Plus className="size-5 m-0"></Plus>
              <p>Új teendő</p>
            </Button>
          </div>
        </section>
        <section className="border-4 border-light-bg-gray rounded-2xl p-2 col-span-4">
          <RadioGroup
            className="grid grid-cols-3 gap-0 "
            value={selectedTabDate}
            onValueChange={setSelectedTabDate}
          >
            <div
              className={`border-4 border-light-bg-gray rounded-l-xl py-1  ${selectedTabDate === "calendar" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
            >
              <RadioGroupItem
                value="calendar"
                className="hidden"
                id="calendar"
              ></RadioGroupItem>
              <Label
                htmlFor="calendar"
                className="h-full w-full flex justify-center items-center text-lg"
              >
                Naptár
              </Label>
            </div>
            <div
              className={`border-4 border-light-bg-gray rounded-l-xl ${selectedTabDate === "day" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
            >
              <RadioGroupItem
                value="day"
                className="hidden"
                id="day"
              ></RadioGroupItem>
              <Label
                htmlFor="day"
                className="h-full w-full flex justify-center items-center text-lg"
              >
                Nap
              </Label>
            </div>
            <div
              className={`flex justify-center items-center border-4 border-light-bg-gray rounded-r-xl ${selectedTabDate === "list" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
            >
              <RadioGroupItem
                value="list"
                className="hidden"
                id="list"
              ></RadioGroupItem>
              <Label
                htmlFor="list"
                className="h-full w-full flex justify-center items-center text-lg"
              >
                Lista
              </Label>
            </div>
          </RadioGroup>
          <div className="flex flex-col gap-3">
            {selectedTabDate === "calendar" ? (
              <div className="flex justify-center mt-3">
                <EventCalendar
                  key={"fsjknjkfvnbjkfn"}
                  upcomingEvents={dashboard?.upcomingEvents}
                ></EventCalendar>
              </div>
            ) : selectedTabDate === "day" ? (
              <TodayList
                key={"fsjknjkfvnbjksdojsdnvuinjfn"}
                date={formattedDate}
                upcomingEvents={dashboard?.upcomingEvents}
              ></TodayList>
            ) : (
              <AllList upcomingEvents={dashboard?.upcomingEvents}></AllList>
            )}
          </div>
          {selectedTabDate !== "calendar" && (
            <div className="flex justify-center mt-2">
              <Button className="h-8 w-40 flex gap-1 bg-linear-to-tl from-primary to-secondary">
                <Plus className="size-5 m-0"></Plus>
                <p>Új esemény</p>
              </Button>
            </div>
          )}
        </section>
      </section>
      <section className="w-full flex items-center bg-linear-to-br from-secondary to-primary h-12 rounded-2xl relative justify-between px-10">
        <img
          src="/imgs/megaphone.png"
          alt="megaphone"
          className="size-20 absolute left-10 top-[-15]"
        />
        <p className="text-2xl text-white ml-40">
          Keresd meg a számodra megfelelő kurzusokat vagy hozd létre a
          sajátodat!
        </p>
        <Button className="h-8 w-40 flex gap-1 bg-background text-primary">
          <Plus className="size-5 m-0"></Plus>
          <p className="text-xl">Új teendő</p>
        </Button>
      </section>
    </main>
  );
};

export default TeacherHome;
