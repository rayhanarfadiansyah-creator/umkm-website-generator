"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../AdminSidebar";

type Customer = {
  id: string;
  name: string | null;
  email: string | null;
  whatsapp: string | null;
  created_at: string;
  total_orders: number;
  total_websites: number;
};
type ApiResponse = { success: boolean; message?: string; customers?: Customer[] };

export default function PelangganPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [adminEmail, setAdminEmail] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [meResponse, dataResponse] = await Promise.all([
          fetch("/api/admin/me"),
          fetch("/api/admin/customers"),
        ]);
        if (meResponse.status === 401 || dataResponse.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (meResponse.ok) {
          const me = await meResponse.json() as { admin?: { email?: string } };
          setAdminEmail(me.admin?.email || "Admin");
        }
        const data = await dataResponse.json() as ApiResponse;
        if (!dataResponse.ok || !data.success) throw new Error(data.message || "Gagal memuat pelanggan.");
        setCustomers(data.customers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((c) =>
      [c.name, c.email, c.whatsapp].some((v) => (v || "").toLowerCase().includes(q))
    );
  }, [customers, search]);

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#F5F1E8] md:flex">
      <AdminSidebar adminEmail={adminEmail} activePage="pelanggan" onLogout={logout} loggingOut={false} />
      <section className="min-w-0 flex-1 px-4 py-6 sm:px-5 sm:py-8 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-wider text-[#D16B4D]">Administrator</p>
          <h1 className="mt-2 text-3xl font-black text-[#263F35] md:text-4xl">Pelanggan</h1>
          <p className="mt-2 text-sm text-slate-500">Kelola data pelanggan yang pernah membuat pesanan di webUMKM.</p>

          <div className="my-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Total Pelanggan</p>
              <p className="mt-2 text-3xl font-black text-[#263F35]">{customers.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Hasil Pencarian</p>
              <p className="mt-2 text-3xl font-black text-[#263F35]">{filtered.length}</p>
            </div>
          </div>

          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau WhatsApp..."
            className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#263F35]" />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 font-bold text-[#263F35]">Daftar Pelanggan</div>
            {loading ? <p className="p-10 text-center text-sm text-slate-500">Memuat pelanggan...</p>
              : error ? <p className="p-10 text-center text-sm text-red-600">{error}</p>
              : filtered.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">Belum ada pelanggan yang cocok.</p>
              : <div className="max-w-full overflow-x-auto overscroll-x-contain">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-[#F8F7F3] text-xs uppercase text-slate-500">
                      <tr><th className="px-5 py-4">Pelanggan</th><th className="px-5 py-4">WhatsApp</th><th className="px-5 py-4">Total Pesanan</th><th className="px-5 py-4">Website</th><th className="px-5 py-4">Terdaftar</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((c) => <tr key={c.id} className="hover:bg-[#FAFAF7]">
                        <td className="px-5 py-4"><p className="font-bold text-[#263F35]">{c.name || "Nama belum tersedia"}</p><p className="mt-1 text-xs text-slate-500">{c.email || "Email belum tersedia"}</p></td>
                        <td className="px-5 py-4 text-slate-600">{c.whatsapp || "—"}</td>
                        <td className="px-5 py-4 font-semibold text-[#263F35]">{Number(c.total_orders || 0)}</td>
                        <td className="px-5 py-4 font-semibold text-[#263F35]">{Number(c.total_websites || 0)}</td>
                        <td className="px-5 py-4 text-slate-500">{new Date(c.created_at).toLocaleDateString("id-ID")}</td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>}
          </div>
        </div>
      </section>
    </main>
  );
}
