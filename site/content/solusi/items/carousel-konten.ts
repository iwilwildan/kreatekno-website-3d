// S8 N1b (24 Nov 2026): rewritten from the carousel workflows on the n8n-kreatekno and n8n-mcp instances (read only,
// inactive): a content row in a table (title, content, type news/education/marketing, slide count) is picked up on
// a schedule, a folder is made for the run, AI writes one image prompt per slide (hook, points, closing call to
// action) on a fixed brand frame with logo and colours, a caption is written, each slide image is generated with the
// frame as reference (a rejected prompt is rewritten and retried), the images go to the folder and the team chat,
// and the row is marked for review. Supplemented by the public n8n.io template 4028 (slides follow the previous
// slide's style). Nothing is posted automatically. Status "ide": the client (set A), quote and metrics are samples.
import type { Solusi } from "../schema";

export const carouselKonten: Solusi = {
  slug: "carousel-konten",
  status: "ide",
  updated: "2026-11-24",
  industri: ["retail", "klinik"],
  tim: ["marketing"],
  apps: ["instagram", "sheets", "drive", "telegram"],
  metricsKind: "example",
  id: {
    title: "Carousel konten dari satu topik",
    question: "Bagaimana membuat carousel media sosial lebih cepat tanpa desainer?",
    result: "Draf carousel lengkap dengan caption, siap dicek",
    summary:
      "Anda menulis satu topik di tabel. Slide dan caption dibuat dengan bingkai brand Anda, lalu dikirim untuk dicek.",
    answer:
      "Anda menulis judul, isi singkat, dan jenis konten di satu tabel: berita, edukasi, atau promosi. AI menyusun isi setiap slide, dari pembuka yang menarik sampai ajakan di slide terakhir, lalu membuat gambarnya di atas bingkai brand yang sama, lengkap dengan logo dan warna Anda. Caption ikut ditulis. Hasilnya disimpan di satu folder, dikirim ke grup tim, dan menunggu dicek sebelum diposting.",
    client: "Brand kopi kemasan (contoh)",
    painsLead:
      "Brand kopi kemasan butuh konten edukasi dan promosi beberapa kali seminggu. Satu carousel melewati banyak tangan: menulis isi, mendesain setiap slide, menyamakan logo dan warna, lalu menulis caption. Akibatnya posting tidak rutin dan tampilan antar slide sering berbeda.",
    pains: [
      "Satu carousel bisa makan waktu setengah hari.",
      "Posting jadi tidak rutin karena prosesnya panjang.",
      "Logo dan warna antar slide sering tidak seragam.",
    ],
    built: {
      h: "Dari satu baris di tabel sampai draf carousel yang siap dicek",
      lead: "Tim cukup mengisi topik di tabel. Isi slide, gambar, dan caption disiapkan dengan gaya brand yang sama, lalu dikumpulkan untuk dicek.",
      points: [
        "Mengambil topik baru dari tabel konten secara terjadwal.",
        "Menyesuaikan isi dengan jenis konten: berita, edukasi, atau promosi.",
        "Menulis isi setiap slide: pembuka di slide pertama, poin di tengah, ajakan di slide terakhir.",
        "Membuat gambar setiap slide di atas bingkai brand yang sama, dengan logo dan warna Anda.",
        "Menulis caption pendek beserta tagar yang relevan.",
        "Menyimpan hasil ke satu folder, mengirimnya ke grup tim, dan menandai statusnya siap dicek.",
      ],
    },
    quote: {
      text: "Sekarang kami cukup menulis topik di tabel. Besoknya draf slide dan caption sudah ada di folder, tinggal dicek sebelum diposting.",
      by: "Tim marketing brand kopi",
    },
    steps: [
      { title: "Anda menulis topik", body: "Judul, isi singkat, dan jenis konten di satu tabel." },
      { title: "Isi slide ditulis", body: "Pembuka, poin utama, dan ajakan di slide terakhir." },
      { title: "Slide dibuat dengan bingkai brand", body: "Logo, warna, dan tata letak sama di setiap slide." },
      { title: "Anda mengecek", body: "Draf dan caption menunggu dicek sebelum diposting." },
    ],
    compare: [
      { aspect: "Membuat carousel", before: "Setengah hari", after: "Draf siap dari satu baris tabel" },
      { aspect: "Konsistensi desain", before: "Tergantung siapa yang membuat", after: "Bingkai brand yang sama" },
      { aspect: "Caption", before: "Ditulis terpisah", after: "Ikut disiapkan" },
    ],
    fit: ["Usaha yang rutin membuat konten edukasi atau promosi.", "Brand yang sudah punya logo dan warna tetap."],
    notFit: ["Konten yang selalu membutuhkan foto produk baru."],
    prep: [
      "Logo dan warna brand",
      "Contoh konten yang pernah disukai audiens",
      "Daftar topik untuk beberapa minggu ke depan",
    ],
    metrics: [
      { value: "1", unit: "baris", label: "di tabel konten untuk satu carousel" },
      { value: "3", unit: "jenis", label: "konten: berita, edukasi, dan promosi" },
      { value: "1", unit: "bingkai", label: "brand yang sama di setiap slide" },
    ],
    faq: [
      {
        q: "Apakah langsung terposting?",
        a: "Tidak. Setiap carousel menunggu dicek dan disetujui tim sebelum diposting.",
      },
      {
        q: "Bagaimana kalau ada slide yang gagal dibuat?",
        a: "Perintah gambarnya diperbaiki dan slide itu dibuat ulang, tanpa mengubah isi dan maksudnya.",
      },
      {
        q: "Apakah gambar produk asli bisa dipakai?",
        a: "Bisa. Foto produk atau gambar acuan tambahan bisa dicantumkan di baris tabel supaya ikut dipakai di slide.",
      },
    ],
  },
  en: {
    title: "A content carousel from one topic",
    question: "How can a business make social media carousels faster without a designer?",
    result: "A carousel draft with its caption, ready to check",
    summary: "Write one topic in a table, and slides with a caption are made on your brand frame for checking.",
    answer:
      "You write a title, a short brief and the content type in one table: news, education or promotion. AI writes each slide, from a strong opening to a call to action on the last slide, then creates the images on the same brand frame with your logo and colours. A caption is written too. The result is saved in one folder, sent to the team chat and waits for a check before posting.",
    client: "Packaged coffee brand (sample)",
    painsLead:
      "A packaged coffee brand needs education and promotion content several times a week. One carousel passes through many hands: writing the content, designing each slide, matching the logo and colours, then writing the caption. As a result posting is irregular and slides often look different from each other.",
    pains: [
      "One carousel can take half a day.",
      "Posting becomes irregular because the process is long.",
      "Logos and colours often differ between slides.",
    ],
    built: {
      h: "From one row in a table to a carousel draft ready to check",
      lead: "The team only fills in a topic in the table. Slide content, images and the caption are prepared in the same brand style, then collected for checking.",
      points: [
        "Picks up new topics from the content table on a schedule.",
        "Adapts the content to its type: news, education or promotion.",
        "Writes each slide: an opening first, the points in the middle, a call to action last.",
        "Creates every slide image on the same brand frame, with your logo and colours.",
        "Writes a short caption with relevant hashtags.",
        "Saves the result in one folder, sends it to the team chat and marks it ready to check.",
      ],
    },
    quote: {
      text: "Now we just write a topic in the table. The next day the slide drafts and caption are in the folder, ready to check before posting.",
      by: "Marketing team at a coffee brand",
    },
    steps: [
      { title: "You write a topic", body: "A title, a short brief and the content type in one table." },
      { title: "Slides written", body: "An opening, the main points and a call to action on the last slide." },
      { title: "Slides made on the brand frame", body: "The same logo, colours and layout on every slide." },
      { title: "You check", body: "The draft and caption wait for a check before posting." },
    ],
    compare: [
      { aspect: "Making a carousel", before: "Half a day", after: "A draft from one table row" },
      { aspect: "Design consistency", before: "Depends on who makes it", after: "The same brand frame" },
      { aspect: "Caption", before: "Written separately", after: "Prepared with the slides" },
    ],
    fit: [
      "Businesses that regularly post education or promotion content.",
      "Brands that already have a fixed logo and colours.",
    ],
    notFit: ["Content that always needs new product photos."],
    prep: [
      "Your brand logo and colours",
      "Examples of content your audience liked",
      "A list of topics for the next few weeks",
    ],
    metrics: [
      { value: "1", unit: "row", label: "in the content table for one carousel" },
      { value: "3", unit: "types", label: "of content: news, education and promotion" },
      { value: "1", unit: "frame", label: "of the same brand on every slide" },
    ],
    faq: [
      {
        q: "Is it posted straight away?",
        a: "No. Every carousel waits for the team to check and approve it before posting.",
      },
      {
        q: "What if a slide fails to generate?",
        a: "Its image instruction is revised and the slide is made again, without changing its content or intent.",
      },
      {
        q: "Can real product photos be used?",
        a: "Yes. A product photo or extra reference image can be added to the table row so it is used in the slides.",
      },
    ],
  },
};
