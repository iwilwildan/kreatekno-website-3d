// S8 (23 Nov 2026): drawn from the public n8n.io templates 5941 (poll new comments, a sheet that prevents double
// replies, log every reply) and 3896 (official Graph API: read, reply, message). Template 5941 only replies in the
// comment thread although its description says DM; per the user's decision this page uses a public reply plus one
// private reply, which Meta limits to one message per comment within 7 days. Status "ide": the client (set A),
// quote and metrics are samples. N1a added the full ID/EN copy and dropped the time promise from the title.
import type { Solusi } from "../schema";

export const balasKomentar: Solusi = {
  slug: "balas-komentar",
  status: "ide",
  updated: "2026-11-27",
  industri: ["retail", "jasa"],
  tim: ["marketing", "penjualan"],
  apps: ["instagram", "sheets"],
  metricsKind: "example",
  id: {
    title: 'Komentar "harga?" tidak ada yang terlewat',
    question: "Bagaimana membalas setiap komentar calon pembeli di media sosial tanpa ada yang terlewat?",
    result: "Setiap penanya di komentar langsung mendapat info",
    summary:
      "Komentar berisi kata kunci dibalas singkat, lalu penulisnya dikirimi satu pesan pribadi berisi katalog atau link.",
    answer:
      'Komentar baru di postingan dicek setiap 15 menit. Komentar yang berisi kata kunci seperti "harga", "info", atau "pricelist" dibalas singkat di kolom komentar, dan penulisnya menerima satu pesan pribadi berisi katalog dan link pemesanan. Setiap balasan dicatat supaya tidak ada komentar yang dibalas dua kali. Kalau calon pembeli membalas pesan itu, staf melanjutkan obrolannya.',
    client: "Toko hijab online (contoh)",
    painsLead:
      'Setiap koleksi baru diunggah, kolom komentar penuh pertanyaan "harga?" dan "ready kak?". Admin membalasnya satu per satu di sela mengemas pesanan, dan komentar yang masuk malam hari baru terbaca besok pagi.',
    pains: [
      'Komentar "harga?" baru dibalas besok, dan calon pembeli sudah membeli di toko lain.',
      "Staf tidak tahu komentar mana yang sudah dibalas.",
      "Pesan yang sama diketik ulang untuk setiap penanya.",
    ],
    built: {
      h: "Balasan singkat di komentar, detailnya lewat pesan pribadi",
      lead: "Anda menentukan kata kunci dan isi pesannya satu kali. Setelah itu setiap komentar yang cocok dibalas dan penulisnya menerima katalog, sementara staf menangani obrolan yang berlanjut.",
      points: [
        "Mengecek komentar baru di postingan yang Anda pilih setiap 15 menit.",
        'Hanya membalas komentar dengan kata kunci, misalnya "harga", "info", atau "pricelist".',
        "Membalas di kolom komentar dengan kalimat singkat yang mengajak membuka pesan pribadi.",
        "Mengirim satu pesan pribadi berisi katalog dan link pemesanan ke penulis komentar.",
        "Mencatat setiap komentar yang sudah dibalas, sehingga tidak ada balasan ganda.",
        "Menyerahkan obrolan ke staf setelah calon pembeli membalas pesan itu.",
      ],
    },
    quote: {
      text: "Waktu peluncuran koleksi, komentar bisa ratusan. Sekarang setiap orang yang bertanya harga sudah menerima katalog, tanpa admin membalas satu per satu.",
      by: "Admin toko hijab online",
    },
    steps: [
      { title: "Komentar masuk", body: "Komentar baru di postingan dicek setiap 15 menit." },
      { title: "Kata kunci dicek", body: "Hanya komentar dengan kata kunci pilihan Anda yang belum pernah dibalas." },
      {
        title: "Dibalas dan dikirimi pesan",
        body: "Balasan singkat di komentar, lalu satu pesan pribadi berisi katalog.",
      },
      { title: "Staf melanjutkan", body: "Kalau calon pembeli membalas, staf meneruskan obrolannya." },
    ],
    compare: [
      { aspect: "Waktu membalas", before: "Menunggu admin sempat", after: "Dicek setiap 15 menit" },
      { aspect: "Komentar terlewat", before: "Sering, saat ramai", after: "Semua dicek dan dicatat" },
      { aspect: "Isi balasan", before: "Diketik ulang", after: "Satu pesan yang sudah disiapkan" },
    ],
    fit: [
      "Toko dan jasa yang sering mendapat pertanyaan harga di komentar postingan.",
      "Akun yang rutin promosi atau membuat postingan dengan ajakan berkomentar.",
    ],
    notFit: [
      "Akun pribadi, karena fitur ini hanya untuk akun bisnis atau kreator.",
      "Produk yang harganya selalu berbeda, misalnya pesanan custom.",
    ],
    prep: [
      "Postingan yang ingin dipantau",
      "Kata kunci yang ingin dibalas",
      "Isi balasan dan pesan pribadi",
      "Katalog atau link yang dibagikan",
    ],
    metrics: [
      { value: "15", unit: "menit", label: "jarak antar pengecekan komentar baru" },
      { value: "1", unit: "pesan", label: "pribadi untuk setiap komentar berisi kata kunci" },
      { value: "7", unit: "hari", label: "batas mengirim pesan pribadi setelah komentar dibuat" },
    ],
    faq: [
      {
        q: "Apakah semua komentar dibalas?",
        a: "Tidak. Hanya komentar yang berisi kata kunci pilihan Anda. Komentar lain dan keluhan tetap dibalas staf.",
      },
      {
        q: "Berapa pesan pribadi yang bisa dikirim?",
        a: "Satu pesan untuk setiap komentar, paling lambat tujuh hari setelah komentar dibuat, sesuai aturan Instagram. Kalau calon pembeli membalas, obrolan bisa berlanjut seperti biasa.",
      },
      {
        q: "Bagaimana dengan komentar negatif?",
        a: "Komentar tanpa kata kunci, termasuk keluhan, tidak dibalas otomatis. Staf tetap membacanya dan membalas sendiri.",
      },
    ],
  },
  en: {
    title: 'No "how much?" comment goes unanswered',
    question: "How can a business answer every buyer's comment on social media without missing one?",
    result: "Everyone who asks in the comments gets the details",
    summary:
      "Comments with a keyword get a short reply, then the commenter receives one private message with a catalog or link.",
    answer:
      'New comments on your posts are checked every 15 minutes. Comments with a keyword such as "price", "info" or "pricelist" get a short public reply, and the commenter receives one private message with the catalog and an order link. Every reply is logged so no comment is answered twice. If the buyer replies to that message, your staff continue the conversation.',
    client: "Online hijab store (sample)",
    painsLead:
      'Every time a new collection is posted, the comments fill up with "how much?" and "in stock?". The admin answers them one by one between packing orders, and comments that arrive at night are only read the next morning.',
    pains: [
      'A "how much?" comment is answered the next day, after the buyer has bought elsewhere.',
      "Staff cannot tell which comments have already been answered.",
      "The same message is retyped for every person who asks.",
    ],
    built: {
      h: "A short public reply, with the details in a private message",
      lead: "You set the keywords and the messages once. After that every matching comment is answered and its writer receives the catalog, while your staff handle the conversations that continue.",
      points: [
        "Checks new comments on the posts you choose every 15 minutes.",
        'Only answers comments with a keyword, such as "price", "info" or "pricelist".',
        "Replies in the comments with a short line that invites the person to check their messages.",
        "Sends the commenter one private message with the catalog and an order link.",
        "Logs every comment that has been answered, so nobody gets a double reply.",
        "Hands the conversation to your staff once the buyer replies.",
      ],
    },
    quote: {
      text: "When a collection launches, comments can run into the hundreds. Now everyone who asks the price gets the catalog without the admin answering them one by one.",
      by: "Admin of an online hijab store",
    },
    steps: [
      { title: "New comment", body: "New comments on your posts are checked every 15 minutes." },
      { title: "Keyword check", body: "Only comments with your keywords that have not been answered yet." },
      { title: "Reply and message", body: "A short reply in the comments, then one private message with the catalog." },
      { title: "Staff take over", body: "If the buyer replies, your staff continue the conversation." },
    ],
    compare: [
      { aspect: "Reply time", before: "Whenever the admin is free", after: "Checked every 15 minutes" },
      { aspect: "Missed comments", before: "Common on busy days", after: "Every one checked and logged" },
      { aspect: "Reply text", before: "Retyped each time", after: "One prepared message" },
    ],
    fit: [
      "Shops and services that often get price questions in post comments.",
      "Accounts that promote regularly or post with a call to comment.",
    ],
    notFit: [
      "Personal accounts, because this only works for business or creator accounts.",
      "Products whose price always differs, such as custom orders.",
    ],
    prep: [
      "The posts you want watched",
      "The keywords you want answered",
      "The public reply and private message",
      "The catalog or link to share",
    ],
    metrics: [
      { value: "15", unit: "minutes", label: "between checks for new comments" },
      { value: "1", unit: "message", label: "in private for each comment with a keyword" },
      { value: "7", unit: "days", label: "limit for sending the private message after a comment" },
    ],
    faq: [
      {
        q: "Are all comments answered?",
        a: "No. Only comments with the keywords you choose. Other comments and complaints are still answered by your staff.",
      },
      {
        q: "How many private messages can be sent?",
        a: "One message per comment, no later than seven days after the comment was posted, as Instagram's rules require. If the buyer replies, the conversation can continue as usual.",
      },
      {
        q: "What about negative comments?",
        a: "Comments without a keyword, including complaints, are not answered automatically. Your staff still read them and reply themselves.",
      },
    ],
  },
};
