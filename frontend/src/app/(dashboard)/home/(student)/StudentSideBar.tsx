"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Book, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "Főoldal", url: "/home", icon: House },
  { title: "Kurzusaim", url: "/home/course", icon: Book },
];

const StudentSideBar = () => {
  const pathname = usePathname();
  return (
    <Sidebar className="bg-primary text-white" collapsible="icon">
      <SidebarHeader>
        <span className="truncate font-bold group-data-[collapsible=icon]:hidden">
          Vizsga Remek
        </span>
      </SidebarHeader>
      <SidebarContent className="h-full flex justify-center group-data-[collapsible=icon]:justify-start! transition-all duration-500">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    className="
                      data-[active=true]:bg-white
                      data-[active=true]:font-bold
                      data-[active=true]:text-sidebar-primary
                    "
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-4 text-xl font-bold group-data-[collapsible=icon]:block"
                    >
                      <item.icon
                        size={30}
                        className="shrink-0 size-7! group-data-[collapsible=icon]:size-4!"
                      ></item.icon>
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail></SidebarRail>
    </Sidebar>
  );
};

export default StudentSideBar;
