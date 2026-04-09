"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.back();
      }}
      variant={"outline"}
      className="border-0 w-9 h-9"
    >
      <ArrowLeft></ArrowLeft>
    </Button>
  );
};

export default BackButton;
