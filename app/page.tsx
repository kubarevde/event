import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Tracker from "@/components/layout/Tracker";
import Directions from "@/components/sections/Directions";
import Faq from "@/components/sections/Faq";
import Formats from "@/components/sections/Formats";
import Hero from "@/components/sections/Hero";
import Registration from "@/components/sections/Registration";
import Speakers from "@/components/sections/Speakers";
import Value from "@/components/sections/Value";
import WhyImportant from "@/components/sections/WhyImportant";
import { eventEnd, eventStart } from "@/lib/content";
import { getContent, getForm } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function Home() {
  const c = getContent();
  const startIso = eventStart(c).toISOString();
  const endIso = eventEnd(c).toISOString();
  const form = getForm(c.registration.formId);
  const reg = c.registration.enabled;

  // Пункты меню, ведущие на скрытые секции, не показываем.
  const enabled: Record<string, boolean> = {
    why: c.why.enabled,
    value: c.value.enabled,
    directions: c.directions.enabled,
    formats: c.formats.enabled,
    speakers: c.speakers.enabled,
    registration: reg,
    faq: c.faq.enabled,
    venue: c.faq.enabled && c.faq.showVenue,
  };
  const nav = { ...c.nav, links: c.nav.links.filter((l) => enabled[l.target] !== false) };

  return (
    <>
      <Tracker />
      <Navbar nav={nav} theme={c.theme} showCta={reg} />
      <main>
        <Hero hero={c.hero} event={c.event} theme={c.theme} startIso={startIso} showRegistration={reg} />
        {c.why.enabled && <WhyImportant why={c.why} />}
        {c.value.enabled && <Value value={c.value} showCta={reg} />}
        {c.directions.enabled && <Directions directions={c.directions} />}
        {c.formats.enabled && <Formats formats={c.formats} event={c.event} showCta={reg} />}
        {c.speakers.enabled && <Speakers speakers={c.speakers} />}
        {reg && (
          <Registration
            registration={c.registration}
            event={c.event}
            countdownLabel={c.hero.countdownLabel}
            startIso={startIso}
            endIso={endIso}
            form={form ? { id: form.id, schema: form.schema } : null}
          />
        )}
        {c.faq.enabled && <Faq faq={c.faq} event={c.event} />}
      </main>
      <Footer footer={c.footer} theme={c.theme} event={c.event} />
      <ScrollToTop />
    </>
  );
}
