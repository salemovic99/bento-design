import type { StaticImageData } from "next/image";
import type { Localized } from "@/lib/i18n/dictionary";

import alula from "@/public/branches/alula.jpg";
import faisaliah from "@/public/branches/faisaliah.jpg";
import laysen from "@/public/branches/laysen.jpg";
import lumiere from "@/public/branches/lumiere.jpg";

/* ────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER DATA
   Branch names and districts are real; street addresses, phone numbers,
   opening hours and map coordinates are approximate stand-ins. Replace them
   with the client's verified details before launch.
   ──────────────────────────────────────────────────────────────────────────── */

export type Branch = {
  id: string;
  image: StaticImageData;
  name: Localized;
  city: Localized;
  district: Localized;
  address: Localized;
  hours: Localized;
  phone: string;
  phoneDisplay: string;
  /** [lat, lng] — drives both the Maps link and the pin on the map tile. */
  coords: [number, number];
  /**
   * Pin position on the stylised map tile, as a percentage of the tile box.
   * Hand-placed to read as a map rather than plotted from real projection.
   */
  pin: { x: number; y: number };
  span: string;
  focus?: string;
};

export const branches: Branch[] = [
  {
    id: "faisaliah",
    image: faisaliah,
    name: { en: "Al Faisaliah", ar: "الفيصلية" },
    city: { en: "Riyadh", ar: "الرياض" },
    district: { en: "Al Olaya", ar: "العليا" },
    address: {
      en: "Al Faisaliah Tower, King Fahd Road, Al Olaya, Riyadh 12212",
      ar: "برج الفيصلية، طريق الملك فهد، العليا، الرياض 12212",
    },
    hours: { en: "Daily · 13:00 – 01:00", ar: "يوميًا · 13:00 – 01:00" },
    phone: "+966112930001",
    phoneDisplay: "+966 11 293 0001",
    coords: [24.6907, 46.6853],
    pin: { x: 46, y: 40 },
    span: "col-span-2 md:col-span-3 lg:col-span-5 lg:row-span-1",
    focus: "50% 55%",
  },
  {
    id: "laysen",
    image: laysen,
    name: { en: "Laysen Valley", ar: "ليسن فالي" },
    city: { en: "Riyadh", ar: "الرياض" },
    district: { en: "Umm Al Hamam", ar: "أم الحمام" },
    address: {
      en: "Laysen Valley, Umm Al Hamam Al Gharbi, Riyadh 12329",
      ar: "ليسن فالي، أم الحمام الغربي، الرياض 12329",
    },
    hours: { en: "Daily · 13:00 – 00:30", ar: "يوميًا · 13:00 – 00:30" },
    phone: "+966112930002",
    phoneDisplay: "+966 11 293 0002",
    coords: [24.6733, 46.6229],
    pin: { x: 41, y: 47 },
    span: "col-span-2 md:col-span-3 lg:col-span-5 lg:row-span-1",
    focus: "50% 50%",
  },
  {
    id: "lumiere",
    image: lumiere,
    name: { en: "Lumière Village", ar: "لوميير فيليدج" },
    city: { en: "Riyadh", ar: "الرياض" },
    district: { en: "Hittin", ar: "حطين" },
    address: {
      en: "Lumière Village, Prince Turki Al Awwal Road, Hittin, Riyadh 13512",
      ar: "لوميير فيليدج، طريق الأمير تركي الأول، حطين، الرياض 13512",
    },
    hours: { en: "Daily · 13:00 – 01:00", ar: "يوميًا · 13:00 – 01:00" },
    phone: "+966112930003",
    phoneDisplay: "+966 11 293 0003",
    coords: [24.7643, 46.6014],
    pin: { x: 38, y: 32 },
    span: "col-span-2 md:col-span-3 lg:col-span-6 lg:row-span-1",
    focus: "50% 60%",
  },
  {
    id: "alula",
    image: alula,
    name: { en: "AlUla", ar: "العُلا" },
    city: { en: "AlUla", ar: "العُلا" },
    district: { en: "Old Town", ar: "البلدة القديمة" },
    address: {
      en: "AlUla Old Town, Al Ula 43533",
      ar: "البلدة القديمة، العُلا 43533",
    },
    hours: { en: "Seasonal · 17:00 – 00:00", ar: "موسميًا · 17:00 – 00:00" },
    phone: "+966112930004",
    phoneDisplay: "+966 11 293 0004",
    coords: [26.6285, 37.9187],
    pin: { x: 17, y: 22 },
    span: "col-span-2 md:col-span-3 lg:col-span-6 lg:row-span-1",
    focus: "50% 55%",
  },
];

export function mapsUrl(branch: Branch): string {
  const [lat, lng] = branch.coords;
  return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`;
}
