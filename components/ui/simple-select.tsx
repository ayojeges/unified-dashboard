"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function Select({ value, onValueChange, children, placeholder, className }: SelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (itemValue: string) => {
    onValueChange(itemValue);
    setOpen(false);
  };

  // Find selected child
  let selectedLabel: React.ReactNode = placeholder || "Select...";
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<SelectItemProps>(child) && child.props.value === value) {
      selectedLabel = child.props.children;
    }
  });

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="max-h-60 overflow-auto p-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement<SelectItemProps>(child)) {
                return React.cloneElement(child, {
                  onSelect: () => handleSelect(child.props.value),
                  isSelected: child.props.value === value,
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function SelectItem({ value, children, onSelect, isSelected }: SelectItemProps & { onSelect?: () => void; isSelected?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground"
      )}
      onClick={onSelect}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          ✓
        </span>
      )}
      {children}
    </div>
  );
}

// Export empty components for compatibility
export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between", className)}>{children}</div>;
}

export function SelectValue({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}