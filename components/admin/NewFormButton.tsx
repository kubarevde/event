"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { btnCls } from "./ui";

export default function NewFormButton() {
  const router = useRouter();
  const create = async () => {
    const name = prompt("Название новой формы", "Новая форма");
    if (name === null) return;
    const res = await fetch("/api/admin/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) router.push(`/admin/forms/${(await res.json()).id}`);
  };
  return (
    <button type="button" className={btnCls.primary} onClick={create}>
      <Plus className="h-4 w-4" />
      Новая форма
    </button>
  );
}
