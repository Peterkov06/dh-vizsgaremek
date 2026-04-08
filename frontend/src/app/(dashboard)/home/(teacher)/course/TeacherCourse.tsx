import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { Plus } from "lucide-react";
import Link from "next/link";
import TeacherCourseCardOverView, {
  TeacherCourseType,
} from "../components/TeacherCourseCardOverView";

const TeacherCourse = (props: { user: User }) => {
  const dummyTeacherCourses: TeacherCourseType[] = [
    {
      id: "9b77334b-b12a-44cd-91f6-36dd7b493ad9",
      courseName: "Fullstack .NET & React Masterclass",
      avatarImg: "https://api.dicebear.com/7.x/identicon/svg?seed=dotnet",
      bannerImg:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      studentCount: 156,
      handInCount: 89,
      rating: 4.9,
    },
  ];

  return (
    <main className="flex flex-col gap-3">
      <h1 className="text-5xl font-bold text-primary">Kurzusaim</h1>

      <section className="flex flex-col gap-7">
        {dummyTeacherCourses.map((tc) => (
          <TeacherCourseCardOverView
            data={tc}
            key={tc.id}
          ></TeacherCourseCardOverView>
        ))}
        <Link href={"course/creator"}>
          <div className="flex w-full hover:scale-105 transition-all duration-300 cursor-pointer will-change-transform">
            <Button className="text-2xl w-full h-14">
              <Plus className="size-10"></Plus>Kurzus létrehozzása
            </Button>
          </div>
        </Link>
      </section>
    </main>
  );
};

export default TeacherCourse;
