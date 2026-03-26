import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import Link from "next/link";

const TeacherCourse = (props: { user: User }) => {
  return (
    <main>
      <h1 className="text-4xl font-bold text-primary">Kurzusaim</h1>

      <Link href={"course/creator"}>
        <Button>Kurzus létrehozzása</Button>
      </Link>
    </main>
  );
};

export default TeacherCourse;
