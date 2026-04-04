"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

const DateTimePicker = ({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (date: Date) => void;
}) => {
  const [date, setDate] = useState<Date | undefined>(value);
  const [time, setTime] = useState("12:00");

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
    const [hours, minutes] = time.split(":").map(Number);
    selected.setHours(hours, minutes);
    setDate(selected);
    onChange(selected);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    if (date) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const updated = new Date(date);
      updated.setHours(hours, minutes);
      setDate(updated);
      onChange(updated);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "yyyy.MM.dd HH:mm") : "Válassz dátumot..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 flex flex-col gap-3">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">Időpont:</span>
          <Input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-fit"
            step="60"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
