import { Button } from "@/components/ui/button";
import { ActiveCourse } from "@/lib/models/teacherHome";
import { ChevronRightCircle, Users } from "lucide-react";
import Link from "next/link";
import AppImage from "./AppImg";

const CourseCard = (props: { course: ActiveCourse }) => {
  return (
    <div className="rounded-lg h-[15em] w-[10em] lg:w-[15em] lg:h-[18em] bg-linear-to-br from-primary to-secondary flex flex-col  text-background overflow-hidden shadow-2xl shadow-primary hover:scale-105 transition-all duration-300">
      <AppImage
        className="rounded-t-lg h-[30%] lg:h-[40%]"
        src={
          props.course.imageUrl === ""
            ? "defaults/default_course.jpg"
            : props.course.imageUrl
        }
        alt="course img"
      />
      <div className="py-2 px-3 rounded-b-lg flex flex-col justify-between flex-1 gap-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-base lg:text-xl">{props.course.courseName}</h1>
            <h2 className="text-sm flex gap-1 items-center">
              <Users></Users>
              {props.course.enrolledStudents}
            </h2>
          </div>
        </div>

        <div className={`w-full flex justify-end`}>
          <Link
            href={`/home/course/teacher/modify?id=${props.course.courseId}`}
          >
            <Button className="py-1 px-5 h-fit rounded-2xl">
              <p>A kurzusra</p>
              <ChevronRightCircle size={30}></ChevronRightCircle>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
