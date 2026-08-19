"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The multi-line sibling of `Input`, and it keeps the same stationery rule:
 * one border underneath, colour-only focus, no box.
 *
 * `resize-none` on purpose — a drag handle in the corner of a field that has
 * no box around it reads as a stray artefact, and the field is already tall
 * enough for the two or three lines a table note ever runs to.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "peer field-sizing-content min-h-12 w-full resize-none border-0 border-b border-green-600/25 bg-transparent px-0 py-2.5 text-start text-base font-light text-green-900 outline-none transition-colors duration-300 ease-[var(--ease-brand)]",
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

export { Textarea };
