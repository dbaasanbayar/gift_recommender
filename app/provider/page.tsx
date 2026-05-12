"use client";

import { useEffect, useState } from "react";
import ProviderOnboarding from "../_component/ProviderOnboarding";
import ProviderDashboard from "../_component/ProviderDashboard";

export default function ProviderPage() {
  const [status, setStatus] = useState<"loading" | "onboarding" | "dashboard">("loading");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetch("/api/provider/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.provider) {
          setUserName(data.provider.name);
          setStatus("dashboard");
        } else {
          fetch("/api/provider/clerk-info")
            .then((r) => r.json())
            .then((info) => {
              setUserName(info.name ?? "");
              setUserEmail(info.email ?? "");
              setStatus("onboarding");
            });
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
      defaultName={userName}
      defaultEmail={userEmail}
      onComplete={() => setStatus("dashboard")}
    />
  );

  return <ProviderDashboard userName={userName} />;
}
