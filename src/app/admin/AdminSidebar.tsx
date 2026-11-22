
"use client";

import Link from "next/link";

type AdminSidebarProps = {
  adminEmail: string;
  activePage: "dashboard" | "pesanan" | "pelanggan" | "website";
  onLogout: () => void;
  loggingOut: boolean;
};

const menuItems = [
  { label: "Dashboard", href: "/admin", key: "dashboard" },
  { label: "Pesanan", href: "/admin/pesanan", key: "pesanan" },
  { label: "Pelanggan", href: "/admin/pelanggan", key: "pelanggan" },
  { label: "Website", href: "/admin/website", key: "website" },
] as const;

export default function AdminSidebar({
  adminEmail,
  activePage,
  onLogout,
  loggingOut,
}: AdminSidebarProps) {
  return (
    <aside className="flex min-h-screen flex-col border-b border-[#263F35]/10 bg-[#263F35] p-6 text-white md:w-64 md:shrink-0 md:border-b-0">
      <Link href="/" className="text-2xl font-black">
        web<span className="text-[#D16B4D]">UMKM</span>
      </Link>

      <p className="mt-2 text-xs text-white/50">
        Administrator Panel
      </p>

      <nav className="mt-10 space-y-2">
        {menuItems.map((item) => {
          const active = activePage === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-white/10 pt-5 md:mt-auto">
        <p className="truncate text-xs text-white/60">
          Login sebagai
        </p>

        <p className="mt-1 truncate text-sm font-semibold">
          {adminEmail}
        </p>

        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="mt-5 w-full rounded-xl border border-white/20 px-4 py-3 text-left text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50"
        >
          {loggingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </aside>
  );
}
