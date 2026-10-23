import LogoSlot from "@/components/ui/LogoSlot";
import type { SiteContent } from "@/lib/content";

interface FooterProps {
  footer: SiteContent["footer"];
  theme: SiteContent["theme"];
  event: SiteContent["event"];
}

export default function Footer({ footer, theme, event }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-tgu-dark py-12">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <LogoSlot src={theme.logo} alt={theme.logoAlt} size="footer" />
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-tgu-muted">
              {footer.tagline}
            </p>
          </div>

          {footer.links.length > 0 && (
            <div>
              <h4 className="font-heading text-sm font-semibold text-white">{footer.linksTitle}</h4>
              <ul className="mt-4 space-y-2">
                {footer.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-tgu-muted transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-heading text-sm font-semibold text-white">{footer.contactsTitle}</h4>
            <ul className="mt-4 space-y-2 font-body text-sm text-tgu-muted">
              {event.contactEmail && (
                <li>
                  <a href={`mailto:${event.contactEmail}`} className="hover:text-white">
                    {event.contactEmail}
                  </a>
                </li>
              )}
              <li>{event.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-white/10 pt-8 font-body text-xs text-tgu-muted md:flex-row">
          <p>{footer.copyright}</p>
          {(footer.note || footer.noteLinkLabel) && (
            <p>
              {footer.note}{" "}
              {footer.noteLinkLabel && (
                <a
                  href={footer.noteLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {footer.noteLinkLabel}
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
