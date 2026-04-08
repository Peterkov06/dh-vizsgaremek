import { ReactNode } from "react";
import ForceSideBarClose from "../components/ForceSideBarClose";
import CourseSidebar from "../components/CourseSidebar";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full flex-col flex lg:flex-row gap-3 lg:gap-10">
      <ForceSideBarClose></ForceSideBarClose>
      <CourseSidebar></CourseSidebar>
      <div className="flex-1">{children}</div>
    </main>
  );
};

export default DashboardLayout;
