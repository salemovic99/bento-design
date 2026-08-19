"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Tabs on Radix, themed to the brand.
 *
 * Radix reads direction from the nearest `Direction.Provider` (wired up in
 * LanguageProvider), so in Arabic the arrow keys traverse the rail right to
 * left without a single `rtl:` variant — which is most of the reason this is
 * a Radix primitive rather than a hand-rolled row of buttons. The roving
 * tabindex, `aria-selected` and panel wiring come with it.
 *
 * The rail is a hairline underline rather than a row of pills: this is a menu
 * on a dark ground, and boxes around the category names would read as buttons
 * in a shop rather than headings on a card.
 */

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex w-full items-stretch gap-6 overflow-x-auto border-b border-gold-600/15 sm:gap-10",
        // The rail can outrun a phone; let it scroll on its own axis rather
        // than wrap, and snap so a category never rests half off-screen.
        "snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group/tab relative shrink-0 cursor-pointer snap-start whitespace-nowrap bg-transparent pb-4 pt-2 outline-none",
        "text-[0.6875rem] font-medium uppercase tracking-[0.2em] sm:text-xs",
        "text-gold-200/55 transition-colors duration-300 ease-[var(--ease-brand)]",
        "hover:text-gold-200 data-[state=active]:text-white",
        // A 44px-tall hit area without a 44px-tall box: the pseudo-element
        // reaches past the label instead of the padding pushing the rail open.
        "before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']",
        className,
      )}
      {...props}
    >
      {children}
      {/*
        The active mark. It is drawn on every trigger and scaled to nothing
        when inactive, so switching category animates a rule rather than
        mounting one — and the transform never costs a layout pass.
      */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-gold-600 rtl:origin-right",
          "transition-transform duration-500 ease-[var(--ease-brand)]",
          "group-data-[state=active]/tab:scale-x-100",
        )}
      />
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
