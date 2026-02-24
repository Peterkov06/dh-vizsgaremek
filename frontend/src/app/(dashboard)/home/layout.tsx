import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import StudentSideBar from "./(student)/StudentSideBar";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <StudentSideBar></StudentSideBar>
      <main className="w-full h-screen">
        <SidebarTrigger className="absolute"></SidebarTrigger>
        <div className="pr-10 pl-10 pt-8 pb-5 h-screen">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
