"use client";

import { useSearchParams } from "next/navigation";
import MessageWall from "../../../message/components/MessageWall";

const MessageStudentPage = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  return (
    <main className="h-full">{id && <MessageWall id={id}></MessageWall>}</main>
  );
};

export default MessageStudentPage;
