import { Button } from "@/components/ui/button";
import { ActiveCourse } from "@/lib/models/teacherHome";
import { ChevronRightCircle } from "lucide-react";
import Link from "next/link";

const CourseCard = (props: { course: ActiveCourse }) => {
  return (
    <div className="rounded-lg w-[15em] h-[18em] bg-linear-to-br from-primary to-secondary flex flex-col  text-background overflow-hidden shadow-2xl shadow-primary hover:scale-105 transition-all duration-300">
      <img
        className="rounded-t-lg h-[50%]"
        src={
          props.course.imageUrl === ""
            ? "defaults/default_course.jpg"
            : props.course.imageUrl
        }
        alt="course img"
      />
      <div className="py-2 px-3 rounded-b-lg flex flex-col justify-between flex-1 gap-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl">{props.course.courseName}</h1>
            <h2 className="text-sm">{props.course.enrolledStudents}</h2>
          </div>
        </div>

        <div className={`w-full hidden lg:flex justify-end`}>
          <Link href={`/home/course?id=${props.course.courseId}`}>
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
