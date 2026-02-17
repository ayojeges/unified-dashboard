"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
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
  const [internalValue, setInternalValue] = useState(value || "");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal value with prop
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (itemValue: string) => {
    setInternalValue(itemValue);
    if (onValueChange) {
      onValueChange(itemValue);
    }
    setOpen(false);
  };

  // Find selected child label
  let selectedLabel: React.ReactNode = placeholder || "Select...";
  
  const findLabel = (children: React.ReactNode): void => {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === SelectItem && child.props.value === internalValue) {
          selectedLabel = child.props.children;
        } else if (child.type === SelectContent) {
          findLabel(child.props.children);
        }
      }
    });
  };
  findLabel(children);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <span className={cn("truncate", !internalValue && "text-muted-foreground")}>
          {selectedLabel}
        </span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
      </button>
      
      {open && (
        <div 
          className="absolute z-[9999] mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
          style={{ minWidth: '100%' }}
        >
          <div className="max-h-60 overflow-auto p-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                if (child.type === SelectContent) {
                  return React.Children.map(child.props.children, (item) => {
                    if (React.isValidElement<SelectItemProps>(item) && item.type === SelectItem) {
                      return React.cloneElement(item, {
                        onSelect: () => handleSelect(item.props.value),
                        isSelected: item.props.value === internalValue,
                      });
                    }
                    return item;
                  });
                }
                if (child.type === SelectItem) {
                  return React.cloneElement(child as React.ReactElement<SelectItemProps>, {
                    onSelect: () => handleSelect((child as React.ReactElement<SelectItemProps>).props.value),
                    isSelected: (child as React.ReactElement<SelectItemProps>).props.value === internalValue,
                  });
                }
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function SelectItem({ value, children, onSelect, isSelected }: SelectItemProps) {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        isSelected && "bg-accent/50"
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSelect) onSelect();
      }}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}

// Wrapper components for compatibility
export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <>{children}</>;
}

export function SelectValue({ placeholder }: { placeholder?: string; children?: React.ReactNode }) {
  return null;
}