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

const CourseOverView = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [course, setCourse] = useState<CourseDetail>();

  const dummyReviews: CourseReview[] = [
    {
      id: "72a1b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o",
      courseId: "course-101",
      reviewerName: "Alex Johnson",
      reviewerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      recommended: true,
      text: "The explanations were crystal clear and the hands-on projects really helped solidify my understanding. Highly recommend!",
      reviewScore: 5,
    },
    {
      id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      courseId: "course-101",
      reviewerName: "Sarah Miller",
      reviewerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      recommended: true,
      text: "Great content, though the pace was a bit fast in the middle sections. Overall a solid learning experience.",
      reviewScore: 4,
    },
    {
      id: "b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6",
      courseId: "course-202",
      reviewerName: "Jordan Smith",
      reviewerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      recommended: false,
      text: "The audio quality was a bit inconsistent, and I felt some of the advanced topics were skipped over too quickly.",
      reviewScore: 2,
    },
    {
      id: "e4a1b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o",
      courseId: "course-101",
      reviewerName: "Emma Watson",
      reviewerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      recommended: true,
      text: "The instructor's real-world examples made complex architectural patterns much easier to grasp. I've already started applying these concepts at work!",
      reviewScore: 5,
    },
    {
      id: "f9b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      courseId: "course-101",
      reviewerName: "Liam Neeson",
      reviewerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
      recommended: false,
      text: "I found the pace a bit too slow in the beginning. The first three modules could have been condensed into one. Good content, but needs better editing.",
      reviewScore: 3,
    },
    {
      id: "a7c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
      courseId: "course-305",
      reviewerName: "Sophia Rodriguez",
      reviewerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      recommended: true,
      text: "Absolutely phenomenal! Best course on the platform. The community Discord is also very active and helpful.",
      reviewScore: 5,
    },
    {
      id: "d2e4f5g6-h7i8-j9k0-l1m2-n3o4p5q6r7s8",
      courseId: "course-202",
      reviewerName: "Marcus Thorne",
      reviewerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      recommended: false,
      text: "The code samples in the third chapter are outdated and don't run with the latest version of the framework. Frustrating for beginners.",
      reviewScore: 1,
    },
    {
      id: "c8d9e0f1-a2b3-c4d5-e6f7-g8h9i0j1k2l3",
      courseId: "course-101",
      reviewerName: "Chloe Zhang",
      reviewerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe",
      recommended: true,
      text: "Solid 4 stars. It covers everything promised, but I wish there were more downloadable resources like cheat sheets or PDFs.",
      reviewScore: 4,
    },
    {
      id: "b5a6c7d8-e9f0-g1h2-i3j4-k5l6m7n8o9p0",
      courseId: "course-404",
      reviewerName: "David Miller",
      reviewerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      recommended: true,
      text: "Short, sweet, and to the point. Exactly what I needed to get up to speed with the new API changes over the weekend.",
      reviewScore: 5,
    },
  ];
  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((res) => res.json())
      .then((res) => setCourse(res));
  }, []);

  const HandleRegister = () => {
    toast.success("Jelentkezésedet elküldtük!");
  };
  return (
    <main className="flex gap-2 h-full w-full">
      <section className="flex flex-col h-full w-[55em]">
        <div className="relative">
          <img
            src={course?.bannerImage || "/defaults/default_course.jpg"}
            alt="Kurzus borító"
            className="w-[55em] h-[30em] rounded-2xl"
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
                href={`teacher?id=${id}`}
                className="hover:scale-110 transition-all duration-300"
              >
                <Avatar className="size-40 border-2 border-light-bg-gray">
                  <AvatarImage
                    src={course?.teacherImage || "/defaults/default_avatar.jpg"}
                  ></AvatarImage>
                </Avatar>
              </Link>
              <div className="">
                <h1 className="font-bold text-2xl text-primary max-w-[17em]">
                  {course?.courseName}
                </h1>
                <Link
                  href={`teacher?id=${id}`}
                  className="hover:text-primary transition-all duration-500"
                >
                  <h2 className="flex gap-1 items-center text-xl">
                    <User></User>
                    {course?.teacherName}
                  </h2>
                </Link>
              </div>
            </div>
            <Button
              className="h-14 relative bg-linear-to-tr from-primary to-secondary overflow-hidden group/btn transition-all duration-300"
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
        <div className="flex flex-col gap-2 border-4 border-light-bg-gray rounded-2xl p-1 h-full justify-between">
          <div className="overflow-hidden h-[11em] bg-light-bg-gray rounded-xl pb-3 pt-7  relative">
            <div className="overflow-auto h-full px-3">
              <p className="text-lg">{course?.description}</p>
            </div>
            <h2 className="absolute flex gap-1 top-0 right-0 bg-background text-lg px-2">
              <PenLine className="text-primary"></PenLine>
              Bemutatkozás
            </h2>
          </div>

          <div className="overflow-hidden h-[11em] bg-light-bg-gray rounded-xl pb-3 pt-7  relative">
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
                {dummyReviews.map((r) => (
                  <CourseReviewCard key={r.id} review={r}></CourseReviewCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseOverView;
