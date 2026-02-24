import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import StudentSideBar from "./StudentSideBar";

const StudentHomeLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <StudentSideBar></StudentSideBar>
      <main>
        <SidebarTrigger></SidebarTrigger>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default StudentHomeLayout;
