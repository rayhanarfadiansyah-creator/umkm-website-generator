
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";

type Product = {
  name?: string;
  description?: string;
  price?: string | number | null;
};

type WebsiteContent = {
  category?: string;
  tagline?: string;
  description?: string;
  whatsapp?: string;
  email?: string;
  products?: Product[];
  advantages?: string;
  testimonials?: string;
  animationStyle?: string;
  address?: string;
  mapsUrl?: string;
  openingHours?: string;
  directions?: string;
};

type Website = {
  id: string;
  business_name: string;
  package: "basic" | "pro" | "premium";
  palette: "forest" | "terracotta" | "ocean";
  status: string;
  content_json: string;
};

function safeHttpUrl(value?: string) {
  try {
    const url = new URL(value || "");
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

function getLines(value?: string) {
  return (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function PublicWebsitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();

  const website = await db
    .prepare(
      `SELECT id, business_name, package, palette, status, content_json
       FROM websites
       WHERE slug = ?
       LIMIT 1`
    )
    .bind(slug)
    .first<Website>();

  if (!website || website.status !== "published") {
    notFound();
  }

  let content: WebsiteContent = {};

  try {
    content = JSON.parse(website.content_json || "{}");
  } catch {
    content = {};
  }

  const isPro =
    website.package === "pro" || website.package === "premium";
  const isPremium = website.package === "premium";

  const palettes = {
    forest: {
      background: "#F5F1E8",
      primary: "#263F35",
      accent: "#D16B4D",
      card: "#FFFFFF",
      text: "#263F35",
    },
    terracotta: {
      background: "#FAF0E9",
      primary: "#9D4934",
      accent: "#D16B4D",
      card: "#FFFFFF",
      text: "#492C25",
    },
    ocean: {
      background: "#EDF4F5",
      primary: "#24566A",
      accent: "#4C9AAB",
      card: "#FFFFFF",
      text: "#203D49",
    },
  };

  const colors = palettes[website.palette] || palettes.forest;

  const whatsappNumber = (content.whatsapp || "").replace(/\D/g, "");
  const normalizedWhatsapp = whatsappNumber.startsWith("0")
    ? `62${whatsappNumber.slice(1)}`
    : whatsappNumber;

  const whatsappUrl = normalizedWhatsapp
    ? `https://wa.me/${normalizedWhatsapp}`
    : "";

  const mapsUrl = safeHttpUrl(content.mapsUrl);
  const products = Array.isArray(content.products)
    ? content.products.filter(
        (product) => product && typeof product.name === "string" && product.name.trim()
      )
    : [];

  const advantages = getLines(content.advantages);
  const testimonials = getLines(content.testimonials);

  const animationClass =
    content.animationStyle === "none" ? "" : "animate-fade-up";

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <header
        className="px-6 py-5"
        style={{ backgroundColor: colors.primary, color: "#FFFFFF" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-tight">
            {website.business_name}
          </h1>

          {content.category && (
            <span className="rounded-full border border-white/30 px-3 py-1 text-xs">
              {content.category}
            </span>
          )}
        </div>
      </header>

      <section className={`px-6 py-24 text-center ${animationClass}`}>
        <div className="mx-auto max-w-3xl">
          <p
            className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: colors.accent }}
          >
            {website.business_name}
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            {content.tagline || website.business_name}
          </h2>

          {content.description && (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 opacity-80 md:text-lg">
              {content.description}
            </p>
          )}

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full px-8 py-4 font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: colors.accent }}
            >
              Hubungi Kami via WhatsApp
            </a>
          )}
        </div>
      </section>

      {products.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: colors.accent }}
              >
                Pilihan Kami
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                Produk & Layanan
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <article
                  key={`${product.name}-${index}`}
                  className="rounded-2xl p-6 shadow-sm"
                  style={{ backgroundColor: colors.card }}
                >
                  <h3 className="text-xl font-bold">{product.name}</h3>

                  {product.description && (
                    <p className="mt-3 text-sm leading-7 opacity-75">
                      {product.description}
                    </p>
                  )}

                  {isPro && product.price != null && String(product.price).trim() !== "" && (
                    <p
                      className="mt-5 text-lg font-bold"
                      style={{ color: colors.accent }}
                    >
                      Rp{Number(product.price).toLocaleString("id-ID")}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {isPro && advantages.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Kenapa Memilih Kami?
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {advantages.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 shadow-sm"
                  style={{ backgroundColor: colors.card }}
                >
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isPro && testimonials.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Testimoni Pelanggan
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {testimonials.map((item, index) => (
                <blockquote
                  key={index}
                  className="rounded-2xl p-6 shadow-sm"
                  style={{ backgroundColor: colors.card }}
                >
                  <p className="leading-8">“{item}”</p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {isPremium && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Informasi Lokasi
            </h2>

            <div
              className="grid gap-6 rounded-3xl p-8 shadow-sm md:grid-cols-2"
              style={{ backgroundColor: colors.card }}
            >
              {content.address && (
                <div>
                  <h3 className="font-bold">Alamat</h3>
                  <p className="mt-2 leading-7 opacity-80">
                    {content.address}
                  </p>
                </div>
              )}

              {content.openingHours && (
                <div>
                  <h3 className="font-bold">Jam Operasional</h3>
                  <p className="mt-2 leading-7 opacity-80">
                    {content.openingHours}
                  </p>
                </div>
              )}

              {content.directions && (
                <div>
                  <h3 className="font-bold">Petunjuk Arah</h3>
                  <p className="mt-2 leading-7 opacity-80">
                    {content.directions}
                  </p>
                </div>
              )}

              {mapsUrl && (
                <div className="flex items-center">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full px-6 py-3 font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Buka Lokasi di Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section
        className="px-6 py-16 text-center"
        style={{ backgroundColor: colors.primary, color: "#FFFFFF" }}
      >
        <h2 className="text-3xl font-bold">Tertarik dengan Kami?</h2>
        <p className="mt-3 opacity-80">
          Hubungi kami untuk informasi lebih lanjut.
        </p>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex rounded-full px-8 py-4 font-semibold"
            style={{
              backgroundColor: colors.accent,
              color: "#FFFFFF",
            }}
          >
            Hubungi Sekarang
          </a>
        )}

        {content.email && (
          <p className="mt-5 text-sm opacity-80">
            Email: {content.email}
          </p>
        )}
      </section>

      <footer
        className="px-6 py-6 text-center text-sm"
        style={{ backgroundColor: colors.background }}
      >
        © {new Date().getFullYear()} {website.business_name}. All rights reserved.
      </footer>
    </main>
  );
}
