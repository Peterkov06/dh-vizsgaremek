"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { DashboardModel } from "@/lib/models/homeModel";
import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import CourseCard from "./components/CourseCard";

const StudentHome = (props: { user: User }) => {
  const [dashboard, setDashboard] = useState<DashboardModel>();
  const [isActive, setIsActive] = useState<boolean>();

  async function fetchDashboard() {
    const response = await fetch("mockup/studentHome.json")
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
    <main className="h-full flex flex-col gap-10">
      <section className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">
          Üdv {props.user.nickname}!
        </h1>
        <div className="relative p-1 bg-linear-to-br from-primary to-secondary rounded-2xl">
          <div className="w-[21em] relative flex items-center justify-between gap-3 p-5 bg-background rounded-xl">
            <h2 className="absolute top-[-16] bg-background pr-1 pl-1 font-bold text-primary">
              Értesítések
            </h2>
            <p>
              {dashboard?.notifications.lastUnread.courseName}-
              {dashboard?.notifications.lastUnread.text}
            </p>
            <div className="text-primary relative">
              <Bell size={35}></Bell>
              <div className="absolute top-[-10] right-[-10] flex justify-center items-center border-2 border-primary rounded-[100%] aspect-square">
                <p className="flex justify-center items-center w-5 h-5 bg-background rounded-[100%] text-center text-[0.8em]">
                  {dashboard?.notifications.unreadNotificationNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex justify-between gap-10">
        <section className="w-full flex gap-2 flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Felvett kurzusok</h1>
            <div className="flex gap-3">
              <Button
                className={`px-10 h-6 rounded-4xl border-2 hover:border-transparent!  hover:bg-foreground/80 hover:text-background border-foreground ${isActive ? "bg-background  text-foreground" : "bg-foreground"}`}
                onClick={() => {
                  setIsActive((prev) => !prev);
                }}
              >
                Aktív
              </Button>
              <Button
                className={`px-10 h-6 rounded-4xl border-2 hover:border-transparent! hover:bg-foreground/80 hover:text-background  border-foreground ${!isActive ? "bg-background  text-foreground" : "bg-foreground"}`}
                onClick={() => {
                  setIsActive((prev) => !prev);
                }}
              >
                Teljesített
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            {dashboard?.attendedCourses.active.map((c) => (
              <CourseCard course={c} key={c.courseId}></CourseCard>
            ))}
          </div>
        </section>
        <section className="w-[35em]">
          <h1 className="text-2xl font-bold">Közelgő események</h1>
        </section>
      </section>
      <section></section>
    </main>
  );
};

export default StudentHome;
