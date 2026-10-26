"use client";

import type { ReactNode } from "react";
import Tracker from "@/components/layout/Tracker";
import { brandVars } from "@/lib/color";
import type { SectionId, SiteContent } from "@/lib/content";
import type { FormSchema } from "@/lib/forms";
import EditBar from "./EditBar";
import { SiteProvider, useSite } from "./edit";
import Faq from "./Faq";
import Footer from "./Footer";
import FormDrawer from "./FormDrawer";
import Header from "./Header";
import Hero from "./Hero";
import MobileCta from "./MobileCta";
import Program from "./Program";
import Registration from "./Registration";
import Speakers from "./Speakers";
import Why from "./Why";

type Form = { id: string; schema: FormSchema } | null;

function Page({ forms }: { forms: { id: string; name: string; schema: FormSchema }[] }) {
  const { c, editing } = useSite();
  const found = forms.find((f) => f.id === c.registration.formId);
  const form: Form = found ? { id: found.id, schema: found.schema } : null;

  const blocks: Record<SectionId, ReactNode> = {
    why: <Why />,
    speakers: <Speakers />,
    program: <Program />,
    registration: <Registration form={form} />,
    faq: <Faq />,
  };

  return (
    <div className={`bg-tgu-light text-tgu-dark-text ${editing ? "pt-14" : ""}`} style={editing ? brandVars(c.theme) : undefined}>
      {editing ? <EditBar forms={forms} /> : <Tracker />}
      <Header />
      <main id="top">
        <Hero />
        {c.order.map((id) => (
          <div key={id}>{blocks[id]}</div>
        ))}
      </main>
      <Footer />
      <MobileCta />
      {!editing && <FormDrawer form={form} />}
    </div>
  );
}

export default function Landing({
  content,
  editing,
  hasChanges,
  forms,
  isAdmin,
}: {
  content: SiteContent;
  editing: boolean;
  hasChanges: boolean;
  forms: { id: string; name: string; schema: FormSchema }[];
  isAdmin: boolean;
}) {
  return (
    <SiteProvider initial={content} editing={editing} initialHasChanges={hasChanges}>
      <Page forms={forms} />
      {isAdmin && !editing && (
        <a
          href="/?edit=1"
          className="fixed bottom-24 right-4 z-50 rounded-full bg-tgu-dark px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-lg ring-1 ring-white/20 hover:bg-tgu-mid md:bottom-6"
        >
          ✎ Редактировать страницу
        </a>
      )}
    </SiteProvider>
  );
}
