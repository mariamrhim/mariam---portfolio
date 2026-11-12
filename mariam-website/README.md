# Website peribadi Siti Mariam

Website statik dengan HTML, CSS dan JavaScript biasa. Tiada framework, npm, API key atau build step diperlukan. GitHub explorer dan colour playground sudah dibuang daripada website ini.

## Mula edit

1. Extract ZIP ke satu folder pada komputer. Jangan edit terus di dalam ZIP.
2. Buka folder itu dalam VS Code (File > Open Folder), atau buka fail tertentu dengan Notepad.
3. Double-click `index.html` untuk tengok website. Selepas edit dan Save, refresh browser.
4. Untuk pengalaman preview yang lebih konsisten, gunakan extension **Live Server** dalam VS Code, kemudian klik kanan `index.html` > Open with Live Server. Ini optional.

## Fail yang mana nak edit?

| Fail | Kegunaan |
| --- | --- |
| `content.js` | Nama penuh, nama pendek, email, intro, gambar, bio, pendidikan, pengalaman, social links, PDF resume dan projek |
| `index.html` | Layout dan ayat khusus halaman Home |
| `about.html` | Layout, tajuk dan FAQ About |
| `portfolio.html` | Layout Portfolio; senarai projek diambil daripada `content.js` |
| `contact.html` | Layout dan ayat Contact |
| `style.css` | Warna, font, spacing, responsive layout dan animasi |
| `app.js` | Butang, filter, bookmark, modal projek, contact card dan draft email |
| `assets/` | Gambar, favicon, PDF dan aset sendiri |
| `playground.html` | Redirect untuk alamat lama, terus ke Portfolio |

## Tukar gambar sendiri

1. Letakkan gambar seperti `gambar-mariam.jpg` dalam folder `assets/`.
2. Dalam `content.js`, tukar:

```js
portrait: "assets/gambar-mariam.jpg",
portraitAlt: "Siti Mariam Abdul Rahim",
```

3. Save dan refresh. Gambar yang sama dipakai di Home dan About. Gambar portrait menegak disarankan. Crop boleh dilaras dalam `style.css` melalui `object-fit` dan `object-position`.

## Tukar maklumat diri

Edit nilai dalam `content.js`. Kekalkan tanda petikan, koma dan kurungan. Nama besar di Home, title browser, metadata, dan beberapa ayat editorial berada dalam fail HTML; cari teks yang berkenaan dan tukar juga jika perlu.

Fail menggunakan UTF-8. Dalam Notepad, gunakan Save as type **All files**, encoding **UTF-8**; elakkan menukar `content.js` menjadi `content.js.txt`.

## Tambah pendidikan / pengalaman

Senarai kosong tidak dipaparkan. Contoh dalam `content.js`:

```js
education: [
  { title: "Nama kelayakan", detail: "Nama institusi · Tahun" }
],
experience: [
  {
    title: "Jawatan",
    detail: "Organisasi · Tarikh",
    description: "Penerangan pengalaman sebenar."
  }
],
```

## Tambah projek

Dalam senarai `projects` di `content.js`, copy objek projek sedia ada. Letak koma antara objek dan gunakan `id` unik untuk setiap projek. Contoh:

```js
{
  id: "projek-kedua",
  title: "Nama projek sebenar",
  category: "Administration",
  year: "2026",
  status: "Personal project",
  summary: "Ringkasan pendek projek.",
  description: "Penerangan lebih lengkap untuk popup detail.",
  details: ["Apa yang dibuat", "Apa yang dipelajari"],
  image: "assets/projek-kedua.jpg",
  imageAlt: "Penerangan imej projek",
  url: "https://example.com",
  linkLabel: "View project"
}
```

Gunakan URL projek sendiri. Gantikan URL contoh sebelum menyiarkan. Kategori filter dijana automatik daripada projek yang ada. `url: ""` menyembunyikan link projek. Featured project di Home ditulis berasingan dalam `index.html`, jadi edit bahagian itu jika mahu tukar.

## Tambah link sosial / resume

Tiada GitHub link, public lookup atau external API aktif dalam versi ini. Social links kosong secara default. Tambah hanya link yang mahu pelawat lihat:

```js
socialLinks: [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/NAMA-SENDIRI" }
],
resume: "assets/Mariam-Resume.pdf",
```

Letakkan PDF sebenar dalam `assets/`. Butang resume muncul di About apabila path diisi. Jangan letak dokumen peribadi yang tidak mahu dikongsi dalam folder website.

## Tukar warna dan animasi

Di permulaan `style.css`, edit pemboleh ubah dalam `:root` (tema cerah) dan `body.dark` (tema gelap). Website menggunakan font sistem Arial dan Georgia, jadi tiada muat turun font atau dependency luar.

Animasi: kemunculan hero, reveal ketika scroll, pergerakan kecil butang, zoom halus gambar, dan reading progress. Sistem **Reduce Motion** disokong automatik.

## Fungsi dan batasannya

- Portfolio: cari, filter kategori, bookmark pada peranti sendiri, dan buka detail projek.
- Tema, bookmark dan draft email disimpan dalam browser masing-masing; bukan data dikongsi antara pengguna atau peranti.
- Contact card dimuat turun sebagai `.vcf`.
- Borang contact membuka aplikasi email dengan draft terisi. Pelawat mesti tekan Send sendiri. Tiada server inbox atau penghantaran automatik.
- Copy/share bergantung pada sokongan browser. Copy boleh memerlukan HTTPS; fallback disediakan untuk browser yang menyokongnya.
- Tiada dashboard admin awam. Edit kandungan melalui fail sendiri.
- Gambar portrait masih placeholder. Pendidikan, pengalaman dan PDF resume tidak diisi kerana maklumat sebenar belum diberikan.

## Publish atau update

ZIP ini ialah website portable: upload SEMUA fail dan folder aset ke static hosting, dengan `index.html` pada root. Ia tidak memerlukan proses build. Jika hosting meminta publish directory, pilih folder yang mengandungi `index.html`.

Edit fail pada komputer tidak mengemas kini website Sites secara automatik. Untuk kemas kini link Sites sedia ada, hantarkan ZIP/fail yang diubah dalam chat dan minta update website yang sama. Jangan kongsi password atau API key dalam fail website.

Versi Sites sedia ada masih private. Upload pada hosting lain mungkin menjadikannya public mengikut tetapan hosting tersebut.

## Semakan selepas edit

Buka keempat-empat halaman, semak paparan kecil/besar, uji link, carian projek, simpan contact dan email. Jika JavaScript berhenti selepas edit `content.js`, semak koma/quotation marks atau buka Developer Tools > Console. Tiada ujian visual browser dijalankan dalam sesi asal; semakan sumber dan interaksi DOM disertakan dalam proses pembangunan.
