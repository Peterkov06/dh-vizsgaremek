"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import fetchWithAuth from "@/lib/api-client";
import { FilePlusCorner, Plus, Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
interface PostDialogProps {
  onSuccess?: () => void;
}

const PostDialog = ({ onSuccess }: PostDialogProps) => {
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
  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function HandlePost() {
    const res = await fetchWithAuth("/api/tutoring/wall/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        wallId,
        text: postText,
      }),
    });

    if (res.ok) {
      toast.success("Sikeres poszt létrehozzás!");
      onSuccess?.();
    } else toast.error("Hiba történt");
    setPostText("");
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-1 text-xl h-10">
          <Plus className="size-8"></Plus>Új poszt létrehozása
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit lg:max-w-none!">
        <DialogHeader>
          <DialogTitle className="text-xl lg:text-3xl">
            Új poszt létrehozása
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-10 lg:px-6">
          <Textarea
            className="h-[20em] lg:w-[40em] resize-none text-xl! shadow-2xl border-secondary  border-2"
            placeholder="Poszt szövege..."
            value={postText}
            onChange={(e) => {
              setPostText(e.target.value);
            }}
          ></Textarea>
          {/* <div className="flex flex-col gap-5">
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
          </div> */}
        </div>
        <DialogFooter className="flex justify-center! w-full items-center">
          <Button
            className="text-2xl flex gap-1 h-12"
            onClick={HandlePost}
            disabled={postText === ""}
          >
            <Plus className="size-8"></Plus>Poszt létrehozzása
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
