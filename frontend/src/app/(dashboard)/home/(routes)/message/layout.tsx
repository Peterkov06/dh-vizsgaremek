import { ReactNode } from "react";
import ForceSideBarClose from "../course/components/ForceSideBarClose";
import MessageSidebar from "./components/MessageSidebar";

const MessageLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full flex gap-10">
      <ForceSideBarClose></ForceSideBarClose>
      <MessageSidebar></MessageSidebar>
      <div className="flex-1">{children}</div>
    </main>
  );
};

export default MessageLayout;
