"use client";

import { useEffect, useRef, useState } from "react";

const packages = [
  {
    name: "Basic",
    price: "Gratis",
    description: "Website satu halaman yang simpel untuk memperkenalkan bisnis, menampilkan produk utama, dan memudahkan pelanggan menghubungi kamu. Gratis untuk mulai online.",
    features: [
      "Profil bisnis",
      "Informasi produk atau layanan",
      "Galeri foto",
      "Kontak dan tombol WhatsApp",
      "Footer webUMKM",
      "Website langsung diterbitkan",
    ],
    label: "Mulai gratis",
    style: "basic",
  },
  {
    name: "Pro",
    price: "75.000",
    description: "Website dengan layout lebih modern, katalog harga, cerita Tentang Kami, keunggulan, testimoni, animasi, dan 5 pilihan warna.",
    features: [
      "Semua fitur Basic",
      "Daftar harga produk atau layanan",
      "Testimoni pelanggan",
      "Keunggulan bisnis",
      "Animasi ringan",
      "Form Tentang Kami terpisah",
      "5 pilihan palet warna",
      "Layout bisnis lebih menarik",
    ],
    label: "Pilihan populer",
    style: "pro",
  },
  {
    name: "Premium",
    price: "100.000",
    description: "Tampilan paling eksklusif dengan lokasi Google Maps, jam operasional, 7 pilihan warna, dan opsi background foto pada hero.",
    features: [
      "Semua fitur Pro",
      "Google Maps",
      "Alamat bisnis",
      "Jam operasional",
      "Petunjuk arah lokasi",
      "7 pilihan palet warna",
      "Layout Premium lebih eksklusif",
      "Opsional background foto hero",
    ],
    label: "Fitur terlengkap",
    style: "premium",
  },
];

const demos = [
  {
    name: "Basic",
    type: "Profil usaha sederhana",
    description: "Tampilan simpel untuk profil, produk utama, kontak, dan footer webUMKM. Gratis.",
    color: "bg-[#DCE5D5]",
    accent: "bg-[#58745B]",
    price: "Gratis",
  },
  {
    name: "Pro",
    type: "Katalog bisnis lengkap",
    description: "Layout lebih modern dengan katalog harga, Tentang Kami, keunggulan, testimoni, dan 5 pilihan warna.",
    color: "bg-[#FBE5DE]",
    accent: "bg-[#FF6B5E]",
    price: "Rp75.000",
  },
  {
    name: "Premium",
    type: "Profil bisnis profesional",
    description: "Layout premium, informasi lokasi, 7 pilihan warna, serta opsi foto background pada bagian paling atas.",
    color: "bg-[#E4E1D2]",
    accent: "bg-[#17615D]",
    price: "Rp100.000",
  },
];

const faqs = [
  {
    q: "Apakah saya harus bisa coding?",
    a: "Tidak. Kamu cukup mengisi informasi bisnis melalui formulir. Website akan disusun dengan bantuan AI.",
  },
  {
    q: "Apakah paket Basic benar-benar gratis?",
    a: "Ya. Paket Basic tidak dikenakan biaya dan website dapat langsung diterbitkan setelah proses pembuatan selesai.",
  },
  {
    q: "Bagaimana proses paket Pro dan Premium?",
    a: "Kamu bisa melihat preview website terlebih dahulu. Setelah melakukan pembayaran dan pembayaran diverifikasi admin, website akan diterbitkan.",
  },
  {
    q: "Apakah saya bisa mengubah informasi website?",
    a: "Website yang sudah dibuat dapat dikelola melalui tautan pengelolaan yang diberikan setelah proses pembuatan.",
  },
  {
    q: "Apakah ada biaya langganan tahunan?",
    a: "Paket yang ditampilkan menggunakan pembayaran satu kali. Ketersediaan layanan dan ketentuan pemeliharaan mengikuti ketentuan webUMKM.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B5E]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#123B3A] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-sm leading-7 text-[#607A77] sm:text-base">
        {description}
      </p>
    </div>
  );
}

function WebsiteMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[590px]">
      <div className="absolute -right-8 top-0 h-40 w-40 rounded-full bg-[#C8E3DA] blur-2xl" />
      <div className="absolute -bottom-8 left-0 h-40 w-40 rounded-full bg-[#F9DCD3] blur-2xl" />

      <div className="relative rounded-[26px] border border-[#123B3A]/10 bg-white p-2.5 shadow-[0_30px_90px_rgba(18,59,58,0.15)] sm:p-4">
        <div className="flex items-center gap-2 border-b border-[#E2ECE7] px-2 pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF8A78]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E7BE62]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#71A99C]" />
          <div className="ml-3 flex-1 rounded-full bg-[#F0F6F3] px-4 py-2 text-center text-[9px] text-[#8A9D98]">
            namabisnis.webumkm.id
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-[#F7F5EC]">
          <div className="flex items-center justify-between px-5 py-5 sm:px-7">
            <span className="text-sm font-black tracking-tight">KOPI SENJA.</span>
            <div className="hidden gap-5 text-[9px] font-semibold text-[#607A77] sm:flex">
              <span>Beranda</span>
              <span>Tentang</span>
              <span>Menu</span>
              <span>Kontak</span>
            </div>
            <span className="text-[10px] font-bold text-[#FF6B5E] sm:hidden">MENU ☰</span>
          </div>

          <div className="grid items-center gap-5 px-5 pb-8 sm:grid-cols-2 sm:px-7 sm:pb-10">
            <div className="py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FF6B5E]">
                Cerita dari secangkir kopi
              </p>
              <h3 className="mt-4 text-3xl font-bold leading-[1.12] text-[#123B3A] sm:text-4xl">
                Temukan rasa, nikmati suasana.
              </h3>
              <p className="mt-4 text-[10px] leading-5 text-[#607A77]">
                Tempat sederhana untuk menikmati kopi dan cerita bersama.
              </p>
              <span className="mt-5 inline-flex rounded-full bg-[#123B3A] px-5 py-2.5 text-[9px] font-bold text-white">
                Jelajahi Menu →
              </span>
            </div>

            <div className="flex h-48 items-center justify-center rounded-2xl bg-[#C8E3DA] sm:h-56">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#FF6B5E] shadow-xl sm:h-40 sm:w-40">
                <span className="text-7xl">☕</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white px-5 py-5 sm:px-7">
            {[
              ["01", "Menu", "Pilihan kopi"],
              ["02", "Tentang", "Cerita usaha"],
              ["03", "Kontak", "Hubungi kami"],
            ].map(([number, title, desc]) => (
              <div key={number}>
                <p className="text-[9px] font-bold text-[#FF6B5E]">{number}</p>
                <p className="mt-1 text-xs font-bold">{title}</p>
                <p className="mt-1 text-[9px] text-[#8A9D98]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-7 right-3 rounded-2xl border border-[#123B3A]/5 bg-white px-5 py-4 shadow-xl sm:right-0">
        <p className="text-xs font-bold text-[#123B3A]">Website siap tampil ✦</p>
        <p className="mt-1 text-[10px] text-[#607A77]">Dibantu teknologi AI</p>
      </div>
    </div>
  );
}

export default function Home() {
    const [showAdminLink, setShowAdminLink] = useState(false);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSecretLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    logoClickCount.current += 1;

    if (logoClickTimer.current) {
      clearTimeout(logoClickTimer.current);
    }

    if (logoClickCount.current >= 5) {
      setShowAdminLink(true);
      logoClickCount.current = 0;
      return;
    }

    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 3000);
  }
  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F5EC] text-[#123B3A]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#123B3A]/10 bg-[#F7F5EC]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <a
            href="#"
            onClick={handleSecretLogoClick}
            className="text-2xl font-black tracking-tight"
            >
            web<span className="text-[#FF6B5E]">UMKM</span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-semibold text-[#426563] md:flex">
            <a href="#fitur" className="transition hover:text-[#FF6B5E]">Keunggulan</a>
            <a href="#demo" className="transition hover:text-[#FF6B5E]">Contoh website</a>
            <a href="#harga" className="transition hover:text-[#FF6B5E]">Harga</a>
            <a href="#faq" className="transition hover:text-[#FF6B5E]">FAQ</a>
          </div>

          <a
            href="#harga"
            className="rounded-full bg-[#123B3A] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#1D7771] sm:text-sm"
          >
            Buat Website ↗
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section data-reveal className="relative px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-10 lg:pb-32">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#C8E3DA]/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-[#F9DCD3]/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#8DBBB0] bg-[#DCEFE8] px-4 py-2 text-xs font-bold text-[#17615D]">
              <span className="h-2 w-2 rounded-full bg-[#FF6B5E]" />
              Website praktis untuk UMKM Indonesia
            </div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Bisnis Lokal,
              <br />
              <span className="text-[#FF6B5E]">Tampil Profesional.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#607A77] sm:text-lg">
              Punya website profesional tanpa ribet. Isi informasi bisnismu,
              pilih desain, dan biarkan AI membantu menyusunnya.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#harga"
                className="rounded-full bg-[#FF6B5E] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#FF6B5E]/15 transition hover:-translate-y-1 hover:bg-[#E9574D]"
              >
                Mulai Buat Website →
              </a>
              <a
                href="#demo"
                className="rounded-full border border-[#8DBBB0] bg-white/50 px-8 py-4 text-sm font-bold text-[#17615D] transition hover:bg-[#DCEFE8]"
              >
                Lihat Contoh Website
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold text-[#607A77]">
              <span>✓ Tanpa coding</span>
              <span>✓ Dibantu AI</span>
              <span>✓ Tersedia paket gratis</span>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-3xl sm:mt-24">
            <WebsiteMockup />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section data-reveal className="border-y border-[#123B3A]/10 bg-[#E3F0EB]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 py-8 text-center sm:grid-cols-3 sm:gap-6 sm:px-8 lg:px-10">
          {[
            ["Praktis", "Isi informasi bisnis dengan mudah"],
            ["Profesional", "Pilih desain sesuai kebutuhan"],
            ["Mulai Gratis", "Coba website dengan paket Basic"],
          ].map(([title, desc]) => (
            <div key={title} className="min-w-0">
              <p className="text-lg font-bold">{title}</p>
              <p className="mt-1 text-sm text-[#607A77]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section data-reveal id="fitur" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeading
            eyebrow="Kenapa webUMKM?"
            title="Fokus kembangkan bisnis. Website biar kami bantu."
            description="Calon pelanggan bisa mengenal bisnismu, melihat produk, dan menemukan cara untuk menghubungimu melalui website."
          />

          <div className="grid grid-cols-1 gap-4 pb-1 sm:grid-cols-2">
            <div className="flex min-h-64 min-w-0 flex-col justify-between rounded-3xl bg-[#123B3A] p-7 text-white sm:row-span-2">
              <span className="text-4xl">✳</span>
              <div>
                <h3 className="text-2xl font-bold">Dibantu AI</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  AI membantu menyusun informasi bisnis menjadi konten website
                  yang rapi berdasarkan data yang kamu berikan.
                </p>
              </div>
            </div>

            <div className="min-w-0 rounded-3xl bg-[#C8E3DA] p-7">
              <span className="text-3xl">✳</span>
              <h3 className="mt-6 text-xl font-bold">Pilih tampilan</h3>
              <p className="mt-2 text-sm leading-6 text-[#607A77]">
                Setiap paket punya karakter desain yang berbeda.
              </p>
            </div>

            <div className="min-w-0 rounded-3xl bg-[#F9DCD3] p-7">
              <span className="text-3xl">▣</span>
              <h3 className="mt-6 text-xl font-bold">Ramah perangkat</h3>
              <p className="mt-2 text-sm leading-6 text-[#8A625C]">
                Tampilan dirancang agar nyaman dibuka melalui ponsel maupun komputer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMOS */}
      <section data-reveal id="demo" className="bg-[#E3F0EB] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Lihat sebelum memilih"
            title="Tiga paket, tiga karakter desain."
            description="Pilih paket yang paling sesuai dengan kebutuhan bisnismu. Setiap paket memiliki susunan fitur yang berbeda."
          />

          <div className="relative mt-8 md:mt-14">
            <p className="mb-3 flex items-center justify-end gap-2 text-xs font-semibold text-[#607A77] md:hidden">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#123B3A] shadow-sm">←</span>
              Geser untuk lihat paket lainnya
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#123B3A] shadow-sm">→</span>
            </p>
            <div className="pointer-events-none absolute bottom-4 right-0 top-8 z-10 w-8 bg-gradient-to-l from-[#E3F0EB] to-transparent md:hidden" />
            <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 mobile-swipe">
            {demos.map((demo) => (
              <div key={demo.name} className="group min-w-[82vw] max-w-[360px] shrink-0 md:max-w-none md:min-w-0">
                <div className={`rounded-3xl ${demo.color} p-4 transition duration-300 group-hover:-translate-y-2`}>
                  <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className={`h-3 ${demo.accent}`} />
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="h-2 w-16 rounded-full bg-[#123B3A]" />
                        <div className="h-2 w-10 rounded-full bg-[#E4EFEB]" />
                      </div>

                      {demo.name === "Basic" ? (
                        <div className="py-9 text-center">
                          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C8E3DA] text-3xl">☕</div>
                          <div className="mx-auto mt-5 h-3 w-36 rounded-full bg-[#123B3A]" />
                          <div className="mx-auto mt-3 h-2 w-24 rounded-full bg-[#E4EFEB]" />
                          <div className={`mx-auto mt-6 h-8 w-28 rounded-full ${demo.accent}`} />
                        </div>
                      ) : demo.name === "Pro" ? (
                        <div className="py-7">
                          <div className="flex h-28 items-center justify-center rounded-xl bg-[#FBE5DE] text-4xl">🥐</div>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="h-20 rounded-xl bg-[#E3F0EB]" />
                            <div className="h-20 rounded-xl bg-[#E3F0EB]" />
                          </div>
                          <div className="mt-4 h-2 w-3/4 rounded-full bg-[#123B3A]" />
                          <div className="mt-2 h-2 w-1/2 rounded-full bg-[#E4EFEB]" />
                        </div>
                      ) : (
                        <div className="py-7">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col justify-center">
                              <div className="h-3 w-full rounded-full bg-[#123B3A]" />
                              <div className="mt-3 h-2 w-4/5 rounded-full bg-[#E4EFEB]" />
                              <div className={`mt-5 h-7 w-20 rounded-full ${demo.accent}`} />
                            </div>
                            <div className="flex h-28 items-center justify-center rounded-xl bg-[#C8E3DA] text-3xl">🌿</div>
                          </div>
                          <div className="mt-5 grid grid-cols-3 gap-2">
                            <div className="h-14 rounded-lg bg-[#E3F0EB]" />
                            <div className="h-14 rounded-lg bg-[#E3F0EB]" />
                            <div className="h-14 rounded-lg bg-[#E3F0EB]" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-1 pt-5">
                  <div>
                    <h3 className="text-xl font-bold">{demo.name}</h3>
                    <p className="mt-1 text-sm text-[#607A77]">{demo.type}</p>
                    <p className="mt-2 text-sm font-bold text-[#FF6B5E]">{demo.price}</p>
                  </div>
                  <a
                    href={`/buat-website?paket=${demo.name.toLowerCase()}`}
                    className="shrink-0 rounded-full border border-[#8DBBB0] px-4 py-2.5 text-xs font-bold transition hover:bg-white"
                  >
                    Pilih →
                  </a>
                </div>
                <p className="mt-3 px-1 text-xs leading-5 text-[#607A77]">{demo.description}</p>
              </div>
            ))}
            </div>
          </div>

          <p className="mt-8 text-xs text-[#607A77]">
            Tampilan kartu di atas merupakan ilustrasi karakter desain setiap paket.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section data-reveal id="harga" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <SectionHeading
          eyebrow="Paket harga"
          title="Mulai dari gratis. Tingkatkan kapan pun kamu siap."
          description="Pilih fitur sesuai kebutuhan bisnis. Tidak perlu mengambil paket lebih besar jika belum membutuhkannya."
          centered
        />

        <div className="relative mt-8 md:mt-14">
          <p className="mb-3 flex items-center justify-end gap-2 text-xs font-semibold text-[#607A77] md:hidden">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E3F0EB] text-[#123B3A]">←</span>
            Geser untuk lihat harga lainnya
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E3F0EB] text-[#123B3A]">→</span>
          </p>
          <div className="pointer-events-none absolute bottom-6 right-0 top-8 z-10 w-8 bg-gradient-to-l from-white to-transparent md:hidden" />
          <div className="flex items-stretch gap-5 overflow-x-auto px-1 pb-6 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 mobile-swipe">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex min-w-[84vw] max-w-[380px] shrink-0 flex-col rounded-3xl border p-7 md:max-w-none md:min-w-0 ${
                pkg.style === "pro"
                  ? "border-[#FF6B5E] bg-[#123B3A] text-white shadow-[0_24px_60px_rgba(18,59,58,0.18)] md:-translate-y-3"
                  : "border-[#C9DDD6] bg-white"
              }`}
            >
              {pkg.style === "pro" && (
                <span className="mb-5 inline-flex self-start rounded-full bg-[#FF6B5E] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
                  {pkg.label}
                </span>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{pkg.name}</h3>
                {pkg.style !== "pro" && (
                  <span className="rounded-full bg-[#E3F0EB] px-3 py-1.5 text-[10px] font-bold text-[#426563]">
                    {pkg.label}
                  </span>
                )}
              </div>

              <p className={`mt-4 min-h-12 text-sm leading-6 ${pkg.style === "pro" ? "text-white/65" : "text-[#607A77]"}`}>
                {pkg.description}
              </p>

              <div className="mt-8 border-b border-current/15 pb-7">
                {pkg.style === "basic" ? (
                  <>
                    <p className="text-xs text-[#607A77]">Mulai sekarang</p>
                    <p className="mt-2 text-4xl font-bold tracking-tight">Gratis</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-current/60">Pembayaran satu kali</p>
                    <p className="mt-2 text-4xl font-bold tracking-tight">
                      <span className="mr-1 text-base font-semibold">Rp</span>
                      {pkg.price}
                    </p>
                  </>
                )}
                <p className="mt-2 text-xs text-current/60">
                  {pkg.style === "basic" ? "Tanpa biaya pembuatan" : "Sekali bayar"}
                </p>
              </div>

              <div className="flex-1 py-7">
                <p className="mb-5 text-sm font-bold">Yang kamu dapatkan:</p>
                <ul className="space-y-4">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm">
                      <span className="font-bold text-[#FF6B5E]">✓</span>
                      <span className={pkg.style === "pro" ? "text-white/80" : "text-[#426563]"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`/buat-website?paket=${pkg.name.toLowerCase()}`}
                className={`block rounded-full px-5 py-4 text-center text-sm font-bold transition hover:-translate-y-0.5 ${
                  pkg.style === "pro"
                    ? "bg-[#FF6B5E] text-white hover:bg-[#E9574D]"
                    : "bg-[#123B3A] text-white hover:bg-[#1D7771]"
                }`}
              >
                {pkg.style === "basic" ? "Mulai Gratis →" : `Pilih Paket ${pkg.name} →`}
              </a>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section data-reveal className="bg-[#C8E3DA] py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Cara kerja"
            title="Dari informasi bisnis jadi website."
            description="Prosesnya dibuat sederhana supaya kamu bisa fokus menjalankan usaha."
          />

          <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Pilih paket", "Tentukan paket yang sesuai kebutuhan bisnismu."],
              ["02", "Isi informasi", "Masukkan detail usaha dan unggah foto."],
              ["03", "Lihat preview", "Tinjau hasil website yang disusun dengan bantuan AI."],
              ["04", "Terbitkan", "Basic langsung terbit. Pro dan Premium terbit setelah pembayaran diverifikasi."],
            ].map(([number, title, description]) => (
              <div key={number} className="min-w-0 border-t border-[#6F9E95] pt-6">
                <span className="text-sm font-bold text-[#FF6B5E]">{number}</span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#607A77]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-reveal id="faq" className="mx-auto max-w-4xl px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          eyebrow="Pertanyaan umum"
          title="Masih ada yang ingin ditanyakan?"
          description="Beberapa hal yang mungkin ingin kamu ketahui sebelum membuat website."
          centered
        />

        <div className="mt-12 divide-y divide-[#C9DDD6] border-y border-[#C9DDD6]">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left font-bold marker:hidden">
                <span>{faq.q}</span>
                <span className="text-xl text-[#FF6B5E] transition group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pt-4 text-sm leading-7 text-[#607A77]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-reveal className="px-5 pb-24 sm:px-8 lg:px-10 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#123B3A] px-7 py-16 text-center text-white sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#58745B]/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#FF6B5E]/30 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB2A6]">
              Saatnya bisnis tampil lebih percaya diri
            </p>
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
              Website pertamamu bisa dimulai hari ini.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Kenalkan bisnismu lebih luas dengan website yang dibuat sesuai kebutuhan usahamu.
            </p>
            <a
              href="#harga"
              className="mt-9 inline-flex rounded-full bg-[#FF6B5E] px-8 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#E9574D]"
            >
              Lihat Paket Website →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer data-reveal className="border-t border-[#123B3A]/10 bg-[#F7F5EC]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <a href="#" className="text-2xl font-black tracking-tight">
              web<span className="text-[#FF6B5E]">UMKM</span>
            </a>
            <p className="mt-2 text-sm text-[#607A77]">
              Solusi website praktis untuk bisnis Indonesia.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm sm:items-end">
            <div className="flex gap-5 text-[#607A77]">
              <a href="#fitur" className="hover:text-[#FF6B5E]">Keunggulan</a>
              <a href="#harga" className="hover:text-[#FF6B5E]">Harga</a>
              <a href="#faq" className="hover:text-[#FF6B5E]">FAQ</a>
            </div>
            {showAdminLink && (
              <a
                href="/admin/login"
                className="text-xs text-[#607A77]/70 transition hover:text-[#FF6B5E]"
              >
                Admin
              </a>
            )}
            <p>
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
        </div>
      </footer>
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translate3d(0, 28px, 0);
          transition:
            opacity 700ms ease,
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
