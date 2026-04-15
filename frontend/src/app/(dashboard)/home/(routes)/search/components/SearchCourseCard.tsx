import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Course } from "@/lib/models/CourseSearchModel";
import { MapPin, Pin, Star, User } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import AppImage from "../../../(teacher)/components/AppImg";

const SearchCourseCard = (props: { card: Course }) => {
  const router = useRouter();

  return (
    <section
      className="rounded-2xl shadow-2xl w-fit hover:scale-105 transition-all duration-300"
      onClick={() => {
        redirect(`/home/search/course?id=${props.card.id}`);
      }}
    >
      <div className="relative">
        <AppImage
          className="w-[20em] h-[12em] rounded-t-xl"
          src={props.card.bannerImage || "/defaults/default_course.jpg"}
          alt="Course banner"
        />

        <Avatar
          className="absolute right-[-15] bottom-[-15] size-20 border-2 border-light-bg-gray"
          onClick={(e) => {
            router.push(`search/teacher?id=${props.card.teacherId}`);
            e.stopPropagation();
          }}
        >
          <AvatarImage
            src={props.card.iconImage || "/defaults/default_avatar.jpg"}
          ></AvatarImage>
        </Avatar>
      </div>
      <div className="px-2 py-3 flex flex-col gap-2">
        <h1 className="truncate w-[15em] text-xl font-bold">
          {props.card.courseName}
        </h1>
        <h2 className="flex gap-1">
          <User className="text-primary"></User>
          {props.card.teacherName}
        </h2>
        {/* <h2 className="flex gap-1">
            <MapPin className="text-primary"></MapPin>
            {props.card.location}
          </h2> */}
        <h2 className="flex gap-1">
          <Star className="text-primary"></Star>
          {props.card.ratingAverage}
        </h2>
        <div className="flex justify-end mt-3 gap-1">
          <p className="text-xl">{props.card.price}</p>
          <p className="text-xl">{props.card.currency.currencySymbol}</p>
        </div>
      </div>
    </section>
  );
};

export default SearchCourseCard;
