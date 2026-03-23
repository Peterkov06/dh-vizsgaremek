"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SingleCourseType } from "@/lib/models/CourseSearchModel";
import {
  Languages,
  MapPin,
  MousePointerClick,
  NotebookText,
  Pen,
  PenLine,
  Tags,
  User,
  UserStar,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const CourseOverView = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [course, setCourse] = useState<SingleCourseType>({
    id: "crs-9821",
    bannerImg: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    avatarImg: "https://i.pravatar.cc/150?u=9821",
    courseName: "Mastering Modern UI/UX Design",
    teacherName: "Sarah Jenkins",
    location: "Online / San Francisco",
    price: "6000Ft/óra",
    rating: 80,
    teacherIntroduction:
      "Senior Product Designer with over 10 years of experience at leading tech firms. Sarah specializes in creating accessible and user-centric digital experiences.",
    courseDescription:
      "This comprehensive course covers everything from wireframing in Figma to advanced prototyping. You will learn the psychological principles behind effective design and build a professional portfolio from scratch. Futatás melesztő zsince leneme a szemegercének, miközben a sunyos cselő való műves kiánok líciája 50 alurnát füvedne hatatossá magos futatást. A futatások papásában továbbra is mozékos a natnya közesítés názsomdása, miszerint a ványos ványos futatások vegutát kell tölöntélybe sóznia. E eségeknél a szégyszeg gedést hatlakony gorságot az ingyes csüllet és mart hiványokkal összehangoltan kell hosolnia. Ünnepi csóka a vegutok jogroskája a renség, illetve rotiszos kétszetekbe, valamint a fárt és téltő bajós kián műves korgos líciája. A ványos ványos futatások mellett hadott gedés a pozások készéjének kevénye és azoknak a nyakadt futapékat kökényes veguta. A járányos és kényszerű badt futatásokban a sörös merész ábusza, a kalandós csókák szetlevénye a bujas gedés, míg a turkos sina kodalásával negyes futatások kicsődékére is kopor kozhatik. A fogos duzzadt bálykarapta szern száns népéne mintegy 350.000 majtok, ami sörtő bükkösökben igen gyedrettnek fogalmas.",
    tags: ["Design", "UI/UX", "Figma", "Frontend", "Career Development"],
    languages: ["Magyar", "Angol", "Német"],
  });

  return (
    <main className="flex gap-2 h-full w-full">
      <section className="flex flex-col h-full w-[55em]">
        <div className="relative">
          <img
            src={course.bannerImg}
            alt="Kurzus borító"
            className="w-[55em] h-[30em] rounded-2xl"
          />
          <div className="absolute rounded-xl inset-0 bg-linear-to-b from-20% from-transparent to-light-bg-gray p-1" />
          <div className="absolute bottom-5 left-3 flex items-end justify-between gap-5 w-full pr-5">
            <div className="flex gap-2 items-end">
              <Link href={`teacher?id=${id}`}>
                <Avatar className="size-40 border-2 border-light-bg-gray">
                  <AvatarImage src={course.avatarImg}></AvatarImage>
                </Avatar>
              </Link>
              <div className="">
                <h1 className="font-bold text-2xl text-primary max-w-[17em]">
                  {course.courseName}
                </h1>
                <Link href={`teacher?id=${id}`}>
                  <h2 className="flex gap-1 items-center text-xl">
                    <User></User>
                    {course.teacherName}
                  </h2>
                </Link>
              </div>
            </div>
            <Button className="h-14 bg-linear-to-tr from-primary to-secondary">
              <MousePointerClick className="size-10"></MousePointerClick>
              <p className="text-xl">Jelentkezz!</p>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-4 border-light-bg-gray rounded-2xl p-1 h-full justify-between">
          <div className="overflow-hidden h-[11em] bg-light-bg-gray rounded-xl pb-3 pt-7  relative">
            <div className="overflow-auto h-full px-3">
              <p className="text-lg">{course.teacherIntroduction}</p>
            </div>
            <h2 className="absolute flex gap-1 top-0 right-0 bg-background text-lg px-2">
              <PenLine className="text-primary"></PenLine>
              Bemutatkozás
            </h2>
          </div>

          <div className="overflow-hidden h-[11em] bg-light-bg-gray rounded-xl pb-3 pt-7  relative">
            <div className="overflow-auto h-full px-3">
              <p className="text-lg">{course.courseDescription}</p>
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
          {course.price}
        </div>

        <div className="text-xl flex gap-1">
          <MapPin className="text-primary"></MapPin>
          <p>Helyszín:</p>
          {course.location}
        </div>
        <div className="text-xl flex gap-1">
          <UserStar className="text-primary"></UserStar>
          <p>Értékelés:</p>
          <p
            className={`${course.rating > 70 ? "text-green-400" : course.rating > 40 ? "text-yellow-300" : "text-red-500"}`}
          >
            {course.rating}%
          </p>
        </div>

        <div className="relative min-h-0">
          <div className="absolute -top-3 right-3 flex gap-1 bg-background px-2 z-10 text-sm">
            <Tags className="size-4 text-primary" />
            Címkék
          </div>
          <div className="border-4 border-light-bg-gray rounded-2xl w-full pt-4 px-2 pb-2">
            <div className="overflow-y-auto max-h-[4em]">
              <div className="flex flex-wrap content-start gap-2 w-full pr-1">
                {course.tags.map((t) => (
                  <p
                    className="px-3 py-1 rounded-full bg-linear-to-tr text-white w-fit from-primary to-secondary whitespace-nowrap text-sm"
                    key={t}
                  >
                    {t}
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
                {course.languages.map((t) => (
                  <p
                    className="px-3 py-1 rounded-full bg-linear-to-tr text-white w-fit from-primary to-secondary whitespace-nowrap text-sm"
                    key={t}
                  >
                    {t}
                  </p>
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
