
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
    <aside className="flex w-full min-w-0 flex-col border-b border-[#263F35]/10 bg-[#263F35] p-4 text-white md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:p-6">
      <div className="flex min-w-0 items-center justify-between gap-3 md:block">
        <div className="min-w-0">
          <Link href="/" className="text-2xl font-black">
            web<span className="text-[#D16B4D]">UMKM</span>
          </Link>
          <p className="mt-1 text-xs text-white/50">Administrator Panel</p>
        </div>
        <p className="max-w-[45%] truncate text-right text-[11px] text-white/50 md:hidden">{adminEmail}</p>
      </div>

      <nav className="-mx-1 mt-4 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:mt-10 md:flex-col md:gap-2 md:overflow-visible md:px-0 md:pb-0">
        {menuItems.map((item) => {
          const active = activePage === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition md:block ${
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

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3 md:mt-auto md:block md:pt-5">
        <div className="hidden min-w-0 md:block">
          <p className="truncate text-xs text-white/60">Login sebagai</p>
          <p className="mt-1 truncate text-sm font-semibold">{adminEmail}</p>
        </div>

        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="w-full rounded-xl border border-white/20 px-4 py-2.5 text-left text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50 md:mt-5 md:py-3"
        >
          {loggingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </aside>
  );
}
