// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const berkasDokumen: Solusi = {
  slug: "berkas-dokumen",
  status: "jalan",
  updated: "2026-10-26",
  industri: ["perjalanan", "jasa"],
  tim: ["operasional", "keuangan"],
  apps: ["whatsapp", "drive", "sheets"],
  metricsKind: "example",
  id: {
    title: "Berkas dokumen pelanggan dirapikan otomatis",
    question: "Bagaimana mengumpulkan dokumen pelanggan dari chat tanpa berantakan?",
    result: "Berkas lengkap dan rapi per pelanggan",
    summary:
      "Pelanggan cukup mengirim foto dokumen lewat WhatsApp. Berkas dirapikan, disimpan per pelanggan, dan kelengkapannya tercatat.",
    answer:
      "Pelanggan cukup mengirim foto dokumennya lewat WhatsApp. Foto dirapikan ke ukuran yang dibutuhkan, disimpan ke folder Google Drive per pelanggan, dan kelengkapannya tercatat di Google Sheets. Tim tinggal memeriksa dan memproses berkas yang sudah lengkap.",
    client: "Agen perjalanan, Sumatra",
    pains: [
      "Foto dokumen dikirim miring, buram, atau terpotong.",
      "Tim merapikan dan memberi nama file satu per satu.",
      "Sulit melihat pelanggan mana yang berkasnya belum lengkap.",
    ],
    steps: [
      {
        title: "Pelanggan mengirim foto dokumen",
        body: "Lewat chat WhatsApp, tanpa aplikasi tambahan.",
      },
      {
        title: "Foto dirapikan",
        body: "Dokumen disimpan dengan ukuran dan nama file yang seragam.",
      },
      {
        title: "Berkas tersimpan per pelanggan",
        body: "Setiap pelanggan punya foldernya sendiri di Google Drive.",
      },
      {
        title: "Tim melihat kelengkapan",
        body: "Tabel menunjukkan berkas yang sudah lengkap dan yang masih kurang.",
      },
    ],
    compare: [
      {
        aspect: "Merapikan foto",
        before: "Satu per satu di komputer",
        after: "Sudah rapi saat tersimpan",
      },
      {
        aspect: "Mencari berkas",
        before: "Menggulir chat lama",
        after: "Satu folder per pelanggan",
      },
      {
        aspect: "Cek kelengkapan",
        before: "Dihitung manual",
        after: "Terlihat di tabel",
      },
    ],
    fit: [
      "Usaha yang mengumpulkan dokumen dari banyak pelanggan sekaligus.",
      "Tim kecil yang memproses berkas untuk pengajuan ke pihak lain.",
    ],
    notFit: ["Dokumen yang wajib diserahkan dalam bentuk fisik asli."],
    prep: ["Daftar dokumen yang dibutuhkan per layanan", "Aturan ukuran dan format file", "Akun Google Drive usaha"],
    metrics: [
      {
        value: "60",
        unit: "%",
        label: "waktu merapikan berkas berkurang",
      },
      {
        value: "1",
        unit: "folder",
        label: "per pelanggan, nama file seragam",
      },
      {
        value: "0",
        unit: "berkas",
        label: "yang terselip di chat lama",
      },
    ],
    faq: [
      {
        q: "Apakah dokumen pelanggan aman?",
        a: "Dokumen disimpan di Google Drive milik usaha Anda dengan akses yang Anda atur sendiri.",
      },
      {
        q: "Bagaimana kalau fotonya buram?",
        a: "Pelanggan diminta mengirim ulang sebelum berkas dianggap lengkap.",
      },
    ],
  },
};
