"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { DashboardModel } from "@/lib/models/homeModel";
import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import CourseCard from "./components/CourseCard";
import UpcomingCard from "./components/UpcomingCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import fetchWithAuth from "@/lib/api-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotificationType } from "../(routes)/notifications/page";
import AppImage from "../(teacher)/components/AppImg";

const StudentHome = (props: { user: User }) => {
  const [dashboard, setDashboard] = useState<DashboardModel>();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isActiveTeachers, setIsActiveTeachers] = useState<boolean>(false);

  async function fetchDashboard() {
    // const response = await fetch("mockup/studentHome.json")
    //   .then((data) => data.json())
    //   .then((data) => {
    //     setDashboard(data);
    //     console.log(data);
    //   });
    await fetchWithAuth("/api/pages/student/homepage")
      .then((data) => data.json())
      .then((data) => {
        setDashboard(data);
        console.log(data);
      });
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!dashboard) return <main>Itt</main>;

  return (
    <main className="h-full flex flex-col justify-between pb-10 gap-10 lg:gap-7  lg:overflow-x-visible">
      <section className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">
          Üdv {props.user.nickname}!
        </h1>
        <Link
          href={"home/notifications"}
          className="relative p-1 bg-linear-to-br from-primary to-secondary rounded-2xl hidden lg:block"
        >
          <div className="w-[21em] relative flex items-center justify-between gap-3 p-2 bg-background rounded-xl">
            <h2 className="absolute top-[-16] bg-background pr-1 pl-1 font-bold text-primary">
              Értesítések
            </h2>
            <div className="text-sm">
              {dashboard?.notifications.lastUnread ? (
                <p>
                  {NotificationType[
                    dashboard?.notifications.lastUnread
                      ?.firstText as keyof typeof NotificationType
                  ] ?? dashboard?.notifications.lastUnread?.firstText}
                  -{dashboard?.notifications.lastUnread?.secondText}
                </p>
              ) : (
                <p>Nincs új értesítésed</p>
              )}
            </div>
            <div className="text-primary relative">
              <Bell size={35}></Bell>
              <div className="absolute top-[-5] right-[-5] flex justify-center items-center border-2 border-primary rounded-[100%] aspect-square">
                <p className="flex justify-center items-center w-5 h-5 bg-background rounded-[100%] text-center text-[0.8em]">
                  {dashboard?.notifications?.unreadNotificationNumber}
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href={"home/notifications"}
          className="text-primary relative block lg:hidden"
        >
          <Bell size={35}></Bell>
          <div className="absolute top-[-5] right-[-5] flex justify-center items-center border-2 border-primary rounded-[100%] aspect-square">
            <p className="flex justify-center items-center w-5 h-5 bg-background rounded-[100%] text-center text-[0.8em]">
              {dashboard?.notifications.unreadNotificationNumber}
            </p>
          </div>
        </Link>
      </section>
      <section className="flex justify-between gap-10 flex-col flex-1 h-fit lg:flex-row">
        <section className="w-fit flex-1 flex gap-2 flex-col">
          <div className="flex justify-between items-center w-fit lg:w-full gap-5">
            <h1 className="text-xl lg:text-2xl font-bold">Felvett kurzusok</h1>
            <div className="flex gap-3">
              <Button
                className={`px-4 lg:px-10 h-6 rounded-4xl border-2 hover:border-transparent!  hover:bg-foreground/80 hover:text-background border-foreground ${isActive ? "bg-background  text-foreground" : "bg-foreground"}`}
                onClick={() => {
                  setIsActive((prev) => !prev);
                }}
              >
                Aktív
              </Button>
              <Button
                className={`px-4 lg:px-10 h-6 rounded-4xl border-2 hover:border-transparent! hover:bg-foreground/80 hover:text-background  border-foreground ${!isActive ? "bg-background  text-foreground" : "bg-foreground"}`}
                onClick={() => {
                  setIsActive((prev) => !prev);
                }}
              >
                Függőben
              </Button>
            </div>
          </div>
          <div className="overflow-x-hidden">
            <div className="hidden lg:flex justify-between gap-5 lg:h-full overflow-auto p-5">
              {!isActive ? (
                dashboard?.attendedCourses.active.length > 0 ? (
                  dashboard?.attendedCourses.active
                    .slice(0, 3)
                    .map((c) => (
                      <CourseCard course={c} key={c.courseId}></CourseCard>
                    ))
                ) : (
                  <p className="text-2xl text-primary">
                    Nincs felvett kurzusod
                  </p>
                )
              ) : dashboard?.attendedCourses.inactive.length > 0 ? (
                dashboard?.attendedCourses.inactive
                  .slice(0, 3)
                  .map((c) => (
                    <CourseCard course={c} key={c.courseId}></CourseCard>
                  ))
              ) : (
                <p className="text-2xl text-primary">
                  Nincs teljesített kurzusod
                </p>
              )}
            </div>
          </div>
          <Carousel
            className="block lg:hidden m-auto w-60"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselPrevious></CarouselPrevious>
            <CarouselContent>
              {dashboard?.attendedCourses.active.map((c) => (
                <CarouselItem key={c.courseId} className="basis-1/1">
                  <CourseCard course={c} key={c.courseId}></CourseCard>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext></CarouselNext>
          </Carousel>
        </section>
        <section className="w-[23em] lg:w-[35em] flex flex-col gap-5">
          <h1 className="text-2xl font-bold">Közelgő események</h1>
          <div className="flex flex-col gap-5">
            {dashboard?.upcomingEvents.length > 0 ? (
              dashboard?.upcomingEvents
                .slice(0, 7)
                .map((ue, i) => (
                  <UpcomingCard key={i} event={ue}></UpcomingCard>
                ))
            ) : (
              <p className="text-2xl text-primary">Nincs közelgő esemény</p>
            )}
          </div>
        </section>
      </section>
      <section className="bg-light-bg-gray relative flex flex-col gap-2 items-center py-3 px-20 h-fit rounded-2xl shadow-2xl">
        <h1 className="absolute bg-background px-2 lg:px-5 py-1 lg:py-2 text-md lg:text-xl right-3 lg:right-10 top-[-20] font-bold rounded-2xl">
          Népszerű kurzusok
        </h1>
        {/* <div className="flex gap-2">
          <Button
            className={`h-2 lg:px-5 lg:h-6 rounded-lg border-2 hover:border-transparent!  hover:bg-foreground/80 hover:text-background border-foreground ${isActiveTeachers ? "bg-background  text-foreground" : "bg-foreground"}`}
            onClick={() => {
              setIsActiveTeachers((prev) => !prev);
            }}
          >
            Ösvények
          </Button>
          <Button
            className={`h-2 lg:px-5 lg:h-6 rounded-lg border-2 hover:border-transparent! hover:bg-foreground/80 hover:text-background  border-foreground ${!isActiveTeachers ? "bg-background  text-foreground" : "bg-foreground"}`}
            onClick={() => {
              setIsActiveTeachers((prev) => !prev);
            }}
          >
            Tanárok
          </Button>
        </div> */}
        <Carousel
          className="w-full rounded-2xl"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {dashboard?.popularCourses.map((pc, i) => (
              <CarouselItem className="basis-1/1 lg:basis-1/4" key={i}>
                <Link href={`home/search/course?id=${pc.courseId}`}>
                  <div className="relative flex group">
                    <div className="relative rounded-2xl">
                      <AppImage
                        className=" h-[7em] lg:h-[9em] w-[23em] rounded-2xl"
                        src={pc.courseBannerURL}
                      ></AppImage>
                      <div className="absolute rounded-2xl inset-0 bg-linear-to-b from-30% from-transparent to-[#E5E3E3] p-1" />
                    </div>
                    <div className="absolute z-20 text-primary bottom-3  flex text-sm justify-between w-full px-3 transition-all duration-300 group-hover:-translate-y-25 group-hover:text-white">
                      <p className="truncate max-w-[7em] lg:max-w-[17em]">
                        {pc.courseName}
                      </p>
                      <p>{pc.lessonPrice.amount} FT</p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious></CarouselPrevious>
          <CarouselNext></CarouselNext>
        </Carousel>
      </section>
    </main>
  );
};

export default StudentHome;
