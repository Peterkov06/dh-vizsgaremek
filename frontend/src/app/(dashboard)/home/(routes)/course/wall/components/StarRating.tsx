"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const labels = ["Borzasztó", "Rossz", "Közepes", "Jó", "Kiváló"];

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRating = ({ value, onChange }: StarRatingProps) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={cn(
            "text-5xl transition-colors",
            star <= (hovered || value)
              ? "text-amber-400"
              : "text-muted-foreground/30",
          )}
        >
          ★
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="self-center text-lg text-muted-foreground ml-2">
          {labels[(hovered || value) - 1]}
        </span>
      )}
    </div>
  );
};

export default StarRating;
