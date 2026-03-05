import getCurrentUser from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import StudentCourse from "../../(student)/course/StudentCourse";
import TeacherCourse from "../../(teacher)/course/TeacherCourse";

const Courses = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  switch (user.role) {
    case "Student":
      return <StudentCourse user={user} />;
    case "Teacher":
      return <TeacherCourse user={user} />;
    default:
      redirect("/login");
  }
};

export default Courses;
