import getCurrentUser from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentHome from "./(student)/StudentHome";
import TeacherHome from "./teacher/TeacherHome";

const page = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  switch (user.role) {
    case "Student":
      return <StudentHome user={user} />;
    case "Teacher":
      return <TeacherHome user={user} />;
    default:
      redirect("/login");
  }
};

export default page;
