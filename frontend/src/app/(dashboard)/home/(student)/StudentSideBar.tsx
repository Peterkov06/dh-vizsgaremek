"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import fetchWithAuth from "@/lib/api-client";
import { User } from "@/lib/auth";
import { Book, Cog, House, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { title: "Főoldal", url: "/home", icon: House },
  { title: "Kurzusaim", url: "/home/course", icon: Book },
];

const StudentSideBar = (props: { user: User }) => {
  const pathname = usePathname();
  const router = useRouter();

  const OnLogout = async () => {
    await fetchWithAuth("api/auth/logout");
    router.push("/login"); //Gány megoldás
  };

  return (
    <Sidebar className="bg-primary text-white" collapsible="icon">
      <SidebarHeader>
        <span className="truncate font-bold group-data-[collapsible=icon]:hidden">
          Vizsga Remek
        </span>
        <p className="group-data-[collapsible=icon]:hidden">
          {props.user.fullName}
        </p>
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
      <SidebarFooter>
        <div className="flex w-full justify-between p-10 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-4">
          <Link href={"/home/settings"}>
            <Cog className="size-10 group-data-[collapsible=icon]:size-6"></Cog>
          </Link>
          <Link href={"#"} onClick={OnLogout}>
            <LogOut className="size-10 group-data-[collapsible=icon]:size-6"></LogOut>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudentSideBar;
