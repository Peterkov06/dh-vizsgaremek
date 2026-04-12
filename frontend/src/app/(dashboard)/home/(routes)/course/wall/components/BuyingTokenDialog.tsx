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
import { Input } from "@/components/ui/input";
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
import { CircleDollarSign, ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BuyingTokenDialog = (props: {
  course?: string;
  classLength: number;
  tokenCount: number;
}) => {
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId");
  const wallId = searchParams.get("wallId");

  const [courses, setCourses] = useState<string[]>(["Kurzus neve"]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [tokenCountInput, setTokenCountInput] = useState<string>("");

  const [price, setPrice] = useState<number>(2500);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleBuy = async () => {
    const res = await fetchWithAuth("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tokenCount: tokenCount,
        instanceId: wallId,
        courseBaseId: courseId,
      }),
    });

    if (res.ok) toast.success("Sikeres vásárlás");
    else toast.error("Hiba történt");

    setTokenCount(0);
    setTokenCountInput("");

    setIsOpen(false);
  };

  useEffect(() => {
    if (props.course !== undefined) {
      setCourses([props.course as string]);
      setSelectedCourse(props.course);
    }
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-lg border-2 border-secondary flex gap-2 text-black"
          variant={"outline"}
        >
          <ShoppingCart></ShoppingCart>
          <span className="lg:block hidden">Token vásárlása</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-none! lg:w-[30%]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Token vásárlása</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2>Kurzus:</h2>
            <Select
              value={selectedCourse}
              onValueChange={(val) => {
                setSelectedCourse(val);
              }}
              disabled={props.course !== undefined}
            >
              <SelectTrigger className="w-full border-2 border-secondary shadow-2xl">
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
          <div className="flex lg:flex-row flex-col justify-between items-center">
            <div className="flex flex-col gap-1">
              <h2>Token mennyisége:</h2>
              <Input
                type="number"
                min={1}
                max={20}
                className="shadow-2xl w-60"
                value={tokenCountInput}
                onChange={(e) => {
                  if (parseInt(e.target.value) && parseInt(e.target.value) > 0)
                    setTokenCount(parseInt(e.target.value));
                  else setTokenCount(0);
                  setTokenCountInput(e.target.value);
                }}
                placeholder="Token mennyisége..."
              ></Input>
            </div>
            <div className="text-xl">
              <p>1 token = 1 óra</p>
              <p>1 őra = {props.classLength} perc</p>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col justify-between text-xl mt-4">
            <p>Jelenlegi egyenleg: {props.tokenCount}</p>
            <p>Új egyenleg: {props.tokenCount + tokenCount}</p>
          </div>

          <div className="mt-40 flex flex-col gap-3">
            <div className="flex lg:flex-row flex-col justify-between items-center lg:items-end">
              <p className="truncate max-w-70">{selectedCourse} Token</p>
              <div className="flex gap-5 text-lg">
                <div>
                  <h2>Egységár:</h2>
                  <p>{price} Ft</p>
                </div>
                <div>
                  <h2>Mennyiség:</h2>
                  <p>x{tokenCount}db</p>
                </div>
              </div>
            </div>
            <hr className="border-2 border-primary" />
            <div className="flex  justify-between px-6">
              <h2 className="text-2xl">Fizetendő:</h2>
              <h2 className="text-2xl">{price * tokenCount} Ft</h2>
            </div>
          </div>
        </div>
        <DialogFooter className="justify-center!">
          <Button
            className="flex gap-1 text-2xl w-50 h-10"
            disabled={tokenCount === 0}
            onClick={handleBuy}
          >
            <CircleDollarSign className="size-7"></CircleDollarSign> Fizetés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyingTokenDialog;
