import React, { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecialtyInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function SpecialtyInput({
  value = [],
  onChange,
  placeholder = "Add a specialty and press Enter...",
  className,
}: SpecialtyInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpecialty();
    }
  };

  const addSpecialty = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeSpecialty = (specialtyToRemove: string) => {
    onChange(value.filter((specialty) => specialty !== specialtyToRemove));
  };

  return (
    <div className={cn("relative", className)}>
      <div className="border-input bg-background ring-offset-background focus-within:ring-ring relative flex min-h-11 w-full flex-wrap items-center gap-1 rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
        {value.map((specialty) => (
          <Badge
            key={specialty}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {specialty}
            <button
              type="button"
              onClick={() => removeSpecialty(specialty)}
              className="hover:bg-destructive/20 ml-1 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
