"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  ageMin: number;
  ageMax: number;
  interests: string[];
  skills: string[];
  approved: number;
  createdAt: string;
  providerName: string | null;
  providerEmail: string | null;
};

const typeLabel: Record<string, string> = {
  physical: "🎁 Бэлэг",
  course: "📖 Курс",
  experience: "⭐ Туршлага",
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => {
        if (r.status === 401) throw new Error("unauthorized");
        return r.json();
      })
      .then((d) => setProducts(d.products))
      .catch((e) => setError(e.message === "unauthorized" ? "Нэвтрэх эрхгүй." : "Алдаа гарлаа."))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (productId: string, approved: number) => {
    setActionLoading(productId);
    await fetch("/api/admin/approve", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, approved }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, approved } : p))
    );
    setActionLoading(null);
  };
  
  const pending = products.filter((p) => p.approved === 0);
  const approved = products.filter((p) => p.approved === 1);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F2FA]">
      <p className="text-[#9B8EAA] italic">Уншиж байна...</p>
    </main>
  );

  if (error) return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F2FA]">
      <p className="text-[#5B3D8F]">{error}</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#7C5CBF] border border-[#7C5CBF] px-3 py-1 rounded-full">
            Admin
          </span>
          <h1 className="text-4xl font-light mt-4" style={{ fontFamily: "Georgia, serif" }}>
            Бүтээгдэхүүн хянах
          </h1>
          <p className="text-[#9B8EAA] text-sm mt-1">
            Хүлээгдэж буй: {pending.length} · Зөвшөөрсөн: {approved.length}
          </p>
        </div>

        {pending.length === 0 && (
          <div className="bg-[#FDFCFF] border border-[#E4DDF4] rounded-2xl p-8 text-center text-[#9B8EAA] mb-8">
            Хүлээгдэж буй бүтээгдэхүүн байхгүй байна.
          </div>
        )}

        {pending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-wider text-[#9B8EAA] mb-4">
              Хүлээгдэж буй ({pending.length})
            </h2>
            <div className="space-y-3">
              {pending.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  actionLoading={actionLoading}
                  onApprove={() => handleApprove(p.id, 1)}
                  onReject={() => handleApprove(p.id, -1)}
                />
              ))}
            </div>
          </section>
        )}

        {approved.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-wider text-[#9B8EAA] mb-4">
              Зөвшөөрсөн ({approved.length})
            </h2>
            <div className="space-y-3">
              {approved.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  actionLoading={actionLoading}
                  onApprove={() => handleApprove(p.id, 1)}
                  onReject={() => handleApprove(p.id, -1)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ProductCard({
  product: p,
  actionLoading,
  onApprove,
  onReject,
}: {
  product: Product;
  actionLoading: string | null;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isLoading = actionLoading === p.id;

  return (
    <div className={`bg-[#FDFCFF] border rounded-2xl p-5 transition-all ${
      p.approved === 1 ? "border-[#9B7FCC]" : p.approved === -1 ? "border-red-200 opacity-60" : "border-[#E4DDF4]"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[#9B8EAA]">{typeLabel[p.type]}</span>
            <span className="text-xs text-[#9B8EAA]">·</span>
            <span className="text-xs text-[#9B8EAA]">{p.ageMin}–{p.ageMax} нас</span>
            {p.approved === 1 && (
              <span className="text-xs bg-[#EDE5F8] text-[#5B3D8F] px-2 py-0.5 rounded-full">✓ Зөвшөөрсөн</span>
            )}
            {p.approved === -1 && (
              <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">✗ Татгалзсан</span>
            )}
          </div>
          <div className="text-lg font-medium text-[#2D1F45]" style={{ fontFamily: "Georgia, serif" }}>
            {p.name}
          </div>
          <div className="text-sm text-[#9B8EAA] mt-1">{p.description}</div>
          <div className="text-sm text-[#7C5CBF] mt-2 font-medium">{p.price.toLocaleString()}₮</div>
          {p.providerName && (
            <div className="text-xs text-[#9B8EAA] mt-2">
              Provider: {p.providerName} {p.providerEmail ? `· ${p.providerEmail}` : ""}
            </div>
          )}
        </div>

        {p.approved !== 1 && (
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={onApprove}
              disabled={isLoading}
              className="px-4 py-2 bg-[#7C5CBF] text-white rounded-xl text-sm font-semibold hover:bg-[#6B4AAF] transition-all disabled:opacity-50 shadow-sm"
            >
              {isLoading ? "..." : "Зөвшөөрөх"}
            </button>
            {p.approved !== -1 && (
              <button
                onClick={onReject}
                disabled={isLoading}
                className="px-4 py-2 border-2 border-red-200 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-50"
              >
                Татгалзах
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
