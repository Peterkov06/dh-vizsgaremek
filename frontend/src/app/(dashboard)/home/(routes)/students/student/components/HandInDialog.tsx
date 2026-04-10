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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { CalendarIcon, FilePlusCorner, Plus, Trash } from "lucide-react";
import { useRef, useState } from "react";
import DateTimePicker from "./DateTimePicker";
import { useSearchParams } from "next/navigation";
import fetchWithAuth from "@/lib/api-client";
import { toast } from "sonner";

interface PostDialogProps {
  onSuccess?: () => void;
}

const HandInDialog = ({ onSuccess }: PostDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();

  const wallId = searchParams.get("wallId");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const [postText, setPostText] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const [date, setDate] = useState<Date | undefined>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function HandlePost() {
    const res = await fetchWithAuth("/api/tutoring/wall/post/handin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        wallId,
        text: postText,
        title,
        dueDate: date?.toISOString(),
        type: 1,
        maxPoints: 1,
      }),
    });

    if (res.ok) {
      toast.success("Sikeres poszt létrehozzás!");
      onSuccess?.();
    } else {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      toast.error("Hiba történt - " + errorText);
    }
    setPostText("");
    setTitle("");
    setDate(undefined);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-1 text-xl h-10">
          <Plus className="size-8"></Plus>Új beadandó létrehozása
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-none!">
        <DialogHeader>
          <DialogTitle className="text-3xl">
            Új beadandó létrehozása
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-10 px-6">
          <div className="flex flex-col gap-3">
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className="border-2 border-secondary shadow-2xl text-xl!"
              placeholder="Beadandó címe..."
            ></Input>
            <Textarea
              className="h-[20em] w-[40em] resize-none text-xl! shadow-2xl border-secondary border-2"
              placeholder="Beadandó szövege..."
              value={postText}
              onChange={(e) => {
                setPostText(e.target.value);
              }}
            ></Textarea>
          </div>
          <div className="flex flex-col gap-5">
            <DateTimePicker onChange={setDate}></DateTimePicker>

            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <Button
              className="flex gap-1 text-xl h-12"
              onClick={() => inputRef.current?.click()}
            >
              <FilePlusCorner className="size-8"></FilePlusCorner>Új fájl
              hozzáadása
            </Button>

            <div className="overflow-hidden max-h-[21em]">
              <ul className="flex flex-col gap-2 overflow-auto h-full">
                {files.map((file, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-light-bg-gray rounded-2xl px-4 py-1"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate max-w-40">{file.name}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{file.name}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            setFiles((prev) => prev.filter((_, j) => j !== i))
                          }
                        >
                          <Trash className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Törlés</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-center! w-full items-center">
          <Button
            className="text-2xl flex gap-1 h-12"
            disabled={postText === "" || title === "" || date === undefined}
            onClick={HandlePost}
          >
            <Plus className="size-8"></Plus>Beadandó létrehozzása
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HandInDialog;
