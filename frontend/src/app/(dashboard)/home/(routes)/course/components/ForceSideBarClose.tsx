"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

const ForceSideBarClose = () => {
  const { setOpen, setOpenMobile, open } = useSidebar();

  useEffect(() => {
    setOpen(false);
    setOpenMobile(false);

    const trigger = document.querySelector(
      "[data-sidebar='trigger']",
    ) as HTMLElement;
    if (trigger) trigger.style.display = "none";

    return () => {
      if (trigger) trigger.style.display = "";
      setOpen(true);
    };
  }, []);

  useEffect(() => {
    if (open) setOpen(false);
  }, [open]);
  return null;
};

export default ForceSideBarClose;
