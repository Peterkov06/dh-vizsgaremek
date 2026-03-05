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
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import CourseCard from "./components/CourseCard";

const TeacherHome = (props: { user: User }) => {
  const [dashboard, setDashboard] = useState<TeacherDashboardModel>();
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
    <main className="flex flex-col">
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
      <section className="grid grid-cols-4">
        <section className=" col-span-2">
          <div className="flex justify-between items-center w-fit lg:w-full gap-5">
            <h1 className="text-xl lg:text-2xl font-bold">Kurzusok</h1>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
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
            <CarouselPrevious className="absolute left-[-20] top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-[-20] top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </section>
        <section className=" col-start-3">
          <h1>Vami</h1>
        </section>
        <section className="  col-start-4">
          <h1>Vami2</h1>
        </section>
      </section>
    </main>
  );
};

export default TeacherHome;
