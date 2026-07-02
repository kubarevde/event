"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const YANDEX_FORM_ID = "6a45d0f96d2d731fe3a0e6bb";
const YANDEX_FORM_SRC = `https://forms.yandex.ru/u/${YANDEX_FORM_ID}?iframe=1&theme=dark`;

/** Высота footer.Footer_branded внутри iframe (логотип + ссылки). */
const FOOTER_HEIGHT = 54;

export default function YandexFormEmbed() {
  const shellRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const iframe = iframeRef.current;
    if (!shell || !iframe) return;

    const syncHeight = () => {
      const fullHeight = iframe.offsetHeight;
      if (fullHeight <= FOOTER_HEIGHT) return;
      shell.style.height = `${fullHeight - FOOTER_HEIGHT}px`;
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(iframe);

    iframe.addEventListener("load", syncHeight);

    return () => {
      observer.disconnect();
      iframe.removeEventListener("load", syncHeight);
    };
  }, []);

  return (
    <>
      <Script src="https://forms.yandex.ru/_static/embed.js" strategy="lazyOnload" />
      <div ref={shellRef} className="yandex-form-embed">
        <iframe
          ref={iframeRef}
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
