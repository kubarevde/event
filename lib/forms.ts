// Модель формы из конструктора (общая для сервера, админки и лендинга).

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "number"
  | "select"
  | "radio"
  | "checkboxes"
  | "checkbox"
  | "consent";

export const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Строка" },
  { value: "textarea", label: "Многострочный текст" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Телефон" },
  { value: "number", label: "Число" },
  { value: "select", label: "Выпадающий список" },
  { value: "radio", label: "Один вариант (радио)" },
  { value: "checkboxes", label: "Несколько вариантов" },
  { value: "checkbox", label: "Галочка (да/нет)" },
  { value: "consent", label: "Согласие на обработку ПДн" },
];

export const TYPES_WITH_OPTIONS: FieldType[] = ["select", "radio", "checkboxes"];

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  help: string;
  required: boolean;
  options: string[];
  /** Для consent: ссылка на документ, которая подставляется в подпись. */
  linkUrl: string;
  /** Поле занимает половину ширины (две колонки на десктопе). */
  half: boolean;
}

export interface FormSchema {
  title: string;
  description: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  fields: FormField[];
}

export interface FormRecord {
  id: string;
  name: string;
  schema: FormSchema;
  createdAt: number;
  updatedAt: number;
}

export function newField(type: FieldType, label = ""): FormField {
  return {
    id: `f_${Math.random().toString(36).slice(2, 8)}`,
    type,
    label: label || FIELD_TYPES.find((t) => t.value === type)?.label || "Поле",
    placeholder: "",
    help: "",
    required: false,
    options: TYPES_WITH_OPTIONS.includes(type) ? ["Вариант 1", "Вариант 2"] : [],
    linkUrl: "",
    half: false,
  };
}

export function defaultFormSchema(privacyUrl = ""): FormSchema {
  const f = (type: FieldType, id: string, label: string, extra: Partial<FormField> = {}) => ({
    ...newField(type, label),
    id,
    ...extra,
  });
  return {
    title: "",
    description: "",
    submitLabel: "Отправить заявку",
    successTitle: "Заявка отправлена",
    successMessage: "Спасибо! Мы свяжемся с вами в течение 1 рабочего дня.",
    fields: [
      f("text", "name", "ФИО", { required: true, placeholder: "Иванов Иван Иванович" }),
      f("text", "company", "Компания", { required: true, half: true }),
      f("text", "position", "Должность", { half: true }),
      f("email", "email", "Email", { required: true, half: true, placeholder: "name@company.ru" }),
      f("tel", "phone", "Телефон", { required: true, half: true, placeholder: "+7 (___) ___-__-__" }),
      f("radio", "format", "Формат участия", {
        required: true,
        options: ["Очно", "Онлайн"],
      }),
      f("textarea", "comment", "Комментарий", {
        placeholder: "Какие направления вам интересны?",
      }),
      f("consent", "consent", "Я согласен на обработку персональных данных", {
        required: true,
        linkUrl: privacyUrl,
      }),
    ],
  };
}

export type SubmissionValue = string | string[] | boolean;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 4000;

/** Проверяет и нормализует ответ по схеме формы. Лишние поля отбрасываются. */
export function validateSubmission(
  schema: FormSchema,
  input: Record<string, unknown>
): { ok: true; data: Record<string, SubmissionValue> } | { ok: false; errors: Record<string, string> } {
  const data: Record<string, SubmissionValue> = {};
  const errors: Record<string, string> = {};

  for (const field of schema.fields) {
    const raw = input[field.id];

    if (field.type === "checkbox" || field.type === "consent") {
      const checked = raw === true || raw === "true" || raw === "on";
      if (field.required && !checked) errors[field.id] = "Необходимо отметить";
      data[field.id] = checked;
      continue;
    }

    if (field.type === "checkboxes") {
      const values = (Array.isArray(raw) ? raw : [])
        .map(String)
        .filter((v) => field.options.includes(v));
      if (field.required && values.length === 0) errors[field.id] = "Выберите хотя бы один вариант";
      data[field.id] = values;
      continue;
    }

    const value = typeof raw === "string" || typeof raw === "number" ? String(raw).trim() : "";
    if (!value) {
      if (field.required) errors[field.id] = "Обязательное поле";
      data[field.id] = "";
      continue;
    }
    if (value.length > MAX_LEN) {
      errors[field.id] = "Слишком длинное значение";
    } else if (field.type === "email" && !EMAIL_RE.test(value)) {
      errors[field.id] = "Некорректный email";
    } else if (field.type === "tel" && value.replace(/\D/g, "").length < 6) {
      errors[field.id] = "Некорректный телефон";
    } else if (field.type === "number" && Number.isNaN(Number(value.replace(",", ".")))) {
      errors[field.id] = "Введите число";
    } else if ((field.type === "select" || field.type === "radio") && !field.options.includes(value)) {
      errors[field.id] = "Выберите вариант из списка";
    }
    data[field.id] = value;
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function formatValue(value: SubmissionValue | undefined): string {
  if (value === undefined) return "";
  if (typeof value === "boolean") return value ? "да" : "нет";
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

export const SUBMISSION_STATUSES = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "approved", label: "Подтверждена" },
  { value: "paid", label: "Оплачена" },
  { value: "rejected", label: "Отклонена" },
] as const;

export function statusLabel(status: string) {
  return SUBMISSION_STATUSES.find((s) => s.value === status)?.label ?? status;
}
