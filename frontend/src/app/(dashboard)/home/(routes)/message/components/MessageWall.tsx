"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import fetchWithAuth from "@/lib/api-client";
import { RefreshCcw, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface ChatMessage {
  senderId: string;
  senderName: string;
  senderImage: string;
  text: string;
  sentTime: string;
  isRead: boolean;
  isOwn: boolean;
}

const MessageWall = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  const [chatText, setChatText] = useState<string>("");

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const GetHistory = async () => {
    await fetchWithAuth(`/api/communication/chats/history/${chatId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setChatHistory(data);
      });
  };

  useEffect(() => {
    GetHistory();
  }, [chatId]);

  const formatDateComment = (dateString?: string) => {
    if (!dateString) return;

    return new Date(dateString).toLocaleDateString("hu-HU", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function HandleTextSend() {
    const res = await fetchWithAuth(`/api/communication/chats/${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        text: chatText,
      }),
    });

    if (!res.ok) {
      toast.error("Hiba történt");
    }

    setChatText("");
    GetHistory();
  }

  return (
    <section className="flex flex-col gap-5 w-full h-full bg-light-bg-gray rounded-2xl p-6">
      <Button variant={"outline"} className="w-fit" onClick={GetHistory}>
        <RefreshCcw></RefreshCcw>
      </Button>
      <div className="flex-1 flex flex-col-reverse gap-3 overflow-auto">
        {[...chatHistory].reverse().map((ch) => (
          <div
            className={`relative flex gap-2 w-fit max-w-[70%] items-start bg-background p-2 rounded-2xl mr-2 ${ch.isOwn ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            key={ch.sentTime}
          >
            <Avatar className="size-10">
              <AvatarImage
                src={ch.senderImage || "/defaults/default_avatar.jpg"}
              ></AvatarImage>
            </Avatar>

            <div className={`flex flex-col ${ch.isOwn && "items-end"}`}>
              <h3
                className={`text-sm flex items-center gap-3 ${ch.isOwn && "flex-row-reverse"}`}
              >
                <span>{ch.senderName}</span>
                <span className="text-xs text-gray-500">
                  {formatDateComment(ch.sentTime)}
                </span>
              </h3>
              <h1 className="text-lg">{ch.text}</h1>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-5">
        <Input
          className="bg-background shadow-2xl"
          value={chatText}
          onChange={(e) => {
            setChatText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              HandleTextSend();
            }
          }}
        ></Input>
        <Button disabled={chatText === ""} onClick={HandleTextSend}>
          <Send></Send>
        </Button>
      </div>
    </section>
  );
};

export default MessageWall;
