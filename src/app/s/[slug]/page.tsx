
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";

type Product = {
  name?: string;
  description?: string;
  price?: string | number | null;
  image?: string;
};

type WebsiteContent = {
  category?: string;
  tagline?: string;
  description?: string;
  about?: string;
  heroBackground?: string;
  logo?: string;
  gallery?: string[];
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
  palette: string;
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

  const palettes: Record<string, { background: string; primary: string; accent: string; card: string; text: string }> = {
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
    ocean: { background: "#EDF4F5", primary: "#24566A", accent: "#4C9AAB", card: "#FFFFFF", text: "#203D49" },
    "deep-teal": { background: "#EAF5F2", primary: "#123F46", accent: "#19A7A0", card: "#FFFFFF", text: "#123F46" },
    sunset: { background: "#FFF2E8", primary: "#743B54", accent: "#F09A67", card: "#FFFFFF", text: "#743B54" },
    lavender: { background: "#F5F0FA", primary: "#51456F", accent: "#B7A5D8", card: "#FFFFFF", text: "#51456F" },
    midnight: { background: "#F2F0EA", primary: "#17243A", accent: "#D5AE68", card: "#FFFFFF", text: "#17243A" },
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
  const logo = typeof content.logo === "string" && content.logo.startsWith("data:image/") ? content.logo : "";
  const gallery = Array.isArray(content.gallery) ? content.gallery.filter((item): item is string => typeof item === "string" && item.startsWith("data:image/")) : [];
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
          <div className="flex items-center gap-3">
            {logo ? <img src={logo} alt={`Logo ${website.business_name}`} className="h-11 w-11 rounded-xl bg-white object-contain p-1" /> : <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-sm font-black">{website.business_name.slice(0, 1).toUpperCase()}</span>}
            <h1 className="text-xl font-bold tracking-tight">{website.business_name}</h1>
          </div>

          {content.category && (
            <span className="rounded-full border border-white/30 px-3 py-1 text-xs">
              {content.category}
            </span>
          )}
        </div>
      </header>

      <section
        className={`${animationClass} ${isPremium ? "px-6 py-32 text-center md:py-40" : isPro ? "px-6 py-24 text-left md:py-28" : "px-6 py-20 text-left"}`}
        style={isPremium && content.heroBackground?.startsWith("data:image/") ? { backgroundImage: `linear-gradient(90deg, rgba(10,22,27,.78), rgba(10,22,27,.35)), url(${content.heroBackground})`, backgroundSize: "cover", backgroundPosition: "center", color: "#FFFFFF" } : {}}
      >
        <div className={`${isPremium ? "mx-auto max-w-4xl" : isPro ? "mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.25fr_.75fr]" : "mx-auto max-w-5xl"}`}>
          <div>
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
          {isPro && (
            <div className="hidden rounded-3xl p-8 shadow-xl md:block" style={{ backgroundColor: colors.card }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.accent }}>Kenali lebih dekat</p>
              <h3 className="mt-3 text-2xl font-bold">{website.business_name}</h3>
              <p className="mt-3 text-sm leading-7 opacity-75">{content.about || content.description || "Temukan produk dan layanan unggulan kami."}</p>
              <div className="mt-6 h-1.5 w-20 rounded-full" style={{ backgroundColor: colors.accent }} />
            </div>
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

            <div className={`grid gap-6 ${isPremium ? "lg:grid-cols-3" : isPro ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
              {products.map((product, index) => (
                <article
                  key={`${product.name}-${index}`}
                  className={`${isPremium ? "rounded-3xl border border-black/5 p-8 shadow-xl" : isPro ? "rounded-2xl border border-black/10 p-6 shadow-md" : "rounded-xl border border-black/10 p-5"}`}
                  style={{ backgroundColor: colors.card }}
                >
                  {product.image && <img src={product.image} alt={product.name || "Foto produk"} className="mb-5 h-52 w-full rounded-2xl object-cover" />}
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

      {gallery.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Galeri Foto</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {gallery.map((image, index) => <img key={index} src={image} alt={`Galeri ${website.business_name} ${index + 1}`} className="h-48 w-full rounded-2xl object-cover sm:h-64" />)}
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

      {isPro && (content.about || content.description) && (
        <section className={`${isPremium ? "px-6 py-28" : "px-6 py-20"}`}>
          <div className={`mx-auto grid max-w-6xl gap-8 ${isPremium ? "rounded-3xl p-8 shadow-lg md:grid-cols-[.7fr_1.3fr] md:p-12" : "md:grid-cols-[.7fr_1.3fr]"}`} style={isPremium ? { backgroundColor: colors.card } : {}}>
            <div><p className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.accent }}>Cerita Kami</p><h2 className="mt-3 text-3xl font-bold">Tentang Kami</h2></div>
            <p className="text-base leading-8 opacity-80">{content.about || content.description}</p>
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

      <footer className="px-6 py-9 text-sm text-white" style={{ backgroundColor: colors.primary }}>
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><p className="text-lg font-extrabold">{website.business_name}</p><p className="mt-1 text-white/70">© {new Date().getFullYear()} {website.business_name}. Hak cipta dilindungi.</p></div>
          <p className="text-white/80">Website dibuat dengan <a href="/" className="font-bold text-white underline underline-offset-4">webUMKM</a><span className="mx-1">·</span><a href="https://wa.me/6281385916633?text=Halo%20R%20Studio%20Web%2C%20saya%20tertarik%20membuat%20website." target="_blank" rel="noopener noreferrer" className="font-bold text-white underline underline-offset-4">R Studio Web</a></p>
        </div>
      </footer>
    </main>
  );
}
