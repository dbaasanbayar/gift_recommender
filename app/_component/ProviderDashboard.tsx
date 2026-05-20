"use client"

import { useState } from "react";

// These values MUST match the user-facing form (page.tsx INTERESTS/SKILLS)
// so that product embeddings align with query embeddings in RAG search
const INTEREST_OPTIONS = [
  { val: "art",        label: "🎨 Зураг / Урлаг" },
  { val: "music",      label: "🎵 Хөгжим" },
  { val: "technology", label: "💻 Технологи" },
  { val: "science",    label: "🔬 Шинжлэх ухаан" },
  { val: "cooking",    label: "🍳 Хоол хийх" },
  { val: "sport",      label: "⚽ Спорт" },
];

const SKILL_OPTIONS = [
  { val: "creative",  label: "🎨 Бүтээлч байдал" },
  { val: "logic",     label: "🧠 Логик сэтгэлгээ" },
  { val: "focus",     label: "🎯 Төвлөрөл" },
  { val: "teamwork",  label: "🤝 Хамтын ажиллагаа" },
  { val: "patience",  label: "🌱 Тэвчээр" },
];

const TYPE_OPTIONS = [
  { val: "physical",   icon: "🎁", label: "Физик бэлэг",  desc: "Хүргэгдэх буюу авах боломжтой бараа" },
  { val: "course",     icon: "📖", label: "Курс",         desc: "Онлайн болон танхимын сургалт" },
  { val: "experience", icon: "⭐", label: "Туршлага",     desc: "Нэг удаагийн үйл ажиллагаа, workshop" },
];

function SectionHeader({ n, title, subtitle }: { n: string; title: string; subtitle: string }) {
  return (
    <div className="flex gap-4 items-start mb-5">
      <div className="w-7 h-7 rounded-full bg-[#EDE5F8] text-[#7C5CBF] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <div className="text-sm font-semibold text-black">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

export default function ProviderDashboard({ userName }: { userName: string }) {
  const [form, setForm] = useState({
    name: "",
    type: "physical",
    description: "",
    price: "",
    ageMin: "3",
    ageMax: "16",
    interests: [] as string[],
    skills: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const toggleItem = (val: string, list: string[], key: "interests" | "skills") => {
    setForm({ ...form, [key]: list.includes(val) ? list.filter(v => v !== val) : [...list, val] });
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.description || !form.price) {
      setError("Бүтээгдэхүүний нэр, тайлбар, үнэ шаардлагатай.");
      return;
    }
    if (!form.interests.length || !form.skills.length) {
      setError("Дор хаяж нэг сонирхол болон нэг чадвар сонгоно уу.");
      return;
    }
    if (parseInt(form.ageMin) >= parseInt(form.ageMax)) {
      setError("Доод нас дээд насаас бага байх ёстой.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/provider/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseInt(form.price) }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setForm({
        name: "", type: "physical", description: "",
        price: "", ageMin: "3", ageMax: "16",
        interests: [], skills: [],
      });
      setTimeout(() => setSuccess(false), 6000);
    } catch {
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#7C5CBF] border border-[#7C5CBF] px-3 py-1 rounded-full">
            Нийлүүлэгчийн хяналтын самбар
          </span>
          <h1 className="text-4xl font-light mt-5 leading-snug" style={{ fontFamily: "Georgia, serif" }}>
            Сайн байна уу,{" "}
            <em className="text-[#7C5CBF]">{userName}</em>
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Нэмсэн бүтээгдэхүүн хянагдсаны дараа эцэг эхийн хайлтад харагдана.
          </p>
        </div>

        {/* Success notice */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex gap-3 items-start">
            <span className="text-green-500 text-lg">✓</span>
            <div>
              <div className="text-sm font-semibold text-green-800">Бүтээгдэхүүн амжилттай илгээгдлээ</div>
              <div className="text-xs text-green-600 mt-0.5">Манай баг хянасны дараа хайлтад харагдах болно. Ихэвчлэн 1–2 ажлын өдөр зарцуулагдана.</div>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white border border-[#E4DDF4] rounded-3xl shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="border-b border-[#F0ECFF] px-8 py-5 bg-[#FDFCFF]">
            <h2 className="text-base font-semibold text-black">Шинэ бүтээгдэхүүн нэмэх</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Мэдээллийг үнэн зөв, бүрэн гүйцэд оруулна уу — хянагч баг шалгана
            </p>
          </div>

          <div className="px-8 py-8 space-y-8">

            {/* Section 1 — Үндсэн мэдээлэл */}
            <div>
              <SectionHeader
                n="1"
                title="Үндсэн мэдээлэл"
                subtitle="Бүтээгдэхүүний нэр, төрөл, дэлгэрэнгүй тайлбар"
              />

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">
                    Бүтээгдэхүүний нэр <span className="text-[#7C5CBF]">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7C5CBF] transition-all"
                    placeholder="Жишээ: Хүүхдийн гитарын хичээл"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">Төрөл</label>
                  <div className="grid grid-cols-3 gap-3">
                    {TYPE_OPTIONS.map(t => (
                      <button
                        key={t.val}
                        onClick={() => setForm({ ...form, type: t.val })}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          form.type === t.val
                            ? "border-[#7C5CBF] bg-[#EDE5F8]"
                            : "border-[#E4DDF4] hover:border-[#C9B8E8]"
                        }`}
                      >
                        <div className="text-xl mb-1">{t.icon}</div>
                        <div className="text-xs font-semibold text-black">{t.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-tight">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">
                    Дэлгэрэнгүй тайлбар <span className="text-[#7C5CBF]">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7C5CBF] transition-all h-28 resize-none"
                    placeholder="Бүтээгдэхүүн юу агуулдаг, ямар давуу талтай вэ?"
                  />
                  <p className="text-xs text-gray-400 mt-1">Тайлбар тодорхой байх тусам AI хайлтад илүү сайн гарна</p>
                </div>
              </div>
            </div>

            <hr className="border-[#F0ECFF]" />

            {/* Section 2 — Үнэ ба насны хязгаар */}
            <div>
              <SectionHeader
                n="2"
                title="Үнэ ба насны хязгаар"
                subtitle="Зөв мэдээлэл оруулах нь эцэг эхэд зөв санал болгоход тусална"
              />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">
                    Үнэ (₮) <span className="text-[#7C5CBF]">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7C5CBF] transition-all"
                    placeholder="50,000"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">Доод нас</label>
                  <input
                    type="number"
                    min={1} max={16}
                    value={form.ageMin}
                    onChange={e => setForm({ ...form, ageMin: e.target.value })}
                    className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7C5CBF] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1.5">Дээд нас</label>
                  <input
                    type="number"
                    min={1} max={16}
                    value={form.ageMax}
                    onChange={e => setForm({ ...form, ageMax: e.target.value })}
                    className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7C5CBF] transition-all"
                  />
                </div>
              </div>
            </div>

            <hr className="border-[#F0ECFF]" />

            {/* Section 3 — AI тохиргоо */}
            <div>
              <SectionHeader
                n="3"
                title="AI хайлтын тохиргоо"
                subtitle="Эдгээр утгыг AI санал болгоход ашиглана — үнэн зөв сонгоно уу"
              />

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1">
                    Хамаарах сонирхол
                  </label>
                  <p className="text-xs text-gray-400 mb-2">Хүүхэд ямар сонирхолтой байхад энэ бүтээгдэхүүн тохиромжтой вэ?</p>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(({ val, label }) => (
                      <button
                        key={val}
                        onClick={() => toggleItem(val, form.interests, "interests")}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          form.interests.includes(val)
                            ? "bg-[#7C5CBF] border-[#7C5CBF] text-white"
                            : "border-[#E4DDF4] text-gray-600 hover:border-[#C9B8E8]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-black block mb-1">
                    Хөгжүүлэх чадвар
                  </label>
                  <p className="text-xs text-gray-400 mb-2">Энэ бүтээгдэхүүн хүүхдийн ямар чадварыг хөгжүүлэхэд тус дэмжлэг болох вэ?</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map(({ val, label }) => (
                      <button
                        key={val}
                        onClick={() => toggleItem(val, form.skills, "skills")}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          form.skills.includes(val)
                            ? "bg-[#9B7FCC] border-[#9B7FCC] text-white"
                            : "border-[#E4DDF4] text-gray-600 hover:border-[#D4C5F0]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[#F0ECFF]" />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Responsibility notice */}
            <div className="bg-[#F8F6FC] border border-[#E4DDF4] rounded-xl px-4 py-3 text-xs text-gray-500 leading-relaxed">
              ⚠️ Илгээснээр та бүтээгдэхүүний мэдээлэл үнэн зөв, хүүхдэд аюулгүй болохыг
              баталгаажуулж байна. Буруу буюу хуурамч мэдээлэл нь бүртгэлийг цуцлах үндэслэл болно.
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-[#7C5CBF] text-white rounded-xl text-base font-semibold hover:bg-[#6B4AAF] transition-all disabled:opacity-50 tracking-wide"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {loading ? "Илгээж байна..." : "Хянуулахаар илгээх →"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
