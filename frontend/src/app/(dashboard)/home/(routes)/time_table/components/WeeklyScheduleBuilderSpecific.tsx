"use client";

import { Button } from "@/components/ui/button";
import fetchWithAuth from "@/lib/api-client";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface TimeBlock {
  start: string;
  end: string;
}

const DAYS = [
  "Hétfő",
  "Kedd",
  "Szerda",
  "Csütörtök",
  "Péntek",
  "Szombat",
  "Vasárnap",
];
const DAY_SHORT = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];

interface DayBlock {
  start: string;
  end: string;
}

interface WeeklyScheduleBuilderSpecificProps {
  onGenerate?: (timeBlocks: TimeBlock[]) => void;
}

const getMonday = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const WeeklyScheduleBuilderSpecific = ({
  onGenerate,
}: WeeklyScheduleBuilderSpecificProps) => {
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [schedule, setSchedule] = useState<DayBlock[][]>(DAYS.map(() => []));
  const [inputs, setInputs] = useState(
    DAYS.map(() => ({ start: "09:00", end: "10:00" })),
  );
  const [errors, setErrors] = useState<string[]>(DAYS.map(() => ""));

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatWeekLabel = (start: Date, end: Date) => {
    const fmt = (d: Date) =>
      `${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}.`;
    return `${fmt(start)} – ${fmt(end)}`;
  };

  const shiftWeek = (dir: 1 | -1) => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
    setSchedule(DAYS.map(() => []));
    setErrors(DAYS.map(() => ""));
  };

  const currentMonday = getMonday(new Date());
  const isCurrentWeek = weekStart.getTime() === currentMonday.getTime();

  const addBlock = (di: number) => {
    const { start, end } = inputs[di];
    if (!start || !end || start >= end) {
      setErrors((prev) => prev.map((e, i) => (i === di ? "Érvénytelen" : e)));
      return;
    }
    setErrors((prev) => prev.map((e, i) => (i === di ? "" : e)));
    setSchedule((prev) =>
      prev.map((blocks, i) =>
        i === di ? [...blocks, { start, end }] : blocks,
      ),
    );
  };

  const removeBlock = (di: number, bi: number) => {
    setSchedule((prev) =>
      prev.map((blocks, i) =>
        i === di ? blocks.filter((_, j) => j !== bi) : blocks,
      ),
    );
  };

  const updateInput = (di: number, field: "start" | "end", value: string) => {
    setInputs((prev) =>
      prev.map((inp, i) => (i === di ? { ...inp, [field]: value } : inp)),
    );
  };

  const generate = (): TimeBlock[] => {
    const result: TimeBlock[] = [];
    const cur = new Date(weekStart);
    const until = new Date(weekStart);
    until.setDate(until.getDate() + 6);

    while (cur <= until) {
      const dow = cur.getDay();
      const di = dow === 0 ? 6 : dow - 1;
      schedule[di].forEach((b) => {
        const dateStr = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
        result.push({
          start: `${dateStr}T${b.start}:00Z`,
          end: `${dateStr}T${b.end}:00Z`,
        });
      });
      cur.setDate(cur.getDate() + 1);
    }

    onGenerate?.(result);
    return result;
  };

  const handleSubmit = async () => {
    const result = generate();
    const res = await fetchWithAuth("/api/scheduling/week-free-timeblocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ timeblocks: result }),
    });

    if (res.ok) {
      toast.success("Sikeres létrehozás");
    } else {
      toast.error("Hiba történt");
    }
  };

  const hasAnyBlock = schedule.some((day) => day.length > 0);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => shiftWeek(-1)}
          disabled={isCurrentWeek}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-medium min-w-[12em] text-center">
          {formatWeekLabel(weekStart, weekEnd)}
        </span>
        <Button variant="outline" size="sm" onClick={() => shiftWeek(1)}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 w-full">
        {DAYS.map((day, di) => {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + di);
          const dateLabel = `${String(dayDate.getMonth() + 1).padStart(2, "0")}/${String(dayDate.getDate()).padStart(2, "0")}`;

          return (
            <div
              key={day}
              className="flex flex-col gap-2 bg-background border border-border rounded-xl p-3 min-w-0"
            >
              <div className="flex flex-col gap-0 mb-1">
                <h3 className="font-medium text-sm text-foreground hidden lg:block">
                  {day}
                </h3>
                <h3 className="font-medium text-sm text-foreground lg:hidden">
                  {DAY_SHORT[di]}
                </h3>
                <p className="text-xs text-muted-foreground">{dateLabel}</p>
              </div>

              <div className="flex flex-col gap-1">
                {schedule[di].map((block, bi) => (
                  <div
                    key={bi}
                    className="flex items-center justify-between bg-primary/10 text-primary rounded-lg px-2 py-1 text-xs gap-1"
                  >
                    <span className="truncate">
                      {block.start}–{block.end}
                    </span>
                    <button
                      onClick={() => removeBlock(di, bi)}
                      className="text-primary/60 hover:text-primary shrink-0 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-border">
                <input
                  type="time"
                  value={inputs[di].start}
                  onChange={(e) => updateInput(di, "start", e.target.value)}
                  className="w-full text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="time"
                  value={inputs[di].end}
                  onChange={(e) => updateInput(di, "end", e.target.value)}
                  className="w-full text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors[di] && (
                  <p className="text-xs text-red-500">{errors[di]}</p>
                )}
                <Button
                  onClick={() => addBlock(di)}
                  className="w-full text-xs h-6 bg-primary text-primary-foreground rounded-lg py-1 hover:bg-primary/90 transition-colors mt-1"
                >
                  + Hozzáadás
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!hasAnyBlock}
        className="w-fit px-5 py-2 rounded-lg text-sm transition-colors"
      >
        <Save className="size-4 mr-1" /> Mentés
      </Button>
    </div>
  );
};

export default WeeklyScheduleBuilderSpecific;
