
"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = (await response.json()) as {
  message?: string;
};

if (!response.ok) {
  throw new Error(result.message || "Login gagal.");
}

window.location.href = "/admin";
      window.location.href = "/admin";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F1E8] px-5 py-12">
      <div className="w-full max-w-md">
        <a
          href="/"
          className="mb-10 block text-center text-2xl font-black tracking-tight text-[#263F35]"
        >
          web<span className="text-[#D16B4D]">UMKM</span>
        </a>

        <div className="rounded-3xl border border-[#263F35]/10 bg-white p-8 shadow-xl shadow-[#263F35]/5 sm:p-10">
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#D16B4D]">
              Administrator
            </p>

            <h1 className="text-3xl font-black tracking-tight text-[#263F35]">
              Selamat datang
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Masuk untuk mengelola pesanan dan website pelanggan webUMKM.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#263F35]"
              >
                Email admin
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#263F35] focus:ring-2 focus:ring-[#263F35]/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#263F35]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#263F35] focus:ring-2 focus:ring-[#263F35]/10"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#263F35] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#345446] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} webUMKM · R Studio Web
        </p>
      </div>
    </main>
  );
}
