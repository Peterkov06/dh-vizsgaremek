"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type MessageUserType = {
  id: string;
  name: string;
  avatarUrl: string;
};

const MessageSidebar = () => {
  const dummyUsers: MessageUserType[] = [
    {
      id: "user_01H2X9",
      name: "Alex Rivera",
      avatarUrl: "https://i.pravatar.cc/150?u=alex_rivera",
    },
    {
      id: "user_02J4M1",
      name: "Samantha Cooke",
      avatarUrl: "https://i.pravatar.cc/150?u=samantha_c",
    },
    {
      id: "user_03K8L2",
      name: "Jordan The Tech Smith",
      avatarUrl: "https://i.pravatar.cc/150?u=jordan_s",
    },
    {
      id: "user_04N5P9",
      name: "Dr. Elena Rodriguez",
      avatarUrl: "https://i.pravatar.cc/150?u=elena_r",
    },
  ];

  const [searchUser, setSearchUser] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="border-4 border-light-bg-gray rounded-2xl h-full px-2 py-4 bg-light-bg-gray w-[20em]">
      <h1 className="text-3xl text-primary mb-5">Üzenetek</h1>
      <InputGroup className="mb-5 shadow-2xl">
        <InputGroupInput
          type="text"
          value={searchUser}
          onChange={(e) => {
            setSearchUser(e.target.value.toLowerCase());
          }}
          className="text-lg!"
          placeholder="Keresés..."
        ></InputGroupInput>
        <InputGroupAddon align={"inline-end"}>
          <InputGroupButton>
            <Search className="size-5"></Search>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <div className="overflow-hidden max-h-[30em]">
        <div className="overflow-auto h-max flex flex-col gap-5 bg-background p-3">
          {dummyUsers
            .filter((u) => u.name.toLowerCase().includes(searchUser))
            .map((u) => (
              <div
                key={u.id}
                className={`flex gap-3 items-center bg-light-bg-gray rounded-lg px-2 py-1 hover:bg-secondary transition-all duration-300 ${id === u.id && "bg-primary text-white"}`}
                onClick={() => {
                  updateQuery("id", u.id);
                }}
              >
                <Avatar>
                  <AvatarImage
                    src={u.avatarUrl || "/defaults/default_avatar.jpg"}
                  ></AvatarImage>
                </Avatar>
                <h2 className="truncate max-w-56">{u.name}</h2>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageSidebar;
