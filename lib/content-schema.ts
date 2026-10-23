// Описание полей контента для редактора в админке.
// Редактор строится автоматически по этому описанию (components/admin/SchemaEditor.tsx).

export type SchemaField =
  | {
      kind: "text" | "textarea" | "datetime" | "color" | "image" | "icon" | "boolean" | "url";
      key: string;
      label: string;
      help?: string;
    }
  | { kind: "select"; key: string; label: string; help?: string; options: { value: string; label: string }[] }
  | { kind: "strings"; key: string; label: string; help?: string; itemLabel?: string }
  | {
      kind: "list";
      key: string;
      label: string;
      help?: string;
      itemLabel: string;
      titleKey: string;
      fields: SchemaField[];
      newItem: Record<string, unknown>;
    }
  | { kind: "form"; key: string; label: string; help?: string };

export interface SchemaSection {
  id: string;
  title: string;
  description?: string;
  /** Ключ верхнего уровня в SiteContent */
  path: string;
  fields: SchemaField[];
}

const SECTION_TARGETS = [
  { value: "why", label: "Почему это важно" },
  { value: "value", label: "Что получает компания" },
  { value: "directions", label: "Направления" },
  { value: "formats", label: "Форматы" },
  { value: "speakers", label: "Спикеры" },
  { value: "registration", label: "Регистрация" },
  { value: "faq", label: "Вопросы" },
  { value: "venue", label: "Площадка / карта" },
];

const heading = (sectionName: string): SchemaField[] => [
  { kind: "boolean", key: "enabled", label: `Показывать блок «${sectionName}»` },
  { kind: "text", key: "eyebrow", label: "Надзаголовок" },
  { kind: "text", key: "title", label: "Заголовок" },
  { kind: "textarea", key: "subtitle", label: "Подзаголовок" },
];

export const CONTENT_SCHEMA: SchemaSection[] = [
  {
    id: "event",
    title: "Мероприятие",
    description: "Основные параметры: используются в первом экране, таймере, календаре и подвале.",
    path: "event",
    fields: [
      { kind: "text", key: "title", label: "Название мероприятия (заголовок H1)" },
      { kind: "datetime", key: "startLocal", label: "Начало (местное время)" },
      { kind: "datetime", key: "endLocal", label: "Окончание (местное время)" },
      {
        kind: "text",
        key: "utcOffset",
        label: "Часовой пояс площадки (смещение от UTC)",
        help: "Например +07:00 для Томска, +03:00 для Москвы. Используется для таймера и статистики по дням.",
      },
      { kind: "text", key: "dateLabel", label: "Дата текстом", help: "Например: 14 октября 2026, вторник" },
      { kind: "text", key: "timeLabel", label: "Время текстом", help: "Например: 10:00 (Томск)" },
      { kind: "text", key: "venue", label: "Площадка" },
      { kind: "text", key: "address", label: "Адрес" },
      { kind: "text", key: "mapLat", label: "Широта для карты", help: "Пусто — карта не показывается" },
      { kind: "text", key: "mapLon", label: "Долгота для карты" },
      { kind: "text", key: "format", label: "Формат", help: "Например: Очно + онлайн-трансляция" },
      { kind: "text", key: "price", label: "Стоимость", help: "Пусто — блок цены скрыт" },
      { kind: "text", key: "priceNote", label: "Пояснение к стоимости" },
      { kind: "text", key: "limitedNote", label: "Пометка возле цены", help: "Например: Мест ограничено" },
      { kind: "text", key: "contactEmail", label: "Контактный email" },
      { kind: "url", key: "privacyPolicyUrl", label: "Ссылка на политику обработки ПДн" },
    ],
  },
  {
    id: "theme",
    title: "Оформление",
    path: "theme",
    fields: [
      { kind: "image", key: "logo", label: "Логотип", help: "Лучше PNG/SVG с прозрачным фоном, светлый — фон шапки тёмный" },
      { kind: "text", key: "logoAlt", label: "Подпись логотипа (alt)" },
      { kind: "color", key: "primary", label: "Фирменный цвет" },
      { kind: "color", key: "primaryDark", label: "Фирменный цвет — тёмный (наведение на кнопки)" },
      { kind: "color", key: "primaryLight", label: "Фирменный цвет — светлый (фоны, бейджи)" },
    ],
  },
  {
    id: "meta",
    title: "SEO и соцсети",
    path: "meta",
    fields: [
      { kind: "text", key: "title", label: "Заголовок вкладки браузера (title)" },
      { kind: "textarea", key: "description", label: "Описание для поисковиков и соцсетей" },
      { kind: "url", key: "siteUrl", label: "Адрес сайта", help: "Например: https://digital.tsu.ru" },
      { kind: "image", key: "ogImage", label: "Картинка для соцсетей (1200×630)" },
    ],
  },
  {
    id: "nav",
    title: "Меню",
    path: "nav",
    fields: [
      {
        kind: "list",
        key: "links",
        label: "Пункты меню",
        itemLabel: "Пункт",
        titleKey: "label",
        newItem: { label: "Новый пункт", target: "faq" },
        fields: [
          { kind: "text", key: "label", label: "Текст" },
          { kind: "select", key: "target", label: "Ведёт к блоку", options: SECTION_TARGETS },
        ],
      },
      { kind: "text", key: "ctaLabel", label: "Кнопка в шапке" },
    ],
  },
  {
    id: "hero",
    title: "Первый экран",
    path: "hero",
    fields: [
      { kind: "text", key: "badge", label: "Плашка рядом с логотипом" },
      { kind: "text", key: "audienceNote", label: "Пометка об аудитории" },
      { kind: "textarea", key: "subtitle", label: "Подзаголовок" },
      {
        kind: "list",
        key: "bullets",
        label: "Ключевые тезисы",
        itemLabel: "Тезис",
        titleKey: "text",
        newItem: { icon: "Check", text: "Новый тезис" },
        fields: [
          { kind: "icon", key: "icon", label: "Иконка" },
          { kind: "text", key: "text", label: "Текст" },
        ],
      },
      { kind: "text", key: "primaryCta", label: "Основная кнопка (ведёт к форме)" },
      { kind: "text", key: "secondaryCta", label: "Вторая кнопка", help: "Пусто — кнопка скрыта" },
      { kind: "select", key: "secondaryTarget", label: "Вторая кнопка ведёт к блоку", options: SECTION_TARGETS },
      { kind: "text", key: "cardTitle", label: "Заголовок карточки с параметрами" },
      { kind: "text", key: "countdownLabel", label: "Подпись к таймеру" },
    ],
  },
  {
    id: "why",
    title: "Почему это важно",
    path: "why",
    fields: [
      ...heading("Почему это важно"),
      {
        kind: "list",
        key: "reasons",
        label: "Карточки",
        itemLabel: "Карточка",
        titleKey: "title",
        newItem: { icon: "Check", title: "Заголовок", text: "Описание" },
        fields: [
          { kind: "icon", key: "icon", label: "Иконка" },
          { kind: "text", key: "title", label: "Заголовок" },
          { kind: "textarea", key: "text", label: "Текст" },
        ],
      },
      { kind: "text", key: "asideTitle", label: "Цветной блок — заголовок" },
      { kind: "textarea", key: "asideText", label: "Цветной блок — текст" },
      {
        kind: "list",
        key: "stats",
        label: "Цифры",
        itemLabel: "Цифра",
        titleKey: "value",
        newItem: { value: "10", label: "подпись" },
        fields: [
          { kind: "text", key: "value", label: "Значение" },
          { kind: "text", key: "label", label: "Подпись" },
        ],
      },
    ],
  },
  {
    id: "value",
    title: "Что получает компания",
    path: "value",
    fields: [
      ...heading("Что получает компания"),
      { kind: "text", key: "quote", label: "Цитата" },
      { kind: "text", key: "ctaLabel", label: "Кнопка" },
      { kind: "strings", key: "benefits", label: "Список преимуществ", itemLabel: "Пункт" },
    ],
  },
  {
    id: "directions",
    title: "Направления",
    path: "directions",
    fields: [
      ...heading("Направления"),
      {
        kind: "list",
        key: "items",
        label: "Направления",
        itemLabel: "Направление",
        titleKey: "title",
        newItem: { icon: "Sparkles", title: "Новое направление", description: "", tags: [], priority: "medium" },
        fields: [
          { kind: "icon", key: "icon", label: "Иконка" },
          { kind: "text", key: "title", label: "Название" },
          { kind: "textarea", key: "description", label: "Описание" },
          { kind: "strings", key: "tags", label: "Теги", itemLabel: "Тег" },
          {
            kind: "select",
            key: "priority",
            label: "Приоритет",
            options: [
              { value: "high", label: "Высокий" },
              { value: "medium", label: "Средний" },
              { value: "none", label: "Не показывать" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "formats",
    title: "Форматы",
    path: "formats",
    fields: [
      ...heading("Форматы"),
      {
        kind: "list",
        key: "cards",
        label: "Карточки форматов",
        itemLabel: "Формат",
        titleKey: "title",
        newItem: { icon: "Users", title: "Новый формат", subtitle: "", items: [] },
        fields: [
          { kind: "icon", key: "icon", label: "Иконка" },
          { kind: "text", key: "title", label: "Название" },
          { kind: "text", key: "subtitle", label: "Для кого" },
          { kind: "strings", key: "items", label: "Что входит", itemLabel: "Пункт" },
        ],
      },
      { kind: "boolean", key: "showPrice", label: "Показывать блок со стоимостью" },
      { kind: "text", key: "ctaLabel", label: "Кнопка в блоке стоимости" },
    ],
  },
  {
    id: "speakers",
    title: "Спикеры",
    path: "speakers",
    fields: [
      ...heading("Спикеры"),
      {
        kind: "list",
        key: "items",
        label: "Спикеры",
        itemLabel: "Спикер",
        titleKey: "name",
        newItem: { name: "Фамилия Имя Отчество", role: "", photo: "" },
        fields: [
          { kind: "text", key: "name", label: "ФИО" },
          { kind: "textarea", key: "role", label: "Должность" },
          { kind: "image", key: "photo", label: "Фото", help: "Вертикальное, примерно 5:6" },
        ],
      },
    ],
  },
  {
    id: "registration",
    title: "Регистрация",
    path: "registration",
    fields: [
      ...heading("Регистрация"),
      { kind: "form", key: "formId", label: "Форма заявки", help: "Формы создаются в разделе «Формы»" },
      { kind: "text", key: "formTitle", label: "Заголовок над формой" },
      { kind: "strings", key: "offerItems", label: "Пункты рядом с формой", itemLabel: "Пункт" },
      { kind: "textarea", key: "privacyNote", label: "Текст про обработку данных" },
      { kind: "text", key: "privacyLinkLabel", label: "Текст ссылки на политику ПДн" },
      { kind: "text", key: "calendarLabel", label: "Кнопка «Добавить в календарь»", help: "Пусто — кнопка скрыта" },
    ],
  },
  {
    id: "faq",
    title: "Вопросы и площадка",
    path: "faq",
    fields: [
      ...heading("Вопросы"),
      {
        kind: "list",
        key: "items",
        label: "Вопросы",
        itemLabel: "Вопрос",
        titleKey: "q",
        newItem: { q: "Новый вопрос?", a: "Ответ" },
        fields: [
          { kind: "text", key: "q", label: "Вопрос" },
          { kind: "textarea", key: "a", label: "Ответ" },
        ],
      },
      { kind: "boolean", key: "showVenue", label: "Показывать карточку площадки и карту" },
      { kind: "text", key: "mapButtonLabel", label: "Кнопка карты" },
    ],
  },
  {
    id: "footer",
    title: "Подвал",
    path: "footer",
    fields: [
      { kind: "textarea", key: "tagline", label: "Текст под логотипом" },
      { kind: "text", key: "linksTitle", label: "Заголовок колонки ссылок" },
      {
        kind: "list",
        key: "links",
        label: "Ссылки",
        itemLabel: "Ссылка",
        titleKey: "label",
        newItem: { label: "Ссылка", href: "https://" },
        fields: [
          { kind: "text", key: "label", label: "Текст" },
          { kind: "url", key: "href", label: "Адрес" },
        ],
      },
      { kind: "text", key: "contactsTitle", label: "Заголовок колонки контактов" },
      { kind: "text", key: "copyright", label: "Копирайт" },
      { kind: "text", key: "note", label: "Примечание внизу справа" },
      { kind: "text", key: "noteLinkLabel", label: "Текст ссылки в примечании" },
      { kind: "url", key: "noteLinkUrl", label: "Адрес ссылки в примечании" },
    ],
  },
];
