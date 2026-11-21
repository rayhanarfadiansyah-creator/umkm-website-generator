
const packages = [
  {
    name: "Basic",
    price: "50.000",
    description: "Untuk UMKM yang ingin mulai tampil profesional di internet.",
    features: [
      "Profil bisnis",
      "Informasi produk atau layanan",
      "Galeri foto",
      "Kontak dan tombol WhatsApp",
    ],
    label: "Mulai sederhana",
    style: "basic",
  },
  {
    name: "Pro",
    price: "75.000",
    description: "Tampilkan bisnis dengan informasi yang lebih lengkap.",
    features: [
      "Semua fitur Basic",
      "Daftar harga produk atau layanan",
      "Testimoni pelanggan",
      "Keunggulan bisnis",
      "Animasi ringan",
    ],
    label: "Pilihan populer",
    style: "pro",
  },
  {
    name: "Premium",
    price: "100.000",
    description: "Informasi bisnis lengkap agar pelanggan lebih mudah menemukanmu.",
    features: [
      "Semua fitur Pro",
      "Google Maps",
      "Alamat bisnis",
      "Jam operasional",
      "Petunjuk arah lokasi",
    ],
    label: "Fitur terlengkap",
    style: "premium",
  },
];

const demos = [
  {
    name: "Basic",
    type: "Profil usaha sederhana",
    color: "bg-[#DCE5D5]",
    accent: "bg-[#58745B]",
  },
  {
    name: "Pro",
    type: "Bisnis dengan katalog lengkap",
    color: "bg-[#F1DFD2]",
    accent: "bg-[#B96D50]",
  },
  {
    name: "Premium",
    type: "Profil bisnis profesional",
    color: "bg-[#E4E1D2]",
    accent: "bg-[#344F42]",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#B96D50]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#263F35] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 leading-7 text-[#68736A]">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1E8] text-[#263F35]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#263F35]/10 bg-[#F5F1E8]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#" className="text-2xl font-extrabold tracking-tight">
            web<span className="text-[#B96D50]">UMKM</span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#58665D] md:flex">
            <a href="#fitur" className="transition hover:text-[#B96D50]">Fitur</a>
            <a href="#demo" className="transition hover:text-[#B96D50]">Contoh Website</a>
            <a href="#harga" className="transition hover:text-[#B96D50]">Harga</a>
          </div>

          <a
            href="#harga"
            className="rounded-full bg-[#263F35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#385747]"
          >
            Buat Website <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:py-28 lg:grid-cols-[1.02fr_0.98fr] lg:px-10">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#A9B59B] bg-[#E6E9DC] px-4 py-2 text-xs font-semibold text-[#405B48]">
            <span className="h-2 w-2 rounded-full bg-[#B96D50]" />
            Solusi website untuk UMKM Indonesia
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl">
            Bisnismu layak punya
            <span className="text-[#B96D50]"> website sendiri.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#68736A]">
            Bikin website profil bisnis yang profesional tanpa harus pusing
            urusan desain dan coding. Cukup isi informasi usahamu, biarkan AI
            membantu menyusunnya.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#harga"
              className="rounded-full bg-[#B96D50] px-7 py-4 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#A85B40]"
            >
              Mulai Buat Website <span aria-hidden="true">→</span>
            </a>
            <a
              href="#demo"
              className="rounded-full border border-[#A9B59B] px-7 py-4 font-semibold text-[#344F42] transition hover:bg-[#E6E9DC]"
            >
              Lihat Contoh
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#68736A]">
            <span>✓ Tanpa coding</span>
            <span>✓ Dibantu AI</span>
            <span>✓ Sekali bayar</span>
          </div>
        </div>

        {/* WEBSITE PREVIEW */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-5 -top-8 h-32 w-32 rounded-full bg-[#D8DDC8]" />
          <div className="absolute -bottom-8 -left-7 h-36 w-36 rounded-full bg-[#E8D0C1]" />

          <div className="relative rounded-2xl border border-[#263F35]/10 bg-white p-3 shadow-[0_24px_70px_rgba(38,63,53,0.13)]">
            <div className="flex items-center gap-2 border-b border-[#E9E8E1] px-3 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D98B72]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D9B96F]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#9AAE8D]" />
              <div className="ml-3 flex-1 rounded-full bg-[#F3F3EF] px-4 py-1.5 text-center text-[10px] text-[#899087]">
                namabisnis.webumkm.id
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-[#F5F1E8]">
              <div className="flex items-center justify-between px-5 py-5">
                <span className="text-sm font-extrabold tracking-tight">KOPI SENJA</span>
                <div className="flex gap-3 text-[9px] font-medium text-[#68736A]">
                  <span>Beranda</span><span>Menu</span><span>Kontak</span>
                </div>
              </div>

              <div className="grid min-h-[270px] items-center gap-4 px-5 pb-7 sm:grid-cols-2 sm:px-7">
                <div className="py-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B96D50]">
                    Cerita dari secangkir kopi
                  </p>
                  <h3 className="mt-3 text-3xl font-bold leading-tight text-[#263F35]">
                    Temukan rasa, nikmati suasana.
                  </h3>
                  <p className="mt-3 text-[10px] leading-5 text-[#68736A]">
                    Tempat sederhana untuk menikmati kopi dan cerita bersama.
                  </p>
                  <div className="mt-5 inline-block rounded-full bg-[#263F35] px-4 py-2 text-[9px] font-semibold text-white">
                    Jelajahi Menu
                  </div>
                </div>

                <div className="flex h-48 items-center justify-center rounded-xl bg-[#D8DDC8]">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#B96D50] shadow-lg">
                    <span className="text-6xl">☕</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-white px-5 py-4">
                <div><div className="text-xs font-bold">Menu</div><div className="mt-1 text-[9px] text-[#899087]">Pilihan kopi</div></div>
                <div><div className="text-xs font-bold">Tentang</div><div className="mt-1 text-[9px] text-[#899087]">Cerita usaha</div></div>
                <div><div className="text-xs font-bold">Kontak</div><div className="mt-1 text-[9px] text-[#899087]">Hubungi kami</div></div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 right-5 rounded-xl bg-white px-5 py-3 shadow-lg">
            <p className="text-xs font-bold text-[#263F35]">Website siap tampil</p>
            <p className="mt-1 text-[10px] text-[#68736A]">Dibuat dengan bantuan AI ✦</p>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-[#263F35]/10 bg-[#E9E9DE]">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 px-4 py-7 text-center sm:gap-7 sm:px-6 sm:py-8 lg:px-10">
          <div>
            <p className="text-sm font-bold sm:text-lg">Praktis</p>
            <p className="mt-1 text-sm text-[#68736A]">Isi data bisnis dengan mudah</p>
          </div>
          <div>
            <p className="text-sm font-bold sm:text-lg">Profesional</p>
            <p className="mt-1 text-sm text-[#68736A]">Desain sesuai pilihan paket</p>
          </div>
          <div>
            <p className="text-sm font-bold sm:text-lg">Sekali bayar</p>
            <p className="mt-1 text-sm text-[#68736A]">Tanpa biaya langganan tahunan</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Kenapa webUMKM?"
            title="Fokus kembangkan bisnis. Website biar kami bantu."
            description="Website membantu calon pelanggan mengenal bisnis, melihat produk, dan menemukan cara menghubungimu."
          />

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-2 flex items-center justify-between gap-4 rounded-2xl bg-[#263F35] p-5 text-white sm:col-span-1 sm:flex-col sm:items-start sm:justify-between sm:p-7">
              <span className="text-3xl">✦</span>
              <div className="mt-0 flex-1 sm:mt-12">
                <h3 className="text-2xl font-bold">Dibantu AI</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  AI membantu menyusun informasi bisnis menjadi konten website
                  yang rapi berdasarkan data yang kamu berikan.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#D8DDC8] p-7">
              <span className="text-3xl">🎨</span>
              <h3 className="mt-7 text-xl font-bold">Pilih tampilan</h3>
              <p className="mt-2 text-sm leading-6 text-[#68736A]">
                Setiap paket punya desain berbeda dengan pilihan warna.
              </p>
            </div>

            <div className="rounded-2xl bg-[#EBD8CC] p-7">
              <span className="text-3xl">📱</span>
              <h3 className="mt-7 text-xl font-bold">Responsif</h3>
              <p className="mt-2 text-sm leading-6 text-[#765F54]">
                Nyaman dibuka melalui ponsel, tablet, maupun komputer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="bg-[#E9E9DE] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Lihat sebelum memilih"
              title="Tiga paket, tiga karakter desain."
              description="Setiap paket memiliki tampilan dan susunan halaman yang berbeda. Lihat contoh desainnya sebelum menentukan pilihan."
            />
            <a href="#harga" className="shrink-0 font-bold text-[#B96D50] hover:underline">
              Lihat pilihan harga →
            </a>
          </div>
          <p className="mt-8 text-xs text-[#68736A] md:hidden">
            Geser ke kiri untuk melihat desain lainnya →
          </p>
          <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 md:grid md:grid-cols-3 md:overflow-visible">
            {demos.map((demo) => (
              <div
                key={demo.name}
                className="group w-[85%] shrink-0 snap-start sm:w-[70%] md:w-auto"
              >
                <div className={`rounded-2xl ${demo.color} p-4 transition duration-300 group-hover:-translate-y-1`}>
                  <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className={`h-3 ${demo.accent}`} />
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="h-2 w-16 rounded-full bg-[#263F35]" />
                        <div className="h-2 w-10 rounded-full bg-[#E5E5DE]" />
                      </div>
                      {demo.name === "Basic" ? (
                        <div className="py-7 text-center">
                          <div className="mx-auto h-16 w-16 rounded-full bg-[#D8DDC8]" />
                          <div className="mx-auto mt-4 h-3 w-32 rounded-full bg-[#263F35]" />
                          <div className="mx-auto mt-2 h-2 w-24 rounded-full bg-[#E5E5DE]" />
                          <div className={`mx-auto mt-5 h-7 w-24 rounded-full ${demo.accent}`} />
                        </div>
                      ) : demo.name === "Pro" ? (
                        <div className="py-6">
                          <div className="h-24 rounded-lg bg-[#F1DFD2]" />
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="h-16 rounded-lg bg-[#E9E9DE]" />
                            <div className="h-16 rounded-lg bg-[#E9E9DE]" />
                          </div>
                          <div className="mt-4 h-2 w-3/4 rounded-full bg-[#263F35]" />
                          <div className="mt-2 h-2 w-1/2 rounded-full bg-[#E5E5DE]" />
                        </div>
                      ) : (
                        <div className="py-6">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col justify-center">
                              <div className="h-3 w-full rounded-full bg-[#263F35]" />
                              <div className="mt-2 h-2 w-4/5 rounded-full bg-[#E5E5DE]" />
                              <div className={`mt-4 h-6 w-16 rounded-full ${demo.accent}`} />
                            </div>
                            <div className="h-24 rounded-lg bg-[#D8DDC8]" />
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            <div className="h-12 rounded-lg bg-[#E9E9DE]" />
                            <div className="h-12 rounded-lg bg-[#E9E9DE]" />
                            <div className="h-12 rounded-lg bg-[#E9E9DE]" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1 pt-5">
                  <div>
                    <h3 className="text-xl font-bold">{demo.name}</h3>
                    <p className="mt-1 text-sm text-[#68736A]">{demo.type}</p>
                  </div>
                  <a
                    href="#harga"
                    className="rounded-full border border-[#A9B59B] px-4 py-2 text-sm font-semibold transition hover:bg-white"
                  >
                    Pilih →
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 text-xs text-[#68736A]">
            Tampilan di atas merupakan ilustrasi contoh. Demo website lengkap akan tersedia untuk setiap paket.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="harga" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#B96D50]">
            Paket harga
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pilih yang sesuai kebutuhan bisnismu.
          </h2>
          <p className="mt-4 leading-7 text-[#68736A]">
            Pembayaran satu kali. Tidak ada biaya langganan tahunan.
          </p>
        </div>

        <div className="mt-14 flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-6 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex w-[88%] shrink-0 snap-start flex-col rounded-2xl border p-5 sm:w-[70%] sm:p-7 lg:w-auto ${
                pkg.style === "pro"
                  ? "border-[#B96D50] bg-[#263F35] text-white shadow-xl lg:-translate-y-3"
                  : "border-[#D9DCCF] bg-white"
              }`}
            >
              {pkg.style === "pro" && (
                <span className="mb-4 inline-flex self-start rounded-full bg-[#B96D50] px-4 py-2 text-xs font-bold text-white">
                  {pkg.label}
                </span>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{pkg.name}</h3>
                {pkg.style !== "pro" && (
                  <span className="rounded-full bg-[#E9E9DE] px-3 py-1 text-[10px] font-bold text-[#58665D]">
                    {pkg.label}
                  </span>
                )}
              </div>

              <p className={`mt-3 min-h-12 text-sm leading-6 ${pkg.style === "pro" ? "text-white/65" : "text-[#68736A]"}`}>
                {pkg.description}
              </p>

              <div className="mt-7 border-b border-current/15 pb-7">
                <p className="text-xs text-current/60">Mulai dari</p>
                <p className="mt-1 text-4xl font-bold tracking-tight">
                  <span className="mr-1 text-base font-semibold">Rp</span>
                  {pkg.price}
                </p>
                <p className="mt-2 text-xs text-current/60">Sekali bayar</p>
              </div>

              <div className="flex-1 py-7">
                <p className="mb-4 text-sm font-bold">Yang kamu dapatkan:</p>
                <ul className="space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm">
                      <span className="font-bold text-[#B96D50]">✓</span>
                      <span className={pkg.style === "pro" ? "text-white/80" : "text-[#58665D]"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`/buat-website?paket=${pkg.name.toLowerCase()}`}
                className={`block rounded-full px-5 py-4 text-center text-sm font-bold transition ${
                  pkg.style === "pro"
                    ? "bg-[#D98566] text-white hover:bg-[#C87355]"
                    : "bg-[#263F35] text-white hover:bg-[#385747]"
                }`}
              >
                Pilih Paket {pkg.name} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#D8DDC8] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Cara kerja"
            title="Dari informasi bisnis jadi website."
            description="Prosesnya dibuat sederhana supaya kamu bisa fokus menjalankan usaha."
          />

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-8 md:grid-cols-4">
            {[
              ["01", "Pilih paket", "Tentukan desain dan paket yang sesuai."],
              ["02", "Isi informasi", "Masukkan detail usaha dan unggah foto."],
              ["03", "Lihat preview", "AI membantu menyusun website untuk ditinjau."],
              ["04", "Bayar & terbitkan", "Setelah pembayaran terverifikasi, website diterbitkan."],
            ].map(([number, title, description]) => (
              <div key={number} className="border-t border-[#8E9D83] pt-5">
                <span className="text-sm font-bold text-[#B96D50]">{number}</span>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#68736A]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#263F35] px-7 py-16 text-center text-white sm:px-14">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#E5A58C]">
            Saatnya bisnis tampil lebih percaya diri
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            Punya website sendiri, mulai dari sekarang.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            Kenalkan bisnis lebih luas dengan website yang dibuat sesuai kebutuhan usahamu.
          </p>
          <a
            href="#harga"
            className="mt-8 inline-block rounded-full bg-[#D98566] px-8 py-4 font-bold text-white transition hover:bg-[#C87355]"
          >
            Pilih Paket Website →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#263F35]/10 bg-[#F5F1E8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <a href="#" className="text-xl font-extrabold tracking-tight">
              web<span className="text-[#B96D50]">UMKM</span>
            </a>
            <p className="mt-2 text-sm text-[#68736A]">
              Solusi website praktis untuk bisnis Indonesia.
            </p>
          </div>

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
