"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Underline field rather than a boxed one — the reservation panel should read
 * as stationery, not as an admin form. The rule under the field is a border,
 * and focus only changes its colour, so nothing reflows.
 */
function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "peer h-12 w-full min-w-0 border-0 border-b border-green-600/25 bg-transparent px-0 text-start text-base font-light text-green-900 outline-none transition-colors duration-300 ease-[var(--ease-brand)]",
        "placeholder:font-light placeholder:text-green-600/55",
        "hover:border-green-600/45 focus:border-gold-600 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-700",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
