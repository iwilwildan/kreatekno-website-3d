/*
 * The Home story: one camera take in 18 beats and 21 keyframes, K0 to K16 plus K2.1, K2.2, K5a and K9a
 * (STORY-STAGE.md, after the team's revision of 25 Oct 2026; K2.1 and K2.2 came with the footage of 29 Oct). Time is measured in screens of scroll.
 * Every step of the take runs from the previous step's keyframe to its own `k`: move = camera move (the
 * footage scrubs between the two keyframes); hold = `k` is held while the copy is read. lead = first
 * camera move of the step (carries the previous props out), tail = last camera move (carries this step's
 * props in). Steps without an id have no copy.
 *
 * Beat 1 takes two steps: the hero copy sits on the billboard in K0, the first frame, so the page opens on
 * that hold and the crane down to K1 only starts when the visitor scrolls. Beat 2 takes three steps: into
 * the shop (K2), then over to the staff on the left (K2.1) and on the right (K2.2), all without copy.
 */

export type Cam =
  | "craneDown"
  | "craneUp"
  | "throughIn"
  | "throughOut"
  | "dollyIn"
  | "dollyOut"
  | "arc"
  | "truckRight"
  | "truckLeft"
  /* the props ride on a track that the beat's own action moves (the shop panels of beat 5b) */
  | "track";

export type Beat = {
  /** Beat label from the team's document: "1" to "16", plus "5a", "5b", "9a", "9b". */
  n: string;
  /** Keyframe this step ends on. */
  k: string;
  id?: string;
  name: string;
  cam: string;
  lead: Cam;
  tail: Cam;
  move: number;
  hold: number;
  /** What the keyframe has to show (for the video team, shown in the zones tool). */
  kf: string;
  desk?: string;
  phone?: string;
};

export const BEATS: Beat[] = [
  {
    n: "1",
    k: "K0",
    id: "beranda",
    name: "Hero",
    cam: "Tahan di frame pertama",
    lead: "craneDown",
    tail: "craneDown",
    move: 0,
    hold: 0.9,
    kf: "Pagi. Billboard kosong di atap COMPANY, frontal, kiri-tengah, sekitar 48% lebar frame; langit lega di atasnya, empat burung putih terbang ke kanan atas. Fasad dan papan nama di bawah frame.",
    phone: "HP: billboard selebar layar di tengah, langit dan burung di atas. Copy hero tetap di permukaan billboard.",
  },
  {
    n: "1",
    k: "K1",
    name: "Hero, turun ke pintu",
    cam: "Crane Down → Eye Level",
    lead: "craneDown",
    tail: "craneDown",
    move: 1.0,
    hold: 0,
    kf: "Setinggi mata di trotoar. Pintu kaca ganda COMPANY tertutup di tengah, kanopi oranye dan papan nama di atas. Heru berdiri di depan daun pintu kanan, terlihat dari belakang.",
  },
  {
    n: "2",
    k: "K2",
    name: "Transisi masalah",
    cam: "Follow Heru lewat pintu toko",
    lead: "throughIn",
    tail: "throughIn",
    move: 1.2,
    hold: 0,
    kf: "Dalam toko, pagi hangat. Kepala Heru di tengah bawah, konter kasir oranye dan Bu Dewi yang prihatin di tengah, empat meja staf kacau menghadap kamera.",
  },
  {
    n: "2",
    k: "K2.1",
    name: "Transisi masalah, staf kiri",
    cam: "Dolly In + Pan Left ke meja Sinta dan Bayu",
    lead: "dollyIn",
    tail: "dollyIn",
    move: 0.8,
    hold: 0,
    kf: "Sinta (hijab kuning) menatap ponsel penuh notifikasi hijau di kiri, Bayu di balik monitor dan tumpukan slip pesanan di tengah, ujung kiri konter oranye di kanan. Cahaya pagi dari jendela kiri.",
  },
  {
    n: "2",
    k: "K2.2",
    name: "Transisi masalah, staf kanan",
    cam: "Whip Pan Right melewati konter",
    lead: "truckRight",
    tail: "truckRight",
    move: 0.7,
    hold: 0,
    kf: "Nadia bertopang dagu di depan laptop di tengah, Fajar menggaruk kepala di samping baki file oranye di kanan, rak buku di antara mereka, ujung kanan konter di kiri.",
  },
  {
    n: "3",
    k: "K3",
    id: "layanan",
    name: "Layanan",
    cam: "Arc ±120° → Over-the-Shoulder",
    lead: "arc",
    tail: "arc",
    move: 0.8,
    hold: 1.2,
    kf: "Dari belakang bahu kanan Bu Dewi. Leaflet datar lanskap kosong berdiri di stand akrilik di konter, dua pertiga kanan, di kiri tablet POS. Heru tersenyum di seberang konter.",
    phone: "HP: Heru di sepertiga atas, leaflet di tengah, kartu layanan bertumpuk di 40% bawah.",
  },
  {
    n: "4",
    k: "K4",
    id: "use-case",
    name: "Use case",
    cam: "Dolly In",
    lead: "dollyIn",
    tail: "dollyIn",
    move: 0.5,
    hold: 1.5,
    kf: "Bahu dan hijab Bu Dewi di tepi kiri. Binder bertab kuning, cyan, pink, lila terbuka tegak dan frontal di tengah-kanan, dipegang Heru, halaman krem kosong.",
    phone: "HP: Heru di sepertiga atas, binder di tengah, tab dan contoh sebagai kartu di 40% bawah.",
  },
  {
    n: "5a",
    k: "K5a",
    name: "Customer journey, keluar",
    cam: "Follow lewat pintu (Through Object Out) → Truck Right",
    lead: "throughOut",
    tail: "throughOut",
    move: 0.9,
    hold: 0,
    kf: "Trotoar depan COMPANY, pagi menjelang siang. Bu Dewi dan Heru baru keluar dan berjalan ke kanan. Fasad COMPANY di kiri, ruko buah dengan panel putih lantai 2 di kanan.",
  },
  {
    n: "5b",
    k: "K5",
    id: "cara-kerja",
    name: "Customer journey",
    cam: "Truck Right menyusuri trotoar",
    lead: "track",
    tail: "track",
    move: 3.0,
    hold: 0.8,
    kf: "Bu Dewi dan Heru berhenti di depan pintu kaca Kreatekno di kanan. Panel putih ruko elektronik di kiri atas membawa CTA dan panah ke pintu.",
    desk: "Desktop: panel putih lantai 2 delapan ruko lewat berjajar; copy di panel buah (judul), laundry, sepatu, warteg, kosmetik (langkah 1–4) dan elektronik (CTA). Warnet dan warung kosong.",
    phone: "HP: satu panel per layar. Kamera truck right dan melambat di tiap panel yang membawa copy.",
  },
  {
    n: "6",
    k: "K6",
    id: "testimoni",
    name: "Testimoni",
    cam: "Through Object In (pintu kaca kantor)",
    lead: "throughIn",
    tail: "throughIn",
    move: 0.8,
    hold: 1.2,
    kf: "Lobi kantor terang. Dinding gabus besar frontal: strip kertas kosong di atas, tiga polaroid kosong. Bu Dewi tersenyum di kanan.",
    phone: "HP: dinding gabus di tengah, kartu testimoni digeser satu per layar di 40% bawah.",
  },
  {
    n: "7",
    k: "K7",
    id: "artikel",
    name: "Artikel",
    cam: "Truck Left",
    lead: "truckLeft",
    tail: "truckLeft",
    move: 0.6,
    hold: 1.1,
    kf: "Pojok tunggu. Rak kayu frontal, tiga majalah bersampul kosong (ungu, navy, teal), papan kayu kecil kosong di atas rak.",
    phone: "HP: rak di tengah, kartu artikel bertumpuk di 40% bawah.",
  },
  {
    n: "8",
    k: "K8",
    id: "faq",
    name: "FAQ",
    cam: "Truck Left + Pan Left",
    lead: "truckLeft",
    tail: "truckLeft",
    move: 0.6,
    hold: 1.7,
    kf: "Dinding kaca ruang rapat frontal. Judul di sepertiga kiri, delapan sticky note di dua pertiga kanan. Wildan dan Andi bekerja di baliknya, cahaya sore dari jendela ruang rapat.",
    phone: "HP: judul di atas, note menjadi akordeon kartu di 45% bawah.",
  },
  {
    n: "9a",
    k: "K9a",
    name: "Tentang kami, menuju pintu",
    cam: "Arc 180° → maju ke pintu",
    lead: "arc",
    tail: "arc",
    move: 0.9,
    hold: 0,
    kf: "Dari dalam lobi, pintu kaca kantor di tengah. Bu Dewi dan Heru berjalan ke pintu; di luar cahaya golden hour.",
  },
  {
    n: "9b",
    k: "K9",
    id: "tentang",
    name: "Tentang kami",
    cam: "Through Object Out (pintu kantor) → Arc",
    lead: "throughOut",
    tail: "arc",
    move: 0.9,
    hold: 1.2,
    kf: "Luar kantor, golden hour. Plakat kayu krem frontal di setengah kiri, lampu dinding kuningan menyala. Bu Dewi dan Heru di kanan.",
    phone: "HP: kartu Tentang kami di 45% bawah (trotoar).",
  },
  {
    n: "10",
    k: "K10",
    name: "Langit, naik",
    cam: "Crane Up + Hyperlapse, ke kiri",
    lead: "craneUp",
    tail: "craneUp",
    move: 1.0,
    hold: 0,
    kf: "Deret ruko dari ketinggian, langit jingga sore. COMPANY dan billboard kosong di atapnya di kiri.",
  },
  {
    n: "11",
    k: "K11",
    name: "Langit, turun",
    cam: "Crane Down ke kiri → maju ke pintu",
    lead: "craneDown",
    tail: "craneDown",
    move: 0.9,
    hold: 0,
    kf: "Setinggi mata di depan pintu kaca COMPANY yang terbuka, langit jingga menjelang senja.",
  },
  {
    n: "12",
    k: "K12",
    name: "Pelatihan",
    cam: "Through Object In (pintu kaca, lalu pintu kayu)",
    lead: "throughIn",
    tail: "throughIn",
    move: 1.1,
    hold: 0,
    kf: "Ruang kelas di balik pintu kayu. Wildan di kiri layar TV, empat staf di meja kecil mencatat dan tertawa.",
  },
  {
    n: "13",
    k: "K13",
    id: "praktik",
    name: "Praktik naik kelas",
    cam: "Dolly Out keluar kelas → menyusuri meja + time-lapse",
    lead: "dollyOut",
    tail: "dollyOut",
    move: 1.1,
    hold: 0.7,
    kf: "Ruang depan saat senja, lampu menyala, komposisi K2 tapi rapi. Orb cyan di tengah atas, staf praktik, Bu Dewi dan Heru di balik konter. Papan kapur kecil kosong di ujung kiri konter.",
    phone: "HP: orb di atas, kartu kecil di 35% bawah.",
  },
  {
    n: "14",
    k: "K14",
    id: "kontak",
    name: "CTA",
    cam: "Dolly In → POV",
    lead: "dollyIn",
    tail: "dollyIn",
    move: 0.7,
    hold: 1.3,
    kf: "Berdiri tepat di depan konter kasir. Bu Dewi dan Heru tersenyum di setengah atas; map ungu terbuka berdiri di stand dokumen, frontal, tengah bawah.",
    phone: "HP: dua wajah di sepertiga atas, map di tengah, kartu CTA di 40% bawah.",
  },
  {
    n: "15",
    k: "K15",
    name: "Footer, keluar",
    cam: "Dolly Out → Through Object Out (jendela) + Hyperlapse",
    lead: "throughOut",
    tail: "throughOut",
    move: 0.9,
    hold: 0,
    kf: "Luar toko, malam. Jendela menyala hangat, kursi kosong, cahaya cyan kecil berkedip di dalam.",
  },
  {
    n: "16",
    k: "K16",
    id: "footer",
    name: "Footer",
    cam: "Crane Up sambil mundur",
    lead: "craneUp",
    tail: "craneUp",
    move: 0.9,
    hold: 0.5,
    kf: "Langit malam berbintang. COMPANY dan billboard bersorot lampu di sepertiga atas, jalan gelap di bawah untuk footer.",
    phone: "HP: footer bertumpuk di pita jalan gelap.",
  },
];

/** Number of beats in the team's document (beat 1 takes two steps here, beat 2 three, 5 and 9 are split in a and b). */
export const BEAT_COUNT = 18;

export type TimedBeat = Beat & { from: string; t0: number; t1: number; t2: number };

/** Steps with the keyframe they start from, their start (t0), end of camera move (t1) and end of hold (t2). */
export const TIMED: TimedBeat[] = (() => {
  let t = 0;
  return BEATS.map((b, i) => {
    const t0 = t;
    const t1 = t0 + b.move;
    const t2 = t1 + b.hold;
    t = t2;
    return { ...b, from: i ? BEATS[i - 1].k : b.k, t0, t1, t2 };
  });
})();

/** Length of the take, in screens. The reel is one screen longer so the last hold can be read. */
export const TOTAL = TIMED[TIMED.length - 1].t2;

/** Share of the camera move that carries props in / out. */
export const ENTER = 0.6;
export const EXIT = 0.55;

/*
 * Light per keyframe: sky and ground of the placeholder scene, horizon line (% of the frame height) and
 * the soft-light layer on every prop (`sun` is the angle of that layer; 250deg = light from the right).
 * Retune each keyframe once its footage exists.
 */
type Light = { sa: string; sb: string; ga: string; gb: string; hz: number; hi: string; lo: string; sun: number };

const LOBBY: Light = {
  sa: "#EEE8FB",
  sb: "#FBF9FF",
  ga: "#D9D3E6",
  gb: "#BDB5CE",
  hz: 88,
  hi: "rgba(255,255,255,.5)",
  lo: "rgba(60,50,110,.25)",
  sun: 160,
};
const DUSK_INSIDE: Light = {
  sa: "#5C5A8E",
  sb: "#E6C9A8",
  ga: "#8C5E3C",
  gb: "#5E3B22",
  hz: 62,
  hi: "rgba(255,200,140,.6)",
  lo: "rgba(25,25,80,.4)",
  sun: 190,
};

// inside the shop, sampled from the beat 2 footage (28 Oct): pinkish lavender walls and terrazzo floor,
// warm morning sun through the window on the left
const K2_SHOP: Light = {
  sa: "#D9C3CC",
  sb: "#EEDFE5",
  ga: "#E1C3C6",
  gb: "#D4BBC6",
  hz: 60,
  hi: "rgba(255,226,186,.55)",
  lo: "rgba(50,35,40,.3)",
  sun: 110,
};

export const KEYFRAMES: Record<string, Light> = {
  // K0 and K1 are sampled from the beat 1 footage (27 Oct): low warm sun from the left.
  // morning sky over the lavender roof parapet of COMPANY
  K0: {
    sa: "#69ABFD",
    sb: "#FFE5D7",
    ga: "#F6E9FC",
    gb: "#D9CBE6",
    hz: 96,
    hi: "rgba(255,226,190,.6)",
    lo: "rgba(40,50,90,.3)",
    sun: 110,
  },
  // the facade around the door, pavement and the dark road at the bottom edge
  K1: {
    sa: "#F2D2E3",
    sb: "#FED4B9",
    ga: "#E3AEAF",
    gb: "#3B426D",
    hz: 90,
    hi: "rgba(255,222,180,.6)",
    lo: "rgba(40,40,80,.3)",
    sun: 110,
  },
  K2: K2_SHOP,
  // closer to the staff desks: the same room and light, the floor line drops as the camera moves in
  "K2.1": { ...K2_SHOP, hz: 66 },
  "K2.2": { ...K2_SHOP, hz: 66 },
  // till counter, over Bu Dewi's shoulder
  K3: {
    sa: "#F1E6D6",
    sb: "#F8F1E6",
    ga: "#C2703A",
    gb: "#8E4B22",
    hz: 58,
    hi: "rgba(255,232,200,.5)",
    lo: "rgba(40,30,30,.32)",
    sun: 200,
  },
  K4: {
    sa: "#F1E6D6",
    sb: "#F8F1E6",
    ga: "#C2703A",
    gb: "#8E4B22",
    hz: 62,
    hi: "rgba(255,232,200,.5)",
    lo: "rgba(40,30,30,.32)",
    sun: 200,
  },
  // pavement outside COMPANY, late morning
  K5a: {
    sa: "#9CCDF4",
    sb: "#E2F1FB",
    ga: "#C2BBB1",
    gb: "#958F86",
    hz: 76,
    hi: "rgba(255,246,225,.6)",
    lo: "rgba(20,40,80,.3)",
    sun: 240,
  },
  // the street of shophouses, near midday
  K5: {
    sa: "#8EC7F4",
    sb: "#DCEEFB",
    ga: "#BDB7AE",
    gb: "#8F8A82",
    hz: 76,
    hi: "rgba(255,250,235,.6)",
    lo: "rgba(20,40,80,.32)",
    sun: 220,
  },
  K6: LOBBY,
  K7: { ...LOBBY, sa: "#E9E2F6", sb: "#F7F3FC", ga: "#D5CDE2", gb: "#B9B0CA", hz: 90 },
  // the lobby light stays; only the meeting-room window behind the glass is golden
  K8: { ...LOBBY, sa: "#E9E0F0", sb: "#FBF1E2", ga: "#D5CDE2", gb: "#B9B0CA", hz: 92 },
  K9a: { ...LOBBY, sa: "#EDE2EE", sb: "#FBE9D2", hz: 88 },
  // outside the office at golden hour
  K9: {
    sa: "#F2B967",
    sb: "#FBDDB0",
    ga: "#B98E6A",
    gb: "#8A6446",
    hz: 84,
    hi: "rgba(255,200,120,.65)",
    lo: "rgba(80,30,40,.35)",
    sun: 250,
  },
  // rooftops, orange sky
  K10: {
    sa: "#EC8E50",
    sb: "#F6BE87",
    ga: "#8E6A63",
    gb: "#5E4549",
    hz: 76,
    hi: "rgba(255,180,110,.6)",
    lo: "rgba(70,25,40,.4)",
    sun: 250,
  },
  // the open glass door of COMPANY, nearly dusk
  K11: {
    sa: "#E9965E",
    sb: "#F5C897",
    ga: "#A88470",
    gb: "#7A5C4E",
    hz: 70,
    hi: "rgba(255,190,125,.6)",
    lo: "rgba(70,30,40,.38)",
    sun: 240,
  },
  // classroom, warm orange from the left window and hanging lamps
  K12: {
    sa: "#F0CFA6",
    sb: "#F8E7CF",
    ga: "#A88466",
    gb: "#7A5C45",
    hz: 78,
    hi: "rgba(255,200,140,.58)",
    lo: "rgba(70,35,30,.32)",
    sun: 100,
  },
  // front room at dusk, lamps on, deep blue from the door and window behind the camera
  K13: DUSK_INSIDE,
  K14: { ...DUSK_INSIDE, hz: 60 },
  // night outside the shop window
  K15: {
    sa: "#262B63",
    sb: "#13173E",
    ga: "#1A1C33",
    gb: "#0E0F1F",
    hz: 70,
    hi: "rgba(255,190,120,.35)",
    lo: "rgba(5,8,30,.5)",
    sun: 200,
  },
  // night sky
  K16: {
    sa: "#0B0F3A",
    sb: "#141A52",
    ga: "#10122A",
    gb: "#07081A",
    hz: 66,
    hi: "rgba(120,140,255,.25)",
    lo: "rgba(0,0,10,.5)",
    sun: 180,
  },
};

export function lightVars(key: string) {
  const k = KEYFRAMES[key];
  return {
    "--sky-a": k.sa,
    "--sky-b": k.sb,
    "--gr-a": k.ga,
    "--gr-b": k.gb,
    "--hz": `${k.hz}%`,
    "--lt-hi": k.hi,
    "--lt-lo": k.lo,
    "--sun": `${k.sun}deg`,
  };
}

/** How each prop sits in its held keyframe (the plaque turns a little towards the door...). */
export const REST: Record<string, { rx?: number; ry?: number; rz?: number; ox?: string; oy?: string }> = {
  billboard: {},
  "hero-card": {},
  leaflet: {},
  binder: {},
  shops: {},
  strip: { rz: -1.2 },
  polas: {},
  woodboard: {},
  mags: { rx: -2 },
  more: {},
  "glass-title": {},
  "notes-wrap": {},
  plaque: { ry: -7 },
  easel: { rx: 4, oy: "100%" },
  folder: {},
  road: {},
};

/**
 * The query that turns the film on; story.css uses the same one. Without it (reduced motion, no JS, or a
 * browser that doesn't know `scripting`) the beats stack as plain sections.
 */
export const FILM_QUERY = "(scripting: enabled) and (prefers-reduced-motion: no-preference)";
