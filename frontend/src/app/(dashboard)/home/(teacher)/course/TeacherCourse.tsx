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
      id: "36f0bdf2-1571-4df0-9a21-b2b4b0adfa29",
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

      <Link href={"course/creator"}>
        <Button className="text-2xl h-14">
          <Plus className="size-8"></Plus>Kurzus létrehozzása
        </Button>
      </Link>

      <section className="flex flex-col gap-7">
        {dummyTeacherCourses.map((tc) => (
          <TeacherCourseCardOverView
            data={tc}
            key={tc.id}
          ></TeacherCourseCardOverView>
        ))}
      </section>
    </main>
  );
};

export default TeacherCourse;
