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
  { value: "why", label: "Зачем участвовать" },
  { value: "agenda", label: "Повестка (направления)" },
  { value: "speakers", label: "Спикеры" },
  { value: "program", label: "Программа" },
  { value: "registration", label: "Регистрация" },
  { value: "faq", label: "Вопросы" },
  { value: "venue", label: "Площадка / карта" },
];

const strings = (key: string, label: string, itemLabel = "Пункт"): SchemaField => ({ kind: "strings", key, label, itemLabel });

export const CONTENT_SCHEMA: SchemaSection[] = [
  {
    id: "event",
    title: "Мероприятие",
    description: "Дата, место, цена и счётчик мест. Используются на первом экране, в таймере, форме и карте.",
    path: "event",
    fields: [
      { kind: "text", key: "title", label: "Название мероприятия (заголовок)" },
      { kind: "text", key: "titleAccent", label: "Часть заголовка, выделенная цветом", help: "Должна точно совпадать с куском заголовка" },
      { kind: "datetime", key: "startLocal", label: "Начало (местное время)" },
      { kind: "datetime", key: "endLocal", label: "Окончание (местное время)" },
      {
        kind: "text",
        key: "utcOffset",
        label: "Часовой пояс площадки (смещение от UTC)",
        help: "Например +07:00 для Томска, +03:00 для Москвы. Нужен для таймера и статистики по дням.",
      },
      { kind: "text", key: "dateLabel", label: "Дата текстом", help: "Например: 14 октября 2026, вторник" },
      { kind: "text", key: "timeLabel", label: "Время текстом", help: "Например: 10:00 (Томск)" },
      { kind: "text", key: "venue", label: "Площадка" },
      { kind: "text", key: "address", label: "Адрес" },
      { kind: "text", key: "mapLat", label: "Широта для карты", help: "Пусто — карта не показывается" },
      { kind: "text", key: "mapLon", label: "Долгота для карты" },
      { kind: "text", key: "format", label: "Формат", help: "Например: Очно + онлайн-трансляция" },
      { kind: "text", key: "price", label: "Стоимость", help: "Пусто — цена скрыта" },
      { kind: "text", key: "priceNote", label: "Пояснение к стоимости" },
      { kind: "text", key: "seatsTotal", label: "Всего мест", help: "Счётчик мест показывается, если заполнены оба поля" },
      { kind: "text", key: "seatsLeft", label: "Осталось мест" },
      { kind: "text", key: "contactEmail", label: "Контактный email" },
      { kind: "url", key: "privacyPolicyUrl", label: "Ссылка на политику обработки ПДн" },
    ],
  },
  {
    id: "theme",
    title: "Оформление",
    path: "theme",
    fields: [
      { kind: "image", key: "logo", label: "Логотип", help: "PNG/SVG с прозрачным фоном, светлый — шапка тёмная" },
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
      { kind: "text", key: "ctaLabel", label: "Кнопка в шапке и внизу экрана на телефоне" },
    ],
  },
  {
    id: "hero",
    title: "Первый экран",
    path: "hero",
    fields: [
      { kind: "text", key: "badge", label: "Плашка" },
      { kind: "text", key: "audienceNote", label: "Пометка об аудитории" },
      { kind: "textarea", key: "subtitle", label: "Подзаголовок" },
      strings("points", "Тезисы", "Тезис"),
      { kind: "text", key: "primaryCta", label: "Основная кнопка (открывает форму)" },
      { kind: "text", key: "secondaryCta", label: "Вторая кнопка", help: "Пусто — кнопка скрыта" },
      { kind: "select", key: "secondaryTarget", label: "Вторая кнопка ведёт к блоку", options: SECTION_TARGETS },
      { kind: "text", key: "ticketCta", label: "Кнопка в карточке-билете" },
    ],
  },
  {
    id: "why",
    title: "Зачем участвовать",
    path: "why",
    fields: [
      { kind: "boolean", key: "enabled", label: "Показывать блок" },
      { kind: "text", key: "eyebrow", label: "Надзаголовок" },
      { kind: "text", key: "title", label: "Заголовок" },
      { kind: "textarea", key: "subtitle", label: "Подзаголовок" },
      { kind: "text", key: "featureTitle", label: "Большая карточка — заголовок" },
      { kind: "textarea", key: "featureText", label: "Большая карточка — текст" },
      strings("featurePoints", "Большая карточка — пункты"),
      { kind: "text", key: "quote", label: "Цитата" },
      { kind: "text", key: "highlightValue", label: "Цветная карточка — цифра" },
      { kind: "textarea", key: "highlightText", label: "Цветная карточка — текст" },
      {
        kind: "list",
        key: "reasons",
        label: "Карточки причин",
        itemLabel: "Карточка",
        titleKey: "title",
        newItem: { icon: "Check", title: "Заголовок", text: "Описание" },
        fields: [
          { kind: "icon", key: "icon", label: "Иконка" },
          { kind: "text", key: "title", label: "Заголовок" },
          { kind: "textarea", key: "text", label: "Текст" },
        ],
      },
      { kind: "textarea", key: "windowText", label: "Нижняя цветная карточка — текст" },
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
      { kind: "text", key: "windowCta", label: "Кнопка в нижней карточке" },
    ],
  },
  {
    id: "directions",
    title: "Повестка",
    path: "directions",
    fields: [
      { kind: "boolean", key: "enabled", label: "Показывать карточку повестки" },
      { kind: "text", key: "eyebrow", label: "Надзаголовок" },
      { kind: "text", key: "title", label: "Заголовок" },
      {
        kind: "list",
        key: "items",
        label: "Направления",
        itemLabel: "Направление",
        titleKey: "title",
        newItem: { title: "Новое направление", description: "", priority: "medium" },
        fields: [
          { kind: "text", key: "title", label: "Название" },
          { kind: "text", key: "description", label: "Описание" },
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
    id: "speakers",
    title: "Спикеры",
    path: "speakers",
    fields: [
      { kind: "boolean", key: "enabled", label: "Показывать блок" },
      { kind: "text", key: "eyebrow", label: "Надзаголовок" },
      { kind: "text", key: "title", label: "Заголовок" },
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
    id: "program",
    title: "Программа",
    path: "program",
    fields: [
      { kind: "boolean", key: "enabled", label: "Показывать блок" },
      { kind: "text", key: "eyebrow", label: "Надзаголовок" },
      { kind: "text", key: "title", label: "Заголовок" },
      { kind: "textarea", key: "subtitle", label: "Подзаголовок" },
      {
        kind: "list",
        key: "items",
        label: "Пункты программы",
        itemLabel: "Пункт",
        titleKey: "title",
        newItem: { icon: "Check", title: "Новый пункт", text: "", highlight: false },
        fields: [
          { kind: "icon", key: "icon", label: "Иконка" },
          { kind: "text", key: "title", label: "Название" },
          { kind: "textarea", key: "text", label: "Описание" },
          { kind: "boolean", key: "highlight", label: "Выделить (например, ваш слот)" },
        ],
      },
      { kind: "text", key: "highlightLabel", label: "Метка выделенного пункта" },
    ],
  },
  {
    id: "formats",
    title: "Форматы участия",
    path: "formats",
    fields: [
      { kind: "boolean", key: "enabled", label: "Показывать форматы рядом с программой" },
      {
        kind: "list",
        key: "cards",
        label: "Форматы",
        itemLabel: "Формат",
        titleKey: "title",
        newItem: { title: "Новый формат", subtitle: "", items: [] },
        fields: [
          { kind: "text", key: "title", label: "Название" },
          { kind: "text", key: "subtitle", label: "Для кого" },
          strings("items", "Что входит"),
        ],
      },
    ],
  },
  {
    id: "registration",
    title: "Регистрация",
    path: "registration",
    fields: [
      { kind: "boolean", key: "enabled", label: "Принимать заявки (блок и все кнопки)" },
      { kind: "form", key: "formId", label: "Форма заявки", help: "Формы создаются в разделе «Формы»" },
      { kind: "text", key: "eyebrow", label: "Надзаголовок" },
      { kind: "text", key: "title", label: "Заголовок" },
      { kind: "textarea", key: "subtitle", label: "Подзаголовок" },
      strings("offerItems", "Пункты рядом с формой"),
      { kind: "textarea", key: "privacyNote", label: "Текст про обработку данных" },
      { kind: "text", key: "privacyLinkLabel", label: "Текст ссылки на политику ПДн" },
      { kind: "text", key: "formTitle", label: "Заголовок выезжающей формы" },
      { kind: "text", key: "formSubtitle", label: "Подпись под заголовком формы" },
    ],
  },
  {
    id: "faq",
    title: "Вопросы и площадка",
    path: "faq",
    fields: [
      { kind: "boolean", key: "enabled", label: "Показывать блок" },
      { kind: "text", key: "eyebrow", label: "Надзаголовок" },
      { kind: "text", key: "title", label: "Заголовок" },
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
      { kind: "boolean", key: "showVenue", label: "Показывать карточку площадки с картой" },
      { kind: "text", key: "mapButtonLabel", label: "Кнопка карты" },
    ],
  },
  {
    id: "footer",
    title: "Подвал",
    path: "footer",
    fields: [
      { kind: "text", key: "copyright", label: "Копирайт" },
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
    ],
  },
];
