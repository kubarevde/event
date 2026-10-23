// Типы и значения по умолчанию для всего контента лендинга.
// Всё, что здесь описано, редактируется в админке (/admin/content).

export type IconText = { icon: string; text: string };
export type IconTitleText = { icon: string; title: string; text: string };

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
    limitedNote: string;
    contactEmail: string;
    privacyPolicyUrl: string;
    mapLat: string;
    mapLon: string;
  };
  nav: {
    links: { label: string; target: string }[];
    ctaLabel: string;
  };
  hero: {
    badge: string;
    audienceNote: string;
    subtitle: string;
    bullets: IconText[];
    primaryCta: string;
    secondaryCta: string;
    secondaryTarget: string;
    cardTitle: string;
    countdownLabel: string;
  };
  why: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    reasons: IconTitleText[];
    asideTitle: string;
    asideText: string;
    stats: { value: string; label: string }[];
  };
  value: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    quote: string;
    ctaLabel: string;
    benefits: string[];
  };
  directions: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: {
      icon: string;
      title: string;
      description: string;
      tags: string[];
      priority: "high" | "medium" | "none";
    }[];
  };
  formats: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: { icon: string; title: string; subtitle: string; items: string[] }[];
    showPrice: boolean;
    ctaLabel: string;
  };
  speakers: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { name: string; role: string; photo: string }[];
  };
  registration: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    offerItems: string[];
    privacyNote: string;
    privacyLinkLabel: string;
    calendarLabel: string;
    formTitle: string;
    formId: string;
  };
  faq: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
    showVenue: boolean;
    mapButtonLabel: string;
  };
  footer: {
    tagline: string;
    linksTitle: string;
    links: { label: string; href: string }[];
    contactsTitle: string;
    copyright: string;
    note: string;
    noteLinkLabel: string;
    noteLinkUrl: string;
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
    startLocal: "2026-10-14T10:00",
    endLocal: "2026-10-14T14:00",
    utcOffset: "+07:00",
    dateLabel: "14 октября 2026, вторник",
    timeLabel: "10:00 (Томск)",
    venue: "Главный корпус ТГУ",
    address: "пр. Ленина, 36, Томск, 634050",
    format: "Очно + онлайн-трансляция",
    price: "10 000 ₽",
    priceNote: "участие · поступает в Эндаумент-фонд ТГУ",
    limitedNote: "Мест ограничено",
    contactEmail: "ib@mail.tsu.ru",
    privacyPolicyUrl: "https://persona.tsu.ru/Content/documents/politika_pd.pdf",
    mapLat: "56.469463",
    mapLon: "84.947568",
  },
  nav: {
    links: [
      { label: "Зачем участвовать", target: "why" },
      { label: "Что получите", target: "value" },
      { label: "Направления", target: "directions" },
      { label: "Форматы", target: "formats" },
      { label: "Спикеры", target: "speakers" },
    ],
    ctaLabel: "Подать заявку",
  },
  hero: {
    badge: "Закрытый B2G круглый стол",
    audienceNote: "Только для ИТ-вендоров и интеграторов",
    subtitle:
      "Круглый стол для коммерческих команд: узнайте, куда ТГУ направляет ИТ-бюджеты в 2027 году, и выстройте диалог до этапа тендера.",
    bullets: [
      { icon: "Target", text: "Планы ИТ-закупок 2027 до публикации тендеров" },
      { icon: "Users", text: "Прямой контакт с ЛПР цифровой повестки ТГУ" },
      { icon: "TrendingUp", text: "Ранний вход в приоритетные направления развития" },
    ],
    primaryCta: "Подать заявку",
    secondaryCta: "Форматы участия",
    secondaryTarget: "formats",
    cardTitle: "Параметры круглого стола",
    countdownLabel: "До начала круглого стола",
  },
  why: {
    enabled: true,
    eyebrow: "Для ИТ-компаний",
    title: "Почему это важно для вашего бизнеса",
    subtitle:
      "ТГУ формирует цифровую повестку на годы вперёд. Участие даёт коммерческому блоку преимущество времени, контекста и доступа.",
    reasons: [
      {
        icon: "LineChart",
        title: "Закупки без сюрпризов",
        text: "Поймёте приоритеты бюджета до выхода документации на торговые площадки — и сможете подготовить релевантное предложение заранее.",
      },
      {
        icon: "Handshake",
        title: "Диалог вместо холодного входа",
        text: "Встреча с представителями ТГУ в формате доверительного круглого стола, а не через общий email или тендер на поздней стадии.",
      },
      {
        icon: "Briefcase",
        title: "Коммерческий фокус",
        text: "Круглый стол создан для sales, аккаунтов и коммерческих директоров — с языком бизнеса, а не только технических спецификаций.",
      },
      {
        icon: "Shield",
        title: "Институциональный статус",
        text: "Участие в закрытой программе ТГУ — сигнал серьёзности для клиентов и партнёров вашей компании.",
      },
    ],
    asideTitle: "Окно возможностей ограничено",
    asideText:
      "Закрытый формат и лимит мест. Компании, которые подключатся сейчас, получают приоритет в коммуникации с командой цифровой трансформации.",
    stats: [
      { value: "2×", label: "круглых стола в год" },
      { value: "2027", label: "горизонт планирования" },
      { value: "1 день", label: "подтверждение заявки" },
    ],
  },
  value: {
    enabled: true,
    eyebrow: "Результат участия",
    title: "Что получает ваша компания",
    subtitle:
      "Не networking ради networking — а реальный слот для презентации, прямой диалог с ЛПР и понимание приоритетов закупок одного из крупнейших вузов страны.",
    quote: "Закупки 2027 начинаются с разговора, а не с протокола",
    ctaLabel: "Оставить заявку",
    benefits: [
      "Возможность предложить собственные продукты и решения напрямую команде цифровой трансформации ТГУ",
      "10-минутный временной слот для представления вашей компании и ключевых кейсов",
      "Технологический роадмэп ТГУ на 2027 — конкретные задачи и направления закупок",
      "Прямой диалог с представителями цифровой повестки ТГУ",
      "Понимание бюджетных приоритетов до выхода тендерной документации",
      "Запись круглого стола и презентационные материалы для вашей команды",
    ],
  },
  directions: {
    enabled: true,
    eyebrow: "Повестка 2027",
    title: "Направления цифрового развития ТГУ",
    subtitle:
      "Приоритеты, по которым университет ищет технологических партнёров. Понимание этой карты — основа для точного коммерческого предложения.",
    items: [
      {
        icon: "Building2",
        title: "Цифровой кампус",
        description: "Умные аудитории, IoT-инфраструктура, единая цифровая среда кампуса.",
        tags: ["IoT", "Инфраструктура", "Smart Building"],
        priority: "high",
      },
      {
        icon: "LayoutDashboard",
        title: "Личный кабинет",
        description: "Единый портал для студентов, преподавателей и сотрудников.",
        tags: ["Портал", "UX", "Интеграция"],
        priority: "high",
      },
      {
        icon: "Database",
        title: "Интеграция с 1С",
        description: "ERP-система: финансы, кадры, учебный процесс в одном контуре.",
        tags: ["1С", "ERP", "API"],
        priority: "medium",
      },
      {
        icon: "ShieldCheck",
        title: "Информационная безопасность",
        description: "ИСПД, КИИ, ГОСТ Р 57580, SIEM, мониторинг инцидентов.",
        tags: ["ИСПД", "КИИ", "SIEM"],
        priority: "high",
      },
      {
        icon: "GraduationCap",
        title: "Обучение сотрудников",
        description: "Цифровые компетенции, LMS, курсы по ИБ для персонала.",
        tags: ["EdTech", "LMS", "Компетенции"],
        priority: "medium",
      },
    ],
  },
  formats: {
    enabled: true,
    eyebrow: "Форматы",
    title: "Как участвовать",
    subtitle:
      "Выберите модель присутствия для вашей команды. Оба формата дают доступ к содержанию круглого стола и материалам.",
    cards: [
      {
        icon: "MapPin",
        title: "Очное участие",
        subtitle: "Рекомендуется для коммерческих директоров и аккаунт-лидов",
        items: [
          "Главный корпус ТГУ, пр. Ленина, 36",
          "Нетворкинг с коллегами отрасли",
          "Прямой диалог с ЛПР",
          "Кофе-пауза и неформальное общение",
        ],
      },
      {
        icon: "Monitor",
        title: "Онлайн-участие",
        subtitle: "Для распределённых команд и технических специалистов",
        items: [
          "Прямая трансляция круглого стола",
          "Запись и материалы после мероприятия",
          "Чат Q&A в реальном времени",
          "Доступ для удалённой команды",
        ],
      },
    ],
    showPrice: true,
    ctaLabel: "Подать заявку",
  },
  speakers: {
    enabled: true,
    eyebrow: "Представители ТГУ",
    title: "Люди, которые принимают решения",
    subtitle: "Говорите напрямую с теми, кто определяет цифровую повестку университета.",
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
  registration: {
    enabled: true,
    eyebrow: "Регистрация",
    title: "Забронируйте место за круглым столом",
    subtitle:
      "Следующий круглый стол — 14 октября 2026. Количество участников ограничено для сохранения формата закрытого диалога.",
    offerItems: [
      "Доступ к закрытому круглому столу и материалам",
      "Подтверждение заявки за 1 рабочий день",
      "Оплата только после согласования участия",
      "Запись и презентации для вашей команды",
    ],
    privacyNote:
      "Подача заявки бесплатна. Мы связываемся только по деловым вопросам участия. Данные обрабатываются в соответствии с",
    privacyLinkLabel: "политикой обработки ПДн ТГУ",
    calendarLabel: "Добавить в календарь",
    formTitle: "Заявка на участие",
    formId: "",
  },
  faq: {
    enabled: true,
    eyebrow: "Организация",
    title: "Вопросы и детали проведения",
    subtitle: "Ответы на типичные вопросы коммерческих команд и информация о площадке.",
    items: [
      {
        q: "Кто может подать заявку?",
        a: "Закрытый круглый стол предназначен для представителей ИТ-компаний: вендоров, интеграторов, разработчиков ПО и поставщиков инфраструктурных решений. Формат B2G — не для частных лиц и студентов.",
      },
      {
        q: "Как проходит отбор участников?",
        a: "После подачи заявки мы связываемся в течение 1 рабочего дня, уточняем профиль компании и формат участия. Оплата производится только после подтверждения.",
      },
      {
        q: "Что входит в стоимость участия?",
        a: "Доступ к круглому столу (очно или онлайн), запись мероприятия, презентационные материалы и возможность задать вопросы напрямую представителям ТГУ.",
      },
      {
        q: "Куда поступает взнос?",
        a: "Средства направляются в Эндаумент-фонд ТГУ в рамках программы поддержки цифровой трансформации университета.",
      },
      {
        q: "Можно ли направить несколько сотрудников?",
        a: "Да. Укажите в заявке контактное лицо — мы согласуем состав делегации и формат присутствия для каждого участника.",
      },
    ],
    showVenue: true,
    mapButtonLabel: "Открыть на карте",
  },
  footer: {
    tagline: "Цифровая трансформация — открытый диалог с технологическими партнёрами",
    linksTitle: "Информация",
    links: [
      {
        label: "Политика обработки ПДн",
        href: "https://persona.tsu.ru/Content/documents/politika_pd.pdf",
      },
      { label: "Информация о Фонде", href: "https://fond.tsu.ru/" },
    ],
    contactsTitle: "Контакты",
    copyright: "© 2026 Томский государственный университет",
    note: "Взнос поступает в",
    noteLinkLabel: "Эндаумент-фонд ТГУ",
    noteLinkUrl: "https://fond.tsu.ru/",
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
