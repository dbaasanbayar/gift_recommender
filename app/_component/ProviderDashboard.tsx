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

export default function ProviderDashboard({ userName }: {
    userName: string;})
{
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
        if (list.includes(val)) {
            setForm({...form, [key]: list.filter(v => v !== val) });
        }   else {
            setForm({...form, [key]: [...list, val] });
        }
    };

    const handleSubmit = async () => {
        setError("");
        if (!form.name || !form.description || !form.price) {
            setError("Бүх талбарыг бөглөнө үү.");
            return;
        }
        if (!form.interests.length || !form.skills.length) {
            setError("Сонирхол болон чадвар сонгоно уу.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/provider/product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({...form, price: parseInt(form.price)}),
            });
            if (!res.ok) throw new Error();
            setSuccess(true);
            setForm({
                name: "", type: "physical", description: "",
                price: "", ageMin: "3", ageMax: "16",
                interests: [], skills: [],
            });
        } catch {
            setError("Алдаа гарлаа. Дахин оролдоно уу.")
        } finally {
            setLoading(false);
        }
    }



    return (
        <main className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#7C5CBF] border border-[#7C5CBF] px-3 py-1 rounded-full">
            Provider Dashboard
          </span>
          <h1 className="text-4xl font-light mt-4" style={{ fontFamily: "Georgia, serif" }}>
            Сайн байна уу, <em className="text-[#7C5CBF]">{userName}</em>
          </h1>
        </div>

        {success && (
          <div className="bg-[#EDE5F8] border border-[#9B7FCC] rounded-xl p-4 mb-6 text-[#5B3D8F] text-sm">
            ✅ Бүтээгдэхүүн амжилттай нэмэгдлээ. Админ хянасны дараа харагдана.
          </div>
        )}

        <div className="bg-[#FDFCFF] border border-[#E4DDF4] rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-light mb-6" style={{ fontFamily: "Georgia, serif" }}>
            Шинэ бүтээгдэхүүн нэмэх
          </h2>

          {/* Нэр */}
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">Нэр</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF]"
              placeholder="Бүтээгдэхүүний нэр" />
          </div>

          {/* Төрөл */}
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">Төрөл</label>
            <div className="flex gap-3">
              {["physical", "course", "experience"].map(t => (
                <button key={t} onClick={() => setForm({ ...form, type: t })}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    form.type === t
                      ? "bg-[#7C5CBF] border-[#7C5CBF] text-white"
                      : "border-[#E4DDF4] text-[#9B8EAA]"
                  }`}>
                  {t === "physical" ? "🎁 Бэлэг" : t === "course" ? "📖 Курс" : "⭐ Туршлага"}
                </button>
              ))}
            </div>
          </div>

          {/* Тайлбар */}
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">Тайлбар</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF] h-24 resize-none"
              placeholder="Бүтээгдэхүүний тайлбар" />
          </div>

          {/* Үнэ + Нас */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">Үнэ (₮)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF]"
                placeholder="50000" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">Нас (мин)</label>
              <input type="number" value={form.ageMin} onChange={e => setForm({ ...form, ageMin: e.target.value })}
                className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">Нас (макс)</label>
              <input type="number" value={form.ageMax} onChange={e => setForm({ ...form, ageMax: e.target.value })}
                className="w-full border border-[#E4DDF4] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#7C5CBF]" />
            </div>
          </div>

          {/* Сонирхол */}
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">Сонирхол</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(({ val, label }) => (
                <button key={val} onClick={() => toggleItem(val, form.interests, "interests")}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                    form.interests.includes(val)
                      ? "bg-[#7C5CBF] border-[#7C5CBF] text-white"
                      : "border-[#E4DDF4] text-[#9B8EAA]"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Чадвар */}
          <div className="mb-6">
            <label className="text-xs uppercase tracking-wider text-[#9B8EAA] block mb-2">Чадвар</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(({ val, label }) => (
                <button key={val} onClick={() => toggleItem(val, form.skills, "skills")}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                    form.skills.includes(val)
                      ? "bg-[#9B7FCC] border-[#9B7FCC] text-white"
                      : "border-[#E4DDF4] text-[#9B8EAA]"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#F0ECFF] border border-[#D4C5F0] rounded-xl text-sm text-[#5B3D8F]">
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 bg-[#7C5CBF] text-white rounded-xl text-lg font-semibold hover:bg-[#6B4AAF] transition-all disabled:opacity-50 shadow-sm tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}>
            {loading ? "Нэмж байна..." : "Бүтээгдэхүүн нэмэх →"}
          </button>
        </div>
      </div>
    </main>
  );
}