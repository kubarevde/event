"use client";

import Button from "@/components/ui/Button";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Partners() {
  return (
    <section id="partners" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-heading text-3xl font-extrabold text-tgu-dark-text md:text-4xl">
          Среди участников
        </h2>
        <p className="mt-2 font-body text-tgu-dark-text/70">
          Заполни место своей компании — пока есть возможность
        </p>

        {/* TODO: замени заглушки реальными логотипами.
            Рекомендуется SVG или PNG с прозрачным фоном.
            Примерный размер: 140x56px */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="flex h-16 w-36 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-xs font-medium text-gray-400 transition-opacity hover:opacity-60"
            >
              Компания {i + 1}
            </div>
          ))}
        </div>

        <p className="mt-10 font-body text-tgu-dark-text">
          Хотите видеть здесь логотип своей компании?
        </p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => scrollTo("registration")}
        >
          Подать заявку
        </Button>
      </div>
    </section>
  );
}
