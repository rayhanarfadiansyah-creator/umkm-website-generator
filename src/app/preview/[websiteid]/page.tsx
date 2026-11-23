
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type PreviewWebsite = {
  id: string;
  businessName: string;
  package: "basic" | "pro" | "premium";
  palette: string;
  orderId: string;
  status: string;
  slug: string;
  publishedAt: string | null;
  content: Record<string, unknown>;
};

type PreviewResponse = {
  success: boolean;
  message?: string;
  website?: PreviewWebsite;
};

type Product = {
  name?: string;
  price?: number | string | null;
  description?: string;
  image?: string;
};

const palettes: Record<
  string,
  {
    background: string;
    primary: string;
    accent: string;
    text: string;
  }
> = {
  forest: { background: "#F5F1E8", primary: "#263F35", accent: "#D98566", text: "#263F35" },
  terracotta: { background: "#F6EDE2", primary: "#794C3B", accent: "#D58A68", text: "#794C3B" },
  ocean: { background: "#F0F5F1", primary: "#294B5A", accent: "#77A9A0", text: "#294B5A" },
  "deep-teal": { background: "#EAF5F2", primary: "#123F46", accent: "#19A7A0", text: "#123F46" },
  sunset: { background: "#FFF2E8", primary: "#743B54", accent: "#F09A67", text: "#743B54" },
  lavender: { background: "#F5F0FA", primary: "#51456F", accent: "#B7A5D8", text: "#51456F" },
  midnight: { background: "#F2F0EA", primary: "#17243A", accent: "#D5AE68", text: "#17243A" },
};

export default function PreviewPage() {
  const params = useParams<{ websiteid: string }>();
  const websiteId = params.websiteid;

  const [website, setWebsite] = useState<PreviewWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPreview() {
      try {
        const response = await fetch(
          `/api/websites/${encodeURIComponent(websiteId)}/preview`,
          {
            method: "GET",
            cache: "no-store",
            credentials: "same-origin",
          }
        );

        const result: PreviewResponse = await response.json();

        if (!response.ok || !result.success || !result.website) {
          throw new Error(result.message || "Preview tidak dapat diakses.");
        }

        if (active) {
          setWebsite(result.website);
          setErrorMessage("");
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat membuka preview."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPreview();

    const interval = window.setInterval(loadPreview, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [websiteId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F1E8] px-5 text-[#263F35]">
        <p className="font-semibold">
          Menyiapkan preview website kamu...
        </p>
      </main>
    );
  }

  if (!website) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F1E8] px-5 text-center text-[#263F35]">
        <h1 className="text-3xl font-extrabold">
          Preview tidak tersedia
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#68736A]">
          {errorMessage ||
            "Tautan preview tidak valid atau sudah kedaluwarsa."}
        </p>

        <a
          href="/"
          className="mt-6 rounded-full bg-[#263F35] px-6 py-3 font-bold text-white"
        >
          Kembali ke webUMKM
        </a>
      </main>
    );
  }

  const content = website.content;
  const palette = palettes[website.palette] || palettes.forest;

  const description =
    typeof content.description === "string"
      ? content.description
      : "Informasi bisnis akan ditampilkan di sini.";

  const tagline =
    typeof content.tagline === "string"
      ? content.tagline
      : "Selamat datang di website kami.";

  const about = typeof content.about === "string" && content.about.trim()
    ? content.about
    : description;
  const logo = typeof content.logo === "string" && content.logo.startsWith("data:image/") ? content.logo : "";
  const gallery = Array.isArray(content.gallery) ? content.gallery.filter((item): item is string => typeof item === "string" && item.startsWith("data:image/")) : [];
  const heroBackground = typeof content.heroBackground === "string" && content.heroBackground.startsWith("data:image/")
    ? content.heroBackground
    : "";

  const products: Product[] = Array.isArray(content.products)
    ? (content.products as Product[])
    : [];

  const advantages =
    typeof content.advantages === "string"
      ? content.advantages.split("\n").filter((item) => item.trim())
      : [];

  const testimonials =
    typeof content.testimonials === "string"
      ? content.testimonials.split("\n").filter((item) => item.trim())
      : [];

  const address =
    typeof content.address === "string" ? content.address : "";

  const openingHours =
    typeof content.openingHours === "string"
      ? content.openingHours
      : "";

  const directions =
    typeof content.directions === "string"
      ? content.directions
      : "";

  const mapsUrl =
    typeof content.mapsUrl === "string" &&
    /^https?:\/\//i.test(content.mapsUrl)
      ? content.mapsUrl
      : "";

  const whatsapp =
    typeof content.whatsapp === "string"
      ? content.whatsapp
      : "";

  const email =
    typeof content.email === "string"
      ? content.email
      : "";

  const isProOrPremium =
    website.package === "pro" ||
    website.package === "premium";

  const isPremium = website.package === "premium";
  const isPublished = website.status === "published";

  const publicUrl = website.slug
    ? `${window.location.origin}/s/${encodeURIComponent(website.slug)}`
    : "";

  const whatsappNumber = whatsapp.replace(/\D/g, "");

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "";

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#263F35]">
      <header className="sticky top-0 z-40 border-b border-[#263F35]/10 bg-[#F5F1E8]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <a
            href="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            web<span className="text-[#B96D50]">UMKM</span>
          </a>

          <span className="text-sm font-semibold">
            Preview Website
          </span>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-10">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B96D50]">
            Website kamu
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            Preview {website.businessName}
          </h1>

          <p className="mt-2 text-sm text-[#68736A]">
            Periksa tampilan website kamu.
          </p>
        </div>

        {/* Status publikasi Preview 1 */}
{isPublished && (
  <div className="mb-8 rounded-2xl border border-green-300 bg-green-50 p-6">
    <p className="font-extrabold text-green-800">
      Website Berhasil Diterbitkan!
    </p>

    <p className="mt-2 text-sm text-green-800">
      Website kamu sudah siap dibagikan.
    </p>

    {publicUrl && (
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#263F35] px-6 py-3 text-center font-bold text-white"
        >
          Buka Website →
        </a>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(publicUrl);
            alert("URL website berhasil disalin.");
          }}
          className="rounded-full border border-green-700 px-6 py-3 font-bold text-green-800"
        >
          Salin URL Website
        </button>
      </div>
    )}
  </div>
)}

        {/* Tampilan website pelanggan */}
        <div
          className="overflow-hidden rounded-2xl border border-[#D9DCCF] bg-white shadow-xl"
          style={{
            backgroundColor: palette.background,
            color: palette.text,
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-5"
            style={{
              backgroundColor: palette.primary,
              color: "white",
            }}
          >
            <div className="flex min-w-0 items-center gap-3">
              {logo ? <img src={logo} alt={`Logo ${website.businessName}`} className="h-11 w-11 rounded-lg bg-white object-contain p-1" /> : null}
              <span className="text-xl font-extrabold">{website.businessName}</span>
            </div>

            <span className="text-xs uppercase tracking-wider">
              {website.package} website
            </span>
          </div>

          {/* Hero */}
          <section
            className={`relative overflow-hidden px-6 py-20 sm:px-12 sm:py-28 ${website.package === "basic" ? "text-left" : website.package === "pro" ? "text-left sm:py-24" : "text-center sm:py-32"}`}
            style={heroBackground && isPremium ? { backgroundImage: `linear-gradient(90deg, rgba(12,25,28,.78), rgba(12,25,28,.38)), url(${heroBackground})`, backgroundSize: "cover", backgroundPosition: "center", color: "white" } : {}}
          >
            {website.package === "premium" && <p className="text-xs font-bold uppercase tracking-[0.22em] opacity-75">Selamat datang di</p>}
            <h2 className={`mt-4 max-w-3xl text-4xl font-extrabold sm:text-6xl ${website.package === "premium" ? "mx-auto" : ""}`}>
              {tagline}
            </h2>
            <p className={`mt-6 max-w-2xl leading-7 opacity-80 ${website.package === "premium" ? "mx-auto" : ""}`}>
              {description}
            </p>
            {website.package !== "basic" && whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full px-7 py-3 font-bold" style={{ backgroundColor: palette.accent, color: "white" }}>Hubungi Kami</a>}
          </section>

          {/* Produk dan layanan */}
          {products.some((product) => product.name?.trim()) && (
            <section className="px-6 py-14 sm:px-12">
              <h2 className="text-3xl font-extrabold">
                Produk & Layanan
              </h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products
                  .filter((product) => product.name?.trim())
                  .map((product, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
                    >
                      {product.image && <img src={product.image} alt={product.name || "Foto produk"} className="mb-4 h-48 w-full rounded-xl object-cover" />}
                      <h3 className="text-xl font-bold text-[#263F35]">
                        {product.name}
                      </h3>

                      {product.price !== null &&
                        product.price !== undefined &&
                        product.price !== "" && (
                          <p className="mt-3 font-bold text-[#D16B4D]">
                            Rp{" "}
                            {Number(product.price).toLocaleString("id-ID")}
                          </p>
                        )}

                      {product.description && (
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          {product.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {gallery.length > 0 && (
            <section className="bg-white px-6 py-14 sm:px-12">
              <h2 className="text-3xl font-extrabold">Galeri Foto</h2>
              <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {gallery.map((image, index) => <img key={index} src={image} alt={`Galeri bisnis ${index + 1}`} className="h-44 w-full rounded-xl object-cover sm:h-56" />)}
              </div>
            </section>
          )}

          {/* Keunggulan Pro dan Premium */}
          {isProOrPremium && advantages.length > 0 && (
            <section className="bg-white px-6 py-14 sm:px-12">
              <h2 className="text-3xl font-extrabold">
                Mengapa Memilih Kami?
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {advantages.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-black/10 p-5"
                  >
                    <span className="font-bold text-[#D16B4D]">
                      ✓
                    </span>

                    <p className="leading-7">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimoni Pro dan Premium */}
          {isProOrPremium && testimonials.length > 0 && (
            <section className="px-6 py-14 sm:px-12">
              <h2 className="text-3xl font-extrabold">
                Apa Kata Pelanggan?
              </h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {testimonials.map((item, index) => (
                  <blockquote
                    key={index}
                    className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
                  >
                    <p className="leading-7 text-gray-700">
                      “{item}”
                    </p>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {/* Tentang Kami */}
          {isProOrPremium && about.trim() && (
          <section className="px-6 py-14 sm:px-12">
            <h2 className="text-3xl font-extrabold">
              Tentang Kami
            </h2>

            <p className="mt-5 max-w-3xl leading-8 opacity-80">
              {about}
            </p>
          </section>
          )}

          {/* Lokasi Premium */}
          {isPremium && (
            <section className="bg-white px-6 py-14 sm:px-12">
              <h2 className="text-3xl font-extrabold">
                Kunjungi Lokasi Kami
              </h2>

              {address && (
                <div className="mt-6">
                  <h3 className="font-bold">Alamat</h3>
                  <p className="mt-2 leading-7 text-gray-600">
                    {address}
                  </p>
                </div>
              )}

              {openingHours && (
                <div className="mt-5">
                  <h3 className="font-bold">Jam Operasional</h3>
                  <p className="mt-2 leading-7 text-gray-600">
                    {openingHours}
                  </p>
                </div>
              )}

              {directions && (
                <div className="mt-5">
                  <h3 className="font-bold">Petunjuk Arah</h3>
                  <p className="mt-2 leading-7 text-gray-600">
                    {directions}
                  </p>
                </div>
              )}

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-full bg-[#263F35] px-6 py-3 font-bold text-white transition hover:bg-[#365747]"
                >
                  Buka Google Maps →
                </a>
              )}
            </section>
          )}

          {/* Kontak */}
          <section
            className="px-6 py-14 sm:px-12"
            style={{
              backgroundColor: palette.primary,
              color: "white",
            }}
          >
            <h2 className="text-3xl font-extrabold">
              Hubungi Kami
            </h2>

            {whatsapp && (
              <p className="mt-4">
                WhatsApp: {whatsapp}
              </p>
            )}

            {email && (
              <p className="mt-2">
                Email: {email}
              </p>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-bold text-[#263F35] transition hover:bg-gray-100"
              >
                Chat WhatsApp →
              </a>
            )}
          </section>

          <footer
            className="px-6 py-8 text-center text-sm"
            style={{
              backgroundColor: palette.accent,
              color: "#263F35",
            }}
          >
            <div className="font-bold">{website.businessName}</div>
            <div className="mt-2 text-xs opacity-80">Website dibuat dengan webUMKM · R Studio Web</div>
          </footer>
        </div>

        {/* Tombol pembayaran */}
        {!isPublished && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                if (!website.orderId) {
                  alert("ID pesanan tidak ditemukan.");
                  return;
                }

                window.location.href = `/pembayaran?orderId=${encodeURIComponent(
                  website.orderId
                )}`;
              }}
              className="w-full rounded-full bg-[#D98566] px-6 py-4 font-bold text-white transition hover:bg-[#c87557]"
            >
              Lanjut Pembayaran dan Luncurkan Website →
            </button>

            <p className="mt-4 text-center text-xs text-[#68736A]">
              Website akan diterbitkan setelah pembayaran diverifikasi admin.
            </p>
          </div>
        )}
      </section>

      {/* Footer webUMKM */}
      <footer className="bg-[#263F35] px-5 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row">
          <div>
            <p className="text-xl font-extrabold">
              webUMKM
            </p>

            <p className="mt-2 text-sm text-white/70">
              Website profesional untuk UMKM Indonesia.
            </p>
          </div>

          <p className="text-sm">
            Website by{" "}
            <a
              href="https://wa.me/6281385916633?text=Halo%20R%20Studio%20Web%2C%20saya%20tertarik%20membuat%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white underline"
            >
              R Studio Web ↗
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
