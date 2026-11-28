import type { CarouselCerita, CarouselCeritaLocale, CarouselPanggung } from "./schema";

const sceneIds = [
  "sebelum",
  "isi-topik",
  "susun-kerangka",
  "pakai-bingkai",
  "buat-lima-slide",
  "tulis-caption",
  "kirim-draf",
  "ringkasan",
  "konsultasi",
];
const sample = { number: "CR-028", brand: "Kopi Contoh", owner: "Mira" };
const slideKinds = ["cover", "tubruk", "press", "pour", "save"] as const;

function slides(rows: [string, string][]): CarouselPanggung["slides"] {
  return rows.map(([title, body], index) => ({ kind: slideKinds[index], title, body }));
}

function scenes(rows: [string, string, string][], step: string): CarouselCeritaLocale["scenes"] {
  return rows.map(([rail, title, body], index) => ({
    id: sceneIds[index],
    rail,
    title,
    body,
    eyebrow: index >= 1 && index <= 6 ? `${step} ${index} · ${rail}` : rail,
    ...(index === 8 && { cta: true }),
  }));
}

const id: CarouselPanggung = {
  ...sample,
  brief: "Kenalkan tiga cara seduh dengan alat yang berbeda.",
  slides: slides([
    ["3 cara seduh kopi di rumah", "Kenali alat dan cara seduhnya."],
    ["Kopi tubruk", "Seduh langsung di gelas."],
    ["French press", "Seduh lalu tekan plunger."],
    ["Pour-over", "Tuang lewat saringan kertas."],
    ["Simpan untuk seduhan berikutnya", "Pilih cara seduhmu."],
  ]),
  caption: "Tubruk, french press, atau pour-over? Simpan panduan ini, lalu pilih cara seduhmu.",
  hashtags: ["#KopiRumah", "#SeduhKopi"],
  labels: {
    before: "Bahan carousel",
    notes: "Catatan isi",
    design: "Contoh desain",
    table: "Tabel konten",
    education: "Edukasi",
    slideCount: "5 slide",
    outline: "Kerangka carousel",
    frame: "Bingkai brand",
    footer: "Panduan seduh",
    slides: "Pratinjau slide",
    caption: "Draf caption",
    folder: "Folder draf",
    group: "Grup marketing",
    preview: "Pratinjau dikirim",
    review: "Menunggu dicek",
    sample: "Contoh alur",
  },
};

const en: CarouselPanggung = {
  ...sample,
  brief: "Introduce three ways to brew coffee with different equipment.",
  slides: slides([
    ["3 ways to brew coffee at home", "Meet three ways to brew."],
    ["Kopi tubruk", "Brew straight in the cup."],
    ["French press", "Steep, then press the plunger."],
    ["Pour-over", "Pour through a paper filter."],
    ["Save this for your next brew", "Pick a method to try."],
  ]),
  caption: "Tubruk, French press or pour-over? Save this guide and pick a method for your next brew.",
  hashtags: ["#CoffeeAtHome", "#BrewCoffee"],
  labels: {
    before: "Carousel materials",
    notes: "Content notes",
    design: "Design reference",
    table: "Content table",
    education: "Education",
    slideCount: "5 slides",
    outline: "Carousel outline",
    frame: "Brand frame",
    footer: "Brew guide",
    slides: "Slide preview",
    caption: "Caption draft",
    folder: "Drive · Draft folder",
    group: "Telegram · Marketing group",
    preview: "Preview sent",
    review: "Awaiting review",
    sample: "Example workflow",
  },
};

export const carouselKontenStory: CarouselCerita = {
  slug: "carousel-konten",
  id: {
    intro: "Ikuti satu topik dari tabel konten sampai staf Kopi Contoh menerima draf carousel lengkap.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Mira menyiapkan satu carousel dari tiga bahan.",
          "Catatan isi, contoh desain, dan draf caption masih terpisah.",
        ],
        [
          "Isi topik",
          "Mira mengisi satu baris di tabel konten.",
          "Baris CR-028 berisi topik 3 cara seduh kopi di rumah, brief singkat, jenis Edukasi, dan jumlah lima slide.",
        ],
        [
          "Susun kerangka",
          "Topik kopi menjadi kerangka lima slide.",
          "Satu pembuka, tiga cara seduh, dan satu ajakan untuk menyimpan panduan.",
        ],
        [
          "Pakai bingkai brand",
          "Kopi Contoh memakai satu bingkai brand.",
          "Logo, warna krem dan cokelat, serta footer Panduan seduh tetap di tempat yang sama.",
        ],
        [
          "Buat lima slide",
          "Satu bingkai menyatukan kelima slide.",
          "Kopi tubruk diseduh di gelas, french press memakai plunger, dan pour-over memakai saringan kertas. Slide terakhir mengajak pembaca menyimpan panduan.",
        ],
        [
          "Tulis caption",
          "Draf caption mengajak pembaca memilih cara seduh.",
          `${id.caption} ${id.hashtags.join(" ")}`,
        ],
        [
          "Kirim draf",
          "Draf sampai ke staf dan menunggu dicek.",
          "Lima slide dan caption tersimpan di folder CR-028. Pratinjau dikirim ke grup marketing, lalu baris ditandai Menunggu dicek.",
        ],
        [
          "Ringkasan",
          "Satu baris jadi paket draf yang siap dicek.",
          "Staf mendapat slide dengan bingkai yang sama dan caption dalam satu folder.",
        ],
        [
          "Konsultasi",
          "Mau menyiapkan carousel dari satu topik?",
          "Bawa satu topik, logo, dan contoh konten brand yang kamu sukai.",
        ],
      ],
      "Langkah",
    ),
    stage: id,
  },
  en: {
    intro: "Follow one topic from the content table until the Kopi Contoh team receives a complete carousel draft.",
    scenes: scenes(
      [
        [
          "Before",
          "Mira gathers three things for one carousel.",
          "The content notes, design reference and caption draft are in separate places.",
        ],
        [
          "Enter a topic",
          "Mira fills in one row in the content table.",
          "Row CR-028 has the topic 3 ways to brew coffee at home, a short brief, the Education type and a count of five slides.",
        ],
        [
          "Outline slides",
          "The coffee topic becomes a five-slide outline.",
          "There is one opening, three brewing methods and a final invitation to save the guide.",
        ],
        [
          "Use the brand frame",
          "Kopi Contoh uses one brand frame.",
          "The logo, cream and coffee colours, and Brew guide footer stay in the same place.",
        ],
        [
          "Make five slides",
          "One frame ties the five slides together.",
          "Tubruk brews in the cup, French press uses a plunger, and pour-over uses a paper filter. The final slide asks readers to save the guide.",
        ],
        [
          "Write the caption",
          "The caption invites readers to choose a brewing method.",
          `${en.caption} ${en.hashtags.join(" ")}`,
        ],
        [
          "Send the draft",
          "The team receives the draft for review.",
          "The five slides and caption are in folder CR-028. The marketing group gets a preview and the row is marked Awaiting review.",
        ],
        [
          "Recap",
          "One row becomes a draft package the team can check.",
          "The team gets slides with a consistent frame and the caption in one folder.",
        ],
        [
          "Consultation",
          "Want to turn one topic into a carousel?",
          "Bring a topic, your logo and a sample of your brand's content.",
        ],
      ],
      "Step",
    ),
    stage: en,
  },
};
