"use client";

import { useSearchParams } from "next/navigation";

const MessagePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return <div>{id}</div>;
};

export default MessagePage;
