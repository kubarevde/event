"use client";

import Script from "next/script";

const YANDEX_FORM_ID = "6a45d0f96d2d731fe3a0e6bb";
const YANDEX_FORM_SRC = `https://forms.yandex.ru/u/${YANDEX_FORM_ID}?iframe=1&theme=dark`;

export default function YandexFormEmbed() {
  return (
    <>
      <Script src="https://forms.yandex.ru/_static/embed.js" strategy="lazyOnload" />
      <div className="yandex-form-embed">
        <iframe
          src={YANDEX_FORM_SRC}
          frameBorder={0}
          name={`ya-form-${YANDEX_FORM_ID}`}
          title="Заявка на участие в круглом столе ТГУ"
          className="yandex-form-embed__frame"
        />
      </div>
    </>
  );
}
