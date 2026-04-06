import { ReactNode } from "react";
import ForceSideBarClose from "../course/components/ForceSideBarClose";
import TimeTableSidebar from "./components/TimeTableSidebar";

const TimeTableLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full flex gap-10">
      <ForceSideBarClose></ForceSideBarClose>
      <TimeTableSidebar></TimeTableSidebar>
      <div className="flex-1">{children}</div>
    </main>
  );
};

export default TimeTableLayout;
