export type Speaker = {
  id: string;
  name: string;
  role: string;
  department: string;
  area: string;
  areaVariant: "brand" | "neutral" | "outline";
  initials: string;
  avatar?: string;
};

export const SPEAKERS: Speaker[] = [
  {
    id: "1",
    name: "Эмер Юлия Антоновна",
    role: "Проректор по информационной политике и цифровым коммуникациям",
    department: "",
    area: "",
    areaVariant: "brand",
    initials: "Э",
    avatar: "/images/speakers/emer.jpg",
  },
  {
    id: "2",
    name: "Газизов Тимур Тальгатович",
    role: "Директор дирекции по информационной безопасности",
    department: "",
    area: "",
    areaVariant: "neutral",
    initials: "Г",
    avatar: "/images/speakers/gavrilenko.jpg",
  },
  {
    id: "3",
    name: "Висман Ян Александрович",
    role: "Начальник отдела разработки цифровых решений",
    department: "",
    area: "",
    areaVariant: "brand",
    initials: "В",
    avatar: "/images/speakers/gazizov.jpg",
  },
  {
    id: "4",
    name: "Соколов Данила Александрович",
    role: "Начальник управления цифровых решений",
    department: "",
    area: "",
    areaVariant: "neutral",
    initials: "С",
    avatar: "/images/speakers/visman.jpg",
  },
  {
    id: "5",
    name: "Жамнов Вадим Владимирович",
    role: "Директор центра компетенций по корпоративным информационным системам",
    department: "",
    area: "",
    areaVariant: "outline",
    initials: "Ж",
    avatar: "/images/speakers/zhamnov.jpg",
  },
  {
    id: "6",
    name: "Гавриленко Ростислав Алексеевич",
    role: "Начальник управления информационно-телекоммуникационной инфраструктуры",
    department: "",
    area: "",
    areaVariant: "outline",
    initials: "Га",
    avatar: "/images/speakers/sokolov.jpg",
  },
];
