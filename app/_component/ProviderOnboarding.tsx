"use client";

import { useState } from "react";

export default function ProviderOnboarding({
  defaultEmail,
  onComplete,
}: {
  defaultEmail: string;
  onComplete: () => void;
}) {
  const [form, setForm] = useState({
    businessName: "",
    email: defaultEmail,
    phone: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.businessName || !form.email) {
      setError("Бизнесийн нэр болон имэйл шаардлагатай.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/provider/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      onComplete();
    } catch {
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#7C5CBF] border-2 border-[#7C5CBF] px-3 py-1 rounded-full font-medium">
            Provider бүртгэл
          </span>
          <h1 className="text-4xl font-light mt-4 mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Тавтай морил
          </h1>
          <p className="text-[#9B8EAA] text-sm leading-relaxed">
            Бизнесийн мэдээллээ бөглөнө үү. Админ хянасны дараа бүтээгдэхүүн нэмэх боломжтой болно.
          </p>
        </div>

        <div className="bg-[#FDFCFF] border border-[#E4DDF4] rounded-3xl p-8 shadow-sm">
          <div className="mb-5">
            <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">
              Бизнесийн нэр <span className="text-[#7C5CBF]">*</span>
            </label>
            <input value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF] transition-all"
              placeholder="Жишээ: DGL Music Shop" />
          </div>

          <div className="mb-5">
            <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">
              Имэйл <span className="text-[#7C5CBF]">*</span>
            </label>
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF] transition-all"
              placeholder="info@example.mn" />
          </div>

          <div className="mb-5">
            <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">
              Утасны дугаар <span className="text-[#9B8EAA] normal-case">(заавал биш)</span>
            </label>
            <input type="tel" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF] transition-all"
              placeholder="9999-9999" />
          </div>

          <div className="mb-6">
            <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">
              Бизнесийн тайлбар <span className="text-[#9B8EAA] normal-case">(заавал биш)</span>
            </label>
            <textarea value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF] transition-all h-20 resize-none"
              placeholder="Бизнесийнхээ тухай товч тайлбарлана уу" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#F0ECFF] border border-[#D4C5F0] rounded-xl text-sm text-[#5B3D8F]">
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 bg-[#7C5CBF] text-white rounded-xl text-lg font-semibold hover:bg-[#6B4AAF] transition-all disabled:opacity-50 shadow-sm tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}>
            {loading ? "Бүртгэж байна..." : "Бүртгүүлэх →"}
          </button>
        </div>
      </div>
    </main>
  );
}
