"use client";

import { useEffect, useState } from "react";

function getTimeLeft() {
  const diff = new Date("2026-06-11T00:00:00").getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function HeroCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setT(getTimeLeft());
    const id = setInterval(() => setT(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const units = [
    { value: String(t.days), label: "DAYS" },
    { value: pad(t.hours), label: "HRS" },
    { value: pad(t.minutes), label: "MIN" },
    { value: pad(t.seconds), label: "SEC" },
  ];

  return (
    <div className="flex items-end gap-4 lg:gap-8">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-end gap-4 lg:gap-8">
          {i > 0 && (
            <div className="text-3xl lg:text-5xl font-light text-white/20 pb-7">:</div>
          )}
          <div>
            <div className="text-5xl sm:text-6xl lg:text-7xl font-light tabular-nums leading-none">
              {unit.value}
            </div>
            <div className="text-xs font-light text-white/40 mt-3 tracking-[0.25em]">{unit.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
