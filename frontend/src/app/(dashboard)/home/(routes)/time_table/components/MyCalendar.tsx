"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewMonthGrid,
  createViewWeek,
  createViewDay,
} from "@schedule-x/calendar";
// @ts-ignore
import "@schedule-x/theme-default/dist/index.css";
import { translations, mergeLocales } from "@schedule-x/translations";
import { createEventRecurrencePlugin } from "@schedule-x/event-recurrence";
import fetchWithAuth from "@/lib/api-client";

export interface CalendarEvent {
  lessonLength: number;
  eventId: string;
  instanceId: string;
  title: string | null;
  startDate: string;
  startTime: string;
  endTime: string;
  courseName: string;
  participantName: string;
  participantId: string;
  eventType: "Lesson" | "Deadline" | string;
  description: string | null;
}

export type CalendarSchedule = Record<string, CalendarEvent[]>;

interface Timeblock {
  id: string;
  start: string;
  end: string;
}

interface TimeblocksDay {
  day: string;
  timeblocks: Timeblock[];
}

const TZ = "Europe/Budapest";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetchWithAuth(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} for ${url}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export default function MyCalendar() {
  const [isMobile, setIsMobile] = useState(false);
  const [apiData, setApiData] = useState<CalendarSchedule>({});
  const [bgEvents, setBgEvents] = useState<any[]>([]);
  const calendarRef = useRef<ReturnType<typeof useNextCalendarApp> | null>(
    null,
  );
  const fetchTimeblocksRef = useRef<
    ((rangeStart: string) => Promise<void>) | undefined
  >(undefined);

  useEffect(() => {
    const today = Temporal.Now.plainDateISO(TZ);
    const searchDate = `${today.year}-${String(today.month).padStart(2, "0")}-01`;

    fetchJSON<CalendarSchedule>(
      `/api/scheduling/get-events?searchDate=${searchDate}&searchLength=month`,
    )
      .then((data) => setApiData(data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const formattedEvents = useMemo(() => {
    return Object.values(apiData)
      .flat()
      .map((event) => {
        if (!event?.startDate || !event?.startTime || !event?.endTime) {
          console.warn("Skipping event with missing fields:", event);
          return null;
        }
        try {
          const dateOnly = event.startDate.includes("T")
            ? event.startDate.split("T")[0]
            : event.startDate;

          const start = Temporal.PlainDateTime.from(
            `${dateOnly}T${event.startTime}`,
          ).toZonedDateTime(TZ);

          const end = Temporal.PlainDateTime.from(
            `${dateOnly}T${event.endTime}`,
          ).toZonedDateTime(TZ);

          return {
            id: event.eventId ?? event.instanceId,
            title:
              event.title || `${event.courseName} - ${event.participantName}`,
            start,
            end,
            description: event.description || "",
          };
        } catch (err) {
          console.error(
            "Failed to parse event:",
            event.eventId ?? event.instanceId,
            err,
          );
          return null;
        }
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
  }, [apiData]);

  const fetchTimeblocks = useCallback(async (rangeStart: string) => {
    const weekStart =
      typeof rangeStart === "string"
        ? rangeStart.split(" ")[0]
        : (rangeStart as any as Temporal.ZonedDateTime)
            .toPlainDate()
            .toString();

    try {
      const data = await fetchJSON<TimeblocksDay[]>(
        `/api/scheduling/week-free-timeblocks/get?searchDate=${weekStart}`,
      );
      console.log("Timeblocks raw response:", data);

      const events = data.flatMap((day) =>
        day.timeblocks.map((tb) => {
          return {
            id: tb.id,
            start: Temporal.Instant.from(tb.start).toZonedDateTimeISO("UTC"),
            end: Temporal.Instant.from(tb.end).toZonedDateTimeISO("UTC"),
            style: { backgroundColor: "hsl(136.3636 48.8889% 82.3529%)" },
          };
        }),
      );

      setBgEvents(events);
    } catch (err) {
      console.error("Failed to fetch timeblocks:", err);
    }
  }, []);

  useEffect(() => {
    fetchTimeblocksRef.current = fetchTimeblocks;
  }, [fetchTimeblocks]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const calendarApp = useNextCalendarApp({
    views: isMobile
      ? [createViewDay()]
      : [createViewDay(), createViewWeek(), createViewMonthGrid()],
    defaultView: isMobile ? "day" : "week",
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
    backgroundEvents: [],
    events: [],
    callbacks: {
      onRangeUpdate(range) {
        const dateStr =
          range.start instanceof Temporal.ZonedDateTime
            ? range.start.toPlainDate().toString()
            : String(range.start);
        fetchTimeblocksRef.current?.(dateStr);
      },
    },
  });

  useEffect(() => {
    if (!calendarApp || bgEvents.length === 0) return;
    const internalApp = (calendarApp as any).$app;
    internalApp.calendarEvents.backgroundEvents.value = bgEvents;
  }, [bgEvents, calendarApp]);

  useEffect(() => {
    if (!calendarApp) return;
    const internalApp = (calendarApp as any).$app;
    console.log("$app keys:", Object.keys(internalApp));
    console.log(
      "$app.calendarState keys:",
      Object.keys(internalApp?.calendarState ?? {}),
    );
    console.log("full $app:", internalApp);
  }, [calendarApp]);

  useEffect(() => {
    calendarRef.current = calendarApp;
  }, [calendarApp]);

  useEffect(() => {
    if (!calendarApp) return;
    const today = Temporal.Now.plainDateISO(TZ).toString();
    fetchTimeblocks(today);
  }, [calendarApp, fetchTimeblocks]);

  useEffect(() => {
    if (calendarApp && formattedEvents.length > 0) {
      calendarApp.events.set(formattedEvents);
    }
  }, [formattedEvents, calendarApp]);

  return (
    <div className="sx-react-calendar-wrapper">
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  );
}
