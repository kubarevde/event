export interface Direction {
  id: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  priority: "high" | "medium";
}

export const DIRECTIONS: Direction[] = [
  {
    id: "digital-campus",
    icon: "Building2",
    title: "Цифровой кампус",
    description:
      "Умные аудитории, IoT-инфраструктура, единая цифровая среда кампуса.",
    tags: ["IoT", "Инфраструктура", "Smart Building"],
    priority: "high",
  },
  {
    id: "personal-cabinet",
    icon: "LayoutDashboard",
    title: "Личный кабинет",
    description:
      "Единый портал для студентов, преподавателей и сотрудников.",
    tags: ["Портал", "UX", "Интеграция"],
    priority: "high",
  },
  {
    id: "1c-integration",
    icon: "Database",
    title: "Интеграция с 1С",
    description:
      "ERP-система: финансы, кадры, учебный процесс в одном контуре.",
    tags: ["1С", "ERP", "API"],
    priority: "medium",
  },
  {
    id: "infosec",
    icon: "ShieldCheck",
    title: "Информационная безопасность",
    description: "ИСПД, КИИ, ГОСТ Р 57580, SIEM, мониторинг инцидентов.",
    tags: ["ИСПД", "КИИ", "SIEM"],
    priority: "high",
  },
  {
    id: "staff-training",
    icon: "GraduationCap",
    title: "Обучение сотрудников",
    description: "Цифровые компетенции, LMS, курсы по ИБ для персонала.",
    tags: ["EdTech", "LMS", "Компетенции"],
    priority: "medium",
  },
];
