"use client";

import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((o) => !o);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const labelFor = (value: string) => options.find((o) => o.value === value)?.label ?? value;

  return (
    <div className={className}>
      <div className="border-2 border-border rounded-md p-2">
        <div className="flex flex-wrap gap-2">
          {selected.length === 0 && (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
          {selected.map((v) => (
            <Badge key={v} variant="secondary" className="flex items-center gap-1">
              {labelFor(v)}
              <button
                type="button"
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                onClick={() => onChange(selected.filter((s) => s !== v))}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <button
          type="button"
          onClick={toggle}
          className="mt-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground border rounded-md flex items-center justify-between"
        >
          <span>Choose tags</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="mt-2 border rounded-md bg-card">
          <ul className="max-h-48 overflow-auto">
            {options.map((opt) => (
              <li key={opt.value} className="flex items-center gap-2 px-3 py-2 hover:bg-muted">
                <input
                  id={`opt-${opt.value}`}
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => handleSelect(opt.value)}
                />
                <label htmlFor={`opt-${opt.value}`} className="cursor-pointer">
                  {opt.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
