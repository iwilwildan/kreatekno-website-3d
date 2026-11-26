// node --import ./tools/solusi/register.mjs --test tools/pustaka/search.test.mjs
// Pustaka P1: the library card search over the real article meta (ID and EN).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalize, searchBooks } from "../../site/lib/articles/search.ts";
import { ARTICLE_KEYS } from "../../site/content/articles/slugs.ts";

const root = new URL("../../site/", import.meta.url);
const messages = {
  id: JSON.parse(readFileSync(new URL("messages/id.json", root), "utf8")),
  en: JSON.parse(readFileSync(new URL("messages/en.json", root), "utf8")),
};

/** The `export const meta = {…};` object literal of an article (our own content, read as data). */
function meta(locale, key) {
  const source = readFileSync(
    new URL(`content/articles/${locale}/${key}.mdx`, root),
    "utf8",
  );
  const literal = source.match(/^export const meta = (\{[\s\S]*?\n\});/m)?.[1];
  assert.ok(literal, `${locale}/${key} has meta`);
  return new Function(`return (${literal});`)();
}

const books = (locale) =>
  ARTICLE_KEYS.map((key) => {
    const m = meta(locale, key);
    return {
      key,
      title: m.title,
      summary: m.summary,
      category: messages[locale].home.articles[key].category,
      keywords: m.keywords,
    };
  });
const keys = (locale, query) =>
  searchBooks(books(locale), query).items.map((b) => b.key);

test("normalize drops case, accents and punctuation", () => {
  assert.equal(normalize("  Café, Kasir—AI! "), "cafe kasir ai");
});

test("every article has 4 to 16 keywords in both languages", () => {
  for (const locale of ["id", "en"])
    for (const book of books(locale))
      assert.ok(
        book.keywords.length >= 4 && book.keywords.length <= 16,
        book.key,
      );
});

test("an empty card returns every book in shelf order", () => {
  assert.deepEqual(keys("id", {}), ARTICLE_KEYS);
  assert.deepEqual(keys("en", { term: "   " }), ARTICLE_KEYS);
});

test("all words must match, in any order", () => {
  assert.deepEqual(keys("id", { term: "chat pembeli" }), ["service"]);
  assert.deepEqual(keys("id", { term: "pembeli chat" }), ["service"]);
  assert.deepEqual(keys("en", { term: "customer chats" }), ["service"]);
  assert.deepEqual(keys("id", { term: "chat keuangan" }), []);
});

test("words match the start of a word, not its middle", () => {
  assert.deepEqual(keys("id", { term: "pembel" }), ["service"]);
  assert.deepEqual(keys("id", { term: "beli" }), []);
});

test("typical questions land on the expected book", () => {
  assert.deepEqual(keys("id", { term: "untung rugi" }), ["money"]);
  assert.deepEqual(keys("id", { term: "TAGIHAN" }), ["admin"]);
  assert.deepEqual(
    keys("id", { term: "melatih karyawan" }).includes("team"),
    true,
  );
  assert.deepEqual(keys("id", { term: "jadwal posting" }), ["promo"]);
  assert.deepEqual(keys("en", { term: "profit" }), ["money"]);
  assert.deepEqual(keys("en", { term: "train staff" }), ["team"]);
  assert.deepEqual(keys("en", { term: "social media" }), ["promo"]);
});

test("the topic narrows to one book and combines with words", () => {
  assert.deepEqual(keys("id", { topic: "promo" }), ["promo"]);
  assert.deepEqual(keys("id", { topic: "promo", term: "konten" }), ["promo"]);
  assert.deepEqual(keys("id", { topic: "money", term: "konten" }), []);
});

test("AI on its own finds several books", () => {
  assert.ok(keys("id", { term: "ai" }).length >= 4);
});
