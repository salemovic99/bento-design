"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button, re-themed to the brand: gold and cream on green, pill or
 * square-ish per the guideline's restrained radii. Press feedback is a scale
 * transform so it never shifts surrounding layout.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap font-medium tracking-[0.14em] uppercase transition-[transform,background-color,border-color,color,opacity] duration-300 ease-[var(--ease-brand)] outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Gold fill — the single primary action on a screen. */
        gold: "bg-gold-600 text-green-900 hover:bg-gold-400",
        /** Ink fill for cream grounds. */
        green: "bg-green-600 text-white hover:bg-green-700",
        /** Hairline outline on dark grounds. */
        outline:
          "border border-gold-600/45 bg-transparent text-gold-200 hover:border-gold-600 hover:bg-gold-600/10 hover:text-white",
        /** Hairline outline on cream grounds. */
        outlineInk:
          "border border-green-600/30 bg-transparent text-green-600 hover:border-green-600 hover:bg-green-600/5",
        ghost:
          "bg-transparent text-gold-200 hover:text-white [&_svg]:transition-transform [&_svg]:duration-300",
      },
      size: {
        sm: "h-10 rounded-full px-5 text-[0.6875rem] [&_svg]:size-4",
        md: "h-12 rounded-full px-7 text-xs [&_svg]:size-4",
        lg: "h-14 rounded-full px-9 text-[0.8125rem] [&_svg]:size-[18px]",
        icon: "size-11 rounded-full [&_svg]:size-[18px]",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
