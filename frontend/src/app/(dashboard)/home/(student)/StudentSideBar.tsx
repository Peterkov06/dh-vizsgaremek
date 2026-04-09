"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import fetchWithAuth from "@/lib/api-client";
import { User } from "@/lib/auth";
import {
  Bell,
  Book,
  Calendar,
  Cog,
  House,
  LogOut,
  MessageCircle,
  Search,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { title: "Főoldal", url: "/home", icon: House },
  { title: "Kurzusaim", url: "/home/course", icon: Book },
  { title: "Üzenetek", url: "/home/message", icon: MessageCircle },
  { title: "Órarend", url: "/home/time_table", icon: Calendar },
  { title: "Kereső", url: "/home/search", icon: Search },
  { title: "Értesítések", url: "/home/notifications", icon: Bell },
  { title: "Pénzügyek", url: "/home/money", icon: Wallet },
];

const StudentSideBar = (props: { user: User }) => {
  const pathname = usePathname();
  const router = useRouter();

  const OnLogout = async () => {
    await fetchWithAuth("api/auth/logout");
    router.push("/login"); //Gány megoldás
  };

  return (
    <Sidebar className="text-white" collapsible="icon">
      <SidebarHeader>
        <span className="truncate font-bold group-data-[collapsible=icon]:hidden">
          Vizsga Remek
        </span>
        <div className="flex items-center gap-2 text-2xl m-auto mt-5">
          <Avatar className="size-10 group-data-[collapsible=icon]:size-6">
            <AvatarImage
              src={props.user.profilePicUrl || "/defaults/default_avatar.jpg"}
            ></AvatarImage>
          </Avatar>
          <p className="turncate group-data-[collapsible=icon]:hidden transition-all duration-500">
            {props.user.fullName}
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent className="h-full flex justify-center group-data-[collapsible=icon]:justify-start! transition-all duration-500">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
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
                      hover:text-sidebar-primary
                      
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Cog className="size-10 group-data-[collapsible=icon]:size-6"></Cog>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-lg">Beállítások</p>
              </TooltipContent>
            </Tooltip>
          </Link>
          <Link href={"login"} onClick={OnLogout}>
            <Tooltip>
              <TooltipTrigger asChild>
                <LogOut className="size-10 group-data-[collapsible=icon]:size-6"></LogOut>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-lg">Kijelentkezés</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudentSideBar;
