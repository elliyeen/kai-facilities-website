"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const worldCupStart = new Date("2026-06-11T00:00:00");
  const now = new Date();
  const diff = worldCupStart.getTime() - now.getTime();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function WorldCupCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const units = [
    { value: String(timeLeft.days), label: "DAYS" },
    { value: pad(timeLeft.hours), label: "HRS" },
    { value: pad(timeLeft.minutes), label: "MIN" },
    { value: pad(timeLeft.seconds), label: "SEC" },
  ];

  return (
    <section className="py-24 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Countdown */}
          <div>
            <p className="text-xs font-light tracking-[0.3em] text-white/30 mb-10 uppercase">Time Remaining</p>
            <div className="flex items-end gap-4 lg:gap-6 mb-8">
              {units.map((unit, i) => (
                <div key={unit.label} className="flex items-end gap-4 lg:gap-6">
                  {i > 0 && (
                    <div className="text-3xl lg:text-4xl font-light text-white/20 pb-6">:</div>
                  )}
                  <div>
                    <div className="text-5xl lg:text-6xl xl:text-7xl font-light tabular-nums leading-none">
                      {unit.value}
                    </div>
                    <div className="text-xs font-light text-white/40 mt-3 tracking-[0.25em]">{unit.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm font-light text-white/40 mb-10">Until FIFA World Cup 2026 · June 11, 2026</p>
            <div className="h-px bg-white/10 mb-8"></div>
            <p className="text-sm font-light text-white/40 leading-relaxed">
              June 11 – July 19, 2026 &nbsp;·&nbsp; 48 teams &nbsp;·&nbsp; 16 cities &nbsp;·&nbsp; 104 matches<br />
              USA, Mexico &amp; Canada &nbsp;·&nbsp; Final: MetLife Stadium, NJ
            </p>
          </div>

          {/* Right column */}
          <div className="lg:pl-8 lg:border-l lg:border-white/10">
            <p className="text-xs font-light tracking-[0.3em] text-white/30 mb-8 uppercase">Dallas · AT&T Stadium</p>
            <p className="text-2xl lg:text-3xl font-light leading-relaxed mb-4">
              9 matches at AT&T Stadium, Arlington —
            </p>
            <p className="text-2xl lg:text-3xl font-light leading-relaxed text-white/50 mb-12">
              is DART prepared for the largest surge in transit demand in history?
            </p>
            <Link
              href="/world-cup-2026"
              className="inline-block border border-white px-8 py-4 text-sm font-light tracking-wide hover:bg-white hover:text-black transition"
            >
              VIEW READINESS PLAN
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
