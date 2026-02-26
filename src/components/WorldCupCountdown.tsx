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

  return (
    <section className="py-32 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            {/* Live countdown */}
            <div className="flex items-end gap-6 mb-4">
              <div className="text-center">
                <div className="text-8xl font-light tabular-nums">{timeLeft.days}</div>
                <div className="text-xs font-light text-white/40 mt-1 tracking-widest">DAYS</div>
              </div>
              <div className="text-6xl font-light text-white/30 mb-3">:</div>
              <div className="text-center">
                <div className="text-8xl font-light tabular-nums">{pad(timeLeft.hours)}</div>
                <div className="text-xs font-light text-white/40 mt-1 tracking-widest">HRS</div>
              </div>
              <div className="text-6xl font-light text-white/30 mb-3">:</div>
              <div className="text-center">
                <div className="text-8xl font-light tabular-nums">{pad(timeLeft.minutes)}</div>
                <div className="text-xs font-light text-white/40 mt-1 tracking-widest">MIN</div>
              </div>
              <div className="text-6xl font-light text-white/30 mb-3">:</div>
              <div className="text-center">
                <div className="text-8xl font-light tabular-nums">{pad(timeLeft.seconds)}</div>
                <div className="text-xs font-light text-white/40 mt-1 tracking-widest">SEC</div>
              </div>
            </div>

            <div className="text-xl font-light text-white/60 mb-12">
              Until FIFA World Cup 2026 kicks off
            </div>
            <div className="h-px bg-white/10 mb-8"></div>
            <p className="text-lg font-light text-white/80 leading-relaxed">
              June 11 – July 19, 2026<br />
              48 teams · 16 cities · 104 matches<br />
              Hosted by USA, Mexico &amp; Canada<br />
              Opening: Estadio Azteca, Mexico City<br />
              Final: MetLife Stadium, New Jersey
            </p>
          </div>
          <div>
            <p className="text-3xl font-light mb-8 leading-relaxed">
              9 matches at AT&T Stadium, Arlington — is DART prepared for the largest surge in transit demand in history?
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
