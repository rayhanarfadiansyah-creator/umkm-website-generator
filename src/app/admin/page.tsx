
"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

type Admin = {
  id: string;
  email: string;
};
type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  pendingPayments: number;
  publishedWebsites: number;
};

type Order = {
  id: string;
  package: "basic" | "pro" | "premium";
  amount: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string;
  business_name: string | null;
};


export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [statsData, setStatsData] = useState<DashboardStats>({
  totalOrders: 0,
  totalRevenue: 0,
  pendingPayments: 0,
  publishedWebsites: 0,
});
const [orders, setOrders] = useState<Order[]>([]);
const [ordersLoading, setOrdersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/admin/me");

        if (!response.ok) {
          window.location.href = "/admin/login";
          return;
        }

        const result = await response.json() as {
          admin: Admin;
        };

        setAdmin(result.admin);
        const statsResponse = await fetch("/api/admin/dashboard");

if (statsResponse.ok) {
  const statsResult = (await statsResponse.json()) as {
    stats: DashboardStats;
  };

  setStatsData(statsResult.stats);
}
const ordersResponse = await fetch("/api/admin/orders");

if (ordersResponse.ok) {
  const ordersResult = (await ordersResponse.json()) as {
    orders: Order[];
  };

  setOrders(ordersResult.orders);
}

setOrdersLoading(false);
      } catch {
        window.location.href = "/admin/login";
      } finally {
  setLoading(false);
  setOrdersLoading(false);
}
    }

    checkSession();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/admin/login";
    }
  }

  if (loading || !admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F1E8]">
        <p className="text-sm font-medium text-[#263F35]">
          Memeriksa akses admin...
        </p>
      </main>
    );
  }

  const stats = [
  {
    label: "Total Pesanan",
    value: statsData.totalOrders.toLocaleString("id-ID"),
    note: "Semua pesanan",
  },
  {
    label: "Pendapatan",
    value: `Rp${statsData.totalRevenue.toLocaleString("id-ID")}`,
    note: "Pembayaran terverifikasi",
  },
  {
    label: "Menunggu Pembayaran",
    value: statsData.pendingPayments.toLocaleString("id-ID"),
    note: "Perlu diperiksa",
  },
  {
    label: "Website Terbit",
    value: statsData.publishedWebsites.toLocaleString("id-ID"),
    note: "Website pelanggan",
  },
];

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#F5F1E8] md:flex">
      <AdminSidebar
        adminEmail={admin.email}
        activePage="dashboard"
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <section className="min-w-0 flex-1 p-4 sm:p-8 lg:p-10">
        <div className="mb-7 sm:mb-10">
          <p className="text-sm font-semibold text-[#D16B4D]">
            ADMINISTRATOR
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#263F35] sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Pantau pesanan dan kelola website pelanggan webUMKM.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-2xl border border-[#263F35]/10 bg-white p-4 sm:p-6"
            >
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                {stat.label}
              </p>

              <p className="mt-3 break-words text-xl font-black text-[#263F35] sm:mt-4 sm:text-3xl">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {stat.note}
              </p>
            </div>
          ))}
        </div>

        
      </section>
    </main>
  );
}
