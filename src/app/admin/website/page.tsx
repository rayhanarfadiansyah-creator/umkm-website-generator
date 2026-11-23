"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../AdminSidebar";

type Website = {
  id: string; business_name: string; slug: string; package: string; palette: string;
  status: string; published_at: string | null; created_at: string;
  customer_name: string | null; customer_email: string | null;
  order_amount: number | null; order_status: string | null;
};
type ApiResponse = { success: boolean; message?: string; websites?: Website[] };

const statusLabels: Record<string, string> = {
  draft: "Draft", preview: "Preview", published: "Terbit", paused: "Dijeda",
};
const statusStyles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700", preview: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800", paused: "bg-rose-100 text-rose-800",
};

export default function WebsitePage() {
  const router = useRouter();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [adminEmail, setAdminEmail] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const [meResponse, dataResponse] = await Promise.all([
          fetch("/api/admin/me"), fetch("/api/admin/websites"),
        ]);
        if (meResponse.status === 401 || dataResponse.status === 401) {
          router.replace("/admin/login"); return;
        }
        if (meResponse.ok) {
          const me = await meResponse.json() as { admin?: { email?: string } };
          setAdminEmail(me.admin?.email || "Admin");
        }
        const data = await dataResponse.json() as ApiResponse;
        if (!dataResponse.ok || !data.success) throw new Error(data.message || "Gagal memuat website.");
        setWebsites(data.websites || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally { setLoading(false); }
    }
    load();
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return websites.filter((w) => {
      const matchesText = [w.business_name, w.slug, w.customer_name, w.customer_email]
        .some((v) => (v || "").toLowerCase().includes(q));
      return matchesText && (filter === "all" || w.status === filter);
    });
  }, [websites, search, filter]);

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#F5F1E8] md:flex">
      <AdminSidebar adminEmail={adminEmail} activePage="website" onLogout={logout} loggingOut={false} />
      <section className="min-w-0 flex-1 px-4 py-6 sm:px-5 sm:py-8 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-wider text-[#D16B4D]">Administrator</p>
          <h1 className="mt-2 text-3xl font-black text-[#263F35] md:text-4xl">Website</h1>
          <p className="mt-2 text-sm text-slate-500">Pantau website pelanggan dan status publikasinya.</p>

          <div className="my-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Total Website</p><p className="mt-2 text-3xl font-black text-[#263F35]">{websites.length}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Sudah Terbit</p><p className="mt-2 text-3xl font-black text-emerald-700">{websites.filter((w) => w.status === "published").length}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Belum Terbit</p><p className="mt-2 text-3xl font-black text-[#D16B4D]">{websites.filter((w) => w.status !== "published").length}</p></div>
          </div>

          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama usaha, slug, atau pelanggan..."
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#263F35]" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#263F35]">
              <option value="all">Semua Status</option><option value="draft">Draft</option><option value="preview">Preview</option><option value="published">Terbit</option><option value="paused">Dijeda</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 font-bold text-[#263F35]">Daftar Website</div>
            {loading ? <p className="p-10 text-center text-sm text-slate-500">Memuat website...</p>
              : error ? <p className="p-10 text-center text-sm text-red-600">{error}</p>
              : filtered.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">Belum ada website yang cocok.</p>
              : <div className="max-w-full overflow-x-auto overscroll-x-contain">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-[#F8F7F3] text-xs uppercase text-slate-500">
                      <tr><th className="px-5 py-4">Website / Usaha</th><th className="px-5 py-4">Pelanggan</th><th className="px-5 py-4">Paket</th><th className="px-5 py-4">Status Website</th><th className="px-5 py-4">Pembayaran</th><th className="px-5 py-4">Dibuat</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((w) => <tr key={w.id} className="hover:bg-[#FAFAF7]">
                        <td className="px-5 py-4"><p className="font-bold text-[#263F35]">{w.business_name}</p><p className="mt-1 font-mono text-xs text-slate-500">{w.slug}</p></td>
                        <td className="px-5 py-4"><p className="text-slate-700">{w.customer_name || "Pelanggan"}</p><p className="mt-1 text-xs text-slate-500">{w.customer_email || "—"}</p></td>
                        <td className="px-5 py-4 font-semibold capitalize text-slate-700">{w.package}</td>
                        <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[w.status] || "bg-slate-100 text-slate-700"}`}>{statusLabels[w.status] || w.status}</span></td>
                        <td className="px-5 py-4 text-slate-600">{w.order_status || "—"}</td>
                        <td className="px-5 py-4 text-slate-500">{new Date(w.created_at).toLocaleDateString("id-ID")}</td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>}
          </div>
          <p className="mt-4 text-xs text-slate-400">Pembayaran paket berbayar dikonfirmasi melalui menu Pesanan. Setelah admin mengonfirmasi, website otomatis berstatus Terbit.</p>
        </div>
      </section>
    </main>
  );
}
