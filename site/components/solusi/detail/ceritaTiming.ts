/**
 * Scene timing of the Tonton motion graphics, shared by the page (scroll → scene, rail, captions), the lazily
 * loaded GSAP films and QA. `in` = transition from the previous scene, `hold` = reading time (timeline seconds).
 * The rail nodes are scenes 1..`nodes`: six for the nine-scene stories, seven for CS Klinik (ten scenes).
 */
export type SceneTiming = ReadonlyArray<{ readonly in: number; readonly hold: number }>;

export type Timing = ReturnType<typeof makeTiming>;

export function makeTiming(sc: SceneTiming, nodes = 6) {
  const start: number[] = [];
  const end: number[] = [];
  sc.reduce((t, s, i) => {
    start[i] = t;
    end[i] = t + s.in + s.hold;
    return end[i];
  }, 0);
  const total = end[end.length - 1];

  /** Scene shown at timeline time `t`: a scene counts once half its transition has played. */
  const sceneAt = (t: number) => {
    let scene = 0;
    sc.forEach((s, i) => {
      if (t >= start[i] + s.in * 0.5 - 1e-4) scene = i;
    });
    return scene;
  };

  /** Time to rest on when jumping to a scene: mid-way through its reading hold. */
  const restTime = (scene: number) => end[scene] - sc[scene].hold * 0.5;

  /**
   * Data packet on the workflow rail at time `t`, as a fractional node index (rail nodes are scenes
   * 1..`nodes`), or null while it is off the rail.
   */
  const packetAt = (t: number): number | null => {
    if (t < start[1] || t >= start[nodes + 1]) return null;
    let k = 1;
    for (let i = 1; i <= nodes; i++) if (t >= start[i]) k = i;
    if (k === 1) return 0;
    return k - 2 + Math.min(1, (t - start[k]) / sc[k].in);
  };

  return { SC: sc, NODES: nodes, START: start, END: end, TOTAL: total, sceneAt, restTime, packetAt };
}

/** Order Grup (OG5b/OG5c). */
export const SC = [
  { in: 1.6, hold: 0.6 },
  { in: 1.0, hold: 0.6 },
  { in: 1.4, hold: 0.7 },
  { in: 1.4, hold: 0.6 },
  { in: 0.8, hold: 0.6 },
  { in: 1.3, hold: 0.6 },
  { in: 1.2, hold: 0.7 },
  { in: 1.0, hold: 0.6 },
  { in: 0.6, hold: 0.9 },
] as const;

export const ORDER_GRUP = makeTiming(SC);
export const { START, END, TOTAL, sceneAt, restTime, packetAt } = ORDER_GRUP;

/** Booking Jasa (BJ1 "one booking travels"). */
export const BOOKING_JASA = makeTiming([
  { in: 1.6, hold: 0.6 },
  { in: 1.0, hold: 0.6 },
  { in: 1.6, hold: 0.7 },
  { in: 1.6, hold: 0.7 },
  { in: 1.2, hold: 0.6 },
  { in: 1.2, hold: 0.6 },
  { in: 1.8, hold: 0.7 },
  { in: 1.0, hold: 0.6 },
  { in: 0.6, hold: 0.9 },
]);

/** Riset Konten (RK1 "one topic travels"). */
export const RISET_KONTEN = makeTiming([
  { in: 1.6, hold: 0.6 },
  { in: 1.6, hold: 0.6 },
  { in: 2.0, hold: 0.7 },
  { in: 2.0, hold: 0.7 },
  { in: 1.5, hold: 0.7 },
  { in: 1.2, hold: 0.6 },
  { in: 1.4, hold: 0.7 },
  { in: 1.0, hold: 0.6 },
  { in: 0.6, hold: 0.9 },
]);

/** CS Klinik (CK1 "one patient chat travels"): ten scenes, seven rail nodes. */
export const CS_KLINIK = makeTiming(
  [
    { in: 1.6, hold: 0.6 },
    { in: 1.2, hold: 0.6 },
    { in: 1.4, hold: 0.7 },
    { in: 1.5, hold: 0.7 },
    { in: 1.8, hold: 0.7 },
    { in: 1.3, hold: 0.7 },
    { in: 1.4, hold: 0.7 },
    { in: 1.6, hold: 0.7 },
    { in: 1.0, hold: 0.6 },
    { in: 0.6, hold: 0.9 },
  ],
  7,
);

/** Follow-up Prospek (FP1 "one prospect row travels"): nine scenes, six rail nodes. */
export const FOLLOWUP_PROSPEK = makeTiming([
  { in: 1.6, hold: 0.6 },
  { in: 1.0, hold: 0.6 },
  { in: 1.4, hold: 0.7 },
  { in: 1.4, hold: 0.7 },
  { in: 2.0, hold: 0.8 },
  { in: 1.6, hold: 0.7 },
  { in: 1.4, hold: 0.7 },
  { in: 1.0, hold: 0.6 },
  { in: 0.6, hold: 0.9 },
]);

/** Catat Pengeluaran (CP1 "one receipt travels"): nine scenes, six rail nodes. */
export const CATAT_PENGELUARAN = makeTiming([
  { in: 1.6, hold: 0.6 },
  { in: 1.4, hold: 0.7 },
  { in: 1.6, hold: 0.7 },
  { in: 1.8, hold: 0.8 },
  { in: 1.6, hold: 0.8 },
  { in: 1.6, hold: 0.7 },
  { in: 1.4, hold: 0.8 },
  { in: 1.0, hold: 0.6 },
  { in: 0.6, hold: 0.9 },
]);

/** Balas Komentar (BK1): one public comment becomes one private conversation. */
export const BALAS_KOMENTAR = makeTiming([
  { in: 1.6, hold: 0.6 },
  { in: 1.4, hold: 0.7 },
  { in: 1.5, hold: 0.7 },
  { in: 1.5, hold: 0.7 },
  { in: 1.6, hold: 0.8 },
  { in: 1.6, hold: 0.8 },
  { in: 1.9, hold: 0.8 },
  { in: 1.0, hold: 0.6 },
  { in: 0.6, hold: 0.9 },
]);

/** Faktur Pemasok (FK1): one invoice from intake to the owner's decision. */
export const FAKTUR_PEMASOK = makeTiming([
  { in: 1.4, hold: 0.65 },
  { in: 1.3, hold: 0.7 },
  { in: 1.6, hold: 0.8 },
  { in: 1.6, hold: 0.8 },
  { in: 1.8, hold: 0.9 },
  { in: 1.5, hold: 0.8 },
  { in: 2.0, hold: 0.9 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

/** Layanan SDM (SD1): leave request, manager decision, then balance update. */
export const LAYANAN_SDM = makeTiming([
  { in: 1.4, hold: 0.6 },
  { in: 1.4, hold: 0.7 },
  { in: 2.0, hold: 1.0 },
  { in: 1.4, hold: 0.7 },
  { in: 1.6, hold: 0.8 },
  { in: 1.6, hold: 0.8 },
  { in: 1.9, hold: 0.9 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

/** Onboarding Klien (OK1): one deal from signed package to a sent invitation. */
export const ONBOARDING_KLIEN = makeTiming([
  { in: 1.4, hold: 0.6 },
  { in: 1.4, hold: 0.7 },
  { in: 1.5, hold: 0.8 },
  { in: 1.6, hold: 0.8 },
  { in: 1.8, hold: 0.9 },
  { in: 2.0, hold: 0.9 },
  { in: 1.5, hold: 0.8 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

/** Asisten SOP (AS1): first a cited answer, then a question for the branch manager. */
export const ASISTEN_SOP = makeTiming([
  { in: 1.3, hold: 0.7 },
  { in: 1.3, hold: 0.7 },
  { in: 1.5, hold: 0.8 },
  { in: 1.3, hold: 0.8 },
  { in: 1.9, hold: 1.0 },
  { in: 2.0, hold: 1.0 },
  { in: 1.5, hold: 0.8 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

/** Carousel Konten (CR1): one content row becomes five slides and a caption for review. */
export const CAROUSEL_KONTEN = makeTiming([
  { in: 1.4, hold: 0.7 },
  { in: 1.3, hold: 0.7 },
  { in: 1.7, hold: 0.8 },
  { in: 1.4, hold: 0.7 },
  { in: 1.9, hold: 1.0 },
  { in: 1.5, hold: 0.8 },
  { in: 2.0, hold: 1.0 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

/** Berkas Dokumen (BD1): receive two files, request updates, then check the completed folder. */
export const BERKAS_DOKUMEN = makeTiming([
  { in: 1.3, hold: 0.7 },
  { in: 1.4, hold: 0.7 },
  { in: 1.4, hold: 0.8 },
  { in: 1.8, hold: 0.9 },
  { in: 1.5, hold: 0.8 },
  { in: 1.9, hold: 0.9 },
  { in: 2.0, hold: 1.0 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

/** Stok Menipis (SM1): alert after an outflow, then update stock when the new order arrives. */
export const STOK_MENIPIS = makeTiming([
  { in: 1.3, hold: 0.7 },
  { in: 1.4, hold: 0.7 },
  { in: 1.5, hold: 0.8 },
  { in: 2.0, hold: 1.0 },
  { in: 1.5, hold: 0.8 },
  { in: 1.7, hold: 0.9 },
  { in: 2.0, hold: 0.9 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

/** Pengingat Tagihan (PT1): three reminders, one paid invoice, and one owner follow-up. */
export const PENGINGAT_TAGIHAN = makeTiming([
  { in: 1.3, hold: 0.7 },
  { in: 1.4, hold: 0.8 },
  { in: 1.6, hold: 0.9 },
  { in: 1.5, hold: 0.8 },
  { in: 1.6, hold: 0.9 },
  { in: 1.8, hold: 0.9 },
  { in: 1.9, hold: 1.0 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

/** Ulasan Pelanggan (UP1): daily feedback becomes a weekly comparison and a staff action. */
export const ULASAN_PELANGGAN = makeTiming([
  { in: 1.3, hold: 0.7 },
  { in: 1.5, hold: 0.8 },
  { in: 1.6, hold: 0.8 },
  { in: 1.8, hold: 0.9 },
  { in: 1.6, hold: 0.8 },
  { in: 1.6, hold: 0.9 },
  { in: 2.0, hold: 1.0 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

/** Rekap Penjualan (RP1): sales rows lead to two comparisons and a sourced follow-up. */
export const REKAP_PENJUALAN = makeTiming([
  { in: 1.3, hold: 0.7 },
  { in: 1.7, hold: 0.9 },
  { in: 1.7, hold: 0.9 },
  { in: 1.7, hold: 0.9 },
  { in: 1.6, hold: 0.9 },
  { in: 1.5, hold: 0.8 },
  { in: 2.0, hold: 1.0 },
  { in: 1.0, hold: 0.7 },
  { in: 0.6, hold: 0.9 },
]);

export const TIMING = {
  "order-grup": ORDER_GRUP,
  "booking-jasa": BOOKING_JASA,
  "riset-konten": RISET_KONTEN,
  "cs-klinik": CS_KLINIK,
  "followup-prospek": FOLLOWUP_PROSPEK,
  "catat-pengeluaran": CATAT_PENGELUARAN,
  "balas-komentar": BALAS_KOMENTAR,
  "faktur-pemasok": FAKTUR_PEMASOK,
  "layanan-sdm": LAYANAN_SDM,
  "onboarding-klien": ONBOARDING_KLIEN,
  "asisten-sop": ASISTEN_SOP,
  "carousel-konten": CAROUSEL_KONTEN,
  "berkas-dokumen": BERKAS_DOKUMEN,
  "stok-menipis": STOK_MENIPIS,
  "pengingat-tagihan": PENGINGAT_TAGIHAN,
  "ulasan-pelanggan": ULASAN_PELANGGAN,
  "rekap-penjualan": REKAP_PENJUALAN,
} as const;
