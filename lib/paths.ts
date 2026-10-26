// Чтение и неизменяемая запись по пути вида "speakers.items.0.name".

export function getAt(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => (acc == null ? undefined : (acc as Record<string, unknown>)[key]), obj);
}

export function setAt<T>(obj: T, path: string, value: unknown): T {
  const [key, ...rest] = path.split(".");
  const isIndex = /^\d+$/.test(key);
  const current = obj as unknown as Record<string, unknown> | unknown[];
  const child = (current as Record<string, unknown>)?.[key];
  const next = rest.length ? setAt(child, rest.join("."), value) : value;
  if (Array.isArray(current) || isIndex) {
    const copy = Array.isArray(current) ? [...current] : [];
    copy[Number(key)] = next;
    return copy as unknown as T;
  }
  return { ...(current as Record<string, unknown>), [key]: next } as T;
}
