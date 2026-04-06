"use client";

import { useEffect, useState } from "react";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewMonthGrid, createViewWeek } from "@schedule-x/calendar";
// @ts-ignore
import "@schedule-x/theme-default/dist/index.css";
import { translations, mergeLocales } from "@schedule-x/translations";
import { createEventRecurrencePlugin } from "@schedule-x/event-recurrence";

export default function MyCalendar() {
  const AVAILABILITY = [
    { day: 1, hour: 6, minute: 0, endHour: 19, endMinute: 0 }, // Monday
    { day: 3, hour: 9, minute: 0, endHour: 17, endMinute: 0 }, // Wednesday
  ];

  function generateBackgroundEvents(weeks = 12) {
    const events = [];
    const now = Temporal.Now.zonedDateTimeISO("Europe/Budapest");

    for (let w = 0; w < weeks; w++) {
      for (const slot of AVAILABILITY) {
        const start = now
          .startOfDay()
          .add({ weeks: w })
          .subtract({ days: now.dayOfWeek - slot.day })
          .add({ hours: slot.hour, minutes: slot.minute });

        const end = start
          .subtract({ hours: slot.hour, minutes: slot.minute })
          .add({ hours: slot.endHour, minutes: slot.endMinute });

        events.push({
          title: "Elérhetőség",
          start,
          end,
          style: { backgroundColor: "hsl(136, 49%, 82%)" },
        });
      }
    }

    return events;
  }
  // const [calendarApp, setCalendarApp] = useState<any>(null);

  const calendarApp = useNextCalendarApp({
    views: [createViewMonthGrid(), createViewWeek()],
    locale: "hu-HU",
    plugins: [createEventRecurrencePlugin()],
    translations: mergeLocales(translations, {
      huHU: {
        Today: "Ma",
        Month: "Hónap",
        Week: "Hét",
        Day: "Nap",
        View: "Nézet",
        Date: "Dátum",
      },
    }) as any,

    backgroundEvents: generateBackgroundEvents(52),

    events: [
      {
        id: "1",
        title: "Meeting",
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
