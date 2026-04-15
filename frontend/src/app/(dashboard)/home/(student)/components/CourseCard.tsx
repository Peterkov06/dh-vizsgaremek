import { Button } from "@/components/ui/button";
import { ActiveCourse, InactiveCourse } from "@/lib/models/homeModel";
import { ChevronRightCircle, CircleStar, User } from "lucide-react";
import Link from "next/link";
import AppImage from "../../(teacher)/components/AppImg";

const CourseCard = (props: { course: ActiveCourse | InactiveCourse }) => {
  const isActive = (
    course: ActiveCourse | InactiveCourse,
  ): course is ActiveCourse => {
    return "upcomingEvents" in course;
  };
  return (
    <div className="rounded-lg w-fit flex flex-col text-background overflow-hidden shadow-2xl shadow-primary hover:scale-105 transition-all duration-300">
      <AppImage
        className="rounded-t-lg h-[8em] lg:h-[10em] w-[14em] lg:w-[18em]"
        src={props.course.courseBannerURL}
        alt="course img"
      />
      <div className="bg-linear-to-br flex-1 justify-between from-primary to-secondary py-3 lg:py-6 px-3 rounded-b-lg flex flex-col gap-2 w-[14em] lg:w-[18em]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2 lg:gap-5">
            <h1 className="lg:text-2xl">{props.course.courseName}</h1>
            <h2 className="text-sm lg:text-xl flex lg:gap-2 items-center">
              <User></User>
              {props.course.teacherName}
            </h2>
          </div>
        </div>
        <div className="bg-background text-primary flex gap-2 justify-center items-center px-3 py-1 lg:text-2xl rounded-2xl">
          {props.course.progress}
          <CircleStar></CircleStar>
        </div>
        {/* {isActive(props.course) && props.course.upcomingEvents.length > 0 && (
          <div className="flex flex-col gap-0">
            <div className="flex flex-col gap-0! bg-background text-primary rounded-lg px-3 py-1 shadow-2xl">
              <div className="flex justify-between items-end min-w-0">
                <h2 className="font-bold text-md min-w-0  flex-1">
                  {props.course.upcomingEvents[0].title.length > 16
                    ? props.course.upcomingEvents[0].title.slice(0, 13) + "..."
                    : props.course.upcomingEvents[0].title}
                </h2>
                <p className="text-sm shrink-0">
                  {props.course.upcomingEvents[0].startDate}
                </p>
              </div>
              <div className="flex justify-between items-start ">
                <h2 className="text-sm ml-4">
                  {props.course.upcomingEvents[0].description.length > 28
                    ? props.course.upcomingEvents[0].description.slice(0, 25) +
                      "..."
                    : props.course.upcomingEvents[0].description}
                </h2>
                <p className="text-md font-bold">
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
                <p className="text-sm font-bold">
                  {props.course.upcomingEvents[0].startTime}
                </p>
              </div>
            </div>
          </div>
        )} */}
        <div className={`w-full flex justify-center lg:justify-end `}>
          <Link href={`/home/course?id=${props.course.courseId}`}>
            <Button className="py-1 px-5 h-fit lg:text-lg rounded-2xl">
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
