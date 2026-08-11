"use client";

import { site, type SocialKey } from "@/content/site";
import { useLanguage } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from "./brand-icons";

const ICONS = {
  instagram: InstagramIcon,
  twitter: XIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
} as const;

const LABEL_KEY = {
  instagram: "instagram",
  twitter: "twitter",
  facebook: "facebook",
  youtube: "youtube",
} as const satisfies Record<SocialKey, string>;

export function SocialLinks({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { t } = useLanguage();

  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {site.socials.map(({ key, href }) => {
        const Icon = ICONS[key];
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={t.a11y[LABEL_KEY[key]]}
              // 44px hit area regardless of the glyph size inside it.
              className="grid size-11 place-items-center rounded-full opacity-75 transition-[opacity,transform] duration-300 ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:opacity-100"
            >
              <Icon className={size === "sm" ? "size-4" : "size-[18px]"} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
