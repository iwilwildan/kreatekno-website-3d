import type { SolusiLocale } from "../../content/solusi/schema";
import type { Answers } from "./kartu";
import { INDUSTRI } from "../../content/solusi/taksonomi";

export function defaultMessage(locale: SolusiLocale = "id") {
  return locale === "id"
    ? "Halo Kreatekno, saya mau konsultasi otomasi untuk bisnis saya."
    : "Hello Kreatekno, I would like to discuss automation for my business.";
}
export function searchMessage(term: string, locale: SolusiLocale = "id") {
  const query = term.trim();
  if (!query) return defaultMessage(locale);
  return locale === "id"
    ? `Halo Kreatekno, saya mencari solusi untuk: ${query}. Saya mau konsultasi.`
    : `Hello Kreatekno, I am looking for a solution for: ${query}. I would like a consultation.`;
}
export function cardsMessage(state: Answers, locale: SolusiLocale = "id") {
  if (!state.yes.length) return defaultMessage(locale);
  const label = INDUSTRI.find((i) => i.id === state.industri)?.label[locale];
  const industry = label ? ` (${label})` : "";
  const problems = state.yes
    .map((c) => {
      const text = c.text[locale];
      if (!text) throw new Error(`Missing ${locale} card copy: ${c.id}`);
      return `- ${text.replace(/\?$/, "")}`;
    })
    .join("\n");
  return locale === "id"
    ? `Halo Kreatekno, saya baru mencoba kartu masalah di website. Masalah di usaha saya${industry}:\n${problems}\nSaya mau konsultasi.`
    : `Hello Kreatekno, I just tried the problem cards on your website. Problems in my business${industry}:\n${problems}\nI would like a consultation.`;
}
export function detailMessage(title: string, locale: SolusiLocale = "id") {
  return locale === "id"
    ? `Halo Kreatekno, saya lihat solusi "${title}". Saya mau konsultasi solusi serupa untuk bisnis saya.`
    : `Hello Kreatekno, I saw the solution "${title}". I would like to discuss a similar solution for my business.`;
}
