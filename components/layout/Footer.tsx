import LogoSlot from "@/components/ui/LogoSlot";
import { EVENT } from "@/data/event";

const LINKS = [
  { label: "Политика обработки ПДн", href: "#" },
  { label: "Согласие на обработку ПДн", href: "#" },
  { label: "Эндаумент-фонд ТГУ", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-tgu-dark py-12">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <LogoSlot size="footer" />
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-tgu-muted">
              Цифровая трансформация — открытый диалог с технологическими партнёрами
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-white">Информация</h4>
            <ul className="mt-4 space-y-2">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-tgu-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-white">Контакты</h4>
            <ul className="mt-4 space-y-2 font-body text-sm text-tgu-muted">
              <li>
                <a href={`mailto:${EVENT.contactEmail}`} className="hover:text-white">
                  {EVENT.contactEmail}
                </a>
              </li>
              <li>{EVENT.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-white/10 pt-8 font-body text-xs text-tgu-muted md:flex-row">
          <p>© 2026 Томский государственный университет</p>
          <p>Взнос поступает в Эндаумент-фонд ТГУ</p>
        </div>
      </div>
    </footer>
  );
}
