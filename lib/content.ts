// Типы и значения по умолчанию для всего контента лендинга.
// Всё, что здесь описано, редактируется в админке: прямо на сайте (/?edit=1) или формой (/admin/content).

export type SectionId = "why" | "speakers" | "program" | "registration" | "faq";

export const SECTION_LABELS: Record<SectionId, string> = {
  why: "Зачем участвовать",
  speakers: "Спикеры",
  program: "Программа и форматы",
  registration: "Регистрация",
  faq: "Вопросы и площадка",
};

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    siteUrl: string;
    ogImage: string;
  };
  theme: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    logo: string;
    logoAlt: string;
  };
  event: {
    title: string;
    /** Часть заголовка, выделенная цветом */
    titleAccent: string;
    startLocal: string; // "2026-10-14T10:00"
    endLocal: string;
    utcOffset: string; // "+07:00"
    dateLabel: string;
    timeLabel: string;
    venue: string;
    address: string;
    format: string;
    price: string;
    priceNote: string;
    /** Счётчик мест: показывается, если заполнены оба поля */
    seatsTotal: string;
    seatsLeft: string;
    contactEmail: string;
    privacyPolicyUrl: string;
    mapLat: string;
    mapLon: string;
  };
  nav: {
    links: { label: string; target: string }[];
    ctaLabel: string;
  };
  /** Порядок блоков под первым экраном */
  order: SectionId[];
  hero: {
    badge: string;
    audienceNote: string;
    subtitle: string;
    points: string[];
    primaryCta: string;
    secondaryCta: string;
    secondaryTarget: string;
    ticketCta: string;
  };
  why: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    featureTitle: string;
    featureText: string;
    featurePoints: string[];
    quote: string;
    highlightValue: string;
    highlightText: string;
    reasons: { icon: string; title: string; text: string }[];
    windowText: string;
    stats: { value: string; label: string }[];
    windowCta: string;
  };
  directions: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    items: { title: string; description: string; priority: "high" | "medium" | "none" }[];
  };
  speakers: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    items: { name: string; role: string; photo: string }[];
  };
  program: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { icon: string; title: string; text: string; highlight: boolean }[];
    highlightLabel: string;
  };
  formats: {
    enabled: boolean;
    cards: { title: string; subtitle: string; items: string[] }[];
  };
  registration: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    offerItems: string[];
    privacyNote: string;
    privacyLinkLabel: string;
    formTitle: string;
    formSubtitle: string;
    formId: string;
  };
  faq: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
    showVenue: boolean;
    mapButtonLabel: string;
  };
  footer: {
    copyright: string;
    links: { label: string; href: string }[];
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  meta: {
    title: "Цифра ТГУ: роадмэп, закупки и приоритеты 2027 | 14 октября",
    description:
      "Закрытый B2G круглый стол для ИТ-вендоров ТГУ. Стратегия цифровой трансформации, приоритеты закупок 2027. 14 октября, Томск.",
    siteUrl: "https://digital.tsu.ru",
    ogImage: "/og-image.jpg",
  },
  theme: {
    primary: "#0072BC",
    primaryDark: "#005A96",
    primaryLight: "#E8F4FC",
    logo: "/tsu-logo-ru.png?v=3",
    logoAlt: "Национальный исследовательский Томский государственный университет",
  },
  event: {
    title: "Цифра ТГУ: роадмэп, закупки и приоритеты 2027",
    titleAccent: "приоритеты 2027",
    startLocal: "2026-10-14T10:00",
    endLocal: "2026-10-14T14:00",
    utcOffset: "+07:00",
    dateLabel: "14 октября 2026, вторник",
    timeLabel: "10:00 (Томск)",
    venue: "Главный корпус ТГУ",
    address: "пр. Ленина, 36, Томск, 634050",
    format: "Очно + онлайн-трансляция",
    price: "10 000 ₽",
    priceNote: "поступает в Эндаумент-фонд ТГУ",
    seatsTotal: "",
    seatsLeft: "",
    contactEmail: "ib@mail.tsu.ru",
    privacyPolicyUrl: "https://persona.tsu.ru/Content/documents/politika_pd.pdf",
    mapLat: "56.469463",
    mapLon: "84.947568",
  },
  nav: {
    links: [
      { label: "Зачем участвовать", target: "why" },
      { label: "Спикеры", target: "speakers" },
      { label: "Программа", target: "program" },
      { label: "Вопросы", target: "faq" },
    ],
    ctaLabel: "Подать заявку",
  },
  order: ["why", "speakers", "program", "registration", "faq"],
  hero: {
    badge: "Закрытый B2G круглый стол",
    audienceNote: "Только для ИТ-вендоров и интеграторов",
    subtitle:
      "Узнайте, куда ТГУ направляет ИТ-бюджеты в 2027 году, и начните диалог с командой цифровой трансформации до этапа тендера.",
    points: [
      "Планы ИТ-закупок 2027 до публикации тендеров",
      "Прямой контакт с ЛПР цифровой повестки ТГУ",
      "10 минут на презентацию вашей компании",
    ],
    primaryCta: "Подать заявку →",
    secondaryCta: "Программа",
    secondaryTarget: "program",
    ticketCta: "Забронировать место",
  },
  why: {
    enabled: true,
    eyebrow: "Зачем участвовать",
    title: "Что получает ваша компания",
    subtitle:
      "Не нетворкинг ради нетворкинга, а слот для презентации, прямой диалог с ЛПР и понимание закупок одного из крупнейших вузов страны.",
    featureTitle: "Закупки без сюрпризов",
    featureText:
      "Поймёте приоритеты бюджета до выхода документации на торговые площадки и подготовите релевантное предложение заранее.",
    featurePoints: [
      "Технологический роадмэп ТГУ на 2027",
      "Бюджетные приоритеты до тендерной документации",
      "Запись и презентации для вашей команды",
    ],
    quote: "Закупки 2027 начинаются с разговора, а не с протокола",
    highlightValue: "10 мин",
    highlightText: "слот, чтобы представить компанию и ключевые кейсы команде цифровой трансформации",
    reasons: [
      {
        icon: "Users",
        title: "Диалог вместо холодного входа",
        text: "Доверительный формат вместо общего email или тендера на поздней стадии.",
      },
      {
        icon: "Briefcase",
        title: "Коммерческий фокус",
        text: "Для sales, аккаунтов и коммерческих директоров — на языке бизнеса.",
      },
      {
        icon: "Shield",
        title: "Институциональный статус",
        text: "Участие в закрытой программе ТГУ — сигнал серьёзности для ваших клиентов.",
      },
    ],
    windowText:
      "Окно возможностей ограничено: закрытый формат и лимит мест. Компании, которые подключатся сейчас, получают приоритет в коммуникации.",
    stats: [
      { value: "2×", label: "круглых стола в год" },
      { value: "2027", label: "горизонт планирования" },
      { value: "1 день", label: "подтверждение заявки" },
    ],
    windowCta: "Забронировать место",
  },
  directions: {
    enabled: true,
    eyebrow: "Повестка 2027",
    title: "Где ТГУ ищет технологических партнёров",
    items: [
      { title: "Цифровой кампус", description: "IoT, умные аудитории, единая цифровая среда", priority: "high" },
      { title: "Личный кабинет", description: "Единый портал для студентов и сотрудников", priority: "high" },
      { title: "Информационная безопасность", description: "ИСПД, КИИ, ГОСТ Р 57580, SIEM", priority: "high" },
      { title: "Интеграция с 1С", description: "Финансы, кадры, учебный процесс в одном контуре", priority: "medium" },
      { title: "Обучение сотрудников", description: "Цифровые компетенции, LMS, курсы по ИБ", priority: "medium" },
    ],
  },
  speakers: {
    enabled: true,
    eyebrow: "Представители ТГУ",
    title: "Люди, которые принимают решения",
    items: [
      {
        name: "Эмер Юлия Антоновна",
        role: "Проректор по информационной политике и цифровым коммуникациям",
        photo: "/images/speakers/emer.jpg",
      },
      {
        name: "Газизов Тимур Тальгатович",
        role: "Директор дирекции по информационной безопасности",
        photo: "/images/speakers/gavrilenko.jpg",
      },
      {
        name: "Висман Ян Александрович",
        role: "Начальник отдела разработки цифровых решений",
        photo: "/images/speakers/gazizov.jpg",
      },
      {
        name: "Соколов Данила Александрович",
        role: "Начальник управления цифровых решений",
        photo: "/images/speakers/visman.jpg",
      },
      {
        name: "Жамнов Вадим Владимирович",
        role: "Директор центра компетенций по корпоративным информационным системам",
        photo: "/images/speakers/zhamnov.jpg",
      },
      {
        name: "Гавриленко Ростислав Алексеевич",
        role: "Начальник управления информационно-телекоммуникационной инфраструктуры",
        photo: "/images/speakers/sokolov.jpg",
      },
    ],
  },
  program: {
    enabled: true,
    eyebrow: "Программа",
    title: "Что будет на круглом столе",
    subtitle:
      "Закрытый диалог с командой цифровой трансформации ТГУ: стратегия, конкретные планы закупок и время для вашей компании.",
    items: [
      {
        icon: "LineChart",
        title: "Стратегия цифровой трансформации ТГУ",
        text: "Куда движется университет и какие задачи ставит перед ИТ-партнёрами",
        highlight: false,
      },
      {
        icon: "Wallet",
        title: "Роадмэп и приоритеты закупок 2027",
        text: "Направления и задачи до публикации тендерной документации",
        highlight: false,
      },
      {
        icon: "Mic",
        title: "Презентации компаний",
        text: "10 минут на вашу компанию и ключевые кейсы, вопросы от представителей ТГУ",
        highlight: true,
      },
      {
        icon: "MessageSquare",
        title: "Открытая дискуссия",
        text: "Форматы закупок, пилотные проекты, требования к решениям",
        highlight: false,
      },
      {
        icon: "Coffee",
        title: "Нетворкинг",
        text: "Неформальное общение с представителями ТГУ и коллегами по отрасли",
        highlight: false,
      },
    ],
    highlightLabel: "ваш слот",
  },
  formats: {
    enabled: true,
    cards: [
      {
        title: "Очное участие",
        subtitle: "Для коммерческих директоров и аккаунт-лидов",
        items: ["Главный корпус ТГУ, пр. Ленина, 36", "Прямой диалог с ЛПР", "Кофе-пауза и нетворкинг"],
      },
      {
        title: "Онлайн-участие",
        subtitle: "Для распределённых команд и технических специалистов",
        items: ["Прямая трансляция и чат Q&A", "Запись и презентации после встречи", "Доступ для удалённой команды"],
      },
    ],
  },
  registration: {
    enabled: true,
    eyebrow: "Регистрация",
    title: "Забронируйте место за круглым столом",
    subtitle:
      "Количество участников ограничено, чтобы сохранить формат закрытого диалога. Подача заявки бесплатна, оплата — только после подтверждения.",
    offerItems: [
      "Доступ к закрытому круглому столу и материалам",
      "Подтверждение заявки за 1 рабочий день",
      "Оплата только после согласования участия",
      "Запись и презентации для вашей команды",
    ],
    privacyNote: "Мы связываемся только по деловым вопросам участия. Данные обрабатываются в соответствии с",
    privacyLinkLabel: "политикой обработки ПДн ТГУ",
    formTitle: "Заявка на участие",
    formSubtitle: "Ответим за 1 рабочий день",
    formId: "",
  },
  faq: {
    enabled: true,
    eyebrow: "Вопросы",
    title: "Частые вопросы",
    items: [
      {
        q: "Кто может подать заявку?",
        a: "Представители ИТ-компаний: вендоры, интеграторы, разработчики ПО и поставщики инфраструктурных решений. Формат B2G — не для частных лиц и студентов.",
      },
      {
        q: "Как проходит отбор участников?",
        a: "После заявки мы связываемся в течение 1 рабочего дня, уточняем профиль компании и формат участия. Оплата — только после подтверждения.",
      },
      {
        q: "Что входит в стоимость?",
        a: "Доступ к круглому столу очно или онлайн, запись, презентационные материалы и возможность задать вопросы напрямую представителям ТГУ.",
      },
      {
        q: "Куда поступает взнос?",
        a: "В Эндаумент-фонд ТГУ в рамках программы поддержки цифровой трансформации университета.",
      },
      {
        q: "Можно направить несколько сотрудников?",
        a: "Да. Укажите в заявке контактное лицо — мы согласуем состав делегации и формат присутствия для каждого.",
      },
    ],
    showVenue: true,
    mapButtonLabel: "Открыть в Яндекс Картах",
  },
  footer: {
    copyright: "© 2026 Томский государственный университет",
    links: [
      { label: "Политика обработки ПДн", href: "https://persona.tsu.ru/Content/documents/politika_pd.pdf" },
      { label: "Эндаумент-фонд ТГУ", href: "https://fond.tsu.ru/" },
    ],
  },
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Дополняет сохранённый контент недостающими полями из значений по умолчанию
 *  (нужно, когда в схему добавляются новые поля). Массивы берутся целиком. */
export function mergeWithDefaults<T>(defaults: T, saved: unknown): T {
  if (saved === undefined || saved === null) return defaults;
  if (Array.isArray(defaults)) return (Array.isArray(saved) ? saved : defaults) as T;
  if (isPlainObject(defaults)) {
    if (!isPlainObject(saved)) return defaults;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(defaults)) {
      out[key] = mergeWithDefaults((defaults as Record<string, unknown>)[key], saved[key]);
    }
    return out as T;
  }
  return (typeof saved === typeof defaults ? saved : defaults) as T;
}

/** Порядок блоков: известные id без повторов, недостающие — в конец. */
export function normalizeOrder(order: string[]): SectionId[] {
  const all = DEFAULT_CONTENT.order;
  const seen = order.filter((id, i): id is SectionId => all.includes(id as SectionId) && order.indexOf(id) === i);
  return [...seen, ...all.filter((id) => !seen.includes(id))];
}

export function eventStart(content: SiteContent): Date {
  return new Date(`${content.event.startLocal}:00${content.event.utcOffset}`);
}

export function eventEnd(content: SiteContent): Date {
  return new Date(`${content.event.endLocal}:00${content.event.utcOffset}`);
}

/** Смещение часового пояса площадки в минутах ("+07:00" → 420). */
export function utcOffsetMinutes(offset: string): number {
  const m = /^([+-])(\d{2}):?(\d{2})$/.exec(offset.trim());
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3]));
}
