import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { Plus } from "lucide-react";
import Link from "next/link";

const TeacherCourse = (props: { user: User }) => {
  return (
    <main>
      <h1 className="text-5xl font-bold text-primary">Kurzusaim</h1>

      <Link href={"course/creator"}>
        <Button className="text-2xl h-14">
          <Plus className="size-8"></Plus>Kurzus létrehozzása
        </Button>
      </Link>

      <section></section>
    </main>
  );
};

export default TeacherCourse;
