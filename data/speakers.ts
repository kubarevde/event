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
    name: "Эмер",
    role: "TBD",
    department: "TBD",
    area: "TBD",
    areaVariant: "brand",
    initials: "Э",
  },
  {
    id: "2",
    name: "Газизов",
    role: "TBD",
    department: "TBD",
    area: "TBD",
    areaVariant: "neutral",
    initials: "Г",
  },
  {
    id: "3",
    name: "Висман",
    role: "TBD",
    department: "TBD",
    area: "TBD",
    areaVariant: "brand",
    initials: "В",
  },
  {
    id: "4",
    name: "Соколов",
    role: "TBD",
    department: "TBD",
    area: "TBD",
    areaVariant: "neutral",
    initials: "С",
  },
  {
    id: "5",
    name: "Жамнов",
    role: "TBD",
    department: "TBD",
    area: "TBD",
    areaVariant: "outline",
    initials: "Ж",
  },
  {
    id: "6",
    name: "Гавриленко",
    role: "TBD",
    department: "TBD",
    area: "TBD",
    areaVariant: "outline",
    initials: "Га",
  },
];

// Чтобы добавить/убрать спикера — просто редактируй этот массив.
// Чтобы добавить фото: добавь поле avatar: '/images/speakers/имя.jpg'
// и в компоненте замени SVG-заглушку на <Image src={speaker.avatar} />
