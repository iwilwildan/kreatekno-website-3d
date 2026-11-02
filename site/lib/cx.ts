/** Joins class names, skipping falsy ones. (Prettier's Tailwind plugin trims spaces inside template literals.) */
export function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(" ");
}
