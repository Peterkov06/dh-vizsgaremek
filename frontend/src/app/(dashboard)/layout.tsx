import { ReactNode } from "react";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  return <div className="min-h-screen w-full">{children}</div>;
};

export default DashboardLayout;
