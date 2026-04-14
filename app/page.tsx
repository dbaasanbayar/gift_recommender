"use client"
import { useState } from "react";

const INTERESTS = [
  { val: "art", label: "🎨 Урлаг" },
  { val: "music", label: "🎵 Хөгжим" },
  { val: "engineering", label: "⚙️ Инженерчлэл" },
  { val: "technology", label: "💻 Технологи" },
  { val: "science", label: "🔬 Шинжлэх ухаан" },
  { val: "reading", label: "📚 Уншлага" },
  { val: "cooking", label: "🍳 Хоол хийх" },
  { val: "strategy", label: "♟️ Стратеги" },
  { val: "building", label: "🏗️ Бүтээх" },
];

const SKILLS = [
  { val: "creativity", label: "✨ Бүтээлч байдал" },
  { val: "problem_solving", label: "🧩 Асуудал шийдэх" },
  { val: "focus", label: "🎯 Төвлөрөл" },
  { val: "patience", label: "🌱 Тэвчээр" },
  { val: "logic", label: "🔢 Логик" },
  { val: "teamwork", label: "🤝 Хамтын ажиллагаа" },
  { val: "discipline", label: "💪 Хариуцлага" },
  { val: "expression", label: "🗣️ Илэрхийлэл" },
];

type Provider = {
  id: string,
  name: string,
  type: string,
  description: string,
  price: number,
  interests: string[],
  skills: string[],
};

export default function Home() {
  const [age, setAge] = useState(8);
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Provider[] | null>(null);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const toggleChip = (val: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(val)) setList(list.filter(v => v !== val));
    else if (list.length < 3) setList([...list, val]);
  };

  const handleSubmit = async () => {
    setError("");
    console.log("1. Submit дарагдлаа", {age, interests, skills});
    if (!interests.length) return setError("Дор хаяж нэг сонирхол сонгоно уу.");
    if (!skills.length) return setError("Дор хаяж нэг чадвар сонгоно уу.");
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({age, interests, skills}),
      });
      console.log("2. Response status:", res.status);

      const data = await res.json();
      console.log("3. Response data:", data);

      setResults(data.recommendations);
      setExplanation(data.explanation);
    } catch {
      setError("Алдаа гарлаа. Дахин оролдоно уу.")
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setResults(null);
    setInterests([]);
    setSkills([]);
    setError("");
  };

  const typeIcon: Record<string, string> = { physical: "🎁", course: "📖", experience: "⭐" };
  const typeLabel: Record<string, string> = { physical: "Бэлэг", course: "Курс", experience: "Туршлага" };
 
  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
      <div className="text-center">
        <div className="flex gap-2 justify-center mb-4">
        {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#C4622D] animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <p className="text-[#8A7A70] italic">Хамгийн тохиромжтой бэлгийг хайж байна...</p>
      </div>
    </main>
  );

  if (results) return (
    <main className="min-h-screen bg-[#F5F0E8] py-12 px-4">
      <div className="max-w-2xl mx-auto">
       <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Санал болгох бэлгүүд
        </h2>
        <div className="bg-[#FFF8F0] border-l-4 border-[#C4622D] p-4 rounded-r-xl mb-6 text-sm leading-relaxed text-[#3D2B1F]">
          {explanation}
        </div>
        {results.map((p, i) => (
          <div key={p.id} className="bg-[#FDFAF5] border border-[#E8DDD0] rounded-2xl p-6 mb-3 flex gap-4 hover:border-[#C4622D] transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[#FDE8D8] shrink-0">
              {typeIcon[p.type]}
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider text-[#8A7A70] mb-1">{typeLabel[p.type]}</div>
              <div className="text-lg font-medium text-[#3D2B1F] mb-1" style={{ fontFamily: 'Georgia, serif' }}>{p.name}</div>
              <div className="text-sm text-[#8A7A70]">{p.description}</div>
            </div>
            <div className="text-xl text-[#C4622D] font-light whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
            {p.price.toLocaleString()}₮
            </div>
          </div>
        ))}
        <button onClick={handleReset} className="block mx-auto mt-6 px-6 py-2 rounded-full border border-[#E8DDD0] text-[#8A7A70] hover:border-[#3D2B1F] hover:text-[#3D2B1F] transition-all text-sm">
          ← Дахин хайх
        </button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#F5F0E8] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-[#C4622D] border border-[#C4622D] px-3 py-1 rounded-full">
            Хүүхдийн бэлэг зөвлөгч
          </span>
          <h1 className="text-5xl font-light mt-4 mb-3 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Утга бүхий <em className="text-[#C4622D]">бэлэг олъё</em>
          </h1>
          <p className="text-[#8A7A70] text-sm leading-relaxed">
            Хүүхдийн нас, сонирхол, хөгжүүлэх чадварт тулгуурлан хамгийн тохиромжтой бэлгийг санал болгоно.
          </p>
        </div>

        <div className="bg-[#FDFAF5] border border-[#E8DDD0] rounded-3xl p-8 shadow-sm">
          {/* Нас */}
          <div className="text-xs uppercase tracking-wider text-[#8A7A70] mb-3">Хүүхдийн нас</div>
          <div className="flex items-center gap-6 mb-8">
            <span className="text-5xl font-light text-[#3D2B1F]" style={{ fontFamily: 'Georgia, serif' }}>
              {age} <span className="text-base text-[#8A7A70]">нас</span>
            </span>
            <input type="range" min={3} max={16} value={age}
              onChange={e => setAge(+e.target.value)}
              className="flex-1 accent-[#C4622D]" />
          </div>

          <hr className="border-[#E8DDD0] mb-6" />

          {/* Сонирхол */}
          <div className="text-xs uppercase tracking-wider text-[#8A7A70] mb-3">
            Сонирхол <span className="text-[#C4622D]">(1-3 сонго)</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {INTERESTS.map(({ val, label }) => (
              <button key={val} onClick={() => toggleChip(val, interests, setInterests)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  interests.includes(val)
                    ? "bg-[#C4622D] border-[#C4622D] text-white"
                    : "border-[#E8DDD0] text-[#8A7A70] hover:border-[#C4622D] hover:text-[#C4622D]"
                }`}>
                {label}
              </button>
            ))}
          </div>

          <hr className="border-[#E8DDD0] mb-6" />

          {/* Чадвар */}
          <div className="text-xs uppercase tracking-wider text-[#8A7A70] mb-3">
            Хөгжүүлэх чадвар <span className="text-[#7B9E6B]">(1-3 сонго)</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {SKILLS.map(({ val, label }) => (
              <button key={val} onClick={() => toggleChip(val, skills, setSkills)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  skills.includes(val)
                    ? "bg-[#7B9E6B] border-[#7B9E6B] text-white"
                    : "border-[#E8DDD0] text-[#8A7A70] hover:border-[#7B9E6B] hover:text-[#7B9E6B]"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-[#FEF0EE] border border-[#F5C4B3] rounded-xl text-sm text-[#993C1D]">
              {error}
            </div>
          )}

          <button onClick={handleSubmit}
            className="w-full mt-8 py-4 bg-[#3D2B1F] text-[#F5F0E8] rounded-xl text-lg italic hover:bg-[#C4622D] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ fontFamily: 'Georgia, serif' }}>
            Бэлэг хайх →
          </button>
        </div>
      </div>
    </main>
  );
}
