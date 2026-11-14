# Audit D0 / OG0: fondasi detail dan pilot Order Grup

Tanggal: 8 November 2026. Status: keputusan kerja S6 sampai checkpoint greybox.

## Keputusan

1. Cerita sembilan adegan tampil inline sebagai pengalaman utama pilot Order Grup. Overlay Tonton lama tidak dihapus dari rencana, tetapi tidak dibuat sebagai implementasi kedua pada tahap ini.
2. Greybox memakai figur abstrak sederhana dari spesifikasi Order Grup. Ini memvalidasi ruang, fokus, dan kamera tanpa mengunci gaya karakter final; pilihan figur prototipe versus karakter Home/ORB kembali dibawa pada review OG2.
3. HTML ekspor artifact tidak tersedia di repo. Implementasi dibangun dari tiga spesifikasi markdown LOGIKA, VISUAL, dan COPY; perbedaan terhadap artifact dinilai lewat screenshot greybox, bukan klaim port piksel sempurna.
4. Solusi terkait memakai algoritme bersama, menghasilkan `asisten-sop` dan `stok-menipis` untuk Order Grup.
5. Semua CTA di isi detail memakai `detailMessage(title, locale)`. CTA Header global tetap memakai pesan umum agar komponen layout tidak bergantung state route.
6. Angka, kutipan, nama, dan detail klien Order Grup tetap berlabel contoh. Tidak ada klaim terverifikasi baru.
7. Tablet tegak sampai 1023 px memakai komposisi bertumpuk seperti HP: stage 55svh, kartu di bawah, rel minimum 24×28 px.

## Kontrak teknis yang diverifikasi

- Next `16.4.3`, React `19.3.1`, three `0.186.1`; tidak ada paket baru.
- `cacheComponents` aktif, sehingga route tidak memakai `dynamicParams`. Lookup slug + `notFound()` mempertahankan 404; `generateStaticParams()` menghasilkan 12 slug × 2 locale.
- Route: `/solusi/<slug>` dan `/en/solutions/<slug>`. Metadata detail memiliki canonical dan hreflang.
- Cerita adalah data bilingual tervalidasi; scene ID stabil, tepat satu CTA di adegan terakhir, area hanya menunjuk scene yang ada.
- HTML/rel tidak bergantung pada chunk three. Dunia dimuat lazy ketika cerita mendekat, dihentikan jauh dari viewport/tab tersembunyi, dan resource dilepas saat unmount.

## Batas checkpoint

- OG2 memvalidasi bentuk, area, kamera, layer HTML, tablet tegak, rel, reduced motion, dan lifecycle dasar.
- Belum ada material final, bayangan final, CSS3D yang ditempel ke anchor dunia, hover/raycast area, atau koreografi per waktu. Itu lingkup D3/OG3 setelah review.
- Uji Android/iOS fisik belum dilakukan. QA saat ini memakai Chromium desktop pada viewport canonical.
