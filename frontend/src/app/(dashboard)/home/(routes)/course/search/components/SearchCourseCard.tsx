import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SearchCourseType } from "@/lib/models/CourseSearchModel";
import { MapPin, Pin, User } from "lucide-react";

const SearchCourseCard = (props: { card: SearchCourseType }) => {
  return (
    <section className="rounded-2xl shadow-2xl w-fit hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          className="w-[20em] h-[12em] rounded-t-xl"
          src={props.card.bannerImg || "/defaults/default_course.jpg"}
          alt="Course banner"
        />
        <Avatar className="absolute right-[-15] bottom-[-15] size-20">
          <AvatarImage src={props.card.avatarImg}></AvatarImage>
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
        <h2 className="flex gap-1">
          <MapPin className="text-primary"></MapPin>
          {props.card.location}
        </h2>
        <div className="flex justify-end mt-3">
          <p className="text-xl">{props.card.price}</p>
        </div>
      </div>
    </section>
  );
};

export default SearchCourseCard;
