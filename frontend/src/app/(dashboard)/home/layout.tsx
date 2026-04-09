import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import StudentSideBar from "./(student)/StudentSideBar";
import getCurrentUser from "@/lib/auth";
import { redirect } from "next/navigation";
import TeacherSidebar from "./(teacher)/TeacherSidebar";
import { Button } from "@/components/ui/button";
import BackButton from "./(teacher)/components/BackButton";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      {user.role === "Student" ? (
        <StudentSideBar user={user}></StudentSideBar>
      ) : (
        <TeacherSidebar user={user}></TeacherSidebar>
      )}
      <main className="w-full h-screen">
        <div className="absolute flex lg:flex-col">
          <SidebarTrigger></SidebarTrigger>
          <BackButton></BackButton>
        </div>
        <div className="px-4 lg:px-16 pt-8 pb-5 h-screen">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
