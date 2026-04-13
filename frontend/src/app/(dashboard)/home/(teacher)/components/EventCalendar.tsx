import { Calendar } from "@/components/ui/calendar";
import { UpcomingEvent } from "@/lib/models/teacherHome";
import { useEffect, useState } from "react";

const EventCalendar = (props: { upcomingEvents?: UpcomingEvent[] }) => {
  const currentYear = new Date().getFullYear();

  const dates = props.upcomingEvents?.map((ue) => {
    const [year, month, day] = ue.startDate.split("-").map(Number);
    return new Date(currentYear, month - 1, day);
  });

  return (
    <Calendar
      className="rounded-md border"
      mode="multiple"
      selected={dates}
      onSelect={() => {}}
      classNames={{
        day: "h-5 w-7 text-sm",
        head_cell: "w-7 text-xs",
        cell: "h-5 w-7",
        caption: "text-sm",
        nav_button: "h-6 w-6",
        today: "",
      }}
    />
  );
};

export default EventCalendar;
