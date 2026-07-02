"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import LogoSlot from "@/components/ui/LogoSlot";

const NAV_LINKS = [
  { label: "Зачем участвовать", href: "#why" },
  { label: "Что получите", href: "#value" },
  { label: "Направления", href: "#directions" },
  { label: "Форматы", href: "#formats" },
  { label: "Спикеры", href: "#speakers" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (href: string) => {
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-[51] h-0.5 origin-left bg-tgu-brand"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.header
        animate={{
          backgroundColor: scrolled ? "rgba(10,22,40,0.97)" : "rgba(10,22,40,0)",
          height: scrolled ? 72 : 88,
        }}
        transition={{ duration: 0.25 }}
        className={`fixed top-0 z-50 w-full ${
          scrolled ? "border-b border-white/10 backdrop-blur-md" : ""
        }`}
      >
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 md:px-6">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              navigate("#hero");
            }}
          >
            <LogoSlot size="header" />
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => navigate(link.href)}
                className="font-body text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("#registration")}
            >
              Подать заявку
            </Button>
            <button
              type="button"
              className="p-2 text-white lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Закрыть меню" : "Меню"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/10 bg-tgu-dark lg:hidden"
            >
              <div className="flex flex-col gap-1 px-5 py-3">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => navigate(link.href)}
                    className="py-2.5 text-left font-body text-sm text-white/80"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
