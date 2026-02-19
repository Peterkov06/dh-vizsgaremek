import { checkLogin } from "@/lib/auth";
import { ReactNode } from "react";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const loginResponse = await checkLogin();
  if (loginResponse?.status === 401) {
    
  }

  return <div className="min-h-screen w-full">{children}</div>;
};

export default DashboardLayout;
