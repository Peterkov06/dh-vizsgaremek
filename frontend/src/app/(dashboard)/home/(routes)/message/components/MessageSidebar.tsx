"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import fetchWithAuth from "@/lib/api-client";
import { ChevronDown, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface ChatParticipant {
  participantName: string;
  participantNickname: string;
  participantId: string;
  participantImageURL: string; // URL string
  chatId: string;
  courseNumber: number;
  newMessage: boolean; // Flag for unread status
}

const MessageSidebar = () => {
  const [users, setUsers] = useState<ChatParticipant[]>([]);

  const [searchUser, setSearchUser] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const id = searchParams.get("chatId");

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const handleFetch = async () => {
    await fetchWithAuth("/api/communication/chats")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="border-4 border-light-bg-gray rounded-2xl h-full px-2 lg:py-4 bg-light-bg-gray w-full lg:w-[20em]">
      <div
        className="flex items-center justify-between"
        onClick={() => setIsOpenFilter((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-primary text-3xl mb-3">Üzenetek</h1>
        </div>
        <ChevronDown
          className={` transition-transform duration-300 size-14 md:hidden text-primary ${
            isOpenFilter ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      <div
        className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 md:flex md:overflow-visible ${
          isOpenFilter
            ? "max-h-500 opacity-100"
            : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
        }`}
      >
        <InputGroup className="mb-3 shadow-2xl">
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
          <div className="overflow-auto h-max flex flex-col gap-5 bg-background rounded-xl p-3">
            {users
              .filter((u) =>
                u.participantName.toLowerCase().includes(searchUser),
              )
              .map((u) => (
                <div
                  key={u.chatId}
                  className={`flex gap-3 relative items-center bg-light-bg-gray rounded-lg px-2 py-1 hover:bg-secondary transition-all duration-300 ${id === u.chatId && "bg-primary text-white"}`}
                  onClick={() => {
                    handleFetch();
                    updateQuery("chatId", u.chatId);
                  }}
                >
                  <Avatar>
                    <AvatarImage src={u.participantImageURL}></AvatarImage>
                  </Avatar>
                  <h2 className="truncate max-w-56">{u.participantName}</h2>
                  {u.newMessage && (
                    <div className="h-4 w-4 absolute -top-1 -right-1 rounded-[50%] bg-red-600"></div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSidebar;
