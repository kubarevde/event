"use client";

import { CalendarPlus, Check, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/ui/CountdownTimer";
import DynamicForm from "@/components/ui/DynamicForm";
import SectionTitle from "@/components/ui/SectionTitle";
import type { SiteContent } from "@/lib/content";
import type { FormSchema } from "@/lib/forms";

interface RegistrationProps {
  registration: SiteContent["registration"];
  event: SiteContent["event"];
  countdownLabel: string;
  startIso: string;
  endIso: string;
  form: { id: string; schema: FormSchema } | null;
}

function icsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

function downloadCalendar(event: SiteContent["event"], startIso: string, endIso: string) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//event-landing//RU",
    "BEGIN:VEVENT",
    `UID:${icsDate(startIso)}-${encodeURIComponent(event.title).slice(0, 40)}@event`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `DTSTART:${icsDate(startIso)}`,
    `DTEND:${icsDate(endIso)}`,
    `LOCATION:${icsEscape(`${event.venue}, ${event.address}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "event.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Registration({
  registration,
  event,
  countdownLabel,
  startIso,
  endIso,
  form,
}: RegistrationProps) {
  return (
    <section id="registration" className="relative bg-tgu-dark py-20 md:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-tgu-brand" aria-hidden />
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionTitle
              eyebrow={registration.eyebrow}
              title={registration.title}
              subtitle={registration.subtitle}
              light
              accent
              align="left"
            />

            <ul className="space-y-3">
              {registration.offerItems.map((text) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-tgu-brand" strokeWidth={2} aria-hidden />
                  <span className="font-body text-sm text-white/75">{text}</span>
                </li>
              ))}
            </ul>

            {registration.privacyNote && (
              <div className="mt-8 flex items-start gap-3 border border-white/10 p-4">
                <Shield className="h-4 w-4 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
                <p className="font-body text-xs leading-relaxed text-white/65">
                  {registration.privacyNote}{" "}
                  {registration.privacyLinkLabel && event.privacyPolicyUrl && (
                    <>
                      <a
                        href={event.privacyPolicyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tgu-brand hover:underline"
                      >
                        {registration.privacyLinkLabel}
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
            )}

            {registration.calendarLabel && (
              <Button
                variant="outline"
                className="mt-6 border-white/30 text-white hover:bg-white/5"
                onClick={() => downloadCalendar(event, startIso, endIso)}
              >
                <CalendarPlus className="mr-2 h-4 w-4" aria-hidden />
                {registration.calendarLabel}
              </Button>
            )}

            <div className="mt-8">
              <p className="mb-3 font-body text-xs text-white/65">{countdownLabel}</p>
              <CountdownTimer targetDate={startIso} compact dark />
            </div>
          </div>

          <div className="border border-white/10 bg-tgu-dark-elevated/80 p-6 md:p-8">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-tgu-brand">
              {registration.formTitle}
            </p>

            <div className="mt-6 border-t border-white/10 pt-6">
              {form ? (
                <DynamicForm formId={form.id} schema={form.schema} />
              ) : (
                <p className="font-body text-sm text-white/65">Приём заявок временно закрыт.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
