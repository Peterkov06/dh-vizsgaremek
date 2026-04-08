"use client";

import { useSearchParams } from "next/navigation";
import MessageWall from "./components/MessageWall";

const MessagePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <main className="w-full h-full">
      {id ? (
        <MessageWall id={id}></MessageWall>
      ) : (
        <div className="w-full h-full bg-light-bg-gray rounded-2xl flex justify-center items-center text-3xl text-primary">
          Válassz ki egy személyt
        </div>
      )}
    </main>
  );
};

export default MessagePage;
