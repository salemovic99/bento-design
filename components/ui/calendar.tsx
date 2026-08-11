"use client";

import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Calendar on react-day-picker v9, themed to the brand.
 *
 * `dir` is passed through from the caller so the grid, the month navigation
 * and the keyboard arrows all flip with the page; the chevrons swap glyphs
 * rather than being CSS-mirrored, which keeps their optical weight correct.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  dir = "ltr",
  ...props
}: DayPickerProps) {
  const isRtl = dir === "rtl";

  return (
    <DayPicker
      dir={dir}
      showOutsideDays={showOutsideDays}
      className={cn("p-1 text-green-900", className)}
      classNames={{
        months: "flex flex-col gap-4",
        month: "relative flex flex-col gap-3",
        month_caption: "flex h-9 items-center justify-center px-10",
        caption_label:
          "text-xs font-medium uppercase tracking-[0.18em] text-green-600",
        nav: "absolute inset-x-1 top-1 flex items-center justify-between",
        button_previous:
          "grid size-8 cursor-pointer place-items-center rounded-full text-green-600/70 transition-colors duration-200 hover:bg-green-600/8 hover:text-green-600 disabled:pointer-events-none disabled:opacity-30",
        button_next:
          "grid size-8 cursor-pointer place-items-center rounded-full text-green-600/70 transition-colors duration-200 hover:bg-green-600/8 hover:text-green-600 disabled:pointer-events-none disabled:opacity-30",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-green-600/75",
        weeks: "flex flex-col gap-0.5",
        week: "flex w-full gap-0.5",
        day: "size-9 p-0",
        day_button:
          "size-9 cursor-pointer rounded-full text-sm font-light tabular-nums transition-colors duration-200 hover:bg-green-600/8 disabled:pointer-events-none",
        selected:
          "[&>button]:bg-green-600 [&>button]:font-medium [&>button]:text-white [&>button]:hover:bg-green-600",
        today: "[&>button]:text-gold-800 [&>button]:font-medium",
        outside: "[&>button]:text-green-600/25",
        disabled: "[&>button]:text-green-600/20 [&>button]:line-through",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass }) => {
          // `orientation` is already direction-aware in v9; map it to the
          // matching glyph so RTL gets a real right-pointing "previous".
          const Icon =
            orientation === (isRtl ? "right" : "left")
              ? ChevronLeft
              : ChevronRight;
          return <Icon className={cn("size-4", chevronClass)} aria-hidden />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
