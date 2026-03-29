"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function AvatarUploader() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageSrc(url);

    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={handleClick}
        className="flex justify-center items-center absolute w-24 h-24 bg-black -bottom-7 left-5 rounded-[50%] cursor-pointer overflow-hidden group"
      >
        {imageSrc ? (
          <>
            <Image src={imageSrc} alt="Avatar" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Plus className="size-8 text-white" />
            </div>
          </>
        ) : (
          <Plus className="size-20 text-primary-foreground" />
        )}
      </div>
    </>
  );
}
