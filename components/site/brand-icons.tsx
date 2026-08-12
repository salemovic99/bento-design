import type { SVGProps } from "react";

/**
 * lucide-react v1 removed its brand glyphs, so the social and messaging marks
 * are drawn here on Lucide's own 24×24 grid with the same 1.5 stroke weight.
 * Everything else on the site uses Lucide directly — this file exists only so
 * those marks sit optically alongside `Phone`, `MapPin` and the arrows.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

/** The X mark is a solid glyph, so it fills rather than strokes. */
export function XIcon(props: IconProps) {
  return (
    <svg
      {...base}
      fill="currentColor"
      stroke="none"
      strokeWidth={0}
      aria-hidden
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Also a solid glyph: the bubble with the handset, drawn as one filled path. */
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      {...base}
      fill="currentColor"
      stroke="none"
      strokeWidth={0}
      aria-hidden
      {...props}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91a9.85 9.85 0 0 0 1.35 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24M8.4 7.33c-.17 0-.44.06-.68.31-.23.26-.89.87-.89 2.12s.92 2.46 1.04 2.63c.13.16 1.79 2.73 4.33 3.83.61.26 1.08.42 1.44.53.61.2 1.16.17 1.6.1.49-.07 1.5-.61 1.72-1.21s.21-1.11.15-1.21c-.07-.11-.24-.17-.5-.29-.25-.13-1.49-.74-1.72-.82-.24-.09-.41-.13-.58.12-.17.26-.66.83-.81 1-.15.17-.3.19-.55.07-.26-.13-1.08-.4-2.05-1.27a7.6 7.6 0 0 1-1.42-1.76c-.15-.25-.02-.39.11-.51.11-.12.25-.3.38-.45.12-.15.16-.26.24-.43.09-.17.04-.32-.02-.45-.06-.12-.55-1.37-.78-1.87-.19-.4-.38-.4-.55-.41z" />
    </svg>
  );
}
