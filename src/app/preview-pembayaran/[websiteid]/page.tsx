
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
  forest: {
    background: "#F5F1E8",
    primary: "#263F35",
    accent: "#D98566",
    text: "#263F35",
  },
  terracotta: {
    background: "#F6EDE2",
    primary: "#794C3B",
    accent: "#D58A68",
    text: "#794C3B",
  },
  ocean: {
    background: "#F0F5F1",
    primary: "#294B5A",
    accent: "#77A9A0",
    text: "#294B5A",
  },
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

        {/* Status pembayaran dan publikasi */}
        <div
          className={`mb-8 rounded-2xl border p-6 ${
            isPublished
              ? "border-green-300 bg-green-50"
              : "border-amber-300 bg-amber-50"
          }`}
        >
          {isPublished ? (
            <>
              <p className="font-extrabold text-green-800">
                Website Berhasil Diterbitkan!
              </p>

              <p className="mt-2 text-sm text-green-800">
                Pembayaran sudah dikonfirmasi. Website kamu sudah siap dibagikan.
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
            </>
          ) : (
            <>
              <p className="font-extrabold text-amber-800">
                Menunggu Verifikasi Pembayaran
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Terima kasih! Pembayaran kamu sedang menunggu pemeriksaan admin.
                Website akan diterbitkan otomatis setelah pembayaran dikonfirmasi.
              </p>
            </>
          )}
        </div>

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
            <span className="text-xl font-extrabold">
              {website.businessName}
            </span>

            <span className="text-xs uppercase tracking-wider">
              {website.package} website
            </span>
          </div>

          {/* Hero */}
          <section className="px-6 py-20 text-center sm:py-28">
            <p className="text-sm font-semibold opacity-70">
              Selamat datang
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold sm:text-6xl">
              {tagline}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-7 opacity-80">
              {description}
            </p>
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
          <section className="px-6 py-14 sm:px-12">
            <h2 className="text-3xl font-extrabold">
              Tentang Kami
            </h2>

            <p className="mt-5 max-w-3xl leading-8 opacity-80">
              {description}
            </p>
          </section>

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
            {website.businessName}
          </footer>
        </div>
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

