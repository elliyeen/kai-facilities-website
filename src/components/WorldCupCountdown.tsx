"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function WorldCupCountdown() {
  const [daysUntil, setDaysUntil] = useState<number>(0);

  useEffect(() => {
    const worldCupStart = new Date('2026-06-11');
    const now = new Date();
    const diffTime = worldCupStart.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUntil(diffDays);
  }, []);

  return (
    <section className="py-32 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="text-9xl font-light mb-4">
              {daysUntil > 0 ? daysUntil : '---'}
            </div>
            <div className="text-2xl font-light text-white/60 mb-12">
              Days until FIFA World Cup 2026
            </div>
            <div className="h-px bg-white/10 mb-8"></div>
            <p className="text-xl font-light text-white/80 leading-relaxed">
              June 11 – July 19, 2026<br />
              9 matches at AT&T Stadium, Arlington<br />
              100,000+ daily visitors to Dallas transit
            </p>
          </div>
          <div>
            <p className="text-3xl font-light mb-8 leading-relaxed">
              Is DART prepared for the largest surge in transit demand in history?
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
