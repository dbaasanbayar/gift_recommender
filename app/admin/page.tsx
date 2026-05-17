"use client";

import { useEffect, useState } from "react";

type Provider = {
  id: string;
  businessName: string;
  email: string;
  phone: string | null;
  description: string | null;
  approved: number;
  createdAt: string;
};

type Product = {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  ageMin: number;
  ageMax: number;
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
  const [tab, setTab] = useState<"providers" | "products">("providers");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/providers").then((r) => {
        if (r.status === 401) throw new Error("unauthorized");
        return r.json();
      }),
      fetch("/api/admin/products").then((r) => r.json()),
    ])
      .then(([pd, pr]) => {
        setProviders(pd.providers);
        setProducts(pr.products);
      })
      .catch((e) => setError(e.message === "unauthorized" ? "Нэвтрэх эрхгүй." : "Алдаа гарлаа."))
      .finally(() => setLoading(false));
  }, []);

  const handleProviderAction = async (providerId: string, approved: number) => {
    setActionLoading(providerId);
    await fetch("/api/admin/approve-provider", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, approved }),
    });
    setProviders((prev) => prev.map((p) => p.id === providerId ? { ...p, approved } : p));
    setActionLoading(null);
  };

  const handleProductAction = async (productId: string, approved: number) => {
    setActionLoading(productId);
    await fetch("/api/admin/approve", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, approved }),
    });
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, approved } : p));
    setActionLoading(null);
  };

  const pendingProviders = providers.filter((p) => p.approved === 0);
  const approvedProviders = providers.filter((p) => p.approved === 1);
  const pendingProducts = products.filter((p) => p.approved === 0);
  const approvedProducts = products.filter((p) => p.approved === 1);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <p className="text-[#9B8EAA] italic">Уншиж байна...</p>
    </main>
  );

  if (error) return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <p className="text-[#5B3D8F]">{error}</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#7C5CBF] border-2 border-[#7C5CBF] px-3 py-1 rounded-full font-medium">
            Admin
          </span>
          <h1 className="text-4xl font-light mt-4" style={{ fontFamily: "Georgia, serif" }}>
            Хянах самбар
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("providers")}
            className={`px-5 py-2 rounded-full border-2 text-sm font-semibold transition-all ${
              tab === "providers"
                ? "bg-[#7C5CBF] border-[#7C5CBF] text-white"
                : "border-[#E4DDF4] text-[#9B8EAA] hover:border-[#7C5CBF] hover:text-[#7C5CBF]"
            }`}>
            🏪 Бизнесүүд
            {pendingProviders.length > 0 && (
              <span className="ml-2 bg-white text-[#7C5CBF] text-xs px-1.5 py-0.5 rounded-full font-bold">
                {pendingProviders.length}
              </span>
            )}
          </button>
          <button onClick={() => setTab("products")}
            className={`px-5 py-2 rounded-full border-2 text-sm font-semibold transition-all ${
              tab === "products"
                ? "bg-[#9B7FCC] border-[#9B7FCC] text-white"
                : "border-[#E4DDF4] text-[#9B8EAA] hover:border-[#9B7FCC] hover:text-[#9B7FCC]"
            }`}>
            🎁 Бүтээгдэхүүнүүд
            {pendingProducts.length > 0 && (
              <span className="ml-2 bg-white text-[#9B7FCC] text-xs px-1.5 py-0.5 rounded-full font-bold">
                {pendingProducts.length}
              </span>
            )}
          </button>
        </div>

        {/* Providers tab */}
        {tab === "providers" && (
          <div>
            <p className="text-xs text-[#9B8EAA] mb-4">
              Хүлээгдэж буй: {pendingProviders.length} · Зөвшөөрсөн: {approvedProviders.length}
            </p>
            {pendingProviders.length === 0 && (
              <div className="bg-[#FDFCFF] border border-[#E4DDF4] rounded-2xl p-8 text-center text-[#9B8EAA] mb-4">
                Хүлээгдэж буй бизнес байхгүй.
              </div>
            )}
            <div className="space-y-3">
              {[...pendingProviders, ...approvedProviders].map((p) => (
                <div key={p.id} className={`bg-[#FDFCFF] border-2 rounded-2xl p-5 transition-all ${
                  p.approved === 1 ? "border-[#9B7FCC]" : p.approved === -1 ? "border-red-200 opacity-60" : "border-[#E4DDF4]"
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {p.approved === 1 && <span className="text-xs bg-[#EDE5F8] text-[#5B3D8F] px-2 py-0.5 rounded-full font-medium">✓ Зөвшөөрсөн</span>}
                        {p.approved === -1 && <span className="text-xs bg-red-50 text-red-400 px-2 py-0.5 rounded-full font-medium">✗ Татгалзсан</span>}
                        {p.approved === 0 && <span className="text-xs bg-yellow-50 text-yellow-500 px-2 py-0.5 rounded-full font-medium">⏳ Хүлээгдэж буй</span>}
                      </div>
                      <div className="text-lg font-medium text-[#2D1F45]" style={{ fontFamily: "Georgia, serif" }}>
                        {p.businessName}
                      </div>
                      {p.description && <div className="text-sm text-[#9B8EAA] mt-1">{p.description}</div>}
                      <div className="text-xs text-[#9B8EAA] mt-2">
                        {p.email} {p.phone && `· ${p.phone}`}
                      </div>
                    </div>
                    {p.approved !== 1 && (
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => handleProviderAction(p.id, 1)}
                          disabled={actionLoading === p.id}
                          className="px-4 py-2 bg-[#7C5CBF] text-white rounded-xl text-sm font-semibold hover:bg-[#6B4AAF] transition-all disabled:opacity-50 shadow-sm">
                          {actionLoading === p.id ? "..." : "Зөвшөөрөх"}
                        </button>
                        {p.approved !== -1 && (
                          <button onClick={() => handleProviderAction(p.id, -1)}
                            disabled={actionLoading === p.id}
                            className="px-4 py-2 border-2 border-red-200 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-50">
                            Татгалзах
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products tab */}
        {tab === "products" && (
          <div>
            <p className="text-xs text-[#9B8EAA] mb-4">
              Хүлээгдэж буй: {pendingProducts.length} · Зөвшөөрсөн: {approvedProducts.length}
            </p>
            {pendingProducts.length === 0 && (
              <div className="bg-[#FDFCFF] border border-[#E4DDF4] rounded-2xl p-8 text-center text-[#9B8EAA] mb-4">
                Хүлээгдэж буй бүтээгдэхүүн байхгүй.
              </div>
            )}
            <div className="space-y-3">
              {[...pendingProducts, ...approvedProducts].map((p) => (
                <div key={p.id} className={`bg-[#FDFCFF] border-2 rounded-2xl p-5 transition-all ${
                  p.approved === 1 ? "border-[#9B7FCC]" : p.approved === -1 ? "border-red-200 opacity-60" : "border-[#E4DDF4]"
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#9B8EAA]">{typeLabel[p.type]}</span>
                        <span className="text-xs text-[#9B8EAA]">·</span>
                        <span className="text-xs text-[#9B8EAA]">{p.ageMin}–{p.ageMax} нас</span>
                        {p.approved === 1 && <span className="text-xs bg-[#EDE5F8] text-[#5B3D8F] px-2 py-0.5 rounded-full font-medium">✓ Зөвшөөрсөн</span>}
                        {p.approved === -1 && <span className="text-xs bg-red-50 text-red-400 px-2 py-0.5 rounded-full font-medium">✗ Татгалзсан</span>}
                      </div>
                      <div className="text-lg font-medium text-[#2D1F45]" style={{ fontFamily: "Georgia, serif" }}>{p.name}</div>
                      <div className="text-sm text-[#9B8EAA] mt-1">{p.description}</div>
                      <div className="text-sm text-[#7C5CBF] mt-2 font-medium">{p.price.toLocaleString()}₮</div>
                      {p.providerName && (
                        <div className="text-xs text-[#9B8EAA] mt-1">🏪 {p.providerName}</div>
                      )}
                    </div>
                    {p.approved !== 1 && (
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => handleProductAction(p.id, 1)}
                          disabled={actionLoading === p.id}
                          className="px-4 py-2 bg-[#7C5CBF] text-white rounded-xl text-sm font-semibold hover:bg-[#6B4AAF] transition-all disabled:opacity-50 shadow-sm">
                          {actionLoading === p.id ? "..." : "Зөвшөөрөх"}
                        </button>
                        {p.approved !== -1 && (
                          <button onClick={() => handleProductAction(p.id, -1)}
                            disabled={actionLoading === p.id}
                            className="px-4 py-2 border-2 border-red-200 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-50">
                            Татгалзах
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
