import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CourseReview } from "@/lib/models/CourseSearchModel";
import { Check, X } from "lucide-react";

const CourseReviewCard = (props: { review: CourseReview }) => {
  return (
    <div className="flex bg-light-bg-gray gap-2 border-2 border-primary rounded-2xl p-2">
      <Avatar className="size-10">
        <AvatarImage
          src={
            props.review.reviewerImage || "/public/defaults/default_avatar.jpg"
          }
        ></AvatarImage>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex gap-2 items-center">
          <h1 className="text-xl font-bold">{props.review.reviewerName}</h1>
          {props.review.recommended ? (
            <Check className="text-green-600 size-8"></Check>
          ) : (
            <X className="text-red-500 size-8"></X>
          )}
        </div>

        <p>{props.review.text}</p>
      </div>
    </div>
  );
};

export default CourseReviewCard;
