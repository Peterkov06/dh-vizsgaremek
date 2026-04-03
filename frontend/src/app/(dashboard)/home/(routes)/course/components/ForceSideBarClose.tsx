"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

const ForceSideBarClose = () => {
  const { setOpen, open, isMobile } = useSidebar();

  useEffect(() => {
    setOpen(false);

    const trigger = document.querySelector(
      "[data-sidebar='trigger']",
    ) as HTMLElement;
    if (trigger && !isMobile) trigger.style.display = "none";

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
