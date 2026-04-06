"use client";

import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewMonthGrid, createViewWeek } from "@schedule-x/calendar";
// @ts-ignore
import "@schedule-x/theme-default/dist/index.css";
import { translations, mergeLocales } from "@schedule-x/translations";

export default function MyCalendar() {
  const calendarApp = useNextCalendarApp({
    views: [createViewMonthGrid(), createViewWeek()],
    locale: "hu-HU",
    translations: mergeLocales(translations, {
      huHU: {
        Today: "Ma",
        Month: "Hónap",
        Week: "Hét",
        Day: "Nap",
        View: "Nézet",
        Date: "Dátum",
        // Add any other specific UI strings you see in English
      },
    }) as any,

    backgroundEvents: [
      {
        title: "Elérhetőség",
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
