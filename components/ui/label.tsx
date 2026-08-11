"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // The control sits after the label in the DOM, so state travels down
        // from the shared `.group` wrapper rather than through a peer selector.
        "flex select-none items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-green-600 transition-colors duration-300 group-focus-within:text-gold-700",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
