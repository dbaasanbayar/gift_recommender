"use client";

import { useEffect, useState } from "react";
import ProviderOnboarding from "../_component/ProviderOnboarding";
import ProviderDashboard from "../_component/ProviderDashboard";

type Status = "loading" | "onboarding" | "pending" | "dashboard";

export default function ProviderPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    fetch("/api/provider/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.member) {
          // Бүртгэлгүй → onboarding
          fetch("/api/provider/clerk-info")
            .then((r) => r.json())
            .then((info) => {
              setUserName(info.name ?? "");
              setUserEmail(info.email ?? "");
              setStatus("onboarding");
            });
        } else if (data.member.approved !== 1) {
          // Бүртгэлтэй ч батлагдаагүй → pending
          setBusinessName(data.member.businessName ?? "");
          setStatus("pending");
        } else {
          // Батлагдсан → dashboard
          setBusinessName(data.member.businessName ?? "");
          setStatus("dashboard");
        }
      });
  }, []);

  if (status === "loading") return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#7C5CBF] animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </main>
  );

  if (status === "onboarding") return (
    <ProviderOnboarding
      defaultEmail={userEmail}
      onComplete={() => setStatus("pending")}
    />
  );

  if (status === "pending") return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#FDFCFF] border border-[#E4DDF4] rounded-3xl p-10 text-center shadow-sm">
        <div className="text-4xl mb-4">🕐</div>
        <h2 className="text-2xl font-light mb-3 text-[#2D1F45]" style={{ fontFamily: "Georgia, serif" }}>
          Хянагдаж байна
        </h2>
        <p className="text-[#9B8EAA] text-sm leading-relaxed mb-4">
          <span className="font-medium text-[#7C5CBF]">{businessName}</span> бизнесийн бүртгэл admin-д хянагдаж байна.
          Батлагдсаны дараа бүтээгдэхүүн нэмэх боломжтой болно.
        </p>
        <div className="text-xs text-[#9B8EAA]">
          Асуух зүйл байвал холбоо барина уу.
        </div>
      </div>
    </main>
  );

  return <ProviderDashboard userName={businessName} />;
}
