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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import fetchWithAuth from "@/lib/api-client";
import { Pen, ThumbsDown, ThumbsUp, UserStar } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import StarRating from "./StarRating";

const ReviewCourseDialog = () => {
  const [recommend, setRecommend] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [reviewScore, setReviewScore] = useState<number>(0);

  const searcParams = useSearchParams();

  const wallId = searcParams.get("wallId");
  const courseId = searcParams.get("courseId");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function HandleReview() {
    const res = await fetchWithAuth("/api/communication/write_review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        courseId,
        wallId,
        recommended: recommend === "true",
        text,
        reviewScore,
      }),
    });

    if (res.ok) toast.success("Sikeres értékelés");
    else {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      toast.error("Hiba történt - " + errorText);
    }
    setRecommend("");
    setText("");
    setReviewScore(0);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-lg border-2 border-secondary flex gap-2 text-black"
          variant={"outline"}
        >
          <Pen className="size-5"></Pen> Adj értékelést!
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-none! w-[40%]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Értékelés</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <RadioGroup
            className="grid grid-cols-2 gap-0"
            value={recommend}
            onValueChange={setRecommend}
          >
            <div
              className={`border-l-6 border-y-6 border-light-bg-gray hover:bg-green-200 transition-all duration-200 rounded-l-xl py-2 ${recommend === "true" ? "bg-background text-green-600 font-bold" : "bg-light-bg-gray text-[#898989]"} `}
            >
              <RadioGroupItem
                value="true"
                className="hidden"
                id="studs"
              ></RadioGroupItem>
              <Label
                htmlFor="studs"
                className="h-full w-full flex justify-center items-center text-2xl"
              >
                <ThumbsUp></ThumbsUp>
                Ajánlom
              </Label>
            </div>
            <div
              className={`border-r-6 border-y-6 border-light-bg-gray rounded-r-xl hover:bg-red-200 transition-all duration-200  ${recommend === "false" ? " bg-background text-red-600" : "bg-light-bg-gray text-[#898989]"}`}
            >
              <RadioGroupItem
                value="false"
                className="hidden"
                id="money"
              ></RadioGroupItem>
              <Label
                htmlFor="money"
                className="h-full w-full flex justify-center items-center text-2xl"
              >
                <ThumbsDown></ThumbsDown>
                Nem ajánlom
              </Label>
            </div>
          </RadioGroup>
          <div className="m-auto w-[15em]">
            <StarRating value={reviewScore} onChange={setReviewScore} />
          </div>
          <Textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            placeholder="Értékelés szövege..."
            className="text-xl! resize-none h-80 shadow-2xl border-2 border-secondary"
          ></Textarea>
        </div>
        <DialogFooter className="justify-center!">
          <Button
            className="text-2xl flex gap-1 h-12 w-50"
            onClick={HandleReview}
            disabled={recommend === "" || text === "" || reviewScore === 0}
          >
            <UserStar className="size-8"></UserStar> Értékelem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewCourseDialog;
