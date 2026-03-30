"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ImageUploader() {
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

    // Reset input so the same file can be re-selected
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
        className="relative flex justify-center items-center w-full h-40 bg-linear-to-tr from-primary to-secondary rounded-2xl cursor-pointer overflow-hidden group"
      >
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt="Selected image"
              fill
              className="object-cover rounded-2xl"
            />
            {/* Hover overlay to re-select */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <Plus className="size-10 text-white" />
            </div>
          </>
        ) : (
          <Plus className="size-20 text-primary-foreground" />
        )}
      </div>
    </>
  );
}
