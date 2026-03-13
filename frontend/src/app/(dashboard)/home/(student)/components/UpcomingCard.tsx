import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UpcomingEvent } from "@/lib/models/homeModel";

const UpcomingCard = (props: { event: UpcomingEvent }) => {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="bg-linear-to-b text-xl from-primary to-secondary rounded-lg pl-1 hover:scale-105 transition-all duration-200">
          <div className="flex flex-col bg-background text-primary rounded-lg px-3 py-1 shadow-2xl">
            <div className="flex justify-between items-end">
              <h2 className="font-bold text-md">{props.event.courseName}</h2>
              <p className="text-sm">{props.event.startDate}</p>
            </div>
            <div className="flex justify-between items-start">
              <h2 className="text-xs ml-4">{props.event.teacherName}</h2>
              <p className="text-sm font-bold">{props.event.startTime}</p>
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div>{props.event.description}</div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UpcomingCard;
