// Source: Solusi v1 COPY 16. English draft added with the bilingual HTML stage S2.
import type { Kartu } from "./schema";

export const KARTU: Kartu[] = [
  {
    id: "k1",
    text: {
      id: "Order dari grup chat sering terlewat?",
      en: "Do orders in group chats often get missed?",
    },
    industri: ["logistik", "retail"],
    tim: ["operasional", "penjualan"],
    solusi: {
      "order-grup": 3,
    },
  },
  {
    id: "k2",
    text: {
      id: "Admin mengetik ulang pesanan ke Excel setiap hari?",
      en: "Does your admin retype orders into a spreadsheet every day?",
    },
    industri: ["logistik", "retail", "jasa"],
    tim: ["operasional", "keuangan"],
    solusi: {
      "order-grup": 3,
      "rekap-penjualan": 1,
    },
  },
  {
    id: "k3",
    text: {
      id: "Angka penjualan baru Anda ketahui keesokan harinya?",
      en: "Do you only learn yesterday's sales numbers the next day?",
    },
    industri: ["retail", "logistik"],
    tim: ["manajemen"],
    solusi: {
      "rekap-penjualan": 3,
      "order-grup": 1,
    },
  },
  {
    id: "k4",
    text: {
      id: "Pelanggan menunggu lama hanya untuk tahu jadwal yang kosong?",
      en: "Do customers wait too long just to learn which slots are open?",
    },
    industri: ["jasa", "klinik"],
    tim: ["cs"],
    solusi: {
      "booking-jasa": 3,
      "cs-klinik": 2,
    },
  },
  {
    id: "k5",
    text: {
      id: "Chat pelanggan menumpuk di luar jam kerja?",
      en: "Do customer chats pile up outside business hours?",
    },
    industri: ["klinik", "jasa", "retail", "properti"],
    tim: ["cs"],
    solusi: {
      "cs-klinik": 3,
      "booking-jasa": 2,
    },
  },
  {
    id: "k6",
    text: {
      id: "Pertanyaan harga dan jam buka dijawab berulang kali?",
      en: "Do you answer the same questions about prices and opening hours?",
    },
    industri: ["klinik", "retail", "jasa"],
    tim: ["cs"],
    solusi: {
      "cs-klinik": 3,
      "booking-jasa": 1,
    },
  },
  {
    id: "k7",
    text: {
      id: "Jadwal tim lapangan sering bentrok?",
      en: "Do your field team's schedules often clash?",
    },
    industri: ["jasa"],
    tim: ["operasional"],
    solusi: {
      "booking-jasa": 3,
    },
  },
  {
    id: "k8",
    text: {
      id: "Dokumen pelanggan dikirim berantakan lewat chat?",
      en: "Do customer documents arrive in a jumble through chat?",
    },
    industri: ["perjalanan", "jasa", "properti"],
    tim: ["operasional", "keuangan"],
    solusi: {
      "berkas-dokumen": 3,
    },
  },
  {
    id: "k9",
    text: {
      id: "Foto dokumen harus dirapikan satu per satu?",
      en: "Do document photos need to be sorted one by one?",
    },
    industri: ["perjalanan"],
    tim: ["operasional"],
    solusi: {
      "berkas-dokumen": 3,
    },
  },
  {
    id: "k10",
    text: {
      id: "Sulit melihat berkas pelanggan mana yang belum lengkap?",
      en: "Is it hard to see which customer files are still incomplete?",
    },
    industri: ["perjalanan", "properti", "jasa"],
    tim: ["keuangan", "operasional"],
    solusi: {
      "berkas-dokumen": 3,
    },
  },
  {
    id: "k11",
    text: {
      id: "Bingung mau posting apa minggu ini?",
      en: "Not sure what to post this week?",
    },
    industri: ["retail", "klinik", "jasa"],
    tim: ["marketing"],
    solusi: {
      "riset-konten": 3,
      "carousel-konten": 1,
    },
  },
  {
    id: "k12",
    text: {
      id: "Membuat satu carousel makan waktu berjam-jam?",
      en: "Does one carousel take hours to make?",
    },
    industri: ["retail", "klinik"],
    tim: ["marketing"],
    solusi: {
      "carousel-konten": 3,
    },
  },
  {
    id: "k13",
    text: {
      id: "Posting media sosial tidak rutin?",
      en: "Is your social-media posting inconsistent?",
    },
    industri: ["retail", "klinik", "jasa", "properti"],
    tim: ["marketing"],
    solusi: {
      "carousel-konten": 2,
      "riset-konten": 2,
    },
  },
  {
    id: "k14",
    text: {
      id: "Tagihan pelanggan sering telat dibayar?",
      en: "Are customer invoices often paid late?",
    },
    industri: ["jasa", "properti", "logistik"],
    tim: ["keuangan"],
    solusi: {
      "pengingat-tagihan": 3,
    },
  },
  {
    id: "k15",
    text: {
      id: "Mengingatkan tagihan satu per satu terasa sungkan?",
      en: "Does reminding each customer about an invoice feel awkward?",
    },
    industri: ["jasa", "properti"],
    tim: ["keuangan"],
    solusi: {
      "pengingat-tagihan": 3,
    },
  },
  {
    id: "k16",
    text: {
      id: "Calon pembeli lupa dihubungi lagi setelah survei?",
      en: "Do potential buyers get forgotten after a site visit?",
    },
    industri: ["properti"],
    tim: ["penjualan"],
    solusi: {
      "followup-prospek": 3,
    },
  },
  {
    id: "k17",
    text: {
      id: "Prospek dari iklan tidak tercatat rapi?",
      en: "Are leads from ads recorded inconsistently?",
    },
    industri: ["properti", "retail"],
    tim: ["penjualan", "marketing"],
    solusi: {
      "followup-prospek": 3,
    },
  },
  {
    id: "k18",
    text: {
      id: "Staf baru terus bertanya hal yang sama?",
      en: "Do new staff keep asking the same questions?",
    },
    industri: [],
    tim: ["sdm", "operasional"],
    solusi: {
      "asisten-sop": 3,
    },
  },
  {
    id: "k19",
    text: {
      id: "SOP ada, tapi jarang dibuka?",
      en: "Do your SOPs exist but rarely get opened?",
    },
    industri: [],
    tim: ["sdm", "manajemen"],
    solusi: {
      "asisten-sop": 3,
    },
  },
  {
    id: "k20",
    text: {
      id: "Stok habis sebelum sempat dipesan ulang?",
      en: "Does stock run out before you can reorder it?",
    },
    industri: ["retail", "logistik"],
    tim: ["operasional"],
    solusi: {
      "stok-menipis": 3,
    },
  },
  {
    id: "k21",
    text: {
      id: "Cek stok gudang masih manual?",
      en: "Do you still check warehouse stock manually?",
    },
    industri: ["retail", "logistik"],
    tim: ["operasional", "manajemen"],
    solusi: {
      "stok-menipis": 2,
      "rekap-penjualan": 1,
    },
  },
  {
    id: "k22",
    text: {
      id: "Keluhan pelanggan tercecer di banyak tempat?",
      en: "Are customer complaints scattered across different places?",
    },
    industri: ["retail", "klinik", "jasa"],
    tim: ["cs", "manajemen"],
    solusi: {
      "ulasan-pelanggan": 3,
    },
  },
  {
    id: "k23",
    text: {
      id: "Tidak tahu apa yang paling sering dikeluhkan pelanggan?",
      en: "Unsure what customers complain about most often?",
    },
    industri: ["retail", "klinik", "jasa"],
    tim: ["manajemen"],
    solusi: {
      "ulasan-pelanggan": 3,
    },
  },
  {
    id: "k24",
    text: {
      id: "Anda sendiri masih ikut membalas chat setiap hari?",
      en: "Are you still personally replying to chats every day?",
    },
    industri: [],
    tim: ["manajemen", "cs"],
    solusi: {
      "cs-klinik": 2,
      "booking-jasa": 1,
      "order-grup": 1,
    },
  },
];
