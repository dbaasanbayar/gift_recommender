"use client";

import { useState } from "react";

const STEPS = [
  { n: "01", label: "Бүртгэл" },
  { n: "02", label: "Хянагдах" },
  { n: "03", label: "Бүтээгдэхүүн нэмэх" },
];

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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-[#7C5CBF] border border-[#7C5CBF] px-3 py-1 rounded-full">
            Нийлүүлэгч бүртгэл
          </span>
          <h1 className="text-4xl font-light mt-5 mb-3 leading-snug" style={{ fontFamily: "Georgia, serif" }}>
            Gifted платформд<br />
            <em className="text-[#7C5CBF]">тавтай морил</em>
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Таны бүтээгдэхүүн, үйлчилгээ хүүхдийн бэлэг хайж буй эцэг эхчүүдэд санал болгогдоно.
            Бүртгэлийн дараа манай баг таны мэдээллийг хянан батална.
          </p>
        </div>

        {/* Process steps */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className={`flex flex-col items-center ${i === 0 ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i === 0 ? "border-[#7C5CBF] text-[#7C5CBF] bg-[#EDE5F8]" : "border-gray-300 text-gray-400"
                }`}>
                  {s.n}
                </div>
                <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mx-2 mb-4" />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white border border-[#E4DDF4] rounded-3xl shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="border-b border-[#F0ECFF] px-8 py-5 bg-[#FDFCFF]">
            <h2 className="text-base font-semibold text-black">Бизнесийн мэдээлэл</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Оруулсан мэдээлэл нийтэд харагдахгүй — зөвхөн баталгаажуулалтад ашиглана
            </p>
          </div>

          <div className="px-8 py-7 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">
                Бизнесийн нэр <span className="text-[#7C5CBF]">*</span>
              </label>
              <input
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF] transition-all"
                placeholder="Жишээ: DGL Music Shop"
              />
              <p className="text-xs text-gray-400 mt-1">Бүтээгдэхүүний карт дээр харагдах нэр</p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">
                Имэйл хаяг <span className="text-[#7C5CBF]">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF] transition-all"
                placeholder="info@example.mn"
              />
              <p className="text-xs text-gray-400 mt-1">Батлах мэдэгдэл энэ хаягт ирнэ</p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">
                Утасны дугаар
                <span className="text-gray-400 normal-case font-normal ml-1">(заавал биш)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF] transition-all"
                placeholder="9999-9999"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">
                Бизнесийн тухай
                <span className="text-gray-400 normal-case font-normal ml-1">(заавал биш)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF] transition-all h-20 resize-none"
                placeholder="Бизнесийнхээ чиглэл, онцлогийг товч тайлбарлана уу"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Responsibility notice */}
            <div className="bg-[#F8F6FC] border border-[#E4DDF4] rounded-xl px-4 py-3 text-xs text-gray-500 leading-relaxed">
              ⚠️ Бүртгүүлснээр та нэмэх бүтээгдэхүүн, үйлчилгээний мэдээлэл үнэн зөв,
              хүүхдэд аюулгүй болохыг хүлээн зөвшөөрч байна. Буруу мэдээлэл нь бүртгэлийг
              цуцлах үндэслэл болно.
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-[#7C5CBF] text-white rounded-xl text-base font-semibold hover:bg-[#6B4AAF] transition-all disabled:opacity-50 tracking-wide"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {loading ? "Бүртгэж байна..." : "Бүртгүүлэх — хянагдах хүсэлт илгээх →"}
            </button>

            <p className="text-center text-xs text-gray-400">
              Хянах хугацаа ихэвчлэн 1–3 ажлын өдөр байдаг
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
