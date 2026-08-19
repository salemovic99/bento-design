"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Check, Loader2, Phone } from "lucide-react";
import { arSA, enUS } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { branches } from "@/content/branches";
import { site } from "@/content/site";
import { useLanguage } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

type Fields = "branch" | "date" | "time" | "guests" | "name" | "phone";
type Errors = Partial<Record<Fields, string>>;

/** Saudi mobile, with or without the country code. */
const SAUDI_MOBILE = /^(?:\+?966|0)5\d{8}$/;

/**
 * The `guests` value that means "bigger than the form takes". It is a word
 * rather than a number so it can never be mistaken for a party size on the way
 * to the (future) booking endpoint.
 */
const OVER_LIMIT = "over";

/** Longer than this and it is a phone call, not a note. */
const NOTES_MAX = 300;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Deliberately stationery, not admin panel: underline fields, one gold rule
 * under whatever has focus, and no boxes. Validation runs on submit and then
 * live per field, so nothing shouts at the guest while they are still typing.
 *
 * There is no backend in this project — a valid submit opens a confirmation
 * dialog. See the TODO in `handleSubmit` for where the POST belongs.
 */
export function ReservationForm() {
  const { t, dir, lang, dateLocale, pick, plural } = useLanguage();

  const [branch, setBranch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(dateLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [dateLocale],
  );

  const partySizes = useMemo(
    () => Array.from({ length: site.maxPartySize }, (_, i) => i + 1),
    [],
  );

  /**
   * A party the form will not book. Nothing about it is an *error* — the guest
   * answered honestly — so it is never flagged red. The panel below the field
   * takes over and the submit stands down.
   */
  const overLimit = guests === OVER_LIMIT;

  function validate(): Errors {
    const next: Errors = {};
    if (!branch) next.branch = t.reservation.errorBranch;
    if (!date) next.date = t.reservation.errorDate;
    if (!time) next.time = t.reservation.errorTime;
    if (!guests) next.guests = t.reservation.errorGuests;
    if (name.trim().length < 2) next.name = t.reservation.errorName;
    if (!SAUDI_MOBILE.test(phone.replace(/[\s-]/g, "")))
      next.phone = t.reservation.errorPhone;
    return next;
  }

  // Nothing is flagged until the first submit; after that the errors update
  // live as the guest fixes them, rather than staying stale on screen.
  const liveErrors: Errors = submitted ? validate() : {};

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    // The button is already disabled here; this closes the Enter-key route.
    if (overLimit) return;

    const found = validate();
    if (Object.keys(found).length > 0) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setPending(true);
    // TODO: POST to /api/reservations once the booking backend exists.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setPending(false);
    setConfirmOpen(true);
  }

  const selectedBranch = branches.find((b) => b.id === branch);
  const guestCount = Number(guests || 0);

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="mt-9 sm:mt-12">
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {/* ── Branch ─────────────────────────────────────────────── */}
          <Field
            id="res-branch"
            label={t.reservation.branch}
            error={liveErrors.branch}
            className="lg:col-span-3"
          >
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger
                id="res-branch"
                aria-invalid={Boolean(liveErrors.branch)}
                aria-describedby={
                  liveErrors.branch ? "res-branch-error" : undefined
                }
              >
                <SelectValue placeholder={t.reservation.branchPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {pick(b.name)} — {pick(b.district)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* ── Date ───────────────────────────────────────────────── */}
          <Field
            id="res-date"
            label={t.reservation.date}
            error={liveErrors.date}
          >
            <Popover>
              <PopoverTrigger
                id="res-date"
                type="button"
                aria-invalid={Boolean(liveErrors.date)}
                aria-describedby={
                  liveErrors.date ? "res-date-error" : undefined
                }
                className={cn(
                  "flex h-12 w-full cursor-pointer items-center justify-between gap-3 border-0 border-b border-green-600/25 bg-transparent px-0 text-start text-base font-light outline-none transition-colors duration-300 ease-[var(--ease-brand)]",
                  "hover:border-green-600/45 focus:border-gold-600 data-[state=open]:border-gold-600",
                  "aria-invalid:border-red-700",
                  date ? "text-green-900" : "text-green-600/55",
                )}
              >
                <span className="truncate">
                  {date
                    ? dateFormatter.format(date)
                    : t.reservation.datePlaceholder}
                </span>
                <CalendarDays className="size-4 shrink-0 text-gold-700" />
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  dir={dir}
                  disabled={{ before: startOfToday() }}
                  defaultMonth={date ?? startOfToday()}
                  locale={lang === "ar" ? arSA : enUS}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </Field>

          {/* ── Time ───────────────────────────────────────────────── */}
          <Field
            id="res-time"
            label={t.reservation.time}
            error={liveErrors.time}
          >
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger
                id="res-time"
                aria-invalid={Boolean(liveErrors.time)}
                aria-describedby={
                  liveErrors.time ? "res-time-error" : undefined
                }
              >
                <SelectValue placeholder={t.reservation.timePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {site.reservationTimes.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    <span className="e-numeric" dir="ltr">
                      {slot}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* ── Guests ─────────────────────────────────────────────── */}
          <Field
            id="res-guests"
            label={t.reservation.guests}
            error={liveErrors.guests}
          >
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger
                id="res-guests"
                aria-invalid={Boolean(liveErrors.guests)}
                aria-describedby={
                  liveErrors.guests ? "res-guests-error" : undefined
                }
              >
                <SelectValue placeholder={t.reservation.guestsPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {partySizes.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    <span className="e-numeric">{n}</span>{" "}
                    {plural(n, t.reservation.guestCount)}
                  </SelectItem>
                ))}
                <SelectItem value={OVER_LIMIT}>
                  {t.reservation.guestsMore}
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* ── Large party → the call center ──────────────────────── */}
          {overLimit && (
            <div
              role="status"
              className="flex flex-col gap-4 rounded-[var(--radius-brand)] border border-gold-600/30 bg-gold-600/6 p-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:col-span-3"
            >
              <div>
                <p className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-gold-700">
                  {t.reservation.largePartyTitle}
                </p>
                <p className="e-small mt-1.5 max-w-prose text-ink-muted">
                  {t.reservation.largePartyBody}
                </p>
              </div>
              <Button asChild variant="green" className="shrink-0">
                <a href={`tel:${site.phone}`}>
                  <Phone />
                  <span className="e-numeric" dir="ltr">
                    {site.phoneDisplay}
                  </span>
                  <span className="sr-only">— {t.nav.call}</span>
                </a>
              </Button>
            </div>
          )}

          {/* ── Name ───────────────────────────────────────────────── */}
          <Field
            id="res-name"
            label={t.reservation.name}
            error={liveErrors.name}
            className="sm:col-span-1 lg:col-span-2"
          >
            <Input
              id="res-name"
              name="name"
              autoComplete="name"
              placeholder={t.reservation.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(liveErrors.name)}
              aria-describedby={liveErrors.name ? "res-name-error" : undefined}
            />
          </Field>

          {/* ── Phone ──────────────────────────────────────────────── */}
          <Field
            id="res-phone"
            label={t.reservation.phone}
            error={liveErrors.phone}
          >
            <Input
              id="res-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder={t.reservation.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={Boolean(liveErrors.phone)}
              aria-describedby={
                liveErrors.phone ? "res-phone-error" : undefined
              }
              className="e-numeric"
            />
          </Field>

          {/* ── Notes ──────────────────────────────────────────────── */}
          <Field
            id="res-notes"
            label={t.reservation.notes}
            className="sm:col-span-2 lg:col-span-3"
          >
            <Textarea
              id="res-notes"
              name="notes"
              rows={2}
              maxLength={NOTES_MAX}
              placeholder={t.reservation.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-10 flex flex-col items-start gap-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="e-small max-w-sm text-ink-muted">
            {t.reservation.note}
          </p>
          <Button
            type="submit"
            variant="green"
            size="lg"
            disabled={pending || overLimit}
            className="w-full sm:w-auto"
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin" />
                {t.reservation.submitting}
              </>
            ) : (
              t.reservation.submit
            )}
          </Button>
        </div>
      </form>

      {/* ── Confirmation ───────────────────────────────────────────── */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent closeLabel={t.reservation.confirmClose}>
          <DialogHeader>
            <span className="grid size-12 place-items-center rounded-full bg-green-600/10 text-green-600">
              <Check className="size-5" aria-hidden />
            </span>
            <DialogTitle>{t.reservation.confirmTitle}</DialogTitle>
            <DialogDescription>{t.reservation.confirmLede}</DialogDescription>
          </DialogHeader>

          <dl className="mt-7 grid gap-3 border-t border-green-600/12 pt-6 text-sm">
            <SummaryRow
              label={t.reservation.branch}
              value={selectedBranch ? pick(selectedBranch.name) : "—"}
            />
            <SummaryRow
              label={t.reservation.date}
              value={date ? dateFormatter.format(date) : "—"}
            />
            <SummaryRow label={t.reservation.time} value={time} numeric />
            <SummaryRow
              label={t.reservation.guests}
              value={`${guestCount} ${plural(guestCount, t.reservation.guestCount)}`}
            />
            <SummaryRow label={t.reservation.name} value={name} />
            <SummaryRow label={t.reservation.phone} value={phone} numeric />
            {notes.trim() ? (
              <SummaryRow label={t.reservation.notes} value={notes.trim()} />
            ) : null}
          </dl>

          <DialogFooter>
            <Button
              type="button"
              variant="green"
              onClick={() => setConfirmOpen(false)}
            >
              {t.reservation.confirmClose}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Label, control and error, grouped so focus styling has something to hang on. */
function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("group flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-light text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  numeric = false,
}: {
  label: string;
  value: string;
  numeric?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-green-600">
        {label}
      </dt>
      <dd
        className={cn("text-end font-light text-green-900", numeric && "e-numeric")}
        dir={numeric ? "ltr" : undefined}
      >
        {value || "—"}
      </dd>
    </div>
  );
}
