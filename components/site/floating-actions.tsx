"use client";

import { useSyncExternalStore } from "react";
import { Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/content/site";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useBrandMotion } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./brand-icons";

/** Reveal point, as a fraction of the viewport — roughly the foot of the hero. */
const REVEAL_AT = 0.8;

/** `wa.me` takes the number in digits only, no `+` and no separators. */
const whatsappHref = `https://wa.me/${site.phone.replace(/\D/g, "")}`;

/**
 * The gold `icon` button is 44px; at the corner these carry more weight than a
 * social glyph, so they run one step larger with a shadow and a hairline ring —
 * gold on cream (the branches section) is the site's one weak pairing, and the
 * ring is what keeps the disc's edge legible there.
 */
const fab =
  "size-13 shadow-brand-md ring-1 ring-green-900/10 hover:-translate-y-0.5 [&_svg]:size-[22px]";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/**
 * A boolean, not a pixel offset — React re-renders only on the flip, so the
 * scroll listener costs one comparison per frame and nothing else. Reading it
 * through the store (rather than an effect) also covers the reload that lands
 * mid-page with the scroll already restored and no event to follow.
 */
const getSnapshot = () => window.scrollY > window.innerHeight * REVEAL_AT;

/** The first paint is the top of the page, on the server as in the browser. */
const getServerSnapshot = () => false;

/**
 * The two ways to reach the house, parked in the bottom-end corner for the whole
 * scroll. The header carries the same phone number, but it condenses away over
 * the first 140px — past the hero these are the only contact affordances on
 * screen.
 *
 * They stay out of the first frame on purpose: the hero is the one cinematic
 * beat on the page, and two gold discs sitting over it would read as a widget.
 *
 * `end-6`, not `right-6` — the stack flips with the document in Arabic. `z-40`
 * puts it under the header, the reservation dialog and the skip link, all of
 * which should win when they are on screen.
 */
export function FloatingActions() {
  const { t } = useLanguage();
  const { softScale, stagger } = useBrandMotion();
  const shown = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed end-6 bottom-6 z-40 flex flex-col gap-3"
        >
          <motion.div variants={softScale}>
            <Button asChild variant="gold" size="icon" className={fab}>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={t.a11y.whatsapp}
              >
                <WhatsAppIcon />
              </a>
            </Button>
          </motion.div>

          <motion.div variants={softScale}>
            <Button asChild variant="gold" size="icon" className={fab}>
              <a href={`tel:${site.phone}`} aria-label={t.nav.call}>
                <Phone />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
