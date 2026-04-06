"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleUserRound, X } from "lucide-react";
import { useState } from "react";

type Student = {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
  introduction: string;
  age: number;
  address: string;
  preferences: string[];
};

const PeddingStudentProfile = (props: { id: string }) => {
  const [student, setStudent] = useState<Student>({
    id: "st-001",
    name: "Benjamin Taylor",
    nickname: "BennyT",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ben",
    introduction:
      "Aspiring full-stack developer with a passion for clean code and UX design. I love solving complex problems with simple solutions. Lórum ipse mint mindó kértő opán, elsősorban egy kelyes öbeny. Két csent közekedt be szenikóval, s beszélgetve kolichoz luldácsoltak. Ahogy ott minó, ikézem a szenikóval, a netés ugyancsak fürelte a kedétlelését, s a bölőkből forcolta, hogy a villa másik zottájában jó bélyező estés van. El is vegesztette, hogy oda köhéhedi be magát, mihelyt magára szerkedik. Egy zúra telen luskucsát is jól átoztatotta körülbelül a tenyzőn, azzal a csemzővel, hogy néhányat a fáros alantás ürkelemébe csalik egy mekségre. A két rédság végre zsugdalta kolicát, a közöttségöt maguk mögött ejtetették, a telit tüsszögték s teztek. A borpás netés pedig gyorsan, ahogy csak a sítőben tudott, tagolt a szfizésekhez. Sargosodta őket, aztán tapogatózva, szerencsésen ricskált az estésbe.",
    age: 24,
    address: "123 Tech Lane, San Francisco, CA",
    preferences: ["React", "TypeScript", "Node.js", "Dark Mode"],
  });
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-10 w-10">
              <CircleUserRound className="size-6"></CircleUserRound>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-fit max-w-none!">
            <DialogHeader>
              <DialogTitle className="text-4xl">Profil</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              <section className="flex flex-col gap-5">
                <div className="bg-secondary rounded-2xl w-full h-30 flex items-center px-5 gap-5">
                  <Avatar className="size-24 bg-background">
                    <AvatarImage
                      src={student.avatarUrl || "/defaults/default_avatar.jpg"}
                    ></AvatarImage>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl text-primary font-bold">
                      {student.name}
                    </h1>
                    <h2 className="text-xl text-gray-500">
                      {student.nickname}
                    </h2>
                  </div>
                </div>
                <div className="bg-secondary rounded-2xl w-full flex gap-2 flex-col p-4">
                  <h1 className="text-2xl text-primary">Bemutatkozás</h1>
                  <div className="overflow-hidden max-w-[40em] max-h-[10em]">
                    <p className="text-lg overflow-auto h-full">
                      {student.introduction}
                    </p>
                  </div>
                </div>
              </section>
              <section className="w-full bg-light-bg-gray rounded-2xl p-5 flex flex-col gap-5 h-fit">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl text-primary">Életkor:</h2>
                  <h2 className="text-xl text-primary font-bold">
                    {student.age}
                  </h2>
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl text-primary">Lakhely:</h2>
                  <h2 className="text-xl text-primary font-bold text-end">
                    {student.address}
                  </h2>
                </div>
                <div className="flex justify-between gap-3">
                  <h2 className="text-xl text-primary">Preferenciák:</h2>
                  <div className="flex gap-2">
                    {student.preferences.map((pref, id) => (
                      <div
                        key={id}
                        className="bg-background py-1 px-2 rounded-lg border-2 border-primary"
                      >
                        {pref}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>
                  <X></X> Bezárás
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-lg">Profil</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default PeddingStudentProfile;
