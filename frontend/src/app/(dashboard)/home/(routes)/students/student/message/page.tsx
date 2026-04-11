"use client";

import { useSearchParams } from "next/navigation";
import MessageWall from "../../../message/components/MessageWall";

const MessageStudentPage = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("chatId");

  return (
    <main className="h-[calc(100dvh-10rem)] lg:h-[calc(100dvh-4rem)]">
      {id && <MessageWall></MessageWall>}
    </main>
  );
};

export default MessageStudentPage;
