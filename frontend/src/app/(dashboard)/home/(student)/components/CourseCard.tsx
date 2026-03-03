import { Button } from "@/components/ui/button";
import { ActiveCourse } from "@/lib/models/homeModel";
import { ChevronRightCircle } from "lucide-react";
import Link from "next/link";

const CourseCard = (props: { course: ActiveCourse }) => {
  return (
    <div className="rounded-lg w-fit text-background shadow-2xl shadow-primary hover:scale-105 transition-all duration-300">
      <img
        className="rounded-t-lg w-[16em] lg:w-[16em]"
        src={
          props.course.imageUrl === ""
            ? "defaults/default_course.jpg"
            : props.course.imageUrl
        }
        alt="course img"
      />
      <div className="bg-linear-to-br from-primary to-secondary p-3 rounded-b-lg flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl">{props.course.courseName}</h1>
            <h2 className="text-sm">{props.course.teacherName}</h2>
          </div>
          <div className="bg-background text-primary px-3  py-1 text-lg rounded-2xl">
            {props.course.progress}%
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <div className="flex flex-col gap-0! bg-background text-primary rounded-lg px-3 py-1 shadow-2xl">
            <div className="flex justify-between items-end min-w-0">
              <h2 className="font-bold text-md min-w-0  flex-1">
                {props.course.upcomingEvents[0].title.length > 16
                  ? props.course.upcomingEvents[0].title.slice(0, 13) + "..."
                  : props.course.upcomingEvents[0].title}
              </h2>
              <p className="text-xs shrink-0">
                {props.course.upcomingEvents[0].startDate}
              </p>
            </div>
            <div className="flex justify-between items-start ">
              <h2 className="text-[0.6em] ml-4">
                {props.course.upcomingEvents[0].description.length > 28
                  ? props.course.upcomingEvents[0].description.slice(0, 25) +
                    "..."
                  : props.course.upcomingEvents[0].description}
              </h2>
              <p className="text-sm font-bold">
                {props.course.upcomingEvents[0].startTime}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-0! bg-background text-primary rounded-lg py-1 px-3 shadow-2xl scale-80">
            <div className="flex justify-between items-end">
              <h2 className="font-bold text-sm">
                {props.course.upcomingEvents[0].title.length > 16
                  ? props.course.upcomingEvents[0].title.slice(0, 13) + "..."
                  : props.course.upcomingEvents[0].title}
              </h2>
              <p className="text-xs">
                {props.course.upcomingEvents[0].startDate}
              </p>
            </div>
            <div className="flex justify-between items-start">
              <h2 className="text-[0.6em] ml-4">
                {props.course.upcomingEvents[0].description.length > 28
                  ? props.course.upcomingEvents[0].description.slice(0, 25) +
                    "..."
                  : props.course.upcomingEvents[0].description}
              </h2>
              <p className="text-xs font-bold">
                {props.course.upcomingEvents[0].startTime}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full hidden lg:flex justify-end">
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
