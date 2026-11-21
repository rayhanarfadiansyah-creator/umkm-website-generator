"use client";

import { useEffect, useState } from "react";

type PackageName = "basic" | "pro" | "premium";

const packages = [
  {
    id: "basic" as PackageName,
    name: "Basic",
    price: "50.000",
    description: "Profil bisnis sederhana untuk mulai tampil profesional.",
    features: [
      "Profil bisnis",
      "Informasi produk atau layanan",
      "Galeri foto",
      "Kontak dan WhatsApp",
    ],
  },
  {
    id: "pro" as PackageName,
    name: "Pro",
    price: "75.000",
    description: "Website bisnis dengan informasi yang lebih lengkap.",
    features: [
      "Semua fitur Basic",
      "Daftar harga produk",
      "Testimoni pelanggan",
      "Keunggulan bisnis",
      "Animasi ringan",
    ],
  },
  {
    id: "premium" as PackageName,
    name: "Premium",
    price: "100.000",
    description: "Website lengkap dengan informasi lokasi usaha.",
    features: [
      "Semua fitur Pro",
      "Google Maps",
      "Alamat bisnis",
      "Jam operasional",
      "Petunjuk arah lokasi",
    ],
  },
];

const palettes = [
  {
    id: "forest",
    name: "Forest",
    description: "Natural dan elegan",
    colors: ["#263F35", "#D98566", "#F5F1E8"],
  },
  {
    id: "terracotta",
    name: "Terracotta",
    description: "Hangat dan bersahabat",
    colors: ["#794C3B", "#D58A68", "#F6EDE2"],
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Segar dan modern",
    colors: ["#294B5A", "#77A9A0", "#F0F5F1"],
  },
];

function Field({
  label,
  name,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}{required ? " *" : ""}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#D9DCCF] bg-[#FCFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#B96D50]"
      />
    </div>
  );
}

function TextField({
  label,
  name,
  placeholder,
  required = false,
  rows = 4,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}{required ? " *" : ""}
      </label>
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-[#D9DCCF] bg-[#FCFBF8] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#B96D50]"
      />
    </div>
  );
}

export default function CreateWebsitePage() {
  const [selectedPackage, setSelectedPackage] =
    useState<PackageName>("basic");
  const [selectedPalette, setSelectedPalette] = useState("forest");
  const [logoName, setLogoName] = useState("");
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const packageParam = params.get("paket")?.toLowerCase();

    if (
      packageParam === "basic" ||
      packageParam === "pro" ||
      packageParam === "premium"
    ) {
      setSelectedPackage(packageParam);
    }
  }, []);

  const currentPackage = packages.find(
    (item) => item.id === selectedPackage
  )!;

  const isPro =
    selectedPackage === "pro" || selectedPackage === "premium";

  const isPremium = selectedPackage === "premium";

  const currentPalette = palettes.find(
    (item) => item.id === selectedPalette
  )!;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#263F35]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-[#263F35]/10 bg-[#F5F1E8]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <a href="/" className="text-2xl font-extrabold tracking-tight">
            web<span className="text-[#B96D50]">UMKM</span>
          </a>

          <a
            href="/"
            className="rounded-full border border-[#A9B59B] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#E9E9DE]"
          >
            ← Kembali
          </a>
        </nav>
      </header>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-12 lg:px-10 lg:pt-16">
        <div className="max-w-2xl animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B96D50]">
            Website builder
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Yuk, kenalkan bisnis
            <span className="text-[#B96D50]"> kamu.</span>
          </h1>

          <p className="mt-4 leading-7 text-[#68736A]">
            Lengkapi informasi bisnis dan pilih tampilan website.
            AI akan membantu menyusun website berdasarkan data
            yang kamu berikan.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
          {[
            ["01", "Pilih desain"],
            ["02", "Isi informasi"],
            ["03", "Preview website"],
          ].map(([number, label]) => (
            <div key={number} className="border-t-2 border-[#B96D50] pt-3">
              <p className="text-xs font-bold text-[#B96D50]">{number}</p>
              <p className="mt-1 text-xs font-semibold sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-5 pb-20 lg:grid-cols-[1fr_340px] lg:px-10">
          <div className="min-w-0 space-y-7">

            {/* PILIH PAKET */}
            <section className="overflow-hidden rounded-2xl border border-[#D9DCCF] bg-white p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#B96D50]">
                Langkah 01
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Pilih paket website
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#68736A]">
                Pilih paket sesuai kebutuhan bisnis kamu.
                Setiap paket memiliki fitur dan template berbeda.
              </p>

              <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
                {packages.map((pkg) => {
                  const active = selectedPackage === pkg.id;

                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setSelectedPackage(pkg.id);
                        setSubmitted(false);
                      }}
                      className={`relative w-[85%] shrink-0 snap-start rounded-xl border-2 p-5 text-left transition sm:w-[48%] lg:w-auto lg:flex-1 ${
                        active
                          ? "border-[#B96D50] bg-[#F7F3EB]"
                          : "border-[#E5E6DE] hover:border-[#A9B59B]"
                      }`}
                    >
                      {active && (
                        <span className="absolute right-3 top-3 text-sm font-bold text-[#B96D50]">
                          ✓
                        </span>
                      )}

                      <p className="text-lg font-bold">{pkg.name}</p>
                      <p className="mt-2 text-2xl font-bold">
                        <span className="text-sm">Rp</span> {pkg.price}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#68736A]">
                        {pkg.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        {pkg.features.map((feature) => (
                          <p key={feature} className="flex gap-2 text-xs">
                            <span className="font-bold text-[#B96D50]">✓</span>
                            {feature}
                          </p>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[#899087] lg:hidden">
                Geser untuk melihat paket lainnya →
              </p>
            </section>

            {/* PALET WARNA */}
            <section className="rounded-2xl border border-[#D9DCCF] bg-white p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#B96D50]">
                Langkah 02
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Pilih warna website
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#68736A]">
                Setiap paket memiliki tiga pilihan palet warna.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {palettes.map((palette) => {
                  const active = selectedPalette === palette.id;

                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setSelectedPalette(palette.id)}
                      className={`rounded-xl border-2 p-2 text-left transition sm:p-3 ${
                        active
                          ? "border-[#B96D50] bg-[#F7F3EB]"
                          : "border-[#E5E6DE] hover:border-[#A9B59B]"
                      }`}
                    >
                      <div className="flex h-10 overflow-hidden rounded-lg sm:h-14">
                        {palette.colors.map((color) => (
                          <div
                            key={color}
                            className="flex-1"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-xs font-bold sm:text-sm">
                        {palette.name}
                      </p>
                      <p className="mt-1 hidden text-[10px] text-[#68736A] sm:block">
                        {palette.description}
                      </p>
                      <p className="mt-2 text-[10px] font-bold text-[#B96D50]">
                        {active ? "✓ Dipilih" : "Pilih"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* IDENTITAS BISNIS - SEMUA PAKET */}
            <section className="rounded-2xl border border-[#D9DCCF] bg-white p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#B96D50]">
                Langkah 03
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Identitas bisnis
              </h2>
              <p className="mt-2 text-sm text-[#68736A]">
                Informasi dasar yang akan ditampilkan di semua jenis website.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Nama bisnis"
                  name="businessName"
                  placeholder="Contoh: Kopi Senja"
                  required
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Kategori bisnis *
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-[#D9DCCF] bg-[#FCFBF8] px-4 py-3 text-sm outline-none focus:border-[#B96D50]"
                  >
                    <option value="" disabled>Pilih kategori</option>
                    <option>Kuliner dan makanan</option>
                    <option>Fashion dan pakaian</option>
                    <option>Kecantikan</option>
                    <option>Jasa dan layanan</option>
                    <option>Kerajinan dan handmade</option>
                    <option>Retail dan toko</option>
                    <option>Pendidikan</option>
                    <option>Lainnya</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <Field
                    label="Tagline bisnis"
                    name="tagline"
                    placeholder="Contoh: Nikmati kopi, nikmati cerita."
                  />
                </div>

                <div className="sm:col-span-2">
                  <TextField
                    label="Deskripsi bisnis"
                    name="description"
                    placeholder="Ceritakan tentang bisnis kamu, kapan dimulai, apa yang ditawarkan, dan informasi penting lainnya..."
                    required
                  />
                </div>

                <Field
                  label="Nomor WhatsApp"
                  name="whatsapp"
                  placeholder="08xxxxxxxxxx"
                  required
                  type="tel"
                />

                <Field
                  label="Email bisnis"
                  name="email"
                  placeholder="bisnis@email.com"
                  type="email"
                />
              </div>
            </section>

            {/* PRODUK BASIC */}
            <section className="rounded-2xl border border-[#D9DCCF] bg-white p-5 sm:p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#B96D50]">
                  {isPro ? "Katalog produk" : "Informasi produk"}
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {isPro ? "Produk dan daftar harga" : "Produk atau layanan"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#68736A]">
                  {isPro
                    ? "Tampilkan produk lengkap dengan harga agar pelanggan mudah memilih."
                    : "Kenalkan produk atau layanan utama yang ditawarkan bisnis kamu."}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {[1, 2, 3].map((number) => (
                  <div key={number} className="rounded-xl bg-[#F7F6F1] p-4">
                    <p className="mb-3 text-xs font-bold text-[#B96D50]">
                      {isPro ? `Produk ${number}` : `Informasi ${number}`}
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name={`productName${number}`}
                        placeholder="Nama produk atau layanan"
                        className="w-full rounded-lg border border-[#D9DCCF] bg-white px-3 py-3 text-sm outline-none focus:border-[#B96D50]"
                      />

                      {isPro && (
                        <input
                          name={`productPrice${number}`}
                          placeholder="Harga produk (contoh: 25.000)"
                          className="w-full rounded-lg border border-[#D9DCCF] bg-white px-3 py-3 text-sm outline-none focus:border-[#B96D50]"
                        />
                      )}
                    </div>

                    <textarea
                      name={`productDescription${number}`}
                      rows={2}
                      placeholder="Jelaskan produk atau layanan..."
                      className="mt-3 w-full rounded-lg border border-[#D9DCCF] bg-white px-3 py-3 text-sm outline-none focus:border-[#B96D50]"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* GALERI DAN LOGO - SEMUA PAKET */}
            <section className="rounded-2xl border border-[#D9DCCF] bg-white p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#B96D50]">
                Aset bisnis
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Logo dan galeri foto
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#68736A]">
                Gunakan foto asli agar website lebih meyakinkan.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Logo bisnis
                  </label>
                  <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#C9D1BE] bg-[#F8F8F3] px-4 py-7 text-center transition hover:bg-[#F1F2E9]">
                    <span className="text-3xl">↑</span>
                    <span className="mt-2 text-sm font-bold">
                      Klik untuk upload logo
                    </span>
                    <span className="mt-1 text-xs text-[#899087]">
                      PNG, JPG, atau WebP
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(event) =>
                        setLogoName(event.target.files?.[0]?.name || "")
                      }
                    />
                  </label>
                  {logoName && (
                    <p className="mt-2 text-xs text-[#58745B]">
                      ✓ {logoName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Foto produk atau tempat usaha
                  </label>
                  <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#C9D1BE] bg-[#F8F8F3] px-4 py-7 text-center transition hover:bg-[#F1F2E9]">
                    <span className="text-3xl">▧</span>
                    <span className="mt-2 text-sm font-bold">
                      Upload beberapa foto
                    </span>
                    <span className="mt-1 text-xs text-[#899087]">
                      PNG, JPG, atau WebP
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      className="hidden"
                      onChange={(event) =>
                        setPhotoNames(
                          Array.from(event.target.files || []).map(
                            (file) => file.name
                          )
                        )
                      }
                    />
                  </label>

                  {photoNames.map((name) => (
                    <p key={name} className="mt-2 text-xs text-[#58745B]">
                      ✓ {name}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* KHUSUS PRO DAN PREMIUM */}
            {isPro && (
              <section className="rounded-2xl border border-[#D9DCCF] bg-white p-5 sm:p-7 animate-fade-up">
                <span className="rounded-full bg-[#E9E9DE] px-3 py-1 text-xs font-bold text-[#58665D]">
                  Fitur khusus Pro
                </span>

                <h2 className="mt-4 text-2xl font-bold">
                  Keunggulan dan testimoni
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#68736A]">
                  Bangun kepercayaan pelanggan melalui kelebihan dan
                  pengalaman pelanggan yang benar-benar ada.
                </p>

                <div className="mt-6 space-y-5">
                  <TextField
                    label="Keunggulan bisnis"
                    name="advantages"
                    placeholder="Tuliskan keunggulan nyata bisnis kamu. Contoh: menggunakan bahan lokal, dibuat setiap hari, layanan antar..."
                  />

                  <TextField
                    label="Testimoni pelanggan"
                    name="testimonials"
                    placeholder="Masukkan testimoni asli pelanggan. Jangan isi dengan testimoni buatan."
                  />

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Gaya animasi website
                    </label>
                    <select
                      name="animationStyle"
                      defaultValue="subtle"
                      className="w-full rounded-xl border border-[#D9DCCF] bg-[#FCFBF8] px-4 py-3 text-sm outline-none focus:border-[#B96D50]"
                    >
                      <option value="none">Tanpa animasi tambahan</option>
                      <option value="subtle">Animasi halus</option>
                      <option value="dynamic">Animasi lebih dinamis</option>
                    </select>
                    <p className="mt-2 text-xs text-[#899087]">
                      Animasi tidak mengganggu kenyamanan pengunjung.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* KHUSUS PREMIUM */}
            {isPremium && (
              <section className="rounded-2xl border border-[#D9DCCF] bg-white p-5 sm:p-7 animate-fade-up">
                <span className="rounded-full bg-[#E9E9DE] px-3 py-1 text-xs font-bold text-[#58665D]">
                  Fitur khusus Premium
                </span>

                <h2 className="mt-4 text-2xl font-bold">
                  Lokasi dan jam operasional
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#68736A]">
                  Bantu pelanggan menemukan tempat usaha dan mengetahui
                  kapan bisnis kamu beroperasi.
                </p>

                <div className="mt-6 space-y-5">
                  <TextField
                    label="Alamat lengkap bisnis"
                    name="address"
                    placeholder="Nama jalan, nomor bangunan, kelurahan, kecamatan, kota..."
                    required
                    rows={3}
                  />

                  <Field
                    label="Link Google Maps"
                    name="mapsUrl"
                    placeholder="https://maps.google.com/..."
                    type="url"
                  />

                  <TextField
                    label="Jam operasional"
                    name="openingHours"
                    placeholder={"Senin - Jumat: 09.00 - 17.00\nSabtu: 09.00 - 15.00\nMinggu: Tutup"}
                    rows={4}
                  />

                  <Field
                    label="Petunjuk arah tambahan (opsional)"
                    name="directions"
                    placeholder="Contoh: Dekat pasar utama, sebelah minimarket..."
                  />
                </div>
              </section>
            )}

            {/* SUBMIT */}
            <section className="rounded-2xl bg-[#263F35] p-6 text-white sm:p-8">
              <h2 className="text-xl font-bold">
                Informasi bisnis sudah lengkap?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Periksa kembali data yang kamu masukkan sebelum
                melanjutkan ke proses berikutnya.
              </p>

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-[#D98566] px-6 py-4 font-bold text-white transition hover:bg-[#C87355]"
              >
                Periksa Informasi Bisnis →
              </button>

              {submitted && (
                <p className="mt-4 rounded-xl bg-white/10 p-4 text-sm leading-6 text-white">
                  Form berhasil divalidasi di browser. Penyimpanan data,
                  upload server, dan generate AI belum diaktifkan.
                </p>
              )}
            </section>
          </div>

          {/* RINGKASAN PESANAN */}
          <aside className="min-w-0 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#D9DCCF] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#B96D50]">
                Ringkasan pesanan
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {currentPackage.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#68736A]">
                {currentPackage.description}
              </p>

              <div className="mt-6 border-y border-[#E5E6DE] py-5">
                <p className="text-xs text-[#899087]">
                  Pembayaran satu kali
                </p>
                <p className="mt-1 text-3xl font-bold">
                  <span className="text-sm">Rp</span> {currentPackage.price}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold">Palet warna</p>
                <div className="mt-3 flex gap-2">
                  {currentPalette.colors.map((color) => (
                    <div
                      key={color}
                      className="h-9 flex-1 rounded-lg border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-[#68736A]">
                  {currentPalette.name}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {currentPackage.features.map((feature) => (
                  <p key={feature} className="flex gap-2 text-xs text-[#58665D]">
                    <span className="font-bold text-[#B96D50]">✓</span>
                    {feature}
                  </p>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-[#F1F2E9] p-4">
                <p className="text-xs font-bold">Informasi penting</p>
                <p className="mt-2 text-xs leading-5 text-[#68736A]">
                  Website dibuat berdasarkan informasi asli yang kamu
                  berikan. Kamu bisa memeriksa preview sebelum pembayaran.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </form>

      {/* FOOTER */}
      <footer className="border-t border-[#263F35]/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="text-sm text-[#68736A]">
            © 2026 webUMKM. Semua hak dilindungi.
          </p>

          <p className="text-sm">
            Website by{" "}
            <a
              href="https://wa.me/6281385916633?text=Halo%20R%20Studio%20Web%2C%20saya%20tertarik%20membuat%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
            >
              R Studio Web ↗
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
