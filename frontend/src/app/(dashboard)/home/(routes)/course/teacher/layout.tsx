import { ReactNode } from "react";
import ForceSideBarClose from "../components/ForceSideBarClose";
import CourseSidebar from "../components/CourseSidebar";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full h-screen flex gap-10">
      <ForceSideBarClose></ForceSideBarClose>
      <CourseSidebar></CourseSidebar>
      <div className="w-full h-screen">{children}</div>
    </main>
  );
};

export default DashboardLayout;
