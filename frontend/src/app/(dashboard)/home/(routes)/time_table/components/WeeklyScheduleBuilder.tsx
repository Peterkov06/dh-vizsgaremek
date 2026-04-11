"use client";

import { Button } from "@/components/ui/button";
import fetchWithAuth from "@/lib/api-client";
import { Save } from "lucide-react";
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

interface WeeklyScheduleBuilderProps {
  onGenerate?: (timeBlocks: TimeBlock[]) => void;
  weeksAhead?: number;
}

const WeeklyScheduleBuilder = ({
  onGenerate,
  weeksAhead = 1,
}: WeeklyScheduleBuilderProps) => {
  const [schedule, setSchedule] = useState<DayBlock[][]>(DAYS.map(() => []));
  const [inputs, setInputs] = useState(
    DAYS.map(() => ({ start: "09:00", end: "10:00" })),
  );
  const [errors, setErrors] = useState<string[]>(DAYS.map(() => ""));
  const [generated, setGenerated] = useState<TimeBlock[]>([]);
  const [copied, setCopied] = useState(false);

  const addBlock = (di: number) => {
    const { start, end } = inputs[di];
    if (!start || !end || start >= end) {
      setErrors((prev) => prev.map((e, i) => (i === di ? "Invalid range" : e)));
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

  const generate = () => {
    const result: TimeBlock[] = [];
    const today = new Date();
    const until = new Date(today);

    until.setDate(until.getDate() + weeksAhead * 7);

    const cur = new Date(today);
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
    setGenerated(result);
    onGenerate?.(result);
    return result;
  };

  const HandleSubmit = async () => {
    const result = generate();
    console.log(result);
    const res = await fetchWithAuth("/api/scheduling/week-free-timeblocks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ timeblocks: result }),
    });

    console.log(res);
    if (res.ok) {
      toast.success("Sikeres létrehozzás");
    } else {
      toast.error("Hiba történt");
    }
  };
  const hasAnyBlock = schedule.some((day) => day.length > 0);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-7 gap-2 w-full">
        {DAYS.map((day, di) => (
          <div
            key={day}
            className="flex flex-col gap-2 bg-background border border-border rounded-xl p-3 min-w-0"
          >
            <div className="flex flex-col gap-1 mb-1">
              <h3 className="font-medium text-sm text-foreground hidden lg:block">
                {day}
              </h3>
              <h3 className="font-medium text-sm text-foreground lg:hidden">
                {DAY_SHORT[di]}
              </h3>
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
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <Button
          onClick={HandleSubmit}
          disabled={!hasAnyBlock}
          className="px-5 py-2 rounded-lg border border-border text-sm transition-colors"
        >
          <Save></Save>Mentés
        </Button>
      </div>
    </div>
  );
};

export default WeeklyScheduleBuilder;
