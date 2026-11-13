// node --import ./tools/solusi/register.mjs --test tools/solusi/logic.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SOLUSI } from "../../site/content/solusi/index.ts";
import { KARTU } from "../../site/content/solusi/kartu.ts";
import { SolusiSchema, KartuSchema } from "../../site/content/solusi/schema.ts";
import { CERITA } from "../../site/content/solusi/cerita/index.ts";
import { CeritaSchema } from "../../site/content/solusi/cerita/schema.ts";
import { buildTiers, fitIndustries } from "../../site/lib/solusi/tiers.ts";
import { APPS, INDUSTRI } from "../../site/content/solusi/taksonomi.ts";
import { searchList, searchPage } from "../../site/lib/solusi/search.ts";
import { pickRound, results } from "../../site/lib/solusi/kartu.ts";
import { related } from "../../site/lib/solusi/related.ts";
import {
  defaultMessage,
  searchMessage,
  cardsMessage,
  detailMessage,
} from "../../site/lib/solusi/pesan.ts";
import { parseAnswers, answersQuery } from "../../site/lib/solusi/url.ts";
import { readPrototype } from "./source.mjs";

test("12 unique solutions and 24 unique cards satisfy strict schemas", () => {
  assert.equal(SOLUSI.length, 12);
  assert.equal(KARTU.length, 24);
  assert.equal(new Set(SOLUSI.map((s) => s.slug)).size, 12);
  assert.equal(new Set(KARTU.map((c) => c.id)).size, 24);
  SOLUSI.forEach((s) =>
    assert.equal(SolusiSchema.safeParse(s).success, true, s.slug),
  );
  KARTU.forEach((c) =>
    assert.equal(KartuSchema.safeParse(c).success, true, c.id),
  );
  assert.equal(
    SolusiSchema.safeParse({ ...SOLUSI[0], watch: "private" }).success,
    false,
  );
  assert.equal(
    SolusiSchema.safeParse({ ...SOLUSI[0], metricsKind: undefined }).success,
    false,
  );
  const text = JSON.stringify({ SOLUSI, KARTU });
  assert.doesNotMatch(text, /—|\bkamu\b|claude\.ai|\bwatch\b/i);
});

test("Order Grup story has stable bilingual scenes, valid areas and one final CTA", () => {
  const story = CERITA["order-grup"];
  assert.equal(CeritaSchema.safeParse(story).success, true);
  for (const locale of ["id", "en"]) {
    const copy = story[locale];
    assert.equal(copy.scenes.length, 9);
    assert.equal(new Set(copy.scenes.map((scene) => scene.id)).size, 9);
    assert.deepEqual(
      copy.scenes.map((scene) => scene.id),
      story.id.scenes.map((scene) => scene.id),
    );
    assert.equal(copy.scenes.filter((scene) => scene.cta).length, 1);
    assert.equal(copy.scenes.at(-1).cta, true);
    assert.ok(copy.areas.every((area) => copy.scenes[area.scene]));
  }
});

test("all migrated ID copy and taxonomy equal source literals", () => {
  const source = readPrototype();
  for (const s of SOLUSI) {
    const old = source.SOLUSI.find((x) => x.slug === s.slug);
    for (const key of ["status", "industri", "tim", "apps"])
      assert.deepEqual(s[key], old[key]);
    for (const key of [
      "title",
      "result",
      "answer",
      "client",
      "pains",
      "fit",
      "notFit",
      "prep",
    ])
      assert.deepEqual(s.id[key], old[key], `${s.slug}.${key}`);
    assert.equal(s.id.question, old.q);
    assert.equal(s.id.summary, source.RINGKAS[s.slug]);
    assert.deepEqual(
      s.id.steps.map((x) => [x.title, x.body]),
      old.steps,
    );
    assert.deepEqual(
      s.id.compare.map((x) => [x.aspect, x.before, x.after]),
      old.compare,
    );
    assert.deepEqual(
      s.id.faq.map((x) => [x.q, x.a]),
      old.faq,
    );
    assert.deepEqual(
      s.id.metrics?.map((x) => [x.value, x.unit, x.label]),
      old.metrics,
    );
  }
  for (const c of KARTU) {
    const old = source.KARTU.find((x) => x.id === c.id);
    assert.deepEqual(
      { id: c.id, t: c.text.id, ind: c.industri, tim: c.tim, sol: c.solusi },
      old,
    );
  }
});

test("every copy field in COPY section 19 matches migrated data", () => {
  const copy = readFileSync(
    new URL("../../docs/SOLUSI-V1-COPY.md", import.meta.url),
    "utf8",
  );
  let count = 0;
  for (const s of SOLUSI) {
    const section = copy
      .split(new RegExp(`### 19\\.\\d+ ${s.slug}\\r?\\n`))[1]
      ?.split(/### 19\./)[0];
    assert.ok(section, s.slug);
    for (const line of section.split(/\r?\n/)) {
      const match = line.match(/^\| (id\.[^|]+) \| (.+) \|$/);
      if (!match) continue;
      const path = match[1]
        .replace(" (baru)", "")
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".");
      let actual = path.reduce((value, key) => value?.[key], s);
      if (/^id\.metrics\[\d+\]$/.test(match[1]))
        actual = `${actual.value} ${actual.unit} · ${actual.label}`;
      assert.equal(actual, match[2], `${s.slug}.${match[1]}`);
      count++;
    }
  }
  assert.ok(count > 300, `Checked ${count} fields`);
});

test("seven tiers and source ordering match LOGIKA 6, without decor since 13 Nov", () => {
  const tiers = buildTiers(SOLUSI);
  assert.deepEqual(
    tiers.map((t) => [t.team.id, t.solutions.length]),
    [
      ["cs", 3],
      ["operasional", 3],
      ["marketing", 2],
      ["penjualan", 1],
      ["keuangan", 1],
      ["manajemen", 1],
      ["sdm", 1],
    ],
  );
  assert.ok(tiers.every((t) => !("decorations" in t)));
  assert.deepEqual(
    tiers[0].solutions.map((s) => s.slug),
    ["booking-jasa", "cs-klinik", "ulasan-pelanggan"],
  );
  assert.equal(buildTiers([]).length, 0);
});

test("fit chips: every industry collapses to one chip, otherwise the source order", () => {
  for (const s of SOLUSI) {
    const fit = fitIndustries(s);
    if (s.industri.length >= INDUSTRI.length) assert.equal(fit, "all");
    else assert.deepEqual(fit, s.industri);
  }
  assert.equal(fitIndustries({ industri: INDUSTRI.map((i) => i.id) }), "all");
  assert.deepEqual(fitIndustries({ industri: ["klinik"] }), ["klinik"]);
});

test("app colours keep 3:1 on the white circle (WCAG 1.4.11)", () => {
  const lum = (hex) => {
    const c = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  for (const app of APPS)
    assert.ok(1.05 / (lum(app.color) + 0.05) >= 3, app.id);
});

test("search phrases, status, all teams and intersecting filters", () => {
  for (const [term, n] of [
    ["stok", 1],
    ["dokumen", 2],
    ["pemilik", 3],
    ["jadwal", 4],
    ["pelanggan", 5],
    ["", 12],
  ])
    assert.equal(searchList(SOLUSI, { term }).length, n, term);
  assert.deepEqual(
    searchList(SOLUSI, { term: "  STOK  " }).map((s) => s.slug),
    ["stok-menipis"],
  );
  assert.equal(searchList(SOLUSI, { term: "order dokumen" }).length, 0);
  assert.deepEqual(
    searchList(SOLUSI, {
      industri: "jasa",
      tim: "operasional",
      app: "calendar",
      status: "jalan",
    }).map((s) => s.slug),
    ["booking-jasa"],
  );
  assert.equal(searchList(SOLUSI, { status: "jalan" }).length, 4);
  assert.equal(
    searchList(SOLUSI, { industri: "klinik", app: "gmail", status: "jalan" })
      .length,
    0,
  );
});

test("six per page: all 12 reachable, no overlap, boundaries and no results", () => {
  const first = searchPage(SOLUSI),
    second = searchPage(SOLUSI, {}, 2);
  assert.equal(first.total, 12);
  assert.equal(first.hasNext, true);
  assert.equal(first.hasPrevious, false);
  assert.equal(second.hasNext, false);
  assert.equal(second.hasPrevious, true);
  assert.equal(
    new Set([...first.items, ...second.items].map((s) => s.slug)).size,
    12,
  );
  for (const page of [-3, 0, NaN, Infinity])
    assert.equal(searchPage(SOLUSI, {}, page).page, 1);
  assert.equal(searchPage(SOLUSI, {}, 99).page, 2);
  assert.equal(searchPage(SOLUSI, { term: "unmatched" }, 9).pageCount, 0);
  assert.equal(searchPage(SOLUSI, { term: "stok" }, 2).page, 1);
});

test("LOGIKA 11.5: three deterministic rounds, scoring and ranking without percentages", () => {
  let state = { industri: "retail", yes: [], no: [], seen: new Set() };
  const expected = [
    ["k1", "k3", "k5"],
    ["k6", "k17", "k20"],
    ["k24", "k4", "k22"],
  ];
  const answers = [
    [true, false, true],
    [true, false, false],
    [false, true, false],
  ];
  for (let r = 0; r < 3; r++) {
    const round = pickRound(KARTU, state, () => 0);
    assert.deepEqual(
      round.map((c) => c.id),
      expected[r],
    );
    assert.equal(state.seen.size, r * 3, "selection does not mutate input");
    round.forEach((c, i) => {
      state.seen.add(c.id);
      state[answers[r][i] ? "yes" : "no"].push(c);
    });
  }
  assert.deepEqual(
    results(SOLUSI, state).map((r) => [r.solution.slug, r.score, r.rank]),
    [
      ["cs-klinik", 7, 1],
      ["booking-jasa", 5.5, 2],
      ["order-grup", 2, 3],
    ],
  );
  assert.ok(results(SOLUSI, state).every((r) => !("pct" in r)));
  assert.deepEqual(results(SOLUSI, { industri: "", yes: [], no: KARTU }), []);
  assert.equal(
    pickRound(
      KARTU,
      { ...state, seen: new Set(KARTU.map((c) => c.id)) },
      () => 0,
    ).length,
    0,
  );
});

test("related solutions exclude current slug and keep stable ties", () => {
  const matches = related(SOLUSI[0], SOLUSI);
  // Both score 4 (one shared team, two industries); source order breaks the tie.
  assert.deepEqual(
    matches.map((s) => s.slug),
    ["asisten-sop", "stok-menipis"],
  );
});

test("contact templates exactly match COPY 12, including line breaks", () => {
  const base = "Halo Kreatekno, saya mau konsultasi otomasi untuk bisnis saya.";
  assert.equal(defaultMessage(), base);
  assert.equal(searchMessage("  "), base);
  assert.equal(
    searchMessage("  stok  "),
    "Halo Kreatekno, saya mencari solusi untuk: stok. Saya mau konsultasi.",
  );
  const state = { industri: "retail", yes: [KARTU[0]], no: [] };
  assert.equal(
    cardsMessage(state),
    "Halo Kreatekno, saya baru mencoba kartu masalah di website. Masalah di usaha saya (Retail & F&B):\n- Order dari grup chat sering terlewat\nSaya mau konsultasi.",
  );
  assert.equal(
    cardsMessage({ ...state, industri: "" }),
    "Halo Kreatekno, saya baru mencoba kartu masalah di website. Masalah di usaha saya:\n- Order dari grup chat sering terlewat\nSaya mau konsultasi.",
  );
  assert.equal(cardsMessage({ ...state, yes: [] }), base);
  assert.equal(
    detailMessage("Judul"),
    'Halo Kreatekno, saya lihat solusi "Judul". Saya mau konsultasi solusi serupa untuk bisnis saya.',
  );
});

test("result URL survives serialization; duplicate, unknown and contradictory IDs cannot inflate scores", () => {
  const state = {
    industri: "retail",
    yes: [KARTU[0], KARTU[4]],
    no: [KARTU[2]],
  };
  assert.deepEqual(parseAnswers(answersQuery(state), KARTU), state);
  assert.deepEqual(
    parseAnswers("?b=retail&y=k1,k1,bogus&y=k5&n=k1,k3", KARTU),
    { industri: "retail", yes: [KARTU[4]], no: [KARTU[2]] },
  );
  assert.deepEqual(parseAnswers("?b=bogus&y=k999", KARTU), {
    industri: "",
    yes: [],
    no: [],
  });
  assert.equal(parseAnswers("?b=retail&b=klinik", KARTU).industri, "");
  assert.deepEqual(
    parseAnswers(
      "?y=" +
        KARTU.slice(0, 10)
          .map((c) => c.id)
          .join(","),
      KARTU,
    ),
    { industri: "", yes: [], no: [] },
  );
});
