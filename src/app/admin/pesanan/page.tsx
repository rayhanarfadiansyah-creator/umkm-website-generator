"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../AdminSidebar";

type OrdersResponse = { success: boolean; message?: string; orders?: Order[] };
type Order = {
  id: string;
  package: "basic" | "pro" | "premium";
  amount: number;
  status: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_whatsapp: string | null;
  business_name: string | null;
};

const packageNames: Record<string, string> = {
  basic: "Basic", pro: "Pro", premium: "Premium",
};
const statusNames: Record<string, string> = {
  draft: "Draft", pending_payment: "Menunggu Pembayaran",
  paid: "Sudah Dibayar", cancelled: "Dibatalkan", refunded: "Dikembalikan",
};
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(amount);
}
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function PesananPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  async function loadOrders() {
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await response.json() as OrdersResponse;
      if (!response.ok || !data.success) throw new Error(data.message || "Gagal mengambil pesanan.");
      setOrders(data.orders || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil pesanan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadOrders(); }, [router]);

  async function confirmPayment(order: Order) {
    const approved = window.confirm(
      `Pastikan dana Rp ${order.amount.toLocaleString("id-ID")} sudah benar-benar masuk.\n\nKonfirmasi pembayaran untuk ${order.business_name || order.id}?`
    );
    if (!approved) return;

    setConfirmingId(order.id);
    setActionMessage("");
    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(order.id)}/confirm`, {
        method: "POST",
      });
      const data = await response.json() as { success: boolean; message?: string };
      if (!response.ok || !data.success) throw new Error(data.message || "Gagal mengonfirmasi pembayaran.");
      setActionMessage("Pembayaran berhasil dikonfirmasi.");
      await loadOrders();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setConfirmingId(null);
    }
  }

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      (order.business_name || "").toLowerCase().includes(keyword) ||
      (order.customer_name || "").toLowerCase().includes(keyword) ||
      order.id.toLowerCase().includes(keyword);
    return matchesSearch && (filter === "all" || order.status === filter);
  });

  return (
    <main className="min-h-screen bg-[#F5F1E8] md:flex">
      <AdminSidebar
        adminEmail="arfarayhan21@gmail.com"
        activePage="pesanan"
        onLogout={async () => {
          await fetch("/api/admin/logout", { method: "POST" });
          window.location.href = "/admin/login";
        }}
        loggingOut={false}
      />
      <section className="min-w-0 flex-1 px-5 py-8 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#D16B4D]">Administrator</p>
            <h1 className="text-3xl font-extrabold text-[#263F35] md:text-4xl">Pesanan</h1>
            <p className="mt-2 text-sm text-slate-500">Pantau pesanan dan konfirmasi pembayaran setelah dana benar-benar diterima.</p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Total Pesanan</p>
              <p className="mt-2 text-3xl font-extrabold text-[#263F35]">{orders.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Menunggu Pembayaran</p>
              <p className="mt-2 text-3xl font-extrabold text-[#D16B4D]">{orders.filter((o) => o.status === "pending_payment").length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Sudah Dibayar</p>
              <p className="mt-2 text-3xl font-extrabold text-[#263F35]">{orders.filter((o) => o.status === "paid").length}</p>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama usaha, pelanggan, atau ID pesanan..."
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#263F35]" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#263F35]">
              <option value="all">Semua Status</option>
              <option value="pending_payment">Menunggu Pembayaran</option>
              <option value="paid">Sudah Dibayar</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Dibatalkan</option>
              <option value="refunded">Dikembalikan</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-[#263F35]">Daftar Pesanan</h2>
              <span className="text-xs text-slate-400">{filteredOrders.length} pesanan</span>
            </div>
            {actionMessage && <p className="border-b border-slate-100 px-5 py-3 text-sm text-[#263F35]">{actionMessage}</p>}
            {loading ? <div className="p-10 text-center text-sm text-slate-500">Memuat data pesanan...</div>
              : error ? <div className="p-10 text-center text-sm text-red-600">{error}</div>
              : filteredOrders.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">Belum ada pesanan yang cocok.</div>
              : <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] text-left text-sm">
                    <thead className="bg-[#F8F7F3] text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Pelanggan / Usaha</th>
                        <th className="px-5 py-4">Paket</th>
                        <th className="px-5 py-4">Total</th>
                        <th className="px-5 py-4">Tanggal</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">ID Pesanan</th>
                        <th className="px-5 py-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#FAFAF7]">
                          <td className="px-5 py-4">
                            <p className="font-bold text-[#263F35]">{order.business_name || "Nama usaha belum tersedia"}</p>
                            <p className="mt-1 text-xs text-slate-500">{order.customer_name || order.customer_email || "Pelanggan"}</p>
                            {order.customer_whatsapp && <p className="mt-1 text-xs text-slate-400">{order.customer_whatsapp}</p>}
                          </td>
                          <td className="px-5 py-4 font-medium text-slate-700">{packageNames[order.package] || order.package}</td>
                          <td className="px-5 py-4 font-bold text-[#263F35]">{formatRupiah(order.amount)}</td>
                          <td className="px-5 py-4 text-slate-500">{formatDate(order.created_at)}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${order.status === "paid" ? "bg-emerald-100 text-emerald-800" : order.status === "pending_payment" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>
                              {statusNames[order.status] || order.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-xs text-slate-500">{order.id.slice(0, 8)}...</td>
                          <td className="px-5 py-4">
                            {order.status === "pending_payment" ? (
                              <button type="button" onClick={() => void confirmPayment(order)}
                                disabled={confirmingId !== null}
                                className="whitespace-nowrap rounded-lg bg-[#263F35] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#385848] disabled:cursor-not-allowed disabled:opacity-50">
                                {confirmingId === order.id ? "Memproses..." : "Konfirmasi Pembayaran"}
                              </button>
                            ) : order.status === "paid" ? (
                              <span className="text-xs font-semibold text-emerald-700">Terkonfirmasi</span>
                            ) : <span className="text-xs text-slate-400">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>}
          </div>
        </div>
      </section>
    </main>
  );
}
