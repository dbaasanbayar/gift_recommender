"use client"

import { useState } from "react";

const INTEREST_OPTIONS = [
  "art", "music", "engineering", "technology",
  "science", "reading", "cooking", "strategy", "building"
];

const SKILL_OPTIONS = [
  "creativity", "problem_solving", "focus",
  "patience", "logic", "teamwork", "discipline", "expression"
];

export default function ProviderDashboard({clerkId, userName}: {
    clerkId: string;
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
                body: JSON.stringify({...form, clerkId, price: parseInt(form.price)}),
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
        <main className="min-h-screen bg-[#F5F0E8] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#C4622D] border border-[#C4622D] px-3 py-1 rounded-full">
            Provider Dashboard
          </span>
          <h1 className="text-4xl font-light mt-4" style={{ fontFamily: "Georgia, serif" }}>
            Сайн байна уу, <em className="text-[#C4622D]">{userName}</em>
          </h1>
        </div>

        {success && (
          <div className="bg-[#E8F0DE] border border-[#7B9E6B] rounded-xl p-4 mb-6 text-[#3B6D11] text-sm">
            ✅ Бүтээгдэхүүн амжилттай нэмэгдлээ. Админ хянасны дараа харагдана.
          </div>
        )}

        <div className="bg-[#FDFAF5] border border-[#E8DDD0] rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-light mb-6" style={{ fontFamily: "Georgia, serif" }}>
            Шинэ бүтээгдэхүүн нэмэх
          </h2>

          {/* Нэр */}
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider text-[#8A7A70] block mb-2">Нэр</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#E8DDD0] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#C4622D]"
              placeholder="Бүтээгдэхүүний нэр" />
          </div>

          {/* Төрөл */}
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider text-[#8A7A70] block mb-2">Төрөл</label>
            <div className="flex gap-3">
              {["physical", "course", "experience"].map(t => (
                <button key={t} onClick={() => setForm({ ...form, type: t })}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    form.type === t
                      ? "bg-[#C4622D] border-[#C4622D] text-white"
                      : "border-[#E8DDD0] text-[#8A7A70]"
                  }`}>
                  {t === "physical" ? "🎁 Бэлэг" : t === "course" ? "📖 Курс" : "⭐ Туршлага"}
                </button>
              ))}
            </div>
          </div>

          {/* Тайлбар */}
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider text-[#8A7A70] block mb-2">Тайлбар</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-[#E8DDD0] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#C4622D] h-24 resize-none"
              placeholder="Бүтээгдэхүүний тайлбар" />
          </div>

          {/* Үнэ + Нас */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#8A7A70] block mb-2">Үнэ (₮)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#C4622D]"
                placeholder="50000" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[#8A7A70] block mb-2">Нас (мин)</label>
              <input type="number" value={form.ageMin} onChange={e => setForm({ ...form, ageMin: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#C4622D]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[#8A7A70] block mb-2">Нас (макс)</label>
              <input type="number" value={form.ageMax} onChange={e => setForm({ ...form, ageMax: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#C4622D]" />
            </div>
          </div>

          {/* Сонирхол */}
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider text-[#8A7A70] block mb-2">Сонирхол</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(val => (
                <button key={val} onClick={() => toggleItem(val, form.interests, "interests")}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                    form.interests.includes(val)
                      ? "bg-[#C4622D] border-[#C4622D] text-white"
                      : "border-[#E8DDD0] text-[#8A7A70]"
                  }`}>
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Чадвар */}
          <div className="mb-6">
            <label className="text-xs uppercase tracking-wider text-[#8A7A70] block mb-2">Чадвар</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(val => (
                <button key={val} onClick={() => toggleItem(val, form.skills, "skills")}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                    form.skills.includes(val)
                      ? "bg-[#7B9E6B] border-[#7B9E6B] text-white"
                      : "border-[#E8DDD0] text-[#8A7A70]"
                  }`}>
                  {val}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#FEF0EE] border border-[#F5C4B3] rounded-xl text-sm text-[#993C1D]">
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 bg-[#3D2B1F] text-[#F5F0E8] rounded-xl text-lg italic hover:bg-[#C4622D] transition-all disabled:opacity-50"
            style={{ fontFamily: "Georgia, serif" }}>
            {loading ? "Нэмж байна..." : "Бүтээгдэхүүн нэмэх →"}
          </button>
        </div>
      </div>
    </main>
  );
}