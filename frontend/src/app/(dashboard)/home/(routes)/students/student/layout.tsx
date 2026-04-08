import { ReactNode } from "react";
import ForceSideBarClose from "../../course/components/ForceSideBarClose";
import StudentPageSidebar from "./components/StudentPageSidebar";

const StudentLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full flex gap-10 h-full">
      <ForceSideBarClose></ForceSideBarClose>
      <StudentPageSidebar></StudentPageSidebar>
      <div className="flex-1 h-full">{children}</div>
    </main>
  );
};

export default StudentLayout;
