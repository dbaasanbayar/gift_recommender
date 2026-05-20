"use client"
import { useState } from "react";

const INTERESTS = [
  { val: "art", label: "🎨 Зураг" },
  { val: "music", label: "🎵 Хөгжим" },
  { val: "technology", label: "💻 Технологи" },
  { val: "science", label: "🔬 Шинжлэх ухаан" },
  { val: "cooking", label: "🍳 Хоол хийх" },
];

const SKILLS = [
  { val: "creative", label: "🎨 Бүтээлч байдал" },
  { val: "logic", label: "🧠 Логик сэтгэлгээ" },
  { val: "focus", label: "🎯 Төвлөрөл" },
  { val: "teamwork", label: "🤝 Хамтын ажиллагаа" },
  { val: "patience", label: "🌱 Тэвчээр" },
];

const GENDERS = [
  { val: "boy", label: "👦 Хөвгүүн" },
  { val: "girl", label: "👧 Охин" },
];

type ProviderProduct = {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  providerName: string | null;
  providerEmail: string | null;
};

type GoogleProduct = {
  title: string;
  price: string;
  source: string;
  link: string;
  thumbnail: string;
};

const typeIcon: Record<string, string> = { physical: "🎁", course: "📖", experience: "⭐" };
const typeLabel: Record<string, string> = { physical: "Бэлэг", course: "Курс", experience: "Туршлага" };

export default function Home() {
  const [age, setAge] = useState(8);
  const [gender, setGender] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [providerProducts, setProviderProducts] = useState<ProviderProduct[] | null>(null);
  const [googleProducts, setGoogleProducts] = useState<GoogleProduct[] | null>(null);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const MAX_INTERESTS = 2;

  const toggleInterest = (val: string) => {
    if (interests.includes(val)) setInterests(interests.filter(v => v !== val));
    else if (interests.length < MAX_INTERESTS) setInterests([...interests, val]);
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed || interests.includes(trimmed) || interests.length >= MAX_INTERESTS) return;
    setInterests([...interests, trimmed]);
    setCustomInterest("");
  };

  const toggleSkill = (val: string) => {
    setSkills(skills.includes(val) ? [] : [val]);
  };

  const handleSubmit = async () => {
    setError("");
    if (!gender) return setError("Хүйс сонгоно уу.");
    if (!interests.length) return setError("Дор хаяж нэг сонирхол сонгоно уу.");
    if (!skills.length) return setError("Дор хаяж нэг чадвар сонгоно уу.");
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, gender, interests, skills }),
      });
      const data = await res.json();
      setProviderProducts(data.providerProducts);
      setGoogleProducts(data.googleProducts);
      setExplanation(data.explanation);
    } catch {
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProviderProducts(null);
    setGoogleProducts(null);
    setExplanation("");
    setInterests([]);
    setSkills([]);
    setGender("");
    setError("");
  };

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="flex gap-2 justify-center mb-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#7C5CBF] animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <p className="text-black font-medium mb-1">Хамгийн тохиромжтой бэлгийг хайж байна...</p>
        <p className="text-gray-500 text-xs">Монгол болон олон улсын бэлгүүдийг нэгэн зэрэг хайж байна. 5-10 секунд болно.</p>
      </div>
    </main>
  );

  if (providerProducts) return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light mb-4" style={{ fontFamily: "Georgia, serif" }}>
          Санал болгох бэлгүүд
        </h2>

        <div className="bg-[#F5F0FF] border-l-4 border-[#7C5CBF] p-4 rounded-r-xl mb-8 text-sm leading-relaxed text-[#2D1F45]">
          {explanation}
        </div>

        {/* Монгол providers */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-[#9B8EAA]">🏪 Монгол бэлгүүд</span>
          </div>
          {providerProducts.length === 0 ? (
            <div className="bg-[#FDFCFF] border border-[#E4DDF4] rounded-2xl p-6 text-center text-sm text-[#9B8EAA]">
              Таны хайлтад тохирох монгол бэлэг олдсонгүй.
            </div>
          ) : (
            <div className="space-y-3">
              {providerProducts.map((p) => (
                <div key={p.id} className="bg-[#FDFCFF] border border-[#E4DDF4] rounded-2xl p-5 flex gap-4 hover:border-[#7C5CBF] transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[#EDE5F8] shrink-0">
                    {typeIcon[p.type]}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">{typeLabel[p.type]}</div>
                    <div className="text-lg font-medium text-black" style={{ fontFamily: "Georgia, serif" }}>{p.name}</div>
                    <div className="text-sm text-gray-600">{p.description}</div>
                    {p.providerName && (
                      <div className="text-xs text-[#7C5CBF] mt-2 font-medium">🏪 {p.providerName}</div>
                    )}
                  </div>
                  <div className="text-xl text-[#7C5CBF] font-light whitespace-nowrap" style={{ fontFamily: "Georgia, serif" }}>
                    {p.price.toLocaleString()}₮
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Google Shopping */}
        {googleProducts && googleProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-wider text-[#9B8EAA]">🛒 Олон улсын бэлгүүд</span>
            </div>
            <div className="space-y-3">
              {googleProducts.slice(0, 3).map((p, i) => (
                <div key={i} className="bg-[#FDFCFF] border border-[#E4DDF4] rounded-2xl p-5 flex gap-4 hover:border-[#9B7FCC] transition-all">
                  <div className="w-12 h-12 rounded-xl shrink-0 bg-[#EDE5F8] overflow-hidden flex items-center justify-center text-xl">
                    {p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" /> : "🛒"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">{p.source}</div>
                    <div className="text-base font-medium text-black line-clamp-2" style={{ fontFamily: "Georgia, serif" }}>{p.title}</div>
                    <div className="text-lg text-[#9B7FCC] font-light mt-1" style={{ fontFamily: "Georgia, serif" }}>{p.price}</div>
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="shrink-0 self-center px-4 py-2 rounded-full border-2 border-[#9B7FCC] text-[#9B7FCC] text-xs font-semibold hover:bg-[#9B7FCC] hover:text-white transition-all">
                      Үзэх →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <button onClick={handleReset}
          className="block mx-auto mt-4 px-6 py-2 rounded-full border-2 border-[#C9B8E8] text-[#7C5CBF] font-medium hover:border-[#7C5CBF] hover:bg-[#EDE5F8] transition-all text-sm">
          ← Дахин хайх
        </button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-[#7C5CBF] border border-[#7C5CBF] px-3 py-1 rounded-full">
            Хүүхдийн бэлэг зөвлөгч
          </span>
          <h1 className="text-5xl font-light mt-4 mb-3 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            Утга бүхий <em className="text-[#7C5CBF]">бэлэг олъё</em>
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Хүүхдийн нас, сонирхол, хөгжүүлэх чадварт тулгуурлан хамгийн тохиромжтой бэлгийг санал болгоно.
          </p>
        </div>

        <div className="bg-[#FDFCFF] border border-[#E4DDF4] rounded-3xl p-8 shadow-sm">

          {/* Нас */}
          <div className="text-xs uppercase tracking-wider text-black font-semibold mb-3">Хүүхдийн нас</div>
          <div className="flex items-center gap-6 mb-8">
            <span className="text-5xl font-light text-black" style={{ fontFamily: "Georgia, serif" }}>
              {age} <span className="text-base text-gray-500">нас</span>
            </span>
            <input type="range" min={3} max={16} value={age}
              onChange={e => setAge(+e.target.value)}
              className="flex-1 accent-[#7C5CBF]" />
          </div>

          <hr className="border-[#E4DDF4] mb-6" />

          {/* Хүйс */}
          <div className="text-xs uppercase tracking-wider text-black font-semibold mb-3">Хүйс</div>
          <div className="flex gap-3 mb-8">
            {GENDERS.map(({ val, label }) => (
              <button key={val} onClick={() => setGender(val)}
                className={`px-8 py-3 rounded-xl border-2 text-base font-semibold transition-all ${
                  gender === val
                    ? "bg-[#7C5CBF] border-[#7C5CBF] text-white shadow-sm"
                    : "border-[#C9B8E8] text-[#7C5CBF] hover:border-[#7C5CBF] hover:bg-[#EDE5F8]"
                }`}>
                {label}
              </button>
            ))}
          </div>

          <hr className="border-[#E4DDF4] mb-6" />

          {/* Сонирхол */}
          <div className="mb-1">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-black font-semibold">Сонирхол</div>
              <div className={`text-xs font-semibold transition-all ${
                interests.length === MAX_INTERESTS ? "text-[#7C5CBF]" : "text-gray-400"
              }`}>
                {interests.length}/{MAX_INTERESTS}
                {interests.length === MAX_INTERESTS && " · дүүрсэн 🔒"}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 mb-3">
              Хамгийн чухал 2-ыг сонгоно уу — хайлтын нарийвчлал сайжирна
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {INTERESTS.map(({ val, label }) => {
              const selected = interests.includes(val);
              const locked = !selected && interests.length >= MAX_INTERESTS;
              return (
                <button key={val} onClick={() => toggleInterest(val)} disabled={locked}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                    selected
                      ? "bg-[#7C5CBF] border-[#7C5CBF] text-white shadow-sm"
                      : locked
                        ? "border-[#E4DDF4] text-[#C9C0D8] cursor-not-allowed opacity-40"
                        : "border-[#C9B8E8] text-[#7C5CBF] hover:border-[#7C5CBF] hover:bg-[#EDE5F8]"
                  }`}>
                  {label}
                </button>
              );
            })}
            {/* Custom нэмсэн сонирхлууд */}
            {interests.filter(i => !INTERESTS.find(x => x.val === i)).map(val => (
              <button key={val} onClick={() => toggleInterest(val)}
                className="px-4 py-2 rounded-full border-2 bg-[#7C5CBF] border-[#7C5CBF] text-white text-sm font-medium shadow-sm flex items-center gap-1">
                {val} <span className="text-white/70 text-xs">✕</span>
              </button>
            ))}
          </div>
          {/* Custom сонирхол нэмэх */}
          <div className="flex gap-2 mb-6">
            <input
              value={customInterest}
              onChange={e => setCustomInterest(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCustomInterest()}
              disabled={interests.length >= MAX_INTERESTS}
              placeholder={interests.length >= MAX_INTERESTS ? "2 сонирхол дүүрсэн 🔒" : "Өөр сонирхол нэмэх..."}
              className="flex-1 border border-[#E4DDF4] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#7C5CBF] transition-all bg-white disabled:bg-[#F8F6FC] disabled:text-[#C9C0D8] disabled:cursor-not-allowed"
            />
            <button onClick={addCustomInterest}
              disabled={!customInterest.trim() || interests.length >= MAX_INTERESTS}
              className="px-4 py-2 rounded-xl bg-[#EDE5F8] text-[#7C5CBF] text-sm font-semibold hover:bg-[#7C5CBF] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              + Нэмэх
            </button>
          </div>

          <hr className="border-[#E4DDF4] mb-6" />

          {/* Чадвар */}
          <div className="text-xs uppercase tracking-wider text-black font-semibold mb-1">Хөгжүүлэх чадвар</div>
          <p className="text-xs text-gray-400 mb-3">Нэг чадвар сонгоно уу</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {SKILLS.map(({ val, label }) => (
              <button key={val} onClick={() => toggleSkill(val)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                  skills.includes(val)
                    ? "bg-[#9B7FCC] border-[#9B7FCC] text-white shadow-sm"
                    : "border-[#D4C5F0] text-[#9B7FCC] hover:border-[#9B7FCC] hover:bg-[#F0ECFF]"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-[#F0ECFF] border border-[#D4C5F0] rounded-xl text-sm text-[#5B3D8F]">
              {error}
            </div>
          )}

          <button onClick={handleSubmit}
            className="w-full mt-8 py-4 bg-[#B8A5E0] text-white rounded-xl text-lg font-semibold hover:bg-[#A594D4] transition-all hover:-translate-y-0.5 hover:shadow-md tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}>
            Бэлэг хайх →
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <a href="/provider"
          className="text-xs text-[#9B8EAA] hover:text-[#7C5CBF] transition-all border-b border-transparent hover:border-[#7C5CBF]">
          Та бэлэг нийлүүлэгч үү? Энд бүртгүүлнэ үү →
        </a>
      </div>
    </main>
  );
}
