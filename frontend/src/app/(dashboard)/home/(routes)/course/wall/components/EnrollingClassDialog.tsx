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
import { CirclePlus, Save, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const EnrollingClassDialog = (props: { course?: string }) => {
  const [courses, setCourses] = useState<string[]>(["Kurzus neve"]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [tokenCount, setTokenCount] = useState<number>(1);
  const [usedTokenCount, setUsedTokenCount] = useState<number>(0);

  const [classLenght, setClassLenght] = useState<number>(0);
  const [classLenghtInput, setClassLenghtInput] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [availableTimes, setAvailableTimes] = useState<string[]>([
    "10:00",
    "12:00",
    "14:00",
  ]);
  const [available, setAvailable] = useState<string>();

  useEffect(() => {
    if (props.course !== undefined) {
      setCourses([props.course as string]);
      setSelectedCourse(props.course);
    }
  }, []);

  return (
    <Dialog>
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

            <p className="text-xl">Tokenek: {tokenCount}</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h2>Órák száma:</h2>
              <Input
                type="number"
                className="shadow-2xl"
                value={classLenghtInput}
                onChange={(e) => {
                  if (parseInt(e.target.value) && parseInt(e.target.value) > 0)
                    setClassLenght(parseInt(e.target.value));
                  else setClassLenght(0);
                  setClassLenghtInput(e.target.value);
                }}
                placeholder="Órák száma..."
              ></Input>
            </div>
            <p className="text-end text-xl">
              Felhasznált tokenek <br></br>száma: {usedTokenCount}
            </p>
          </div>
          <div className="flex justify-between">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
                captionLayout="dropdown"
              />
            </div>
            <div className="overflow-hidden max-h-[19em] p-3 border-4 rounded-2xl border-light-bg-gray">
              <h2 className="text-xl mb-3">Elérhető időpontok:</h2>
              <div className="overflow-auto h-full">
                <RadioGroup value={available} onValueChange={setAvailable}>
                  {availableTimes.map((at, i) => (
                    <Label key={i} htmlFor={at}>
                      <div
                        className={`bg-light-bg-gray p-2 border-2 border-primary rounded-lg w-full text-md flex justify-center hover:bg-secondary transition-all duration-300 ${available === at && "bg-primary text-white hover:text-black"}`}
                      >
                        <RadioGroupItem
                          value={at}
                          id={at}
                          className="hidden"
                        ></RadioGroupItem>
                        <Label htmlFor={at}>{at}</Label>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
          <div>
            {tokenCount === 0 && (
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
            disabled={tokenCount === 0}
          >
            <Save className="size-7"></Save> Mentés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollingClassDialog;
