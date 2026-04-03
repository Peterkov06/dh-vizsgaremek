"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound, FileText, MessageCircleMore } from "lucide-react";
import { redirect, usePathname, useSearchParams } from "next/navigation";

type StudentType = {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
};

const StudentPageSidebar = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const path = pathName.split("/").at(-1);

  const id = searchParams.get("id");

  const student: StudentType = {
    id: "Valami",
    name: "Matyus the third",
    nickname: "III. Matyi",
    avatarUrl: "",
  };

  //   const [course, setCourse] = useState<CourseDetail>();

  //   useEffect(() => {
  //     fetch(`/api/courses/${id}`)
  //       .then((res) => res.json())
  //       .then((res) => setCourse(res));
  //   }, []);

  const HandleNavigate = (name: string) => {
    if (path !== name) {
      redirect(`${name}?id=${id}`);
    }
  };

  return (
    <div className="border-4 border-light-bg-gray rounded-2xl h-fit px-2 py-4 bg-light-bg-gray w-[20em]">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage
            src={student.avatarUrl || "/defaults/default_avatar.jpg"}
          ></AvatarImage>
        </Avatar>
        <div>
          <h1 className="text-xl text-primary font-bold">{student.name}</h1>
          <h2 className="text-gray-500">{student.nickname}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-5 bg-background rounded-2xl py-5 px-2">
        <div
          className={`flex gap-2 bg-light-bg-gray cursor-pointer px-2 py-1 rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path === "profile" && "bg-primary text-background"}`}
          onClick={() => {
            HandleNavigate("profile");
          }}
        >
          <CircleUserRound></CircleUserRound>
          Profil
        </div>
        <div
          className={`flex gap-2 bg-light-bg-gray px-2 py-1 cursor-pointer rounded-lg hover:bg-secondary transition-all duration-300 hover:text-black ${path === "message" && "bg-primary text-background"}`}
          onClick={() => {
            HandleNavigate("message");
          }}
        >
          <MessageCircleMore></MessageCircleMore>
          Üzenetek
        </div>
      </div>
    </div>
  );
};

export default StudentPageSidebar;
