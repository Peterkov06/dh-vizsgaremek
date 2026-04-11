"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import fetchWithAuth from "@/lib/api-client";
import { Search } from "lucide-react";
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
          {users
            .filter((u) => u.participantName.toLowerCase().includes(searchUser))
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
                  <AvatarImage
                    src={
                      u.participantImageURL || "/defaults/default_avatar.jpg"
                    }
                  ></AvatarImage>
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
  );
};

export default MessageSidebar;
