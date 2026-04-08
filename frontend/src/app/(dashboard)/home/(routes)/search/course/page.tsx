"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CourseDetail, CourseReview } from "@/lib/models/CourseSearchModel";
import {
  CirclePercent,
  Languages,
  MapPin,
  MousePointerClick,
  NotebookText,
  Pen,
  PenLine,
  Star,
  Tags,
  User,
  UserStar,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CourseReviewCard from "../components/CourseReviewCard";
import { toast } from "sonner";
import fetchWithAuth from "@/lib/api-client";

const CourseOverView = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [course, setCourse] = useState<CourseDetail>();

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((res) => res.json())
      .then((res) => setCourse(res));
  }, []);

  const HandleRegister = async () => {
    const res = await fetchWithAuth("/api/tutoring/enrollment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId: id, status: 1, tokenCount: 1 }),
    });

    if (res.ok) toast.success("Jelentkezésedet elküldtük!");
    else toast.error("Hiba történt");
  };
  return (
    <main className="lg:flex gap-2 h-full w-full">
      <section className="flex flex-col gap-2 h-full lg:w-[55em]">
        <div className="relative">
          <img
            src={course?.bannerImage || "/defaults/default_course.jpg"}
            alt="Kurzus borító"
            className="h-[14em] lg:w-[55em] lg:h-[30em] rounded-2xl"
          />
          <div className="absolute rounded-xl inset-0 bg-linear-to-b from-20% from-transparent to-light-bg-gray p-1" />

          {course?.firstConsultationFree && (
            <div className="flex absolute -top-5 -right-3 bg-linear-to-tr from-red-800 to-red-500  text-lg py-1 px-2 rounded-2xl text-background items-center gap-2">
              <CirclePercent className="size-7"></CirclePercent>
              <p>Az első óra ingyenes !!!</p>
            </div>
          )}
          <div className="absolute bottom-5 left-3 flex items-end justify-between gap-5 w-full pr-5">
            <div className="flex gap-2 items-end">
              <Link
                href={`teacher?id=${course?.teacherId}`}
                className="hover:scale-110 transition-all duration-300"
              >
                <Avatar className="size-20 lg:size-40 border-2 border-light-bg-gray">
                  <AvatarImage
                    src={course?.teacherImage || "/defaults/default_avatar.jpg"}
                  ></AvatarImage>
                </Avatar>
              </Link>
              <div className="">
                <h1 className="font-bold text-lg lg:text-2xl text-primary max-w-[17em]">
                  {course?.courseName}
                </h1>
                <Link
                  href={`teacher?id=${course?.teacherId}`}
                  className="hover:text-primary transition-all duration-500"
                >
                  <h2 className="flex gap-1 items-center text-base lg:text-xl">
                    <User></User>
                    {course?.teacherName}
                  </h2>
                </Link>
              </div>
            </div>
            <Button
              className="hidden lg:block h-14 relative bg-linear-to-tr from-primary to-secondary overflow-hidden group/btn transition-all duration-300"
              onClick={HandleRegister}
            >
              <span className="absolute inset-0 bg-linear-to-bl from-primary to-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center">
                <MousePointerClick className="size-10"></MousePointerClick>
                <p className="text-xl">Jelentkezz!</p>
              </div>
            </Button>
          </div>
        </div>
        <Button
          className="lg:hidden h-14 relative bg-linear-to-tr from-primary to-secondary overflow-hidden group/btn transition-all duration-300"
          onClick={HandleRegister}
        >
          <span className="absolute inset-0 bg-linear-to-bl from-primary to-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-center">
            <MousePointerClick className="size-10"></MousePointerClick>
            <p className="text-xl">Jelentkezz!</p>
          </div>
        </Button>
        <div className="grid grid-rows-2 grid-cols-1 gap-2 w-full border-4 border-light-bg-gray rounded-2xl p-1 mb-2 h-full justify-between">
          <div className="overflow-hidden row-start-1 flex-1 bg-light-bg-gray rounded-xl pb-3 pt-7  relative">
            <div className="overflow-auto h-full px-3">
              <p className="text-lg">{course?.description}</p>
            </div>
            <h2 className="absolute flex gap-1 top-0 right-0 bg-background text-lg px-2">
              <PenLine className="text-primary"></PenLine>
              Bemutatkozás
            </h2>
          </div>

          <div className="overflow-hidden row-start-2 bg-light-bg-gray rounded-xl pb-3 pt-7  relative">
            <div className="overflow-auto h-full px-3">
              <p className="text-lg">{course?.description}</p>
            </div>
            <h2 className="absolute flex gap-1 top-0 right-0 bg-background text-lg px-2">
              <NotebookText className="text-primary"></NotebookText>
              Kurzus leírása
            </h2>
          </div>
        </div>
      </section>
      <section className="flex-1 flex flex-col gap-3 border-4 border-light-bg-gray rounded-2xl p-2">
        <div className="text-xl flex gap-1">
          <Wallet className="text-primary"></Wallet>
          <p>Ár:</p>
          {course?.price}
          {course?.currency.currencySymbol}
        </div>

        <div className="text-xl flex gap-1">
          <MapPin className="text-primary"></MapPin>
          <p>Helyszín:</p>
          {course?.teacherLocation}
        </div>
        <div className="text-xl flex gap-1">
          <UserStar className="text-primary"></UserStar>
          <p>Értékelés:</p>
          {/* <p
            className={`${course? > 70 ? "text-green-400" : course.rating > 40 ? "text-yellow-300" : "text-red-500"}`}
          > */}
          <p>{course?.ratingAverage}</p>
        </div>

        <div className="relative min-h-0">
          <div className="absolute -top-3 right-3 flex gap-1 bg-background px-2 z-10 text-sm">
            <Tags className="size-4 text-primary" />
            Címkék
          </div>
          <div className="border-4 border-light-bg-gray rounded-2xl w-full pt-4 px-2 pb-2">
            <div className="overflow-y-auto max-h-[4em]">
              <div className="flex flex-wrap content-start gap-2 w-full pr-1">
                {course?.tags.map((t) => (
                  <p
                    className="px-3 py-1 rounded-full bg-linear-to-tr text-white w-fit from-primary to-secondary whitespace-nowrap text-sm"
                    key={t.id}
                  >
                    {t.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-0 ">
          <div className="absolute -top-3 right-3 flex gap-1 bg-background px-2 z-10 text-sm">
            <Languages className="size-4 text-primary" />
            Nyelvek
          </div>
          <div className="border-4 border-light-bg-gray rounded-2xl w-full pt-4 px-2 pb-2">
            <div className="overflow-y-auto max-h-[4em]">
              <div className="flex flex-wrap content-start gap-2 w-full pr-1">
                {course?.languages.map((t) => (
                  <p
                    className="px-3 py-1 rounded-full bg-linear-to-tr text-white w-fit from-primary to-secondary whitespace-nowrap text-sm"
                    key={t.id}
                  >
                    {t.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <div className="absolute -top-3 right-3 flex gap-1 bg-background px-2 z-10 text-sm">
            <Star className="size-4 text-primary" />
            Értékelések
          </div>
          <div className="border-4 border-light-bg-gray rounded-2xl pt-4 px-2 pb-2">
            <div className="overflow-y-auto max-h-[32em]">
              <div className="flex flex-col content-start gap-4 w-full pr-1">
                {course && course?.reviews.length > 1 ? (
                  course?.reviews.map((r) => (
                    <CourseReviewCard key={r.id} review={r}></CourseReviewCard>
                  ))
                ) : (
                  <div className="text-xl text-primary font-bold">
                    Nincs értékelés!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="lg:hidden h-5"></div>
    </main>
  );
};

export default CourseOverView;
