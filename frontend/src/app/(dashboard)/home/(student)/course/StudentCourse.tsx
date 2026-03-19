import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import Link from "next/link";

const StudentCourse = (props: { user: User }) => {
  return (
    <main>
      <h1 className="text-4xl font-bold text-primary">Kurzusaim</h1>
    </main>
  );
};

export default StudentCourse;
