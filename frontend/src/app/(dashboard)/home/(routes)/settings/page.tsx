"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, Trash } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [fullName, setFullName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [allTabs, setAllTabs] = useState<string>("introduction");
  const [introduction, setIntroduction] = useState<string>("");

  return (
    <main className="grid grid-cols-10 grid-rows-12 h-full w-full">
      <div className="row-start-1">
        <h1 className="text-5xl font-bold text-primary">Beállítások</h1>
      </div>
      <div className="row-start-2 col-span-3 row-span-7 border-4 border-light-bg-gray rounded-2xl flex flex-col px-2 py-3 items-center gap-6 mt-8 mx-3">
        <h1 className="text-2xl font-bold">Személyes adatok</h1>
        <div className="flex flex-col w-full gap-4">
          <Input
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            className="bg-light-bg-gray rounded-xl text-lg! h-12 p-3"
            placeholder="Teljes név..."
          ></Input>
          <Input
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
            }}
            className="bg-light-bg-gray rounded-xl text-lg! h-12 p-3"
            placeholder="Becenév..."
          ></Input>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-light-bg-gray rounded-xl text-lg! h-12 p-3"
            placeholder="Email-cím..."
          ></Input>
          <Input
            value={mobileNumber}
            onChange={(e) => {
              setMobileNumber(e.target.value);
            }}
            className="bg-light-bg-gray rounded-xl text-lg! h-12 p-3"
            placeholder="Telefonszám..."
          ></Input>
          <Input
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            className="bg-light-bg-gray rounded-xl text-lg! h-12 p-3"
            placeholder="Lakcím..."
          ></Input>
        </div>
        <Button className="text-xl w-40 flex gap-1 bg-linear-to-tl from-foreground to-[#868686]">
          <Save className="size-6"></Save>
          <p>Mentés</p>
        </Button>
      </div>
      <div className="mx-3 row-start-2 col-span-4 row-span-6 border-4 border-light-bg-gray rounded-2xl flex flex-col px-2 py-1 my-8 gap-3 items-stretch">
        <RadioGroup
          className="grid grid-cols-2 gap-0"
          value={allTabs}
          onValueChange={setAllTabs}
        >
          <div
            className={`border-6 border-light-bg-gray rounded-l-xl py-2 ${allTabs === "introduction" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
          >
            <RadioGroupItem
              value="introduction"
              className="hidden"
              id="studs"
            ></RadioGroupItem>
            <Label
              htmlFor="studs"
              className="h-full w-full flex justify-center items-center text-lg"
            >
              Bemutatkozás
            </Label>
          </div>
          <div
            className={`border-6 border-light-bg-gray rounded-r-xl ${allTabs === "qualification" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
          >
            <RadioGroupItem
              value="qualification"
              className="hidden"
              id="money"
            ></RadioGroupItem>
            <Label
              htmlFor="money"
              className="h-full w-full flex justify-center items-center text-lg"
            >
              Végzettségek
            </Label>
          </div>
        </RadioGroup>

        <Textarea
          value={introduction}
          onChange={(e) => {
            setIntroduction(e.target.value);
          }}
          className="bg-light-bg-gray resize-none h-[12em]! text-lg!"
          placeholder="Bemutatkozás..."
        ></Textarea>

        <div className="flex gap-3 items-center justify-center">
          <Button className="h-10 w-50 text-lg bg-linear-to-tl from-primary to-[#7CB08C]">
            <Pencil className="size-6"></Pencil>
            Módosítás
          </Button>
          <Button className="h-10 w-10 bg-linear-to-tl from-[#B02929] to-[#BD6060]">
            <Trash className="size-6"></Trash>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Settings;
