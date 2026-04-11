"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import fetchWithAuth from "@/lib/api-client";
import { CirclePlus, Save, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface TimeSlot {
  start: string;
  end: string;
}

export interface AvailabilityData {
  availableTimes: TimeSlot[];
}

const EnrollingClassDialog = (props: {
  course?: string;
  teacherId: string;
  token: number;
}) => {
  const [courses, setCourses] = useState<string[]>(["Kurzus neve"]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const [classLenght, setClassLenght] = useState<number>(0);
  const [classLenghtInput, setClassLenghtInput] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [available, setAvailable] = useState<string>();

  const [availableDays, setAvailableDays] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const wallId = searchParams.get("wallId");
  const courseId = searchParams.get("courseId");

  const formatDate = (dateString?: string) => {
    if (!dateString) return;
    const [datePart, timePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const time = timePart.slice(0, 5);
    const date = new Date(year, month - 1, day);
    return `${date.toLocaleDateString("hu-HU", { month: "short", day: "numeric" })} ${time}`;
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return;
    const [datePart, timePart] = dateString.split("T");
    const time = timePart.slice(0, 5);
    return `${time}`;
  };

  const formatDateMin = (dateString?: string) => {
    if (!dateString) return;

    return new Date(dateString).toLocaleDateString("hu-HU", {
      month: "short",
      day: "numeric",
    });
  };

  const handleFetch = async () => {
    await fetchWithAuth(`/api/scheduling/${props.teacherId}/free-days`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableDays(data.availableDays);
      });
  };
  const toLocalISO = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    if (date !== undefined && classLenght !== 0) {
      console.log("here");
      fetchWithAuth(
        `/api/scheduling/${props.teacherId}/free-times?searchDate=${toLocalISO(date)}&LessonNumber=${classLenght}&courseId=${courseId}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setAvailableTimes(data.availableTimes);
        });
    } else {
      setAvailableTimes([]);
    }
  }, [date, classLenght]);

  useEffect(() => {
    handleFetch();
    if (props.course !== undefined) {
      setCourses([props.course as string]);
      setSelectedCourse(props.course);
    }
  }, []);

  const formatTime = (isoString: string) => isoString.split("T")[1].slice(0, 5);

  const addHours = (isoString: string, hours: number) => {
    const [datePart, timePart] = isoString.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [h, m] = timePart.slice(0, 5).split(":").map(Number);

    const date = new Date(year, month - 1, day, h + hours, m);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00Z`;
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function HandleCreate() {
    console.log(available);
    const res = await fetchWithAuth("/api/scheduling/book-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        instanceId: wallId,
        courseBaseId: courseId,
        timeblock: {
          start: available,
          end: addHours(available || "", classLenght),
        },
        type: 0,
        title: null,
        description: null,
      }),
    });
    if (res.ok) toast.success("Sikeres időpont foglalás");
    else {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      toast.error("Hiba történt - " + errorText);
    }

    setAvailableDays([]);
    setAvailableTimes([]);
    setAvailable(undefined);
    setClassLenghtInput("");
    setClassLenght(0);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-xl mt-3 flex gap-2 h-10 border-2 border-secondary"
          variant={"outline"}
        >
          <CirclePlus className="size-6"></CirclePlus> Új óra felvétele
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-none! w-[30%]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Új óra felvétele</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-7">
          <div className="flex justify-between items-center">
            <div>
              <h2>Kurzus:</h2>
              <Select
                value={selectedCourse}
                onValueChange={(val) => {
                  setSelectedCourse(val);
                }}
                disabled={props.course !== undefined}
              >
                <SelectTrigger className=" shadow-2xl">
                  <SelectValue placeholder="Válassz egy kurzust..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kurzusaid</SelectLabel>
                    {courses.map((c, i) => (
                      <SelectItem key={i} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <p className="text-xl">Tokenek: {props.token}</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h2>Órák száma:</h2>
              <Input
                type="number"
                className="shadow-2xl w-[15em]"
                value={classLenghtInput}
                min={1}
                max={props.token}
                onChange={(e) => {
                  if (
                    parseInt(e.target.value) &&
                    parseInt(e.target.value) > 0 &&
                    parseInt(e.target.value) <= props.token
                  )
                    setClassLenght(parseInt(e.target.value));
                  else setClassLenght(0);
                  setClassLenghtInput(e.target.value);
                }}
                placeholder="Órák száma..."
              ></Input>
            </div>
            <p className="text-end text-xl">
              Felhasznált tokenek <br></br>száma: {classLenght}
            </p>
          </div>
          <div className="w-full flex justify-center text-xl">
            {classLenght === 0 ? (
              <h1>Válasszd ki az óra hosszát!</h1>
            ) : date ? (
              available ? (
                <h1>
                  {" "}
                  {formatDate(available)} -{" "}
                  {formatDateTime(addHours(available, classLenght))}
                </h1>
              ) : (
                <h1>
                  {formatDateMin(date.toISOString())} Válassz egy időpontot!
                </h1>
              )
            ) : (
              <h1>Válassz egy dátumot!</h1>
            )}
          </div>
          <div className="flex justify-between">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
                captionLayout="dropdown"
                disabled={(day) => {
                  const local = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
                  return !availableDays.includes(local);
                }}
              />
            </div>
            <div className="overflow-hidden max-h-[18em] flex flex-col p-3 border-4 rounded-2xl border-light-bg-gray">
              <h2 className="text-xl mb-3">Elérhető időpontok:</h2>
              <div className="overflow-auto max-h-[18em] flex-1">
                <RadioGroup value={available} onValueChange={setAvailable}>
                  {availableTimes.map((at, i) => (
                    <div
                      key={i}
                      onClick={() => setAvailable(at.start)}
                      className={`bg-light-bg-gray p-2 border-2 border-primary rounded-lg w-full text-md flex justify-center cursor-pointer hover:bg-secondary transition-all duration-300 ${available === at.start && "bg-primary text-white hover:text-black"}`}
                    >
                      {formatTime(at.start)}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
          <div>
            {props.token === 0 && (
              <div className="flex gap-3 items-center justify-center">
                <p className="text-lg text-red-600">
                  Nincs elég tokened a foglaláshoz:
                </p>
                <Button className="flex gap-1">
                  <ShoppingBag></ShoppingBag> Vásárlás
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="justify-center!">
          <Button
            className="flex gap-1 text-2xl w-50 h-10"
            disabled={
              available === undefined || classLenght === 0 || date === undefined
            }
            onClick={HandleCreate}
          >
            <Save className="size-7"></Save> Mentés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollingClassDialog;
