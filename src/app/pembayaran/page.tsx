
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const packagePrices = { basic: 0, pro: 75000, premium: 100000 };
const packageNames = { basic: "Basic", pro: "Pro", premium: "Premium" };

type OrderResponse = {
  success: boolean;
  message?: string;
  order?: {
    businessName: string;
    package: keyof typeof packagePrices;
    amount: number;
    websiteId?: string;
  };
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<{
    businessName: string;
    package: keyof typeof packagePrices;
    amount: number;
    websiteId?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [senderName, setSenderName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      if (!orderId) {
        setError("ID pesanan tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(orderId)}`,
          { cache: "no-store" }
        );

        const result: OrderResponse = await response.json();

        if (!response.ok || !result.success || !result.order) {
          throw new Error(result.message || "Pesanan tidak ditemukan.");
        }

        if (active) setOrder(result.order);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil pesanan."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [orderId]);

  function confirmWhatsApp() {
    if (
      !order ||
      order.package === "basic" ||
      !senderName.trim() ||
      !order.websiteId
    ) {
      alert("Data pesanan belum lengkap. Silakan muat ulang halaman.");
      return;
    }

    const message = [
      "Halo R Studio Web! Saya ingin konfirmasi pembayaran webUMKM.",
      "",
      `Nama Bisnis: ${order.businessName}`,
      `Paket: ${packageNames[order.package]}`,
      `Total Pembayaran: Rp ${order.amount.toLocaleString("id-ID")}`,
      `Metode Pembayaran: ${paymentMethod}`,
      `Nama Pengirim: ${senderName.trim()}`,
      `ID Pesanan: ${orderId}`,
      "",
      "Saya sudah melakukan pembayaran.",
      "Bukti pembayaran akan saya lampirkan di chat WhatsApp ini.",
      "",
      "Mohon bantu periksa dan konfirmasi pembayaran saya.",
      "Terima kasih!",
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/6281385916633?text=${encodeURIComponent(message)}`;

    // Buka WhatsApp di tab baru.
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Tab webUMKM otomatis berpindah ke halaman preview.
    window.location.href = `/preview-pembayaran/${encodeURIComponent(
      order.websiteId
    )}`;
  }

  if (loading) {
    return (
      <main className="p-10 text-center">
        Memuat pesanan...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-center text-red-700">
          {error || "Pesanan tidak ditemukan."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-5 py-12 text-[#263F35]">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-7 shadow-lg sm:p-10">
        <p className="text-sm font-bold uppercase tracking-widest text-[#B96D50]">
          webUMKM
        </p>

        <h1 className="mt-3 text-3xl font-extrabold">
          Selesaikan Pembayaran
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Lakukan pembayaran sesuai nominal berikut, lalu konfirmasi melalui WhatsApp.
        </p>

        <div className="mt-7 rounded-2xl bg-[#F5F1E8] p-5">
          <p className="text-sm text-gray-600">Nama bisnis</p>
          <p className="font-bold">{order.businessName}</p>

          <p className="mt-4 text-sm text-gray-600">Paket</p>
          <p className="font-bold">{packageNames[order.package]}</p>

          <p className="mt-4 text-sm text-gray-600">Total pembayaran</p>
          <p className="text-3xl font-extrabold text-[#B96D50]">
            Rp {order.amount.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold">
              Metode pembayaran
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3"
            >
              <option>Transfer Bank</option>
              <option>QRIS</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Nama pengirim pembayaran
            </label>

            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Nama sesuai rekening atau aplikasi pembayaran"
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>
        </div>

        {paymentMethod === "Transfer Bank" ? (
          <div className="mt-7 rounded-2xl border border-[#D9DCCF] bg-white p-5">
            <h2 className="text-lg font-extrabold">
              Transfer Bank BNI
            </h2>

            <p className="mt-4 text-sm text-gray-500">
              Nomor rekening
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-2xl font-extrabold tracking-wide">
                1890999019
              </p>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("1890999019");
                  alert("Nomor rekening berhasil disalin.");
                }}
                className="rounded-full bg-[#263F35] px-4 py-2 text-sm font-bold text-white"
              >
                Salin
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Atas nama
            </p>
            <p className="font-bold">
              Muhammad Rayhan Arfadiansyah
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Transfer sesuai nominal tagihan di atas. Pastikan nama penerima sudah benar sebelum melakukan transfer.
            </p>
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-[#D9DCCF] bg-white p-5">
            <h2 className="text-lg font-extrabold">
              Pembayaran QRIS
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Scan QRIS berikut menggunakan aplikasi pembayaran yang mendukung QRIS. Masukkan nominal sesuai total tagihan.
            </p>

            <div className="mt-5 flex justify-center rounded-xl bg-white p-2">
              <img
                src="/qris-rstudio.jpeg"
                alt="QRIS R Studio Web"
                className="h-auto w-full max-w-sm object-contain"
              />
            </div>

            <p className="mt-3 text-center text-sm font-semibold text-[#263F35]">
              R Studio Web
            </p>
          </div>
        )}

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">
            Wajib lampirkan bukti pembayaran
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            Setelah WhatsApp terbuka, kirim screenshot atau foto bukti transfer atau pembayaran QRIS di chat tersebut. Pastikan nominal, tanggal, dan status berhasil terlihat. Pembayaran akan diproses setelah admin memeriksanya.
          </p>
        </div>

        <button
          type="button"
          onClick={confirmWhatsApp}
          disabled={!senderName.trim()}
          className="mt-7 w-full rounded-full bg-[#263F35] px-6 py-4 font-bold text-white transition hover:bg-[#385848] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Konfirmasi Pembayaran via WhatsApp
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Website baru dipublikasikan setelah pembayaran diperiksa dan dikonfirmasi oleh admin.
        </p>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="p-10 text-center">
          Memuat halaman pembayaran...
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
