"use client";

import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewMonthGrid, createViewWeek } from "@schedule-x/calendar";
// @ts-ignore
import "@schedule-x/theme-default/dist/index.css";

export default function MyCalendar() {
  const calendarApp = useNextCalendarApp({
    views: [createViewMonthGrid(), createViewWeek()],
    backgroundEvents: [
      {
        title: "Elérhetőség", // Optional: shows as a tooltip
        start: Temporal.ZonedDateTime.from({
          year: 2026,
          month: 4,
          day: 6,
          hour: 6,
          minute: 5,
          timeZone: "Europe/Budapest",
        }),
        end: Temporal.ZonedDateTime.from({
          year: 2026,
          month: 4,
          day: 6,
          hour: 19,
          minute: 5,
          timeZone: "Europe/Budapest",
        }),
        style: {
          backgroundColor: "hsl(136, 49%, 82%)",
        },
      },
    ],
    events: [
      {
        id: "1",
        title: "Square UI Meeting",
        start: Temporal.ZonedDateTime.from({
          year: 2026,
          month: 4,
          day: 6,
          hour: 10,
          minute: 5,
          timeZone: "Europe/Budapest",
        }),
        end: Temporal.ZonedDateTime.from({
          year: 2026,
          month: 4,
          day: 6,
          hour: 12,
          minute: 5,
          timeZone: "Europe/Budapest",
        }),
      },
    ],
  });

  return (
    <div className="sx-react-calendar-wrapper">
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  );
}
